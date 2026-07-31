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
                AI Scraper Studio
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
                AI Scraper Studio
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
    <nav className="footer-col" aria-label={col.title}>
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
    </nav>
  );
}

function FooterIcon({
  name,
}: {
  name: "linkedin" | "youtube" | "github" | "whatsapp" | "email" | "telegram" | "shield" | "status";
}) {
  const common = {
    className: "footer-icon",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true as const,
  };
  switch (name) {
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.44v6.3zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <path d="M23.5 6.2a3.02 3.02 0 00-2.13-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.37.56A3.02 3.02 0 00.5 6.2 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.8 3.02 3.02 0 002.13 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.37-.56a3.02 3.02 0 002.13-2.14A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.8zM9.75 15.57V8.43L15.84 12l-6.09 3.57z" />
        </svg>
      );
    case "github":
      return (
        <svg {...common}>
          <path d="M12 .3a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12 12 0 0012 .3z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common}>
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.8h-.01a9.77 9.77 0 01-4.97-1.36l-.36-.21-3.7.97 1-3.61-.23-.37a9.76 9.76 0 01-1.5-5.2 9.8 9.8 0 0119.6 0 9.78 9.78 0 01-9.83 9.78zm8.5-17.6A11.57 11.57 0 0012.03 0C5.45 0 .1 5.34.1 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.9 11.9 0 005.72 1.46h.01c6.58 0 11.93-5.35 11.93-11.91 0-3.18-1.24-6.17-3.49-8.41z" />
        </svg>
      );
    case "email":
      return (
        <svg {...common}>
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      );
    case "telegram":
      return (
        <svg {...common}>
          <path d="M9.78 18.65l.28-4.23 7.68-6.96c.34-.31-.07-.48-.52-.19L7.74 13.3 3.64 12c-.88-.27-.9-.86.2-1.3L19.87 5.3c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.9-.74 1.12-1.5.7l-4.15-3.05-2 .61c-.23.08-.44-.05-.47-.32z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54l-3.18-3.18 1.41-1.41 1.77 1.77 4.24-4.24 1.41 1.41-5.65 5.65z" />
        </svg>
      );
    case "status":
      return (
        <svg {...common}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      );
  }
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        {/* Orient + convert */}
        <div className="footer-brand-bar">
          <a href={BD} className="footer-brand" target="_blank" rel="noopener noreferrer">
            <span className="brand-mark footer-brand-mark">BD</span>
            <span className="footer-brand-text">
              <strong>Bright Data</strong>
              <span>Web data infrastructure for AI &amp; business</span>
            </span>
          </a>
          <div className="footer-brand-actions">
            <a href={`${BD}/cp/start`} className="btn btn-primary btn-pill btn-sm" target="_blank" rel="noopener noreferrer">
              Start free
            </a>
            <a href={`${BD}/contact`} className="btn btn-ghost btn-pill btn-sm" target="_blank" rel="noopener noreferrer">
              Contact sales
            </a>
          </div>
        </div>

        {/* Route — two equal 4-column rows */}
        <div className="footer-grids">
          {FOOTER_ROWS.map((row, i) => (
            <div key={i} className="footer-grid">
              {row.map((col) => (
                <FooterCol key={col.title} col={col} />
              ))}
            </div>
          ))}
        </div>

        {/* Reassure — social + contact (icon buttons, matching Bright Data) */}
        <div className="footer-reassure">
          <div className="footer-connect">
            <div className="footer-connect-group">
              <span className="footer-reassure-label">Follow Us</span>
              <div className="footer-social-icons">
                <a href="https://il.linkedin.com/company/bright-data" target="_blank" rel="nofollow noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
                  <FooterIcon name="linkedin" />
                </a>
                <a href="https://www.youtube.com/channel/UCM_0cG1ljAoEUcZIyoUIq6g" target="_blank" rel="nofollow noopener noreferrer" aria-label="YouTube" title="YouTube">
                  <FooterIcon name="youtube" />
                </a>
                <a href="https://github.com/luminati-io" target="_blank" rel="nofollow noopener noreferrer" aria-label="GitHub" title="GitHub">
                  <FooterIcon name="github" />
                </a>
              </div>
            </div>
            <div className="footer-connect-group">
              <span className="footer-reassure-label">Contact Us</span>
              <div className="footer-social-icons">
                <a href="https://wa.me/972543536332" target="_blank" rel="nofollow noopener noreferrer" aria-label="WhatsApp" title="WhatsApp">
                  <FooterIcon name="whatsapp" />
                </a>
                <a href="mailto:sales@brightdata.com" rel="nofollow noopener noreferrer" aria-label="Email" title="Email">
                  <FooterIcon name="email" />
                </a>
                <a href="https://t.me/bright_data" target="_blank" rel="nofollow noopener noreferrer" aria-label="Telegram" title="Telegram">
                  <FooterIcon name="telegram" />
                </a>
              </div>
            </div>
            <div className="footer-connect-group">
              <span className="footer-reassure-label">Trust</span>
              <div className="footer-social-icons">
                <a href={`${BD}/trustcenter`} target="_blank" rel="noopener noreferrer" aria-label="Trust Center" title="Trust Center">
                  <FooterIcon name="shield" />
                </a>
                <a href={`${BD}/network-status`} target="_blank" rel="noopener noreferrer" aria-label="Network Status" title="Network Status">
                  <FooterIcon name="status" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Partners + trust badges — logo strip matching Bright Data footer */}
        <div className="footer-partners">
          <div className="footer-partner-group">
            <span className="footer-partner-label">Cloud partnerships</span>
            <div className="footer-partner-logos">
              <a href={`${BD}/partners/aws`} target="_blank" rel="noopener noreferrer">
                <img src="https://brightdata.com/wp-content/themes/brightdata/assets/images/footer/aws.svg" alt="AWS" width={56} height={52} loading="lazy" />
              </a>
              <span>
                <img src="https://brightdata.com/wp-content/themes/brightdata/assets/images/footer/databricks.svg" alt="Databricks" width={50} height={52} loading="lazy" />
              </span>
              <span>
                <img src="https://brightdata.com/wp-content/themes/brightdata/assets/images/footer/snowflake.svg?v=1687949632" alt="Snowflake" width={56} height={52} loading="lazy" />
              </span>
            </div>
          </div>
          <div className="footer-partner-group">
            <span className="footer-partner-label">Customer excellence</span>
            <div className="footer-partner-logos">
              <span>
                <img src="https://brightdata.com/wp-content/themes/brightdata/assets/images/footer/capterra_footer.png" alt="Capterra" width={62} height={52} loading="lazy" />
              </span>
              <span>
                <img src="https://brightdata.com/wp-content/themes/brightdata/assets/images/footer/getapp.svg?2023" alt="GetApp" width={56} height={52} loading="lazy" />
              </span>
              <span>
                <img src="https://brightdata.com/wp-content/themes/brightdata/assets/images/footer/software_advice.png" alt="Software Advice" width={62} height={52} loading="lazy" />
              </span>
            </div>
          </div>
          <div className="footer-partner-group footer-partner-group-wide">
            <span className="footer-partner-label">Partnerships &amp; trust</span>
            <div className="footer-partner-logos">
              <span>
                <img src="https://brightdata.com/wp-content/themes/brightdata/assets/images/footer/top_data_provider_2023.svg" alt="Top Data Provider" width={52} height={52} loading="lazy" />
              </span>
              <span>
                <img src="https://brightdata.com/wp-content/themes/brightdata/assets/images/footer/wipo.svg" alt="WIPO Alert" width={90} height={52} loading="lazy" />
              </span>
              <span>
                <img src="https://brightdata.com/wp-content/themes/brightdata/assets/images/footer/bdv.png" alt="BDV" width={100} height={52} loading="lazy" />
              </span>
              <span>
                <img src="https://brightdata.com/wp-content/themes/brightdata/assets/images/footer/mrs.svg" alt="MRS" width={90} height={52} loading="lazy" />
              </span>
              <span>
                <img src="https://brightdata.com/wp-content/themes/brightdata/assets/images/footer/gartner.svg" alt="Gartner" width={90} height={52} loading="lazy" />
              </span>
              <span>
                <img src="https://brightdata.com/wp-content/themes/brightdata/assets/images/footer/soc_cpa.svg" alt="SOC" width={52} height={52} loading="lazy" />
              </span>
              <a href="https://brightdata.com/static/ISO_27001_2022_Certificate.pdf?md5=391501-61ff811d" target="_blank" rel="noopener noreferrer">
                <img src="https://brightdata.com/wp-content/themes/brightdata/assets/images/footer/iso.svg" alt="ISO certified" width={58} height={52} loading="lazy" />
              </a>
              <a href={`${BD}/trustcenter/gdpr`} target="_blank" rel="noopener noreferrer">
                <img src="https://brightdata.com/wp-content/themes/brightdata/assets/images/footer/gdpr.svg" alt="GDPR ready" width={58} height={52} loading="lazy" />
              </a>
              <span>
                <img src="https://brightdata.com/wp-content/themes/brightdata/assets/images/footer/tag.svg" alt="Tag" width={58} height={52} loading="lazy" />
              </span>
            </div>
          </div>
        </div>

        {/* Bottom legal + addresses */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © Copyright {year} Bright Data Ltd. · All rights reserved
          </p>
          <div className="footer-bottom-links">
            <a href={`${BD}/privacy`} target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            <a href={`${BD}/license`} target="_blank" rel="noopener noreferrer">Service Agreement</a>
            <a href={`${BD}/check_your_data`} target="_blank" rel="noopener noreferrer">Do Not Sell My Info</a>
          </div>
        </div>

        <div className="footer-addresses">
          <p>Bright Data Ltd. (HQ), 4 Hamahshev St., Netanya 4250714, Israel · Bright Data, Inc., 625 2nd St., San Francisco, CA 94107 · 500 7th Ave, New York, NY 10018 · IPPN Group Ltd.</p>
        </div>
      </div>
    </footer>
  );
}
