"use client";

import { useState, useCallback, useRef, useEffect } from "react";

import { Header, Footer } from "@/components/Chrome";
import ScraperCard from "@/components/ScraperCard";
import AiPromptCta from "@/components/AiPromptCta";
import { AmazonScraperMain } from "@/components/AmazonScraperMain";

function QuickCmdRow({ step, display, copyText }: { step: string; display: string; copyText: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="group flex items-center gap-2 rounded-lg bg-black/60 px-2.5 py-2">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bd-blue/15 text-[10px] font-bold text-bd-blue">{step}</span>
      <code className="min-w-0 flex-1 truncate font-mono text-[11px] text-[#d7e6ff]">{display}</code>
      <button
        type="button"
        aria-label="Copy command"
        title="Copy"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(copyText);
          } catch {
            const ta = document.createElement("textarea");
            ta.value = copyText;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            ta.remove();
          }
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        }}
        style={copied ? { opacity: 1 } : undefined}
        className="shrink-0 text-xs text-white/60 opacity-0 transition hover:text-white group-hover:opacity-100"
      >
        {copied ? "✓" : "⧉"}
      </button>
    </div>
  );
}

const RELATED_SCRAPERS = [
  {
    name: "Amazon Reviews Scraper",
    domain: "amazon.com",
    category: "Reviews",
    desc: "Extract review text, star ratings, author info, verified purchase status, helpful votes, and review dates at scale.",
    fieldsPreview: "review_text, rating, author, verified_purchase, helpful_votes, date",
    views: "7.2K+",
    downloads: "1.8K+",
    href: "https://brightdata.com/cp/datasets/configure?dataset_id=gd_le8e811kzy4ggddlq",
  },
  {
    name: "Amazon Best Sellers",
    domain: "amazon.com",
    category: "Rankings",
    desc: "Monitor bestseller rankings, category leaderboards, movers & shakers, and trending products across all departments.",
    fieldsPreview: "rank, title, price, rating, category, sales_volume",
    views: "34.6K+",
    downloads: "5.1K+",
    href: "https://brightdata.com/cp/datasets/configure?dataset_id=gd_l1vijixj9g2vp7563",
  },
  {
    name: "Amazon Sellers Info",
    domain: "amazon.com",
    category: "Sellers",
    desc: "Seller name, store rating, feedback count, return policy, business address, and seller metrics for competitive analysis.",
    fieldsPreview: "seller_name, rating, feedback_count, return_policy, address",
    views: "2.4K+",
    downloads: "820+",
    href: "https://brightdata.com/cp/datasets/configure?dataset_id=gd_lhotzucw1etoe5iw1k",
  },
  {
    name: "Amazon Price Tracker",
    domain: "amazon.com",
    category: "Pricing",
    desc: "Real-time and historical pricing: current price, list price, discount %, deal badges, Buy Box winner, and stock levels.",
    fieldsPreview: "price, list_price, discount, buy_box, stock_status",
    views: "1.6K+",
    downloads: "540+",
    href: "https://brightdata.com/cp/datasets/configure?dataset_id=gd_l7q7dkf244hwjntr0",
  },
  {
    name: "Walmart Products",
    domain: "walmart.com",
    category: "E-commerce",
    desc: "SKUs, pricing, specifications, images, availability, reviews, and seller info from the second-largest US retailer.",
    fieldsPreview: "sku, price, specs, availability, reviews, seller",
    views: "5.5K+",
    downloads: "1.4K+",
    href: "https://brightdata.com/cp/datasets",
  },
  {
    name: "Google Maps Scraper",
    domain: "google.com",
    category: "Local",
    desc: "Business name, address, phone, website, ratings, review count, hours, photos, and popular times for any location.",
    fieldsPreview: "name, address, phone, rating, reviews, hours, website",
    views: "12.8K+",
    downloads: "3.9K+",
    href: "https://brightdata.com/cp/datasets/configure?dataset_id=gd_m8ebnr0q2qlklc02fz",
  },
  {
    name: "LinkedIn Profiles",
    domain: "linkedin.com",
    category: "Social",
    desc: "Professional data: name, headline, company, experience history, skills, education, certifications, and post activity.",
    fieldsPreview: "name, headline, company, experience, skills, education",
    views: "118.1K+",
    downloads: "28.4K+",
    href: "https://brightdata.com/cp/datasets/configure?dataset_id=gd_l1viktl72bvl7bjuj0",
  },
  {
    name: "Instagram Profiles",
    domain: "instagram.com",
    category: "Social",
    desc: "Followers, posts, bio, business category, engagement rate, recent media, hashtag use, and account growth metrics.",
    fieldsPreview: "followers, posts, bio, engagement_rate, media, hashtags",
    views: "21.8K+",
    downloads: "6.2K+",
    href: "https://brightdata.com/cp/datasets/configure?dataset_id=gd_l1vikfch901nx3by4",
  },
];

function RelatedScrapersCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -330 : 330, behavior: "smooth" });
  };

  const ArrowBtn = ({ dir, show }: { dir: "left" | "right"; show: boolean }) => (
    <button
      type="button"
      onClick={() => scroll(dir)}
      aria-label={`Scroll ${dir}`}
      className={`absolute top-1/2 z-10 -translate-y-1/2 rounded-full border border-bd-line bg-bd-panel/95 p-2.5 shadow-lg backdrop-blur transition-all hover:border-bd-blue-light hover:shadow-bd-blue/15 ${
        dir === "left" ? "left-2" : "right-2"
      } ${show ? "scale-100 opacity-100" : "pointer-events-none scale-75 opacity-0"}`}
    >
      <svg className="h-4 w-4 text-bd-navy" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        {dir === "left"
          ? <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          : <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />}
      </svg>
    </button>
  );

  return (
    <section className="pb-12 pt-4 sm:pt-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-bd-navy">Related Scrapers</h2>
          <p className="mt-1 text-sm text-bd-ink/85">
            <a
              href="/products/web-scraper/amazon"
              className="font-semibold text-bd-blue hover:underline"
            >
              Browse all Amazon scrapers →
            </a>
          </p>
        </div>
        <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="rounded-full border border-bd-line bg-bd-panel p-2 transition hover:border-bd-blue-light disabled:opacity-30"
          >
            <svg className="h-4 w-4 text-bd-navy" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="rounded-full border border-bd-line bg-bd-panel p-2 transition hover:border-bd-blue-light disabled:opacity-30"
          >
            <svg className="h-4 w-4 text-bd-navy" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative mt-5">
        {/* Fade edges */}
        <div className={`pointer-events-none absolute inset-y-0 left-0 z-[5] w-12 bg-gradient-to-r from-black to-transparent transition-opacity duration-200 ${canScrollLeft ? "opacity-100" : "opacity-0"}`} />
        <div className={`pointer-events-none absolute inset-y-0 right-0 z-[5] w-12 bg-gradient-to-l from-black to-transparent transition-opacity duration-200 ${canScrollRight ? "opacity-100" : "opacity-0"}`} />

        {/* Floating arrows on mobile */}
        <div className="sm:hidden">
          <ArrowBtn dir="left" show={canScrollLeft} />
          <ArrowBtn dir="right" show={canScrollRight} />
        </div>

        <div
          ref={scrollRef}
          className="related-scroll flex items-stretch gap-4 overflow-x-auto pb-4 scroll-smooth"
        >
          {RELATED_SCRAPERS.map((s) => (
            <div
              key={s.name}
              className="flex w-[min(300px,85vw)] shrink-0 sm:w-[310px]"
            >
              <ScraperCard
                name={s.name}
                domain={s.domain}
                category={s.category}
                desc={s.desc}
                fieldsPreview={s.fieldsPreview}
                views={s.views}
                downloads={s.downloads}
                href={s.href}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ScraperPage() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [stickyTop, setStickyTop] = useState("4.5rem");
  const [sidebarMaxH, setSidebarMaxH] = useState<string | undefined>(undefined);

  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;
    const update = () => {
      const sidebarH = el.scrollHeight;
      const vh = window.innerHeight;
      const headerH = 56;
      const gap = 16;
      const minTop = headerH + gap;
      const idealTop = vh - sidebarH - gap;
      const top = Math.max(idealTop, minTop);
      setStickyTop(`${top}px`);
      const isLg = window.innerWidth >= 1024;
      setSidebarMaxH(isLg ? `calc(100vh - ${top}px - 1rem)` : undefined);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => { ro.disconnect(); window.removeEventListener("resize", update); };
  }, []);

  return (
    <div className="scraper-page flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-10 lg:py-12">
        <section className="animate-rise grid max-w-full gap-6 overflow-x-clip lg:gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Main content */}
          <div className="min-w-0">
            <AmazonScraperMain />
          </div>

          {/* ===== SIDEBAR ===== */}
          <aside className="min-w-0 animate-rise-delay">
            <div ref={sidebarRef} className="lg:sticky lg:overflow-y-auto lg:[scrollbar-width:thin] lg:[scrollbar-color:theme(colors.bd-line)_transparent] space-y-4 overflow-hidden" style={{ top: stickyTop, maxHeight: sidebarMaxH }}>
            <div className="overflow-hidden rounded-2xl border border-bd-blue/30 bg-gradient-to-br from-bd-blue-soft via-bd-panel to-bd-panel shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <div className="p-5">
                <p className="flex items-baseline gap-x-1.5">
                  <span className="text-2xl font-extrabold tracking-tight text-bd-navy">Free 5,000 records</span>
                  <span className="text-sm font-semibold text-bd-muted">/mo</span>
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-600">
                    No credit card required
                  </span>
                </div>

                <div className="mt-4 rounded-xl bg-bd-canvas/60 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-bd-muted">Pay as you go</p>
                  <p className="mt-1 flex items-baseline gap-x-1.5">
                    <span className="text-xl font-extrabold tracking-tight text-bd-navy">$1.50</span>
                    <span className="text-xs font-semibold text-bd-muted">/ 1K records</span>
                  </p>
                </div>

                <div className="mt-4 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bd-blue/10 text-bd-blue">
                      <svg viewBox="0 0 16 16" className="h-3 w-3 fill-current"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>
                    </span>
                    <p className="text-sm font-semibold leading-5 text-bd-navy">
                      Pay only for success
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bd-blue/10 text-bd-blue">
                      <svg viewBox="0 0 16 16" className="h-3 w-3 fill-current"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>
                    </span>
                    <p className="text-sm font-semibold leading-5 text-bd-navy">
                      24/7 Expert support
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bd-blue/10 text-bd-blue">
                      <svg viewBox="0 0 16 16" className="h-3 w-3 fill-current"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>
                    </span>
                    <p className="text-sm font-semibold leading-5 text-bd-navy">
                      World&apos;s #1 scraper platform
                    </p>
                  </div>
                </div>

                <a
                  href="https://brightdata.com/cp/start"
                  className="mt-5 block w-full rounded-xl bg-bd-blue px-4 py-3 text-center text-sm font-bold text-white shadow-md shadow-bd-blue/30 transition hover:brightness-105"
                  target="_blank"
                  rel="noreferrer"
                >
                  Start free
                </a>
                <a
                  href="https://brightdata.com/contact"
                  className="mt-2 block w-full rounded-xl border border-bd-blue/40 bg-bd-canvas px-4 py-3 text-center text-sm font-bold text-bd-ink transition hover:border-bd-blue-light hover:bg-bd-blue-soft"
                  target="_blank"
                  rel="noreferrer"
                >
                  Contact sales
                </a>
              </div>
            </div>

            <a
              href="https://brightdata.com/products/datasets/amazon"
              target="_blank"
              rel="noreferrer"
              className="group block overflow-hidden rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition hover:shadow-[0_14px_36px_rgba(0,0,0,0.35)]"
            >
              <div className="bg-gradient-to-r from-[#7b5ea7] via-[#9b6bb8] to-[#d94f8e] px-5 py-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                  Skip scraping
                </p>
                <p className="mt-1.5 text-lg font-bold leading-tight text-white">
                  Purchase an{" "}
                  <span className="underline decoration-white/50 underline-offset-2 group-hover:decoration-white">
                    Amazon Dataset
                  </span>{" "}
                  →
                </p>
              </div>
            </a>

            <div className="rounded-2xl border border-bd-line bg-bd-panel p-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-bd-muted">Quick start</p>
              <div className="mt-3 space-y-1.5">
                <QuickCmdRow
                  step="1"
                  display="npx -p @brightdata/cli bdata login"
                  copyText="npx -p @brightdata/cli bdata login"
                />
                <QuickCmdRow
                  step="2"
                  display='bdata pipelines amazon_product "amazon.com/dp/…"'
                  copyText='bdata pipelines amazon_product "https://www.amazon.com/dp/B09X7MPX8L"'
                />
              </div>
              <p className="mt-3 text-[11px] text-bd-muted">
                From URL to structured data in seconds.
              </p>
            </div>

            <div className="rounded-2xl border border-bd-line bg-bd-panel p-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-bd-muted">
                Performance
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-bd-canvas px-3 py-2.5">
                  <p className="text-lg font-extrabold text-bd-navy">~36s</p>
                  <p className="text-[11px] text-bd-muted">Avg response time</p>
                </div>
                <div className="rounded-lg bg-bd-canvas px-3 py-2.5">
                  <p className="text-lg font-extrabold text-bd-navy">$0.0015</p>
                  <p className="text-[11px] text-bd-muted">Per record</p>
                </div>
                <div className="rounded-lg bg-bd-canvas px-3 py-2.5">
                  <p className="text-lg font-extrabold text-bd-navy">98.4%</p>
                  <p className="text-[11px] text-bd-muted">Avg. success rate</p>
                </div>
                <div className="rounded-lg bg-bd-canvas px-3 py-2.5">
                  <p className="text-lg font-extrabold text-bd-success">99.9%</p>
                  <p className="text-[11px] text-bd-muted">Uptime SLA</p>
                </div>
              </div>
            </div>
            </div>
          </aside>

          {/* Related scrapers gallery — full width, inside grid */}
          <div className="lg:col-span-2">
            <RelatedScrapersCarousel />
            <AiPromptCta />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
