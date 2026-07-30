"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, consoleUrl, type Template } from "@/lib/templates";

export default function TemplateMarketplace({ templates }: { templates: Template[] }) {
  const [cat, setCat] = useState<string>("All");

  const filtered = useMemo(
    () => templates.filter((t) => cat === "All" || t.category === cat),
    [templates, cat]
  );

  return (
    <div className="market">
      {/* sidebar */}
      <aside className="market-side">
        <div className="market-side-title">Category</div>
        <ul className="market-cats">
          {CATEGORIES.map((c) => (
            <li key={c}>
              <button
                className={`market-cat ${cat === c ? "active" : ""}`}
                onClick={() => setCat(c)}
              >
                {c}
                <span className="market-cat-n">
                  {c === "All" ? templates.length : templates.filter((t) => t.category === c).length}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* grid */}
      <div className="market-grid">
        {filtered.map((t) => (
          <a key={t.slug} href={consoleUrl(t)} target="_blank" rel="noopener noreferrer" className="tcard">
            <div className="tcard-body">
              <div className="tcard-head">
                <span className="tcard-icon" style={{ color: t.color }}>{t.icon}</span>
                <div className="tcard-title-group">
                  <span className="tcard-name">{t.name}</span>
                  <span className="tcard-domain">{t.domain}</span>
                </div>
                {t.popular && <span className="badge badge-hot">Popular</span>}
              </div>
              <p className="tcard-desc">{t.description}</p>
              <div className="tcard-stats">
                <span className="tcard-stat">
                  <strong>{t.totalFields ?? t.dictionary.length}</strong> fields
                </span>
                <span className="tcard-stat">
                  <strong>{t.endpoints.length}</strong> endpoint{t.endpoints.length > 1 ? "s" : ""}
                </span>
                <span className="tcard-stat">
                  <strong>{t.responseTime.replace("~", "").replace(" per input", "")}</strong>
                </span>
              </div>
              {t.benchmark && (
                <div className="tcard-benchmark">
                  ★ {t.benchmark.rank} — {t.benchmark.source}
                </div>
              )}
            </div>
            <div className="tcard-foot">
              <span className="tcard-maintained">✓ Bright Data maintained</span>
              <span className="tcard-price">$1.50/1K records</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
