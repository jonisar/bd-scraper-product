"use client";

import { useState } from "react";

type Lang = "cURL" | "Python" | "Node.js";

/** Real dataset IDs from lib/templates.ts; sample URLs are public canonical examples. */
const TARGETS = [
  {
    name: "Amazon",
    datasetId: "gd_l1vijqt9jfj7olije",
    url: "https://www.amazon.com/dp/B09X7MPX8L",
    printFields: ["title", "price"],
    domain: "amazon.com",
    response: `[
  {
    "title": "Wireless Bluetooth Earbuds, Active Noise Cancelling",
    "brand": "SoundPods",
    "price": 49.99,
    "currency": "USD",
    "stars": 4.6,
    "reviews_count": 12483,
    "in_stock": true,
    "asin": "B09X7MPX8L"
  }
]`,
  },
  {
    name: "LinkedIn",
    datasetId: "gd_l1viktl72bvl7bjuj0",
    url: "https://www.linkedin.com/in/satyanadella",
    printFields: ["name", "headline"],
    domain: "linkedin.com",
    response: `[
  {
    "name": "Satya Nadella",
    "headline": "Chairman and CEO at Microsoft",
    "company": "Microsoft",
    "location": "Redmond, Washington",
    "followers": 11200000,
    "connections": 500,
    "experience_count": 4
  }
]`,
  },
  {
    name: "Instagram",
    datasetId: "gd_l1vikfch901nx3by4",
    url: "https://www.instagram.com/instagram/",
    printFields: ["followers", "bio"],
    domain: "instagram.com",
    response: `[
  {
    "account": "instagram",
    "full_name": "Instagram",
    "followers": 690845210,
    "posts_count": 8062,
    "is_verified": true,
    "bio": "Discovering and telling stories from around the world.",
    "engagement_rate": 0.011
  }
]`,
  },
] as const;

type TargetName = (typeof TARGETS)[number]["name"];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); }
        catch { /* fallback */ }
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className="shrink-0 rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[11px] font-medium text-white/80 transition hover:bg-white/10"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

type HubCodeExampleProps = {
  /** When set, renders a single fixed example for this URL (hub pages). Without it, shows the Amazon/LinkedIn/Instagram switcher. */
  sampleUrl?: string;
  className?: string;
};

export default function HubCodeExample({ sampleUrl, className = "" }: HubCodeExampleProps) {
  const [lang, setLang] = useState<Lang>("cURL");
  const [targetName, setTargetName] = useState<TargetName>("Amazon");
  const multiTarget = !sampleUrl;
  const target = multiTarget
    ? TARGETS.find((t) => t.name === targetName) ?? TARGETS[0]
    : { name: "custom", datasetId: "DATASET_ID", url: sampleUrl, printFields: ["title", "price"] as const, domain: "", response: "" };
  const [f1, f2] = target.printFields;

  const curlCode = `curl -X POST "https://api.brightdata.com/datasets/v3/scrape?dataset_id=${target.datasetId}&format=json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '[{"url": "${target.url}"}]'`;

  const pythonCode = `import requests

response = requests.post(
    "https://api.brightdata.com/datasets/v3/scrape",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
    },
    params={"dataset_id": "${target.datasetId}", "format": "json"},
    json=[{"url": "${target.url}"}],
)

data = response.json()
print(data[0]["${f1}"], data[0]["${f2}"])`;

  const nodeCode = `const response = await fetch(
  "https://api.brightdata.com/datasets/v3/scrape?dataset_id=${target.datasetId}&format=json",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify([{ url: "${target.url}" }]),
  }
);

const data = await response.json();
console.log(data[0].${f1}, data[0].${f2});`;

  const codeMap: Record<Lang, string> = { cURL: curlCode, Python: pythonCode, "Node.js": nodeCode };
  const langs: Lang[] = ["cURL", "Python", "Node.js"];

  const requestCard = (
    <div className={`hub-code-example ${multiTarget ? "" : className}`}>
      <div className="hub-code-tabs">
        {langs.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={`hub-code-tab ${lang === l ? "active" : ""}`}
          >
            {l}
          </button>
        ))}
        <div className="hub-code-copy">
          <CopyBtn text={codeMap[lang]} />
        </div>
      </div>
      <pre className="hub-code-pre">
        <code>{codeMap[lang]}</code>
      </pre>
    </div>
  );

  if (!multiTarget) return requestCard;

  return (
    <div className={className}>
      <div className="hub-code-targets" role="tablist" aria-label="Example target">
        {TARGETS.map((t) => (
          <button
            key={t.name}
            type="button"
            role="tab"
            aria-selected={targetName === t.name}
            onClick={() => setTargetName(t.name)}
            className={`hub-code-target ${targetName === t.name ? "active" : ""}`}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div className="hub-code-duo">
        <div className="hub-code-col">
          <p className="hub-code-kicker">Request</p>
          {requestCard}
        </div>
        <div className="hub-code-col">
          <p className="hub-code-kicker">Response</p>
          <div className="hub-code-response">
            <div className="hub-code-response-chrome">
              <span className="hub-code-dots" aria-hidden="true">
                <i /><i /><i />
              </span>
              200 OK · {target.domain}
            </div>
            <pre className="hub-code-pre">
              <code>{target.response}</code>
            </pre>
          </div>
        </div>
      </div>
      <p className="hub-code-auth">
        <span aria-hidden="true">🔑</span> <strong>Authentication:</strong> pass your API
        key as a Bearer token in the <code>Authorization</code> header. Get your key at{" "}
        <a
          href="https://brightdata.com/cp/setting/users"
          target="_blank"
          rel="noopener noreferrer"
        >
          brightdata.com/cp/setting/users
        </a>
        .
      </p>
    </div>
  );
}
