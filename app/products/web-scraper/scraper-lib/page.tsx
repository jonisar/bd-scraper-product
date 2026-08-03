import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import HeroSearch from "@/components/HeroSearch";
import ScraperLibraryInfinite from "@/components/ScraperLibraryInfinite";
import ScrollReveal from "@/components/ScrollReveal";
import TrustedByStrip from "@/components/TrustedByStrip";
import { templates } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Scraper Library — 1,300+ Production-Ready Web Scrapers | Bright Data",
  description:
    "Browse 1,300+ pre-built web scrapers for e-commerce, social media, real estate, B2B, jobs, travel, and more. Built-in proxy rotation, CAPTCHA solving, and auto-maintenance. Start free.",
  openGraph: {
    title: "Scraper Library — 1,300+ Production-Ready Web Scrapers | Bright Data",
    description:
      "Browse 1,300+ pre-built web scrapers. Built-in proxies, anti-bot bypass, and structured data output. Start free with 5K records/month.",
    type: "website",
    url: "https://brightdata.com/products/web-scraper/scraper-lib",
    siteName: "Bright Data",
  },
  alternates: { canonical: "https://brightdata.com/products/web-scraper/scraper-lib" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://brightdata.com/products/web-scraper/scraper-lib",
  url: "https://brightdata.com/products/web-scraper/scraper-lib",
  name: "Scraper Library — 1,300+ Production-Ready Web Scrapers",
  description:
    "Browse production-ready web scrapers for any website. Built-in proxy rotation, CAPTCHA solving, and structured data delivery.",
  isPartOf: { "@id": "https://brightdata.com#website" },
  inLanguage: "en-US",
};

export default function ScraperLibPage() {
  return (
    <div className="lib-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main>
        {/* HERO — search-first like Apify Store */}
        <section className="hero">
          <div className="container hero-inner">
            <h1>
              Scraper <span className="grad-text">Library</span>
            </h1>
            <p className="hero-sub">
              <span className="hero-stat-accent">1,300+ production scrapers</span> for any website. Built-in proxies,
              anti-bot bypass, and structured data output — just pick one and go.
            </p>
            <HeroSearch templates={templates} />
          </div>
        </section>

        <TrustedByStrip compact />

        {/* INFINITE SCROLL LIBRARY */}
        <section className="slib-section" id="library">
          <div className="container">
            <ScraperLibraryInfinite />
          </div>
        </section>
      </main>

      <Footer />
      <ScrollReveal />
    </div>
  );
}
