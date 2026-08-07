"use client";

import { useState } from "react";

const DEFAULT_RESPONSE = `[{
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
}]`;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
        }
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }}
      className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/85 transition hover:bg-white/10"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function MiniCodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#2a4060] bg-bd-code-bg shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 sm:px-4 sm:py-2.5">
        <span className="font-mono text-[11px] text-white/55 sm:text-xs">{label}</span>
        <CopyButton text={code} />
      </div>
      <pre className="code-scroll max-h-[280px] overflow-auto p-3 text-[11px] leading-5 text-[#d7e6ff] sm:max-h-[360px] sm:p-4 sm:text-[13px] sm:leading-6">
        <code className="font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

type RestApiExampleProps = {
  datasetId: string;
  sampleUrl?: string;
  responseExample?: string;
  className?: string;
};

export default function RestApiExample({
  datasetId,
  sampleUrl = "https://www.amazon.com/dp/B09X7MPX8L",
  responseExample = DEFAULT_RESPONSE,
  className = "",
}: RestApiExampleProps) {
  const requestCode = `curl -X POST "https://api.brightdata.com/datasets/v3/scrape?dataset_id=${datasetId}&format=json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '[{"url":"${sampleUrl}"}]'`;

  return (
    <section className={className}>
      <h3 className="mb-3 text-lg font-bold text-bd-navy">REST API example</h3>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="min-w-0">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-bd-muted">
            Request
          </p>
          <MiniCodeBlock code={requestCode} label="bash" />
        </div>
        <div className="min-w-0">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-bd-muted">
            Response
          </p>
          <MiniCodeBlock code={responseExample} label="json" />
        </div>
      </div>
    </section>
  );
}
