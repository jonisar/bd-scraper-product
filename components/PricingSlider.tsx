"use client";

import { useState } from "react";

export const PRICING_TIERS = [
  { records: 5_000, label: "5K", monthly: 0, perK: 0, tag: "Free" },
  { records: 10_000, label: "10K", monthly: 15, perK: 1.5, tag: "Pay As You Go" },
  { records: 50_000, label: "50K", monthly: 75, perK: 1.5, tag: "" },
  { records: 100_000, label: "100K", monthly: 150, perK: 1.5, tag: "" },
  { records: 384_000, label: "384K", monthly: 499, perK: 1.3, tag: "Scale plan" },
  { records: 500_000, label: "500K", monthly: 600, perK: 1.2, tag: "" },
  { records: 1_000_000, label: "1M", monthly: 1_100, perK: 1.1, tag: "" },
  { records: 5_000_000, label: "5M", monthly: 5_000, perK: 1.0, tag: "Enterprise" },
] as const;

type PricingSliderProps = {
  className?: string;
  /** Unit label in copy — defaults to "records" */
  unit?: "records" | "page loads";
};

export default function PricingSlider({
  className = "",
  unit = "records",
}: PricingSliderProps) {
  const [tierIdx, setTierIdx] = useState(0);
  const tier = PRICING_TIERS[tierIdx];
  const unitShort = unit === "page loads" ? "page loads" : "records";

  return (
    <section
      className={`rounded-xl border border-bd-line bg-bd-canvas p-5 sm:p-6 ${className}`.trim()}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-bd-muted">
            Predict your cost
          </p>
          <p className="mt-3 text-sm font-medium text-bd-ink">
            {unit === "page loads" ? "Page loads" : "Records"} per month:{" "}
            <span className="text-lg font-extrabold text-bd-navy">{tier.label}</span>
          </p>

          <input
            type="range"
            min={0}
            max={PRICING_TIERS.length - 1}
            value={tierIdx}
            onChange={(e) => setTierIdx(Number(e.target.value))}
            className="pricing-slider mt-3 w-full cursor-pointer"
            aria-label={`${unitShort} per month`}
          />
          <div className="mt-1 flex justify-between text-[10px] text-bd-muted">
            {PRICING_TIERS.map((t, i) => (
              <span
                key={t.label}
                className={`${i === tierIdx ? "font-bold text-bd-blue" : ""} ${i % 2 !== 0 && i !== tierIdx ? "hidden sm:inline" : ""}`}
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>

        <div className="shrink-0 rounded-xl border border-bd-line bg-bd-panel px-6 py-5 text-center sm:w-[220px]">
          <p className="text-3xl font-extrabold text-bd-navy">
            {tier.records === 5_000 ? "$0" : `$${tier.monthly.toLocaleString()}`}
            {tier.records !== 5_000 && (
              <span className="text-base font-semibold text-bd-muted">/mo</span>
            )}
          </p>
          <p className="mt-0.5 text-xs text-bd-muted">
            {tier.records === 5_000
              ? `5,000 ${unitShort}/month`
              : `$${tier.perK.toFixed(2)} per 1,000 ${unitShort}`}
          </p>
          <p className="mt-1 h-5 text-xs font-semibold">
            {tier.records === 5_000 ? (
              <span className="text-bd-success">No credit card required</span>
            ) : tier.tag ? (
              <span className="inline-block rounded-full bg-bd-blue/10 px-2.5 py-0.5 text-[11px] font-bold text-bd-blue">
                {tier.tag}
              </span>
            ) : null}
          </p>
          <p className="mt-1.5 text-[11px] leading-4 text-bd-muted">
            Your whole bill. Proxies, unblocking, parsing included.
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

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-bd-line pt-4 text-xs text-bd-muted">
        <span className="flex items-center gap-1.5">
          <span className="text-bd-success">✓</span> Pay only for success
        </span>
        <span className="hidden text-bd-line sm:inline">·</span>
        <span className="flex items-center gap-1.5">
          <span className="text-bd-success">✓</span> 5K {unitShort}/mo free
        </span>
        <span className="hidden text-bd-line sm:inline">·</span>
        <span className="flex items-center gap-1.5">
          <span className="text-bd-success">✓</span> From $1.00/1K {unitShort}
        </span>
        <span className="hidden text-bd-line sm:inline">·</span>
        <span className="flex items-center gap-1.5">
          <span className="text-bd-success">✓</span> No add-on fees
        </span>
      </div>
    </section>
  );
}
