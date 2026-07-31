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
  "Build and run a Bright Data scraper for amazon.com that extracts title, price and rating";

export default function AgentGetStarted() {
  return (
    <div className="agent-start-grid">
      {/* LEFT: heading + steps */}
      <div className="agent-left">
        <span className="kicker">For coding agents</span>
        <h2>Your AI agent can use these scrapers</h2>
        <p>
          MCP server, CLI, or REST API. Works inside Claude Code, Cursor, and Codex.
          Describe the data you want — or just point it at a scraper from this library.
        </p>

        <div className="steps-list">
          <div className="step-row">
            <span className="n">01</span>
            <span>Run with <code style={{ color: "var(--accent-2)" }}>npx</code> — nothing to install</span>
          </div>
          <div className="step-row">
            <span className="n">02</span>
            <span><code style={{ color: "var(--accent-2)" }}>bdata login</code> — browser auth, no key to paste</span>
          </div>
          <div className="step-row">
            <span className="n">03</span>
            <span>Describe data or pass a scraper ID, get JSON back</span>
          </div>
        </div>
      </div>

      {/* RIGHT: terminal card */}
      <div className="term">
        <div className="term-head">Terminal</div>
        <div className="term-body">
          <p className="term-label">Tell your agent:</p>
          <CopyCmd text={AGENT_PROMPT} />

          <p className="term-label mt">Or run directly:</p>
          <CopyCmd text="npx -p @brightdata/cli bdata login" />
          <CopyCmd text={`bdata scraper create <URL> "<fields you want>"`} />
          <CopyCmd text="bdata scraper run <COLLECTOR_ID> <URL> --pretty" />
        </div>
        <div className="works">
          <span className="works-label">Works with:</span>
          <span className="agent-chip">✳ Claude Code</span>
          <span className="agent-chip">▟ Cursor</span>
          <span className="agent-chip">⌘ Codex</span>
          <span className="agent-chip">◈ MCP</span>
        </div>
      </div>
    </div>
  );
}
