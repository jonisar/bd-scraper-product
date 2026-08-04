import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import ScrollReveal from "@/components/ScrollReveal";
import { CATALOG_CATEGORIES, catalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Scraper Categories - Browse by Industry & Platform",
  description:
    "Browse web scrapers by category: e-commerce, social media, B2B, jobs, real estate, travel, search, news, and finance. 1,300+ production-ready scrapers with built-in proxies.",
  openGraph: {
    title: "Scraper Categories - Browse by Industry & Platform",
    description:
      "Browse web scrapers by category. 1,300+ production-ready scrapers organized by industry and platform.",
    type: "website",
    url: "https://brightdata.com/products/web-scraper/scraper-lib/categories",
    siteName: "Bright Data",
  },
  alternates: { canonical: "https://brightdata.com/products/web-scraper/scraper-lib/categories" },
};

const CATEGORY_DETAILS: {
  name: string;
  slug: string;
  desc: string;
  icon: string;
  sites: string[];
  count: number;
}[] = CATALOG_CATEGORIES
  .filter((c) => c !== "All")
  .map((cat) => {
    const SLUG_OVERRIDES: Record<string, string> = {
      "E-commerce": "ecommerce",
      "Business (B2B)": "b2b",
      "Real Estate": "real-estate",
      "News & Media": "news-media",
    };
    const slug = SLUG_OVERRIDES[cat] ?? cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
    const items = catalog.filter((s) => s.category === cat);
    const topSites = [...new Set(items.map((s) => s.domain.replace(/^www\./, "")))].slice(0, 5);
    const icons: Record<string, string> = {
      "Social Media": "◎",
      "E-commerce": "⛁",
      "Business (B2B)": "⊞",
      "Jobs": "⬡",
      "Real Estate": "⌂",
      "Travel": "✈",
      "Search": "▲",
      "News & Media": "◈",
      "Finance": "∞",
    };
    const descriptions: Record<string, string> = {
      "Social Media": "Extract public posts, profiles, followers, engagement metrics, and trending content from all major social platforms.",
      "E-commerce": "Track prices, reviews, stock levels, seller data, and product catalogs across Amazon, Walmart, eBay, and more.",
      "Business (B2B)": "Collect company data, funding rounds, employee info, reviews, and competitive intelligence from professional platforms.",
      "Jobs": "Scrape job postings, salaries, skills required, company info, and applicant data from top job boards.",
      "Real Estate": "Gather property listings, pricing history, neighborhood data, and agent details from real estate platforms.",
      "Travel": "Monitor hotel rates, availability, reviews, and amenities from booking platforms worldwide.",
      "Search": "Collect SERP results, business listings, reviews, and local data from Google, Maps, and directories.",
      "News & Media": "Extract articles, scores, comments, and trending stories from news outlets and community platforms.",
      "Finance": "Get stock prices, market data, analyst ratings, and financial statements from finance portals.",
    };
    return {
      name: cat,
      slug,
      desc: descriptions[cat] || `${items.length} production-ready scrapers for ${cat.toLowerCase()}.`,
      icon: icons[cat] || "◈",
      sites: topSites,
      count: items.length,
    };
  });

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://brightdata.com/products/web-scraper/scraper-lib/categories",
  url: "https://brightdata.com/products/web-scraper/scraper-lib/categories",
  name: "Scraper Categories - Browse by Industry & Platform",
  description: "Browse 1,300+ web scrapers organized by category.",
  isPartOf: { "@id": "https://brightdata.com#website" },
  inLanguage: "en-US",
};

export default function CategoriesPage() {
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
            <span aria-current="page">Categories</span>
          </nav>
        </div>

        {/* HERO */}
        <section className="site-hub-hero">
          <div className="container hero-inner" style={{ textAlign: "center" }}>
            <h1>
              All <span className="grad-text">Categories</span>
            </h1>
            <p className="hero-sub">
              Find scrapers organized by industry, platform, and use case.
              Every scraper includes built-in proxies, CAPTCHA solving, and structured output.
            </p>
          </div>
        </section>

        {/* CATEGORY CARDS */}
        <section className="section" id="all-categories">
          <div className="container">
            <div className="slib-categories-grid">
              {CATEGORY_DETAILS.map((cat) => (
                <a
                  key={cat.slug}
                  href={`/products/web-scraper/${cat.slug}`}
                  className="slib-category-card"
                >
                  <div className="slib-category-header">
                    <span className="slib-category-icon">{cat.icon}</span>
                    <div>
                      <h2 className="slib-category-name">{cat.name}</h2>
                      <span className="slib-category-count">{cat.count} scrapers</span>
                    </div>
                  </div>
                  <p>{cat.desc}</p>
                  <div className="slib-category-sites">
                    {cat.sites.map((site) => (
                      <span key={site} className="slib-category-site">{site}</span>
                    ))}
                  </div>
                  <span className="slib-category-cta">Browse {cat.name} →</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="value-banner">
          <div className="container value-banner-inner">
            <div className="vb-item">
              <strong>{catalog.length}+</strong>
              <span>scrapers shown</span>
            </div>
            <div className="vb-item">
              <strong>{CATEGORY_DETAILS.length}</strong>
              <span>categories</span>
            </div>
            <div className="vb-item">
              <strong>98.4%</strong>
              <span>avg success rate</span>
            </div>
            <div className="vb-item">
              <strong>Free</strong>
              <span>5K records/mo</span>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final-cta animate-rise">
          <div className="container" style={{ textAlign: "center" }}>
            <h2>Can&rsquo;t find what you need?</h2>
            <p style={{ maxWidth: 520, margin: "0 auto 1.5rem", opacity: 0.8 }}>
              Build a custom scraper for any website in minutes with AI Scraper Studio — no code required.
            </p>
            <a
              href="/products/web-scraper/studio"
              className="btn btn-primary btn-pill"
              style={{ fontSize: "1.05rem", padding: "0.85rem 2.4rem" }}
            >
              Try Scraper Studio →
            </a>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollReveal />
    </div>
  );
}
