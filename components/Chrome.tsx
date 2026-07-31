"use client";

import { useState } from "react";
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
            <a href="https://brightdata.com/pricing" className="transition hover:text-bd-navy" target="_blank" rel="noreferrer">
              Pricing
            </a>
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
            aria-label="Toggle menu"
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
            <a href="https://brightdata.com/pricing" className="transition hover:text-bd-navy" target="_blank" rel="noreferrer">Pricing</a>
            <a href="https://brightdata.com/cp" className="transition hover:text-bd-navy" target="_blank" rel="noreferrer">Log in</a>
          </div>
        </nav>
      )}
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
