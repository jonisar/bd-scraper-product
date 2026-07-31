const LOGOS = [
  { name: "McDonald\u2019s", cls: "" },
  { name: "Moody\u2019s", cls: "" },
  { name: "NBCUniversal", cls: "logo-marquee-wide" },
  { name: "Nokia", cls: "logo-marquee-caps" },
  { name: "University of Oxford", cls: "logo-marquee-sm" },
  { name: "Pfizer", cls: "" },
  { name: "Shopee", cls: "" },
  { name: "Taboola", cls: "" },
] as const;

export default function TrustedByStrip({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`customers-strip${compact ? " customers-strip-compact" : ""}`}>
      <div className={compact ? "customers-strip-inner" : "container"}>
        <div className="customers-panel">
          <h2 className="customers-label">Trusted by 20,000+ customers worldwide</h2>
          <div className="customers-track">
            <div className="customers-fade customers-fade-l" />
            <div className="customers-fade customers-fade-r" />
            <div className="logo-marquee">
              {[0, 1].map((i) => (
                <div key={i} className="logo-marquee-set" aria-hidden={i === 1 ? true : undefined}>
                  {LOGOS.map((co) => (
                    <span key={co.name} className={`logo-item ${co.cls}`}>
                      <span className="logo-text">{co.name}</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
