export default function DxComplianceSection({
  altBg = false,
  hubAnchor = false,
}: {
  altBg?: boolean;
  hubAnchor?: boolean;
} = {}) {
  return (
    <section className={`section ${altBg ? "section-alt " : ""}animate-rise${hubAnchor ? " hub-anchor" : ""}`} id="why">
      <div className="container">
        <div className="section-head">
          <span className="kicker">Compliance</span>
          <h2>Leading ethical web data collection</h2>
          <p>
            Only publicly available data. ISO&nbsp;27001 certified, SOC&nbsp;2 controls,
            GDPR &amp; CCPA compliant. Every use case is reviewed by a dedicated
            Compliance &amp; Ethics team, backed by a documented Know Your Customer
            process and Acceptable Use Policy.
          </p>
          <div className="compliance-badges" style={{ justifyContent: "center" }}>
            <span className="compliance-badge">GDPR</span>
            <span className="compliance-badge">CCPA</span>
            <span className="compliance-badge">ISO 27001</span>
            <span className="compliance-badge">SOC 2</span>
          </div>
          <p className="compliance-link">
            <a
              href="https://brightdata.com/trustcenter"
              target="_blank"
              rel="noopener noreferrer"
              className="value-link"
            >
              See the details in the Bright Data Trust Center ↗
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
