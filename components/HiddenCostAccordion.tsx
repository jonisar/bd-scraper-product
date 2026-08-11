export default function HiddenCostAccordion() {
  return (
    <details className="hidden-cost-details">
      <summary className="hidden-cost-summary">
        <span>Comparing scraping platforms? See what others charge extra for</span>
        <svg className="hidden-cost-chevron" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
      </summary>
      <div className="hidden-cost-body">
        <p>Most platforms stack extra charges on top of the per-record rate. With Bright Data, the record price is the whole bill:</p>
        <ul className="hidden-cost-list">
          <li><span className="hidden-cost-item">Compute / runtime units</span><span className="hidden-cost-note">commonly billed per scraper runtime hour or compute unit</span><span className="hidden-cost-included">✓ Included</span></li>
          <li><span className="hidden-cost-item">Residential proxy bandwidth</span><span className="hidden-cost-note">commonly billed per GB</span><span className="hidden-cost-included">✓ Included</span></li>
          <li><span className="hidden-cost-item">Storage &amp; dataset retention</span><span className="hidden-cost-note">commonly billed per GB-month</span><span className="hidden-cost-included">✓ Included</span></li>
          <li><span className="hidden-cost-item">Data transfer / egress</span><span className="hidden-cost-note">commonly billed per GB out</span><span className="hidden-cost-included">✓ Included</span></li>
          <li><span className="hidden-cost-item">Unblocking &amp; CAPTCHA solving</span><span className="hidden-cost-note">commonly a paid add-on</span><span className="hidden-cost-included">✓ Included</span></li>
          <li><span className="hidden-cost-item">Parsing to structured JSON</span><span className="hidden-cost-note">commonly your own code</span><span className="hidden-cost-included">✓ Included</span></li>
        </ul>
      </div>
    </details>
  );
}
