export default function IncludedInEveryPlan({
  altBg = false,
  hubAnchor = false,
}: {
  altBg?: boolean;
  hubAnchor?: boolean;
} = {}) {
  return (
    <section className={`section ${altBg ? "section-alt " : ""}animate-rise${hubAnchor ? " hub-anchor" : ""}`} id="included">
      <div className="container">
        <div className="section-head">
          <span className="kicker">Included in every plan</span>
          <h2>Everything you need, built in</h2>
          <p>You pay for results. Proxies, rendering, concurrency, and delivery are always included, on every plan.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card"><span className="feature-icon">⟳</span><h3>400M+ proxy IPs</h3><p>Residential IPs across 195 countries. Automatic rotation. No extra charge.</p></div>
          <div className="feature-card"><span className="feature-icon">◈</span><h3>CAPTCHA &amp; anti-bot</h3><p>Automated CAPTCHA solving, fingerprinting, and user-agent rotation. Always on.</p></div>
          <div className="feature-card"><span className="feature-icon">⬡</span><h3>JS rendering</h3><p>Full browser rendering for SPAs and dynamic pages. No headless browser to manage.</p></div>
          <div className="feature-card"><span className="feature-icon">∞</span><h3>Unlimited concurrency</h3><p>No rate limits. Scale from 10 to 10M requests with zero config changes.</p></div>
          <div className="feature-card"><span className="feature-icon">⊞</span><h3>5K URLs per batch</h3><p>Bulk collection with scheduling, webhooks, and job management APIs.</p></div>
          <div className="feature-card"><span className="feature-icon">⇢</span><h3>Flexible delivery</h3><p>JSON, NDJSON, or CSV. Deliver via API response, webhook, or cloud storage.</p></div>
        </div>
      </div>
    </section>
  );
}
