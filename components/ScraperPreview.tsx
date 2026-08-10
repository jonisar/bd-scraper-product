"use client";

import { AmazonScraperMain } from "@/components/AmazonScraperMain";

export default function ScraperPreview() {
  return (
    <section id="demo" className="sp-preview animate-rise hub-anchor" aria-labelledby="sp-preview-kicker">
      <div className="container">
        <div className="sp-section-head">
          <span className="kicker" id="sp-preview-kicker">
            Live example
          </span>
        </div>
        <div className="sp-frame">
          {/* Window chrome — traffic-light dots */}
          <div className="sp-toolbar" aria-hidden="true">
            <span className="sp-dot sp-dot-red" />
            <span className="sp-dot sp-dot-yellow" />
            <span className="sp-dot sp-dot-green" />
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
