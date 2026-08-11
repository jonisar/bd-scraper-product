export default function ValueBanner() {
  return (
    <section className="value-banner">
      <div className="container value-banner-inner">
        <a
          className="vb-item vb-item-link"
          href="https://aimultiple.com/web-scraping-apis"
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>
            <span className="vb-emoji" aria-hidden="true">
              🏆
            </span>
            #1
          </strong>
          <span>AIMultiple world ranking ↗</span>
        </a>
        <div className="vb-item">
          <strong>1,400+</strong>
          <span>Verified scrapers</span>
        </div>
        <div className="vb-item">
          <strong>400M+</strong>
          <span>proxy IPs built in</span>
        </div>
        <div className="vb-item">
          <strong>195</strong>
          <span>countries covered</span>
        </div>
        <div className="vb-item">
          <strong>
            <span className="vb-emoji vb-emoji-gold" aria-hidden="true">
              ✔
            </span>
            GDPR &amp; CCPA
          </strong>
          <span>Full compliance</span>
        </div>
      </div>
    </section>
  );
}
