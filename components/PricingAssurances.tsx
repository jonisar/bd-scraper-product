const ASSURANCES = [
  "No credit card required",
  "24/7 Expert support",
  "99.9% uptime",
  "GDPR & CCPA compliant",
] as const;

export default function PricingAssurances() {
  return (
    <ul className="pricing-assurances" aria-label="Plan assurances">
      {ASSURANCES.map((label) => (
        <li key={label}>
          <span className="pricing-assurance-check" aria-hidden="true">
            ✓
          </span>
          {label}
        </li>
      ))}
    </ul>
  );
}
