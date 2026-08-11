export default function CompareTable({
  name,
  title,
  description,
  scraperRow,
  othersHeader = "Other providers",
  altBg = false,
  hubAnchor = false,
}: {
  name: string;
  title: string;
  description: string;
  scraperRow: { label: string; bd: string; others: string; diy: string };
  othersHeader?: string;
  altBg?: boolean;
  hubAnchor?: boolean;
}) {
  return (
    <section className={`section ${altBg ? "section-alt " : ""}animate-rise${hubAnchor ? " hub-anchor" : ""}`} id="compare">
      <div className="container">
        <div className="section-head">
          <span className="kicker">Why Bright Data</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <caption className="sr-only">
              {name} scraper comparison: Bright Data vs other providers vs DIY
            </caption>
            <thead>
              <tr>
                <th scope="col">Capability</th>
                <th scope="col" className="compare-highlight">Bright Data</th>
                <th scope="col">{othersHeader}</th>
                <th scope="col">DIY (self-built)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Auto-scaling infrastructure</td><td className="compare-highlight">✓ Unlimited</td><td>Partial</td><td>Manual</td></tr>
              <tr><td>Anti-bot &amp; CAPTCHA bypass</td><td className="compare-highlight">✓ Built-in</td><td>Partial</td><td>Build yourself</td></tr>
              <tr><td>Residential proxy network</td><td className="compare-highlight">✓ 400M+ IPs</td><td>Limited pool</td><td>Buy separately</td></tr>
              <tr><td>{scraperRow.label}</td><td className="compare-highlight">{scraperRow.bd}</td><td>{scraperRow.others}</td><td>{scraperRow.diy}</td></tr>
              <tr><td>Auto-maintenance (site changes)</td><td className="compare-highlight">✓ 24/7</td><td>Depends on who built it</td><td>Your team</td></tr>
              <tr><td>Pricing model</td><td className="compare-highlight">✓ One all-in price per record</td><td>Compute, proxy, and storage metered separately</td><td>Infra plus engineering time</td></tr>
              <tr><td>Failed requests</td><td className="compare-highlight">✓ Free, pay only for success</td><td>Often billed</td><td>Your cost either way</td></tr>
              <tr><td>Custom sites (no pre-built scraper)</td><td className="compare-highlight">✓ AI builds it in minutes, self-healing included</td><td>Community-built scrapers, no SLA</td><td>Weeks of code</td></tr>
              <tr><td>Compliance (GDPR, CCPA, SOC 2)</td><td className="compare-highlight">✓ Full</td><td>Partial</td><td>Your responsibility</td></tr>
              <tr><td>Structured output (JSON/CSV)</td><td className="compare-highlight">✓ Automatic</td><td>✓</td><td>Build parsers</td></tr>
              <tr><td>Support</td><td className="compare-highlight">✓ 24/7 experts, even on the free tier</td><td>Community forum</td><td>You are the support</td></tr>
              <tr><td>Free tier</td><td className="compare-highlight">✓ 5K records/mo</td><td>Varies</td><td>Infra costs</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
