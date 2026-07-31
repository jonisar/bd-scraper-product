"use client";

import { useState } from "react";

/**
 * Copy-pasteable Scraper Studio agent prompts.
 * Source: docs.brightdata.com/datasets/scraper-studio/coding-agent-prompts
 */
const BUILD_AND_RUN = `Build and run a Bright Data scraper. Run every Bright Data CLI command through \`npx -p @brightdata/cli\` so nothing is installed globally. Replace <TARGET_URL> and <FIELDS TO EXTRACT>, then do each step in order and stop if a step fails:

1. Authenticate by running \`npx -p @brightdata/cli bdata login\`. npx fetches the CLI on demand, so there is nothing to install.
2. Create a Bright Data scraper for <TARGET_URL> that extracts: <FIELDS TO EXTRACT>. Report the Collector ID.
3. Run that scraper on the same URL and pretty-print the result.`;

const PROMPTS = [
  {
    title: "Build and run",
    sub: "One prompt. Swap in a URL and the fields you want.",
    result: "The agent reports a Collector ID like c_mpohus372o5tmid1jk, then prints a JSON row with your fields.",
    text: BUILD_AND_RUN,
  },
];

function PromptCard({
  title,
  sub,
  result,
  text,
}: {
  title: string;
  sub: string;
  result: string;
  text: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="prompt-card">
      <div className="prompt-head">
        <div>
          <h3>{title}</h3>
          <p className="panel-sub" style={{ margin: "4px 0 0" }}>{sub}</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={copy}>
          {copied ? "Copied ✓" : "Copy prompt"}
        </button>
      </div>
      <div className="code-block solo prompt-body">
        <pre><code>{text}</code></pre>
      </div>
      <p className="prompt-result">
        <b>Expected:</b> {result}
      </p>
    </div>
  );
}

export default function StudioAgentPrompts() {
  return (
    <div>
      <div className="section-head" style={{ textAlign: "left", maxWidth: "none", marginBottom: "var(--s6)" }}>
        <h2>No template yet? Build one with your agent</h2>
        <p style={{ margin: "var(--s3) 0 0" }}>
          Scraper Studio turns a prompt into a working scraper. Paste this into Claude Code,
          Cursor or Codex, swap the placeholders, and let it build and run the scraper for you.
        </p>
      </div>

      <div className="prompt-grid">
        {PROMPTS.map((p) => (
          <PromptCard key={p.title} {...p} />
        ))}
      </div>

      <p className="prompt-foot">
        Full guide in the{" "}
        <a
          href="https://docs.brightdata.com/datasets/scraper-studio/coding-agent-prompts"
          target="_blank"
          rel="noopener noreferrer"
          className="value-link"
        >
          Scraper Studio agent prompts docs ↗
        </a>
      </p>
    </div>
  );
}
