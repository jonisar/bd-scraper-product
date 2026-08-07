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
          <p>No proxies to configure, no infrastructure to manage. Just pick, call, and receive.</p>
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
            <p>One REST call with your target URL. Works with Python, Node.js, cURL, or any HTTP client.</p>
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
