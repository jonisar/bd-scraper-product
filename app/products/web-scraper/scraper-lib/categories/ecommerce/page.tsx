import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import ScraperCard from "@/components/ScraperCard";
import ScrollReveal from "@/components/ScrollReveal";
import TrustedByStrip from "@/components/TrustedByStrip";
import AiPromptCta from "@/components/AiPromptCta";
import { catalog } from "@/lib/catalog";
import { scraperHref } from "@/lib/scraper-href";

export const metadata: Metadata = {
  title: "E-commerce Scrapers — Amazon, Walmart, eBay & More",
  description:
    "Production-ready e-commerce scrapers for Amazon, Walmart, eBay, Etsy, Target, Shopify, and more. Track prices, reviews, stock levels, and seller data. Built-in proxies and auto-maintenance.",
  openGraph: {
    title: "E-commerce Scrapers — Amazon, Walmart, eBay & More",
    description:
      "Scrape product data from any e-commerce site. Price monitoring, review collection, and competitive intelligence at scale.",
    type: "website",
    url: "https://brightdata.com/products/web-scraper/scraper-lib/categories/ecommerce",
    siteName: "Bright Data",
  },
  alternates: { canonical: "https://brightdata.com/products/web-scraper/scraper-lib/categories/ecommerce" },
};

const ecommerceScrapers = catalog.filter((s) => s.category === "E-commerce");

const USE_CASES = [
  {
    title: "Price monitoring",
    desc: "Track competitor pricing across marketplaces in real time. Detect discounts, MAP violations, and repricing patterns automatically.",
  },
  {
    title: "Review analysis",
    desc: "Collect product reviews at scale for sentiment analysis, feature extraction, and competitive benchmarking.",
  },
  {
    title: "Catalog enrichment",
    desc: "Enrich your product catalog with descriptions, images, specs, and categories from competitor listings.",
  },
  {
    title: "Seller intelligence",
    desc: "Monitor seller ratings, inventory levels, shipping options, and new product launches across multiple marketplaces.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://brightdata.com/products/web-scraper/scraper-lib/categories/ecommerce",
  url: "https://brightdata.com/products/web-scraper/scraper-lib/categories/ecommerce",
  name: "E-commerce Scrapers — Amazon, Walmart, eBay & More",
  description: "Production-ready e-commerce web scrapers for price monitoring, review collection, and competitive intelligence.",
  isPartOf: { "@id": "https://brightdata.com#website" },
  inLanguage: "en-US",
};

export default function EcommerceCategoryPage() {
  return (
    <div className="lib-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main>
        {/* BREADCRUMB */}
        <div className="container">
          <nav className="site-breadcrumb" aria-label="Breadcrumb">
            <a href="/products/web-scraper">Web Scraper</a>
            <span aria-hidden="true">›</span>
            <a href="/products/web-scraper/scraper-lib">Scraper Library</a>
            <span aria-hidden="true">›</span>
            <a href="/products/web-scraper/scraper-lib/categories">Categories</a>
            <span aria-hidden="true">›</span>
            <span aria-current="page">E-commerce</span>
          </nav>
        </div>

        {/* HERO */}
        <section className="site-hub-hero">
          <div className="container hero-inner" style={{ textAlign: "center" }}>
            <h1>
              E-commerce <span className="grad-text">Scrapers</span>
            </h1>
            <p className="hero-sub">
              {ecommerceScrapers.length} production-ready scrapers for Amazon, Walmart, eBay, Etsy, Target, AliExpress, and more.
              Track prices, reviews, stock levels, and seller data at scale.
            </p>
            <p className="hub-hero-note">
              Built-in proxies · CAPTCHA solving · Auto-maintained 24/7 · Start free
            </p>
          </div>
        </section>

        <TrustedByStrip compact />

        {/* SCRAPER GRID */}
        <section className="section scrapers-first" id="scrapers">
          <div className="container">
            <div className="section-head">
              <span className="kicker">E-commerce</span>
              <h2>All e-commerce scrapers</h2>
              <p>
                Extract product data, pricing, reviews, and seller info from the world&rsquo;s largest marketplaces.
              </p>
            </div>
            <div className="lib-grid">
              {ecommerceScrapers.map((s) => (
                <ScraperCard
                  key={s.id}
                  name={s.name}
                  domain={s.domain}
                  category={s.category}
                  desc={s.desc}
                  views={s.views}
                  downloads={s.downloads}
                  href={scraperHref(s)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section className="section section-alt animate-rise" id="use-cases">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Use cases</span>
              <h2>What you can do with e-commerce scrapers</h2>
              <p>Common workflows powered by structured product data.</p>
            </div>
            <div className="features-grid">
              {USE_CASES.map((uc) => (
                <div key={uc.title} className="feature-card">
                  <h3>{uc.title}</h3>
                  <p>{uc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PLATFORMS COVERED */}
        <section className="section animate-rise" id="platforms">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Platforms</span>
              <h2>Supported e-commerce platforms</h2>
              <p>Pre-built scrapers for these sites — or create your own with Scraper Studio.</p>
            </div>
            <div className="slib-platforms">
              {[...new Set(ecommerceScrapers.map((s) => s.domain))].map((domain) => (
                <span key={domain} className="slib-platform-pill">{domain}</span>
              ))}
            </div>
          </div>
        </section>

        {/* VALUE BANNER */}
        <section className="value-banner">
          <div className="container value-banner-inner">
            <div className="vb-item">
              <strong>{ecommerceScrapers.length}</strong>
              <span>e-commerce scrapers</span>
            </div>
            <div className="vb-item">
              <strong>99.2%</strong>
              <span>success rate</span>
            </div>
            <div className="vb-item">
              <strong>~15s</strong>
              <span>avg response</span>
            </div>
            <div className="vb-item">
              <strong>95+</strong>
              <span>data fields</span>
            </div>
            <div className="vb-item">
              <strong>Free</strong>
              <span>5K records/mo</span>
            </div>
          </div>
        </section>

        {/* CTA */}
        <AiPromptCta />
      </main>

      <Footer />
      <ScrollReveal />
    </div>
  );
}
