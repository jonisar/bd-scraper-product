import Link from "next/link";
import HeaderSearch from "./HeaderSearch";

export function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/products/web-scraper" className="brand">
          <span className="brand-mark">BD</span>
          <span style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Bright Data</span>
          <span className="brand-sub" style={{ color: "var(--text-3)", fontWeight: 400, fontSize: 14 }}>
            / Web Scraper API
          </span>
        </Link>
        <HeaderSearch />
        <nav className="nav-links">
          <Link href="/products/web-scraper#library" className="hide-sm">Scrapers</Link>
          <Link href="/products/web-scraper#agents" className="hide-sm">For agents</Link>
          <Link href="/products/web-scraper#studio" className="hide-sm">Build your own</Link>
          <a
            href="https://brightdata.com/cp/start"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm btn-pill"
          >
            Start free
          </a>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="brand">
            <span className="brand-mark">BD</span>
            <span style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Bright Data</span>
          </div>
          <div className="footer-links">
            <Link href="/products/web-scraper#library">Scrapers</Link>
            <Link href="/products/web-scraper#agents">For agents</Link>
            <a href="https://docs.brightdata.com/datasets/web-scraper-api/overview" target="_blank" rel="noopener noreferrer">Docs</a>
            <a href="https://brightdata.com/pricing/web-scraper" target="_blank" rel="noopener noreferrer">Pricing</a>
            <a href="https://github.com/luminati-io" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
        <p className="disclaimer">
          All scrapers collect publicly available data only. Bring your own Bright Data API key.
          No credentials ship in this library. Bright Data is ISO 27001 certified, GDPR-ready,
          with SOC&nbsp;2 controls. 99.99% uptime SLA.
        </p>
      </div>
    </footer>
  );
}
