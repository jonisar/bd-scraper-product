"use client";

import Link from "next/link";
import { AmazonScraperMain } from "@/components/AmazonScraperMain";

const FULL_PAGE_HREF = "/products/web-scraper/amazon/amazon-product-scraper";

export default function ScraperPreview() {
  return (
    <section className="sp-preview animate-rise">
      <div className="container">
        <div className="sp-frame">
          {/* Slim toolbar — playground chrome */}
          <div className="sp-toolbar">
            <div className="sp-toolbar-left">
              <span className="sp-dot sp-dot-red" />
              <span className="sp-dot sp-dot-yellow" />
              <span className="sp-dot sp-dot-green" />
              <span className="sp-toolbar-label">Live preview</span>
            </div>
            <Link href={FULL_PAGE_HREF} className="sp-toolbar-link">
              Open full page →
            </Link>
          </div>

          {/* Scrollable body */}
          <div className="sp-scroll-body scraper-page">
            <AmazonScraperMain
              stickyTabs={false}
              tabsId="example-scraper-tabs"
              titleAs="h2"
              compact
              className="sp-inner"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
