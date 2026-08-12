#!/usr/bin/env node
/**
 * Executes every API example shown on the Amazon Product Scraper page against
 * the live Bright Data API: cURL, Python, and Node.js, each in sync and async
 * mode. Python and Node.js run through the official SDKs.
 *
 * The snippets are imported from lib/api-snippets.ts — the same module the page
 * renders — so this tests the exact strings a user copies, not a fixture that
 * can drift.
 *
 * The only substitution is the API key placeholder. The one exception is the
 * cURL async example, whose step 2 ships a placeholder snapshot id: the runner
 * captures the real id from step 1 and polls with it, which is what a user
 * following the snippet does by hand.
 *
 * Usage:
 *   BD_KEY=<api key> node scripts/validate-api-examples.mjs
 *   BD_KEY=<api key> node scripts/validate-api-examples.mjs --only python-sync
 *
 * Exit code 0 = all green, 1 = at least one example is broken.
 * Writes api-examples-report.md at the repo root.
 */
import { execFile } from "node:child_process";
import { mkdtemp, writeFile, rm, mkdir } from "node:fs/promises";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const API_KEY = process.env.BD_KEY ?? process.env.BRIGHTDATA_API_KEY;
if (!API_KEY) {
  console.error("BD_KEY (or BRIGHTDATA_API_KEY) is required.");
  process.exit(1);
}

/**
 * Snippets run inside the repo so Node's ESM resolver finds @brightdata/sdk in
 * the repo's node_modules. A system temp dir has no node_modules above it.
 */
const RUN_ROOT = join(process.cwd(), ".api-example-runs");

const PER_EXAMPLE_TIMEOUT_MS = Number(process.env.EXAMPLE_TIMEOUT_MS ?? 8 * 60_000);
const onlyIndex = process.argv.indexOf("--only");
const only = onlyIndex > -1 ? process.argv[onlyIndex + 1] : null;

// Import the snippets straight from the page's own module.
const { API_EXAMPLES } = await import("../lib/api-snippets.ts");

/** Swap the documented placeholder for an env-var read. Never inline the key. */
function injectKey(code, language) {
  switch (language) {
    case "bash":
      // Inside the snippet's double-quoted header, $BD_KEY expands at runtime.
      return code.replaceAll("YOUR_API_KEY", () => "$BD_KEY");
    case "python":
      return `import os\n${code.replaceAll('"YOUR_API_KEY"', 'os.environ["BD_KEY"]')}`;
    case "node":
      return code.replaceAll('"YOUR_API_KEY"', "process.env.BD_KEY");
    default:
      throw new Error(`unknown language: ${language}`);
  }
}

const RUNNER = {
  bash: { file: "snippet.sh", cmd: (p) => ["bash", [p]] },
  python: { file: "snippet.py", cmd: (p) => ["python3", [p]] },
  node: { file: "snippet.mjs", cmd: (p) => ["node", [p]] },
};

/**
 * Assertions per example. Exit 0 alone is not enough — a snippet that prints
 * "undefined undefined" exits 0 too. Each check asserts the snippet produced
 * the data it claims to.
 */
const ASSERTIONS = {
  "curl-sync": async (out) => {
    const json = parseApiJson(out, "the sync response");
    if (Array.isArray(json)) {
      if (!json[0]?.title) throw new Error("array returned without a title field");
      return `returned ${json.length} record(s): ${String(json[0].title).slice(0, 45)}`;
    }
    /**
     * Past ~60s the sync endpoint returns an envelope instead of records, which
     * the page documents. The envelope is not the result: a snapshot can go
     * "ready" with records:0 and a crawl_error. Follow it to the real outcome,
     * which is what a user reading that message does.
     */
    if (!json.snapshot_id) throw new Error(`unrecognized response shape: ${out.slice(0, 120)}`);
    const { progress, records } = await followSnapshot(json.snapshot_id);
    assertSnapshotProduced(progress, records);
    return `envelope ${json.snapshot_id} → ${records.length} record(s): ${String(records[0].title).slice(0, 40)}`;
  },
  // runCurlAsync hands back the parsed three-step result, not raw stdout.
  "curl-async": ({ snapshotId, progress, records }) => {
    assertSnapshotProduced(progress, records);
    return `${snapshotId} → ${records.length} record(s): ${String(records[0].title).slice(0, 40)}`;
  },
  "python-sync": assertProductLine,
  "node-sync": assertProductLine,
  "python-async": assertAsyncProductLines,
  "node-async": assertAsyncProductLines,
};

/** A product line is "<title> <price>" — assert both halves are real. */
function assertProductLine(out) {
  const line = out.split("\n").map((l) => l.trim()).filter(Boolean).pop() ?? "";
  if (/undefined|None|^\s*$/.test(line)) throw new Error(`printed no data: "${line}"`);
  if (!/[\d.]+$/.test(line)) throw new Error(`no price at end of line: "${line}"`);
  return line.slice(0, 70);
}

function assertAsyncProductLines(out) {
  if (!/Snapshot:\s*sd_/.test(out)) throw new Error("never printed a snapshot id");
  const products = out
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("Snapshot:") && /[\d.]+$/.test(l));
  if (products.length === 0) throw new Error("polled but printed no products");
  if (products.some((l) => /undefined|None/.test(l))) {
    throw new Error(`product line has empty fields: "${products.find((l) => /undefined|None/.test(l))}"`);
  }
  return `${products.length} product(s), first: ${products[0].slice(0, 55)}`;
}

/**
 * The API answers auth and quota problems in plain text, not JSON. Parsing
 * those blind produces "Unexpected token 'I'", which is what would land in the
 * alert email. Surface what the API actually said instead.
 */
function parseApiJson(out, what) {
  const text = out.trim();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${what} was not JSON. The API returned: ${text.slice(0, 160)}`);
  }
}

/**
 * "ready" is not "succeeded". A snapshot reports ready with records:0,
 * errors:1 and error_codes:{crawl_error:1} when the scrape failed upstream,
 * and the download is then a 200 with an empty array. Anything asserting only
 * on status would call that a pass.
 */
function assertSnapshotProduced(progress, records) {
  if (progress?.status !== "ready") {
    throw new Error(`progress never reported ready: ${JSON.stringify(progress).slice(0, 160)}`);
  }
  if (progress.errors > 0 || progress.records === 0) {
    const codes = JSON.stringify(progress.error_codes ?? {});
    throw new Error(`snapshot ready but empty: records=${progress.records} errors=${progress.errors} error_codes=${codes}`);
  }
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error(`download returned no records (progress claimed ${progress.records})`);
  }
  if (!records[0]?.title) throw new Error("first record has no title field");
}

/** Poll progress to a terminal state, then download. Used by both cURL modes. */
async function followSnapshot(snapshotId) {
  const headers = { Authorization: `Bearer ${API_KEY}` };
  const deadline = Date.now() + PER_EXAMPLE_TIMEOUT_MS;
  let progress = null;
  while (Date.now() < deadline) {
    progress = await (await fetch(`https://api.brightdata.com/datasets/v3/progress/${snapshotId}`, { headers })).json();
    if (progress.status !== "running") break;
    await new Promise((r) => setTimeout(r, 5000));
  }
  const res = await fetch(`https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`, { headers });
  const records = res.status === 200 ? await res.json() : [];
  return { progress, records };
}

/**
 * cURL async is three steps and ships a placeholder snapshot id. Run the
 * trigger, substitute the real id, poll progress until ready, then download —
 * the manual flow the snippet describes.
 */
async function runCurlAsync(code, dir) {
  const sh = async (name, body, timeout = 60_000) => {
    const file = join(dir, name);
    await writeFile(file, injectKey(body, "bash"));
    const res = await execFileAsync("bash", [file], {
      env: { ...process.env, BD_KEY: API_KEY },
      timeout,
      maxBuffer: 32 * 1024 * 1024,
    });
    return res.stdout;
  };

  const [trigger, progressStep, downloadStep] = code.split(/# Step [23]:/);
  const triggerOut = await sh("trigger.sh", trigger, PER_EXAMPLE_TIMEOUT_MS);
  const snapshotId = triggerOut.match(/"snapshot_id"\s*:\s*"([^"]+)"/)?.[1];
  if (!snapshotId) throw new Error(`trigger returned no snapshot_id: ${triggerOut.slice(0, 200)}`);

  const withId = (part) => part.replaceAll("sd_abc123", snapshotId);

  const deadline = Date.now() + PER_EXAMPLE_TIMEOUT_MS;
  let progress = null;
  while (Date.now() < deadline) {
    const progressOut = await sh("progress.sh", withId(progressStep));
    progress = parseApiJson(progressOut, "step 2 (progress)");
    if (progress.status !== "running") break;
    await new Promise((r) => setTimeout(r, 5000));
  }

  const downloadOut = await sh("download.sh", withId(downloadStep), PER_EXAMPLE_TIMEOUT_MS);
  const records = parseApiJson(downloadOut, "step 3 (download)");
  return { snapshotId, progress, records };
}

async function runExample(example) {
  await mkdir(RUN_ROOT, { recursive: true });
  const dir = await mkdtemp(join(RUN_ROOT, `${example.id}-`));
  const started = Date.now();
  try {
    // curl-async yields a parsed {snapshotId, progress, records}; the rest yield stdout.
    let result;
    if (example.id === "curl-async") {
      result = await runCurlAsync(example.code, dir);
    } else {
      const runner = RUNNER[example.language];
      const file = join(dir, runner.file);
      await writeFile(file, injectKey(example.code, example.language));
      const [bin, args] = runner.cmd(file);
      const res = await execFileAsync(bin, args, {
        cwd: dir,
        env: { ...process.env, BD_KEY: API_KEY, NODE_PATH: process.env.NODE_PATH ?? "" },
        timeout: PER_EXAMPLE_TIMEOUT_MS,
        maxBuffer: 32 * 1024 * 1024,
      });
      result = res.stdout;
    }
    const detail = await ASSERTIONS[example.id](result);
    return { ...example, ok: true, detail, seconds: Math.round((Date.now() - started) / 1000) };
  } catch (err) {
    const detail = (err.stderr || err.message || String(err)).trim().split("\n").slice(-4).join(" | ");
    return { ...example, ok: false, detail: detail.slice(0, 400), seconds: Math.round((Date.now() - started) / 1000) };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

const selected = only ? API_EXAMPLES.filter((e) => e.id === only) : API_EXAMPLES;
if (selected.length === 0) {
  console.error(`No example matches --only ${only}`);
  process.exit(1);
}

console.log(`Executing ${selected.length} API example(s) against the live API\n`);
const results = await Promise.all(selected.map(runExample));

let failed = 0;
for (const r of results) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.id.padEnd(13)} ${String(r.seconds).padStart(3)}s  ${r.detail}`);
}

const report = [
  "# API examples validation",
  "",
  `Ran ${results.length} example(s) from the Amazon Product Scraper page against the live API.`,
  "",
  "| Example | Language | Mode | Result | Seconds | Detail |",
  "|---|---|---|---|---|---|",
  ...results.map(
    (r) =>
      `| ${r.id} | ${r.language} | ${r.mode} | ${r.ok ? "PASS" : "**FAIL**"} | ${r.seconds} | ${r.detail.replace(/\|/g, "\\|")} |`
  ),
  "",
  failed === 0 ? "All examples returned real data." : `${failed} example(s) are broken as shipped.`,
  "",
].join("\n");
writeFileSync("api-examples-report.md", report);

await rm(RUN_ROOT, { recursive: true, force: true });

console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed === 0 ? 0 : 1);
