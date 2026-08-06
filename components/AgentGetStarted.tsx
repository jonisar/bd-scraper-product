"use client";

import { useState } from "react";

function CopyCmd({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className="cmd">
      <code>{label ?? text}</code>
      <button onClick={copy} aria-label="Copy to clipboard" title="Copy">
        {copied ? "✓" : "⧉"}
      </button>
    </div>
  );
}

const AGENT_PROMPT =
  "Read https://brightdata.com/skills.md and scrape this Amazon product: https://www.amazon.com/dp/B09X7MPX8L";

export default function AgentGetStarted() {
  return (
    <div className="agent-start-grid">
      {/* LEFT: heading + steps */}
      <div className="agent-left">
        <span className="kicker">For coding agents</span>
        <h2>Plug the scraper library into your agent</h2>
        <p>
          Paste one prompt. Your agent signs in with browser OAuth, picks the right
          scraper and returns clean JSON. Works in Claude Code, Cursor and Codex via
          MCP, CLI or REST API.
        </p>

        <div className="steps-list">
          <div className="step-row">
            <span className="n">01</span>
            <span>Runs with <code style={{ color: "var(--accent-2)" }}>npx</code>, nothing to install</span>
          </div>
          <div className="step-row">
            <span className="n">02</span>
            <span><code style={{ color: "var(--accent-2)" }}>bdata login</code> opens browser auth, no key to paste</span>
          </div>
          <div className="step-row">
            <span className="n">03</span>
            <span>Name a scraper, get JSON back</span>
          </div>
        </div>
      </div>

      {/* RIGHT: terminal card */}
      <div className="term">
        <div className="term-head">Terminal</div>
        <div className="term-body">
          <p className="term-label">Tell your agent:</p>
          <CopyCmd text={AGENT_PROMPT} />

          <p className="term-label mt">Or run it yourself:</p>
          <CopyCmd text="npx -p @brightdata/cli bdata login" />
          <CopyCmd text={'bdata pipelines amazon_product "https://www.amazon.com/dp/B09X7MPX8L"'} />

          <p className="term-label mt">Or connect over MCP:</p>
          <CopyCmd text="https://mcp.brightdata.com/mcp?token=YOUR_API_TOKEN" />
          <p className="term-note">
            <a
              href="https://brightdata.com/cp/mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="value-link"
            >
              Get your token-filled URL in the control panel ↗
            </a>
          </p>
        </div>
        <div className="works">
          <span className="works-label">Works with:</span>
          <span className="agent-chip">✳ Claude Code</span>
          <span className="agent-chip">▟ Cursor</span>
          <span className="agent-chip">⌘ Codex</span>
          <span className="agent-chip">◈ Any MCP client</span>
        </div>
      </div>
    </div>
  );
}
