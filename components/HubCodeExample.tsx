"use client";

import { useState } from "react";

type Lang = "cURL" | "Python" | "Node.js";

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
  sampleUrl?: string;
  className?: string;
};

export default function HubCodeExample({
  sampleUrl = "https://www.amazon.com/dp/B09X7MPX8L",
  className = "",
}: HubCodeExampleProps) {
  const [lang, setLang] = useState<Lang>("cURL");

  const curlCode = `curl -X POST "https://api.brightdata.com/datasets/v3/scrape?dataset_id=DATASET_ID&format=json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '[{"url": "${sampleUrl}"}]'`;

  const pythonCode = `import requests

response = requests.post(
    "https://api.brightdata.com/datasets/v3/scrape",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
    },
    params={"dataset_id": "DATASET_ID", "format": "json"},
    json=[{"url": "${sampleUrl}"}],
)

data = response.json()
print(data[0]["title"], data[0]["price"])`;

  const nodeCode = `const response = await fetch(
  "https://api.brightdata.com/datasets/v3/scrape?dataset_id=DATASET_ID&format=json",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify([{ url: "${sampleUrl}" }]),
  }
);

const data = await response.json();
console.log(data[0].title, data[0].price);`;

  const codeMap: Record<Lang, string> = { cURL: curlCode, Python: pythonCode, "Node.js": nodeCode };
  const langs: Lang[] = ["cURL", "Python", "Node.js"];

  return (
    <div className={`hub-code-example ${className}`}>
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
}
