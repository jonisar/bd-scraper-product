"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import TrustedByStrip from "@/components/TrustedByStrip";
import ScraperCard from "@/components/ScraperCard";
import AiPromptCta from "@/components/AiPromptCta";

type MainTab = "Overview" | "Pricing" | "Input" | "API" | "Output" | "Playground" | "Connect Agent" | "Customize";
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
  "Extract prices, reviews, stock levels, and seller data from any Amazon product page via API. No proxy management, no anti-bot headaches — just send URLs and get structured JSON back.";

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
    name: "Amazon Reviews Scraper",
    domain: "amazon.com",
    category: "Reviews",
    desc: "Extract review text, star ratings, author info, verified purchase status, helpful votes, and review dates at scale.",
    fieldsPreview: "review_text, rating, author, verified_purchase, helpful_votes, date",
    views: "7.2K+",
    downloads: "1.8K+",
    href: "https://brightdata.com/products/web-scraper/amazon/reviews",
  },
  {
    name: "Amazon Best Sellers",
    domain: "amazon.com",
    category: "Rankings",
    desc: "Monitor bestseller rankings, category leaderboards, movers & shakers, and trending products across all departments.",
    fieldsPreview: "rank, title, price, rating, category, sales_volume",
    views: "34.6K+",
    downloads: "5.1K+",
    href: "/products/web-scraper/amazon",
  },
  {
    name: "Amazon Sellers Info",
    domain: "amazon.com",
    category: "Sellers",
    desc: "Seller name, store rating, feedback count, return policy, business address, and seller metrics for competitive analysis.",
    fieldsPreview: "seller_name, rating, feedback_count, return_policy, address",
    views: "2.4K+",
    downloads: "820+",
    href: "https://brightdata.com/products/web-scraper/amazon/seller",
  },
  {
    name: "Amazon Price Tracker",
    domain: "amazon.com",
    category: "Pricing",
    desc: "Real-time and historical pricing: current price, list price, discount %, deal badges, Buy Box winner, and stock levels.",
    fieldsPreview: "price, list_price, discount, buy_box, stock_status",
    views: "1.6K+",
    downloads: "540+",
    href: "https://brightdata.com/products/web-scraper/amazon/price",
  },
  {
    name: "Walmart Products",
    domain: "walmart.com",
    category: "E-commerce",
    desc: "SKUs, pricing, specifications, images, availability, reviews, and seller info from the second-largest US retailer.",
    fieldsPreview: "sku, price, specs, availability, reviews, seller",
    views: "5.5K+",
    downloads: "1.4K+",
    href: "https://brightdata.com/products/web-scraper/walmart",
  },
  {
    name: "Google Maps Scraper",
    domain: "google.com",
    category: "Local",
    desc: "Business name, address, phone, website, ratings, review count, hours, photos, and popular times for any location.",
    fieldsPreview: "name, address, phone, rating, reviews, hours, website",
    views: "12.8K+",
    downloads: "3.9K+",
    href: "/products/web-scraper/google-maps",
  },
  {
    name: "LinkedIn Profiles",
    domain: "linkedin.com",
    category: "Social",
    desc: "Professional data: name, headline, company, experience history, skills, education, certifications, and post activity.",
    fieldsPreview: "name, headline, company, experience, skills, education",
    views: "118.1K+",
    downloads: "28.4K+",
    href: "/products/web-scraper/linkedin",
  },
  {
    name: "Instagram Profiles",
    domain: "instagram.com",
    category: "Social",
    desc: "Followers, posts, bio, business category, engagement rate, recent media, hashtag use, and account growth metrics.",
    fieldsPreview: "followers, posts, bio, engagement_rate, media, hashtags",
    views: "21.8K+",
    downloads: "6.2K+",
    href: "/products/web-scraper/instagram",
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
              href="/products/web-scraper/scraper-lib"
              className="mt-1 inline-block font-semibold text-bd-blue hover:underline sm:mt-0 sm:inline"
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
              key={s.name}
              className="w-[min(280px,calc(100vw-2.5rem))] shrink-0 sm:w-[290px]"
            >
              <ScraperCard
                name={s.name}
                domain={s.domain}
                category={s.category}
                desc={s.desc}
                fieldsPreview={s.fieldsPreview}
                views={s.views}
                downloads={s.downloads}
                href={s.href}
              />
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

function isValidUrl(str: string): boolean {
  try { new URL(str); return true; } catch { return false; }
}

function isAmazonUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host.includes("amazon.");
  } catch {
    return false;
  }
}

type UrlStatus = "empty" | "invalid" | "non-amazon" | "ok";

function getUrlStatus(url: string): UrlStatus {
  const trimmed = url.trim();
  if (!trimmed) return "empty";
  if (!isValidUrl(trimmed)) return "invalid";
  if (!isAmazonUrl(trimmed)) return "non-amazon";
  return "ok";
}

/* ── Pricing slider tiers ── */
const PRICING_TIERS = [
  { records: 5_000, label: "5K", monthly: 0, perK: 0, tag: "Free" },
  { records: 10_000, label: "10K", monthly: 15, perK: 1.50, tag: "" },
  { records: 50_000, label: "50K", monthly: 75, perK: 1.50, tag: "" },
  { records: 100_000, label: "100K", monthly: 150, perK: 1.50, tag: "" },
  { records: 250_000, label: "250K", monthly: 350, perK: 1.40, tag: "Save 7%" },
  { records: 500_000, label: "500K", monthly: 650, perK: 1.30, tag: "Save 13%" },
  { records: 1_000_000, label: "1M", monthly: 1_200, perK: 1.20, tag: "Save 20%" },
  { records: 5_000_000, label: "5M", monthly: 5_000, perK: 1.00, tag: "Best value" },
];

function PricingTab() {
  const [tierIdx, setTierIdx] = useState(3);
  const tier = PRICING_TIERS[tierIdx];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div>
        <h2 className="text-xl font-bold text-bd-navy">Simple, transparent pricing</h2>
        <p className="mt-2 text-[15px] leading-7 text-bd-ink">
          Pay only for successfully delivered records. No setup fees, no hidden costs, no
          surprises. Start free, scale predictably.
        </p>
      </div>

      {/* Interactive pricing calculator */}
      <section className="rounded-xl border border-bd-line bg-bd-canvas p-5 sm:p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-bd-muted">
              Estimate your cost
            </p>
            <p className="mt-3 text-sm font-medium text-bd-ink">
              Records per month: <span className="text-lg font-extrabold text-bd-navy">{tier.label}</span>
            </p>

            <input
              type="range"
              min={0}
              max={PRICING_TIERS.length - 1}
              value={tierIdx}
              onChange={(e) => setTierIdx(Number(e.target.value))}
              className="pricing-slider mt-3 w-full cursor-pointer"
            />
            <div className="mt-1 flex justify-between text-[10px] text-bd-muted">
              {PRICING_TIERS.map((t, i) => (
                <span key={t.label} className={i === tierIdx ? "font-bold text-bd-blue" : ""}>{t.label}</span>
              ))}
            </div>
          </div>

          <div className="shrink-0 rounded-xl border border-bd-line bg-bd-panel px-6 py-5 text-center sm:min-w-[200px]">
            {tier.records === 5_000 ? (
              <>
                <p className="text-3xl font-extrabold text-bd-navy">$0</p>
                <p className="mt-0.5 text-xs text-bd-muted">5,000 records/month</p>
                <p className="mt-1 text-xs font-semibold text-bd-success">No credit card required</p>
              </>
            ) : (
              <>
                <p className="text-3xl font-extrabold text-bd-navy">
                  ${tier.monthly.toLocaleString()}<span className="text-base font-semibold text-bd-muted">/mo</span>
                </p>
                <p className="mt-0.5 text-xs text-bd-muted">
                  ${tier.perK.toFixed(2)} per 1,000 records
                </p>
                {tier.tag && (
                  <span className="mt-2 inline-block rounded-full bg-bd-blue/10 px-2.5 py-0.5 text-[11px] font-bold text-bd-blue">
                    {tier.tag}
                  </span>
                )}
              </>
            )}
            <a
              href="https://brightdata.com/cp/start"
              className="mt-4 block w-full rounded-lg bg-bd-blue px-4 py-2.5 text-center text-sm font-bold text-white shadow-sm shadow-bd-blue/30 transition hover:brightness-110"
              target="_blank"
              rel="noreferrer"
            >
              {tier.records === 5_000 ? "Start free" : "Get started"}
            </a>
          </div>
        </div>

        {/* Key points inside the card */}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-bd-line pt-4 text-xs text-bd-muted">
          <span className="flex items-center gap-1.5"><span className="text-bd-success">✓</span> Pay only for success</span>
          <span className="hidden sm:inline text-bd-line">·</span>
          <span className="flex items-center gap-1.5"><span className="text-bd-success">✓</span> 5K records/mo free</span>
          <span className="hidden sm:inline text-bd-line">·</span>
          <span className="flex items-center gap-1.5"><span className="text-bd-success">✓</span> From $1.00/1K at scale</span>
          <span className="hidden sm:inline text-bd-line">·</span>
          <span className="flex items-center gap-1.5"><span className="text-bd-success">✓</span> Cancel anytime</span>
        </div>
      </section>

      {/* Plan cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { plan: "Free", price: "$0", detail: "5K records/month", features: ["5,000 records/month", "No credit card required", "All output formats", "Expert support"], cta: "Start free", ctaHref: "https://brightdata.com/cp/start", primary: true },
          { plan: "Pay As You Go", price: "$1.50", detail: "Per 1K records", features: ["Unlimited records", "Pay only for success", "Set monthly spend limits", "Unlimited concurrency", "Expert support"], cta: "Get started", ctaHref: "https://brightdata.com/cp/start", primary: true },
          { plan: "Enterprise", price: "Custom", detail: "Volume discounts", features: ["Dedicated account manager", "Premium SLA", "Priority support", "SSO", "Custom integrations"], cta: "Talk to sales", ctaHref: "https://brightdata.com/contact", primary: false },
        ].map((p) => (
          <div key={p.plan} className="flex flex-col rounded-xl border border-bd-line bg-bd-panel p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-bd-muted">{p.plan}</p>
            <p className="mt-1.5 text-2xl font-extrabold text-bd-navy">{p.price}</p>
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
              className={`mt-5 block rounded-lg px-4 py-2.5 text-center text-sm font-bold transition ${p.primary ? "bg-bd-blue text-white shadow-sm shadow-bd-blue/30 hover:brightness-110" : "border border-bd-line bg-bd-canvas text-bd-ink hover:border-bd-blue-light hover:bg-bd-blue-soft"}`}
              target="_blank"
              rel="noreferrer"
            >
              {p.cta}
            </a>
          </div>
        ))}
      </div>

      {/* What's included grid */}
      <section>
        <h3 className="text-lg font-bold text-bd-navy">Every plan includes</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            { title: "Full browser rendering", desc: "JavaScript pages, SPAs, infinite scroll — all handled" },
            { title: "Automated proxy rotation", desc: "Residential proxies, CAPTCHA solving, anti-bot bypass" },
            { title: "Structured data output", desc: "Clean JSON, CSV, or NDJSON — parsed and validated" },
            { title: "Unlimited concurrency", desc: "Run as many requests in parallel as you need" },
            { title: "Worldwide geotargeting", desc: "Scrape from 195+ countries for localized results" },
            { title: "Webhook & API delivery", desc: "Push results to your endpoint or pull via REST API" },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-2.5 rounded-lg border border-bd-line bg-bd-panel px-4 py-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bd-blue/10 text-bd-blue">
                <svg viewBox="0 0 16 16" className="h-3 w-3 fill-current"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-bd-navy">{f.title}</p>
                <p className="mt-0.5 text-xs text-bd-muted">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section>
        <h3 className="text-lg font-bold text-bd-navy">Pricing FAQ</h3>
        <div className="mt-3 space-y-2">
          {[
            { q: "What counts as a record?", a: "One successfully scraped product = one record. Each record is a single JSON object with all data fields (title, price, reviews, seller, etc.). Failed or errored requests are never charged." },
            { q: "Are there setup fees or hidden costs?", a: "No. Zero setup fees, no minimum commitment, no per-request charges, no bandwidth fees. You pay only for successfully delivered records at the rate shown above." },
            { q: "How does the free tier work?", a: "Every Bright Data account includes 5,000 free records per month — no credit card required. Use them with any scraper in the library. Credits renew on the 1st of each month." },
            { q: "What happens when free credits run out?", a: "If you have pre-deposited funds, usage continues seamlessly at pay-as-you-go rates. Otherwise, API requests return a clear error until you add funds or credits renew next month." },
            { q: "Can I set a spending limit?", a: "Yes. Set a monthly spend cap in your dashboard. When the limit is reached, requests pause automatically — no surprise bills." },
            { q: "How do volume discounts work?", a: "Rates drop as volume increases, from $1.50/1K at pay-as-you-go down to $1.00/1K at 5M+ records. Enterprise customers can negotiate further. No long-term commitment required." },
            { q: "What payment methods are accepted?", a: "All major credit cards, wire transfers, and AWS Marketplace for streamlined procurement and consolidated billing." },
          ].map((item) => (
            <details key={item.q} className="group rounded-xl border border-bd-line bg-bd-panel px-4 py-3">
              <summary className="list-none flex cursor-pointer items-start justify-between gap-3 text-sm font-semibold text-bd-navy">
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

      {/* Bottom CTA */}
      <div className="flex flex-wrap items-center gap-3">
        <a
          href="https://brightdata.com/cp/start"
          className="rounded-lg bg-bd-blue px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-bd-blue/30 transition hover:brightness-110"
          target="_blank"
          rel="noreferrer"
        >
          Start free — 5K records/month
        </a>
        <a
          href="https://brightdata.com/contact"
          className="rounded-lg border border-bd-line px-5 py-2.5 text-sm font-bold text-bd-ink transition hover:border-bd-blue-light hover:bg-bd-blue-soft"
          target="_blank"
          rel="noreferrer"
        >
          Contact sales
        </a>
      </div>
    </div>
  );
}

const DEFAULT_URL = "https://www.amazon.com/dp/B09X7MPX8L";

function PlaygroundPanel() {
  const [url, setUrl] = useState(DEFAULT_URL);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [result, setResult] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [sampleState, setSampleState] = useState(getFreeSampleState);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const urlStatus = getUrlStatus(url);
  const isUsingApiKey = apiKey.trim().length > 0;
  const canRun = status !== "running" && urlStatus !== "empty" && urlStatus !== "invalid";

  const run = useCallback(async () => {
    setTouched(true);
    const us = getUrlStatus(url);

    if (us === "empty" || us === "invalid") {
      inputRef.current?.focus();
      return;
    }

    if (isUsingApiKey) {
      setStatus("running");
      setResult("");
      const start = Date.now();
      const timer = window.setInterval(() => setElapsed(Date.now() - start), 100);

      try {
        const res = await fetch(
          `https://api.brightdata.com/datasets/v3/scrape?dataset_id=${DATASET_ID}&format=json&include_errors=true`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify([{ url: url.trim() }]),
          }
        );

        window.clearInterval(timer);
        setElapsed(Date.now() - start);
        const text = await res.text();

        if (!res.ok) {
          setStatus("error");
          const hint = res.status === 401 ? "\n\nCheck that your API key is correct." :
                       res.status === 403 ? "\n\nYour API key may lack the required permissions." :
                       res.status === 429 ? "\n\nRate limit exceeded — try again in a few seconds." : "";
          setResult(`HTTP ${res.status} ${res.statusText}${hint}\n\n${text}`);
          return;
        }

        try {
          setResult(JSON.stringify(JSON.parse(text), null, 2));
        } catch {
          setResult(text);
        }
        setStatus("done");
      } catch (err) {
        window.clearInterval(timer);
        setElapsed(Date.now() - start);
        setStatus("error");
        const msg = err instanceof Error ? err.message : "Request failed";
        const hint = msg.includes("Failed to fetch") || msg.includes("NetworkError")
          ? "Network error — check your connection and try again."
          : msg;
        setResult(hint);
      }
      return;
    }

    if (us === "non-amazon") {
      setStatus("error");
      setResult("This scraper only supports Amazon product URLs.\n\nEnter an amazon.com URL (e.g. https://www.amazon.com/dp/B09X7MPX8L) or use an API key to run custom queries.");
      return;
    }

    const state = getFreeSampleState();
    if (state.remaining <= 0) {
      setStatus("error");
      const mins = state.resetAt ? Math.ceil((state.resetAt - Date.now()) / 60000) : 0;
      setResult(`Free demo limit reached (${FREE_SAMPLE_LIMIT} per 24h). Resets in ${Math.floor(mins / 60)}h ${mins % 60}m.\n\nAdd your API key below for unlimited runs, or sign up free at brightdata.com/cp/start`);
      setShowApiKey(true);
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
  }, [url, isUsingApiKey, apiKey]);

  const inputBorderClass = (() => {
    if (touched && urlStatus === "invalid") return "border-red-500/60 focus:border-red-500 focus:ring-red-500/20";
    if (urlStatus === "non-amazon" && !isUsingApiKey) return "border-amber-500/60 focus:border-amber-500 focus:ring-amber-500/20";
    return "border-bd-line focus:border-bd-blue focus:ring-bd-blue/20";
  })();

  const inputIcon = (() => {
    if (urlStatus === "empty") return null;
    if (urlStatus === "invalid") return touched ? <span className="text-red-400">✕</span> : null;
    if (urlStatus === "non-amazon") return <span className="text-amber-400">⚠</span>;
    return <span className="text-bd-success">✓</span>;
  })();

  return (
    <div className="space-y-6">
      {/* URL input area */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="pg-url" className="text-sm font-semibold text-bd-navy">
            Amazon product URL
          </label>
          {url !== DEFAULT_URL && url.trim() && (
            <button
              type="button"
              onClick={() => { setUrl(DEFAULT_URL); setTouched(false); setStatus("idle"); setResult(""); }}
              className="text-xs text-bd-muted hover:text-bd-blue transition"
            >
              Reset to default
            </button>
          )}
        </div>
        <div className="mt-2 flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              id="pg-url"
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); if (status !== "idle") { setStatus("idle"); setResult(""); } }}
              onBlur={() => { if (url.trim()) setTouched(true); }}
              onKeyDown={(e) => { if (e.key === "Enter") run(); }}
              placeholder="https://www.amazon.com/dp/..."
              className={`w-full rounded-lg border bg-bd-canvas px-3.5 py-3 pr-10 font-mono text-sm text-bd-ink placeholder:text-bd-muted/50 focus:outline-none focus:ring-2 transition ${inputBorderClass}`}
            />
            {inputIcon ? (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium">
                {inputIcon}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={run}
            disabled={!canRun}
            className="shrink-0 rounded-lg bg-bd-blue px-5 py-3 text-sm font-bold text-white shadow-sm shadow-bd-blue/30 transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "running" ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Running
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current"><path d="M4.5 2.5a.5.5 0 01.764-.424l8 5a.5.5 0 010 .848l-8 5A.5.5 0 014.5 12.5v-10z"/></svg>
                Run
              </span>
            )}
          </button>
        </div>
        {/* Inline validation messages */}
        {touched && urlStatus === "invalid" ? (
          <p className="mt-1.5 text-xs text-red-400">
            Enter a valid URL starting with https://
          </p>
        ) : urlStatus === "non-amazon" && !isUsingApiKey ? (
          <p className="mt-1.5 text-xs text-amber-400">
            Not an Amazon URL — add an API key below to scrape non-Amazon sites, or enter an amazon.com product URL for the free demo.
          </p>
        ) : urlStatus === "non-amazon" && isUsingApiKey ? (
          <p className="mt-1.5 text-xs text-amber-400">
            This URL is not from Amazon. Results may differ from the expected schema.
          </p>
        ) : null}
        {/* Free runs counter */}
        {!isUsingApiKey && urlStatus !== "invalid" && (
          <p className={`mt-1.5 text-xs ${sampleState.remaining <= 0 ? "text-amber-400" : "text-bd-muted"}`}>
            {sampleState.remaining > 0
              ? `${sampleState.remaining}/${FREE_SAMPLE_LIMIT} free demo runs remaining — no sign-up required`
              : "Free demo limit reached — add your API key for unlimited runs"}
          </p>
        )}
      </div>

      {/* Status bar */}
      {status !== "idle" ? (
        <div
          className={`flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium ${
            status === "running"
              ? "border border-bd-blue/30 bg-bd-blue-soft text-bd-blue"
              : status === "done"
                ? "border border-green-800/60 bg-green-950/40 text-green-400"
                : "border border-red-800/60 bg-red-950/40 text-red-400"
          }`}
        >
          <span className="flex items-center gap-2.5">
            {status === "running" ? (
              <svg className="h-4 w-4 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : status === "done" ? "✅" : "❌"}
            <span>
              {status === "running"
                ? `Scraping… ${(elapsed / 1000).toFixed(1)}s`
                : status === "done"
                  ? `Done in ${(elapsed / 1000).toFixed(1)}s — ${isUsingApiKey ? "live results" : "5 sample records returned"}`
                  : "Request failed"}
            </span>
          </span>
          {status !== "running" && (
            <button
              type="button"
              onClick={() => { setStatus("idle"); setResult(""); }}
              className="ml-3 shrink-0 text-xs opacity-60 hover:opacity-100 transition"
            >
              Dismiss
            </button>
          )}
        </div>
      ) : null}

      {/* Result */}
      {result ? (
        <div className="overflow-hidden rounded-xl border border-[#2a4060] bg-bd-code-bg shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <span className="font-mono text-xs text-white/55">
              {status === "done" ? `response · json · ${isUsingApiKey ? "live" : "sample"} data` : "error"}
            </span>
            <CopyButton text={result} />
          </div>
          <pre className="code-scroll max-h-[500px] overflow-auto p-3 text-[12px] leading-5 text-[#d7e6ff] sm:p-4 sm:text-[13px] sm:leading-6">
            <code className="font-mono whitespace-pre">{result}</code>
          </pre>
        </div>
      ) : null}

      {/* Idle hint */}
      {status === "idle" && !result ? (
        <div className="rounded-xl border border-bd-line bg-bd-canvas p-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bd-blue/10 text-bd-blue text-sm">▶</span>
            <div>
              <p className="text-sm font-semibold text-bd-navy">Hit Run to see real data</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-bd-muted">
                Returns structured JSON with title, price, reviews, stock, seller info and more.
                The default URL is pre-filled — just click Run.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* API key — expandable section below */}
      <div className="border-t border-bd-line pt-5">
        <button
          type="button"
          onClick={() => setShowApiKey(!showApiKey)}
          className="flex items-center gap-2 text-sm font-medium text-bd-muted hover:text-bd-ink transition"
        >
          <svg viewBox="0 0 16 16" className={`h-3 w-3 fill-current transition-transform ${showApiKey ? "rotate-90" : ""}`}>
            <path d="M6 3.5l4.5 4.5L6 12.5V3.5z" />
          </svg>
          {isUsingApiKey ? (
            <span className="text-bd-success">API key active — running live queries</span>
          ) : (
            "Use your API key for live data"
          )}
        </button>

        {showApiKey ? (
          <div className="mt-3 space-y-3 rounded-lg border border-bd-line bg-bd-canvas p-4">
            <div>
              <label htmlFor="pg-key" className="block text-xs font-semibold text-bd-muted uppercase tracking-wider">
                API Key
              </label>
              <input
                id="pg-key"
                type="password"
                placeholder="Paste your Bright Data API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-bd-line bg-bd-panel px-3.5 py-2.5 font-mono text-sm text-bd-ink placeholder:text-bd-muted/50 focus:border-bd-blue focus:outline-none focus:ring-2 focus:ring-bd-blue/20"
              />
              <p className="mt-1.5 text-xs text-bd-muted">
                Get your key at{" "}
                <a href="https://brightdata.com/cp/setting/users" className="text-bd-blue hover:underline" target="_blank" rel="noreferrer">
                  brightdata.com/cp/setting/users
                </a>
                {" "}· Sent directly to api.brightdata.com — never stored.
              </p>
            </div>
            {apiKey.trim() && (
              <button
                type="button"
                onClick={() => { setApiKey(""); setStatus("idle"); setResult(""); }}
                className="text-xs text-red-400 hover:text-red-300 transition"
              >
                Clear API key
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function ScraperPage() {
  const [mainTab, setMainTab] = useState<MainTab>("Overview");
  const [apiLang, setApiLang] = useState<ApiLang>("Python");
  const [apiMode, setApiMode] = useState<"sync" | "async">("sync");
  const [agentPlatform, setAgentPlatform] = useState<AgentPlatform>("Prompt");

  const mainTabs: MainTab[] = ["Overview", "Pricing", "API", "Input", "Output", "Playground", "Connect Agent", "Customize"];
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

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        {/* Breadcrumb */}
        <nav className="animate-rise mb-5 flex flex-wrap items-center gap-x-0 gap-y-1 text-sm text-bd-muted sm:mb-6" aria-label="Breadcrumb">
          <a href="https://brightdata.com/products" className="hover:text-bd-navy" target="_blank" rel="noreferrer">Products</a>
          <span className="mx-1.5 text-bd-muted/50 sm:mx-2" aria-hidden="true">/</span>
          <Link href="/products/web-scraper" className="hover:text-bd-navy">Web Scraper API</Link>
          <span className="mx-1.5 text-bd-muted/50 sm:mx-2" aria-hidden="true">/</span>
          <Link href="/products/web-scraper/amazon" className="hover:text-bd-navy">Amazon</Link>
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
                <p className="mt-2 text-[15px] leading-7 text-bd-ink">
                  {DESCRIPTION}
                </p>
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
                <span className="shrink-0 font-medium text-bd-success">99.2% success</span>
                <span className="shrink-0 text-bd-line">·</span>
                <span className="shrink-0 font-medium text-bd-success">Verified 3h ago</span>
                <span className="shrink-0 text-bd-line">·</span>
                <span className="shrink-0 font-medium text-bd-success">GDPR &amp; CCPA Compliant</span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <a
                  href="https://brightdata.com/cp/start"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-bd-blue px-4 py-2 text-sm font-bold text-white shadow-sm shadow-bd-blue/30 transition hover:brightness-110"
                >
                  Start free
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMainTab("Playground");
                    setTimeout(() => {
                      document.getElementById("scraper-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 50);
                  }}
                  className="group inline-flex items-center gap-1 text-sm font-semibold text-bd-blue transition hover:text-bd-navy"
                >
                  Try in playground
                  <span className="inline-block transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true">→</span>
                </button>
              </div>
            </div>

            <TrustedByStrip compact />

            {/* Tabs */}
            <div id="scraper-tabs" className="animate-rise-delay mt-4 rounded-2xl border border-bd-line bg-bd-panel shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
              <div className="sticky top-14 z-30 relative overflow-hidden rounded-t-2xl bg-bd-panel">
                <div className="tab-scroll flex overflow-x-auto border-b border-bd-line px-4 sm:px-5">
                  {mainTabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setMainTab(tab)}
                      className={`relative -mb-px shrink-0 border-b-2 px-3 py-3 text-[13px] font-medium transition-colors sm:px-3.5 sm:text-sm ${
                        mainTab === tab
                          ? "border-bd-blue text-bd-blue"
                          : "border-transparent text-bd-muted hover:text-bd-ink"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5 sm:p-7">
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
                  <PricingTab />
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
                          <Link
                            href="/products/web-scraper/studio"
                            className="font-semibold text-bd-blue hover:underline"
                          >
                            Scraper Studio
                          </Link>{" "}
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
                        <a href="/products/web-scraper/scraper-lib" className="font-semibold text-bd-blue hover:underline">
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
                    <h2 className="text-xl font-bold text-bd-navy">Amazon Scraper Output Schema</h2>
                    <p className="text-[15px] leading-7 text-bd-ink">
                      Each successfully scraped product returns a structured JSON object. All data
                      can be delivered as JSON, NDJSON, or CSV via API, webhook, S3, or GCS.
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-bd-success/10 px-2.5 py-1 font-semibold text-bd-success">14 fields per record</span>
                      <span className="rounded-full bg-bd-blue/10 px-2.5 py-1 font-semibold text-bd-blue">MCP compatible</span>
                      <span className="rounded-full border border-bd-line px-2.5 py-1 text-bd-muted">OpenAPI ready</span>
                    </div>

                    <h3 className="text-base font-bold text-bd-navy">Field Reference</h3>
                    <div className="overflow-x-auto rounded-xl border border-bd-line">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-bd-canvas text-left text-xs font-semibold uppercase tracking-wider text-bd-muted">
                            <th className="px-4 py-2.5">Field</th>
                            <th className="px-4 py-2.5">Type</th>
                            <th className="px-4 py-2.5">Nullable</th>
                            <th className="px-4 py-2.5">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-bd-line text-bd-ink">
                          {[
                            ["title", "string", "No", "Product title"],
                            ["url", "string", "No", "Canonical Amazon product URL"],
                            ["asin", "string", "No", "Amazon Standard Identification Number"],
                            ["price", "number", "Yes", "Current selling price (null if unavailable)"],
                            ["list_price", "number", "Yes", "Original list / strike-through price"],
                            ["currency", "string", "No", "ISO currency code (USD, EUR, GBP, JPY…)"],
                            ["stars", "number", "Yes", "Average rating (0–5 scale, 1 decimal)"],
                            ["reviews_count", "number", "Yes", "Total number of customer reviews"],
                            ["in_stock", "boolean", "No", "Whether the product is currently in stock"],
                            ["brand", "string", "Yes", "Brand name"],
                            ["seller", "object", "Yes", "Seller name, ID, and marketplace URL"],
                            ["features", "array", "Yes", "Bullet-point product features (strings)"],
                            ["categories", "string", "Yes", "Breadcrumb category path"],
                            ["image", "string", "Yes", "Main product image URL (high-res)"],
                          ].map(([field, type, nullable, desc]) => (
                            <tr key={field}>
                              <td className="px-4 py-2.5 font-mono text-xs text-bd-blue">{field}</td>
                              <td className="px-4 py-2.5">
                                <span className="rounded bg-bd-canvas px-1.5 py-0.5 text-xs">{type}</span>
                              </td>
                              <td className="px-4 py-2.5">
                                {nullable === "No"
                                  ? <span className="text-bd-success font-medium">Required</span>
                                  : <span className="text-bd-muted">Optional</span>}
                              </td>
                              <td className="px-4 py-2.5 text-bd-ink/80">{desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <h3 className="text-base font-bold text-bd-navy">Sample Response</h3>
                    <CodeBlock code={SAMPLE_OUTPUT} label="json" />
                  </div>
                ) : null}

                {/* ===== PLAYGROUND TAB ===== */}
                {mainTab === "Playground" ? (
                  <PlaygroundPanel />
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

                {/* ===== CUSTOMIZE TAB ===== */}
                {mainTab === "Customize" ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-bd-navy">
                        Customize the Amazon Scraper
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
                        <Link
                          href="/products/web-scraper/studio"
                          className="w-full shrink-0 rounded-xl bg-bd-blue px-5 py-2.5 text-center text-sm font-bold text-white shadow-md shadow-bd-blue/30 transition hover:brightness-105 sm:w-auto"
                        >
                          Launch Scraper Studio
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* ===== SIDEBAR ===== */}
          <aside className="animate-rise-delay">
            <div className="lg:sticky lg:top-[4.5rem] space-y-4">
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
                  href="https://brightdata.com/contact"
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
              <div className="bg-gradient-to-r from-[#7b5ea7] via-[#9b6bb8] to-[#d94f8e] px-5 py-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                  Skip scraping
                </p>
                <p className="mt-1.5 text-lg font-bold leading-tight text-white">
                  Purchase an{" "}
                  <span className="underline decoration-white/50 underline-offset-2 group-hover:decoration-white">
                    Amazon Dataset
                  </span>{" "}
                  →
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
            </div>
          </aside>
        </section>

        {/* Related scrapers gallery — full width */}
        <RelatedScrapersCarousel />

        {/* AI Prompt CTA */}
        <AiPromptCta />
      </main>

      <Footer />
    </div>
  );
}
