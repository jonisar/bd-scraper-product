"use client";

import { useState, useCallback } from "react";
import type { Template } from "@/lib/templates";
import { cpDatasetUrl } from "@/lib/cp-href";

type PreviewTab = "Output" | "API" | "Input" | "Schema";

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

type ApiLang = "Python" | "cURL" | "JavaScript";

export default function ScraperPreview({ template }: { template: Template }) {
  const [tab, setTab] = useState<PreviewTab>("Output");
  const [apiLang, setApiLang] = useState<ApiLang>("Python");
  const [copied, setCopied] = useState(false);

  const sampleUrl = template.inputs[0]?.example || "https://example.com";
  const cpUrl = cpDatasetUrl(template.datasetId);
  const fieldCount = template.totalFields || template.dictionary.length;

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const apiCode =
    apiLang === "Python"
      ? PYTHON_SNIPPET(template.datasetId, sampleUrl)
      : apiLang === "cURL"
        ? CURL_SNIPPET(template.datasetId, sampleUrl)
        : JS_SNIPPET(template.datasetId, sampleUrl);

  const sampleJson = JSON.stringify(template.sampleOutput, null, 2);

  return (
    <section className="section animate-rise">
      <div className="container">
        <div className="section-head">
          <span className="kicker">Try it</span>
          <h2>See what you get from {template.name}</h2>
          <p>Interactive preview — explore the output, API call, input parameters, and full schema.</p>
        </div>

        <div className="sp-card">
          {/* Header */}
          <div className="sp-header">
            <div className="sp-identity">
              <span className="sp-icon" style={{ background: template.color }}>
                {template.icon}
              </span>
              <div>
                <h3 className="sp-name">{template.name}</h3>
                <p className="sp-tagline">{template.tagline}</p>
              </div>
            </div>
            <div className="sp-stats">
              <div className="sp-stat">
                <span className="sp-stat-val">{template.responseTime.replace("~", "")}</span>
                <span className="sp-stat-label">Avg. response</span>
              </div>
              <div className="sp-stat">
                <span className="sp-stat-val">{fieldCount}+</span>
                <span className="sp-stat-label">Fields</span>
              </div>
              <div className="sp-stat">
                <span className="sp-stat-val">98.4%</span>
                <span className="sp-stat-label">Success rate</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="sp-tabs">
            {(["Output", "API", "Input", "Schema"] as PreviewTab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`sp-tab${tab === t ? " sp-tab-active" : ""}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="sp-body">
            {tab === "Output" && (
              <div className="sp-output">
                <div className="sp-output-header">
                  <span className="sp-output-label">json</span>
                  <button
                    type="button"
                    className="sp-copy"
                    onClick={() => copy(sampleJson)}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="sp-pre"><code>{sampleJson}</code></pre>
              </div>
            )}

            {tab === "API" && (
              <div className="sp-api">
                <div className="sp-lang-tabs">
                  {(["Python", "cURL", "JavaScript"] as ApiLang[]).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setApiLang(lang)}
                      className={`sp-lang-tab${apiLang === lang ? " sp-lang-tab-active" : ""}`}
                    >
                      {lang}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="sp-copy sp-copy-api"
                    onClick={() => copy(apiCode)}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="sp-pre"><code>{apiCode}</code></pre>
              </div>
            )}

            {tab === "Input" && (
              <div className="sp-input">
                <p className="sp-input-desc">
                  Parameters accepted by the <code>{template.name}</code> endpoint.
                </p>
                <div className="sp-input-table-wrap">
                  <table className="sp-input-table">
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
                          <td>{input.type}</td>
                          <td>{input.required ? "Yes" : "No"}</td>
                          <td>{input.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {template.endpoints.length > 1 && (
                  <div className="sp-endpoints">
                    <p className="sp-endpoints-label">Collection modes:</p>
                    <div className="sp-endpoints-list">
                      {template.endpoints.map((ep) => (
                        <div key={ep.name} className="sp-endpoint">
                          <span className="sp-endpoint-name">{ep.name}</span>
                          <span className="sp-endpoint-desc">{ep.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === "Schema" && (
              <div className="sp-schema">
                <p className="sp-schema-count">
                  {fieldCount} fields returned per record
                </p>
                <div className="sp-schema-grid">
                  {template.dictionary.slice(0, 20).map((field) => (
                    <div key={field.name} className="sp-field">
                      <code className="sp-field-name">{field.name}</code>
                      <span className="sp-field-type">{field.type}</span>
                      <span className="sp-field-desc">{field.description}</span>
                    </div>
                  ))}
                </div>
                {fieldCount > 20 && (
                  <p className="sp-schema-more">
                    + {fieldCount - 20} more fields — see full schema in the control panel.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="sp-footer">
            <a
              href={cpUrl}
              target="_blank"
              rel="noreferrer"
              className="sp-cta"
            >
              Start free with {template.name} →
            </a>
            {template.mcp && (
              <span className="sp-mcp-badge">⚡ MCP available</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
