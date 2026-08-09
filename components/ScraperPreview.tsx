"use client";

import { useState } from "react";
import type { Template } from "@/lib/templates";
import { cpDatasetUrl } from "@/lib/cp-href";

type MainTab = "Overview" | "Playground" | "Pricing" | "API" | "Input" | "Output" | "Connect Agent" | "Customize";
type ApiLang = "Python" | "cURL" | "JavaScript";

const TABS: MainTab[] = ["Overview", "Playground", "Pricing", "API", "Input", "Output", "Connect Agent", "Customize"];

const PYTHON_SNIPPET = (datasetId: string, url: string) =>
  `import requests

response = requests.post(
    "https://api.brightdata.com/datasets/v3/scrape",
    headers={
        "Authorization": "Bearer <API_TOKEN>",
        "Content-Type": "application/json",
    },
    params={"dataset_id": "${datasetId}", "format": "json"},
    json=[{"url": "${url}"}],
)

print(response.json())`;

const CURL_SNIPPET = (datasetId: string, url: string) =>
  `curl -X POST "https://api.brightdata.com/datasets/v3/scrape?dataset_id=${datasetId}&format=json" \\
  -H "Authorization: Bearer <API_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '[{"url": "${url}"}]'`;

const JS_SNIPPET = (datasetId: string, url: string) =>
  `const response = await fetch(
  "https://api.brightdata.com/datasets/v3/scrape?dataset_id=${datasetId}&format=json",
  {
    method: "POST",
    headers: {
      Authorization: "Bearer <API_TOKEN>",
      "Content-Type": "application/json",
    },
    body: JSON.stringify([{ url: "${url}" }]),
  }
);

const data = await response.json();
console.log(data);`;

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className="shrink-0 rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/85 transition hover:bg-white/10"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#2a4060] bg-[#060a10] shadow-[0_12px_30px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="font-mono text-xs text-white/65">{label}</span>
        <CopyBtn text={code} />
      </div>
      <pre className="code-scroll max-h-[400px] overflow-auto p-3 text-[12px] leading-5 text-[#d7e6ff] sm:p-4 sm:text-[13px] sm:leading-6">
        <code className="font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

export default function ScraperPreview({ template }: { template: Template }) {
  const [mainTab, setMainTab] = useState<MainTab>("Overview");
  const [apiLang, setApiLang] = useState<ApiLang>("Python");

  const sampleUrl = template.inputs[0]?.example || "https://example.com";
  const cpUrl = cpDatasetUrl(template.datasetId);
  const fieldCount = template.totalFields || template.dictionary.length;

  const apiCode =
    apiLang === "Python"
      ? PYTHON_SNIPPET(template.datasetId, sampleUrl)
      : apiLang === "cURL"
        ? CURL_SNIPPET(template.datasetId, sampleUrl)
        : JS_SNIPPET(template.datasetId, sampleUrl);

  const sampleJson = JSON.stringify(template.sampleOutput, null, 2);

  return (
    <section className="sp-section animate-rise">
      <div className="container">
        {/* ─── HERO CARD ─── */}
        <div className="sp-hero-card">
          <h2 className="sp-hero-title">{template.name} Scraper</h2>
          <p className="sp-hero-desc">{template.description}</p>

          {/* Ratings */}
          <div className="sp-ratings">
            {[
              { name: "Trustpilot", rating: "4.6", color: "#f5b301", href: "https://www.trustpilot.com/review/brightdata.com" },
              { name: "G2", rating: "4.6", color: "#ff492c", href: "https://www.g2.com/products/bright-data/reviews" },
              { name: "Capterra", rating: "4.8", color: "#e97b1e", href: "https://www.capterra.com/p/146810/Luminati/" },
            ].map((p) => (
              <a key={p.name} href={p.href} target="_blank" rel="noreferrer" className="sp-rating-link">
                <span className="sp-rating-name">{p.name}</span>
                <span className="sp-stars" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} viewBox="0 0 20 20" className="sp-star">
                      <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.9 5.06 16.7l.94-5.5-4-3.9 5.53-.8L10 1.5z" fill={p.color} />
                    </svg>
                  ))}
                </span>
                <span className="sp-rating-val">{p.rating}</span>
              </a>
            ))}
          </div>

          {/* Stats row */}
          <div className="sp-stats-row">
            {[
              { value: "34.7K+", label: "Deliveries" },
              { value: "5.7K+", label: "Users" },
              { value: "99.99%", label: "Uptime SLA" },
              { value: "GDPR & CCPA", label: "Compliant" },
            ].map((s) => (
              <div key={s.label} className="sp-stat-badge">
                <span className="sp-stat-value">{s.value}</span>
                <span className="sp-stat-lbl">{s.label}</span>
              </div>
            ))}
            <div className="sp-stat-badge sp-stat-verified">
              <span className="sp-stat-value sp-verified-dot">
                <span className="sp-dot" />
                Verified
              </span>
              <span className="sp-stat-lbl">
                <svg viewBox="0 0 16 16" className="sp-check-icon" aria-hidden="true"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" fill="currentColor"/></svg>
                3h ago
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="sp-hero-ctas">
            <a
              href="https://brightdata.com/cp/start"
              target="_blank"
              rel="noreferrer"
              className="sp-btn-primary"
            >
              Start free
            </a>
            <a
              href={cpUrl}
              target="_blank"
              rel="noreferrer"
              className="sp-btn-secondary"
            >
              Try in your agent
              <svg viewBox="0 0 16 16" className="sp-btn-icon" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="12" height="12" rx="2"/><path d="M6 6h4v4"/><path d="M10 6L6 10"/></svg>
            </a>
          </div>
        </div>

        {/* ─── TABS CARD ─── */}
        <div className="sp-tabs-card">
          {/* Tab bar */}
          <div className="sp-tab-bar">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMainTab(tab)}
                className={`sp-main-tab${mainTab === tab ? " sp-main-tab-active" : ""}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="sp-tab-content">
            {/* ── OVERVIEW ── */}
            {mainTab === "Overview" && (
              <div className="sp-overview">
                <h3 className="sp-content-title">Easily scrape {template.name} data</h3>
                <p className="sp-content-desc">
                  Send {template.domain} URLs or IDs → get structured JSON with {fieldCount}+ fields
                  ({template.dictionary.slice(0, 4).map(f => f.name).join(", ")}, and more).
                  Proxies, CAPTCHAs, and rendering are fully managed. Free 5K records/month included.
                </p>

                <div className="sp-get-started">
                  <h4 className="sp-subheading">Get started</h4>
                  <div className="sp-paths-grid">
                    {[
                      { icon: "▶", title: "Try it live", desc: "Paste a URL and see real results.", action: "Playground" as MainTab },
                      { icon: "{ }", title: "Call the API", desc: "Copy a ready-to-run code snippet.", action: "API" as MainTab },
                      { icon: "⚡", title: "Connect agent", desc: "One prompt for Claude, Cursor, or MCP.", action: "Connect Agent" as MainTab },
                    ].map((path) => (
                      <button
                        key={path.title}
                        type="button"
                        onClick={() => setMainTab(path.action)}
                        className="sp-path-card"
                      >
                        <span className="sp-path-icon">{path.icon}</span>
                        <span className="sp-path-title">{path.title}</span>
                        <span className="sp-path-desc">{path.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sp-capabilities">
                  <h4 className="sp-subheading">Key capabilities</h4>
                  <div className="sp-caps-grid">
                    {[
                      { title: `${fieldCount}+ field schema`, desc: "Parsed, typed, and validated automatically." },
                      { title: "Anti-bot bypass", desc: "Proxy rotation, CAPTCHA solving, fingerprint management." },
                      { title: "Pay for success", desc: "Charged only for successfully delivered records." },
                      { title: "Unlimited concurrency", desc: "Run as many parallel requests as needed." },
                    ].map((c) => (
                      <div key={c.title} className="sp-cap-item">
                        <span className="sp-cap-title">{c.title}</span>
                        <span className="sp-cap-desc">{c.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── PLAYGROUND ── */}
            {mainTab === "Playground" && (
              <div className="sp-playground">
                <h3 className="sp-content-title">Try {template.name} live</h3>
                <p className="sp-content-desc">
                  Paste any {template.domain} URL and get structured JSON back instantly.
                  No API key required for the first 3 demo runs.
                </p>
                <div className="sp-pg-cta-wrap">
                  <a href={cpUrl} target="_blank" rel="noreferrer" className="sp-btn-primary">
                    Open full playground →
                  </a>
                  <p className="sp-pg-note">Free 5K records/month · No credit card required</p>
                </div>
              </div>
            )}

            {/* ── PRICING ── */}
            {mainTab === "Pricing" && (
              <div className="sp-pricing">
                <h3 className="sp-content-title">Simple, transparent pricing</h3>
                <p className="sp-content-desc">
                  Pay only for successfully delivered records. No setup fees, no hidden costs.
                </p>
                <div className="sp-pricing-cards">
                  <div className="sp-price-card sp-price-free">
                    <span className="sp-price-badge">Free tier</span>
                    <span className="sp-price-value">5,000</span>
                    <span className="sp-price-unit">records/month</span>
                    <span className="sp-price-note">No credit card required</span>
                  </div>
                  <div className="sp-price-card">
                    <span className="sp-price-badge">Pay as you go</span>
                    <span className="sp-price-value">$1.50</span>
                    <span className="sp-price-unit">per 1K records</span>
                    <span className="sp-price-note">No commitment</span>
                  </div>
                  <div className="sp-price-card">
                    <span className="sp-price-badge">Scale</span>
                    <span className="sp-price-value">$1.00</span>
                    <span className="sp-price-unit">per 1K records</span>
                    <span className="sp-price-note">Volume discounts available</span>
                  </div>
                </div>
                <div className="sp-pricing-included">
                  <h4 className="sp-subheading">Everything included</h4>
                  <div className="sp-included-grid">
                    {["Browser rendering", "Anti-bot bypass", "Residential proxies", "Structured output", "Unlimited concurrency", "195+ countries", "Webhook delivery", "24/7 support"].map((f) => (
                      <div key={f} className="sp-included-item">
                        <svg viewBox="0 0 16 16" className="sp-included-check"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" fill="currentColor"/></svg>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── API ── */}
            {mainTab === "API" && (
              <div className="sp-api-tab">
                <h3 className="sp-content-title">API examples</h3>
                <p className="sp-content-desc">
                  Call this scraper from your code — pick a language, copy the snippet, add your API key.
                </p>
                <div className="sp-api-lang-bar">
                  {(["Python", "cURL", "JavaScript"] as ApiLang[]).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setApiLang(lang)}
                      className={`sp-api-lang${apiLang === lang ? " sp-api-lang-active" : ""}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <CodeBlock code={apiCode} label={apiLang.toLowerCase()} />
                <div className="sp-api-info">
                  <p>
                    <strong>Auth:</strong> Bearer token in the Authorization header.
                    Get a key at{" "}
                    <a href="https://brightdata.com/cp/setting/users" target="_blank" rel="noreferrer">
                      brightdata.com/cp/setting/users
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* ── INPUT ── */}
            {mainTab === "Input" && (
              <div className="sp-input-tab">
                <h3 className="sp-content-title">{template.name} input configuration</h3>
                <p className="sp-content-desc">
                  The request body is a JSON array of input objects. Each object must contain at minimum
                  a <code>url</code> field.
                </p>
                <div className="sp-input-table-wrap">
                  <table className="sp-input-tbl">
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        <th>Type</th>
                        <th>Required</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {template.inputs.map((input) => (
                        <tr key={input.name}>
                          <td><code>{input.name}</code></td>
                          <td><span className="sp-type-badge">{input.type}</span></td>
                          <td>{input.required ? <span className="sp-required">Yes</span> : <span className="sp-optional">No</span>}</td>
                          <td>{input.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {template.endpoints.length > 1 && (
                  <div className="sp-endpoints-section">
                    <h4 className="sp-subheading">Collection modes</h4>
                    <div className="sp-endpoints-grid">
                      {template.endpoints.map((ep) => (
                        <div key={ep.name} className="sp-endpoint-item">
                          <span className="sp-endpoint-name">{ep.name}</span>
                          <span className="sp-endpoint-desc">{ep.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── OUTPUT ── */}
            {mainTab === "Output" && (
              <div className="sp-output-tab">
                <div className="sp-output-header-row">
                  <div>
                    <h3 className="sp-content-title">{template.name} output schema</h3>
                    <p className="sp-content-desc">
                      Each record returns structured JSON with {fieldCount}+ fields.
                    </p>
                  </div>
                  <div className="sp-output-badges">
                    <span className="sp-badge-green">Structured JSON</span>
                    {template.mcp && <span className="sp-badge-blue">MCP compatible</span>}
                  </div>
                </div>
                <CodeBlock code={sampleJson} label="json" />
                <div className="sp-schema-section">
                  <h4 className="sp-subheading">Field reference ({fieldCount} fields)</h4>
                  <div className="sp-schema-list">
                    {template.dictionary.slice(0, 12).map((field) => (
                      <div key={field.name} className="sp-schema-row">
                        <code className="sp-schema-field">{field.name}</code>
                        <span className="sp-schema-type">{field.type}</span>
                        <span className="sp-schema-desc">{field.description}</span>
                      </div>
                    ))}
                  </div>
                  {fieldCount > 12 && (
                    <p className="sp-schema-more">
                      + {fieldCount - 12} more fields —{" "}
                      <a href={cpUrl} target="_blank" rel="noreferrer">view full schema →</a>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ── CONNECT AGENT ── */}
            {mainTab === "Connect Agent" && (
              <div className="sp-agent-tab">
                <h3 className="sp-content-title">Connect your AI agent to {template.name}</h3>
                <p className="sp-content-desc">
                  Give any AI agent the ability to scrape {template.domain} data in real time.
                  Works with Claude Code, Cursor, GPT, and any MCP-compatible client.
                </p>
                <div className="sp-agent-methods">
                  <div className="sp-agent-method">
                    <div className="sp-agent-method-header">
                      <span className="sp-agent-method-icon">⚡</span>
                      <span className="sp-agent-method-title">MCP (recommended)</span>
                    </div>
                    <p className="sp-agent-method-desc">
                      Hosted, no install needed. Paste the URL into your MCP client settings.
                    </p>
                    <code className="sp-agent-cmd">
                      https://mcp.brightdata.com/sse?API_TOKEN=YOUR_TOKEN
                    </code>
                  </div>
                  <div className="sp-agent-method">
                    <div className="sp-agent-method-header">
                      <span className="sp-agent-method-icon">▸</span>
                      <span className="sp-agent-method-title">CLI</span>
                    </div>
                    <p className="sp-agent-method-desc">
                      Two commands from any terminal:
                    </p>
                    <code className="sp-agent-cmd">npx -p @brightdata/cli bdata login</code>
                    <code className="sp-agent-cmd">bdata pipelines {template.slug.replace(/-/g, "_")} &quot;{sampleUrl}&quot;</code>
                  </div>
                  <div className="sp-agent-method">
                    <div className="sp-agent-method-header">
                      <span className="sp-agent-method-icon">💬</span>
                      <span className="sp-agent-method-title">Prompt</span>
                    </div>
                    <p className="sp-agent-method-desc">
                      Hand this to any coding agent:
                    </p>
                    <code className="sp-agent-cmd">
                      Read https://brightdata.com/skills.md and scrape data from {template.domain}
                    </code>
                  </div>
                </div>
              </div>
            )}

            {/* ── CUSTOMIZE ── */}
            {mainTab === "Customize" && (
              <div className="sp-customize-tab">
                <h3 className="sp-content-title">Customize output</h3>
                <p className="sp-content-desc">
                  Select only the fields you need, choose your output format, and configure delivery.
                </p>
                <div className="sp-customize-fields">
                  <h4 className="sp-subheading">Output fields</h4>
                  <div className="sp-field-pills">
                    {template.dictionary.slice(0, 16).map((f) => (
                      <span key={f.name} className="sp-field-pill">{f.name}</span>
                    ))}
                    {fieldCount > 16 && <span className="sp-field-pill sp-field-pill-more">+{fieldCount - 16} more</span>}
                  </div>
                </div>
                <div className="sp-customize-options">
                  <div className="sp-option-row">
                    <span className="sp-option-label">Format</span>
                    <div className="sp-option-pills">
                      {["JSON", "NDJSON", "CSV"].map((f) => (
                        <span key={f} className={`sp-option-pill${f === "JSON" ? " sp-option-pill-active" : ""}`}>{f}</span>
                      ))}
                    </div>
                  </div>
                  <div className="sp-option-row">
                    <span className="sp-option-label">Delivery</span>
                    <div className="sp-option-pills">
                      {["API", "S3", "Webhook", "GCS"].map((d) => (
                        <span key={d} className={`sp-option-pill${d === "API" ? " sp-option-pill-active" : ""}`}>{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <a href={cpUrl} target="_blank" rel="noreferrer" className="sp-btn-primary sp-customize-cta">
                  Open in control panel →
                </a>
                <p className="sp-customize-note">Free to try · No code · Apply in one click</p>
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="sp-card-footer">
            <a href={cpUrl} target="_blank" rel="noreferrer" className="sp-footer-cta">
              Start free with {template.name} →
            </a>
            {template.mcp && (
              <span className="sp-mcp-pill">⚡ MCP available</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
