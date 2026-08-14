import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { LIBRARY_SUBNAV } from "@/lib/site-nav";
import HeroSearch from "@/components/HeroSearch";
import ScraperLibraryInfinite from "@/components/ScraperLibraryInfinite";
import ScrollReveal from "@/components/ScrollReveal";
import TrustedByStrip from "@/components/TrustedByStrip";
import { templates } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Scraper Library - 1,400+ Production-Ready Web Scrapers",
  description:
    "Browse 1,400+ pre-built web scrapers for e-commerce, social media, real estate, B2B, jobs, travel, and more. Built-in proxy rotation, CAPTCHA solving, and auto-maintenance. Start free.",
  openGraph: {
    title: "Scraper Library - 1,400+ Production-Ready Web Scrapers",
    description:
      "Browse 1,400+ pre-built web scrapers. Built-in proxies, anti-bot bypass, and structured data output. Start free with 5K records/month.",
    type: "website",
    url: "https://brightdata.com/products/web-scraper/scraper-lib",
    siteName: "Bright Data",
    images: [
      {
        url: "/images/og-scraper-lib.png",
        width: 1200,
        height: 630,
        alt: "Bright Data Scraper Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scraper Library - 1,400+ Production-Ready Web Scrapers",
    description:
      "Browse 1,400+ pre-built web scrapers. Built-in proxies, anti-bot bypass, and structured data. Start free.",
  },
  alternates: { canonical: "https://brightdata.com/products/web-scraper/scraper-lib" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://brightdata.com/products/web-scraper/scraper-lib",
  url: "https://brightdata.com/products/web-scraper/scraper-lib",
  name: "Scraper Library - 1,400+ Production-Ready Web Scrapers",
  description:
    "Browse production-ready web scrapers for any website. Built-in proxy rotation, CAPTCHA solving, and structured data delivery.",
  isPartOf: { "@id": "https://brightdata.com#website" },
  inLanguage: "en-US",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Bright Data", item: "https://brightdata.com" },
    { "@type": "ListItem", position: 2, name: "Web Scraper", item: "https://brightdata.com/products/web-scraper" },
    { "@type": "ListItem", position: 3, name: "Scraper Library", item: "https://brightdata.com/products/web-scraper/scraper-lib" },
  ],
};

export default function ScraperLibPage() {
  return (
    <div className="lib-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header subnav={LIBRARY_SUBNAV} />

      <main>
        {/* HERO — search-first like Apify Store */}
        <section className="hero">
          <div className="container hero-inner">
            <h1>
              Scraper <span className="grad-text">Library</span>
            </h1>
            <p className="hero-sub">
              A scraper for every website. Scrapers <span className="hero-stat-accent">auto-fix</span> when sites change — <span className="hero-stat-accent">infrastructure, unblocking, and scale</span> handled for you. Need something custom? <span className="hero-stat-accent">Build it in minutes with AI</span>, no code.
            </p>
            <HeroSearch templates={templates} />
          </div>
        </section>

        <TrustedByStrip />

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
