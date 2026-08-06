"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const STUDIO_CHAT_URL = "https://brightdata.com/cp/scrapers/automation/chat";

const AGENT_BUILD_PROMPT = `Build and run a Bright Data scraper. Run every Bright Data CLI command through \`npx -p @brightdata/cli\` so nothing is installed globally. Replace <TARGET_URL> and <FIELDS TO EXTRACT>, then do each step in order and stop if a step fails:

1. Authenticate by running \`npx -p @brightdata/cli bdata login\`. npx fetches the CLI on demand, so there is nothing to install.
2. Create a Bright Data scraper for <TARGET_URL> that extracts: <FIELDS TO EXTRACT>. Report the Collector ID.
3. Run that scraper on the same URL and pretty-print the result.`;

const PROMPT_SUGGESTIONS = [
  { label: "Product page scraper", prompt: "Build a PDP scraper for https://shopalto.xyz/product/aurora-wireless-headphones. Extract the product title, price, availability, brand, rating and all product image URLs. Return one row per input URL." },
  { label: "Price monitoring", prompt: "Build a Discovery scraper for the category page https://www.dm.de/baby-und-kind. Return one row per item shown in the listing with title, price, rating and listing position. Do not open the individual product pages." },
  { label: "Search results scraper", prompt: "Build a Search scraper for https://www.autodoc.de. For the keyword \"brake pads\" in Germany, return matching products with title, price, brand and product URL. No need to open each product page." },
  { label: "Full catalog scraper", prompt: "Build a scraper using this sitemap: https://www.dm.de/sitemap.xml. Extract all product page URLs, visit each product page, and collect product name, price, SKU, description, image URL and availability. Return one row per product." },
];

const TYPING_EXAMPLE = "Build a Discovery + PDP scraper for the running shoes category on https://www.decathlon.fr: find every product, open each product page, and extract title, price, availability, rating and image URLs...";

export default function AiPromptCta({ variant }: { variant?: "hero" } = {}) {
  const [promptText, setPromptText] = useState("");
  const [agentPromptCopied, setAgentPromptCopied] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [typingIdx, setTypingIdx] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sendGuardRef = useRef(false);

  useEffect(() => {
    if (!isTyping) return;
    if (typingIdx >= TYPING_EXAMPLE.length) {
      typingTimerRef.current = setTimeout(() => {
        setTypingIdx(0);
        setPromptText("");
      }, 3000);
      return () => { if (typingTimerRef.current) clearTimeout(typingTimerRef.current); };
    }
    const speed = TYPING_EXAMPLE[typingIdx] === " " ? 60 : 28 + Math.random() * 32;
    typingTimerRef.current = setTimeout(() => {
      setPromptText(TYPING_EXAMPLE.slice(0, typingIdx + 1));
      setTypingIdx((i) => i + 1);
    }, speed);
    return () => { if (typingTimerRef.current) clearTimeout(typingTimerRef.current); };
  }, [isTyping, typingIdx]);

  useEffect(() => {
    if (!isTyping && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isTyping]);

  const stopTyping = useCallback(() => {
    setIsTyping(false);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
  }, []);

  const handlePaneClick = useCallback(() => {
    if (!isTyping) {
      textareaRef.current?.focus();
      return;
    }
    stopTyping();
    setPromptText("");
  }, [isTyping, stopTyping]);

  const handleFocus = () => {
    stopTyping();
    if (promptText === TYPING_EXAMPLE.slice(0, typingIdx)) {
      setPromptText("");
    }
  };

  const openStudio = useCallback(() => {
    if (sendGuardRef.current) return;
    sendGuardRef.current = true;
    const text = isTyping ? "" : promptText.trim();
    const url = (text.match(/https?:\/\/[^\s"'<>]+/) || [""])[0].replace(/[.,]+$/, "");
    const params = new URLSearchParams();
    if (url) params.set("url", url);
    if (text) params.set("prompt", text);
    const target = params.size > 0 ? `${STUDIO_CHAT_URL}?${params.toString()}` : STUDIO_CHAT_URL;
    window.open(target, "_blank", "noopener,noreferrer");
    setTimeout(() => { sendGuardRef.current = false; }, 1500);
  }, [isTyping, promptText]);

  const handleSend = () => openStudio();

  const handleSuggestion = (prompt: string) => {
    stopTyping();
    setPromptText(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className={`ai-prompt-section${variant === "hero" ? " ai-prompt-section--hero" : ""}`}>
      <div className={`ai-prompt-outer${variant === "hero" ? " ai-prompt-outer--hero" : ""}`}>
        <div className="ai-prompt-glow" aria-hidden="true" />

        <div className="ai-prompt-header">
          <span className="ai-prompt-badge">
            <span className="ai-prompt-badge-dot" />
            AI Scraper Studio
          </span>
          <h2 className="ai-prompt-title">
            Describe it. <span className="ai-prompt-accent">We&apos;ll build it.</span>
          </h2>
          <p className="ai-prompt-subtitle">
            Tell our AI what data you need. It creates, tests, and deploys a production scraper in minutes.
          </p>
        </div>

        <div className="ai-prompt-pane">
          <div className="ai-prompt-pane-chrome">
            <div className="ai-prompt-dots" aria-hidden="true">
              <span /><span /><span />
            </div>
            <span className="ai-prompt-pane-label">New Scraper</span>
          </div>

          <div className="ai-prompt-body">
            <div className="ai-prompt-context">
              <div className="ai-prompt-context-icon" aria-hidden="true">✦</div>
              <div className="ai-prompt-context-text">
                <strong>What would you like to scrape?</strong>
                <span>Describe the website, the data fields you need, and any filters. I&apos;ll handle the rest.</span>
              </div>
            </div>

            <div className="ai-prompt-suggestions">
              {PROMPT_SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  className="ai-prompt-chip"
                  onClick={() => handleSuggestion(s.prompt)}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="ai-prompt-input-area">
              {isTyping ? (
                <div
                  className="ai-prompt-textarea-wrap"
                  onClick={handlePaneClick}
                  role="presentation"
                  style={{ cursor: "text" }}
                >
                  <div className="ai-prompt-textarea" style={{ minHeight: 72 }}>
                    {promptText}
                    <span className="ai-prompt-cursor" />
                  </div>
                </div>
              ) : (
                <div className="ai-prompt-textarea-wrap">
                  <textarea
                    ref={textareaRef}
                    className="ai-prompt-textarea"
                    placeholder="e.g. Scrape all product titles, prices, and ratings from..."
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    onFocus={handleFocus}
                    onKeyDown={handleKeyDown}
                    rows={3}
                  />
                </div>
              )}
              <div className="ai-prompt-input-footer">
                <span className="ai-prompt-hint">Press Enter to send</span>
                <button
                  type="button"
                  className="ai-prompt-send"
                  onClick={handleSend}
                  aria-label="Create scraper"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/></svg>
                  <span>Create scraper</span>
                </button>
              </div>
            </div>
          </div>

          <div className="ai-prompt-pane-footer">
            <span className="ai-prompt-footer-item"><span className="ai-prompt-check">✓</span> No code required</span>
            <span className="ai-prompt-footer-item"><span className="ai-prompt-check">✓</span> Auto-healing selectors</span>
            <span className="ai-prompt-footer-item"><span className="ai-prompt-check">✓</span> Deploys instantly</span>
            <span className="ai-prompt-footer-item"><span className="ai-prompt-check">✓</span> Any website</span>
          </div>
        </div>

        <div className="ai-prompt-agent-row">
          <span>Prefer your coding agent?</span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(AGENT_BUILD_PROMPT);
              } catch {
                const ta = document.createElement("textarea");
                ta.value = AGENT_BUILD_PROMPT;
                ta.style.position = "fixed";
                ta.style.opacity = "0";
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                ta.remove();
              }
              setAgentPromptCopied(true);
              setTimeout(() => setAgentPromptCopied(false), 1600);
            }}
          >
            {agentPromptCopied ? "Copied ✓" : "Copy agent prompt"}
          </button>
          <a
            href="https://docs.brightdata.com/datasets/scraper-studio/coding-agent-prompts"
            target="_blank"
            rel="noopener noreferrer"
            className="value-link"
          >
            Agent prompt docs ↗
          </a>
        </div>

      </div>
    </section>
  );
}
