/** Shared site navigation — Bright Data mega-menus + product subnav anchors. */

export const BD = "https://brightdata.com";

export type NavBadge = "FREE" | "FREE TIER" | "NEW" | "BETA" | "50% OFF";

export type NavLink = {
  label: string;
  href: string;
  desc?: string;
  badge?: NavBadge;
  external?: boolean;
  children?: { label: string; href: string; external?: boolean }[];
};

export type NavColumn = {
  title: string;
  accent?: boolean;
  links: NavLink[];
};

export type MegaMenu = {
  id: string;
  label: string;
  columns: NavColumn[];
};

export type SubnavItem = {
  label: string;
  href: string; // "#scrapers" or full path
};

/** Top-level mega menus matching brightdata.com (content preserved; product links added). */
export const MEGA_MENUS: MegaMenu[] = [
  {
    id: "products",
    label: "Products",
    columns: [
      {
        title: "Web Access APIs",
        links: [
          {
            label: "Unlocker API",
            href: `${BD}/products/web-unlocker`,
            desc: "Say goodbye to blocks and CAPTCHAs",
            external: true,
          },
          {
            label: "Discover API",
            href: `${BD}/products/discover-api`,
            desc: "Always live web discovery for agents",
            badge: "FREE",
            external: true,
          },
          {
            label: "SERP API",
            href: `${BD}/products/serp-api`,
            desc: "Get multi-engine search results on-demand",
            external: true,
            children: [
              { label: "Google", href: `${BD}/products/serp-api/google-search`, external: true },
              { label: "Bing", href: `${BD}/products/serp-api/bing-search`, external: true },
              { label: "DuckDuckGo", href: `${BD}/products/serp-api/duckduckgo-search`, external: true },
              { label: "Yandex", href: `${BD}/products/serp-api/yandex-search`, external: true },
            ],
          },
          {
            label: "Browser API",
            href: `${BD}/products/scraping-browser`,
            desc: "Spin up remote browsers, stealth included",
            external: true,
          },
        ],
      },
      {
        title: "Data Feeds",
        links: [
          {
            label: "Scraper APIs",
            href: "/products/web-scraper",
            desc: "Fetch real-time data from 600+ websites",
            children: [
              { label: "All Scrapers", href: "/products/web-scraper/scraper-lib" },
              { label: "LinkedIn", href: "/products/web-scraper/linkedin" },
              { label: "eCommerce", href: "/products/web-scraper/ecommerce" },
              { label: "Social media", href: "/products/web-scraper/social-media" },
              { label: "ChatGPT", href: "/products/web-scraper/chatgpt" },
            ],
          },
          {
            label: "Scraper Studio",
            href: "/products/web-scraper/studio",
            desc: "Turn any website into a data pipeline",
            badge: "NEW",
          },
          {
            label: "Datasets",
            href: `${BD}/products/datasets`,
            desc: "Pre-collected data from 600+ domains",
            external: true,
            children: [
              { label: "LinkedIn", href: `${BD}/products/datasets/linkedin`, external: true },
              { label: "eCommerce", href: `${BD}/products/datasets/ecommerce`, external: true },
              { label: "Social media", href: `${BD}/products/datasets/social-media`, external: true },
              { label: "Real estate", href: `${BD}/products/datasets/real-estate`, external: true },
            ],
          },
          {
            label: "Data Firehose",
            href: `${BD}/products/data-feeds`,
            desc: "Real-time web data, delivered as it’s collected",
            external: true,
          },
        ],
      },
      {
        title: "Proxy Services",
        links: [
          {
            label: "Residential Proxies",
            href: `${BD}/proxy-types/residential-proxies`,
            desc: "400M+ global IPs from real-peer devices",
            badge: "50% OFF",
            external: true,
          },
          {
            label: "ISP Proxies",
            href: `${BD}/proxy-types/isp-proxies`,
            desc: "1.3M+ blazing fast static residential proxies",
            external: true,
          },
          {
            label: "Datacenter Proxies",
            href: `${BD}/proxy-types/datacenter-proxies`,
            desc: "1.3M+ high-speed proxies for data extraction",
            external: true,
          },
        ],
      },
      {
        title: "Data And Insights",
        accent: true,
        links: [
          {
            label: "Retail Intelligence",
            href: `${BD}/products/insights`,
            desc: "Unlock real-time eCommerce insights & AI-powered recommendations",
            external: true,
          },
          {
            label: "Managed Data Acquisition",
            href: `${BD}/products/managed-service`,
            desc: "Tailored enterprise-grade data acquisition",
            external: true,
          },
          {
            label: "Deep Lookup",
            href: "https://deeplookup.com/",
            desc: "Run complex queries on web-scale data",
            badge: "BETA",
            external: true,
          },
        ],
      },
    ],
  },
  {
    id: "data-for-ai",
    label: "Data for AI",
    columns: [
      {
        title: "Multimodal Training",
        links: [
          {
            label: "Video and Audio Data",
            href: `${BD}/ai/video-and-audio-data`,
            desc: "Train on more data, with fewer blockers",
            external: true,
          },
          {
            label: "Video Feeds – ready for VLA",
            href: `${BD}/ai/video-feeds`,
            desc: "Get continuous, targeted web video for training humanoid robot policies",
            external: true,
          },
          {
            label: "Data Packages",
            href: `${BD}/ai/data-packages`,
            desc: "Get LLM-ready datasets for every industry",
            external: true,
          },
        ],
      },
      {
        title: "Agentic Web Execution",
        links: [
          {
            label: "Search & Extract",
            href: `${BD}/ai/search-and-extract`,
            desc: "Instant knowledge acquisition for AI",
            external: true,
          },
          {
            label: "Agent Browser",
            href: `${BD}/ai/agent-browser`,
            desc: "Enable agents to perform automated actions",
            external: true,
          },
          {
            label: "Bright Data MCP",
            href: `${BD}/ai/mcp-server`,
            desc: "Fastest way to start",
            badge: "FREE",
            external: true,
          },
        ],
      },
      {
        title: "Resources",
        accent: true,
        links: [
          {
            label: "Startup Program",
            href: `${BD}/ai/startup-program`,
            badge: "NEW",
            external: true,
          },
          {
            label: "Demo Agents",
            href: `${BD}/ai/demo-agents`,
            external: true,
          },
          {
            label: "Integrations",
            href: `${BD}/integrations`,
            external: true,
          },
        ],
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing",
    columns: [
      {
        title: "Web Access APIs",
        links: [
          {
            label: "Unlocker API",
            href: `${BD}/pricing/web-unlocker`,
            desc: "Starts from $1/1k req",
            badge: "FREE TIER",
            external: true,
          },
          {
            label: "Crawl API",
            href: `${BD}/pricing/crawl-api`,
            desc: "Starts from $1/1k req",
            external: true,
          },
          {
            label: "SERP API",
            href: `${BD}/pricing/serp-api`,
            desc: "Starts from $1/1k req",
            badge: "FREE TIER",
            external: true,
          },
          {
            label: "Browser API",
            href: `${BD}/pricing/scraping-browser`,
            desc: "Starts from $5/GB",
            external: true,
          },
        ],
      },
      {
        title: "Data Feeds",
        links: [
          {
            label: "Scraper APIs",
            href: `${BD}/pricing/web-scraper`,
            desc: "Starts from $0.75/1k rec",
            badge: "FREE TIER",
            external: true,
          },
          {
            label: "Scraper Studio",
            href: `${BD}/pricing/web-scraper`,
            desc: "Starts from $1/1k req",
            badge: "FREE TIER",
            external: true,
          },
          {
            label: "Datasets",
            href: `${BD}/pricing/datasets`,
            desc: "Starts from $250/100K rec",
            external: true,
          },
          {
            label: "Data Firehose",
            href: `${BD}/pricing/data-feeds`,
            desc: "Starts from $0.2/1k HTML",
            external: true,
          },
        ],
      },
      {
        title: "Proxy Infrastructure",
        links: [
          {
            label: "Residential",
            href: `${BD}/pricing/proxy-network`,
            desc: "Starts from $2.5/GB",
            badge: "50% OFF",
            external: true,
          },
          {
            label: "Datacenter",
            href: `${BD}/pricing/datacenter-proxies`,
            desc: "Starts from $0.9/IP",
            external: true,
          },
          {
            label: "ISP",
            href: `${BD}/pricing/isp`,
            desc: "Starts from $1.3/IP",
            external: true,
          },
        ],
      },
      {
        title: "Data And Insights",
        accent: true,
        links: [
          {
            label: "Retail Insights",
            href: `${BD}/pricing/insights`,
            desc: "Starts from $2000/mo",
            external: true,
          },
          {
            label: "Managed Data Acquisition",
            href: `${BD}/pricing/managed-service`,
            desc: "Starts from $1500/mo",
            external: true,
          },
        ],
      },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    columns: [
      {
        title: "Tools",
        links: [
          { label: "Integrations", href: `${BD}/integrations`, external: true },
          { label: "Browser Extension", href: `${BD}/browser-extension`, external: true },
          { label: "Network Status", href: `${BD}/network-status`, external: true },
        ],
      },
      {
        title: "Learning Hub",
        links: [
          { label: "Blog", href: `${BD}/blog`, external: true },
          { label: "Case Studies", href: `${BD}/customer-stories`, external: true },
          { label: "Webinars", href: `${BD}/webinar`, external: true },
          { label: "Proxy Locations", href: `${BD}/locations`, external: true },
          { label: "Masterclass", href: `${BD}/web-data-masterclass`, external: true },
          { label: "Videos", href: `${BD}/videos`, external: true },
        ],
      },
      {
        title: "Company",
        accent: true,
        links: [
          { label: "Partner Program", href: `${BD}/partners`, external: true },
          { label: "Trust Center", href: `${BD}/trustcenter`, external: true },
          { label: "Bright SDK", href: "https://bright-sdk.com/", external: true },
          { label: "Bright Initiative", href: "https://brightinitiative.com/", external: true },
          { label: "Support", href: `${BD}/contact`, external: true },
        ],
      },
    ],
  },
];

export const TOP_LINKS: NavLink[] = [
  { label: "Docs", href: "https://docs.brightdata.com/", external: true },
];

/** Domain / vertical hub pages — matches BD /amazon subnav + our best conversion sections. */
export const HUB_SUBNAV: SubnavItem[] = [
  { label: "Scraper APIs", href: "#scrapers" },
  { label: "Scraper Marketplace", href: "/products/web-scraper/scraper-lib" },
  { label: "Pricing", href: "#pricing" },
  { label: "Code Examples", href: "#code" },
  { label: "AI Agents", href: "#agents" },
  { label: "How it Works", href: "#steps" },
  { label: "Compliance", href: "#why" },
  { label: "FAQs", href: "#faq" },
];

/** Main /products/web-scraper page. */
export const HOME_SUBNAV: SubnavItem[] = [
  { label: "Scraper APIs", href: "#library" },
  { label: "Scraper Marketplace", href: "/products/web-scraper/scraper-lib" },
  { label: "Pricing", href: "#pricing" },
  { label: "Code Examples", href: "#code" },
  { label: "AI Agents", href: "#agents" },
  { label: "How it Works", href: "#steps" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "FAQs", href: "#faq" },
];

/** Scraper library / categories — lighter contextual nav. */
export const LIBRARY_SUBNAV: SubnavItem[] = [
  { label: "All Scrapers", href: "/products/web-scraper/scraper-lib" },
  { label: "Categories", href: "/products/web-scraper/scraper-lib/categories" },
  { label: "Studio", href: "/products/web-scraper/studio" },
  { label: "Pricing", href: "/products/web-scraper#pricing" },
  { label: "Docs", href: "https://docs.brightdata.com/" },
];

/** AI Scraper Studio page. */
export const STUDIO_SUBNAV: SubnavItem[] = [
  { label: "How it Works", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Support", href: "#support" },
  { label: "Compliance", href: "#compliance" },
  { label: "FAQs", href: "#faq" },
];
