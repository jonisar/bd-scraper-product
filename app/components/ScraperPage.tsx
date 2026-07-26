"use client";

import { useState, useCallback } from "react";

type MainTab = "Information" | "Input" | "API" | "Output" | "Live Test" | "Issues" | "Connect Agent" | "Edit with AI";
type ApiLang = "Python" | "JavaScript" | "cURL" | "MCP" | "OpenAPI";
type AgentPlatform = "MCP" | "OpenAI SDK" | "LangChain" | "CrewAI" | "REST API";

const DATASET_ID = "gd_l1vijqt9jfj7olije";

const PYTHON_SYNC = `import requests
import json

API_TOKEN = "<YOUR_API_TOKEN>"
DATASET_ID = "${DATASET_ID}"

# Synchronous request — results returned in real time
response = requests.post(
    "https://api.brightdata.com/datasets/v3/scrape",
    headers={
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json",
    },
    params={
        "dataset_id": DATASET_ID,
        "format": "json",
        "include_errors": "true",
    },
    json=[
        {"url": "https://www.amazon.com/dp/B09X7MPX8L"},
        {"url": "https://www.amazon.com/dp/B0D5CQPGFQ"},
    ],
)

products = response.json()
for product in products:
    print(f"{product['title']} — {product['price']}")

# 📚 Docs → https://docs.brightdata.com/api-reference/scrapers/synchronous-requests`;

const PYTHON_ASYNC = `import requests
import time

API_TOKEN = "<YOUR_API_TOKEN>"
DATASET_ID = "${DATASET_ID}"

# Step 1: Trigger an async collection
trigger = requests.post(
    "https://api.brightdata.com/datasets/v3/trigger",
    headers={
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json",
    },
    params={
        "dataset_id": DATASET_ID,
        "format": "json",
        "include_errors": "true",
    },
    json=[
        {"url": "https://www.amazon.com/dp/B09X7MPX8L"},
        {"url": "https://www.amazon.com/dp/B0D5CQPGFQ"},
    ],
)

snapshot_id = trigger.json()["snapshot_id"]
print(f"Snapshot: {snapshot_id}")

# Step 2: Poll until ready
while True:
    status = requests.get(
        f"https://api.brightdata.com/datasets/v3/snapshots/{snapshot_id}",
        headers={"Authorization": f"Bearer {API_TOKEN}"},
    )
    if status.json()["status"] == "ready":
        break
    time.sleep(5)

# Step 3: Download results
results = requests.get(
    f"https://api.brightdata.com/datasets/v3/snapshots/{snapshot_id}",
    headers={"Authorization": f"Bearer {API_TOKEN}"},
    params={"format": "json"},
)

for product in results.json():
    print(f"{product['title']} — {product['price']}")

# 📚 Docs → https://docs.brightdata.com/api-reference/scrapers/asynchronous-requests`;

const JS_SYNC = `const API_TOKEN = "<YOUR_API_TOKEN>";
const DATASET_ID = "${DATASET_ID}";

// Synchronous request — results returned in real time
const response = await fetch(
  \`https://api.brightdata.com/datasets/v3/scrape?dataset_id=\${DATASET_ID}&format=json&include_errors=true\`,
  {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${API_TOKEN}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      { url: "https://www.amazon.com/dp/B09X7MPX8L" },
      { url: "https://www.amazon.com/dp/B0D5CQPGFQ" },
    ]),
  }
);

const products = await response.json();
products.forEach((p) => console.log(\`\${p.title} — \${p.price}\`));

// 📚 Docs → https://docs.brightdata.com/api-reference/scrapers/synchronous-requests`;

const JS_ASYNC = `const API_TOKEN = "<YOUR_API_TOKEN>";
const DATASET_ID = "${DATASET_ID}";

// Step 1: Trigger async collection
const trigger = await fetch(
  \`https://api.brightdata.com/datasets/v3/trigger?dataset_id=\${DATASET_ID}&format=json\`,
  {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${API_TOKEN}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      { url: "https://www.amazon.com/dp/B09X7MPX8L" },
      { url: "https://www.amazon.com/dp/B0D5CQPGFQ" },
    ]),
  }
);

const { snapshot_id } = await trigger.json();
console.log("Snapshot:", snapshot_id);

// Step 2: Poll until ready
let status;
do {
  await new Promise((r) => setTimeout(r, 5000));
  const res = await fetch(
    \`https://api.brightdata.com/datasets/v3/snapshots/\${snapshot_id}\`,
    { headers: { Authorization: \`Bearer \${API_TOKEN}\` } }
  );
  status = (await res.json()).status;
} while (status !== "ready");

// Step 3: Download results
const results = await fetch(
  \`https://api.brightdata.com/datasets/v3/snapshots/\${snapshot_id}?format=json\`,
  { headers: { Authorization: \`Bearer \${API_TOKEN}\` } }
);

const products = await results.json();
products.forEach((p) => console.log(\`\${p.title} — \${p.price}\`));

// 📚 Docs → https://docs.brightdata.com/api-reference/scrapers/asynchronous-requests`;

const CURL_SYNC = `curl -X POST \\
  "https://api.brightdata.com/datasets/v3/scrape?dataset_id=${DATASET_ID}&format=json&include_errors=true" \\
  -H "Authorization: Bearer <YOUR_API_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '[
    {"url": "https://www.amazon.com/dp/B09X7MPX8L"},
    {"url": "https://www.amazon.com/dp/B0D5CQPGFQ"}
  ]'`;

const CURL_ASYNC = `# Step 1: Trigger collection
curl -X POST \\
  "https://api.brightdata.com/datasets/v3/trigger?dataset_id=${DATASET_ID}&format=json" \\
  -H "Authorization: Bearer <YOUR_API_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '[
    {"url": "https://www.amazon.com/dp/B09X7MPX8L"},
    {"url": "https://www.amazon.com/dp/B0D5CQPGFQ"}
  ]'
# → Returns: {"snapshot_id": "s_abc123..."}

# Step 2: Check status / download results
curl "https://api.brightdata.com/datasets/v3/snapshots/s_abc123?format=json" \\
  -H "Authorization: Bearer <YOUR_API_TOKEN>"`;

const MCP_CODE = `{
  "mcpServers": {
    "brightdata": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-remote",
        "https://mcp.brightdata.com/sse",
        "--header",
        "Authorization: Bearer <YOUR_API_TOKEN>"
      ]
    }
  }
}`;

const OPENAPI_SNIPPET = `{
  "openapi": "3.1.0",
  "info": {
    "title": "Bright Data Scrapers",
    "description": "API for automated web data collection and extraction with support for various scraping scenarios and delivery options",
    "version": "1.0.0"
  },
  "servers": [
    { "url": "https://api.brightdata.com" }
  ],
  "paths": {
    "/datasets/v3/scrape": {
      "post": {
        "operationId": "sync-scrape",
        "summary": "Synchronous scrape — returns data in real time",
        "parameters": [
          { "name": "dataset_id", "in": "query", "required": true, "schema": { "type": "string" } },
          { "name": "format", "in": "query", "schema": { "type": "string", "enum": ["json", "ndjson", "jsonl", "csv"] } },
          { "name": "include_errors", "in": "query", "schema": { "type": "boolean" } }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "array",
                "items": { "type": "object", "properties": { "url": { "type": "string" } } }
              }
            }
          }
        }
      }
    },
    "/datasets/v3/trigger": {
      "post": {
        "operationId": "async-trigger",
        "summary": "Async trigger — returns snapshot_id, poll for results",
        "parameters": [
          { "name": "dataset_id", "in": "query", "required": true, "schema": { "type": "string" } }
        ]
      }
    }
  },
  "components": {
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "description": "Use your Bright Data API Key as a Bearer token"
      }
    }
  },
  "security": [{ "bearerAuth": [] }]
}`;

const SAMPLE_OUTPUT = `{
  "title": "SanDisk 1TB Extreme microSDXC UHS-I Memory Card with Adapter",
  "url": "https://www.amazon.com/dp/B09X7MPX8L",
  "asin": "B09X7MPX8L",
  "in_stock": true,
  "brand": "SanDisk",
  "price": 145.50,
  "list_price": 299.99,
  "currency": "USD",
  "stars": 4.8,
  "reviews_count": 36704,
  "answered_questions": 151,
  "categories": "Electronics › Computers & Accessories › Memory Cards › Micro SD Cards",
  "image": "https://m.media-amazon.com/images/I/716kSUlHouL.jpg",
  "features": [
    "Save time with card offload speeds of up to 190MB/s",
    "Up to 130MB/s write speeds for fast shooting",
    "4K and 5K UHD-ready with UHS Speed Class 3 (U3)"
  ],
  "seller": {
    "name": "Direct Suppliers US",
    "id": "A210SJF12S88M5"
  },
  "delivery": "Thursday, January 26",
  "return_policy": "Eligible for Return, Refund or Replacement within 30 days"
}`;

const AGENT_PROMPT = `"""Bright Data Amazon Product Scraper — bounded, re-runnable walkthrough."""
import requests, json, os

API_KEY = os.environ["BRIGHTDATA_API_KEY"]
DATASET  = "${DATASET_ID}"
BASE     = "https://api.brightdata.com/datasets/v3"
HEADERS  = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

# 1. Sync scrape — single product by URL (real-time, ≤20 URLs)
product = requests.post(
    f"{BASE}/scrape",
    headers=HEADERS,
    params={"dataset_id": DATASET, "format": "json"},
    json=[{"url": "https://www.amazon.com/dp/B09X7MPX8L"}],
).json()[0]

print(product["title"], f"— \${product['price']} ({product['stars']}★)")

# 2. Bulk scrape with location-specific pricing
products = requests.post(
    f"{BASE}/scrape",
    headers=HEADERS,
    params={"dataset_id": DATASET, "format": "json"},
    json=[
        {"url": "https://www.amazon.com/dp/B09X7MPX8L", "zipcode": "10001"},
        {"url": "https://www.amazon.com/dp/B0D5CQPGFQ", "zipcode": "94107"},
    ],
).json()

for p in products:
    print(p["title"], p["price"], p["in_stock"], p["reviews_count"])

# 3. Async trigger — for large jobs (>20 URLs, production pipelines)
trigger = requests.post(
    f"{BASE}/trigger",
    headers=HEADERS,
    params={"dataset_id": DATASET, "format": "json"},
    json=[{"url": f"https://www.amazon.com/dp/{asin}"} for asin in [
        "B09X7MPX8L", "B0D5CQPGFQ", "B08N5WRWNW", "B0BSHF7WHW",
    ]],
).json()
snapshot_id = trigger["snapshot_id"]

# Poll until ready, then fetch results
import time
while True:
    status = requests.get(
        f"{BASE}/snapshots/{snapshot_id}",
        headers={"Authorization": f"Bearer {API_KEY}"},
    ).json()
    if status["status"] == "ready":
        break
    time.sleep(5)

results = requests.get(
    f"{BASE}/snapshots/{snapshot_id}",
    headers={"Authorization": f"Bearer {API_KEY}"},
    params={"format": "json"},
).json()

print(f"Fetched {len(results)} products via async pipeline")

# Available fields per product:
# title, url, asin, price, list_price, currency, stars, reviews_count,
# in_stock, brand, seller, features, categories, image, delivery`;

const AGENT_MCP_CONFIG = `{
  "mcpServers": {
    "brightdata": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-remote",
        "https://mcp.brightdata.com/sse",
        "--header",
        "Authorization: Bearer <YOUR_API_KEY>"
      ]
    }
  }
}`;

const AGENT_MCP_HOSTED = `# Hosted MCP — no local install needed
# Use this URL directly in Claude Desktop, Cursor, VS Code, or any MCP client:

https://mcp.brightdata.com/sse?token=<YOUR_API_KEY>

# For Streamable HTTP (OpenAI Agent Builder, n8n, etc.):
https://mcp.brightdata.com/mcp?token=<YOUR_API_KEY>`;

const AGENT_OPENAI = `from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-4o",
    tools=[
        {
            "type": "mcp",
            "server_label": "BrightData",
            "server_url": "https://mcp.brightdata.com/sse?token=<YOUR_API_KEY>",
            "require_approval": "never",
        },
    ],
    input="Scrape this Amazon product and give me the price and rating: "
          "https://www.amazon.com/dp/B09X7MPX8L",
)

print(response.output_text)`;

const AGENT_LANGCHAIN = `from langchain_brightdata import BrightDataWebScraperAPI
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent

# Initialize the Bright Data scraper tool
scraper = BrightDataWebScraperAPI(
    bright_data_api_key="<YOUR_API_KEY>"
)

# Create an agent that can scrape Amazon
llm = ChatOpenAI(model="gpt-4o")
agent = create_react_agent(llm, [scraper])

# Run it
result = agent.invoke({
    "messages": [{
        "role": "user",
        "content": "Get pricing data for https://www.amazon.com/dp/B09X7MPX8L "
                   "in New York (zipcode 10001)"
    }]
})

print(result["messages"][-1].content)

# --- Direct tool call (no agent) ---
data = scraper.invoke({
    "url": "https://www.amazon.com/dp/B09X7MPX8L",
    "dataset_type": "amazon_product",
    "zipcode": "10001",
})
print(data)`;

const AGENT_CREWAI = `from crewai import Agent, Task, Crew
from crewai_tools import BrightDataDatasetTool

# Initialize the Amazon scraper tool
amazon_tool = BrightDataDatasetTool(
    dataset_type="amazon_product",
    url="https://www.amazon.com/dp/B09X7MPX8L"
)

# Create an agent with scraping capabilities
researcher = Agent(
    role="Product Researcher",
    goal="Analyze Amazon product data for competitive intelligence",
    backstory="You are a market research analyst who extracts "
              "and analyzes Amazon product data.",
    tools=[amazon_tool],
    verbose=True,
)

# Define the task
task = Task(
    description="Scrape the Amazon product at the given URL. "
                "Extract the price, rating, review count, and "
                "seller info. Summarize your findings.",
    expected_output="A structured summary of the product data",
    agent=researcher,
)

# Run
crew = Crew(agents=[researcher], tasks=[task], verbose=True)
result = crew.kickoff()
print(result)`;

const AGENT_REST = `import requests
import json

API_KEY = "<YOUR_API_KEY>"
DATASET_ID = "${DATASET_ID}"

def scrape_amazon(urls: list[str]) -> list[dict]:
    """Scrape Amazon products — call this from any agent framework."""
    response = requests.post(
        "https://api.brightdata.com/datasets/v3/scrape",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
        params={
            "dataset_id": DATASET_ID,
            "format": "json",
            "include_errors": "true",
        },
        json=[{"url": u} for u in urls],
    )
    response.raise_for_status()
    return response.json()

# Use as a tool in any agent framework:
products = scrape_amazon([
    "https://www.amazon.com/dp/B09X7MPX8L",
    "https://www.amazon.com/dp/B0D5CQPGFQ",
])

for p in products:
    print(f"{p['title']} — \${p['price']} ({p['stars']}★)")`;

const DESCRIPTION =
  "Collect Amazon product data at scale — titles, prices, reviews, seller info, stock levels, and more. No proxy management, no browser rendering, no anti-bot headaches. Just send URLs, get structured JSON back.";

function StarRow() {
  return (
    <div className="flex items-center gap-0.5 text-[#f5b301]" aria-label="4.6 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current" aria-hidden>
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.9 5.06 16.7l.94-5.5-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }}
      className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/85 transition hover:bg-white/10"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#2a4060] bg-bd-code-bg shadow-[0_18px_40px_rgba(11,31,58,0.22)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="font-mono text-xs text-white/55">{label}</span>
        <CopyButton text={code} />
      </div>
      <pre className="code-scroll max-h-[520px] overflow-auto p-4 text-[13px] leading-6 text-[#d7e6ff]">
        <code className="font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

function SyncAsyncToggle({
  mode,
  onChange,
}: {
  mode: "sync" | "async";
  onChange: (m: "sync" | "async") => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-bd-line bg-bd-canvas p-0.5">
      {(["sync", "async"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 ${
            mode === m
              ? "bg-white text-bd-navy shadow-sm"
              : "text-bd-muted hover:text-bd-ink"
          }`}
        >
          <span className="sm:hidden">{m === "sync" ? "Sync" : "Async"}</span>
          <span className="hidden sm:inline">{m === "sync" ? "Synchronous (Real-time)" : "Asynchronous (Bulk)"}</span>
        </button>
      ))}
    </div>
  );
}

function LiveTestPanel() {
  const [apiKey, setApiKey] = useState("");
  const [urls, setUrls] = useState("https://www.amazon.com/dp/B09X7MPX8L");
  const [format, setFormat] = useState<"json" | "csv" | "ndjson">("json");
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [result, setResult] = useState("");
  const [elapsed, setElapsed] = useState(0);

  const run = useCallback(async () => {
    if (!apiKey.trim()) {
      setStatus("error");
      setResult("Please enter your API key.");
      return;
    }

    const urlList = urls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean)
      .map((url) => ({ url }));

    if (urlList.length === 0) {
      setStatus("error");
      setResult("Please enter at least one Amazon URL.");
      return;
    }

    setStatus("running");
    setResult("");
    const start = Date.now();
    const timer = window.setInterval(() => setElapsed(Date.now() - start), 100);

    try {
      const res = await fetch(
        `https://api.brightdata.com/datasets/v3/scrape?dataset_id=${DATASET_ID}&format=${format}&include_errors=true`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(urlList),
        }
      );

      window.clearInterval(timer);
      setElapsed(Date.now() - start);

      const text = await res.text();

      if (!res.ok) {
        setStatus("error");
        setResult(`HTTP ${res.status} ${res.statusText}\n\n${text}`);
        return;
      }

      if (format === "json") {
        try {
          setResult(JSON.stringify(JSON.parse(text), null, 2));
        } catch {
          setResult(text);
        }
      } else {
        setResult(text);
      }
      setStatus("done");
    } catch (err) {
      window.clearInterval(timer);
      setElapsed(Date.now() - start);
      setStatus("error");
      setResult(err instanceof Error ? err.message : "Request failed");
    }
  }, [apiKey, urls, format]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-bd-navy">Live API Test</h2>
        <p className="mt-1 text-sm text-bd-muted">
          Send a real synchronous request to the Amazon Product Scraper and see results
          instantly. Uses your Bright Data API key.
        </p>
      </div>

      {/* API Key */}
      <div>
        <label htmlFor="lt-key" className="block text-sm font-semibold text-bd-navy">
          API Key
        </label>
        <input
          id="lt-key"
          type="password"
          placeholder="Enter your Bright Data API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-bd-line bg-white px-3.5 py-2.5 font-mono text-sm text-bd-ink placeholder:text-bd-muted/50 focus:border-bd-blue focus:outline-none focus:ring-2 focus:ring-bd-blue/20"
        />
        <p className="mt-1 text-xs text-bd-muted">
          Get your key at{" "}
          <a
            href="https://brightdata.com/cp/setting/users"
            className="text-bd-blue hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            brightdata.com/cp/setting/users
          </a>
        </p>
      </div>

      {/* URLs */}
      <div>
        <label htmlFor="lt-urls" className="block text-sm font-semibold text-bd-navy">
          Amazon URLs <span className="font-normal text-bd-muted">(one per line)</span>
        </label>
        <textarea
          id="lt-urls"
          rows={3}
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-bd-line bg-white px-3.5 py-2.5 font-mono text-sm text-bd-ink placeholder:text-bd-muted/50 focus:border-bd-blue focus:outline-none focus:ring-2 focus:ring-bd-blue/20"
          placeholder="https://www.amazon.com/dp/B09X7MPX8L"
        />
      </div>

      {/* Format + Run */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="lt-format" className="block text-sm font-semibold text-bd-navy">
            Format
          </label>
          <select
            id="lt-format"
            value={format}
            onChange={(e) => setFormat(e.target.value as "json" | "csv" | "ndjson")}
            className="mt-1.5 rounded-lg border border-bd-line bg-white px-3 py-2.5 text-sm text-bd-ink focus:border-bd-blue focus:outline-none focus:ring-2 focus:ring-bd-blue/20"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="ndjson">NDJSON</option>
          </select>
        </div>
        <button
          type="button"
          onClick={run}
          disabled={status === "running"}
          className="rounded-xl bg-bd-blue px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-bd-blue/30 transition hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "running" ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Running…
            </span>
          ) : (
            "Run scraper"
          )}
        </button>
      </div>

      {/* Status bar */}
      {status !== "idle" ? (
        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
            status === "running"
              ? "border border-bd-blue-light/50 bg-bd-blue-soft/40 text-bd-blue"
              : status === "done"
                ? "border border-green-200 bg-green-50 text-green-700"
                : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {status === "running" ? "⏳" : status === "done" ? "✅" : "❌"}
          <span>
            {status === "running"
              ? `Scraping… ${(elapsed / 1000).toFixed(1)}s`
              : status === "done"
                ? `Completed in ${(elapsed / 1000).toFixed(1)}s`
                : "Error"}
          </span>
        </div>
      ) : null}

      {/* Result */}
      {result ? (
        <div className="overflow-hidden rounded-xl border border-[#2a4060] bg-bd-code-bg shadow-[0_18px_40px_rgba(11,31,58,0.22)]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <span className="font-mono text-xs text-white/55">
              {status === "done" ? "response" : "error"}
            </span>
            <CopyButton text={result} />
          </div>
          <pre className="code-scroll max-h-[500px] overflow-auto p-4 text-[13px] leading-6 text-[#d7e6ff]">
            <code className="font-mono whitespace-pre">{result}</code>
          </pre>
        </div>
      ) : null}

      {/* Callout */}
      {status === "idle" ? (
        <div className="flex items-start gap-2 rounded-lg border border-bd-line bg-bd-canvas px-4 py-3">
          <span className="mt-0.5">🔒</span>
          <p className="text-sm leading-6 text-bd-muted">
            Your API key is sent directly from your browser to{" "}
            <code className="rounded bg-white/60 px-1 py-0.5 font-mono text-xs text-bd-ink">api.brightdata.com</code>.
            It is never stored or sent to any other server.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default function ScraperPage() {
  const [mainTab, setMainTab] = useState<MainTab>("API");
  const [apiLang, setApiLang] = useState<ApiLang>("Python");
  const [apiMode, setApiMode] = useState<"sync" | "async">("sync");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [agentPlatform, setAgentPlatform] = useState<AgentPlatform>("MCP");

  const mainTabs: MainTab[] = ["Information", "API", "Input", "Output", "Live Test", "Connect Agent", "Edit with AI", "Issues"];
  const apiLangs: ApiLang[] = ["Python", "JavaScript", "cURL", "MCP", "OpenAPI"];

  function getCodeForLang() {
    if (apiLang === "Python") return apiMode === "sync" ? PYTHON_SYNC : PYTHON_ASYNC;
    if (apiLang === "JavaScript") return apiMode === "sync" ? JS_SYNC : JS_ASYNC;
    if (apiLang === "cURL") return apiMode === "sync" ? CURL_SYNC : CURL_ASYNC;
    return "";
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-bd-line/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2.5">
              <span className="brand-mark grid h-8 w-8 place-items-center rounded-lg text-sm font-extrabold text-white shadow-sm shadow-bd-blue/40">
                BD
              </span>
              <span className="text-[15px] font-extrabold tracking-tight text-bd-navy">
                Bright Data
              </span>
            </a>
            <nav className="hidden items-center gap-5 text-sm text-bd-muted md:flex">
              <a href="https://brightdata.com/cp/scrapers/browse" className="transition hover:text-bd-ink" target="_blank" rel="noreferrer">Scraper Library</a>
              <a href="https://brightdata.com/products/web-scraper/studio" className="transition hover:text-bd-ink" target="_blank" rel="noreferrer">
                <span className="flex items-center gap-1">AI Scraper Studio<span className="rounded bg-bd-blue/10 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wider text-bd-blue">New</span></span>
              </a>
              <a href="https://docs.brightdata.com/" className="transition hover:text-bd-ink" target="_blank" rel="noreferrer">Docs</a>
              <a href="https://brightdata.com/pricing" className="transition hover:text-bd-ink" target="_blank" rel="noreferrer">Pricing</a>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://brightdata.com/cp"
              className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-bd-ink transition hover:bg-bd-blue-soft sm:inline-flex"
            >
              Log in
            </a>
            <a
              href="https://brightdata.com/cp/start"
              className="rounded-lg bg-bd-blue px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm shadow-bd-blue/30 transition hover:brightness-105"
            >
              Start free trial
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-1 grid h-9 w-9 place-items-center rounded-lg text-bd-muted transition hover:bg-bd-canvas md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
              ) : (
                <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/></svg>
              )}
            </button>
          </div>
        </div>
        {/* Mobile nav drawer */}
        {mobileMenuOpen ? (
          <nav className="border-t border-bd-line bg-white px-4 pb-4 pt-3 md:hidden">
            <div className="flex flex-col gap-3 text-sm font-medium text-bd-muted">
              <a href="https://brightdata.com/cp/scrapers/browse" className="transition hover:text-bd-ink" target="_blank" rel="noreferrer">Scraper Library</a>
              <a href="https://brightdata.com/products/web-scraper/studio" className="transition hover:text-bd-ink" target="_blank" rel="noreferrer">
                <span className="flex items-center gap-1.5">AI Scraper Studio<span className="rounded bg-bd-blue/10 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wider text-bd-blue">New</span></span>
              </a>
              <a href="https://docs.brightdata.com/" className="transition hover:text-bd-ink" target="_blank" rel="noreferrer">Docs</a>
              <a href="https://brightdata.com/pricing" className="transition hover:text-bd-ink" target="_blank" rel="noreferrer">Pricing</a>
              <a href="https://brightdata.com/cp" className="transition hover:text-bd-ink" target="_blank" rel="noreferrer">Log in</a>
            </div>
          </nav>
        ) : null}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        {/* Breadcrumb */}
        <div className="animate-rise mb-6 text-sm text-bd-muted">
          <a href="https://brightdata.com/cp/scrapers/browse" className="hover:text-bd-ink" target="_blank" rel="noreferrer">Scraper Library</a>
          <span className="mx-2 text-bd-line">/</span>
          <span className="font-medium text-bd-ink">Amazon Products</span>
          <span className="mx-2 text-bd-line">/</span>
          <span className="font-medium text-bd-blue">API</span>
        </div>

        <section className="animate-rise grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Main content */}
          <div className="min-w-0">
            {/* Hero card */}
            <div className="rounded-2xl border border-bd-line bg-bd-panel p-5 shadow-[0_10px_30px_rgba(15,34,58,0.05)] sm:p-7">
              <div className="max-w-3xl">
                <h1 className="text-3xl font-extrabold tracking-tight text-bd-navy sm:text-4xl">
                  Amazon Product Scraper
                </h1>
                <p className="mt-2 text-[15px] leading-7 text-bd-muted">
                  Extract prices, reviews, stock levels &amp; seller data from any Amazon page via API
                </p>
                <p className="mt-3 text-[15px] leading-7 text-bd-ink/85">{DESCRIPTION}</p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-bd-line pt-4 text-sm text-bd-muted sm:flex sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
                <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
                  <StarRow />
                  <span className="font-semibold text-bd-ink">4.6</span>
                  <span>on Trustpilot</span>
                </div>
                <span>34.6K+ data deliveries</span>
                <span>5.7K+ active users</span>
                <span className="text-bd-success font-medium">98.4% success rate</span>
                <span className="flex items-center gap-1.5">
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-bd-blue" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13.25 8.5V5a1 1 0 00-1-1h-2.5m-6 0H2.75a1 1 0 00-1 1v7a1 1 0 001 1h4.5M5 4V2.5M9.75 4V2.5M3.75 7h8.5m-2.5 5.5l1.5 1.5 3-3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Last verified: Jul 2026
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="animate-rise-delay mt-5 rounded-2xl border border-bd-line bg-bd-panel shadow-[0_10px_30px_rgba(15,34,58,0.05)]">
              <div className="relative">
                <div className="tab-scroll flex gap-0.5 overflow-x-auto border-b border-bd-line px-1.5 pt-2 sm:gap-1 sm:px-4">
                  {mainTabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setMainTab(tab)}
                      className={`relative whitespace-nowrap rounded-t-lg px-2.5 py-2 text-[13px] font-semibold transition sm:px-3.5 sm:py-2.5 sm:text-sm ${
                        mainTab === tab
                          ? "text-bd-blue"
                          : "text-bd-muted hover:text-bd-ink"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {tab === "Connect Agent" ? <span className="text-xs">🤖</span> : null}
                        {tab === "Edit with AI" ? <span className="text-xs">✨</span> : null}
                        {tab}
                      </span>
                      {mainTab === tab ? (
                        <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-bd-blue" />
                      ) : null}
                    </button>
                  ))}
                </div>
                <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent sm:hidden" />
              </div>

              <div className="p-5 sm:p-6">
                {/* ===== API TAB ===== */}
                {mainTab === "API" ? (
                  <div>
                    <p className="text-[15px] leading-7 text-bd-ink/85">
                      Run this scraper programmatically using Bright Data&apos;s REST API. Choose
                      synchronous for real-time results or asynchronous for bulk jobs.
                    </p>

                    {/* Sync vs async table */}
                    <div className="mt-5 overflow-x-auto rounded-xl border border-bd-line">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-bd-canvas text-left text-xs font-semibold uppercase tracking-wider text-bd-muted">
                            <th className="px-4 py-2.5">Mode</th>
                            <th className="px-4 py-2.5">Endpoint</th>
                            <th className="px-4 py-2.5">Behavior</th>
                            <th className="px-4 py-2.5">Best for</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-bd-line text-bd-ink/85">
                          <tr>
                            <td className="px-4 py-2.5 font-semibold text-bd-navy">Sync</td>
                            <td className="px-4 py-2.5"><code className="rounded bg-bd-blue-soft px-1.5 py-0.5 font-mono text-xs text-bd-blue">/datasets/v3/scrape</code></td>
                            <td className="px-4 py-2.5">Returns data in real time (1-min timeout, auto-switches to async)</td>
                            <td className="px-4 py-2.5">Quick lookups, up to 20 URLs</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 font-semibold text-bd-navy">Async</td>
                            <td className="px-4 py-2.5"><code className="rounded bg-bd-blue-soft px-1.5 py-0.5 font-mono text-xs text-bd-blue">/datasets/v3/trigger</code></td>
                            <td className="px-4 py-2.5">Returns snapshot_id instantly; poll or use webhook</td>
                            <td className="px-4 py-2.5">Production & large jobs, any size</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Language pills */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {apiLangs.map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setApiLang(lang)}
                          className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                            apiLang === lang
                              ? "bg-bd-blue text-white shadow-sm shadow-bd-blue/30"
                              : "border border-bd-line bg-bd-canvas text-bd-muted hover:border-bd-blue-light hover:text-bd-ink"
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>

                    <div className="mt-5">
                      {(apiLang === "Python" || apiLang === "JavaScript" || apiLang === "cURL") ? (
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-lg font-bold text-bd-navy">
                              {apiLang} example
                            </h2>
                            <SyncAsyncToggle mode={apiMode} onChange={setApiMode} />
                          </div>

                          {apiLang === "Python" && apiMode === "sync" ? (
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm text-bd-muted">
                                  Only dependency needed:
                                </p>
                              </div>
                              <CodeBlock code="pip install requests" label="bash" />
                            </div>
                          ) : null}

                          <CodeBlock
                            code={getCodeForLang()}
                            label={apiLang === "cURL" ? "bash" : apiLang.toLowerCase()}
                          />

                          <div className="flex items-start gap-2 rounded-lg border border-bd-blue-light/50 bg-bd-blue-soft/40 px-4 py-3">
                            <span className="mt-0.5 text-bd-blue">💡</span>
                            <p className="text-sm leading-6 text-bd-ink/85">
                              <strong>Authentication:</strong> Pass your API key as a Bearer token in the{" "}
                              <code className="rounded bg-white/60 px-1 py-0.5 font-mono text-xs text-bd-blue">Authorization</code>{" "}
                              header. Get your key at{" "}
                              <a
                                href="https://brightdata.com/cp/setting/users"
                                className="font-semibold text-bd-blue hover:underline"
                                target="_blank"
                                rel="noreferrer"
                              >
                                brightdata.com/cp/setting/users
                              </a>
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {apiLang === "MCP" ? (
                        <div className="space-y-4">
                          <h2 className="text-lg font-bold text-bd-navy">
                            MCP server configuration
                          </h2>
                          <p className="text-sm leading-6 text-bd-muted">
                            Connect Bright Data scrapers to AI agents via Model Context Protocol.
                            Works with Claude Desktop, Cursor, and any MCP-compatible client.
                          </p>
                          <CodeBlock code={MCP_CODE} label="json" />
                          <p className="text-sm text-bd-muted">
                            Learn more in the{" "}
                            <a
                              href="https://docs.brightdata.com/integrations/mcp"
                              className="font-semibold text-bd-blue hover:underline"
                              target="_blank"
                              rel="noreferrer"
                            >
                              MCP integration docs
                            </a>
                          </p>
                        </div>
                      ) : null}

                      {apiLang === "OpenAPI" ? (
                        <div className="space-y-4">
                          <h2 className="text-lg font-bold text-bd-navy">
                            OpenAPI specification
                          </h2>
                          <p className="text-sm leading-6 text-bd-muted">
                            Import this spec into Postman, Swagger UI, or your code generator.
                          </p>
                          <CodeBlock code={OPENAPI_SNIPPET} label="json" />
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {/* ===== INFORMATION TAB ===== */}
                {mainTab === "Information" ? (
                  <article className="space-y-6 text-[15px] leading-7 text-bd-ink/90">
                    <section>
                      <h2 className="text-xl font-bold text-bd-navy">
                        What is Amazon Product Scraper?
                      </h2>
                      <p className="mt-2">
                        Amazon Product Scraper is a pre-built, managed web scraping tool from
                        Bright Data that extracts structured product data from Amazon at scale. Pass
                        product URLs, category pages, or search keywords — get back clean JSON with
                        prices, reviews, stock status, seller details, and more.
                      </p>
                      <p className="mt-3">
                        No need to manage proxies, solve CAPTCHAs, or handle JavaScript rendering.
                        Bright Data&apos;s infrastructure handles all of that automatically.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-bd-navy">
                        How does it work?
                      </h2>
                      <ol className="mt-2 list-decimal space-y-2 pl-5">
                        <li>
                          <strong>Choose your input:</strong> Pass Amazon product URLs, category
                          URLs, or search keywords via the API or the control panel.
                        </li>
                        <li>
                          <strong>Call the API:</strong> Use the synchronous{" "}
                          <code className="rounded bg-bd-blue-soft px-1.5 py-0.5 font-mono text-xs text-bd-blue">/scrape</code>{" "}
                          endpoint for real-time results, or{" "}
                          <code className="rounded bg-bd-blue-soft px-1.5 py-0.5 font-mono text-xs text-bd-blue">/trigger</code>{" "}
                          for large batch jobs.
                        </li>
                        <li>
                          <strong>Get structured data:</strong> Results come back as JSON, CSV, or
                          NDJSON — ready for your pipeline, database, or AI model.
                        </li>
                      </ol>
                      <div className="mt-4 flex items-start gap-3 rounded-xl border border-bd-blue-light/50 bg-gradient-to-r from-bd-blue-soft/40 to-transparent px-4 py-3.5">
                        <span className="mt-0.5 text-lg leading-none">✨</span>
                        <p className="text-sm leading-6 text-bd-ink/85">
                          <strong>Need something different?</strong> Open this scraper in{" "}
                          <a
                            href="https://brightdata.com/products/web-scraper/studio"
                            className="font-semibold text-bd-blue hover:underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Scraper Studio
                          </a>{" "}
                          to customize fields, add filters, or build an entirely new scraper
                          using natural language — no code required.
                        </p>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-bd-navy">
                        What&apos;s included in every request
                      </h2>
                      <p className="mt-2">
                        Every API call is backed by Bright Data&apos;s full infrastructure — no extra
                        setup or fees:
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                        {[
                          ["🔄", "Automatic IP rotation"],
                          ["🧩", "CAPTCHA solving"],
                          ["🌐", "JavaScript rendering"],
                          ["🏠", "Residential proxies"],
                          ["🎭", "User-agent rotation"],
                          ["📍", "Worldwide geotargeting"],
                        ].map(([icon, label]) => (
                          <div
                            key={label}
                            className="flex items-center gap-2 rounded-lg border border-bd-line bg-bd-canvas/60 px-3 py-2.5"
                          >
                            <span className="text-sm">{icon}</span>
                            <span className="text-[13px] font-medium text-bd-navy">{label}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-bd-navy">
                        Delivery methods
                      </h2>
                      <p className="mt-2">
                        Get results via API response, or deliver directly to your storage:
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        <li><strong>API / Webhook</strong> — real-time JSON response or POST to your endpoint</li>
                        <li><strong>Amazon S3</strong> / <strong>Google Cloud Storage</strong> / <strong>Azure Blob</strong></li>
                        <li><strong>Snowflake</strong> / <strong>Google PubSub</strong> / <strong>SFTP</strong></li>
                      </ul>
                      <p className="mt-2">
                        File formats: JSON, NDJSON, CSV, and .gz (compressed).
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-bd-navy">
                        Why scrape Amazon products?
                      </h2>
                      <ul className="mt-2 list-none space-y-2">
                        <li>
                          ➡️ <strong>Competitive pricing:</strong> Monitor competitor prices and
                          adjust your strategy in real time.
                        </li>
                        <li>
                          ➡️ <strong>Market intelligence:</strong> Track product launches, category
                          trends, and bestseller rankings.
                        </li>
                        <li>
                          ➡️ <strong>Review analysis:</strong> Analyze customer sentiment at scale
                          to improve your products.
                        </li>
                        <li>
                          ➡️ <strong>AI training data:</strong> Feed structured e-commerce data into
                          models, RAG pipelines, and recommendation engines.
                        </li>
                      </ul>
                      <p className="mt-3">
                        For more use cases, see{" "}
                        <a
                          href="https://brightdata.com/use-cases/ecommerce"
                          className="font-semibold text-bd-blue hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          web scraping for e-commerce
                        </a>.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-bd-navy">
                        How much does it cost?
                      </h2>
                      <p className="mt-2">
                        Pay-as-you-go starts at $1.50 per 1,000 records — you only pay for
                        successfully delivered results. Start with a free tier that includes 5K
                        records/month (no credit card required). Scale plans drop to $1.30/1K
                        with volume discounts and priority support.
                      </p>
                      <p className="mt-3">
                        <a
                          href="https://brightdata.com/pricing"
                          className="font-semibold text-bd-blue hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          See full pricing details →
                        </a>
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-bd-navy">
                        Is it legal to scrape Amazon?
                      </h2>
                      <p className="mt-2">
                        Bright Data only collects publicly available data. All scraping is performed
                        in compliance with GDPR, CCPA, and SEC regulations. Our dedicated compliance
                        team ensures ethical data collection practices.
                      </p>
                      <p className="mt-3">
                        Learn more at the{" "}
                        <a
                          href="https://brightdata.com/trustcenter"
                          className="font-semibold text-bd-blue hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Bright Data Trust Center
                        </a>.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-bd-navy">
                        More Amazon scrapers
                      </h2>
                      <p className="mt-2">
                        Bright Data offers specialized scrapers for different Amazon data types:
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        <li>
                          <a href="https://brightdata.com/products/web-scraper/amazon" className="font-semibold text-bd-blue hover:underline" target="_blank" rel="noreferrer">
                            Amazon Products by Keyword
                          </a>
                        </li>
                        <li>
                          <a href="https://brightdata.com/products/web-scraper/amazon" className="font-semibold text-bd-blue hover:underline" target="_blank" rel="noreferrer">
                            Amazon Reviews Scraper
                          </a>
                        </li>
                        <li>
                          <a href="https://brightdata.com/products/web-scraper/amazon" className="font-semibold text-bd-blue hover:underline" target="_blank" rel="noreferrer">
                            Amazon Best Sellers Scraper
                          </a>
                        </li>
                        <li>
                          <a href="https://brightdata.com/products/web-scraper/amazon" className="font-semibold text-bd-blue hover:underline" target="_blank" rel="noreferrer">
                            Amazon Sellers Scraper
                          </a>
                        </li>
                      </ul>
                      <p className="mt-3">
                        Browse all 1,000+ scrapers in the{" "}
                        <a href="https://brightdata.com/cp/scrapers/browse" className="font-semibold text-bd-blue hover:underline" target="_blank" rel="noreferrer">
                          Scraper Library
                        </a>.
                      </p>
                    </section>
                  </article>
                ) : null}

                {/* ===== INPUT TAB ===== */}
                {mainTab === "Input" ? (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-bd-navy">Input configuration</h2>
                    <p className="text-[15px] leading-7 text-bd-ink/85">
                      The request body is a JSON array of input objects. Each object must contain at
                      minimum a <code className="rounded bg-bd-blue-soft px-1.5 py-0.5 font-mono text-xs text-bd-blue">url</code> field.
                    </p>

                    <div className="overflow-x-auto rounded-xl border border-bd-line">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-bd-canvas text-left text-xs font-semibold uppercase tracking-wider text-bd-muted">
                            <th className="px-4 py-2.5">Parameter</th>
                            <th className="px-4 py-2.5">Type</th>
                            <th className="px-4 py-2.5">Required</th>
                            <th className="px-4 py-2.5">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-bd-line text-bd-ink/85">
                          <tr>
                            <td className="px-4 py-2.5 font-mono text-xs text-bd-blue">url</td>
                            <td className="px-4 py-2.5">string</td>
                            <td className="px-4 py-2.5">Yes</td>
                            <td className="px-4 py-2.5">Amazon product URL, category URL, or search URL</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 font-mono text-xs text-bd-blue">asin</td>
                            <td className="px-4 py-2.5">string</td>
                            <td className="px-4 py-2.5">No</td>
                            <td className="px-4 py-2.5">Amazon Standard Identification Number (alternative to URL)</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 font-mono text-xs text-bd-blue">zipcode</td>
                            <td className="px-4 py-2.5">string</td>
                            <td className="px-4 py-2.5">No</td>
                            <td className="px-4 py-2.5">Target ZIP code for location-specific pricing and availability</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 font-mono text-xs text-bd-blue">language</td>
                            <td className="px-4 py-2.5">string</td>
                            <td className="px-4 py-2.5">No</td>
                            <td className="px-4 py-2.5">Language code for localized results (e.g. &quot;en&quot;, &quot;de&quot;, &quot;ja&quot;)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h3 className="text-base font-bold text-bd-navy">Query parameters</h3>
                    <div className="overflow-x-auto rounded-xl border border-bd-line">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-bd-canvas text-left text-xs font-semibold uppercase tracking-wider text-bd-muted">
                            <th className="px-4 py-2.5">Parameter</th>
                            <th className="px-4 py-2.5">Type</th>
                            <th className="px-4 py-2.5">Required</th>
                            <th className="px-4 py-2.5">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-bd-line text-bd-ink/85">
                          <tr>
                            <td className="px-4 py-2.5 font-mono text-xs text-bd-blue">dataset_id</td>
                            <td className="px-4 py-2.5">string</td>
                            <td className="px-4 py-2.5">Yes</td>
                            <td className="px-4 py-2.5">Identifies this scraper: <code className="rounded bg-bd-blue-soft px-1 py-0.5 font-mono text-xs">{DATASET_ID}</code></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 font-mono text-xs text-bd-blue">format</td>
                            <td className="px-4 py-2.5">string</td>
                            <td className="px-4 py-2.5">No</td>
                            <td className="px-4 py-2.5">Output format: <code className="rounded bg-bd-blue-soft px-1 py-0.5 font-mono text-xs">json</code> (default), <code className="rounded bg-bd-blue-soft px-1 py-0.5 font-mono text-xs">ndjson</code>, <code className="rounded bg-bd-blue-soft px-1 py-0.5 font-mono text-xs">csv</code></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2.5 font-mono text-xs text-bd-blue">include_errors</td>
                            <td className="px-4 py-2.5">boolean</td>
                            <td className="px-4 py-2.5">No</td>
                            <td className="px-4 py-2.5">Include error items in results</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h3 className="text-base font-bold text-bd-navy">Example request body</h3>
                    <CodeBlock
                      code={`[
  {"url": "https://www.amazon.com/dp/B09X7MPX8L"},
  {"url": "https://www.amazon.com/dp/B0D5CQPGFQ"},
  {"url": "https://www.amazon.com/s?k=wireless+keyboard"}
]`}
                      label="json"
                    />
                  </div>
                ) : null}

                {/* ===== OUTPUT TAB ===== */}
                {mainTab === "Output" ? (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-bd-navy">Sample output</h2>
                    <p className="text-[15px] leading-7 text-bd-ink/85">
                      Each successfully scraped product returns a JSON object with the following
                      fields. All data can be exported as JSON, CSV, or NDJSON.
                    </p>
                    <CodeBlock code={SAMPLE_OUTPUT} label="json" />

                    <h3 className="text-base font-bold text-bd-navy">Output fields</h3>
                    <div className="overflow-x-auto rounded-xl border border-bd-line">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-bd-canvas text-left text-xs font-semibold uppercase tracking-wider text-bd-muted">
                            <th className="px-4 py-2.5">Field</th>
                            <th className="px-4 py-2.5">Type</th>
                            <th className="px-4 py-2.5">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-bd-line text-bd-ink/85">
                          {[
                            ["title", "string", "Product title"],
                            ["url", "string", "Canonical Amazon product URL"],
                            ["asin", "string", "Amazon Standard Identification Number"],
                            ["price", "number", "Current selling price"],
                            ["list_price", "number", "Original list / strike-through price"],
                            ["currency", "string", "ISO currency code (USD, EUR, etc.)"],
                            ["stars", "number", "Average rating (0–5)"],
                            ["reviews_count", "number", "Total number of reviews"],
                            ["in_stock", "boolean", "Whether the product is currently in stock"],
                            ["brand", "string", "Brand name"],
                            ["seller", "object", "Seller name, ID, and URL"],
                            ["features", "array", "Bullet-point product features"],
                            ["categories", "string", "Breadcrumb category path"],
                            ["image", "string", "Main product image URL"],
                          ].map(([field, type, desc]) => (
                            <tr key={field}>
                              <td className="px-4 py-2.5 font-mono text-xs text-bd-blue">{field}</td>
                              <td className="px-4 py-2.5">{type}</td>
                              <td className="px-4 py-2.5">{desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}

                {/* ===== LIVE TEST TAB ===== */}
                {mainTab === "Live Test" ? (
                  <LiveTestPanel />
                ) : null}

                {/* ===== ISSUES TAB ===== */}
                {mainTab === "Issues" ? (
                  <div className="space-y-3">
                    <h2 className="text-xl font-bold text-bd-navy">Feedback & support</h2>
                    <p className="text-[15px] leading-7 text-bd-ink/85">
                      We&apos;re always working on improving scraper performance and data quality. If
                      you encounter issues or have feature requests:
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-[15px] text-bd-ink/85">
                      <li>
                        Check the{" "}
                        <a
                          href="https://brightdata.com/cp/scrapers/gd_l1vijqt9jfj7olije/pdp/logs"
                          className="font-semibold text-bd-blue hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Logs tab
                        </a>{" "}
                        in the control panel for real-time run status.
                      </li>
                      <li>
                        Contact our 24/7 support (under 10 minutes average response time) via{" "}
                        <a
                          href="https://brightdata.com/contact"
                          className="font-semibold text-bd-blue hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          brightdata.com/contact
                        </a>.
                      </li>
                      <li>
                        Browse the{" "}
                        <a
                          href="https://docs.brightdata.com/"
                          className="font-semibold text-bd-blue hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          documentation
                        </a>{" "}
                        for troubleshooting guides and API reference.
                      </li>
                    </ul>
                  </div>
                ) : null}

                {/* ===== CONNECT AGENT TAB ===== */}
                {mainTab === "Connect Agent" ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-bd-navy">
                        Connect your AI agent to this scraper
                      </h2>
                      <p className="mt-2 text-[15px] leading-7 text-bd-ink/85">
                        Give any AI agent — GPT, Claude, Gemini, or your own — the ability to
                        scrape Amazon product data in real time.
                      </p>
                    </div>

                    {/* Agent prompt — top, prominent */}
                    <div className="rounded-xl border border-bd-blue-light/60 bg-gradient-to-r from-bd-blue-soft/40 to-white p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-bold text-bd-navy">
                            Prompt for your agent
                          </h3>
                          <p className="mt-1 text-sm text-bd-muted">
                            Hand this to Claude Code, Cursor, Codex, or any coding agent.
                            Covers sync scrape, bulk with geotargeting, and async pipelines.
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <CodeBlock code={AGENT_PROMPT} label="copy and hand to your agent" />
                      </div>
                    </div>

                    {/* Integration guides */}
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-bd-line" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-bd-muted">Integration guides</span>
                      <div className="h-px flex-1 bg-bd-line" />
                    </div>

                    {/* Platform pills */}
                    <div className="flex flex-wrap gap-2">
                      {(["MCP", "OpenAI SDK", "LangChain", "CrewAI", "REST API"] as AgentPlatform[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setAgentPlatform(p)}
                          className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                            agentPlatform === p
                              ? "bg-bd-blue text-white shadow-sm shadow-bd-blue/30"
                              : "border border-bd-line bg-bd-canvas text-bd-muted hover:border-bd-blue-light hover:text-bd-ink"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    {/* MCP */}
                    {agentPlatform === "MCP" ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-bd-navy">
                            Model Context Protocol (MCP)
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-bd-muted">
                            The fastest way to connect. Works with Claude Desktop, Cursor, VS Code,
                            OpenAI Agent Builder, n8n, and any MCP-compatible client. Bright Data&apos;s
                            MCP server exposes 60+ tools including web search, scraping, and browser automation.
                          </p>
                        </div>

                        <div className="flex items-start gap-2 rounded-lg border border-bd-blue-light/50 bg-bd-blue-soft/40 px-4 py-3">
                          <span className="mt-0.5 text-bd-blue">⚡</span>
                          <p className="text-sm leading-6 text-bd-ink/85">
                            <strong>Hosted — no install needed.</strong> Just paste the URL into your
                            MCP client settings. Replace <code className="rounded bg-white/60 px-1 py-0.5 font-mono text-xs text-bd-blue">&lt;YOUR_API_KEY&gt;</code> with
                            your key from{" "}
                            <a href="https://brightdata.com/cp/setting/users" className="font-semibold text-bd-blue hover:underline" target="_blank" rel="noreferrer">brightdata.com/cp/setting/users</a>.
                          </p>
                        </div>

                        <CodeBlock code={AGENT_MCP_HOSTED} label="MCP server URL" />

                        <p className="text-sm font-semibold text-bd-navy">
                          Or add to your MCP config file (Claude Desktop, Cursor):
                        </p>
                        <CodeBlock code={AGENT_MCP_CONFIG} label="mcp_config.json" />

                        <div className="grid gap-3 sm:grid-cols-3">
                          {[
                            ["Claude Desktop", "https://docs.brightdata.com/ai/mcp-server/integrations/claude-desktop"],
                            ["Cursor", "https://docs.brightdata.com/ai/mcp-server/integrations/cursor"],
                            ["VS Code", "https://docs.brightdata.com/ai/mcp-server/integrations/vscode"],
                          ].map(([name, url]) => (
                            <a
                              key={name}
                              href={url}
                              className="rounded-xl border border-bd-line bg-bd-canvas/60 px-4 py-3 text-center text-sm font-semibold text-bd-blue transition hover:border-bd-blue-light hover:bg-bd-blue-soft/50"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {name} setup →
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {/* OpenAI SDK */}
                    {agentPlatform === "OpenAI SDK" ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-bd-navy">
                            OpenAI SDK (GPT-4o / o-series)
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-bd-muted">
                            Connect GPT-4o and o-series models to Bright Data via the built-in MCP
                            tool type. Your model gets real-time Amazon scraping in one API call.
                          </p>
                        </div>
                        <CodeBlock code="pip install openai" label="bash" />
                        <CodeBlock code={AGENT_OPENAI} label="python" />
                      </div>
                    ) : null}

                    {/* LangChain */}
                    {agentPlatform === "LangChain" ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-bd-navy">
                            LangChain / LangGraph
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-bd-muted">
                            Use the official <code className="rounded bg-bd-blue-soft px-1.5 py-0.5 font-mono text-xs text-bd-blue">langchain-brightdata</code> package
                            to add Amazon scraping as a tool to any LangChain agent.
                          </p>
                        </div>
                        <CodeBlock code="pip install langchain-brightdata langchain-openai langgraph" label="bash" />
                        <CodeBlock code={AGENT_LANGCHAIN} label="python" />
                      </div>
                    ) : null}

                    {/* CrewAI */}
                    {agentPlatform === "CrewAI" ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-bd-navy">
                            CrewAI
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-bd-muted">
                            Build multi-agent workflows with <code className="rounded bg-bd-blue-soft px-1.5 py-0.5 font-mono text-xs text-bd-blue">BrightDataDatasetTool</code>.
                            Give your CrewAI agents the power to scrape Amazon products autonomously.
                          </p>
                        </div>
                        <CodeBlock code="pip install crewai[tools] aiohttp requests" label="bash" />
                        <div className="rounded-lg border border-bd-line bg-bd-canvas px-4 py-3">
                          <p className="text-sm text-bd-muted">
                            Set your environment variables first:
                          </p>
                          <pre className="mt-2 font-mono text-xs text-bd-ink">
                            export BRIGHT_DATA_API_KEY=&quot;your_api_key&quot;{"\n"}
                            export BRIGHT_DATA_ZONE=&quot;your_zone&quot;
                          </pre>
                        </div>
                        <CodeBlock code={AGENT_CREWAI} label="python" />
                      </div>
                    ) : null}

                    {/* REST API */}
                    {agentPlatform === "REST API" ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-bd-navy">
                            Direct REST API (any framework)
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-bd-muted">
                            Wrap this function as a tool in any agent framework — AutoGen, Semantic
                            Kernel, custom agents, or plain scripts. No SDK dependencies needed.
                          </p>
                        </div>
                        <CodeBlock code={AGENT_REST} label="python" />
                      </div>
                    ) : null}

                    {/* Supported platforms grid */}
                    <div className="mt-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-bd-muted">
                        All supported integrations
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {[
                          ["Claude Desktop", "https://docs.brightdata.com/ai/mcp-server/integrations/claude-desktop"],
                          ["Cursor", "https://docs.brightdata.com/ai/mcp-server/integrations/cursor"],
                          ["VS Code", "https://docs.brightdata.com/ai/mcp-server/integrations/vscode"],
                          ["OpenAI Codex", "https://docs.brightdata.com/ai/mcp-server/integrations/codex"],
                          ["Claude Code", "https://docs.brightdata.com/ai/mcp-server/integrations/claude-code"],
                          ["LangChain", "https://docs.brightdata.com/integrations/langchain"],
                          ["CrewAI", "https://docs.brightdata.com/integrations/crew-ai"],
                          ["LlamaIndex", "https://docs.brightdata.com/ai/mcp-server/integrations/llamaindex"],
                          ["n8n", "https://docs.brightdata.com/ai/mcp-server/integrations/n8n"],
                          ["Snowflake", "https://docs.brightdata.com/ai/mcp-server/integrations/snowflake"],
                          ["NVIDIA NeMo", "https://docs.brightdata.com/ai/mcp-server/integrations/nvidia-nemo"],
                          ["Cloudflare Workers", "https://docs.brightdata.com/ai/mcp-server/integrations/cloudflare-agents"],
                        ].map(([name, url]) => (
                          <a
                            key={name}
                            href={url}
                            className="rounded-lg border border-bd-line bg-bd-canvas/60 px-3 py-1.5 text-xs font-medium text-bd-ink transition hover:border-bd-blue-light hover:text-bd-blue"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* ===== EDIT WITH AI TAB ===== */}
                {mainTab === "Edit with AI" ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-bd-navy">
                        Scraper Studio — AI-powered scraper editor
                      </h2>
                      <p className="mt-2 text-[15px] leading-7 text-bd-ink/85">
                        Customize this scraper or build an entirely new one using natural language.
                        Bright Data&apos;s Scraper Studio lets you describe what you need and the AI
                        generates the scraping logic — no code required.
                      </p>
                    </div>

                    {/* Feature grid */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-bd-line bg-bd-canvas/60 p-4">
                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-bd-blue/10 text-bd-blue">
                          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current"><path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616L17.8 12.2a1 1 0 01-1.6 1.2L14 10.667V14a1 1 0 01-.553.894l-3 1.5a1 1 0 01-.894 0l-3-1.5A1 1 0 016 14v-3.333L3.8 13.4a1 1 0 01-1.6-1.2l1.586-4.689-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z"/></svg>
                        </div>
                        <h3 className="font-semibold text-bd-navy">Edit with prompts</h3>
                        <p className="mt-1 text-sm text-bd-muted">
                          Describe changes in plain English — add fields, filter results, change
                          output format. The AI updates the scraper instantly.
                        </p>
                      </div>

                      <div className="rounded-xl border border-bd-line bg-bd-canvas/60 p-4">
                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-bd-blue/10 text-bd-blue">
                          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                        </div>
                        <h3 className="font-semibold text-bd-navy">Build from scratch</h3>
                        <p className="mt-1 text-sm text-bd-muted">
                          Point the AI at any website — it analyzes the page structure and generates
                          a production-ready scraper in minutes.
                        </p>
                      </div>

                      <div className="rounded-xl border border-bd-line bg-bd-canvas/60 p-4">
                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-bd-blue/10 text-bd-blue">
                          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>
                        </div>
                        <h3 className="font-semibold text-bd-navy">Customize output schema</h3>
                        <p className="mt-1 text-sm text-bd-muted">
                          Add custom fields, rename columns, apply transformations — tell the AI
                          exactly what shape you need your data in.
                        </p>
                      </div>

                      <div className="rounded-xl border border-bd-line bg-bd-canvas/60 p-4">
                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-bd-blue/10 text-bd-blue">
                          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current"><path d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"/></svg>
                        </div>
                        <h3 className="font-semibold text-bd-navy">Auto-fix on failures</h3>
                        <p className="mt-1 text-sm text-bd-muted">
                          When a target site changes layout, the AI detects the break and
                          suggests updated selectors automatically.
                        </p>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="rounded-xl border border-bd-blue-light/60 bg-gradient-to-r from-bd-blue-soft/50 to-white p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-bold text-bd-navy">
                            Open this scraper in Scraper Studio
                          </h3>
                          <p className="mt-1 text-sm text-bd-muted">
                            Edit the Amazon Product Scraper with AI or use it as a starting point
                            for a custom scraper.
                          </p>
                        </div>
                        <a
                          href="https://brightdata.com/products/web-scraper/studio"
                          className="shrink-0 rounded-xl bg-bd-blue px-5 py-2.5 text-center text-sm font-bold text-white shadow-md shadow-bd-blue/30 transition hover:brightness-105"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Launch Scraper Studio
                        </a>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* ===== SIDEBAR ===== */}
          <aside className="animate-rise-delay space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-bd-blue-light/60 bg-gradient-to-br from-bd-blue-soft/50 via-white to-white shadow-[0_10px_30px_rgba(61,127,252,0.08)]">
              {/* Free tier banner */}
              <div className="bg-gradient-to-r from-bd-blue to-[#5a9aff] px-5 py-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-semibold uppercase tracking-wider text-white/70">
                      Free tier
                    </p>
                    <p className="mt-0.5 text-xl font-extrabold text-white">
                      5,000 records<span className="text-sm font-semibold text-white/70">/mo</span>
                    </p>
                  </div>
                  <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                    No card required
                  </span>
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-bd-muted">
                  Pay as you go
                </p>
                <p className="mt-1.5 text-2xl font-extrabold tracking-tight text-bd-navy">
                  $1.50{" "}
                  <span className="text-base font-semibold text-bd-muted">/ 1,000 records</span>
                </p>

                <div className="mt-4 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bd-blue/10 text-bd-blue">
                      <svg viewBox="0 0 16 16" className="h-3 w-3 fill-current"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>
                    </span>
                    <p className="text-sm font-semibold leading-5 text-bd-navy">
                      Pay only for successful results
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bd-blue/10 text-bd-blue">
                      <svg viewBox="0 0 16 16" className="h-3 w-3 fill-current"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>
                    </span>
                    <p className="text-sm font-semibold leading-5 text-bd-navy">
                      Volume discounts from $1.30/1K
                    </p>
                  </div>
                </div>

                <a
                  href="https://brightdata.com/pricing"
                  className="mt-4 inline-block text-sm font-semibold text-bd-blue hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Full pricing details →
                </a>
                <a
                  href="https://brightdata.com/cp/start"
                  className="mt-5 block w-full rounded-xl bg-bd-blue px-4 py-3 text-center text-sm font-bold text-white shadow-md shadow-bd-blue/30 transition hover:brightness-105"
                >
                  Start free trial
                </a>
                <a
                  href="https://brightdata.com/cp/scrapers/gd_l1vijqt9jfj7olije/pdp/configuration"
                  className="mt-2 block w-full rounded-xl border border-bd-line bg-white px-4 py-3 text-center text-sm font-bold text-bd-ink transition hover:border-bd-blue-light hover:bg-bd-blue-soft/50"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in control panel
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-bd-line bg-bd-panel p-5 shadow-[0_10px_30px_rgba(15,34,58,0.05)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-bd-muted">
                Performance
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-bd-canvas px-3 py-2.5">
                  <p className="text-lg font-extrabold text-bd-navy">~36s</p>
                  <p className="text-[11px] text-bd-muted">Avg response time</p>
                </div>
                <div className="rounded-lg bg-bd-canvas px-3 py-2.5">
                  <p className="text-lg font-extrabold text-bd-navy">$0.0015</p>
                  <p className="text-[11px] text-bd-muted">Per record</p>
                </div>
                <div className="rounded-lg bg-bd-canvas px-3 py-2.5">
                  <p className="text-lg font-extrabold text-bd-navy">5K</p>
                  <p className="text-[11px] text-bd-muted">URLs per request</p>
                </div>
                <div className="rounded-lg bg-bd-canvas px-3 py-2.5">
                  <p className="text-lg font-extrabold text-bd-success">99.9%</p>
                  <p className="text-[11px] text-bd-muted">Uptime SLA</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-bd-line bg-bd-panel p-5 shadow-[0_10px_30px_rgba(15,34,58,0.05)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-bd-muted">
                Quick reference
              </p>
              <dl className="mt-3 space-y-2.5 text-sm">
                <div>
                  <dt className="text-bd-muted">Base URL</dt>
                  <dd className="font-mono text-xs text-bd-ink">api.brightdata.com</dd>
                </div>
                <div>
                  <dt className="text-bd-muted">Sync endpoint</dt>
                  <dd className="font-mono text-xs text-bd-blue">/datasets/v3/scrape</dd>
                </div>
                <div>
                  <dt className="text-bd-muted">Async endpoint</dt>
                  <dd className="font-mono text-xs text-bd-blue">/datasets/v3/trigger</dd>
                </div>
                <div>
                  <dt className="text-bd-muted">Auth</dt>
                  <dd className="font-mono text-xs text-bd-ink">Bearer &lt;API_KEY&gt;</dd>
                </div>
                <div>
                  <dt className="text-bd-muted">Dataset ID</dt>
                  <dd className="font-mono text-xs text-bd-ink break-all">{DATASET_ID}</dd>
                </div>
                <div>
                  <dt className="text-bd-muted">Formats</dt>
                  <dd className="font-mono text-xs text-bd-ink">json, ndjson, csv</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-bd-line bg-bd-panel p-5 shadow-[0_10px_30px_rgba(15,34,58,0.05)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-bd-muted">
                Resources
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a href="https://docs.brightdata.com/datasets/scrapers/scrapers-library/quickstart" className="text-bd-blue hover:underline font-medium" target="_blank" rel="noreferrer">
                    Quickstart guide
                  </a>
                </li>
                <li>
                  <a href="https://docs.brightdata.com/api-reference/scrapers/synchronous-requests" className="text-bd-blue hover:underline font-medium" target="_blank" rel="noreferrer">
                    Sync API reference
                  </a>
                </li>
                <li>
                  <a href="https://docs.brightdata.com/api-reference/scrapers/asynchronous-requests" className="text-bd-blue hover:underline font-medium" target="_blank" rel="noreferrer">
                    Async API reference
                  </a>
                </li>
                <li>
                  <a href="https://brightdata.com/cp/scrapers/browse" className="text-bd-blue hover:underline font-medium" target="_blank" rel="noreferrer">
                    Browse all 1,000+ scrapers
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </main>

      <footer className="mt-auto border-t border-bd-line/80 bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-bd-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} Bright Data Ltd.</span>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <a href="https://brightdata.com/trustcenter" className="hover:text-bd-ink transition" target="_blank" rel="noreferrer">Trust Center</a>
            <a href="https://brightdata.com/pricing" className="hover:text-bd-ink transition" target="_blank" rel="noreferrer">Pricing</a>
            <a href="https://docs.brightdata.com/" className="hover:text-bd-ink transition" target="_blank" rel="noreferrer">Docs</a>
            <a href="https://brightdata.com/contact" className="hover:text-bd-ink transition" target="_blank" rel="noreferrer">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
