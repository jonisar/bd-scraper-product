export default function HowItWorksSteps({
  heading,
  step1,
  altBg = false,
  hubAnchor = false,
}: {
  heading: string;
  step1: string;
  altBg?: boolean;
  hubAnchor?: boolean;
}) {
  return (
    <section className={`section ${altBg ? "section-alt " : ""}animate-rise${hubAnchor ? " hub-anchor" : ""}`} id="steps">
      <div className="container">
        <div className="section-head">
          <span className="kicker">How it works</span>
          <h2>{heading}</h2>
          <p>No proxies to configure, no infrastructure to manage. Pick, call, and receive.</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <span className="step-icon">01</span>
            <h3>Pick a scraper</h3>
            <p>{step1}</p>
          </div>
          <div className="step-card">
            <span className="step-icon">02</span>
            <h3>Call the API</h3>
            <p>One API call with up to 5,000 target URLs. Python and Node.js SDKs, CLI, MCP server, or any HTTP client.</p>
          </div>
          <div className="step-card">
            <span className="step-icon">03</span>
            <h3>Get structured data</h3>
            <p>Receive clean, parsed data in JSON, NDJSON, or CSV. Delivered via API, webhook, or cloud storage.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
