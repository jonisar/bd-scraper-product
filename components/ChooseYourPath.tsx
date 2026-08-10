type ChooseYourPathProps = {
  name?: string;
};

export default function ChooseYourPath({ name }: ChooseYourPathProps) {
  const label = name || "web";
  const heading = name
    ? `Effortlessly scrape ${name} data`
    : "Start scraping in minutes, your way";

  return (
    <div className="hub-paths">
      <a
        href="https://brightdata.com/cp/start"
        className="hub-path-card"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="hub-path-kicker">API-based scraper</span>
        <h3>{label === "web" ? "Web Scraper API" : `${name} Scraper API`}</h3>
        <p>
          Trigger collections with parameters, schedule at scale, and deliver to
          your storage or webhook.
        </p>
        <ul className="hub-path-list">
          <li>Build requests in any language</li>
          <li>Automate with schedulers &amp; webhooks</li>
          <li>JSON, NDJSON, or CSV delivery</li>
        </ul>
        <span className="hub-path-cta">Start with API →</span>
      </a>
      <a
        href="https://brightdata.com/cp/data_collector/collectors/create?camp=plg"
        className="hub-path-card"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="hub-path-kicker">Control panel scraper</span>
        <h3>{label === "web" ? "No-code scraper" : `${name} no-code scraper`}</h3>
        <p>
          Plug-and-play in the control panel, add inputs, run the scraper,
          download results.
        </p>
        <ul className="hub-path-list">
          <li>No engineering required</li>
          <li>Configure inputs in the UI</li>
          <li>Download results from the CP</li>
        </ul>
        <span className="hub-path-cta">Open control panel →</span>
      </a>
      <a href="#agents" className="hub-path-card">
        <span className="hub-path-kicker">AI agent integration</span>
        <h3>{label === "web" ? "Agent scraper" : `${name} agent scraper`}</h3>
        <p>
          Connect via MCP or CLI, your AI agent reads a skill file and scrapes
          autonomously.
        </p>
        <ul className="hub-path-list">
          <li>Works with any MCP-compatible agent</li>
          <li>Single prompt to scrape</li>
          <li>Structured data returned to agent</li>
        </ul>
        <span className="hub-path-cta">Connect your agent →</span>
      </a>
    </div>
  );
}
