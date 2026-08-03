import { catalog, type CatalogScraper } from "./catalog";
import { scraperHref } from "./scraper-href";

export type DomainHubScraper = {
  id: string;
  name: string;
  desc: string;
  category: string;
  fieldsPreview: string;
  views: string;
  downloads: string;
  href: string;
};

export type DomainHubData = {
  slug: string;
  name: string;
  domain: string;
  category: string;
  title: string;
  headline: string;
  description: string;
  useCases: { title: string; body: string; tags: string }[];
  faqs: { q: string; a: string }[];
  scrapers: DomainHubScraper[];
};

function catalogToHub(s: CatalogScraper): DomainHubScraper {
  return {
    id: s.id,
    name: s.name,
    desc: s.desc,
    category: s.category,
    fieldsPreview: s.fields.slice(0, 5).join(", ") + ", and more.",
    views: s.views,
    downloads: s.downloads,
    href: scraperHref(s),
  };
}

function scrapersForDomain(domain: string): DomainHubScraper[] {
  return catalog
    .filter((s) => s.domain === domain)
    .sort((a, b) => parseViews(b.views) - parseViews(a.views))
    .map(catalogToHub);
}

function parseViews(v: string): number {
  const n = parseFloat(v.replace(/[^0-9.]/g, ""));
  if (v.includes("K")) return n * 1000;
  if (v.includes("M")) return n * 1_000_000;
  return n || 0;
}

export const DOMAIN_HUBS: Record<string, DomainHubData> = {
  linkedin: {
    slug: "linkedin",
    name: "LinkedIn",
    domain: "linkedin.com",
    category: "Business (B2B)",
    title: "LinkedIn Scraper API - Extract Profiles, Companies & Jobs",
    headline: "LinkedIn Scraper API",
    description:
      "Extract LinkedIn profiles, company pages, job listings, and post engagement data via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "B2B lead generation",
        body: "Scrape LinkedIn profiles and company pages to build targeted prospect lists with job titles, locations, company size, and industry data.",
        tags: "Profiles · Companies · Job titles · Industries",
      },
      {
        title: "Talent sourcing & recruitment",
        body: "Extract job listings, candidate profiles, skills, and experience data to identify top talent and monitor labor market trends.",
        tags: "Jobs · Skills · Experience · Candidates",
      },
      {
        title: "Competitive intelligence",
        body: "Monitor competitor company pages, employee growth, recent hires, and organizational changes to spot strategic shifts early.",
        tags: "Headcount · Growth · Hires · Organization",
      },
      {
        title: "Market research & trends",
        body: "Collect post engagement data, content performance metrics, and industry discussions to understand market sentiment and emerging trends.",
        tags: "Posts · Engagement · Sentiment · Trends",
      },
    ],
    faqs: [
      { q: "What data can I scrape from LinkedIn?", a: "You can extract public profile data (name, headline, experience, education, skills), company pages (size, industry, employees), job listings (title, location, requirements), and post engagement metrics." },
      { q: "Is scraping LinkedIn legal?", a: "Bright Data collects only publicly available data and complies with GDPR, CCPA, and related frameworks. Our infrastructure is designed for ethical, compliant data collection." },
      { q: "How does the LinkedIn Scraper handle rate limiting?", a: "Bright Data automatically manages proxy rotation, request pacing, and browser rendering to maintain reliable access without triggering rate limits." },
      { q: "Can I scrape LinkedIn job listings at scale?", a: "Yes. Send job search URLs or parameters and receive structured data including title, company, location, salary range, and requirements." },
      { q: "What output formats are supported?", a: "JSON, NDJSON, CSV, and compressed .gz formats. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("linkedin.com"),
  },

  instagram: {
    slug: "instagram",
    name: "Instagram",
    domain: "instagram.com",
    category: "Social Media",
    title: "Instagram Scraper API - Profiles, Posts, Reels & Comments",
    headline: "Instagram Scraper API",
    description:
      "Extract Instagram profiles, posts, reels, comments, and engagement metrics via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "Influencer marketing research",
        body: "Scrape Instagram profiles, follower counts, engagement rates, and post performance to identify and evaluate influencers for campaigns.",
        tags: "Profiles · Followers · Engagement · Influencers",
      },
      {
        title: "Brand monitoring & sentiment",
        body: "Track mentions, hashtags, and comments across Instagram to measure brand sentiment and spot emerging trends or issues.",
        tags: "Hashtags · Comments · Mentions · Sentiment",
      },
      {
        title: "Content & competitor analysis",
        body: "Collect post data, reels performance, and content patterns from competitors to optimize your Instagram strategy.",
        tags: "Posts · Reels · Performance · Strategy",
      },
      {
        title: "E-commerce product discovery",
        body: "Extract product tags, shopping posts, and brand collaborations to track product trends and pricing across Instagram commerce.",
        tags: "Products · Shopping · Tags · Pricing",
      },
    ],
    faqs: [
      { q: "What Instagram data can I extract?", a: "Public profiles (bio, followers, posts count), posts (captions, likes, comments, timestamps), reels (views, shares), stories highlights, and hashtag data." },
      { q: "Can I scrape Instagram without getting blocked?", a: "Yes. Bright Data handles proxy rotation, browser rendering, and anti-bot bypass automatically so you can collect data reliably at scale." },
      { q: "Is there a limit on how many profiles I can scrape?", a: "No hard limits. Scale from small batches to millions of profiles on the same API. You pay only for successfully delivered results." },
      { q: "Can I track hashtag performance over time?", a: "Yes. Schedule recurring collections to monitor hashtag volume, top posts, and engagement trends over time." },
      { q: "What output formats are available?", a: "JSON, NDJSON, CSV, and compressed .gz. Deliver via API download, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("instagram.com"),
  },

  tiktok: {
    slug: "tiktok",
    name: "TikTok",
    domain: "tiktok.com",
    category: "Social Media",
    title: "TikTok Scraper API - Videos, Profiles & Hashtags",
    headline: "TikTok Scraper API",
    description:
      "Extract TikTok profiles, videos, shop products, and trending hashtags via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "Trend discovery & analysis",
        body: "Track trending hashtags, sounds, and content patterns on TikTok to identify viral trends before they peak.",
        tags: "Hashtags · Sounds · Trends · Viral content",
      },
      {
        title: "Creator & influencer research",
        body: "Scrape TikTok creator profiles, follower metrics, engagement rates, and content performance for influencer marketing campaigns.",
        tags: "Creators · Followers · Engagement · Campaigns",
      },
      {
        title: "TikTok Shop intelligence",
        body: "Extract product listings, pricing, reviews, and sales data from TikTok Shop to monitor e-commerce trends on the platform.",
        tags: "Products · Pricing · Reviews · Sales",
      },
      {
        title: "Content performance benchmarking",
        body: "Collect video views, likes, shares, and comments to benchmark content performance against competitors and industry averages.",
        tags: "Views · Likes · Shares · Comments",
      },
    ],
    faqs: [
      { q: "What TikTok data can I extract?", a: "Video details (views, likes, comments, shares, captions), creator profiles (followers, bio, verified status), hashtag data, TikTok Shop products, and trending content." },
      { q: "Can I scrape TikTok videos at scale?", a: "Yes. Send video URLs, hashtags, or search queries and receive structured data. Scale from hundreds to millions of records." },
      { q: "Does it work with TikTok Shop?", a: "Yes. Extract product listings, prices, reviews, ratings, and seller information from TikTok Shop." },
      { q: "How often is TikTok data updated?", a: "Collect on-demand or schedule recurring collections. Data is scraped fresh with each request — no stale caches." },
      { q: "What formats and delivery methods are supported?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("tiktok.com"),
  },

  "google-maps": {
    slug: "google-maps",
    name: "Google Maps",
    domain: "google.com/maps",
    category: "Search",
    title: "Google Maps Scraper API - Business Listings & Reviews",
    headline: "Google Maps Scraper API",
    description:
      "Extract Google Maps business listings, reviews, ratings, hours, and location data via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "Local business lead generation",
        body: "Scrape Google Maps to build lists of businesses by location, category, and rating. Extract phone numbers, websites, and addresses for outreach.",
        tags: "Businesses · Contacts · Addresses · Categories",
      },
      {
        title: "Review monitoring & reputation",
        body: "Collect reviews, ratings, and reviewer details across locations to track customer sentiment and manage brand reputation.",
        tags: "Reviews · Ratings · Sentiment · Locations",
      },
      {
        title: "Market entry & location analysis",
        body: "Analyze business density, competitor presence, and customer ratings by area to inform expansion and market entry decisions.",
        tags: "Density · Competition · Ratings · Geography",
      },
      {
        title: "Data enrichment & verification",
        body: "Enrich CRM records with verified business addresses, phone numbers, operating hours, and category tags from Google Maps.",
        tags: "Addresses · Phone · Hours · Verification",
      },
    ],
    faqs: [
      { q: "What data can I extract from Google Maps?", a: "Business name, address, phone, website, hours, ratings, review count, individual reviews, photos, popular times, and place categories." },
      { q: "Can I search for businesses by location and category?", a: "Yes. Send search queries like 'restaurants in NYC' or category URLs to collect matching business listings." },
      { q: "How do you handle Google's anti-scraping measures?", a: "Bright Data manages proxy rotation, browser rendering, CAPTCHA solving, and request pacing automatically." },
      { q: "Can I extract individual reviews?", a: "Yes. Collect review text, rating, date, reviewer name, and response from the business owner." },
      { q: "What output formats are supported?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("google.com/maps"),
  },

  zillow: {
    slug: "zillow",
    name: "Zillow",
    domain: "zillow.com",
    category: "Real Estate",
    title: "Zillow Scraper API - Listings, Zestimates & Rentals",
    headline: "Zillow Scraper API",
    description:
      "Extract Zillow property listings, Zestimates, rental data, and neighborhood insights via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "Real estate market analysis",
        body: "Track listing prices, Zestimates, days on market, and price history across neighborhoods to identify market trends and investment opportunities.",
        tags: "Prices · Zestimates · Trends · Markets",
      },
      {
        title: "Investment property research",
        body: "Scrape rental listings, rent estimates, and property details to calculate yields and compare investment opportunities across locations.",
        tags: "Rentals · Yields · Properties · Locations",
      },
      {
        title: "Competitive intelligence for agents",
        body: "Monitor new listings, price changes, and sold properties in your target areas to stay ahead of market movements.",
        tags: "Listings · Price changes · Sold · Areas",
      },
      {
        title: "Property data enrichment",
        body: "Enrich property databases with Zillow's tax data, home features, neighborhood schools, and walkability scores.",
        tags: "Tax data · Features · Schools · Walkability",
      },
    ],
    faqs: [
      { q: "What Zillow data can I extract?", a: "Property listings (price, beds, baths, sqft, address), Zestimates, price history, tax records, neighborhood data, school ratings, and rental listings." },
      { q: "Can I scrape Zillow search results?", a: "Yes. Send search queries by city, zip code, or neighborhood to collect all matching property listings." },
      { q: "Is Zillow data updated in real-time?", a: "Data is scraped fresh with each request. Schedule recurring collections to monitor price changes and new listings." },
      { q: "Can I extract rental data?", a: "Yes. Collect rental listings with rent estimates, property features, availability, and landlord information." },
      { q: "What output formats are available?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("zillow.com"),
  },

  x: {
    slug: "x",
    name: "X (Twitter)",
    domain: "x.com",
    category: "Social Media",
    title: "X (Twitter) Scraper API - Posts, Profiles & Trends",
    headline: "X (Twitter) Scraper API",
    description:
      "Extract X (Twitter) posts, profiles, engagement metrics, and trending topics via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "Brand & sentiment monitoring",
        body: "Track brand mentions, hashtags, and replies on X to measure public sentiment and detect crises or viral moments in real time.",
        tags: "Mentions · Hashtags · Sentiment · Real-time",
      },
      {
        title: "Market & financial intelligence",
        body: "Scrape posts from financial influencers, company accounts, and trending topics to capture market-moving signals before they hit news outlets.",
        tags: "Finance · Influencers · Signals · Markets",
      },
      {
        title: "Competitor social analysis",
        body: "Collect competitor posts, engagement metrics, follower growth, and content strategy patterns to benchmark your social presence.",
        tags: "Posts · Engagement · Growth · Benchmarking",
      },
      {
        title: "Trend detection & research",
        body: "Monitor trending topics, hashtag velocity, and conversation threads to identify emerging trends for content strategy or academic research.",
        tags: "Trends · Velocity · Threads · Research",
      },
    ],
    faqs: [
      { q: "What X (Twitter) data can I extract?", a: "Posts (text, media, likes, retweets, replies), profiles (bio, followers, following, verified status), trending topics, and search results." },
      { q: "Can I scrape X without API rate limits?", a: "Yes. Bright Data's scraping infrastructure bypasses rate limits with proxy rotation and browser rendering, giving you unlimited data collection." },
      { q: "Can I collect historical tweets?", a: "You can collect tweets available on the public X website. For deep historical data, combine with X's official API." },
      { q: "How do you handle X's anti-scraping?", a: "Automatic proxy rotation, CAPTCHA solving, browser fingerprint management, and request pacing — all built in." },
      { q: "What output formats are supported?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("x.com"),
  },

  facebook: {
    slug: "facebook",
    name: "Facebook",
    domain: "facebook.com",
    category: "Social Media",
    title: "Facebook Scraper API - Pages, Posts & Ads Library",
    headline: "Facebook Scraper API",
    description:
      "Extract Facebook page posts, ads library data, reactions, and audience insights via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "Ad intelligence & creative research",
        body: "Scrape Facebook Ads Library to monitor competitor ad creatives, spend patterns, targeting signals, and campaign durations.",
        tags: "Ads · Creatives · Spend · Targeting",
      },
      {
        title: "Social listening & brand monitoring",
        body: "Collect page posts, comments, and reactions to track brand sentiment, customer feedback, and viral content across Facebook.",
        tags: "Posts · Comments · Reactions · Sentiment",
      },
      {
        title: "Market & audience research",
        body: "Extract data from Facebook groups, pages, and events to understand audience demographics, interests, and engagement patterns.",
        tags: "Groups · Pages · Events · Demographics",
      },
      {
        title: "Content strategy & benchmarking",
        body: "Analyze competitor page performance, posting frequency, and engagement rates to optimize your Facebook content strategy.",
        tags: "Performance · Frequency · Engagement · Strategy",
      },
    ],
    faqs: [
      { q: "What Facebook data can I extract?", a: "Page posts (text, media, reactions, shares, comments), ads library entries (creative, spend, impressions, targeting), profiles, groups, and events." },
      { q: "Can I scrape the Facebook Ads Library?", a: "Yes. Extract ad creative, advertiser info, estimated spend, impressions, targeting parameters, and campaign dates." },
      { q: "Is Facebook scraping reliable?", a: "Bright Data handles proxy rotation, browser rendering, and anti-bot bypass automatically for consistent, reliable data collection." },
      { q: "Can I monitor competitor Facebook pages?", a: "Yes. Collect posts, engagement metrics, follower counts, and content patterns from any public Facebook page." },
      { q: "What output formats are available?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("facebook.com"),
  },

  youtube: {
    slug: "youtube",
    name: "YouTube",
    domain: "youtube.com",
    category: "Social Media",
    title: "YouTube Scraper API - Videos, Channels & Comments",
    headline: "YouTube Scraper API",
    description:
      "Extract YouTube videos, channels, comments, subscribers, and view counts via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "Content & creator analysis",
        body: "Scrape video metadata, view counts, engagement rates, and channel statistics to analyze content performance and identify top creators.",
        tags: "Videos · Views · Engagement · Channels",
      },
      {
        title: "Competitive video intelligence",
        body: "Monitor competitor channels, upload frequency, trending videos, and audience growth to benchmark your YouTube strategy.",
        tags: "Competitors · Frequency · Trending · Growth",
      },
      {
        title: "Ad & brand monitoring",
        body: "Track brand mentions in video titles, descriptions, and comments. Monitor sponsored content and influencer collaborations.",
        tags: "Brand · Sponsored · Influencers · Mentions",
      },
      {
        title: "Trend & topic research",
        body: "Collect trending video data, search results, and comment sentiment to discover emerging topics and audience interests.",
        tags: "Trending · Search · Comments · Topics",
      },
    ],
    faqs: [
      { q: "What YouTube data can I extract?", a: "Video metadata (title, views, likes, duration, description), channel data (subscribers, video count, about), comments (text, likes, replies), and search results." },
      { q: "Can I scrape YouTube without quotas?", a: "Yes. Unlike YouTube's official API, Bright Data's scraper has no quota limits. Collect as much data as you need." },
      { q: "Can I extract YouTube comments at scale?", a: "Yes. Collect comments, replies, like counts, and commenter info from any public video." },
      { q: "How often can I collect data?", a: "On-demand or on a schedule. Data is scraped fresh each time — no stale caches or delayed results." },
      { q: "What output formats are supported?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("youtube.com"),
  },
};
