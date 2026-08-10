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
        <div className="twin-cols">
          <div className="twin-col">
            <span className="kicker">Developer experience</span>
            <h2>Easy to start. Easier to scale.</h2>
            <p>
              Get your API key and make your first call in minutes. Scale to millions with the same API, no infra changes.
            </p>
          </div>
          <div className="twin-col">
            <span className="kicker">Compliance</span>
            <h2>Leading ethical web data collection</h2>
            <p>
              Only publicly available data. ISO&nbsp;27001 certified, SOC&nbsp;2 controls,
              GDPR &amp; CCPA compliant. Backed by an industry-first Compliance &amp; Ethics team.
            </p>
            <div className="compliance-badges">
              <span className="compliance-badge">GDPR</span>
              <span className="compliance-badge">CCPA</span>
              <span className="compliance-badge">ISO 27001</span>
              <span className="compliance-badge">SOC 2</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
