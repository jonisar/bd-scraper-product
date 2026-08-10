"use client";

const SIGNUP = "https://brightdata.com/cp/start";
const CONTACT = "https://brightdata.com/contact";

interface Plan {
  tier: string;
  price: string;
  unit: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
}

function getPlans(unit: string): Plan[] {
  return [
    {
      tier: "Free",
      price: "5K",
      unit: `${unit}/mo`,
      features: ["No credit card required", `All ${unit === "page loads" ? "AI generation" : "scrapers"} included`, "24/7 Expert support"],
      cta: "Start free",
      href: SIGNUP,
    },
    {
      tier: "Pay as you go",
      price: "$1.00–1.50",
      unit: `/1K ${unit}`,
      features: ["Pay only for success", "Unlimited concurrency", "Set monthly spend limits"],
      cta: "Start free",
      href: SIGNUP,
      featured: true,
    },
    {
      tier: "Scale",
      price: "$499",
      unit: "/month",
      features: [`384K ${unit} included`, "$1.00/1K at volume", "Cancel anytime"],
      cta: "Start free",
      href: SIGNUP,
    },
    {
      tier: "Enterprise",
      price: "Custom",
      unit: "",
      features: ["Volume discounts", "Account manager", "Premium SLA & SSO"],
      cta: "Talk to sales",
      href: CONTACT,
    },
  ];
}

export function PricingCards({
  unit = "records",
  compact = false,
}: {
  unit?: "records" | "page loads";
  compact?: boolean;
}) {
  const plans = getPlans(unit);

  return (
    <div className={`pc-grid${compact ? " pc-compact" : ""}`}>
      {plans.map((p) => (
        <div key={p.tier} className={`pc-card${p.featured ? " pc-featured" : ""}`}>
          <p className="pc-tier">{p.tier}</p>
          <div className="pc-price">
            <strong>{p.price}</strong>
            {p.unit && <span>{p.unit}</span>}
          </div>
          <ul className="pc-features">
            {p.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <a
            href={p.href}
            className={`pc-cta${p.featured ? " pc-cta-primary" : ""}`}
            target="_blank"
            rel="noreferrer"
          >
            {p.cta}
          </a>
        </div>
      ))}
    </div>
  );
}
