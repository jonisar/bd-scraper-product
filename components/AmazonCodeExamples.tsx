"use client";

import { useState } from "react";

type ExampleKey = "products" | "reviews" | "sellers";
type Lang = "cURL" | "Python" | "Node.js";

const EXAMPLES: Record<
  ExampleKey,
  {
    label: string;
    datasetId: string;
    payload: string;
    response: string;
  }
> = {
  products: {
    label: "Products",
    datasetId: "gd_l7q7dkf244hwjntr0",
    payload: `[
  {"url": "https://www.amazon.com/dp/B0CRMZHDG8", "asin": "B0CRMZHDG8", "zipcode": "94107"},
  {"url": "https://www.amazon.com/dp/B07PZF3QS3", "asin": "B07PZF3QS3"}
]`,
    response: `[
  {
    "title": "Stanley Quencher H2.0 FlowState Tumbler",
    "brand": "Stanley",
    "final_price": 35.0,
    "currency": "USD",
    "availability": "In Stock",
    "rating": 4.7,
    "reviews_count": 98421
  }
]`,
  },
  reviews: {
    label: "Reviews",
    datasetId: "gd_le8e811kzy4ggddlq",
    payload: `[
  {"url": "https://www.amazon.com/dp/B094NC89P9", "max_reviews": 20},
  {"url": "https://www.amazon.com/dp/B0BRR4ZGNP", "max_reviews": 10}
]`,
    response: `[
  {
    "product_name": "RORSOU R10 Wired Headphones",
    "product_rating": 4.5,
    "rating": 5,
    "author_name": "Alex M.",
    "asin": "B094NC89P9"
  }
]`,
  },
  sellers: {
    label: "Sellers",
    datasetId: "gd_lhotzucw1etoe5iw1k",
    payload: `[
  {"url": "https://www.amazon.com/sp?seller=A33W53J5GVPZ8K"},
  {"url": "https://www.amazon.com/sp?seller=A33YXLPENB0JBD"}
]`,
    response: `[
  {
    "seller_id": "A33W53J5GVPZ8K",
    "seller_name": "Example Seller",
    "stars": "4.5 out of 5 stars",
    "url": "https://www.amazon.com/sp?seller=A33W53J5GVPZ8K"
  }
]`,
  },
};

function buildCode(lang: Lang, datasetId: string, payload: string): string {
  const compact = payload.replace(/\n\s*/g, "").replace(/,]/g, ",");
  if (lang === "cURL") {
    return `curl -X POST \\
  "https://api.brightdata.com/datasets/v3/trigger?dataset_id=${datasetId}&format=json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${compact}'`;
  }
  if (lang === "Python") {
    return `import requests

headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
}
payload = ${payload}

response = requests.post(
    "https://api.brightdata.com/datasets/v3/trigger",
    params={"dataset_id": "${datasetId}", "format": "json"},
    headers=headers,
    json=payload,
)
print(response.json())`;
  }
  return `const response = await fetch(
  "https://api.brightdata.com/datasets/v3/trigger?dataset_id=${datasetId}&format=json",
  {
    method: "POST",
    headers: {
      Authorization: "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(${payload}),
  }
);
const data = await response.json();
console.log(data);`;
}

const EXAMPLE_KEYS = Object.keys(EXAMPLES) as ExampleKey[];
const LANGS: Lang[] = ["cURL", "Python", "Node.js"];

export default function AmazonCodeExamples() {
  const [example, setExample] = useState<ExampleKey>("products");
  const [lang, setLang] = useState<Lang>("cURL");
  const [panel, setPanel] = useState<"request" | "response">("request");
  const [copied, setCopied] = useState(false);

  const current = EXAMPLES[example];
  const code =
    panel === "request"
      ? buildCode(lang, current.datasetId, current.payload)
      : current.response;

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="hub-code">
      <div className="hub-code-tabs" role="tablist" aria-label="Amazon scraper examples">
        {EXAMPLE_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={example === key}
            className={example === key ? "is-active" : undefined}
            onClick={() => {
              setExample(key);
              setPanel("request");
            }}
          >
            {EXAMPLES[key].label}
          </button>
        ))}
      </div>

      <div className="hub-code-panel">
        <div className="hub-code-toolbar">
          <div className="hub-code-langs" role="tablist" aria-label="Language">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                role="tab"
                aria-selected={lang === l}
                className={lang === l ? "is-active" : undefined}
                onClick={() => {
                  setLang(l);
                  setPanel("request");
                }}
                disabled={panel === "response"}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="hub-code-views">
            <button
              type="button"
              className={panel === "request" ? "is-active" : undefined}
              onClick={() => setPanel("request")}
            >
              Request
            </button>
            <button
              type="button"
              className={panel === "response" ? "is-active" : undefined}
              onClick={() => setPanel("response")}
            >
              Response
            </button>
          </div>
          <button type="button" className="hub-code-copy" onClick={copy}>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="hub-code-block">
          <pre>
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
