#!/usr/bin/env node
/**
 * Daily flow validator for the Web Scraper product pages.
 *
 * Validates, against a live deployment, that every page renders and that
 * every command, prompt, and endpoint we show a user actually works:
 *
 *   1. Every sitemap route returns 200 and renders without a Next.js error.
 *   2. No page references skills.md (canonical file is /SKILL.md, singular).
 *   3. https://brightdata.com/SKILL.md is live.
 *   4. The CLI install path shown on the pages works on a clean machine:
 *      `npx -y -p @brightdata/cli bdata --version` exits 0.
 *   5. Every `bdata <subcommand>` mentioned on any page exists in the CLI.
 *   6. REST endpoints referenced in snippets are alive (401/400 without
 *      auth counts as alive; only network errors and 5xx fail).
 *   7. The hosted MCP endpoint resolves and responds.
 *   8. External docs links (docs.brightdata.com, github.com/brightdata)
 *      are not 404.
 *
 * Usage:
 *   node scripts/validate-flows.mjs                  # test production deploy
 *   BASE_URL=https://preview-url node scripts/validate-flows.mjs
 *   SKIP_CLI=1 node scripts/validate-flows.mjs       # skip npx execution
 *
 * Exit code 0 = all green. 1 = at least one failure (fails the CI job).
 * Writes validation-report.md next to the repo root.
 */

import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const BASE_URL = (process.env.BASE_URL ?? "https://bd-scraper-product.vercel.app").replace(/\/$/, "");
const SKILL_URL = "https://brightdata.com/SKILL.md";
const REST_SCRAPE = "https://api.brightdata.com/datasets/v3/scrape";
const MCP_URL = "https://mcp.brightdata.com/mcp";
const FETCH_TIMEOUT_MS = 20_000;
const LINK_CHECK_LIMIT = 60;
// Domains that block bots or need auth; checking them produces noise, not signal.
const SKIP_LINK_HOSTS = ["linkedin.com", "x.com", "twitter.com", "instagram.com", "facebook.com", "amazon.com"];

const results = []; // { group, name, ok, note }
const add = (group, name, ok, note = "") => {
  results.push({ group, name, ok, note });
  console.log(`${ok ? "PASS" : "FAIL"}  [${group}] ${name}${note ? ` — ${note}` : ""}`);
};

async function get(url, opts = {}) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { redirect: "follow", signal: ctl.signal, ...opts });
  } finally {
    clearTimeout(t);
  }
}

function decodeEntities(html) {
  return html
    .replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

async function pool(items, worker, size = 8) {
  const queue = [...items.entries()];
  const out = new Array(items.length);
  await Promise.all(Array.from({ length: Math.min(size, queue.length) }, async () => {
    while (queue.length) {
      const [i, item] = queue.shift();
      out[i] = await worker(item);
    }
  }));
  return out;
}

// ---------- 1. Route inventory from the live sitemap ----------
let routes = [];
try {
  const xml = await (await get(`${BASE_URL}/sitemap.xml`)).text();
  routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    .filter((p, i, a) => a.indexOf(p) === i);
  add("pages", "sitemap.xml reachable", routes.length > 0, `${routes.length} routes`);
} catch (e) {
  add("pages", "sitemap.xml reachable", false, String(e));
}

// ---------- 2. Fetch every page, collect text ----------
const pageTexts = new Map(); // path -> visible text (entities decoded, tags stripped)
const pageHtml = new Map(); // path -> raw HTML (for href extraction)
await pool(routes, async (path) => {
  try {
    const res = await get(`${BASE_URL}${path}`);
    const html = await res.text();
    const broken = /Application error|__next_error__|Internal Server Error/.test(html);
    add("pages", path, res.ok && !broken, res.ok ? (broken ? "renders an error page" : "") : `HTTP ${res.status}`);
    if (res.ok) {
      pageHtml.set(path, html);
      pageTexts.set(path, decodeEntities(html.replace(/<br\s*\/?>/g, "\n").replace(/<\/(p|div|pre|li|h\d)>/g, "\n").replace(/<[^>]+>/g, "")));
    }
  } catch (e) {
    add("pages", path, false, String(e.cause?.code ?? e));
  }
});

// ---------- 3. No skills.md anywhere; SKILL.md is live ----------
const skillsOffenders = [...pageTexts].filter(([, t]) => /skills\.md/i.test(t) && !/SKILL\.md/.test(t.match(/skills\.md/i)?.[0] ?? ""))
  .concat([...pageTexts].filter(([, t]) => t.includes("skills.md")))
  .map(([p]) => p).filter((p, i, a) => a.indexOf(p) === i);
add("content", "no page references skills.md (must be SKILL.md)", skillsOffenders.length === 0,
  skillsOffenders.length ? `offenders: ${skillsOffenders.join(", ")}` : "");
try {
  const res = await get(SKILL_URL);
  add("content", "SKILL.md is live", res.ok, `HTTP ${res.status}`);
} catch (e) {
  add("content", "SKILL.md is live", false, String(e));
}

// ---------- 4+5. CLI: the exact install path shown to users ----------
const allText = [...pageTexts.values()].join("\n");
const subcommands = [...new Set([...allText.matchAll(/\b(?:bdata|brightdata)\s+([a-z][a-z-]+)/g)].map((m) => m[1]))]
  .filter((s) => !["is", "and", "or", "the", "cli", "api"].includes(s));

if (process.env.SKIP_CLI) {
  add("cli", "npx install path (skipped: SKIP_CLI=1)", true);
} else {
  let help = "";
  try {
    execSync("npx -y -p @brightdata/cli bdata --version", { stdio: "pipe", timeout: 120_000 });
    add("cli", "npx -y -p @brightdata/cli bdata --version runs", true);
    help = execSync("npx -y -p @brightdata/cli bdata --help", { stdio: "pipe", timeout: 120_000 }).toString();
  } catch (e) {
    add("cli", "npx -y -p @brightdata/cli bdata --version runs", false, (e.stderr?.toString() ?? String(e)).slice(0, 200));
  }
  if (help) {
    for (const sub of subcommands) {
      add("cli", `subcommand "${sub}" exists in bdata --help`, help.includes(sub), help.includes(sub) ? "" : "shown on pages but not in CLI help");
    }
  }
}

// ---------- 6. REST endpoint alive (401/400 without auth = alive) ----------
try {
  const res = await get(`${REST_SCRAPE}?dataset_id=validator_ping&format=json`, { method: "POST", body: "[]", headers: { "Content-Type": "application/json" } });
  add("endpoints", "datasets/v3/scrape endpoint alive", res.status < 500, `HTTP ${res.status} (auth error expected)`);
} catch (e) {
  add("endpoints", "datasets/v3/scrape endpoint alive", false, String(e.cause?.code ?? e));
}

// ---------- 7. Hosted MCP endpoint resolves ----------
try {
  const res = await get(MCP_URL);
  add("endpoints", "mcp.brightdata.com/mcp resolves", res.status < 500, `HTTP ${res.status}`);
} catch (e) {
  add("endpoints", "mcp.brightdata.com/mcp resolves", false, String(e.cause?.code ?? e));
}

// ---------- 7b. Optional live E2E scrape (needs BRIGHTDATA_API_KEY) ----------
// Runs ONE real sync scrape per run using the exact dataset_id and example URL
// found on the live pages, so we test what users are told to run. Costs one
// billable request per run. Set the key as a GitHub Actions secret; never
// commit it.
const apiKey = process.env.BRIGHTDATA_API_KEY;
if (apiKey) {
  const datasetId = allText.match(/dataset_id=([a-z0-9_]+)/)?.[1];
  const exampleUrl = allText.match(/https:\/\/www\.amazon\.com\/dp\/[A-Z0-9]{10}/)?.[0];
  if (!datasetId || !exampleUrl) {
    add("e2e", "live scrape (dataset_id + example URL found on pages)", false, `datasetId=${datasetId}, url=${exampleUrl}`);
  } else {
    try {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), 150_000);
      const res = await fetch(`${REST_SCRAPE}?dataset_id=${datasetId}&format=json&include_errors=true`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify([{ url: exampleUrl }]),
        signal: ctl.signal,
      });
      clearTimeout(t);
      const body = await res.text();
      let hasData = false;
      try {
        const json = JSON.parse(body);
        const row = Array.isArray(json) ? json[0] : json;
        hasData = !!row && (row.title || row.url || row.asin || Object.keys(row).length > 3);
      } catch { /* non-JSON body: fail below */ }
      add("e2e", `live sync scrape (${datasetId})`, res.ok && hasData,
        res.ok ? (hasData ? exampleUrl : "200 but empty/unparseable body") : `HTTP ${res.status}: ${body.slice(0, 120)}`);
    } catch (e) {
      add("e2e", `live sync scrape (${datasetId})`, false, String(e.cause?.code ?? e));
    }
  }
} else {
  console.log("SKIP  [e2e] live scrape (set BRIGHTDATA_API_KEY to enable)");
}

// ---------- 8. External docs/github links are not 404 ----------
const allHtml = [...pageHtml.values()].join("\n");
const links = [...new Set([...allHtml.matchAll(/https:\/\/(?:docs\.brightdata\.com|github\.com\/brightdata)[^\s"')<\\&]*/g)].map((m) => m[0].replace(/[.,)/]+$/, "")))]
  .filter((u) => !SKIP_LINK_HOSTS.some((h) => u.includes(h)))
  .slice(0, LINK_CHECK_LIMIT);
await pool(links, async (url) => {
  try {
    const res = await get(url);
    add("links", url, res.status !== 404, `HTTP ${res.status}`);
  } catch (e) {
    add("links", url, false, String(e.cause?.code ?? e));
  }
});

// ---------- Report ----------
const failed = results.filter((r) => !r.ok);
const stamp = new Date().toISOString();
const md = [
  `# Flow validation report`,
  ``,
  `- Target: ${BASE_URL}`,
  `- Run: ${stamp}`,
  `- Result: ${failed.length === 0 ? "ALL GREEN" : `${failed.length} FAILURE(S)`} (${results.length} checks)`,
  ``,
  ...(failed.length ? ["## Failures", "", ...failed.map((r) => `- [${r.group}] ${r.name}${r.note ? ` — ${r.note}` : ""}`), ""] : []),
  `## All checks`,
  ``,
  `| Group | Check | Result | Note |`,
  `|---|---|---|---|`,
  ...results.map((r) => `| ${r.group} | ${r.name.replace(/\|/g, "\\|")} | ${r.ok ? "pass" : "FAIL"} | ${r.note.replace(/\|/g, "\\|")} |`),
].join("\n");
writeFileSync("validation-report.md", md);

console.log(`\n${failed.length === 0 ? "ALL GREEN" : `${failed.length} FAILURE(S)`} — ${results.length} checks, report in validation-report.md`);
process.exit(failed.length === 0 ? 0 : 1);
