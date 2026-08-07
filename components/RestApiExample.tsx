"use client";

import { useEffect, useState } from "react";

const SYNC_RESPONSE = `[{
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

const ASYNC_RESPONSE = `{
  "snapshot_id": "s_m4x9k2p1q8r7t6v5"
}`;

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
        <span className="font-mono text-[11px] text-white/65 sm:text-xs">{label}</span>
        <CopyButton text={code} />
      </div>
      <pre className="code-scroll max-h-[280px] overflow-auto p-3 text-[11px] leading-5 text-[#d7e6ff] sm:max-h-[360px] sm:p-4 sm:text-[13px] sm:leading-6">
        <code className="font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

type ApiMode = "sync" | "async";

type RestApiExampleProps = {
  datasetId: string;
  /** Controlled or initial mode. Defaults to sync. */
  mode?: ApiMode;
  onModeChange?: (mode: ApiMode) => void;
  sampleUrl?: string;
  className?: string;
};

export default function RestApiExample({
  datasetId,
  mode: modeProp = "sync",
  onModeChange,
  sampleUrl = "https://www.amazon.com/dp/B09X7MPX8L",
  className = "",
}: RestApiExampleProps) {
  const [mode, setMode] = useState<ApiMode>(modeProp);

  useEffect(() => {
    setMode(modeProp);
  }, [modeProp]);

  const selectMode = (next: ApiMode) => {
    setMode(next);
    onModeChange?.(next);
  };

  const endpoint = mode === "sync" ? "scrape" : "trigger";
  const requestCode = `curl -X POST "https://api.brightdata.com/datasets/v3/${endpoint}?dataset_id=${datasetId}&format=json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '[{"url":"${sampleUrl}"}]'`;

  const responseExample = mode === "sync" ? SYNC_RESPONSE : ASYNC_RESPONSE;
  const responseLabel = mode === "sync" ? "Response" : "Response (trigger)";

  return (
    <section className={className}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-bd-navy">REST API example</h3>
        <div
          className="inline-flex shrink-0 rounded-lg border border-bd-line bg-bd-canvas p-0.5"
          role="group"
          aria-label="API mode"
        >
          {([
            { id: "sync" as const, label: "Sync", hint: "/scrape" },
            { id: "async" as const, label: "Async", hint: "/trigger" },
          ]).map((opt) => {
            const active = mode === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={active}
                onClick={() => selectMode(opt.id)}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 ${
                  active
                    ? "bg-bd-blue text-white shadow-sm shadow-bd-blue/25"
                    : "text-bd-muted hover:text-bd-ink"
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`hidden font-mono text-[10px] font-medium sm:inline ${
                    active ? "text-white/75" : "text-bd-muted/80"
                  }`}
                >
                  {opt.hint}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="min-w-0">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-bd-muted">
            Request
          </p>
          <MiniCodeBlock code={requestCode} label="bash" />
        </div>
        <div className="min-w-0">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-bd-muted">
            {responseLabel}
          </p>
          <MiniCodeBlock code={responseExample} label="json" />
          {mode === "async" ? (
            <p className="mt-2 text-xs leading-5 text-bd-ink/85">
              Poll{" "}
              <code className="font-mono text-[11px] text-bd-blue">
                /datasets/v3/snapshots/&#123;snapshot_id&#125;
              </code>{" "}
              or deliver via webhook to get the product JSON.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
