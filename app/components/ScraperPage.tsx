"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import TrustedByStrip from "@/components/TrustedByStrip";
import ScraperCard from "@/components/ScraperCard";
import AiPromptCta from "@/components/AiPromptCta";
import { PricingCards } from "@/components/PricingCards";

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

function AgentCmd({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
      <code className="code-scroll min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px] leading-5 text-[#d7e6ff]">
        {text}
      </code>
      <button
        type="button"
        aria-label="Copy to clipboard"
        title="Copy"
        onClick={async () => {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        }}
        className="shrink-0 rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs font-medium text-white/80 transition hover:bg-white/10"
      >
        {copied ? "✓" : "⧉"}
      </button>
    </div>
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
    el.scrollBy({ left: dir === "left" ? -330 : 330, behavior: "smooth" });
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
    <section className="mx-auto max-w-7xl px-4 pb-12 pt-4 sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-bd-navy">Related Scrapers</h2>
          <p className="mt-1 text-sm text-bd-ink/70">
            <a
              href="/products/web-scraper/amazon"
              className="font-semibold text-bd-blue hover:underline"
            >
              Browse all Amazon scrapers →
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
          className="related-scroll flex items-stretch gap-4 overflow-x-auto pb-4 scroll-smooth"
        >
          {RELATED_SCRAPERS.map((s) => (
            <div
              key={s.name}
              className="flex w-[min(300px,calc(100vw-2.5rem))] shrink-0 sm:w-[310px]"
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
const RUN_COOLDOWNS = [0, 5, 15, 30, 60, 120];

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
  { records: 10_000, label: "10K", monthly: 15, perK: 1.50, tag: "Pay As You Go" },
  { records: 50_000, label: "50K", monthly: 75, perK: 1.50, tag: "" },
  { records: 100_000, label: "100K", monthly: 150, perK: 1.50, tag: "" },
  { records: 384_000, label: "384K", monthly: 499, perK: 1.30, tag: "Scale plan" },
  { records: 500_000, label: "500K", monthly: 600, perK: 1.20, tag: "" },
  { records: 1_000_000, label: "1M", monthly: 1_100, perK: 1.10, tag: "" },
  { records: 5_000_000, label: "5M", monthly: 5_000, perK: 1.00, tag: "Enterprise" },
];

function PricingTab() {
  const [tierIdx, setTierIdx] = useState(0);
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
                <span key={t.label} className={`${i === tierIdx ? "font-bold text-bd-blue" : ""} ${i % 2 !== 0 && i !== tierIdx ? "hidden sm:inline" : ""}`}>{t.label}</span>
              ))}
            </div>
          </div>

          <div className="shrink-0 rounded-xl border border-bd-line bg-bd-panel px-6 py-5 text-center sm:w-[220px]">
            <p className="text-3xl font-extrabold text-bd-navy">
              {tier.records === 5_000 ? "$0" : `$${tier.monthly.toLocaleString()}`}
              {tier.records !== 5_000 && <span className="text-base font-semibold text-bd-muted">/mo</span>}
            </p>
            <p className="mt-0.5 text-xs text-bd-muted">
              {tier.records === 5_000 ? "5,000 records/month" : `$${tier.perK.toFixed(2)} per 1,000 records`}
            </p>
            <p className="mt-1 h-5 text-xs font-semibold">
              {tier.records === 5_000
                ? <span className="text-bd-success">No credit card required</span>
                : tier.tag
                  ? <span className="inline-block rounded-full bg-bd-blue/10 px-2.5 py-0.5 text-[11px] font-bold text-bd-blue">{tier.tag}</span>
                  : null}
            </p>
            <a
              href="https://brightdata.com/cp/start"
              className="mt-3 block w-full rounded-lg bg-bd-blue px-4 py-2.5 text-center text-sm font-bold text-white shadow-sm shadow-bd-blue/30 transition hover:brightness-110"
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
          <span className="flex items-center gap-1.5"><span className="text-bd-success">✓</span> From $1.00/1K at volume</span>
          <span className="hidden sm:inline text-bd-line">·</span>
          <span className="flex items-center gap-1.5"><span className="text-bd-success">✓</span> Cancel anytime</span>
        </div>
      </section>

      {/* Plan cards */}
      <PricingCards unit="records" compact />

      {/* What's included grid */}
      <section>
        <h3 className="text-lg font-bold text-bd-navy">Every plan includes</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            { title: "Full browser rendering", desc: "JavaScript pages, SPAs, infinite scroll — all handled" },
            { title: "Built-in anti-bot bypass", desc: "Auto IP rotation, CAPTCHA solving, fingerprint management — never get blocked" },
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
            { q: "How do volume discounts work?", a: "Rates drop as volume increases, from $1.50/1K at pay-as-you-go down to $1.00/1K at higher volumes. The Scale plan ($499/mo) includes 384K records. Enterprise customers can negotiate further. No long-term commitment required." },
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
  const [runCount, setRunCount] = useState(0);
  const [cooldownEnd, setCooldownEnd] = useState(0);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cooldownEnd <= Date.now()) { setCooldownLeft(0); return; }
    const id = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((cooldownEnd - Date.now()) / 1000));
      setCooldownLeft(left);
      if (left <= 0) window.clearInterval(id);
    }, 250);
    return () => window.clearInterval(id);
  }, [cooldownEnd]);

  const inCooldown = cooldownLeft > 0;
  const urlStatus = getUrlStatus(url);
  const isUsingApiKey = apiKey.trim().length > 0;
  const canRun = status !== "running" && urlStatus !== "empty" && urlStatus !== "invalid" && !inCooldown;

  const applyCooldown = useCallback((count: number) => {
    const idx = Math.min(count, RUN_COOLDOWNS.length - 1);
    const secs = RUN_COOLDOWNS[idx];
    if (secs > 0) {
      setCooldownEnd(Date.now() + secs * 1000);
      setCooldownLeft(secs);
    }
    setRunCount(count);
  }, []);

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
          applyCooldown(runCount + 1);
          return;
        }

        try {
          setResult(JSON.stringify(JSON.parse(text), null, 2));
        } catch {
          setResult(text);
        }
        setStatus("done");
        applyCooldown(runCount + 1);
      } catch (err) {
        window.clearInterval(timer);
        setElapsed(Date.now() - start);
        setStatus("error");
        const msg = err instanceof Error ? err.message : "Request failed";
        const hint = msg.includes("Failed to fetch") || msg.includes("NetworkError")
          ? "Network error — check your connection and try again."
          : msg;
        setResult(hint);
        applyCooldown(runCount + 1);
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
    applyCooldown(runCount + 1);
  }, [url, isUsingApiKey, apiKey, runCount, applyCooldown]);

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
            className={`shrink-0 rounded-lg px-5 py-3 text-sm font-bold shadow-sm transition ${
              inCooldown
                ? "bg-bd-line text-bd-muted cursor-not-allowed"
                : "bg-bd-blue text-white shadow-bd-blue/30 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            {status === "running" ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Running
              </span>
            ) : inCooldown ? (
              <span className="flex items-center gap-1.5 tabular-nums">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.5 3a.5.5 0 011 0v3.25l2.1 1.26a.5.5 0 01-.52.86L7.7 7.86A.5.5 0 017.5 7.4V4z"/></svg>
                {cooldownLeft}s
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
        {/* Cooldown indicator */}
        {inCooldown ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-bd-muted">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
            Ready in {cooldownLeft}s
            {!isUsingApiKey && sampleState.remaining > 0 && (
              <span className="text-bd-muted/60">· {sampleState.remaining}/{FREE_SAMPLE_LIMIT} free runs left</span>
            )}
          </p>
        ) : !isUsingApiKey && urlStatus !== "invalid" ? (
          <p className={`mt-1.5 text-xs ${sampleState.remaining <= 0 ? "text-amber-400" : "text-bd-muted"}`}>
            {sampleState.remaining > 0
              ? `${sampleState.remaining}/${FREE_SAMPLE_LIMIT} free demo runs remaining — no sign-up required`
              : "Free demo limit reached — add your API key for unlimited runs"}
          </p>
        ) : null}
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

/* ── Data fields explorer ── */
const FIELD_CATEGORIES = [
  {
    tab: "All",
    json: `{
  "asin": "B09X7MPX8L",
  "title": "SanDisk 1TB Extreme microSDXC",
  "price": 145.50,
  "list_price": 299.99,
  "currency": "USD",
  "stars": 4.8,
  "reviews_count": 36704,
  "brand": "SanDisk",
  "seller": "Amazon.com",
  "in_stock": true,
  "bsr": 1284,
  "categories": "Electronics > Memory Cards",
  "image": "https://m.media-amazon.com/images/I/…",
  "coupon": "Save 5%",
  "delivery": "Free delivery Thu, Aug 7",
  "dimensions": "0.59 x 0.43 x 0.04 inches",
  "weight": "0.01 ounces"
}`,
    count: 40,
  },
  {
    tab: "Pricing",
    json: `{
  "price": 145.50,
  "list_price": 299.99,
  "currency": "USD",
  "discount_pct": 51,
  "coupon": "Save 5%",
  "subscribe_save": "$138.23 with Subscribe & Save",
  "lightning_deal": false,
  "price_per_unit": null
}`,
    count: 8,
  },
  {
    tab: "Reviews",
    json: `{
  "stars": 4.8,
  "reviews_count": 36704,
  "star_distribution": {
    "5": 0.82, "4": 0.10, "3": 0.04,
    "2": 0.02, "1": 0.02
  },
  "top_review": {
    "title": "Best SD card I've ever owned",
    "text": "Transfer speeds are incredible…",
    "stars": 5,
    "verified": true,
    "date": "2026-07-28"
  }
}`,
    count: 6,
  },
  {
    tab: "Seller",
    json: `{
  "seller": "Amazon.com",
  "seller_url": "https://www.amazon.com/gp/…",
  "brand": "SanDisk",
  "manufacturer": "Western Digital",
  "is_fba": true,
  "is_prime": true,
  "buy_box_winner": true
}`,
    count: 7,
  },
  {
    tab: "Rankings",
    json: `{
  "bsr": 1284,
  "bsr_category": "Electronics",
  "categories": "Electronics > Memory Cards > Micro SD",
  "breadcrumbs": [
    "Electronics",
    "Computers & Accessories",
    "Data Storage",
    "Memory Cards"
  ],
  "department": "Electronics"
}`,
    count: 5,
  },
  {
    tab: "Media",
    json: `{
  "image": "https://m.media-amazon.com/images/I/…",
  "images": [
    "https://m.media-amazon.com/images/I/71vF…",
    "https://m.media-amazon.com/images/I/81kP…"
  ],
  "video_count": 3,
  "dimensions": "0.59 x 0.43 x 0.04 inches",
  "weight": "0.01 ounces",
  "bullet_points": [
    "Up to 160MB/s read, 120MB/s write",
    "A2 rated for faster app performance"
  ]
}`,
    count: 7,
  },
];

function DataFieldsExplorer() {
  const [activeTab, setActiveTab] = useState(0);
  const cat = FIELD_CATEGORIES[activeTab];

  return (
    <section id="info-data-fields">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold text-bd-navy">Output fields</h2>
        <span className="rounded-full bg-bd-blue/10 px-2.5 py-0.5 text-xs font-bold text-bd-blue">40+ fields per record</span>
      </div>
      <p className="mt-2 text-[15px] leading-7 text-bd-ink/80">
        Every request returns structured, typed JSON. Explore the response by category:
      </p>

      <div className="mt-4 overflow-hidden rounded-xl border border-bd-line">
        {/* Category tabs */}
        <div className="flex overflow-x-auto border-b border-bd-line bg-bd-canvas">
          {FIELD_CATEGORIES.map((c, i) => (
            <button
              key={c.tab}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`relative shrink-0 px-4 py-2.5 text-xs font-semibold transition-colors ${
                activeTab === i
                  ? "text-bd-blue after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-bd-blue"
                  : "text-bd-muted hover:text-bd-ink"
              }`}
            >
              {c.tab}
              <span className={`ml-1.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                activeTab === i ? "bg-bd-blue/10 text-bd-blue" : "bg-bd-line/60 text-bd-muted"
              }`}>{c.count}</span>
            </button>
          ))}
        </div>

        {/* JSON preview */}
        <div className="relative">
          <CodeBlock code={cat.json} label="json" />
          {activeTab === 0 && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0d1117] to-transparent" />
          )}
        </div>
      </div>

      <p className="mt-2.5 text-xs text-bd-muted">
        Use <code className="rounded bg-bd-blue-soft px-1 py-0.5 font-mono text-[11px] text-bd-blue">custom_output_fields</code> to return only the fields you need.
        See the <strong>Customize</strong> tab to build your query interactively.
      </p>
    </section>
  );
}

const ALL_OUTPUT_FIELDS = [
  { name: "title", sample: '"SanDisk 1TB Extreme microSDXC"' },
  { name: "price", sample: "145.50" },
  { name: "stars", sample: "4.8" },
  { name: "reviews_count", sample: "36704" },
  { name: "asin", sample: '"B09X7MPX8L"' },
  { name: "brand", sample: '"SanDisk"' },
  { name: "seller", sample: '{"name":"Amazon.com"}' },
  { name: "in_stock", sample: "true" },
  { name: "image", sample: '"https://m.media-amazon.com/…"' },
  { name: "bsr", sample: "1284" },
  { name: "description", sample: '"Professional-grade A2…"' },
  { name: "bullet_points", sample: '["Up to 160MB/s","A2 rated"]' },
  { name: "categories", sample: '"Electronics > Memory Cards"' },
  { name: "coupon", sample: '"Save 5%"' },
  { name: "list_price", sample: "299.99" },
  { name: "currency", sample: '"USD"' },
];
const DEFAULT_ON = new Set(["title", "price", "stars", "reviews_count", "asin", "brand"]);

const FORMAT_OPTIONS = ["JSON", "NDJSON", "CSV"] as const;
const DELIVERY_OPTIONS = ["API response", "Amazon S3", "Google Cloud", "Webhook", "Snowflake", "SFTP"] as const;
const GEO_OPTIONS = ["United States", "United Kingdom", "Germany", "Japan", "France", "India", "Canada", "Australia"] as const;
const SCHEDULE_OPTIONS = ["Manual", "Hourly", "Daily", "Weekly"] as const;

function CustomizeTab({ datasetId, apiMode, onApiModeChange }: { datasetId: string; apiMode: "sync" | "async"; onApiModeChange: (m: "sync" | "async") => void }) {
  const [fields, setFields] = useState<Set<string>>(() => new Set(DEFAULT_ON));
  const [format, setFormat] = useState<string>("JSON");
  const [delivery, setDelivery] = useState<string>("API response");
  const [geo, setGeo] = useState<string>("United States");
  const [schedule, setSchedule] = useState<string>("Manual");
  const [recordLimit, setRecordLimit] = useState(5000);
  const [spendCap, setSpendCap] = useState(150);

  const toggleField = useCallback((name: string) => {
    setFields((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const activeFields = ALL_OUTPUT_FIELDS.filter((f) => fields.has(f.name));
  const apiParam = activeFields.map((f) => f.name).join("|");
  const jsonPreview = activeFields.length > 0
    ? `[{\n${activeFields.map((f) => `  "${f.name}": ${f.sample}`).join(",\n")}\n}]`
    : "// Select at least one field above";

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-xl font-bold text-bd-navy">Customize output</h2>
        <p className="mt-1.5 text-sm text-bd-ink/70">
          Toggle fields and settings — the API call and response update live.
        </p>
      </header>

      {/* ── Interactive field picker ── */}
      <section>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-4">
          <p className="text-sm font-bold text-bd-navy">Output fields</p>
          <button type="button" onClick={() => setFields(new Set(ALL_OUTPUT_FIELDS.map((f) => f.name)))} className="text-[11px] font-medium text-bd-blue hover:underline">Select all</button>
          <button type="button" onClick={() => setFields(new Set())} className="text-[11px] font-medium text-bd-muted hover:text-bd-ink hover:underline">Clear</button>
          <span className="text-[11px] text-bd-muted">{fields.size} of {ALL_OUTPUT_FIELDS.length} selected</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ALL_OUTPUT_FIELDS.map((f) => {
            const on = fields.has(f.name);
            return (
              <button
                key={f.name}
                type="button"
                onClick={() => toggleField(f.name)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  on
                    ? "border border-bd-blue/40 bg-bd-blue-soft text-bd-blue shadow-sm shadow-bd-blue/10"
                    : "border border-bd-line bg-bd-panel text-bd-muted hover:border-bd-blue/20 hover:text-bd-ink"
                }`}
              >
                <span className={`inline-block h-2 w-2 rounded-full transition-colors ${on ? "bg-bd-blue" : "bg-bd-line"}`} />
                {f.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Interactive settings ── */}
      <section>
        <h3 className="mb-3 text-lg font-bold text-bd-navy">Scraper settings</h3>
        <div className="overflow-hidden rounded-xl border border-bd-line">
          {/* API mode */}
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
            <div className="min-w-0">
              <p className="text-sm font-medium text-bd-navy">API mode</p>
              <p className="text-[11px] text-bd-muted">{apiMode === "sync" ? "Real-time response via /scrape" : "Returns snapshot_id via /trigger"}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              {(["sync", "async"] as const).map((m) => (
                <button key={m} type="button" onClick={() => onApiModeChange(m)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    apiMode === m
                      ? "bg-bd-blue text-white shadow-sm shadow-bd-blue/20"
                      : "border border-bd-line bg-bd-canvas text-bd-muted hover:text-bd-ink"
                  }`}
                >{m === "sync" ? "Sync" : "Async"}</button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div className="flex items-center justify-between gap-4 border-t border-bd-line px-4 py-3 sm:px-5">
            <div className="min-w-0">
              <p className="text-sm font-medium text-bd-navy">Output format</p>
            </div>
            <div className="flex shrink-0 gap-1">
              {FORMAT_OPTIONS.map((opt) => (
                <button key={opt} type="button" onClick={() => setFormat(opt)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    format === opt
                      ? "bg-bd-blue text-white shadow-sm shadow-bd-blue/20"
                      : "border border-bd-line bg-bd-canvas text-bd-muted hover:text-bd-ink"
                  }`}
                >{opt}</button>
              ))}
            </div>
          </div>

          {/* Record limit */}
          <div className="border-t border-bd-line px-4 py-3 sm:px-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-bd-navy">Record limit</p>
                <p className="text-[11px] text-bd-muted">Max records per run</p>
              </div>
              <span className="shrink-0 rounded-lg bg-bd-canvas px-3 py-1 text-sm font-bold tabular-nums text-bd-navy">
                {recordLimit === 10000 ? "No limit" : recordLimit.toLocaleString()}
              </span>
            </div>
            <input
              type="range" min={500} max={10000} step={500} value={recordLimit}
              onChange={(e) => setRecordLimit(Number(e.target.value))}
              className="pricing-slider mt-2 w-full cursor-pointer"
            />
            <div className="mt-0.5 flex justify-between text-[10px] text-bd-muted">
              <span>500</span><span>2.5K</span><span>5K</span><span>No limit</span>
            </div>
          </div>

          {/* Spend cap */}
          <div className="border-t border-bd-line px-4 py-3 sm:px-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-bd-navy">Monthly spend cap</p>
                <p className="text-[11px] text-bd-muted">Requests pause when reached</p>
              </div>
              <span className="shrink-0 rounded-lg bg-bd-canvas px-3 py-1 text-sm font-bold tabular-nums text-bd-navy">
                {spendCap === 1000 ? "No limit" : `$${spendCap}`}
              </span>
            </div>
            <input
              type="range" min={0} max={1000} step={50} value={spendCap}
              onChange={(e) => setSpendCap(Number(e.target.value))}
              className="pricing-slider mt-2 w-full cursor-pointer"
            />
            <div className="mt-0.5 flex justify-between text-[10px] text-bd-muted">
              <span>$0</span><span>$250</span><span>$500</span><span>No limit</span>
            </div>
          </div>

          {/* Delivery */}
          <div className="flex items-center justify-between gap-4 border-t border-bd-line px-4 py-3 sm:px-5">
            <div className="min-w-0">
              <p className="text-sm font-medium text-bd-navy">Delivery</p>
            </div>
            <select
              value={delivery} onChange={(e) => setDelivery(e.target.value)}
              className="shrink-0 cursor-pointer rounded-lg border border-bd-line bg-bd-canvas px-2.5 py-1.5 text-xs font-medium text-bd-ink outline-none focus:border-bd-blue"
            >
              {DELIVERY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>

          {/* Schedule */}
          <div className="flex items-center justify-between gap-4 border-t border-bd-line px-4 py-3 sm:px-5">
            <div className="min-w-0">
              <p className="text-sm font-medium text-bd-navy">Schedule</p>
            </div>
            <div className="flex shrink-0 gap-1">
              {SCHEDULE_OPTIONS.map((opt) => (
                <button key={opt} type="button" onClick={() => setSchedule(opt)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    schedule === opt
                      ? "bg-bd-blue text-white shadow-sm shadow-bd-blue/20"
                      : "border border-bd-line bg-bd-canvas text-bd-muted hover:text-bd-ink"
                  }`}
                >{opt}</button>
              ))}
            </div>
          </div>

          {/* Geotargeting */}
          <div className="flex items-center justify-between gap-4 border-t border-bd-line px-4 py-3 sm:px-5">
            <div className="min-w-0">
              <p className="text-sm font-medium text-bd-navy">Marketplace</p>
              <p className="text-[11px] text-bd-muted">18 Amazon domains</p>
            </div>
            <select
              value={geo} onChange={(e) => setGeo(e.target.value)}
              className="shrink-0 cursor-pointer rounded-lg border border-bd-line bg-bd-canvas px-2.5 py-1.5 text-xs font-medium text-bd-ink outline-none focus:border-bd-blue"
            >
              {GEO_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <p className="mt-2.5 text-xs text-bd-muted">
          Configure these in the{" "}
          <a href="https://brightdata.com/cp/datasets" className="font-medium text-bd-blue hover:underline" target="_blank" rel="noreferrer">control panel</a>
          {" "}— no code needed.
        </p>
      </section>

      {/* ── Live API preview ── */}
      <section className="grid gap-3 lg:grid-cols-2">
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-bd-muted">Generated API call</p>
          <CodeBlock
            code={`curl -X POST "https://api.brightdata.com/datasets/v3/${apiMode === "sync" ? "scrape" : "trigger"}?dataset_id=${datasetId}&format=${format.toLowerCase()}${activeFields.length > 0 && activeFields.length < ALL_OUTPUT_FIELDS.length ? `&custom_output_fields=${apiParam}` : ""}" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '[{"url":"https://www.amazon.com/dp/B09X7MPX8L"}]'`}
            label="bash"
          />
        </div>
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-bd-muted">Response preview</p>
          <CodeBlock code={jsonPreview} label="json" />
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="rounded-xl border border-bd-blue/30 bg-gradient-to-r from-bd-blue-soft to-transparent px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-bd-navy">Ready to customize?</p>
            <p className="mt-0.5 text-sm text-bd-ink/70">Open this scraper in the control panel to apply your configuration.</p>
          </div>
          <a
            href={`https://brightdata.com/cp/datasets/configure?dataset_id=${datasetId}`}
            className="group shrink-0 text-sm font-bold text-bd-blue transition hover:brightness-110"
            target="_blank"
            rel="noreferrer"
          >
            Customize scraper <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ScraperPage() {
  const [mainTab, setMainTab] = useState<MainTab>("Overview");
  const [apiLang, setApiLang] = useState<ApiLang>("Python");
  const [apiMode, setApiMode] = useState<"sync" | "async">("sync");
  const [agentPlatform, setAgentPlatform] = useState<AgentPlatform>("Prompt");

  const sidebarRef = useRef<HTMLDivElement>(null);
  const [stickyTop, setStickyTop] = useState("4.5rem");

  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;
    const update = () => {
      const sidebarH = el.scrollHeight;
      const vh = window.innerHeight;
      const headerH = 72;
      const pad = 24;
      if (sidebarH > vh - headerH - pad) {
        setStickyTop(`${vh - sidebarH - pad}px`);
      } else {
        setStickyTop("4.5rem");
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => { ro.disconnect(); window.removeEventListener("resize", update); };
  }, []);

  const mainTabs: MainTab[] = ["Overview", "Playground", "Pricing", "API", "Input", "Output", "Connect Agent", "Customize"];
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

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-10 lg:py-12">
        {/* Breadcrumb */}
        <nav className="animate-rise mb-6 flex flex-wrap items-center gap-x-0 gap-y-1 text-sm text-bd-muted sm:mb-8" aria-label="Breadcrumb">
          <a href="https://brightdata.com/products" className="hover:text-bd-navy" target="_blank" rel="noreferrer">Products</a>
          <span className="mx-1.5 text-bd-muted/50 sm:mx-2" aria-hidden="true">/</span>
          <Link href="/products/web-scraper" className="hover:text-bd-navy">Web Scraper API</Link>
          <span className="mx-1.5 text-bd-muted/50 sm:mx-2" aria-hidden="true">/</span>
          <Link href="/products/web-scraper/amazon" className="hover:text-bd-navy">Amazon</Link>
          <span className="mx-1.5 text-bd-muted/50 sm:mx-2" aria-hidden="true">/</span>
          <span className="font-medium text-bd-blue" aria-current="page">Amazon Product Scraper</span>
        </nav>

        <section className="animate-rise grid gap-6 lg:gap-8 lg:grid-cols-[1fr_340px]">
          {/* Main content */}
          <div className="min-w-0">
            {/* Hero card */}
            <div className="rounded-2xl border border-bd-line bg-bd-panel p-5 shadow-[0_10px_40px_rgba(0,0,0,0.3)] sm:p-7">
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

              {/* Stats grid */}
              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-bd-line pt-4 sm:grid-cols-5">
                {[
                  { value: "34.7K+", label: "Deliveries" },
                  { value: "5.7K+", label: "Users" },
                  { value: "99.99%", label: "Uptime SLA" },
                  { value: "GDPR & CCPA", label: "Compliant" },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg bg-bd-canvas px-3 py-2">
                    <p className="text-sm font-extrabold text-bd-navy">{s.value}</p>
                    <p className="text-[11px] text-bd-muted">{s.label}</p>
                  </div>
                ))}
                <div className="rounded-lg bg-bd-canvas px-3 py-2">
                  <p className="flex items-center gap-1.5 text-sm font-extrabold text-bd-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-bd-success animate-pulse" />
                    Verified
                  </p>
                  <p className="flex items-center gap-1 text-[11px] text-bd-muted">
                    <svg viewBox="0 0 16 16" className="h-2.5 w-2.5 fill-bd-success" aria-hidden="true"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>
                    3h ago
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href="https://brightdata.com/cp/start"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-bd-blue px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-bd-blue/30 transition hover:brightness-110"
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
            <div id="scraper-tabs" className="animate-rise-delay mt-6 rounded-2xl border border-bd-line bg-bd-panel shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
              <div className="sticky top-14 z-30 relative overflow-hidden rounded-t-2xl bg-bd-panel">
                <div className="tab-scroll flex overflow-x-auto border-b border-bd-line px-4 sm:px-5">
                  {mainTabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => {
                        setMainTab(tab);
                        document.getElementById("scraper-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
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
                      Run this scraper programmatically using Bright Data&apos;s REST API. Switch between sync and async modes in the{" "}
                      <button type="button" onClick={() => setMainTab("Customize")} className="font-semibold text-bd-blue hover:underline">Customize</button> tab.
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
                          <h2 className="text-lg font-bold text-bd-navy">
                            Amazon Scraper API — {apiLang} {apiMode === "async" ? "(Async)" : ""} Example
                          </h2>
                          <p className="mt-1 text-xs text-bd-muted">
                            Showing <strong className="text-bd-ink">{apiMode === "sync" ? "synchronous" : "asynchronous"}</strong> mode.
                            Switch in the <button type="button" onClick={() => setMainTab("Customize")} className="font-semibold text-bd-blue hover:underline">Customize</button> tab.
                          </p>

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

                    {/* ── Hero intro ── */}
                    <header>
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-bd-blue">
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-bd-blue/10">
                          <svg viewBox="0 0 16 16" className="h-2.5 w-2.5 fill-current"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>
                        </span>
                        Verified · Maintained by Bright Data
                      </p>
                      <h2 className="text-2xl font-bold text-bd-navy sm:text-[1.65rem]">
                        Scrape Amazon product data via API
                      </h2>
                      <p className="mt-2 text-[15px] leading-relaxed text-bd-ink/80">
                        Extract prices, reviews, stock levels, seller data, and 40+ fields from any Amazon page.
                        Send URLs or ASINs, get structured JSON back — no proxies, no CAPTCHAs, no browser rendering.
                      </p>
                    </header>

                    {/* ── Quick start ── */}
                    <section>
                      <h3 className="mb-3 text-lg font-bold text-bd-navy">Quick start</h3>
                      <div className="overflow-hidden rounded-xl border border-bd-line bg-bd-canvas">
                        <div className="flex items-center justify-between border-b border-bd-line px-4 py-2.5 sm:px-5">
                          <p className="text-xs text-bd-muted">Install the CLI, authenticate, scrape — 30 seconds</p>
                          <a href="https://docs.brightdata.com/cli/overview" className="text-xs font-medium text-bd-blue hover:underline" target="_blank" rel="noreferrer">
                            CLI docs →
                          </a>
                        </div>
                        <div className="divide-y divide-bd-line/50">
                          {[
                            { step: "1", cmd: "npm install -g @brightdata/cli", label: "Install" },
                            { step: "2", cmd: "brightdata login", label: "Authenticate" },
                            { step: "3", cmd: `brightdata scraper run ${DATASET_ID} "https://amazon.com/dp/B09X7MPX8L"`, label: "Scrape" },
                          ].map((s) => (
                            <div key={s.step} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bd-blue/10 text-xs font-bold text-bd-blue">{s.step}</span>
                              <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-[#d7e6ff]">{s.cmd}</code>
                              <span className="hidden shrink-0 text-[11px] text-bd-muted sm:inline">{s.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* ── REST API example ── */}
                    <section>
                      <h3 className="mb-3 text-lg font-bold text-bd-navy">REST API example</h3>
                      <div className="grid gap-3 lg:grid-cols-2">
                        <div>
                          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-bd-muted">Request</p>
                          <CodeBlock
                            code={`curl -X POST "https://api.brightdata.com/datasets/v3/scrape?dataset_id=${DATASET_ID}&format=json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '[{"url":"https://www.amazon.com/dp/B09X7MPX8L"}]'`}
                            label="bash"
                          />
                        </div>
                        <div>
                          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-bd-muted">Response</p>
                          <CodeBlock
                            code={`[{
  "title": "SanDisk 1TB Extreme microSDXC",
  "asin": "B09X7MPX8L",
  "price": 145.50,
  "list_price": 299.99,
  "currency": "USD",
  "stars": 4.8,
  "reviews_count": 36704,
  "in_stock": true,
  "brand": "SanDisk",
  "seller": { "name": "Amazon.com" },
  "categories": "Electronics > Memory Cards",
  "image": "https://m.media-amazon.com/..."
}]`}
                            label="json"
                          />
                        </div>
                      </div>
                    </section>

                    {/* ── Key capabilities ── */}
                    <section>
                      <h3 className="mb-3 text-lg font-bold text-bd-navy">Key capabilities</h3>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                          { title: "40+ structured fields", desc: "Prices, reviews, BSR, seller info, stock status, images, and more — parsed and typed out of the box." },
                          { title: "Anti-bot bypass", desc: "Proxy rotation, CAPTCHA solving, fingerprint management, and JS rendering handled automatically." },
                          { title: "18 marketplaces", desc: "Scrape any Amazon domain — .com, .co.uk, .de, .co.jp, and 14 more. Localized pricing and rankings." },
                          { title: "Bulk & async", desc: "Up to 5,000 URLs per request. Async mode returns a snapshot ID — poll or receive results via webhook." },
                          { title: "Spend caps & limits", desc: "Set monthly budgets and per-run record limits. Requests pause when the cap is hit — no surprise bills." },
                          { title: "Scheduling", desc: "Automate recurring runs — hourly, daily, weekly. Results delivered to S3, Snowflake, webhook, or email." },
                        ].map((f) => (
                          <div key={f.title} className="rounded-xl border border-bd-line bg-bd-canvas px-4 py-3">
                            <p className="font-bold text-bd-navy">{f.title}</p>
                            <p className="mt-1 text-[13px] leading-5 text-bd-ink/70">{f.desc}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* ── What's included ── */}
                    <section id="info-whats-included">
                      <h3 className="text-lg font-bold text-bd-navy">
                        Included in every request
                      </h3>
                      <p className="mt-2">
                        Every API call is backed by Bright Data&apos;s full infrastructure — no extra setup or fees:
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
                          <div key={label} className="flex items-center gap-2 rounded-lg border border-bd-line bg-bd-panel px-3 py-2.5">
                            <span className="text-sm">{icon}</span>
                            <span className="text-[13px] font-medium text-bd-navy">{label}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* ── Table of Contents for deep content ── */}
                    <nav className="rounded-xl border border-bd-line bg-bd-canvas px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-bd-muted">More on this page</p>
                      <div className="mt-3 grid gap-x-8 gap-y-4 sm:grid-cols-3">
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
                          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-bd-navy/50">Compare</p>
                          {[
                            ["vs-diy", "Scraper vs. DIY"],
                            ["challenges", "Challenges & Solutions"],
                            ["use-cases", "Use Cases"],
                          ].map(([id, label]) => (
                            <a key={id} href={`#info-${id}`} className="block truncate text-[13px] font-medium text-bd-blue hover:underline" onClick={(e) => { e.preventDefault(); document.getElementById(`info-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{label}</a>
                          ))}
                        </div>
                        <div>
                          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-bd-navy/50">Resources</p>
                          {[
                            ["faq", "FAQ"],
                            ["legal", "Legal & Compliance"],
                            ["more-tools", "More Tools"],
                          ].map(([id, label]) => (
                            <a key={id} href={`#info-${id}`} className="block truncate text-[13px] font-medium text-bd-blue hover:underline" onClick={(e) => { e.preventDefault(); document.getElementById(`info-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{label}</a>
                          ))}
                        </div>
                      </div>
                    </nav>

                    {/* ── ACT 2: Product surface ── */}

                    <DataFieldsExplorer />

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
                                <td className="px-4 py-2.5 text-bd-ink/80">{value}</td>
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
                        Popular Amazon Scrapers
                      </h2>
                      <p className="mt-2 text-[15px] leading-relaxed text-bd-ink/80">
                        Specialized scrapers for every Amazon data type — pick the one that fits your use case.
                      </p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                          { name: "Amazon Product Scraper", domain: "amazon.com", category: "E-commerce", desc: "Prices, titles, images, specs, stock levels, and 40+ fields from any product page.", fieldsPreview: "title, price, rating, reviews, stock, images", views: "48.2K+", downloads: "12.6K+", href: "/products/web-scraper/amazon/amazon-product-scraper" },
                          { name: "Amazon Best Sellers", domain: "amazon.com", category: "Rankings", desc: "Bestseller rankings, category leaderboards, movers & shakers, and trending products.", fieldsPreview: "rank, title, price, rating, category, sales_volume", views: "34.6K+", downloads: "5.1K+", href: "/products/web-scraper/amazon" },
                          { name: "Amazon Reviews Scraper", domain: "amazon.com", category: "Reviews", desc: "Review text, star ratings, author info, verified purchase status, and helpful votes.", fieldsPreview: "review_text, rating, author, verified, helpful_votes", views: "7.2K+", downloads: "1.8K+", href: "/products/web-scraper/amazon" },
                          { name: "Amazon Sellers Info", domain: "amazon.com", category: "Sellers", desc: "Seller name, store rating, feedback count, return policy, and business address.", fieldsPreview: "seller_name, rating, feedback_count, return_policy", views: "2.4K+", downloads: "820+", href: "/products/web-scraper/amazon" },
                          { name: "Amazon Price Tracker", domain: "amazon.com", category: "Pricing", desc: "Real-time pricing, discounts, deal badges, Buy Box winner, and stock availability.", fieldsPreview: "price, list_price, discount, buy_box, stock_status", views: "1.6K+", downloads: "540+", href: "/products/web-scraper/amazon" },
                          { name: "Amazon Keyword Search", domain: "amazon.com", category: "Search", desc: "Search results by keyword — product listings, sponsored placements, and organic rankings.", fieldsPreview: "title, price, position, sponsored, rating, url", views: "3.8K+", downloads: "1.1K+", href: "/products/web-scraper/amazon" },
                        ].map((s) => (
                          <ScraperCard key={s.name} {...s} />
                        ))}
                      </div>
                      <p className="mt-4">
                        <Link href="/products/web-scraper/amazon" className="group text-sm font-semibold text-bd-blue hover:underline">
                          View all Amazon scrapers <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
                        </Link>
                      </p>
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
                                <td className="px-4 py-2.5 text-bd-ink/80">{diy}</td>
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
                            One prompt. Your agent does the rest.
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-bd-ink/70">
                            Hand this to Claude Code, Cursor, Codex, or any coding agent. It reads
                            the{" "}
                            <a
                              href="https://github.com/brightdata/skills"
                              className="font-semibold text-bd-blue hover:underline"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Bright Data skill
                            </a>
                            , installs the CLI, signs in with browser OAuth (no API key to paste),
                            and runs its first scrape.
                          </p>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-[#2a4060] bg-bd-code-bg shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
                          <div className="border-b border-white/10 px-4 py-2.5 text-center font-mono text-xs text-white/55">
                            Get started
                          </div>
                          <div className="space-y-5 p-4 sm:p-5">
                            <div className="space-y-2">
                              <p className="font-mono text-[13px] text-white/55">Tell your agent to:</p>
                              <AgentCmd text="Read https://brightdata.com/skills.md and set up the Amazon Product Scraper" />
                            </div>
                            <div className="space-y-2">
                              <p className="font-mono text-[13px] text-white/55">Or run:</p>
                              <AgentCmd text="npx -p @brightdata/cli && bdata login" />
                              <AgentCmd text={'bdata pipelines amazon_product "https://www.amazon.com/dp/B09X7MPX8L"'} />
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 border-t border-white/10 px-4 py-3 sm:px-5">
                            <span className="font-mono text-xs text-white/45">Works with:</span>
                            {["✳ Claude Code", "▟ Cursor", "⌘ Codex", "</> Custom agents"].map((c) => (
                              <span
                                key={c}
                                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
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
                  <CustomizeTab datasetId={DATASET_ID} apiMode={apiMode} onApiModeChange={setApiMode} />
                ) : null}
              </div>
            </div>
          </div>

          {/* ===== SIDEBAR ===== */}
          <aside className="animate-rise-delay">
            <div ref={sidebarRef} className="lg:sticky space-y-4" style={{ top: stickyTop }}>
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
                <p className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                  <span className="whitespace-nowrap text-[1.35rem] font-extrabold tracking-tight text-bd-navy sm:text-2xl">$1.00–1.50</span>
                  <span className="whitespace-nowrap text-xs font-semibold text-bd-muted sm:text-sm">/ 1K records</span>
                </p>

                <div className="mt-3 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bd-blue/10 text-bd-blue">
                      <svg viewBox="0 0 16 16" className="h-3 w-3 fill-current"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>
                    </span>
                    <p className="text-sm font-semibold leading-5 text-bd-navy">
                      Pay only for success
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bd-blue/10 text-bd-blue">
                      <svg viewBox="0 0 16 16" className="h-3 w-3 fill-current"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>
                    </span>
                    <p className="text-sm font-semibold leading-5 text-bd-navy">
                      Cancel anytime
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
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-bd-muted">Quick start</p>
              <div className="mt-3 space-y-1.5">
                {[
                  { step: "1", cmd: "npm i -g @brightdata/cli" },
                  { step: "2", cmd: "brightdata login" },
                  { step: "3", cmd: `brightdata scraper run ${DATASET_ID} "amazon.com/dp/…"` },
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-2 rounded-lg bg-black/60 px-2.5 py-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bd-blue/15 text-[10px] font-bold text-bd-blue">{s.step}</span>
                    <code className="min-w-0 flex-1 truncate font-mono text-[11px] text-[#d7e6ff]">{s.cmd}</code>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-bd-muted">
                From URL to structured data in seconds.
              </p>
            </div>

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
            </div>
          </aside>

          {/* Related scrapers gallery — full width, inside grid */}
          <div className="lg:col-span-2">
            <RelatedScrapersCarousel />
            <AiPromptCta />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
