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

  chatgpt: {
    slug: "chatgpt",
    name: "ChatGPT",
    domain: "openai.com",
    category: "Search",
    title: "ChatGPT Scraper API - Extract AI Conversations & Responses",
    headline: "ChatGPT Scraper API",
    description:
      "Extract ChatGPT conversations, AI-generated responses, shared chats, and prompt-response patterns via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "AI data collection & training insights",
        body: "Scrape publicly shared ChatGPT conversations and responses to analyze language patterns, response quality, and common user prompts at scale.",
        tags: "Conversations · Responses · Prompts · Patterns",
      },
      {
        title: "Model benchmarking & evaluation",
        body: "Collect ChatGPT outputs across diverse prompts and domains to benchmark response accuracy, hallucination rates, and performance against competing models.",
        tags: "Benchmarks · Accuracy · Comparisons · Evaluation",
      },
      {
        title: "Content generation analysis",
        body: "Extract AI-generated content samples to study tone, structure, and factual accuracy patterns for content strategy and editorial guidelines.",
        tags: "Content · Tone · Structure · Quality",
      },
      {
        title: "Competitor AI research",
        body: "Monitor ChatGPT capabilities, plugin integrations, and feature rollouts to inform your own AI product roadmap and competitive positioning.",
        tags: "Features · Plugins · Capabilities · Roadmap",
      },
    ],
    faqs: [
      { q: "What ChatGPT data can I extract?", a: "Publicly shared conversations, AI responses, prompt-response pairs, conversation metadata, shared links content, and plugin interaction data." },
      { q: "Can I collect ChatGPT responses at scale?", a: "Yes. Send prompts or shared conversation URLs and receive structured response data. Scale from hundreds to millions of data points." },
      { q: "How does the scraper handle OpenAI's protections?", a: "Bright Data manages proxy rotation, browser rendering, and anti-bot bypass automatically for consistent, reliable data collection from OpenAI properties." },
      { q: "Can I monitor ChatGPT feature changes over time?", a: "Yes. Schedule recurring collections to track model behavior changes, new capabilities, and response pattern shifts across updates." },
      { q: "What output formats are supported?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("openai.com"),
  },

  crunchbase: {
    slug: "crunchbase",
    name: "Crunchbase",
    domain: "crunchbase.com",
    category: "Business (B2B)",
    title: "Crunchbase Scraper API - Companies, Funding & Investors",
    headline: "Crunchbase Scraper API",
    description:
      "Extract Crunchbase company profiles, funding rounds, investor data, and acquisition history via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "Startup & VC research",
        body: "Scrape company profiles, funding rounds, valuations, and investor networks to identify promising startups and track venture capital activity.",
        tags: "Startups · Funding · Valuations · Investors",
      },
      {
        title: "Competitive intelligence",
        body: "Monitor competitor funding, employee growth, product launches, and strategic partnerships to anticipate market moves and inform strategy.",
        tags: "Competitors · Growth · Partnerships · Strategy",
      },
      {
        title: "M&A monitoring & deal sourcing",
        body: "Track acquisitions, mergers, and IPO activity across industries to identify deal patterns and potential acquisition targets early.",
        tags: "Acquisitions · Mergers · IPOs · Deal flow",
      },
      {
        title: "B2B lead generation",
        body: "Build targeted prospect lists by filtering companies on funding stage, industry, employee count, and technology stack for high-intent outreach.",
        tags: "Prospects · Filtering · Industries · Outreach",
      },
    ],
    faqs: [
      { q: "What Crunchbase data can I extract?", a: "Company profiles (description, industry, size, founded date), funding rounds (amount, investors, date, series), people (founders, executives), acquisitions, and IPO data." },
      { q: "Can I filter companies by funding stage?", a: "Yes. Send search queries with filters for funding stage, industry, location, employee count, and revenue range to collect matching companies." },
      { q: "How often is Crunchbase data refreshed?", a: "Data is scraped fresh with each request. Schedule daily or weekly collections to track new funding rounds and company updates." },
      { q: "Can I extract investor portfolios?", a: "Yes. Collect investor profiles with portfolio companies, investment history, fund size, and co-investor networks." },
      { q: "What output formats are supported?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("crunchbase.com"),
  },

  glassdoor: {
    slug: "glassdoor",
    name: "Glassdoor",
    domain: "glassdoor.com",
    category: "Business (B2B)",
    title: "Glassdoor Scraper API - Reviews, Salaries & Job Listings",
    headline: "Glassdoor Scraper API",
    description:
      "Extract Glassdoor company reviews, salary data, interview questions, and job listings via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "Employer brand monitoring",
        body: "Track company ratings, review sentiment, and CEO approval trends to measure employer brand health and identify areas for improvement.",
        tags: "Ratings · Reviews · Sentiment · Brand health",
      },
      {
        title: "Salary benchmarking",
        body: "Collect salary reports by role, location, and experience level to build competitive compensation packages and inform hiring budgets.",
        tags: "Salaries · Roles · Locations · Compensation",
      },
      {
        title: "Talent intelligence",
        body: "Scrape interview questions, difficulty ratings, and candidate experiences to optimize your hiring process and improve offer acceptance rates.",
        tags: "Interviews · Candidates · Hiring · Acceptance",
      },
      {
        title: "Workplace culture trends",
        body: "Analyze review themes across industries to identify emerging workplace trends, employee expectations, and cultural benchmarks.",
        tags: "Culture · Trends · Expectations · Benchmarks",
      },
    ],
    faqs: [
      { q: "What Glassdoor data can I extract?", a: "Company reviews (rating, pros, cons, advice), salary reports (base pay, bonus, role, location), interview questions, job listings, and company overview data." },
      { q: "Can I track review sentiment over time?", a: "Yes. Schedule recurring collections to monitor rating changes, review volume, and sentiment shifts for any company." },
      { q: "Is salary data broken down by role?", a: "Yes. Extract salary ranges by job title, department, location, and experience level with sample sizes and confidence indicators." },
      { q: "Can I scrape interview experiences?", a: "Yes. Collect interview questions, difficulty ratings, offer outcomes, and process duration for specific companies and roles." },
      { q: "What output formats are supported?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("glassdoor.com"),
  },

  indeed: {
    slug: "indeed",
    name: "Indeed",
    domain: "indeed.com",
    category: "Jobs",
    title: "Indeed Scraper API - Job Listings, Salaries & Company Reviews",
    headline: "Indeed Scraper API",
    description:
      "Extract Indeed job listings, salary estimates, company reviews, and labor market data via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "Job market analysis",
        body: "Scrape job postings by role, location, and industry to map hiring demand, identify emerging roles, and track labor market dynamics.",
        tags: "Postings · Demand · Roles · Labor market",
      },
      {
        title: "Recruitment intelligence",
        body: "Monitor competitor job listings to uncover hiring priorities, required skills, and compensation signals that inform your talent acquisition strategy.",
        tags: "Competitors · Skills · Compensation · Hiring",
      },
      {
        title: "Salary research & benchmarking",
        body: "Collect salary estimates and reported pay data across roles and regions to build accurate compensation benchmarks for any position.",
        tags: "Salaries · Regions · Benchmarks · Pay data",
      },
      {
        title: "Skills demand tracking",
        body: "Extract required skills, certifications, and qualifications from job postings to identify trending competencies and workforce upskilling opportunities.",
        tags: "Skills · Certifications · Trends · Upskilling",
      },
    ],
    faqs: [
      { q: "What Indeed data can I extract?", a: "Job listings (title, company, location, salary, description, requirements), company reviews, salary data, and search result counts by query." },
      { q: "Can I filter jobs by location and role?", a: "Yes. Send search queries with location, job title, salary range, and date posted filters to collect matching listings." },
      { q: "How fresh is the job data?", a: "Data is scraped fresh with each request. Schedule recurring collections to track new postings and removed listings daily." },
      { q: "Can I extract company reviews from Indeed?", a: "Yes. Collect company ratings, review text, pros/cons, and work-life balance scores from Indeed's employer profiles." },
      { q: "What output formats are supported?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("indeed.com"),
  },

  yelp: {
    slug: "yelp",
    name: "Yelp",
    domain: "yelp.com",
    category: "Business (B2B)",
    title: "Yelp Scraper API - Business Listings, Reviews & Ratings",
    headline: "Yelp Scraper API",
    description:
      "Extract Yelp business listings, reviews, ratings, photos, and local search results via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "Local business intelligence",
        body: "Scrape Yelp business listings by category and location to map local markets, identify competitor density, and discover underserved areas.",
        tags: "Listings · Categories · Locations · Markets",
      },
      {
        title: "Review monitoring & analysis",
        body: "Collect customer reviews, ratings, and response patterns to track brand reputation, identify service issues, and benchmark against competitors.",
        tags: "Reviews · Ratings · Reputation · Benchmarks",
      },
      {
        title: "Competitive pricing & offerings",
        body: "Extract business details including price ranges, service menus, and hours to understand competitor positioning and pricing strategies.",
        tags: "Pricing · Services · Hours · Positioning",
      },
      {
        title: "Market research & expansion",
        body: "Analyze business density, ratings distribution, and review volume across neighborhoods to inform market entry and expansion decisions.",
        tags: "Density · Distribution · Volume · Expansion",
      },
    ],
    faqs: [
      { q: "What Yelp data can I extract?", a: "Business listings (name, address, phone, hours, category), reviews (text, rating, date, reviewer), photos, price range, and search results." },
      { q: "Can I search businesses by category and location?", a: "Yes. Send search queries like 'plumbers in Chicago' or filter by category, price range, and rating to collect matching businesses." },
      { q: "Can I extract individual reviews?", a: "Yes. Collect review text, star rating, date, reviewer name, useful/funny/cool votes, and business owner responses." },
      { q: "How do you handle Yelp's anti-scraping measures?", a: "Bright Data manages proxy rotation, browser rendering, and CAPTCHA solving automatically for reliable, uninterrupted data collection." },
      { q: "What output formats are supported?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("yelp.com"),
  },

  walmart: {
    slug: "walmart",
    name: "Walmart",
    domain: "walmart.com",
    category: "E-commerce",
    title: "Walmart Scraper API - Products, Prices & Reviews",
    headline: "Walmart Scraper API",
    description:
      "Extract Walmart product listings, pricing, reviews, seller data, and inventory status via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "Price monitoring & repricing",
        body: "Track Walmart product prices, discounts, and rollback offers in real time to optimize your pricing strategy and maintain competitive positioning.",
        tags: "Prices · Discounts · Rollbacks · Repricing",
      },
      {
        title: "Product assortment analysis",
        body: "Scrape category pages and search results to map product assortment, identify gaps in your catalog, and discover trending items.",
        tags: "Categories · Assortment · Gaps · Trending",
      },
      {
        title: "Review intelligence",
        body: "Collect product reviews, ratings, and verified purchase data to analyze customer sentiment, identify quality issues, and inform product development.",
        tags: "Reviews · Ratings · Sentiment · Product quality",
      },
      {
        title: "Competitive pricing strategy",
        body: "Monitor competitor products and pricing on Walmart Marketplace to track seller dynamics, Buy Box ownership, and promotional patterns.",
        tags: "Competitors · Marketplace · Buy Box · Promotions",
      },
    ],
    faqs: [
      { q: "What Walmart data can I extract?", a: "Product listings (title, price, images, description), reviews (text, rating, verified), seller info, inventory status, category rankings, and search results." },
      { q: "Can I monitor price changes over time?", a: "Yes. Schedule recurring collections to track price fluctuations, rollbacks, and promotional pricing for any product or category." },
      { q: "Does it work with Walmart Marketplace sellers?", a: "Yes. Extract third-party seller data including name, ratings, fulfillment method, and product listings." },
      { q: "Can I scrape Walmart search results?", a: "Yes. Send keyword searches or category URLs to collect all matching products with pricing, ratings, and availability." },
      { q: "What output formats are supported?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("walmart.com"),
  },

  "google-play": {
    slug: "google-play",
    name: "Google Play",
    domain: "play.google.com",
    category: "E-commerce",
    title: "Google Play Scraper API - Apps, Reviews & Rankings",
    headline: "Google Play Scraper API",
    description:
      "Extract Google Play app listings, reviews, rankings, and download metrics via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "App intelligence & market sizing",
        body: "Scrape app listings, download counts, and category rankings to map the mobile app market, identify top performers, and estimate market share.",
        tags: "Apps · Downloads · Rankings · Market share",
      },
      {
        title: "Review monitoring & sentiment",
        body: "Collect user reviews, ratings, and version-specific feedback to track app quality, detect bugs, and monitor customer satisfaction over time.",
        tags: "Reviews · Ratings · Bugs · Satisfaction",
      },
      {
        title: "Competitor app tracking",
        body: "Monitor competitor apps for feature updates, pricing changes, and rating trends to inform your product roadmap and marketing strategy.",
        tags: "Competitors · Features · Pricing · Roadmap",
      },
      {
        title: "ASO & keyword research",
        body: "Extract app titles, descriptions, and category metadata to analyze keyword strategies, optimize your store listing, and improve discoverability.",
        tags: "Keywords · ASO · Metadata · Discoverability",
      },
    ],
    faqs: [
      { q: "What Google Play data can I extract?", a: "App listings (title, developer, price, downloads, rating), reviews (text, rating, date, device), category rankings, permissions, and version history." },
      { q: "Can I track app rankings over time?", a: "Yes. Schedule recurring collections to monitor ranking changes, review velocity, and download estimate trends for any app or category." },
      { q: "Can I extract reviews by version or rating?", a: "Yes. Collect reviews filtered by star rating, app version, date, and sort order. Includes reviewer device info and helpfulness votes." },
      { q: "Does it support multiple countries?", a: "Yes. Specify country and language parameters to collect localized app data, pricing, and reviews from any Google Play region." },
      { q: "What output formats are supported?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("play.google.com"),
  },

  homedepot: {
    slug: "homedepot",
    name: "Home Depot",
    domain: "homedepot.com",
    category: "E-commerce",
    title: "Home Depot Scraper API - Products, Prices & Reviews",
    headline: "Home Depot Scraper API",
    description:
      "Extract Home Depot product listings, pricing, reviews, specifications, and inventory data via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "Building materials pricing",
        body: "Track lumber, hardware, and building supply prices across regions to optimize procurement timing and forecast material cost fluctuations.",
        tags: "Lumber · Hardware · Pricing · Procurement",
      },
      {
        title: "Product catalog intelligence",
        body: "Scrape product specifications, dimensions, and compatibility data to build comprehensive catalogs and enrich your product databases.",
        tags: "Specifications · Dimensions · Catalogs · Enrichment",
      },
      {
        title: "Competitive analysis for retailers",
        body: "Monitor Home Depot pricing, promotions, and product assortment to benchmark your home improvement offerings and adjust strategy.",
        tags: "Competitors · Promotions · Assortment · Strategy",
      },
      {
        title: "Inventory & availability monitoring",
        body: "Track product availability, stock status, and delivery estimates across store locations to identify supply chain patterns and demand signals.",
        tags: "Inventory · Stock · Delivery · Supply chain",
      },
    ],
    faqs: [
      { q: "What Home Depot data can I extract?", a: "Product listings (title, price, SKU, specifications), reviews (text, rating, verified purchase), availability by store, category pages, and search results." },
      { q: "Can I track prices across different stores?", a: "Yes. Specify store locations or zip codes to collect localized pricing, availability, and delivery estimates for any product." },
      { q: "Does it include product specifications?", a: "Yes. Extract detailed specs including dimensions, materials, weight, warranty, brand, model number, and compatibility information." },
      { q: "Can I monitor seasonal promotions?", a: "Yes. Schedule recurring collections to track price changes, special buys, clearance items, and seasonal promotional events." },
      { q: "What output formats are supported?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("homedepot.com"),
  },

  zoopla: {
    slug: "zoopla",
    name: "Zoopla",
    domain: "zoopla.co.uk",
    category: "Real Estate",
    title: "Zoopla Scraper API - UK Property Listings & Prices",
    headline: "Zoopla Scraper API",
    description:
      "Extract Zoopla property listings, price estimates, sold prices, and rental data across the UK via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "UK property market analysis",
        body: "Scrape property listings, asking prices, and sold price data to map market trends, identify hotspots, and forecast price movements across UK regions.",
        tags: "Listings · Prices · Trends · Regions",
      },
      {
        title: "Price tracking & valuation",
        body: "Monitor asking prices, price reductions, and Zoopla estimates to build accurate valuation models and identify undervalued properties.",
        tags: "Valuations · Reductions · Estimates · Models",
      },
      {
        title: "Investment research",
        body: "Collect rental yields, property details, and area demographics to evaluate buy-to-let opportunities and calculate expected returns.",
        tags: "Yields · Demographics · Buy-to-let · Returns",
      },
      {
        title: "Rental market intelligence",
        body: "Extract rental listings, asking rents, and availability data to track rental market dynamics, benchmark pricing, and identify demand hotspots.",
        tags: "Rentals · Rents · Availability · Demand",
      },
    ],
    faqs: [
      { q: "What Zoopla data can I extract?", a: "Property listings (price, bedrooms, type, address), sold prices, Zoopla estimates, rental listings, agent details, floor plans, and area statistics." },
      { q: "Can I search by postcode or area?", a: "Yes. Send search queries by postcode, city, or area to collect all matching properties with full listing details and pricing history." },
      { q: "Does it include sold price history?", a: "Yes. Extract historical sold prices, transaction dates, and price-per-sqft data for properties and streets." },
      { q: "Can I monitor new listings in real-time?", a: "Yes. Schedule frequent collections to capture new listings, price changes, and properties marked as sold or under offer." },
      { q: "What output formats are supported?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("zoopla.co.uk"),
  },

  zonaprop: {
    slug: "zonaprop",
    name: "Zonaprop",
    domain: "zonaprop.com.ar",
    category: "Real Estate",
    title: "Zonaprop Scraper API - Argentina Property Listings",
    headline: "Zonaprop Scraper API",
    description:
      "Extract Zonaprop property listings, prices, and real estate data across Argentina via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "Argentina real estate analysis",
        body: "Scrape property listings across Buenos Aires and other cities to map price trends, neighborhood dynamics, and market supply in the Argentine property market.",
        tags: "Listings · Buenos Aires · Prices · Supply",
      },
      {
        title: "Price tracking & comparisons",
        body: "Monitor asking prices in USD and ARS across neighborhoods to identify price movements, currency impact, and seasonal patterns.",
        tags: "USD pricing · Neighborhoods · Trends · Seasons",
      },
      {
        title: "Investment opportunity identification",
        body: "Collect property details, price-per-sqm data, and location metrics to discover undervalued properties and high-yield investment opportunities.",
        tags: "Price per sqm · Yields · Opportunities · Locations",
      },
      {
        title: "Market trends & supply monitoring",
        body: "Track new listings volume, time-on-market, and price adjustments to understand supply dynamics and predict market direction.",
        tags: "Volume · Time on market · Adjustments · Direction",
      },
    ],
    faqs: [
      { q: "What Zonaprop data can I extract?", a: "Property listings (price, size, rooms, location, description), photos, agent details, neighborhood data, and price-per-square-meter calculations." },
      { q: "Can I filter by property type and location?", a: "Yes. Send searches filtered by property type (apartment, house, land), neighborhood, price range, and size to collect matching listings." },
      { q: "Does it support both sale and rental listings?", a: "Yes. Extract both sale and rental properties with separate pricing, availability, and property details for each type." },
      { q: "Can I track the Argentine property market over time?", a: "Yes. Schedule recurring collections to monitor new listings, price changes, and market supply trends across Argentine cities." },
      { q: "What output formats are supported?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("zonaprop.com.ar"),
  },

  inmuebles24: {
    slug: "inmuebles24",
    name: "Inmuebles24",
    domain: "inmuebles24.com",
    category: "Real Estate",
    title: "Inmuebles24 Scraper API - Mexico Property Listings",
    headline: "Inmuebles24 Scraper API",
    description:
      "Extract Inmuebles24 property listings, prices, and real estate data across Mexico via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "Mexico real estate market intelligence",
        body: "Scrape property listings across Mexico City, Guadalajara, and other major cities to analyze pricing, inventory levels, and market activity.",
        tags: "Listings · Mexico City · Pricing · Inventory",
      },
      {
        title: "Property pricing analysis",
        body: "Collect asking prices, price-per-sqm data, and listing history to build pricing models and identify competitive rates across Mexican neighborhoods.",
        tags: "Price per sqm · Models · Neighborhoods · Rates",
      },
      {
        title: "Rental market research",
        body: "Extract rental listings, monthly rents, and property features to map rental demand, calculate yields, and benchmark rental pricing.",
        tags: "Rentals · Monthly rents · Yields · Demand",
      },
      {
        title: "Investment analysis",
        body: "Monitor property supply, price trends, and development activity to identify emerging neighborhoods and high-growth investment areas in Mexico.",
        tags: "Supply · Trends · Development · Growth areas",
      },
    ],
    faqs: [
      { q: "What Inmuebles24 data can I extract?", a: "Property listings (price, size, bedrooms, location, description), photos, developer/agent info, amenities, and neighborhood details." },
      { q: "Can I search across multiple Mexican cities?", a: "Yes. Send searches by city, state, neighborhood, or colonia to collect listings with full property details and pricing." },
      { q: "Does it include both new and resale properties?", a: "Yes. Extract listings from developers (new builds) and individual sellers (resale) with separate property details for each." },
      { q: "Can I track price changes over time?", a: "Yes. Schedule recurring collections to monitor price adjustments, new listings, and removed properties across your target markets." },
      { q: "What output formats are supported?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("inmuebles24.com"),
  },

  metrocuadrado: {
    slug: "metrocuadrado",
    name: "Metrocuadrado",
    domain: "metrocuadrado.com",
    category: "Real Estate",
    title: "Metrocuadrado Scraper API - Colombia Property Listings",
    headline: "Metrocuadrado Scraper API",
    description:
      "Extract Metrocuadrado property listings, prices, and real estate data across Colombia via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "Colombia real estate market analysis",
        body: "Scrape property listings across Bogotá, Medellín, and other major cities to track pricing trends, market supply, and buyer demand in Colombia.",
        tags: "Bogotá · Medellín · Pricing · Supply",
      },
      {
        title: "Property price benchmarking",
        body: "Collect asking prices, price-per-sqm data, and property characteristics to benchmark values across estratos, neighborhoods, and property types.",
        tags: "Price per sqm · Estratos · Benchmarks · Types",
      },
      {
        title: "Investment research & due diligence",
        body: "Extract property details, neighborhood amenities, and market comparables to evaluate investment potential and calculate expected returns.",
        tags: "Comparables · Amenities · Returns · Due diligence",
      },
      {
        title: "Rental market & yield analysis",
        body: "Monitor rental listings, monthly prices, and occupancy signals to map rental demand and identify high-yield opportunities across Colombian cities.",
        tags: "Rentals · Occupancy · Yields · Opportunities",
      },
    ],
    faqs: [
      { q: "What Metrocuadrado data can I extract?", a: "Property listings (price, area, rooms, estrato, location), photos, agent info, building amenities, and neighborhood data across Colombia." },
      { q: "Can I filter by estrato and city?", a: "Yes. Search by estrato, city, neighborhood, property type, price range, and area to collect precisely targeted listings." },
      { q: "Does it include new development projects?", a: "Yes. Extract both resale listings and new project data including developer info, delivery dates, and unit availability." },
      { q: "Can I monitor the Bogotá market specifically?", a: "Yes. Target specific cities, localidades, or neighborhoods for focused collection of listings, prices, and market trends." },
      { q: "What output formats are supported?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("metrocuadrado.com"),
  },

  booking: {
    slug: "booking",
    name: "Booking.com",
    domain: "booking.com",
    category: "Travel",
    title: "Booking.com Scraper API - Hotels, Prices & Reviews",
    headline: "Booking.com Scraper API",
    description:
      "Extract Booking.com hotel listings, room rates, reviews, and availability data via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "Hotel price monitoring & rate parity",
        body: "Track room rates, discounts, and availability across properties to ensure rate parity, optimize revenue management, and detect undercutting.",
        tags: "Rates · Parity · Revenue · Availability",
      },
      {
        title: "Competitive rate intelligence",
        body: "Monitor competitor hotel pricing, promotions, and package deals to adjust your rates dynamically and maximize occupancy.",
        tags: "Competitors · Promotions · Packages · Occupancy",
      },
      {
        title: "Review analysis & reputation",
        body: "Collect guest reviews, ratings, and category scores to benchmark service quality, identify improvement areas, and track reputation trends.",
        tags: "Reviews · Ratings · Quality · Reputation",
      },
      {
        title: "Travel market intelligence",
        body: "Scrape destination availability, seasonal pricing, and property supply to understand travel demand patterns and inform investment decisions.",
        tags: "Destinations · Seasonal · Supply · Demand",
      },
    ],
    faqs: [
      { q: "What Booking.com data can I extract?", a: "Hotel listings (name, location, star rating, amenities), room rates (price, room type, availability, cancellation policy), reviews (score, text, category ratings), and photos." },
      { q: "Can I monitor rates for specific dates?", a: "Yes. Send check-in/check-out dates and destination to collect real-time room rates, availability, and promotional pricing." },
      { q: "Does it support multiple currencies?", a: "Yes. Specify currency parameters to collect pricing in your preferred currency with accurate conversion for any market." },
      { q: "Can I track rate changes over time?", a: "Yes. Schedule recurring collections to monitor price fluctuations, last-minute deals, and booking pressure indicators." },
      { q: "What output formats are supported?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("booking.com"),
  },

  airbnb: {
    slug: "airbnb",
    name: "Airbnb",
    domain: "airbnb.com",
    category: "Travel",
    title: "Airbnb Scraper API - Listings, Prices & Reviews",
    headline: "Airbnb Scraper API",
    description:
      "Extract Airbnb property listings, nightly rates, host data, reviews, and availability calendars via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "Vacation rental intelligence",
        body: "Scrape Airbnb listings, nightly rates, and occupancy signals to map short-term rental supply, pricing dynamics, and revenue potential by market.",
        tags: "Listings · Rates · Occupancy · Revenue",
      },
      {
        title: "Dynamic pricing optimization",
        body: "Monitor competitor listing prices, availability calendars, and seasonal patterns to optimize your nightly rates and maximize booking revenue.",
        tags: "Competitors · Calendars · Seasonal · Optimization",
      },
      {
        title: "Market analysis & investment",
        body: "Collect property data, host portfolios, and area metrics to evaluate short-term rental investment opportunities and forecast returns.",
        tags: "Properties · Portfolios · Metrics · Returns",
      },
      {
        title: "Competitor monitoring",
        body: "Track competitor listings, amenities, pricing strategies, and review scores to benchmark your properties and identify competitive advantages.",
        tags: "Amenities · Strategies · Scores · Benchmarking",
      },
    ],
    faqs: [
      { q: "What Airbnb data can I extract?", a: "Listings (title, price, location, amenities, photos), host info (superhost status, response rate), reviews (text, rating), availability calendars, and search results." },
      { q: "Can I get availability calendar data?", a: "Yes. Extract blocked and available dates, minimum stays, and pricing by date for any listing to analyze occupancy patterns." },
      { q: "Does it work for any Airbnb market?", a: "Yes. Collect data from any Airbnb market worldwide by specifying location, dates, property type, and price range filters." },
      { q: "Can I track pricing changes over time?", a: "Yes. Schedule recurring collections to monitor nightly rate changes, seasonal pricing, and availability shifts for your target market." },
      { q: "What output formats are supported?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("airbnb.com"),
  },

  agoda: {
    slug: "agoda",
    name: "Agoda",
    domain: "agoda.com",
    category: "Travel",
    title: "Agoda Scraper API - Hotels, Prices & Reviews",
    headline: "Agoda Scraper API",
    description:
      "Extract Agoda hotel listings, room rates, reviews, and deals across Asia-Pacific and global markets via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "Asia-Pacific hotel pricing",
        body: "Track Agoda room rates and promotional deals across Southeast Asia, Japan, and other APAC markets to maintain rate parity and competitive positioning.",
        tags: "APAC · Rates · Promotions · Parity",
      },
      {
        title: "Rate comparison & distribution",
        body: "Monitor Agoda pricing against other OTAs to detect rate disparities, identify distribution issues, and ensure pricing consistency across channels.",
        tags: "OTAs · Disparities · Distribution · Consistency",
      },
      {
        title: "Travel market research",
        body: "Scrape destination data, property supply, and pricing trends to analyze travel demand patterns and identify growth opportunities in key markets.",
        tags: "Destinations · Supply · Trends · Growth",
      },
      {
        title: "Review monitoring & quality",
        body: "Collect guest reviews, detailed ratings, and property scores to benchmark service quality and identify areas for improvement across your portfolio.",
        tags: "Reviews · Ratings · Quality · Portfolio",
      },
    ],
    faqs: [
      { q: "What Agoda data can I extract?", a: "Hotel listings (name, location, star rating, amenities), room rates (price, room type, deals), reviews (score, text, traveler type), photos, and property details." },
      { q: "Does it cover Asia-Pacific markets well?", a: "Yes. Agoda has strong coverage in Southeast Asia, Japan, Korea, and Australia. Extract localized pricing and reviews from any market." },
      { q: "Can I compare rates across dates?", a: "Yes. Send multiple date combinations to collect rate data and identify pricing patterns, early-bird discounts, and demand surges." },
      { q: "How do you handle Agoda's dynamic pricing?", a: "Data is scraped fresh with each request, capturing real-time rates including flash sales, member deals, and mobile-only pricing." },
      { q: "What output formats are supported?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("agoda.com"),
  },

  trip: {
    slug: "trip",
    name: "Trip.com",
    domain: "trip.com",
    category: "Travel",
    title: "Trip.com Scraper API - Hotels, Flights & Travel Deals",
    headline: "Trip.com Scraper API",
    description:
      "Extract Trip.com hotel rates, flight prices, travel packages, and reviews via API or no-code scraper. Auto-maintained and always unblocked.",
    useCases: [
      {
        title: "Travel pricing intelligence",
        body: "Track hotel rates and flight prices on Trip.com to monitor competitive pricing across the Chinese outbound travel market and global destinations.",
        tags: "Hotels · Flights · Pricing · Markets",
      },
      {
        title: "Flight & hotel rate comparison",
        body: "Scrape Trip.com rates alongside other OTAs to detect pricing gaps, ensure rate parity, and optimize distribution strategy.",
        tags: "Rates · Parity · OTAs · Distribution",
      },
      {
        title: "Market analysis & demand signals",
        body: "Collect booking availability, pricing trends, and inventory data to identify high-demand routes, seasonal patterns, and growth markets.",
        tags: "Availability · Demand · Routes · Seasonal",
      },
      {
        title: "Deal monitoring & alerts",
        body: "Monitor Trip.com for flash sales, promotional bundles, and package deals to track competitor offers and inform your promotional calendar.",
        tags: "Flash sales · Bundles · Promotions · Calendar",
      },
    ],
    faqs: [
      { q: "What Trip.com data can I extract?", a: "Hotel listings (rates, availability, amenities), flight prices (routes, airlines, schedules), travel packages, reviews, and promotional deals." },
      { q: "Does it cover both flights and hotels?", a: "Yes. Extract data from Trip.com's hotel, flight, and package booking sections with full pricing and availability details." },
      { q: "Can I track prices for specific routes?", a: "Yes. Send route and date parameters to collect flight prices, airline options, and schedule data for any origin-destination pair." },
      { q: "Is data available for Chinese domestic and international travel?", a: "Yes. Trip.com covers both Chinese domestic travel and international destinations. Collect data for any market Trip.com serves." },
      { q: "What output formats are supported?", a: "JSON, NDJSON, CSV, and .gz. Deliver via API, webhook, S3, GCS, Snowflake, or SFTP." },
    ],
    scrapers: scrapersForDomain("trip.com"),
  },
};
