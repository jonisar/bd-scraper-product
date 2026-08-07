"use client";

import { useState } from "react";

const AGENT_SKILL_PROMPT =
  "Read https://brightdata.com/skills.md and scrape this Amazon product: https://www.amazon.com/dp/B09X7MPX8L";

type AgentSetupCtaProps = {
  /** scraper = Tailwind on ScraperPage; hub = lib-page .btn styles */
  variant?: "scraper" | "hub";
  prompt?: string;
};

export default function AgentSetupCta({
  variant = "scraper",
  prompt = AGENT_SKILL_PROMPT,
}: AgentSetupCtaProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = prompt;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 4000);
  };

  if (variant === "hub") {
    return (
      <button
        type="button"
        onClick={copy}
        title={prompt}
        className="btn btn-ghost btn-pill"
      >
        {copied ? "Copied — paste into your agent" : "Try in your agent"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={prompt}
      className="inline-flex items-center gap-2 rounded-lg border border-bd-line bg-bd-canvas px-4 py-2.5 text-sm font-bold text-bd-ink transition hover:border-bd-blue-light hover:bg-bd-blue-soft"
    >
      {copied ? (
        <>
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
            <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
          </svg>
          Copied, paste into your agent
        </>
      ) : (
        <>
          Try in your agent
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
            <path d="M10.5 5.5v-2a1.5 1.5 0 00-1.5-1.5H4A1.5 1.5 0 002.5 3.5v5A1.5 1.5 0 004 10h1.5" />
          </svg>
        </>
      )}
    </button>
  );
}
