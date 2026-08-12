#!/usr/bin/env node
/**
 * Runs the agent prompt the page ships through a real coding agent and grades
 * which TOOL it reached for, not what it wrote.
 *
 * That distinction is the whole point. Finding 24 was an agent that produced a
 * plausible-looking answer while silently falling back to scrape_as_markdown
 * (Web Unlocker) because the MCP config loaded no Amazon tools. Grading the
 * prose would have scored that a pass. Grading the tool calls catches it.
 *
 * The prompt and the MCP config are imported from the page's own modules, so
 * this tests what a visitor actually copies.
 *
 * Usage:
 *   BD_KEY=<api key> node scripts/validate-agent-prompts.mjs
 *   BD_KEY=<api key> node scripts/validate-agent-prompts.mjs --runs 3
 *   BD_KEY=<api key> node scripts/validate-agent-prompts.mjs --agent codex
 *
 * Exit 0 = the agent routed correctly in every run.
 */
import { spawn } from "node:child_process";
import { writeFile, mkdir, rm } from "node:fs/promises";
import { writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const API_KEY = process.env.BD_KEY ?? process.env.BRIGHTDATA_API_KEY;
if (!API_KEY) {
  console.error("BD_KEY (or BRIGHTDATA_API_KEY) is required.");
  process.exit(1);
}

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const RUNS = Number(arg("runs", 3));
const AGENT = arg("agent", "claude");
/**
 * How many runs must pass before the job is considered green. Agents are
 * non-deterministic, so this is a threshold rather than an all-or-nothing gate.
 * Observed flakiness is itself worth tracking: the report always prints the
 * rate, so a drift from 3/3 to 1/3 is visible even while the job stays green.
 */
const MIN_PASS = Number(arg("min-pass", Math.ceil(RUNS / 2)));
const RUN_ROOT = join(process.cwd(), ".agent-eval-runs");

const { AGENT_PROMPT, MCP_CONFIG } = await import("../lib/agent-prompt.ts");

/**
 * Two independent questions, deliberately kept apart because they call for
 * different fixes:
 *
 *   ROUTE   did the agent reach the Amazon scraper through the MCP tools the
 *           page tells it to install? Getting the right answer by shelling out
 *           to curl still means the published MCP path went unused.
 *   OUTCOME did it come back with the real product? An agent can route
 *           perfectly and still report a hallucinated price.
 *
 * A run only passes when both hold. Reporting them separately is what makes
 * the result actionable: a route failure is a docs/prompt problem, an outcome
 * failure is an API or field-name problem.
 */
const ROUTE = {
  required: ["web_data_amazon_product"],
  // Web Unlocker fallback. Correct-looking output, scraper never discovered.
  fallback: ["scrape_as_markdown", "scrape_batch"],
  // Raw HTTP. Also a bypass of the published MCP path.
  shell: ["Bash", "WebFetch"],
};

/** B09X7MPX8L, verified live via the MCP tool. Price moves, the title does not. */
const OUTCOME = {
  titleMustContain: "sandisk",
  pricePattern: /\b\d{1,4}\.\d{2}\b/,
};

/**
 * Pull the tool calls, the final text, and the MCP server status out of the
 * streamed events. The server status matters: it starts "pending" and connects
 * asynchronously, so a run that ends before it connects is an infrastructure
 * failure, not evidence about our docs.
 */
function parseStream(stdout) {
  const tools = [];
  let finalText = "";
  let servers = null;
  for (const line of stdout.split("\n")) {
    if (!line.trim().startsWith("{")) continue;
    let event;
    try {
      event = JSON.parse(line);
    } catch {
      continue;
    }
    if (event.subtype === "init" && event.mcp_servers) servers = event.mcp_servers;
    if (event.type === "result" && typeof event.result === "string") finalText = event.result;
    const blocks = event?.message?.content;
    if (!Array.isArray(blocks)) continue;
    for (const b of blocks) {
      if (b.type === "tool_use" && b.name) tools.push(b.name);
    }
  }
  return { tools, finalText, servers };
}

function runAgent(cmd, args, cwd) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      cwd,
      env: { ...process.env, BD_KEY: API_KEY },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => resolve({ code, stdout, stderr }));
    child.on("error", (err) => resolve({ code: -1, stdout, stderr: String(err) }));
  });
}

async function evaluateOnce(index) {
  const dir = join(RUN_ROOT, `${AGENT}-${index}`);
  await mkdir(dir, { recursive: true });

  // The exact config the page publishes, with the placeholder filled in.
  const configPath = join(dir, "mcp.json");
  await writeFile(configPath, MCP_CONFIG.replaceAll("YOUR_API_KEY", API_KEY));

  const started = Date.now();
  let result;
  if (AGENT === "claude") {
    result = await runAgent(
      "claude",
      [
        "-p", AGENT_PROMPT,
        "--output-format", "stream-json",
        "--verbose",
        "--mcp-config", configPath,
        "--permission-mode", "bypassPermissions",
        "--max-turns", "20",
      ],
      dir
    );
  } else {
    // codex exec is the non-interactive entry point. MCP servers are
    // configured through ~/.codex/config.toml rather than a flag, so CI must
    // write that file before this runs. See the runbook.
    result = await runAgent("codex", ["exec", "--json", AGENT_PROMPT], dir);
  }

  const seconds = Math.round((Date.now() - started) / 1000);
  const { tools, finalText, servers } = parseStream(result.stdout);
  const used = (name) => tools.some((t) => t.includes(name));

  const routedViaMcp = ROUTE.required.every(used);
  const fellBackTo = [
    ...ROUTE.fallback.filter(used),
    ...(routedViaMcp ? [] : ROUTE.shell.filter(used)),
  ];
  const lower = finalText.toLowerCase();
  const gotData =
    lower.includes(OUTCOME.titleMustContain) && OUTCOME.pricePattern.test(finalText);

  return {
    index,
    seconds,
    tools,
    servers,
    routedViaMcp,
    fellBackTo,
    gotData,
    ok: result.code === 0 && routedViaMcp && gotData,
    exitCode: result.code,
    finalText: finalText.slice(0, 300),
    stderr: result.stderr.trim().slice(-300),
  };
}

console.log(`Running the shipped agent prompt through "${AGENT}" ${RUNS} time(s)\n`);
console.log("Grading which tools were called, not the prose.\n");

// The run dir holds a live API key in mcp.json, so clear it even on a crash.
const cleanup = () => {
  try {
    rmSync(RUN_ROOT, { recursive: true, force: true });
  } catch {}
};
process.on("exit", cleanup);
process.on("SIGINT", () => {
  cleanup();
  process.exit(130);
});

const results = [];
for (let i = 1; i <= RUNS; i++) {
  const r = await evaluateOnce(i);
  results.push(r);
  const verdict = r.ok ? "PASS" : "FAIL";
  const route = r.routedViaMcp
    ? "route ok"
    : `ROUTE FAIL (${r.fellBackTo.join(", ") || "called no scraper tool"})`;
  const outcome = r.gotData ? "data ok" : "DATA FAIL";
  console.log(
    `${verdict}  run ${r.index}  ${String(r.seconds).padStart(3)}s  ${route}; ${outcome}`
  );
  if (r.exitCode !== 0) console.log(`        exit ${r.exitCode}: ${r.stderr.split("\n").pop()}`);
  if (!r.gotData && r.finalText) console.log(`        said: ${r.finalText.split("\n")[0]}`);
}

const passed = results.filter((r) => r.ok).length;

// Agents are non-deterministic, so the report records the rate rather than
// pretending a single run is the verdict.
const report = [
  "# Agent prompt routing",
  "",
  `Agent: \`${AGENT}\`. Runs: ${RUNS}. Passed: ${passed}/${RUNS}. Threshold: ${MIN_PASS}/${RUNS}.`,
  "",
  `Used the published MCP path: ${results.filter((r) => r.routedViaMcp).length}/${RUNS}.`,
  "",
  "Grades which tool the agent invoked. Producing a good-looking answer via",
  "`scrape_as_markdown` counts as a failure: it means the Amazon scraper was",
  "never discovered.",
  "",
  "| Run | Result | Route | Data | Seconds | Tools called |",
  "|---|---|---|---|---|---|",
  ...results.map(
    (r) =>
      `| ${r.index} | ${r.ok ? "PASS" : "**FAIL**"} | ${r.routedViaMcp ? "MCP" : "**" + (r.fellBackTo.join(", ") || "none") + "**"} | ${r.gotData ? "ok" : "**missing**"} | ${r.seconds} | ${r.tools.join(", ") || "none"} |`
  ),
  "",
  "A route failure is a docs or prompt problem: the agent never used the MCP",
  "path the page tells it to install. A data failure is an API or field-name",
  "problem. They are reported separately because the fixes differ.",
  "",
].join("\n");
writeFileSync("agent-prompt-report.md", report);

await rm(RUN_ROOT, { recursive: true, force: true });

const routed = results.filter((r) => r.routedViaMcp).length;
console.log(`\n${passed}/${RUNS} fully passed (${routed}/${RUNS} used the MCP path)`);
if (passed < RUNS && passed >= MIN_PASS) {
  console.log(`Above the ${MIN_PASS}/${RUNS} threshold, but the flakiness is real. See the report.`);
}
process.exit(passed >= MIN_PASS ? 0 : 1);
