type ChooseYourPathProps = {
  name?: string;
};

export default function ChooseYourPath(_props: ChooseYourPathProps) {

  return (
    <div className="hub-paths">
      <a href="#code" className="hub-path-card">
        <span className="hub-path-kicker">API</span>
        <h3>Call it from code</h3>
        <p>
          Trigger runs with parameters, schedule recurring jobs, and deliver to
          your storage or webhook.
        </p>
        <ul className="hub-path-list">
          <li>Build requests in any language</li>
          <li>Automate with schedulers and webhooks</li>
          <li>JSON, NDJSON, or CSV delivery</li>
        </ul>
        <span className="hub-path-cta">Start with API →</span>
      </a>
      <a
        href="https://brightdata.com/cp/scrapers/gd_l7q7dkf244hwjntr0/pdp/configuration"
        className="hub-path-card"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="hub-path-kicker">Control panel</span>
        <h3>Run it in the control panel</h3>
        <p>
          No engineering required: configure inputs, run, and download results
          in one place.
        </p>
        <ul className="hub-path-list">
          <li>Configure inputs visually</li>
          <li>Run with one click</li>
          <li>Download JSON or CSV</li>
        </ul>
        <span className="hub-path-cta">Open control panel →</span>
      </a>
      <a href="#agents" className="hub-path-card">
        <span className="hub-path-kicker">AI agent</span>
        <h3>Hand it to your agent</h3>
        <p>
          Your agent reads SKILL.md over MCP or the CLI and scrapes on its own.
        </p>
        <ul className="hub-path-list">
          <li>Works with any MCP-compatible agent</li>
          <li>One prompt to scrape</li>
          <li>Structured JSON straight back to your agent</li>
        </ul>
        <span className="hub-path-cta">Connect your agent →</span>
      </a>
    </div>
  );
}
