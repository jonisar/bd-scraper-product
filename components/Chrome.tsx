"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import HeaderSearch from "./HeaderSearch";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-bd-line/60 bg-[#000000e6] backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-6">
          <Link href="/products/web-scraper" className="flex shrink-0 items-center gap-2.5">
            <span className="brand-mark grid h-8 w-8 place-items-center rounded-lg text-sm font-extrabold text-white shadow-sm shadow-bd-blue/40">
              BD
            </span>
            <span className="text-[15px] font-extrabold tracking-tight text-bd-navy">
              Bright Data
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-semibold text-bd-ink lg:flex">
            <Link href="/products/web-scraper#library" className="transition hover:text-bd-navy">
              Scrapers
            </Link>
            <a
              href="https://brightdata.com/products/web-scraper/studio"
              className="transition hover:text-bd-navy"
              target="_blank"
              rel="noreferrer"
            >
              <span className="flex items-center gap-1">
                AI Studio
                <span className="rounded bg-bd-blue/15 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wider text-bd-blue">
                  New
                </span>
              </span>
            </a>
            <a href="https://docs.brightdata.com/" className="transition hover:text-bd-navy" target="_blank" rel="noreferrer">
              Docs
            </a>
            <Link href="/products/web-scraper#pricing" className="transition hover:text-bd-navy">
              Pricing
            </Link>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <HeaderSearch />
          <a
            href="https://brightdata.com/cp"
            className="hidden rounded-lg px-3 py-1.5 text-sm font-semibold text-bd-ink transition hover:bg-bd-blue-soft hover:text-bd-navy sm:inline-flex"
            target="_blank"
            rel="noreferrer"
          >
            Log in
          </a>
          <a
            href="https://brightdata.com/cp/start"
            className="rounded-lg bg-bd-blue px-2.5 py-1.5 text-[13px] font-semibold text-white shadow-sm shadow-bd-blue/30 transition hover:brightness-110 sm:px-3.5 sm:text-sm"
            target="_blank"
            rel="noreferrer"
          >
            Start free
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid h-9 w-9 place-items-center rounded-lg text-bd-ink transition hover:bg-bd-panel hover:text-bd-navy lg:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-bd-line bg-bd-panel px-4 pb-4 pt-3 lg:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-bd-navy/85">
            <Link href="/products/web-scraper#library" className="transition hover:text-bd-navy" onClick={() => setMobileMenuOpen(false)}>
              Scrapers
            </Link>
            <a href="https://brightdata.com/products/web-scraper/studio" className="transition hover:text-bd-navy" target="_blank" rel="noreferrer">
              <span className="flex items-center gap-1.5">
                AI Studio
                <span className="rounded bg-bd-blue/15 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wider text-bd-blue">
                  New
                </span>
              </span>
            </a>
            <a href="https://docs.brightdata.com/" className="transition hover:text-bd-navy" target="_blank" rel="noreferrer">Docs</a>
            <Link href="/products/web-scraper#pricing" className="transition hover:text-bd-navy" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <a href="https://brightdata.com/cp" className="transition hover:text-bd-navy" target="_blank" rel="noreferrer">Log in</a>
          </div>
        </nav>
      )}
    </header>
  );
}

const BD = "https://brightdata.com";

type FooterLink = { label: string; href: string; external?: boolean };

type FooterColumn = {
  title: string;
  titleHref?: string;
  links: FooterLink[];
};

const FOOTER_ROWS: FooterColumn[][] = [
  [
    {
      title: "Products",
      titleHref: `${BD}/products`,
      links: [
        { label: "Unlocker API", href: `${BD}/products/web-unlocker` },
        { label: "SERP API", href: `${BD}/products/serp-api` },
        { label: "Browser API", href: `${BD}/products/scraping-browser` },
        { label: "Crawl API", href: `${BD}/products/crawl-api` },
        { label: "Web Scraper APIs", href: `${BD}/products/web-scraper` },
        { label: "Scraper Studio", href: `${BD}/products/web-scraper/studio` },
        { label: "Datasets Marketplace", href: `${BD}/products/datasets` },
        { label: "Web Archive", href: `${BD}/products/archive-api` },
        { label: "Bright Insights", href: `${BD}/products/insights` },
        { label: "Managed Data Acquisition", href: `${BD}/products/managed-service` },
        { label: "Deep Lookup", href: "https://deeplookup.com/", external: true },
      ],
    },
    {
      title: "Top Scraper APIs",
      links: [
        { label: "LinkedIn Scraper", href: `${BD}/products/web-scraper/linkedin` },
        { label: "eCommerce Scraper", href: `${BD}/products/web-scraper/ecommerce` },
        { label: "Social Media Scraper", href: `${BD}/products/web-scraper/social-media-scrape` },
      ],
    },
    {
      title: "Proxy Services",
      titleHref: `${BD}/proxy-types`,
      links: [
        { label: "Residential Proxies", href: `${BD}/proxy-types/residential-proxies` },
        { label: "ISP Proxies", href: `${BD}/proxy-types/isp-proxies` },
        { label: "Datacenter Proxies", href: `${BD}/proxy-types/datacenter-proxies` },
        { label: "Rotating Proxies", href: `${BD}/solutions/rotating-proxies` },
        { label: "Proxy Servers", href: `${BD}/proxy-types/proxy-servers` },
        { label: "Proxy IP Locations", href: `${BD}/locations` },
        { label: "Proxy Solutions", href: `${BD}/solutions` },
      ],
    },
    {
      title: "Top Datasets",
      links: [
        { label: "LinkedIn Datasets", href: `${BD}/products/datasets/linkedin` },
        { label: "eCommerce Datasets", href: `${BD}/products/datasets/ecommerce` },
        { label: "Amazon Datasets", href: `${BD}/products/datasets/amazon` },
        { label: "Social Media Datasets", href: `${BD}/products/datasets/social-media` },
      ],
    },
  ],
  [
    {
      title: "Programs",
      links: [
        {
          label: "Impact Report 2025",
          href: `${BD}/static/impact_report_2025.pdf?md5=7124536-8c590486`,
          external: true,
        },
        { label: "Affiliate Program", href: `${BD}/affiliate` },
        { label: "Referral Program", href: `${BD}/referral` },
        { label: "Partners", href: `${BD}/partners` },
        { label: "SDK", href: "https://bright-sdk.com/", external: true },
        { label: "Security Vulnerabilities", href: `${BD}/security-vulnerabilities-reward-program` },
      ],
    },
    {
      title: "Legal",
      titleHref: `${BD}/legal-governance`,
      links: [
        { label: "Patents", href: `${BD}/patent-marking` },
        { label: "Privacy Policy", href: `${BD}/privacy` },
        {
          label: "Modern Slavery Statement",
          href: `${BD}/static/brightdata-modern-slavery-human-trafficking-transparency-statement-signed.pdf`,
          external: true,
        },
        { label: "Do Not Sell or Share My Personal Info", href: `${BD}/check_your_data` },
        { label: "Service Agreement", href: `${BD}/license` },
      ],
    },
    {
      title: "Learning Center",
      links: [
        { label: "Web Data Masterclass", href: `${BD}/web-data-masterclass` },
        { label: "ScrapeCon", href: `${BD}/scrapecon` },
        { label: "Common Proxy Questions", href: `${BD}/faqs` },
        { label: "FAQ", href: "https://docs.brightdata.com/introduction", external: true },
        { label: "Webinars", href: `${BD}/webinar` },
        { label: "Data for Journalists", href: `${BD}/products/datasets/for-journalists` },
        { label: "Data for AI Report", href: `${BD}/ai/data-for-ai-report` },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: `${BD}/about` },
        { label: "Blog", href: `${BD}/blog` },
        { label: "Use Cases", href: `${BD}/use-cases` },
        { label: "Support Services", href: "https://brightdata.com/support-services", external: true },
        { label: "Bright Data for Enterprise", href: `${BD}/enterprise` },
        { label: "Customer Stories", href: `${BD}/customer-stories` },
        { label: "Trust Center", href: `${BD}/trustcenter` },
        { label: "Careers", href: `${BD}/careers` },
        { label: "Contact", href: `${BD}/contact` },
        { label: "Media Center", href: `${BD}/media-center` },
        { label: "Network Status", href: `${BD}/network-status` },
        { label: "Bright VPN", href: "https://brightvpn.com/", external: true },
        { label: "Bright Initiative", href: "https://brightinitiative.com/", external: true },
      ],
    },
  ],
];

function FooterAnchor({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) {
  const isExternal = external || href.startsWith("http");
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return <a href={href}>{children}</a>;
}

function FooterCol({ col }: { col: FooterColumn }) {
  return (
    <div className="footer-col">
      {col.titleHref ? (
        <FooterAnchor href={col.titleHref}>
          <span className="footer-col-title">{col.title}</span>
        </FooterAnchor>
      ) : (
        <span className="footer-col-title">{col.title}</span>
      )}
      <ul className="footer-col-list">
        {col.links.map((link) => (
          <li key={link.label}>
            <FooterAnchor href={link.href} external={link.external}>
              {link.label}
            </FooterAnchor>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <a href={`${BD}/cp/start`} className="btn btn-primary btn-pill btn-sm" target="_blank" rel="noopener noreferrer">
            Start free trial
          </a>
          <div className="footer-social-block">
            <div className="footer-social-group">
              <span className="footer-social-label">Follow Us</span>
              <div className="footer-social-links">
                <a href="https://il.linkedin.com/company/bright-data" target="_blank" rel="nofollow noopener noreferrer">LinkedIn</a>
                <a href="https://www.youtube.com/channel/UCM_0cG1ljAoEUcZIyoUIq6g" target="_blank" rel="nofollow noopener noreferrer">YouTube</a>
                <a href="https://github.com/luminati-io" target="_blank" rel="nofollow noopener noreferrer">GitHub</a>
              </div>
            </div>
            <div className="footer-social-group">
              <span className="footer-social-label">Contact Us</span>
              <div className="footer-social-links">
                <a href="https://wa.me/972543536332" target="_blank" rel="nofollow noopener noreferrer">WhatsApp</a>
                <a href="mailto:sales@brightdata.com" rel="nofollow noopener noreferrer">Email</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-grids">
          {FOOTER_ROWS.map((row, i) => (
            <div key={i} className="footer-grid">
              {row.map((col) => (
                <FooterCol key={col.title} col={col} />
              ))}
            </div>
          ))}
        </div>

        <div className="footer-addresses">
          <p>Bright Data Ltd. (Headquarters), 4 Hamahshev St., Netanya 4250714, Israel (POB 8025).</p>
          <p>Bright Data, Inc., The Web Data Loft, 625 2nd St., San Francisco, CA 94107, United States.</p>
          <p>Bright Data, Inc., 500 7th Ave, 9th Floor Office 9A1234, New York, NY 10018, United States.</p>
          <p>IPPN Group Ltd.</p>
        </div>

        <div className="footer-partners">
          <div className="footer-partner-group">
            <span className="footer-partner-label">Cloud partnerships</span>
            <div className="footer-partner-items">
              <a href={`${BD}/partners/aws`} target="_blank" rel="noopener noreferrer">AWS</a>
              <span>Databricks</span>
              <span>Snowflake</span>
            </div>
          </div>
          <div className="footer-partner-group">
            <span className="footer-partner-label">Customer excellence</span>
            <div className="footer-partner-items">
              <span>Capterra</span>
              <span>GetApp</span>
              <span>Software Advice</span>
            </div>
          </div>
          <div className="footer-partner-group">
            <span className="footer-partner-label">Partnerships</span>
            <div className="footer-partner-items">
              <span>Top Data Provider</span>
              <span>WIPO Alert</span>
              <span>BDV</span>
              <span>MRS</span>
              <span>Gartner</span>
              <span>SOC</span>
              <a href="https://brightdata.com/static/ISO_27001_2022_Certificate.pdf?md5=391501-61ff811d" target="_blank" rel="noopener noreferrer">ISO certified</a>
              <a href={`${BD}/trustcenter/gdpr`} target="_blank" rel="noopener noreferrer">GDPR ready</a>
            </div>
          </div>
        </div>

        <p className="footer-copy">
          © Copyright {new Date().getFullYear()} Bright Data Ltd. | All rights reserved
        </p>
      </div>
    </footer>
  );
}
