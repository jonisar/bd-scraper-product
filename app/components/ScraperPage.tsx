"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Header, Footer } from "@/components/Chrome";

type MainTab = "Overview" | "Pricing" | "Input" | "API" | "Output" | "Live Test" | "Issues" | "Connect Agent" | "Edit with AI";
type ApiLang = "Python" | "JavaScript" | "cURL" | "MCP" | "OpenAPI";
type AgentPlatform = "Prompt" | "MCP" | "OpenAI SDK" | "LangChain" | "CrewAI" | "REST API";

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
    <div className="overflow-hidden rounded-xl border border-[#2a4060] bg-bd-code-bg shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="font-mono text-xs text-white/55">{label}</span>
        <CopyButton text={code} />
      </div>
      <pre className="code-scroll max-h-[520px] overflow-auto p-3 text-[12px] leading-5 text-[#d7e6ff] sm:p-4 sm:text-[13px] sm:leading-6">
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
              ? "bg-bd-blue-soft text-bd-navy shadow-sm border border-bd-line"
              : "text-bd-ink/70 hover:text-bd-navy"
          }`}
        >
          <span className="sm:hidden">{m === "sync" ? "Sync" : "Async"}</span>
          <span className="hidden sm:inline">{m === "sync" ? "Synchronous (Real-time)" : "Asynchronous (Bulk)"}</span>
        </button>
      ))}
    </div>
  );
}

const RELATED_SCRAPERS = [
  {
    title: "Amazon Reviews Scraper",
    desc: "Extract review text, star ratings, author info, verified purchase status, helpful votes, and review dates at scale.",
    deliveries: "7.2K+",
    stars: 4.8,
    fields: 28,
    avgSpeed: "~25s",
    price: "$1.50",
    href: "https://brightdata.com/products/web-scraper/amazon/reviews",
    signupHref: "https://brightdata.com/cp/start?scraper=amazon-reviews",
    tag: "Reviews",
    emoji: "⭐",
  },
  {
    title: "Amazon Best Sellers",
    desc: "Monitor bestseller rankings, category leaderboards, movers & shakers, and trending products across all departments.",
    deliveries: "34.6K+",
    stars: 4.9,
    fields: 35,
    avgSpeed: "~18s",
    price: "$1.50",
    href: "/products/web-scraper/amazon",
    signupHref: "https://brightdata.com/cp/start?scraper=amazon-best-sellers",
    tag: "Rankings",
    emoji: "🏆",
  },
  {
    title: "Amazon Sellers Info",
    desc: "Seller name, store rating, feedback count, return policy, business address, and seller metrics for competitive analysis.",
    deliveries: "2.4K+",
    stars: 4.7,
    fields: 22,
    avgSpeed: "~20s",
    price: "$1.50",
    href: "https://brightdata.com/products/web-scraper/amazon/seller",
    signupHref: "https://brightdata.com/cp/start?scraper=amazon-sellers",
    tag: "Sellers",
    emoji: "🏪",
  },
  {
    title: "Amazon Price Tracker",
    desc: "Real-time and historical pricing: current price, list price, discount %, deal badges, Buy Box winner, and stock levels.",
    deliveries: "1.6K+",
    stars: 4.8,
    fields: 18,
    avgSpeed: "~15s",
    price: "$1.50",
    href: "https://brightdata.com/products/web-scraper/amazon/price",
    signupHref: "https://brightdata.com/cp/start?scraper=amazon-price-tracker",
    tag: "Pricing",
    emoji: "💰",
  },
  {
    title: "Walmart Products",
    desc: "SKUs, pricing, specifications, images, availability, reviews, and seller info from the second-largest US retailer.",
    deliveries: "5.5K+",
    stars: 4.7,
    fields: 40,
    avgSpeed: "~30s",
    price: "$1.50",
    href: "https://brightdata.com/products/web-scraper/walmart",
    signupHref: "https://brightdata.com/cp/start?scraper=walmart-products",
    tag: "E-commerce",
    emoji: "🛒",
  },
  {
    title: "Google Maps Scraper",
    desc: "Business name, address, phone, website, ratings, review count, hours, photos, and popular times for any location.",
    deliveries: "12.8K+",
    stars: 4.9,
    fields: 45,
    avgSpeed: "~22s",
    price: "$2.50",
    href: "https://brightdata.com/products/web-scraper/google-maps",
    signupHref: "https://brightdata.com/cp/start?scraper=google-maps",
    tag: "Local",
    emoji: "📍",
  },
  {
    title: "LinkedIn Profiles",
    desc: "Professional data: name, headline, company, experience history, skills, education, certifications, and post activity.",
    deliveries: "118.1K+",
    stars: 4.9,
    fields: 52,
    avgSpeed: "~35s",
    price: "$2.50",
    href: "https://brightdata.com/products/web-scraper/linkedin",
    signupHref: "https://brightdata.com/cp/start?scraper=linkedin-profiles",
    tag: "Social",
    emoji: "💼",
  },
  {
    title: "Instagram Profiles",
    desc: "Followers, posts, bio, business category, engagement rate, recent media, hashtag use, and account growth metrics.",
    deliveries: "21.8K+",
    stars: 4.8,
    fields: 38,
    avgSpeed: "~28s",
    price: "$2.50",
    href: "https://brightdata.com/products/web-scraper/instagram",
    signupHref: "https://brightdata.com/cp/start?scraper=instagram-profiles",
    tag: "Social",
    emoji: "📸",
  },
];

function RelatedScrapersCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -310 : 310, behavior: "smooth" });
  };

  const ArrowBtn = ({ dir, show }: { dir: "left" | "right"; show: boolean }) => (
    <button
      type="button"
      onClick={() => scroll(dir)}
      aria-label={`Scroll ${dir}`}
      className={`absolute top-1/2 z-10 -translate-y-1/2 rounded-full border border-bd-line bg-bd-panel/95 p-2.5 shadow-lg backdrop-blur transition-all hover:border-bd-blue-light hover:shadow-bd-blue/15 ${
        dir === "left" ? "left-2" : "right-2"
      } ${show ? "scale-100 opacity-100" : "pointer-events-none scale-75 opacity-0"}`}
    >
      <svg className="h-4 w-4 text-bd-navy" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        {dir === "left"
          ? <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          : <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />}
      </svg>
    </button>
  );

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 pt-2 sm:px-6">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-bd-navy">Popular Similar Scrapers</h2>
          <p className="mt-1 text-sm text-bd-ink/70">
            Related scrapers from the Bright Data library
            <span className="mx-1.5 hidden text-bd-muted/40 sm:inline">·</span>
            <a
              href="https://brightdata.com/cp/scrapers/browse"
              className="mt-1 inline-block font-semibold text-bd-blue hover:underline sm:mt-0 sm:inline"
              target="_blank"
              rel="noreferrer"
            >
              Browse all scrapers →
            </a>
          </p>
        </div>
        <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="rounded-full border border-bd-line bg-bd-panel p-2 transition hover:border-bd-blue-light disabled:opacity-30"
          >
            <svg className="h-4 w-4 text-bd-navy" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="rounded-full border border-bd-line bg-bd-panel p-2 transition hover:border-bd-blue-light disabled:opacity-30"
          >
            <svg className="h-4 w-4 text-bd-navy" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative mt-5">
        {/* Fade edges */}
        <div className={`pointer-events-none absolute inset-y-0 left-0 z-[5] w-12 bg-gradient-to-r from-black to-transparent transition-opacity duration-200 ${canScrollLeft ? "opacity-100" : "opacity-0"}`} />
        <div className={`pointer-events-none absolute inset-y-0 right-0 z-[5] w-12 bg-gradient-to-l from-black to-transparent transition-opacity duration-200 ${canScrollRight ? "opacity-100" : "opacity-0"}`} />

        {/* Floating arrows on mobile */}
        <div className="sm:hidden">
          <ArrowBtn dir="left" show={canScrollLeft} />
          <ArrowBtn dir="right" show={canScrollRight} />
        </div>

        <div
          ref={scrollRef}
          className="related-scroll flex gap-4 overflow-x-auto pb-4 scroll-smooth"
        >
          {RELATED_SCRAPERS.map((s) => (
            <div
              key={s.title}
              className="group flex w-[min(280px,calc(100vw-2.5rem))] shrink-0 flex-col rounded-2xl border border-bd-line bg-bd-panel p-5 shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition hover:border-bd-blue-light hover:shadow-[0_8px_24px_rgba(61,127,252,0.15)] sm:w-[290px]"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg">{s.emoji}</span>
                <span className="rounded-full bg-bd-blue-soft px-2.5 py-0.5 text-[11px] font-semibold text-bd-blue">
                  {s.tag}
                </span>
                <span className="ml-auto flex items-center gap-0.5 text-[11px] font-medium text-amber-500">
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.065 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"/></svg>
                  {s.stars}
                </span>
              </div>
              <h3 className="text-[15px] font-bold text-bd-navy group-hover:text-bd-blue transition">
                {s.title}
              </h3>
              <p className="mt-1.5 flex-1 text-[13px] leading-5 text-bd-ink/70">
                {s.desc}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-bd-canvas px-3 py-2.5 text-center">
                <div>
                  <p className="text-[11px] text-bd-muted">Fields</p>
                  <p className="text-sm font-bold text-bd-navy">{s.fields}</p>
                </div>
                <div>
                  <p className="text-[11px] text-bd-muted">Speed</p>
                  <p className="text-sm font-bold text-bd-navy">{s.avgSpeed}</p>
                </div>
                <div>
                  <p className="text-[11px] text-bd-muted">From</p>
                  <p className="text-sm font-bold text-bd-navy">{s.price}<span className="text-[10px] font-normal text-bd-muted">/1K</span></p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-bd-line pt-3">
                <a
                  href={s.signupHref}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-bd-blue px-3 py-1.5 text-xs font-bold text-white shadow-sm shadow-bd-blue/30 transition hover:brightness-110"
                >
                  Start free
                </a>
                <a
                  href={s.href}
                  {...(s.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="ml-auto text-xs font-semibold text-bd-blue hover:underline"
                >
                  View scraper →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FREE_SAMPLE_DATA = [
  {
    title: "SanDisk 1TB Extreme microSDXC UHS-I Memory Card with Adapter",
    url: "https://www.amazon.com/dp/B09X7MPX8L",
    asin: "B09X7MPX8L",
    in_stock: true,
    brand: "SanDisk",
    price: 145.50,
    list_price: 299.99,
    currency: "USD",
    stars: 4.8,
    reviews_count: 36704,
    categories: "Electronics > Computers & Accessories > Memory Cards > Micro SD Cards",
    image: "https://m.media-amazon.com/images/I/716kSUlHouL.jpg",
    features: ["Save time with card offload speeds of up to 190MB/s", "Up to 130MB/s write speeds for fast shooting", "4K and 5K UHD-ready with UHS Speed Class 3 (U3)"],
    seller: { name: "Direct Suppliers US", id: "A210SJF12S88M5" },
    delivery: "Thursday, January 26",
  },
  {
    title: "Apple AirPods Pro (2nd Generation) Wireless Earbuds",
    url: "https://www.amazon.com/dp/B0D1XD1ZV3",
    asin: "B0D1XD1ZV3",
    in_stock: true,
    brand: "Apple",
    price: 189.99,
    list_price: 249.00,
    currency: "USD",
    stars: 4.7,
    reviews_count: 88412,
    categories: "Electronics > Headphones, Earbuds & Accessories > Earbuds",
    image: "https://m.media-amazon.com/images/I/61SUj2aKoEL.jpg",
    features: ["Active Noise Cancellation up to 2x more effective", "Adaptive Audio blends Transparency mode and ANC", "Personalized Spatial Audio with dynamic head tracking"],
    seller: { name: "Amazon.com", id: "ATVPDKIKX0DER" },
    delivery: "Tomorrow, January 23",
  },
  {
    title: "Anker USB C Charger, 67W 3-Port Compact Wall Charger",
    url: "https://www.amazon.com/dp/B09C5RG6KV",
    asin: "B09C5RG6KV",
    in_stock: true,
    brand: "Anker",
    price: 27.99,
    list_price: 35.99,
    currency: "USD",
    stars: 4.6,
    reviews_count: 14205,
    categories: "Electronics > Cell Phone Accessories > Chargers & Power Adapters",
    image: "https://m.media-amazon.com/images/I/51UgOaBsFHL.jpg",
    features: ["67W total output powers a MacBook Pro at full speed", "Ultra-compact design, 50% smaller than the original", "ActiveShield 2.0 safety system monitors temperature"],
    seller: { name: "AnkerDirect", id: "A294P4X9EWVXLJ" },
    delivery: "Friday, January 24",
  },
  {
    title: "SAMSUNG 990 PRO SSD 2TB PCIe 4.0 M.2 Internal Solid State Drive",
    url: "https://www.amazon.com/dp/B0CHGT4KLH",
    asin: "B0CHGT4KLH",
    in_stock: true,
    brand: "SAMSUNG",
    price: 149.99,
    list_price: 239.99,
    currency: "USD",
    stars: 4.8,
    reviews_count: 9847,
    categories: "Electronics > Computers & Accessories > Data Storage > Internal Solid State Drives",
    image: "https://m.media-amazon.com/images/I/71Gkv-W+NxL.jpg",
    features: ["Sequential read speeds up to 7,450 MB/s", "Heat-resistant nickel coating for thermal control", "PCIe 4.0 NVMe M.2 (2280) form factor"],
    seller: { name: "Amazon.com", id: "ATVPDKIKX0DER" },
    delivery: "Tomorrow, January 23",
  },
  {
    title: "Logitech MX Master 3S Wireless Performance Mouse",
    url: "https://www.amazon.com/dp/B09HM94VDS",
    asin: "B09HM94VDS",
    in_stock: true,
    brand: "Logitech",
    price: 84.99,
    list_price: 99.99,
    currency: "USD",
    stars: 4.6,
    reviews_count: 21350,
    categories: "Electronics > Computers & Accessories > Mice > Wireless Mice",
    image: "https://m.media-amazon.com/images/I/61ni3t1ryQL.jpg",
    features: ["8K DPI any-surface tracking on glass", "Quiet Clicks with 90% less click noise", "MagSpeed scroll wheel — fast, precise, and quiet"],
    seller: { name: "Logitech", id: "A2MGZTKQA37PXP" },
    delivery: "Saturday, January 25",
  },
];

const FREE_SAMPLE_LIMIT = 3;
const FREE_SAMPLE_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const LS_KEY = "bd_live_test_samples";

function getFreeSampleState(): { remaining: number; resetAt: number | null } {
  if (typeof window === "undefined") return { remaining: FREE_SAMPLE_LIMIT, resetAt: null };
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { remaining: FREE_SAMPLE_LIMIT, resetAt: null };
    const data = JSON.parse(raw);
    if (Date.now() > data.resetAt) {
      localStorage.removeItem(LS_KEY);
      return { remaining: FREE_SAMPLE_LIMIT, resetAt: null };
    }
    return { remaining: Math.max(0, FREE_SAMPLE_LIMIT - data.count), resetAt: data.resetAt };
  } catch {
    return { remaining: FREE_SAMPLE_LIMIT, resetAt: null };
  }
}

function recordFreeSample() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const data = raw ? JSON.parse(raw) : { count: 0, resetAt: Date.now() + FREE_SAMPLE_COOLDOWN_MS };
    if (Date.now() > data.resetAt) {
      localStorage.setItem(LS_KEY, JSON.stringify({ count: 1, resetAt: Date.now() + FREE_SAMPLE_COOLDOWN_MS }));
    } else {
      data.count += 1;
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    }
  } catch { /* localStorage unavailable */ }
}

function LiveTestPanel() {
  const [mode, setMode] = useState<"free" | "apikey">("free");
  const [apiKey, setApiKey] = useState("");
  const [urls, setUrls] = useState("https://www.amazon.com/dp/B09X7MPX8L");
  const [format, setFormat] = useState<"json" | "csv" | "ndjson">("json");
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [result, setResult] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [sampleState, setSampleState] = useState(getFreeSampleState);

  const runFree = useCallback(async () => {
    const state = getFreeSampleState();
    if (state.remaining <= 0) {
      setStatus("error");
      const mins = state.resetAt ? Math.ceil((state.resetAt - Date.now()) / 60000) : 0;
      const hours = Math.floor(mins / 60);
      const m = mins % 60;
      setResult(`Free sample limit reached (3 per 24 hours).\nResets in ${hours}h ${m}m.\n\nUse your own API key for unlimited testing, or sign up free at brightdata.com/cp/start`);
      return;
    }

    setStatus("running");
    setResult("");
    const start = Date.now();
    const timer = window.setInterval(() => setElapsed(Date.now() - start), 100);

    await new Promise((r) => setTimeout(r, 1800 + Math.random() * 1200));

    window.clearInterval(timer);
    setElapsed(Date.now() - start);

    recordFreeSample();
    setSampleState(getFreeSampleState());
    setResult(JSON.stringify(FREE_SAMPLE_DATA, null, 2));
    setStatus("done");
  }, []);

  const runWithKey = useCallback(async () => {
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
        <h2 className="text-xl font-bold text-bd-navy">Test the Amazon Scraper API Live</h2>
        <p className="mt-1 text-sm text-bd-ink/70">
          See what the Amazon Product Scraper returns. Try a free sample instantly
          or use your API key for custom queries.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="inline-flex rounded-lg border border-bd-line bg-bd-canvas p-0.5">
        <button
          type="button"
          onClick={() => { setMode("free"); setStatus("idle"); setResult(""); }}
          className={`rounded-md px-3.5 py-2 text-sm font-semibold transition ${
            mode === "free"
              ? "bg-bd-blue-soft text-bd-navy shadow-sm border border-bd-line"
              : "text-bd-ink/70 hover:text-bd-navy"
          }`}
        >
          Free sample
        </button>
        <button
          type="button"
          onClick={() => { setMode("apikey"); setStatus("idle"); setResult(""); }}
          className={`rounded-md px-3.5 py-2 text-sm font-semibold transition ${
            mode === "apikey"
              ? "bg-bd-blue-soft text-bd-navy shadow-sm border border-bd-line"
              : "text-bd-ink/70 hover:text-bd-navy"
          }`}
        >
          With API key
        </button>
      </div>

      {mode === "free" ? (
          <div className="rounded-xl border border-bd-blue/30 bg-gradient-to-r from-bd-blue-soft to-bd-panel p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-bd-navy">
                  Try it now — no login required
                </p>
                <p className="mt-0.5 text-[13px] text-bd-muted">
                  Returns 5 real Amazon product records. {sampleState.remaining}/{FREE_SAMPLE_LIMIT} free samples remaining.
                </p>
              </div>
              <button
                type="button"
                onClick={runFree}
                disabled={status === "running" || sampleState.remaining <= 0}
                className="w-full shrink-0 rounded-xl bg-bd-blue px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-bd-blue/30 transition hover:brightness-105 disabled:opacity-60 sm:w-auto"
              >
                {status === "running" ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Scraping…
                  </span>
                ) : sampleState.remaining <= 0 ? (
                  "Limit reached"
                ) : (
                  "Run free sample"
                )}
              </button>
            </div>
            {sampleState.remaining <= 0 && sampleState.resetAt ? (
              <p className="mt-2.5 text-xs text-bd-muted">
                Resets in {Math.floor(Math.max(0, sampleState.resetAt - Date.now()) / 3600000)}h{" "}
                {Math.ceil((Math.max(0, sampleState.resetAt - Date.now()) % 3600000) / 60000)}m.
                Want unlimited? {" "}
                <a href="https://brightdata.com/cp/start" className="font-semibold text-bd-blue hover:underline" target="_blank" rel="noreferrer">
                  Start free →
                </a>
              </p>
            ) : null}
          </div>
      ) : (
        <>
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
              className="mt-1.5 w-full rounded-lg border border-bd-line bg-bd-canvas px-3.5 py-2.5 font-mono text-sm text-bd-ink placeholder:text-bd-muted/50 focus:border-bd-blue focus:outline-none focus:ring-2 focus:ring-bd-blue/20"
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

          <div>
            <label htmlFor="lt-urls" className="block text-sm font-semibold text-bd-navy">
              Amazon URLs <span className="font-normal text-bd-muted">(one per line)</span>
            </label>
            <textarea
              id="lt-urls"
              rows={3}
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-bd-line bg-bd-canvas px-3.5 py-2.5 font-mono text-sm text-bd-ink placeholder:text-bd-muted/50 focus:border-bd-blue focus:outline-none focus:ring-2 focus:ring-bd-blue/20"
              placeholder="https://www.amazon.com/dp/B09X7MPX8L"
            />
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label htmlFor="lt-format" className="block text-sm font-semibold text-bd-navy">
                Format
              </label>
              <select
                id="lt-format"
                value={format}
                onChange={(e) => setFormat(e.target.value as "json" | "csv" | "ndjson")}
                className="mt-1.5 rounded-lg border border-bd-line bg-bd-canvas px-3 py-2.5 text-sm text-bd-ink focus:border-bd-blue focus:outline-none focus:ring-2 focus:ring-bd-blue/20"
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="ndjson">NDJSON</option>
              </select>
            </div>
            <button
              type="button"
              onClick={runWithKey}
              disabled={status === "running"}
              className="rounded-xl bg-bd-blue px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-bd-blue/30 transition hover:brightness-105 disabled:opacity-60"
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
        </>
      )}

      {/* Status bar */}
      {status !== "idle" ? (
        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
            status === "running"
              ? "border border-bd-blue/30 bg-bd-blue-soft text-bd-blue"
              : status === "done"
                ? "border border-green-800 bg-green-950/50 text-green-400"
                : "border border-red-800 bg-red-950/50 text-red-400"
          }`}
        >
          {status === "running" ? "⏳" : status === "done" ? "✅" : "❌"}
          <span>
            {status === "running"
              ? `Scraping… ${(elapsed / 1000).toFixed(1)}s`
              : status === "done"
                ? `Completed in ${(elapsed / 1000).toFixed(1)}s — ${mode === "free" ? "5 sample records" : "live results"}`
                : "Error"}
          </span>
        </div>
      ) : null}

      {/* Result */}
      {result ? (
        <div className="overflow-hidden rounded-xl border border-[#2a4060] bg-bd-code-bg shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <span className="font-mono text-xs text-white/55">
              {status === "done" ? (mode === "free" ? "sample response — 5 records" : "response") : "error"}
            </span>
            <CopyButton text={result} />
          </div>
          <pre className="code-scroll max-h-[500px] overflow-auto p-3 text-[12px] leading-5 text-[#d7e6ff] sm:p-4 sm:text-[13px] sm:leading-6">
            <code className="font-mono whitespace-pre">{result}</code>
          </pre>
        </div>
      ) : null}

      {/* Callout */}
      {status === "idle" ? (
        <div className="flex items-start gap-2 rounded-lg border border-bd-line bg-bd-canvas px-4 py-3">
          <span className="mt-0.5">{mode === "free" ? "🎁" : "🔒"}</span>
          <p className="text-sm leading-6 text-bd-ink/70">
            {mode === "free" ? (
              <>Free samples show real data structure with 5 product records. No API key or sign-up needed. For live custom queries, switch to &quot;With API key&quot;.</>
            ) : (
              <>Your API key is sent directly from your browser to{" "}
              <code className="rounded bg-bd-panel px-1 py-0.5 font-mono text-xs text-bd-ink">api.brightdata.com</code>.
              It is never stored or sent to any other server.</>
            )}
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
  const [agentPlatform, setAgentPlatform] = useState<AgentPlatform>("Prompt");

  const mainTabs: MainTab[] = ["Overview", "Pricing", "API", "Input", "Output", "Live Test", "Connect Agent", "Edit with AI", "Issues"];
  const apiLangs: ApiLang[] = ["Python", "JavaScript", "cURL", "MCP", "OpenAPI"];

  function getCodeForLang() {
    if (apiLang === "Python") return apiMode === "sync" ? PYTHON_SYNC : PYTHON_ASYNC;
    if (apiLang === "JavaScript") return apiMode === "sync" ? JS_SYNC : JS_ASYNC;
    if (apiLang === "cURL") return apiMode === "sync" ? CURL_SYNC : CURL_ASYNC;
    return "";
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        {/* Breadcrumb */}
        <nav className="animate-rise mb-5 flex flex-wrap items-center gap-x-0 gap-y-1 text-sm text-bd-muted sm:mb-6" aria-label="Breadcrumb">
          <a href="https://brightdata.com/products" className="hover:text-bd-navy" target="_blank" rel="noreferrer">Products</a>
          <span className="mx-1.5 text-bd-muted/50 sm:mx-2" aria-hidden="true">/</span>
          <a href="/products/web-scraper" className="hover:text-bd-navy">Web Scraper API</a>
          <span className="mx-1.5 text-bd-muted/50 sm:mx-2" aria-hidden="true">/</span>
          <a href="/products/web-scraper/amazon" className="hover:text-bd-navy">Amazon</a>
          <span className="mx-1.5 text-bd-muted/50 sm:mx-2" aria-hidden="true">/</span>
          <span className="font-medium text-bd-blue" aria-current="page">Amazon Product Scraper</span>
        </nav>

        <section className="animate-rise grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Main content */}
          <div className="min-w-0">
            {/* Hero card */}
            <div className="rounded-2xl border border-bd-line bg-bd-panel p-4 shadow-[0_10px_40px_rgba(0,0,0,0.3)] sm:p-7">
              <div className="max-w-3xl">
                <h1 className="text-[1.75rem] font-extrabold tracking-tight text-bd-navy sm:text-4xl">
                  Amazon Product Scraper
                </h1>
                <p className="mt-2 text-[15px] leading-7 text-bd-muted">
                  Extract prices, reviews, stock levels &amp; seller data from any Amazon page via API
                </p>
                <a
                  href={`https://brightdata.com/cp/scrapers/${DATASET_ID}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2.5 inline-flex max-w-full items-center gap-2 rounded-lg border border-bd-line bg-bd-canvas px-3 py-1.5 text-xs transition hover:border-bd-blue-light hover:bg-bd-blue-soft"
                >
                  <span className="shrink-0 text-bd-muted">Dataset ID</span>
                  <code className="min-w-0 truncate font-mono font-semibold text-bd-blue">{DATASET_ID}</code>
                  <svg className="h-3 w-3 shrink-0 text-bd-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-4.5-4.5h6m0 0v6m0-6L13.5 16.5" />
                  </svg>
                </a>
                <p className="mt-3 text-[15px] leading-7 text-bd-ink">{DESCRIPTION}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-bd-muted sm:gap-x-5">
                  {[
                    { name: "Trustpilot", rating: "4.6", color: "#f5b301", href: "https://www.trustpilot.com/review/brightdata.com" },
                    { name: "G2", rating: "4.6", color: "#ff492c", href: "https://www.g2.com/products/bright-data/reviews" },
                    { name: "Capterra", rating: "4.8", color: "#e97b1e", href: "https://www.capterra.com/p/146810/Luminati/" },
                  ].map((p) => (
                    <a key={p.name} href={p.href} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 transition hover:opacity-70">
                      <span className="font-medium">{p.name}</span>
                      <span className="flex items-center gap-px">{Array.from({ length: 5 }).map((_, i) => <svg key={i} viewBox="0 0 20 20" className="h-3 w-3" aria-hidden="true"><path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.9 5.06 16.7l.94-5.5-4-3.9 5.53-.8L10 1.5z" fill={p.color} /></svg>)}</span>
                      <span className="font-semibold text-bd-ink">{p.rating}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-x-3 overflow-x-auto border-t border-bd-line pt-4 text-sm text-bd-muted sm:gap-x-4">
                <span className="shrink-0"><span className="font-semibold text-bd-ink">34.7K+</span> deliveries</span>
                <span className="shrink-0 text-bd-line">·</span>
                <span className="shrink-0"><span className="font-semibold text-bd-ink">5.7K+</span> users</span>
                <span className="shrink-0 text-bd-line">·</span>
                <span className="shrink-0 font-medium text-bd-success">98.4% success</span>
                <span className="shrink-0 text-bd-line">·</span>
                <span className="shrink-0 font-medium text-bd-success">Verified Jul 2026</span>
                <span className="shrink-0 text-bd-line">·</span>
                <span className="shrink-0 font-medium text-bd-success">GDPR &amp; CCPA Compliance</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="animate-rise-delay mt-5 rounded-2xl border border-bd-line bg-bd-panel shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
              <div className="sticky top-14 z-30 rounded-t-2xl border-b border-bd-line bg-bd-panel">
                <div className="tab-scroll flex gap-0.5 overflow-x-auto px-1.5 pt-2 sm:gap-1 sm:px-4">
                  {mainTabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setMainTab(tab)}
                      className={`relative whitespace-nowrap rounded-t-lg px-2.5 py-2 text-[13px] font-semibold transition sm:px-3.5 sm:py-2.5 sm:text-sm ${
                        mainTab === tab
                          ? "text-bd-blue"
                          : "text-bd-ink hover:text-bd-navy"
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
                <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-bd-panel to-transparent sm:hidden" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-bd-panel to-transparent sm:hidden" />
              </div>

              <div className="p-4 sm:p-6">
                {/* ===== API TAB ===== */}
                {mainTab === "API" ? (
                  <div>
                    <p className="text-[15px] leading-7 text-bd-ink">
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
                        <tbody className="divide-y divide-bd-line text-bd-ink">
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
                          className={`rounded-full px-3 py-1.5 text-[13px] font-semibold transition sm:px-3.5 sm:text-sm ${
                            apiLang === lang
                              ? "bg-bd-blue text-white shadow-sm shadow-bd-blue/30"
                              : "border border-bd-line bg-bd-canvas text-bd-ink/70 hover:border-bd-blue-light hover:text-bd-navy"
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
                              Amazon Scraper API — {apiLang} Example
                            </h2>
                            <SyncAsyncToggle mode={apiMode} onChange={setApiMode} />
                          </div>

                          {apiLang === "Python" && apiMode === "sync" ? (
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm text-bd-ink/70">
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

                          <div className="flex items-start gap-2 rounded-lg border border-bd-blue/30 bg-bd-blue-soft px-4 py-3">
                            <span className="mt-0.5 text-bd-blue">💡</span>
                            <p className="text-sm leading-6 text-bd-ink">
                              <strong>Authentication:</strong> Pass your API key as a Bearer token in the{" "}
                              <code className="rounded bg-bd-canvas px-1 py-0.5 font-mono text-xs text-bd-blue">Authorization</code>{" "}
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
                            Amazon Scraper MCP Server Configuration
                          </h2>
                          <p className="text-sm leading-6 text-bd-ink/70">
                            Connect Bright Data scrapers to AI agents via Model Context Protocol.
                            Works with Claude Desktop, Cursor, and any MCP-compatible client.
                          </p>
                          <CodeBlock code={MCP_CODE} label="json" />
                          <p className="text-sm text-bd-ink/70">
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
                            Amazon Scraper OpenAPI Specification
                          </h2>
                          <p className="text-sm leading-6 text-bd-ink/70">
                            Import this spec into Postman, Swagger UI, or your code generator.
                          </p>
                          <CodeBlock code={OPENAPI_SNIPPET} label="json" />
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {/* ===== PRICING TAB ===== */}
                {mainTab === "Pricing" ? (
                  <div className="space-y-6">
                    <section>
                      <h2 className="text-xl font-bold text-bd-navy">
                        Amazon Scraper Pricing
                      </h2>
                      <p className="mt-2 text-[15px] leading-7 text-bd-ink">
                        Pay-as-you-go starts at <strong>$1.50 per 1,000 records</strong> — you only pay for
                        successfully delivered results. Start with a free tier that includes <strong>5,000
                        records/month</strong> (no credit card required). Scale plans drop to <strong>$1.30/1K</strong>{" "}
                        with volume discounts, priority throughput, and dedicated support.
                      </p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {[
                          { plan: "Free", price: "$0", detail: "5K records/month, no credit card", features: ["5,000 records/month", "All output formats", "Standard throughput", "Community support"], cta: "Start free", ctaHref: "https://brightdata.com/cp/start", ctaPrimary: true },
                          { plan: "Pay As You Go", price: "$1.50", detail: "Per 1K records, pay for success only", features: ["Unlimited records", "All output formats", "Standard throughput", "Email support", "Pay only for successful results"], cta: "Get started", ctaHref: "https://brightdata.com/cp/start", ctaPrimary: true },
                          { plan: "Scale", price: "$1.30", detail: "Per 1K records, volume discounts + priority", features: ["Unlimited records", "All output formats", "Priority throughput", "Dedicated support", "Volume discounts", "Custom SLA available"], cta: "Contact sales", ctaHref: "https://brightdata.com/contact-sales", ctaPrimary: false },
                        ].map((p) => (
                          <div key={p.plan} className="flex flex-col rounded-xl border border-bd-line bg-bd-canvas px-5 py-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-bd-muted">{p.plan}</p>
                            <p className="mt-1.5 text-3xl font-extrabold text-bd-navy">{p.price}</p>
                            <p className="mt-0.5 text-xs text-bd-muted">{p.detail}</p>
                            <ul className="mt-4 flex-1 space-y-2">
                              {p.features.map((f) => (
                                <li key={f} className="flex items-center gap-2 text-sm text-bd-ink">
                                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-bd-blue/10 text-bd-blue">
                                    <svg viewBox="0 0 16 16" className="h-2.5 w-2.5 fill-current"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>
                                  </span>
                                  {f}
                                </li>
                              ))}
                            </ul>
                            <a
                              href={p.ctaHref}
                              className={`mt-auto block rounded-lg px-4 py-2.5 text-center text-sm font-bold transition ${p.ctaPrimary ? "bg-bd-blue text-white shadow-md shadow-bd-blue/30 hover:brightness-105" : "border border-bd-line bg-bd-canvas text-bd-ink hover:border-bd-blue-light hover:bg-bd-blue-soft"}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {p.cta}
                            </a>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-bold text-bd-navy">How Pricing Works</h3>
                      <div className="mt-3 space-y-2.5">
                        {[
                          { q: "What counts as a record?", a: "One successfully scraped product = one record. Failed or errored requests are not charged." },
                          { q: "Are there setup fees?", a: "No setup fees, no minimum commitment. Start free and scale when ready." },
                          { q: "How does the free tier work?", a: "Every Bright Data account includes 5,000 free records per month — no credit card required. Credits renew on the 1st of each month." },
                          { q: "What happens when free credits run out?", a: "If you have pre-deposited funds, usage continues at PAYG rates. Otherwise, requests return an error until you add funds or credits renew." },
                          { q: "Are there volume discounts?", a: "Yes. Scale plans start at $1.30/1K records with further discounts for high-volume commitments. Contact sales for custom pricing." },
                        ].map((item) => (
                          <details key={item.q} open className="group rounded-xl border border-bd-line bg-bd-panel px-4 py-3">
                            <summary className="list-none flex cursor-pointer items-start justify-between gap-3 font-semibold text-bd-navy">
                              <span className="min-w-0">{item.q}</span>
                              <svg className="mt-0.5 h-4 w-4 shrink-0 text-bd-muted transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                              </svg>
                            </summary>
                            <p className="mt-2 text-[13px] leading-6 text-bd-ink/70">{item.a}</p>
                          </details>
                        ))}
                      </div>
                    </section>

                    <a
                      href="https://brightdata.com/cp/start"
                      className="inline-block rounded-xl bg-bd-blue px-5 py-3 text-center text-sm font-bold text-white shadow-md shadow-bd-blue/30 transition hover:brightness-105"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Start free — 5K records/month
                    </a>
                  </div>
                ) : null}

                {/* ===== INFORMATION TAB ===== */}
                {mainTab === "Overview" ? (
                  <article className="space-y-8 text-[15px] leading-7 text-bd-ink">
                    {/* Table of Contents — grouped clusters */}
                    <nav className="rounded-xl border border-bd-line bg-bd-canvas px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-bd-muted">On this page</p>
                      <div className="mt-3 grid gap-x-8 gap-y-4 sm:grid-cols-3">
                        <div>
                          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-bd-navy/50">Get started</p>
                          {[
                            ["what-is", "What Is It?"],
                            ["how-it-works", "How It Works"],
                            ["getting-started", "Getting Started"],
                            ["python-quickstart", "Python Quick Start"],
                            ["whats-included", "What\u2019s Included"],
                          ].map(([id, label]) => (
                            <a key={id} href={`#info-${id}`} className="block truncate text-[13px] font-medium text-bd-blue hover:underline" onClick={(e) => { e.preventDefault(); document.getElementById(`info-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{label}</a>
                          ))}
                        </div>
                        <div>
                          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-bd-navy/50">Product</p>
                          {[
                            ["data-fields", "Data Fields"],
                            ["tech-specs", "Specs & Benchmarks"],
                            ["marketplaces", "Marketplaces"],
                            ["available-scrapers", "Scraper Family"],
                            ["delivery", "Delivery & Integrations"],
                          ].map(([id, label]) => (
                            <a key={id} href={`#info-${id}`} className="block truncate text-[13px] font-medium text-bd-blue hover:underline" onClick={(e) => { e.preventDefault(); document.getElementById(`info-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{label}</a>
                          ))}
                        </div>
                        <div>
                          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-bd-navy/50">Learn more</p>
                          {[
                            ["faq", "FAQ"],
                            ["vs-diy", "Scraper vs. DIY"],
                            ["challenges", "Challenges & Solutions"],
                            ["use-cases", "Use Cases"],
                            ["legal", "Legal & Compliance"],
                            ["more-tools", "More Tools"],
                          ].map(([id, label]) => (
                            <a key={id} href={`#info-${id}`} className="block truncate text-[13px] font-medium text-bd-blue hover:underline" onClick={(e) => { e.preventDefault(); document.getElementById(`info-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{label}</a>
                          ))}
                        </div>
                      </div>
                    </nav>

                    {/* ── ACT 1: Orient & start ── */}

                    <section id="info-what-is">
                      <h2 className="text-xl font-bold text-bd-navy">
                        What Is the Amazon Scraper?
                      </h2>
                      <p className="mt-2">
                        The Bright Data Amazon Scraper is a pre-built, fully managed web scraping API that
                        extracts structured product data from Amazon at scale. Pass product URLs, ASINs,
                        category pages, or search keywords — get back clean JSON with titles, prices, reviews,
                        Best Sellers Rank, stock status, seller details, images, bullet points, and 40+ more fields.
                      </p>
                      <p className="mt-3">
                        No need to manage proxies, solve CAPTCHAs, or handle JavaScript rendering.
                        Bright Data&apos;s infrastructure handles all of that automatically — you focus on the data.
                      </p>
                    </section>

                    <section id="info-how-it-works">
                      <h2 className="text-xl font-bold text-bd-navy">
                        How Does the Amazon Scraper Work?
                      </h2>
                      <ol className="mt-2 list-decimal space-y-2 pl-5">
                        <li>
                          <strong>Choose your input:</strong> Pass Amazon product URLs, ASINs,
                          category URLs, or search keywords via the API or the control panel.
                        </li>
                        <li>
                          <strong>Call the API:</strong> Use the synchronous{" "}
                          <code className="rounded bg-bd-blue-soft px-1.5 py-0.5 font-mono text-xs text-bd-blue">/scrape</code>{" "}
                          endpoint for real-time results (median ~3s), or{" "}
                          <code className="rounded bg-bd-blue-soft px-1.5 py-0.5 font-mono text-xs text-bd-blue">/trigger</code>{" "}
                          for large batch jobs up to 5,000 URLs per request.
                        </li>
                        <li>
                          <strong>Get structured data:</strong> Results come back as JSON, CSV, or
                          NDJSON — ready for your pipeline, database, or AI model.
                        </li>
                      </ol>
                      <div className="mt-4 flex items-start gap-3 rounded-xl border border-bd-blue/30 bg-gradient-to-r from-bd-blue-soft to-transparent px-4 py-3.5">
                        <span className="mt-0.5 text-lg leading-none">✨</span>
                        <p className="text-sm leading-6 text-bd-ink">
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

                    <section id="info-getting-started">
                      <h2 className="text-xl font-bold text-bd-navy">
                        Getting Started with the Amazon Scraper
                      </h2>
                      <p className="mt-2">
                        Go from zero to structured Amazon data in under five minutes:
                      </p>
                      <div className="mt-3 space-y-3">
                        {[
                          {
                            step: "1",
                            title: "Create a free Bright Data account",
                            desc: "Sign up at brightdata.com/cp/start — no credit card required. Your account includes 5,000 free records/month.",
                            link: "https://brightdata.com/cp/start",
                          },
                          {
                            step: "2",
                            title: "Get your API key",
                            desc: "Go to Settings → API Keys in the control panel. Copy your Bearer token for API authentication.",
                            link: "https://brightdata.com/cp/setting/users",
                          },
                          {
                            step: "3",
                            title: "Send your first request",
                            desc: "POST a JSON array of Amazon URLs or ASINs to the /scrape endpoint. See the API tab for code examples in Python, JavaScript, and cURL.",
                            link: null,
                          },
                          {
                            step: "4",
                            title: "Process your data",
                            desc: "Parse the JSON response or set up delivery to S3, Snowflake, or a webhook. Scale up with async /trigger for bulk jobs.",
                            link: null,
                          },
                        ].map((s) => (
                          <div key={s.step} className="flex gap-4 rounded-xl border border-bd-line bg-bd-canvas px-4 py-3.5">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bd-blue text-sm font-bold text-white">
                              {s.step}
                            </span>
                            <div>
                              <p className="font-bold text-bd-navy">
                                {s.link ? (
                                  <a href={s.link} className="hover:text-bd-blue hover:underline" target="_blank" rel="noreferrer">
                                    {s.title} →
                                  </a>
                                ) : s.title}
                              </p>
                              <p className="mt-0.5 text-[13px] leading-5 text-bd-ink/70">{s.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section id="info-python-quickstart">
                      <h2 className="text-xl font-bold text-bd-navy">
                        Amazon Scraper Python Quick Start
                      </h2>
                      <p className="mt-2">
                        Scrape your first Amazon product in 5 lines of Python. No proxy setup, no
                        CAPTCHA handling, no HTML parsing — just structured JSON from a single API call:
                      </p>
                      <CodeBlock
                        code={`import requests

response = requests.post(
    "https://api.brightdata.com/datasets/v3/scrape?dataset_id=${DATASET_ID}&format=json",
    headers={"Authorization": "Bearer <YOUR_API_KEY>", "Content-Type": "application/json"},
    json=[{"url": "https://www.amazon.com/dp/B09X7MPX8L"}]
)

products = response.json()
for p in products:
    print(f"{p['title']} — ${'{'}p['price']{'}'} ({'{'}p['stars']{'}'} stars, {'{'}p['reviews_count']{'}'} reviews)")`}
                        label="python"
                      />
                      <p className="mt-3 text-sm text-bd-ink/70">
                        This returns the full product record (40+ fields) as parsed JSON — title, price,
                        images, BSR, reviews, seller data, and more. See the <strong>API tab</strong> for
                        sync vs. async examples and code in JavaScript and cURL.
                      </p>
                    </section>

                    <section id="info-whats-included">
                      <h2 className="text-xl font-bold text-bd-navy">
                        What&apos;s Included in Every Amazon Scraper Request
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
                            className="flex items-center gap-2 rounded-lg border border-bd-line bg-bd-canvas px-3 py-2.5"
                          >
                            <span className="text-sm">{icon}</span>
                            <span className="text-[13px] font-medium text-bd-navy">{label}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* ── ACT 2: Product surface ── */}

                    <section id="info-data-fields">
                      <h2 className="text-xl font-bold text-bd-navy">
                        What Amazon Data Can You Extract?
                      </h2>
                      <p className="mt-2">
                        Each successful Amazon scraper request returns a rich JSON object with 40+ structured
                        fields. All fields are parsed, typed, and ready for analytics, databases, or AI pipelines.
                      </p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {[
                          {
                            cat: "Identity & Metadata",
                            fields: "ASIN, parent ASIN, canonical URL, page type, scrape timestamp",
                          },
                          {
                            cat: "Title & Copy",
                            fields: "Full product title, bullet points, long-form description, A+ content",
                          },
                          {
                            cat: "Brand & Seller",
                            fields: "Brand name, manufacturer, store URL, seller name, FBA / Prime status",
                          },
                          {
                            cat: "Pricing & Deals",
                            fields: "Current price, list price, discount %, coupon, Subscribe & Save, lightning deals",
                          },
                          {
                            cat: "Availability",
                            fields: "In-stock status, max quantity, delivery date, fastest delivery estimate",
                          },
                          {
                            cat: "Ratings & Reviews",
                            fields: "Star rating, review count, star distribution, review text, verified purchase flag",
                          },
                          {
                            cat: "Rankings & Categories",
                            fields: "Best Sellers Rank (BSR), category breadcrumbs, department hierarchy",
                          },
                          {
                            cat: "Media & Specs",
                            fields: "High-res image URLs, video availability, technical details, dimensions, weight",
                          },
                        ].map((g) => (
                          <div key={g.cat} className="rounded-xl border border-bd-line bg-bd-canvas px-4 py-3">
                            <p className="text-sm font-bold text-bd-navy">{g.cat}</p>
                            <p className="mt-1 text-[13px] leading-5 text-bd-ink/70">{g.fields}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section id="info-tech-specs">
                      <h2 className="text-xl font-bold text-bd-navy">
                        Technical Specifications & Benchmarks
                      </h2>
                      <div className="mt-3 overflow-x-auto rounded-xl border border-bd-line">
                        <table className="w-full text-sm">
                          <tbody className="divide-y divide-bd-line text-bd-ink">
                            {[
                              ["API endpoints", "Synchronous (/scrape) and Asynchronous (/trigger)"],
                              ["Authentication", "Bearer token (API key)"],
                              ["Max URLs per request", "5,000 (async), 25 (sync)"],
                              ["Median response time", "~3 seconds (sync, single URL)"],
                              ["Success rate", "98.4% (industry avg ~95%)"],
                              ["Output fields", "40+ structured fields per product (industry avg 15–25)"],
                              ["Output formats", "JSON, NDJSON, CSV, .gz compressed"],
                              ["Geotargeting", "18 Amazon marketplaces worldwide"],
                              ["Uptime SLA", "99.9%"],
                              ["Rate limits", "Based on plan — Scale plans include priority throughput"],
                              ["SDKs & integrations", "Python, JavaScript, cURL, MCP, OpenAI, LangChain, CrewAI"],
                            ].map(([label, value]) => (
                              <tr key={label}>
                                <td className="whitespace-nowrap px-4 py-2.5 font-medium text-bd-navy">{label}</td>
                                <td className="px-4 py-2.5 text-bd-ink/60">{value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="mt-2 text-xs text-bd-muted">
                        Sources: Proxyway Amazon Scraper Benchmark 2025, AIMultiple Amazon Scraper Comparison 2026.
                      </p>
                    </section>

                    <section id="info-marketplaces">
                      <h2 className="text-xl font-bold text-bd-navy">
                        Supported Amazon Marketplaces
                      </h2>
                      <p className="mt-2">
                        The Amazon scraper supports all major Amazon marketplace domains. Use the
                        geotargeting parameter or pass locale-specific URLs to scrape any region:
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {[
                          "amazon.com", "amazon.co.uk", "amazon.de", "amazon.fr", "amazon.it",
                          "amazon.es", "amazon.co.jp", "amazon.ca", "amazon.com.au", "amazon.in",
                          "amazon.com.br", "amazon.com.mx", "amazon.nl", "amazon.se", "amazon.pl",
                          "amazon.sg", "amazon.sa", "amazon.ae",
                        ].map((d) => (
                          <span key={d} className="rounded-full border border-bd-line bg-bd-canvas px-3 py-1 font-mono text-xs text-bd-navy">
                            {d}
                          </span>
                        ))}
                      </div>
                    </section>

                    <section id="info-available-scrapers">
                      <h2 className="text-xl font-bold text-bd-navy">
                        Available Amazon Scrapers
                      </h2>
                      <p className="mt-2">
                        Bright Data offers a family of specialized Amazon scrapers, each optimized for a
                        specific data type or input method:
                      </p>
                      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                        {[
                          { name: "Amazon Products (by URL)", href: "/products/web-scraper/amazon/amazon-product-scraper" },
                          { name: "Amazon Products by Best Sellers Category", href: "/products/web-scraper/amazon/amazon-product-scraper" },
                          { name: "Amazon Products by Category URL", href: "/products/web-scraper/amazon/amazon-product-scraper" },
                          { name: "Amazon Products by Keywords", href: "/products/web-scraper/amazon/amazon-product-scraper" },
                          { name: "Amazon Products by UPC", href: "/products/web-scraper/amazon/amazon-product-scraper" },
                          { name: "Amazon Reviews", href: "https://brightdata.com/products/web-scraper/amazon/reviews" },
                          { name: "Amazon Sellers Info", href: "https://brightdata.com/products/web-scraper/amazon/seller" },
                          { name: "Amazon Products Global Dataset", href: "/products/web-scraper/amazon" },
                          { name: "Amazon Global by Category URL", href: "/products/web-scraper/amazon" },
                          { name: "Amazon Global by Keyword Search", href: "/products/web-scraper/amazon" },
                          { name: "Amazon Global by Best Sellers", href: "/products/web-scraper/amazon" },
                          { name: "Amazon Global by Seller URL", href: "/products/web-scraper/amazon" },
                          { name: "Amazon Global by Brand URL", href: "/products/web-scraper/amazon" },
                          { name: "Amazon Products Search", href: "/products/web-scraper/amazon" },
                        ].map((scraper) => (
                          <a
                            key={scraper.name}
                            href={scraper.href}
                            {...(scraper.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                            className="group flex items-center gap-2 rounded-xl border border-bd-line bg-bd-canvas px-4 py-3 transition hover:border-bd-blue-light hover:bg-bd-blue-soft"
                          >
                            <span className="text-sm text-bd-blue">●</span>
                            <span className="min-w-0 flex-1 text-[13px] font-medium text-bd-navy group-hover:text-bd-blue">
                              {scraper.name}
                            </span>
                            <span className="shrink-0 text-xs font-semibold text-bd-blue opacity-0 transition group-hover:opacity-100">
                              →
                            </span>
                          </a>
                        ))}
                      </div>
                    </section>

                    <section id="info-delivery">
                      <h2 className="text-xl font-bold text-bd-navy">
                        Delivery Methods & Integrations
                      </h2>
                      <p className="mt-2">
                        Get results via API response, or deliver directly to your storage and workflows:
                      </p>
                      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                        {[
                          {
                            icon: "📡",
                            title: "API / Webhook",
                            tools: "Real-time JSON response, POST to your endpoint, polling with snapshot_id",
                          },
                          {
                            icon: "☁️",
                            title: "Cloud storage",
                            tools: "Amazon S3, Google Cloud Storage, Azure Blob, SFTP, Alibaba Cloud OSS",
                          },
                          {
                            icon: "🗄️",
                            title: "Databases & warehouses",
                            tools: "PostgreSQL, MySQL, MongoDB, BigQuery, Snowflake, Redshift",
                          },
                          {
                            icon: "📈",
                            title: "BI & analytics",
                            tools: "Tableau, Looker, Power BI, Google Sheets, Excel, Metabase",
                          },
                          {
                            icon: "🤖",
                            title: "AI & ML pipelines",
                            tools: "LangChain, OpenAI, Claude, RAG frameworks, Hugging Face, vector DBs",
                          },
                          {
                            icon: "⚙️",
                            title: "Automation & orchestration",
                            tools: "Airflow, Prefect, n8n, Zapier, Make, GitHub Actions, cron jobs",
                          },
                        ].map((i) => (
                          <div key={i.title} className="rounded-xl border border-bd-line bg-bd-panel px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span>{i.icon}</span>
                              <p className="font-bold text-bd-navy">{i.title}</p>
                            </div>
                            <p className="mt-1 text-[13px] leading-5 text-bd-ink/70">{i.tools}</p>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-sm text-bd-ink/70">
                        File formats: JSON, NDJSON, CSV, and .gz (compressed).
                      </p>
                    </section>

                    {/* ── ACT 3: Learn more ── */}

                    <section id="info-faq">
                      <h2 className="text-xl font-bold text-bd-navy">
                        Frequently Asked Questions About the Amazon Scraper
                      </h2>
                      <div className="mt-3 divide-y divide-bd-line rounded-xl border border-bd-line">
                        {[
                          {
                            q: "What is the Amazon Scraper API?",
                            a: "A fully managed REST API that extracts structured product data from Amazon. Send URLs or ASINs, get back clean JSON with 40+ fields — prices, reviews, seller info, stock levels, and more.",
                          },
                          {
                            q: "How does the Amazon Scraper API work?",
                            a: "POST Amazon URLs to the /scrape endpoint for real-time results (median ~3s) or /trigger for async bulk jobs up to 5,000 URLs. Bright Data handles proxies, CAPTCHAs, and JavaScript rendering automatically.",
                          },
                          {
                            q: "Is there a free tier?",
                            a: "Yes. Every account includes 5,000 free records per month — no credit card required. Credits renew on the 1st of each month.",
                          },
                          {
                            q: "What happens when free credits run out?",
                            a: "If you have pre-deposited funds, usage continues at PAYG rates ($1.50/1K records). Otherwise, requests pause until you add funds or credits renew next month.",
                          },
                          {
                            q: "What are the usage limits?",
                            a: "No hard limits. The API supports unlimited concurrency and bulk requests of up to 5,000 URLs per call. Scale plans include priority throughput.",
                          },
                          {
                            q: "Is the API compliant with data protection regulations?",
                            a: "Yes. All data collection complies with GDPR, CCPA, and SEC regulations. Only publicly available data is collected — the same information any logged-out shopper can see.",
                          },
                          {
                            q: "Can I use it for competitive analysis?",
                            a: "Absolutely. Track competitor pricing, Buy Box winners, bestseller rankings, review velocity, and seller metrics across all 18 Amazon marketplaces.",
                          },
                          {
                            q: "How do I integrate with my existing systems?",
                            a: "Use the REST API directly, or deliver data to S3, Snowflake, Google Cloud Storage, webhooks, and more. SDKs available for Python, JavaScript, MCP, LangChain, and CrewAI.",
                          },
                          {
                            q: "What delivery methods and file formats are supported?",
                            a: "Delivery via API response, webhook, Amazon S3, Google Cloud Storage, Azure Blob, Snowflake, PubSub, and SFTP. Formats: JSON, NDJSON, CSV, and .gz compressed.",
                          },
                          {
                            q: "Do you provide support?",
                            a: "Yes — 24/7 dedicated support with under 10 minutes average response time, available via chat, email, or phone.",
                          },
                        ].map((faq) => (
                          <details key={faq.q} open className="group px-4 py-3.5">
                            <summary className="list-none flex cursor-pointer items-start justify-between gap-3 font-semibold text-bd-navy">
                              <span className="min-w-0">{faq.q}</span>
                              <svg className="mt-0.5 h-4 w-4 shrink-0 text-bd-muted transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                              </svg>
                            </summary>
                            <p className="mt-2 text-[13px] leading-6 text-bd-ink/70">{faq.a}</p>
                          </details>
                        ))}
                      </div>
                    </section>

                    <section id="info-vs-diy">
                      <h2 className="text-xl font-bold text-bd-navy">
                        Amazon Scraper vs. Building Your Own
                      </h2>
                      <p className="mt-2">
                        Building an Amazon scraper from scratch requires solving proxy rotation, CAPTCHA
                        bypasses, JavaScript rendering, and constantly adapting to Amazon&apos;s layout changes.
                        Here&apos;s how the Bright Data Amazon Scraper compares:
                      </p>
                      <div className="mt-3 overflow-x-auto rounded-xl border border-bd-line">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-bd-canvas text-left text-xs font-semibold uppercase tracking-wider text-bd-muted">
                              <th className="px-4 py-2.5">Capability</th>
                              <th className="px-4 py-2.5">DIY Scraper</th>
                              <th className="px-4 py-2.5">Bright Data Amazon Scraper</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-bd-line text-bd-ink">
                            {[
                              ["Proxy management", "You manage pool, rotation, bans", "Built-in residential + datacenter"],
                              ["CAPTCHA solving", "Integrate 3rd-party service", "Automatic, included in price"],
                              ["JavaScript rendering", "Run headless browsers", "Server-side, zero config"],
                              ["Amazon layout changes", "You fix broken selectors", "Maintained by Bright Data team"],
                              ["Geotargeting", "Buy proxies per country", "18 marketplaces, one API"],
                              ["Output format", "Custom parsing logic", "Clean JSON / CSV / NDJSON"],
                              ["Uptime & reliability", "Depends on your infra", "99.9% SLA, 24/7 monitoring"],
                              ["Time to first result", "Days–weeks of development", "Minutes — one API call"],
                            ].map(([cap, diy, bd]) => (
                              <tr key={cap}>
                                <td className="px-4 py-2.5 font-medium text-bd-navy">{cap}</td>
                                <td className="px-4 py-2.5 text-bd-ink/60">{diy}</td>
                                <td className="px-4 py-2.5 font-medium text-bd-navy">{bd}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>

                    <section id="info-challenges">
                      <h2 className="text-xl font-bold text-bd-navy">
                        Amazon Scraping Challenges & How Bright Data Solves Them
                      </h2>
                      <p className="mt-2">
                        Amazon runs one of the most aggressive anti-bot stacks on the web — AWS WAF, TLS
                        fingerprinting, behavioral analysis, and IP reputation scoring. Here&apos;s how the
                        managed scraper handles each layer automatically:
                      </p>
                      <div className="mt-3 space-y-2.5">
                        {[
                          {
                            challenge: "IP blocking & rate limiting",
                            solution: "Automatic rotation across millions of residential and datacenter IPs worldwide.",
                          },
                          {
                            challenge: "CAPTCHA challenges",
                            solution: "Built-in CAPTCHA solving — handled server-side, no 3rd-party service needed.",
                          },
                          {
                            challenge: "Dynamic JavaScript rendering",
                            solution: "Full browser rendering on every request. All dynamic content is captured.",
                          },
                          {
                            challenge: "TLS & browser fingerprinting",
                            solution: "Real browser TLS handshakes (JA3/JA4), accurate HTTP/2 settings, and realistic Sec-Fetch-* headers.",
                          },
                          {
                            challenge: "Frequent layout changes",
                            solution: "Bright Data maintains and updates parsers continuously — zero maintenance for you.",
                          },
                          {
                            challenge: "Geo-restricted pricing",
                            solution: "Geotargeting across 18 marketplaces with ZIP code–level precision.",
                          },
                          {
                            challenge: "Anti-bot behavioral analysis",
                            solution: "User-agent rotation, realistic browser profiles, and human-like request patterns.",
                          },
                        ].map((c) => (
                          <div key={c.challenge} className="rounded-xl border border-bd-line bg-bd-panel px-4 py-3.5">
                            <p className="font-bold text-bd-navy">{c.challenge}</p>
                            <p className="mt-1 text-[13px] leading-5 text-bd-ink/70">{c.solution}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section id="info-use-cases">
                      <h2 className="text-xl font-bold text-bd-navy">
                        Amazon Scraper Use Cases
                      </h2>
                      <p className="mt-2">
                        Amazon is the world&apos;s largest e-commerce platform with millions of product listings
                        updated daily. Teams across industries use the Amazon scraper for:
                      </p>
                      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                        {[
                          {
                            icon: "💰",
                            title: "Price monitoring & repricing",
                            desc: "Track competitor prices, Buy Box winners, and discount patterns. Automate repricing strategies in real time.",
                          },
                          {
                            icon: "📊",
                            title: "Market research & trends",
                            desc: "Monitor BSR, new launches, category shifts, and seasonal demand. Identify emerging niches early.",
                          },
                          {
                            icon: "⭐",
                            title: "Review & sentiment analysis",
                            desc: "Extract review text, ratings, and verified purchase flags at scale for NLP and brand monitoring.",
                          },
                          {
                            icon: "🛡️",
                            title: "Brand protection & MAP",
                            desc: "Detect unauthorized sellers, counterfeits, and MAP violations across all Amazon regions.",
                          },
                          {
                            icon: "🤖",
                            title: "AI training data & RAG",
                            desc: "Feed structured e-commerce data into LLMs, recommendation engines, and product knowledge bases.",
                          },
                          {
                            icon: "📦",
                            title: "Catalog & inventory tracking",
                            desc: "Enrich your product database with Amazon data. Track stock levels and delivery estimates.",
                          },
                        ].map((uc) => (
                          <div key={uc.title} className="flex gap-3 rounded-xl border border-bd-line bg-bd-panel px-4 py-3.5">
                            <span className="mt-0.5 text-lg">{uc.icon}</span>
                            <div>
                              <p className="font-bold text-bd-navy">{uc.title}</p>
                              <p className="mt-0.5 text-[13px] leading-5 text-bd-ink/70">{uc.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-sm text-bd-ink/70">
                        Used by e-commerce brands, hedge funds, AI teams, market research firms, agencies, and academic researchers.{" "}
                        <a
                          href="https://brightdata.com/use-cases/ecommerce"
                          className="font-semibold text-bd-blue hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          See all e-commerce use cases →
                        </a>
                      </p>
                    </section>

                    {/* ── ACT 4: Trust & exit ── */}

                    <section id="info-legal">
                      <h2 className="text-xl font-bold text-bd-navy">
                        Is It Legal to Scrape Amazon?
                      </h2>
                      <p className="mt-2">
                        Bright Data only collects publicly available data. All scraping is performed
                        in compliance with GDPR, CCPA, and SEC regulations. Our dedicated compliance
                        team ensures ethical data collection practices. The data returned by the Amazon
                        scraper is the same information any logged-out shopper can see on a product page.
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

                    <section id="info-more-tools">
                      <h2 className="text-xl font-bold text-bd-navy">
                        More Amazon Scraper Tools
                      </h2>
                      <p className="mt-2">
                        Bright Data offers specialized scrapers for different Amazon data types:
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        <li>
                          <a href="/products/web-scraper/amazon/amazon-product-scraper" className="font-semibold text-bd-blue hover:underline">
                            Amazon Products by Keyword
                          </a>
                        </li>
                        <li>
                          <a href="https://brightdata.com/products/web-scraper/amazon/reviews" className="font-semibold text-bd-blue hover:underline" target="_blank" rel="noreferrer">
                            Amazon Reviews Scraper
                          </a>
                        </li>
                        <li>
                          <a href="/products/web-scraper/amazon" className="font-semibold text-bd-blue hover:underline">
                            Amazon Best Sellers Scraper
                          </a>
                        </li>
                        <li>
                          <a href="https://brightdata.com/products/web-scraper/amazon/seller" className="font-semibold text-bd-blue hover:underline" target="_blank" rel="noreferrer">
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
                    <h2 className="text-xl font-bold text-bd-navy">Amazon Scraper Input Configuration</h2>
                    <p className="text-[15px] leading-7 text-bd-ink">
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
                        <tbody className="divide-y divide-bd-line text-bd-ink">
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

                    <h3 className="text-base font-bold text-bd-navy">Amazon Scraper API Query Parameters</h3>
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
                        <tbody className="divide-y divide-bd-line text-bd-ink">
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

                    <h3 className="text-base font-bold text-bd-navy">Amazon Scraper Example Request Body</h3>
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
                    <h2 className="text-xl font-bold text-bd-navy">Amazon Scraper Sample Output</h2>
                    <p className="text-[15px] leading-7 text-bd-ink">
                      Each successfully scraped product returns a JSON object with the following
                      fields. All data can be exported as JSON, CSV, or NDJSON.
                    </p>
                    <CodeBlock code={SAMPLE_OUTPUT} label="json" />

                    <h3 className="text-base font-bold text-bd-navy">Amazon Scraper Output Fields</h3>
                    <div className="overflow-x-auto rounded-xl border border-bd-line">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-bd-canvas text-left text-xs font-semibold uppercase tracking-wider text-bd-muted">
                            <th className="px-4 py-2.5">Field</th>
                            <th className="px-4 py-2.5">Type</th>
                            <th className="px-4 py-2.5">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-bd-line text-bd-ink">
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
                    <h2 className="text-xl font-bold text-bd-navy">Amazon Scraper Feedback & Support</h2>
                    <p className="text-[15px] leading-7 text-bd-ink">
                      We&apos;re always working on improving scraper performance and data quality. If
                      you encounter issues or have feature requests:
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-[15px] text-bd-ink">
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
                        Connect Your AI Agent to the Amazon Scraper
                      </h2>
                      <p className="mt-2 text-[15px] leading-7 text-bd-ink">
                        Give any AI agent — GPT, Claude, Gemini, or your own — the ability to
                        scrape Amazon product data in real time.
                      </p>
                    </div>

                    {/* Platform pills */}
                    <div className="flex flex-wrap gap-2">
                      {(["Prompt", "MCP", "OpenAI SDK", "LangChain", "CrewAI", "REST API"] as AgentPlatform[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setAgentPlatform(p)}
                          className={`rounded-full px-3 py-1.5 text-[13px] font-semibold transition sm:px-3.5 sm:text-sm ${
                            agentPlatform === p
                              ? "bg-bd-blue text-white shadow-sm shadow-bd-blue/30"
                              : "border border-bd-line bg-bd-canvas text-bd-ink/70 hover:border-bd-blue-light hover:text-bd-navy"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    {/* Prompt */}
                    {agentPlatform === "Prompt" ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-bd-navy">
                            Amazon Scraper Prompt for Your Agent
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-bd-ink/70">
                            Copy and hand this to Claude Code, Cursor, Codex, or any coding agent.
                            Covers sync scrape, bulk with geotargeting, and async pipelines.
                          </p>
                        </div>
                        <CodeBlock code={AGENT_PROMPT} label="copy and hand to your agent" />
                      </div>
                    ) : null}

                    {/* MCP */}
                    {agentPlatform === "MCP" ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-bd-navy">
                            Amazon Scraper via MCP (Model Context Protocol)
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-bd-ink/70">
                            The fastest way to connect. Works with Claude Desktop, Cursor, VS Code,
                            OpenAI Agent Builder, n8n, and any MCP-compatible client. Bright Data&apos;s
                            MCP server exposes 60+ tools including web search, scraping, and browser automation.
                          </p>
                        </div>

                        <div className="flex items-start gap-2 rounded-lg border border-bd-blue/30 bg-bd-blue-soft px-4 py-3">
                          <span className="mt-0.5 text-bd-blue">⚡</span>
                          <p className="text-sm leading-6 text-bd-ink">
                            <strong>Hosted — no install needed.</strong> Just paste the URL into your
                            MCP client settings. Replace <code className="rounded bg-bd-canvas px-1 py-0.5 font-mono text-xs text-bd-blue">&lt;YOUR_API_KEY&gt;</code> with
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
                              className="rounded-xl border border-bd-line bg-bd-canvas px-4 py-3 text-center text-sm font-semibold text-bd-blue transition hover:border-bd-blue-light hover:bg-bd-blue-soft"
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
                            Amazon Scraper with OpenAI SDK
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-bd-ink/70">
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
                            Amazon Scraper with LangChain / LangGraph
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-bd-ink/70">
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
                            Amazon Scraper with CrewAI
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-bd-ink/70">
                            Build multi-agent workflows with <code className="rounded bg-bd-blue-soft px-1.5 py-0.5 font-mono text-xs text-bd-blue">BrightDataDatasetTool</code>.
                            Give your CrewAI agents the power to scrape Amazon products autonomously.
                          </p>
                        </div>
                        <CodeBlock code="pip install crewai[tools] aiohttp requests" label="bash" />
                        <div className="rounded-lg border border-bd-line bg-bd-canvas px-4 py-3">
                          <p className="text-sm text-bd-ink/70">
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
                            Amazon Scraper REST API Integration
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-bd-ink/70">
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
                            className="rounded-lg border border-bd-line bg-bd-canvas px-3 py-1.5 text-xs font-medium text-bd-ink transition hover:border-bd-blue-light hover:text-bd-blue"
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
                        Edit the Amazon Scraper with AI
                      </h2>
                      <p className="mt-2 text-[15px] leading-7 text-bd-ink">
                        Customize this scraper or build an entirely new one using natural language.
                        Bright Data&apos;s Scraper Studio lets you describe what you need and the AI
                        generates the scraping logic — no code required.
                      </p>
                    </div>

                    {/* Feature grid */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-bd-line bg-bd-canvas p-4">
                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-bd-blue/10 text-bd-blue">
                          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current"><path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616L17.8 12.2a1 1 0 01-1.6 1.2L14 10.667V14a1 1 0 01-.553.894l-3 1.5a1 1 0 01-.894 0l-3-1.5A1 1 0 016 14v-3.333L3.8 13.4a1 1 0 01-1.6-1.2l1.586-4.689-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z"/></svg>
                        </div>
                        <h3 className="font-semibold text-bd-navy">Edit with prompts</h3>
                        <p className="mt-1 text-sm text-bd-ink/70">
                          Describe changes in plain English — add fields, filter results, change
                          output format. The AI updates the scraper instantly.
                        </p>
                      </div>

                      <div className="rounded-xl border border-bd-line bg-bd-canvas p-4">
                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-bd-blue/10 text-bd-blue">
                          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                        </div>
                        <h3 className="font-semibold text-bd-navy">Build from scratch</h3>
                        <p className="mt-1 text-sm text-bd-ink/70">
                          Point the AI at any website — it analyzes the page structure and generates
                          a production-ready scraper in minutes.
                        </p>
                      </div>

                      <div className="rounded-xl border border-bd-line bg-bd-canvas p-4">
                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-bd-blue/10 text-bd-blue">
                          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>
                        </div>
                        <h3 className="font-semibold text-bd-navy">Customize output schema</h3>
                        <p className="mt-1 text-sm text-bd-ink/70">
                          Add custom fields, rename columns, apply transformations — tell the AI
                          exactly what shape you need your data in.
                        </p>
                      </div>

                      <div className="rounded-xl border border-bd-line bg-bd-canvas p-4">
                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-bd-blue/10 text-bd-blue">
                          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current"><path d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"/></svg>
                        </div>
                        <h3 className="font-semibold text-bd-navy">Auto-fix on failures</h3>
                        <p className="mt-1 text-sm text-bd-ink/70">
                          When a target site changes layout, the AI detects the break and
                          suggests updated selectors automatically.
                        </p>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="rounded-xl border border-bd-blue/30 bg-gradient-to-r from-bd-blue-soft to-bd-panel p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-bold text-bd-navy">
                            Open this scraper in Scraper Studio
                          </h3>
                          <p className="mt-1 text-sm text-bd-ink/70">
                            Edit the Amazon Product Scraper with AI or use it as a starting point
                            for a custom scraper.
                          </p>
                        </div>
                        <a
                          href="https://brightdata.com/products/web-scraper/studio"
                          className="w-full shrink-0 rounded-xl bg-bd-blue px-5 py-2.5 text-center text-sm font-bold text-white shadow-md shadow-bd-blue/30 transition hover:brightness-105 sm:w-auto"
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
          <aside className="animate-rise-delay space-y-4 lg:sticky lg:top-[4.5rem] lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-bd-blue/30 bg-gradient-to-br from-bd-blue-soft via-bd-panel to-bd-panel shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              {/* Free tier banner */}
              <div className="bg-gradient-to-r from-bd-blue to-[#5a9aff] px-4 py-4 sm:px-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
                  Free tier
                </p>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                  <p className="whitespace-nowrap text-xl font-extrabold text-white">
                    5,000 records<span className="text-sm font-semibold text-white/70">/mo</span>
                  </p>
                  <span className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold text-white">
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
                  <span className="text-sm font-semibold text-bd-muted sm:text-base">/ 1,000 records</span>
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
                  href="https://brightdata.com/cp/start"
                  className="mt-5 block w-full rounded-xl bg-bd-blue px-4 py-3 text-center text-sm font-bold text-white shadow-md shadow-bd-blue/30 transition hover:brightness-105"
                >
                  Start free
                </a>
                <a
                  href="https://brightdata.com/contact-sales"
                  className="mt-2 block w-full rounded-xl border border-bd-line bg-bd-canvas px-4 py-3 text-center text-sm font-bold text-bd-ink transition hover:border-bd-blue-light hover:bg-bd-blue-soft"
                  target="_blank"
                  rel="noreferrer"
                >
                  Contact sales
                </a>
              </div>
            </div>

            <a
              href="https://brightdata.com/products/datasets/amazon"
              target="_blank"
              rel="noreferrer"
              className="group block overflow-hidden rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition hover:shadow-[0_14px_36px_rgba(0,0,0,0.35)]"
            >
              <div className="bg-gradient-to-r from-[#7b5ea7] via-[#9b6bb8] to-[#d94f8e] px-5 py-5 text-center">
                <p className="text-[15px] font-semibold leading-6 text-white">
                  Just want Amazon data?
                </p>
                <p className="mt-1 text-[15px] leading-6 text-white">
                  Purchase an{" "}
                  <span className="font-bold underline decoration-white/60 underline-offset-2 group-hover:decoration-white">
                    Amazon dataset
                  </span>
                </p>
              </div>
            </a>

            <div className="rounded-2xl border border-bd-line bg-bd-panel p-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
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

            <div className="rounded-2xl border border-bd-line bg-bd-panel p-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
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
          </aside>
        </section>

        {/* Related scrapers gallery — full width */}
        <RelatedScrapersCarousel />
      </main>

      <Footer />
    </div>
  );
}
