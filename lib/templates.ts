export type InputField = {
  name: string;
  type: string;
  required: boolean;
  example: string;
  description: string;
};

/** One row of the output data dictionary: field, what it is, and its type. */
export type DictField = {
  name: string;
  description: string;
  type: string;
};

/** Independent third-party benchmark result (AIMultiple, 2026). */
export type Benchmark = {
  rank: string;
  note: string;
  source: string;
  url: string;
};

export type Endpoint = {
  name: string;
  desc: string;
};

export type Template = {
  slug: string;
  name: string;
  domain: string;
  category: string;
  icon: string;
  color: string;
  tagline: string;
  description: string;
  popular?: boolean;
  datasetId: string;
  endpoints: Endpoint[];
  responseTime: string;
  /** Matching tool in the Bright Data Web MCP server, when one exists. */
  mcp?: { tool: string; group: string };
  benchmark?: Benchmark;
  inputs: InputField[];
  dictionary: DictField[];
  /** Total documented fields in the console dictionary, when larger than the subset shown. */
  totalFields?: number;
  sampleOutput: Record<string, unknown>;
};

export const CATEGORIES = [
  "All",
  "E-commerce",
  "Social Media",
  "Business (B2B)",
  "Search",
  "Real Estate",
] as const;

/** Deep link to this scraper in the Bright Data console. */
export function consoleUrl(t: Template) {
  return `https://brightdata.com/cp/scrapers/${t.datasetId}/pdp/configuration`;
}

/**
 * Preferred in-app / product href for a template.
 * Local Amazon pages when available; otherwise console.
 */
export function templateHref(t: Template): string {
  if (t.slug === "amazon-product") {
    return "/products/web-scraper/amazon/amazon-product-scraper";
  }
  if (t.slug === "amazon-reviews") {
    return "https://brightdata.com/products/web-scraper/amazon/reviews";
  }
  if (t.slug === "amazon-sellers") {
    return "https://brightdata.com/products/web-scraper/amazon/seller";
  }
  if (t.domain === "amazon.com") {
    return "/products/web-scraper/amazon";
  }
  return consoleUrl(t);
}

export const templates: Template[] = [
  {
    slug: "amazon-product",
    name: "Amazon Product",
    domain: "amazon.com",
    category: "E-commerce",
    icon: "A",
    color: "#FF9900",
    tagline: "Price, title, rating, reviews and stock for any product URL.",
    description:
      "Collect the full product detail page for any Amazon listing: title, brand, seller, price, availability, ratings, review count, categories and images. Handles regional domains and A/B page layouts.",
    popular: true,
    datasetId: "gd_l7q7dkf244hwjntr0",
    mcp: { tool: "web_data_amazon_product", group: "ecommerce" },
    endpoints: [
      { name: "Collect by URL", desc: "Pass product URLs directly." },
      { name: "Discover by best sellers URL", desc: "Crawl a best-sellers page into products." },
      { name: "Discover by category URL", desc: "Expand a category listing into products." },
      { name: "Discover by keyword", desc: "Run a search term and collect the results." },
      { name: "Discover by UPC", desc: "Resolve products from UPC codes." },
    ],
    responseTime: "~18s per input",
    benchmark: {
      rank: "#1 Amazon scraper",
      note: "Highest success rate and fastest results, tested over 2,750 requests across 11 Amazon domains.",
      source: "AIMultiple, 2026",
      url: "https://research.aimultiple.com/amazon-scraper/",
    },
    inputs: [
      { name: "url", type: "string", required: true, example: "https://www.amazon.com/dp/B0CX23V2ZK", description: "Amazon product URL." },
      { name: "zipcode", type: "string", required: false, example: "94107", description: "The ZIP code for the area you want to search from." },
      { name: "language", type: "string", required: false, example: "en", description: "Language of the page." },
    ],
    totalFields: 95,
    // Full dictionary captured from the Scrapers Library console.
    dictionary: [
      { name: "title", description: "Product title", type: "Text" },
      { name: "seller_name", description: "Seller name", type: "Text" },
      { name: "brand", description: "Product brand", type: "Text" },
      { name: "description", description: "A brief description of the product", type: "Text" },
      { name: "initial_price", description: "Initial price", type: "Price" },
      { name: "final_price", description: "Final price of the product", type: "Price" },
      { name: "final_price_high", description: "Highest value of the final price when it is a range", type: "Price" },
      { name: "currency", description: "Currency of the product", type: "Text" },
      { name: "availability", description: "Product availability", type: "Text" },
      { name: "is_available", description: "Indication if the product is still available", type: "Boolean" },
      { name: "reviews_count", description: "Number of reviews", type: "Number" },
      { name: "rating", description: "Product rating", type: "Number" },
      { name: "categories", description: "Product categories", type: "Array" },
      { name: "asin", description: "Unique identifier for each product", type: "Text" },
      { name: "parent_asin", description: "Parent ASIN of the product", type: "Text" },
      { name: "input_asin", description: "Input ASIN (currently inactive)", type: "Text" },
      { name: "buybox_seller", description: "Seller in the buy box", type: "Text" },
      { name: "buybox_prices", description: "Product price details", type: "Object" },
      { name: "buybox_seller_rating", description: "The rating of the buy box seller", type: "Number" },
      { name: "inactive_buy_box", description: "Price information when the buy box is unavailable", type: "Object" },
      { name: "number_of_sellers", description: "Number of sellers for the product", type: "Number" },
      { name: "other_sellers_prices", description: "Offers from other sellers for the same product", type: "Array" },
      { name: "seller_id", description: "Unique identifier for each seller", type: "Text" },
      { name: "seller_url", description: "Seller storefront or profile URL on Amazon", type: "Url" },
      { name: "store_url", description: "The product's store URL", type: "Url" },
      { name: "root_bs_rank", description: "Best sellers rank in the general category", type: "Number" },
      { name: "root_bs_category", description: "Best seller root category", type: "Text" },
      { name: "bs_category", description: "Best seller category", type: "Text" },
      { name: "bs_rank", description: "Best seller rank in the specific category", type: "Number" },
      { name: "subcategory_rank", description: "Best sellers rank entries by subcategory", type: "Array" },
      { name: "subcategory_link", description: "Best sellers link entries by subcategory", type: "Array" },
      { name: "badge", description: "Product badge, for example #1 Best Seller or Amazon's Choice", type: "Text" },
      { name: "all_badges", description: "All badges", type: "Array" },
      { name: "amazon_choice", description: "Specifies if the product is Amazon's Choice", type: "Boolean" },
      { name: "amazon_prime", description: "Does it have Amazon Prime delivery", type: "Boolean" },
      { name: "premium_brand", description: "Is it a premium brand", type: "Boolean" },
      { name: "sponsored", description: "Amazon Sponsored flag", type: "Boolean" },
      { name: "sponsered", description: "Sponsored, legacy field spelling", type: "Boolean" },
      { name: "ISBN10", description: "ISBN-10 identifier for books", type: "Text" },
      { name: "upc", description: "Universal Product Code", type: "Text" },
      { name: "model_number", description: "Model number of the product", type: "Text" },
      { name: "manufacturer", description: "Manufacturer of the product", type: "Text" },
      { name: "department", description: "Department to which the product belongs", type: "Text" },
      { name: "item_weight", description: "Weight of the product", type: "Text" },
      { name: "product_dimensions", description: "Dimensions of the product", type: "Text" },
      { name: "country_of_origin", description: "Country of origin of the product", type: "Text" },
      { name: "ingredients", description: "Ingredients of the product, relevant mostly for food products", type: "Text" },
      { name: "date_first_available", description: "Date when the product first became available", type: "Text" },
      { name: "discount", description: "Product discount information", type: "Text" },
      { name: "coupon", description: "Coupon", type: "Text" },
      { name: "coupon_description", description: "Coupon description", type: "Text" },
      { name: "prices_breakdown", description: "Breakdown of list and typical pricing and deal status", type: "Object" },
      { name: "bought_past_month", description: "Units bought in the past month, as shown by Amazon", type: "Number" },
      { name: "max_quantity_available", description: "Maximum quantity allowed to add to cart", type: "Number" },
      { name: "answered_questions", description: "Number of answered questions", type: "Number" },
      { name: "top_review", description: "Top review for the product", type: "Text" },
      { name: "customer_says", description: "Customer says summary", type: "Text" },
      { name: "customers_say", description: "Amazon's Customers say summary extracted from reviews", type: "Object" },
      { name: "editorial_reviews", description: "The editorial reviews of the book", type: "Array" },
      { name: "about_the_author", description: "About the author information", type: "Text" },
      { name: "format", description: "Books format-related information", type: "Array" },
      { name: "features", description: "Product features", type: "Array" },
      { name: "product_details", description: "Full product details", type: "Array" },
      { name: "product_description", description: "Media embedded in the product description section", type: "Array" },
      { name: "from_the_brand", description: "Brand-provided promotional media shown on the page", type: "Array" },
      { name: "plus_content", description: "Boolean indicating the presence of additional content", type: "Boolean" },
      { name: "variations", description: "Details about the same product in different variations", type: "Array" },
      { name: "variations_values", description: "Variations and their possible values", type: "Array" },
      { name: "images", description: "URLs of the product images", type: "Array" },
      { name: "image", description: "URL that links directly to the product image", type: "Url" },
      { name: "image_url", description: "URL that links directly to the product image", type: "Url" },
      { name: "images_count", description: "Number of images", type: "Number" },
      { name: "video", description: "Boolean indicating the presence of videos", type: "Boolean" },
      { name: "videos", description: "URLs of the product's videos", type: "Array" },
      { name: "video_count", description: "Number of videos", type: "Number" },
      { name: "downloadable_videos", description: "Not available: Amazon's streaming delivery and DRM prevent direct video file links", type: "Text" },
      { name: "delivery", description: "Delivery-related information", type: "Array" },
      { name: "ships_from", description: "Where the item ships from", type: "Text" },
      { name: "zipcode", description: "ZIP or postal code used for delivery and availability estimates", type: "Text" },
      { name: "city", description: "City related to shipping or seller location context", type: "Text" },
      { name: "return_policy", description: "Return policy text shown on the product page", type: "Text" },
      { name: "is_frequently_returned_item_badge", description: "Indicates whether the frequently-returned badge is present", type: "Boolean" },
      { name: "frequently_returned_item_message", description: "The text shown inside the warning box", type: "Text" },
      { name: "is_customers_usually_keep", description: "Indicates whether customers usually keep this item", type: "Boolean" },
      { name: "sustainability_features", description: "Sustainability badges and certifications with references", type: "Array" },
      { name: "climate_pledge_friendly", description: "Whether the product shows the Climate Pledge Friendly badge", type: "Boolean" },
      { name: "safety_information", description: "Safety information", type: "Text" },
      { name: "language", description: "Language of the product page content", type: "Text" },
      { name: "domain", description: "URL of the product domain", type: "Url" },
      { name: "url", description: "URL that links directly to the product", type: "Url" },
      { name: "origin_url", description: "Source page URL used to extract this record", type: "Url" },
    ],
    // Real record from the Scrapers Library console. seller_name is masked there too.
    sampleOutput: {
      title:
        "2-Pack Stainless Steel Litter Box Large Easy Clean 2-Scoop Included | Anti-Tracking Step, Odor-Resistant, Rust-Proof",
      seller_name: "******",
      brand: "KISENG",
      description:
        "About this item Generous Space for Multi-Cat Homes. This two-pack of stainless steel litter boxes gives you double the room, so each cat has its own space...",
      initial_price: 49.99,
      final_price: 43.99,
      final_price_high: null,
      discount: "-12%",
      currency: "USD",
      availability: "In Stock",
      is_available: true,
      reviews_count: 23,
      rating: 4.1,
      answered_questions: 0,
      categories: [
        "Pet Supplies",
        "Cats",
        "Litter & Housebreaking",
        "Litter Boxes",
        "Standard Litter Boxes",
      ],
      asin: "B0GVNGB3XY",
      parent_asin: "B0H6ZYDSV1",
      buybox_seller: "Kiseng",
      number_of_sellers: 1,
      seller_id: "A2QNYS4JLVRNDY",
      root_bs_rank: 9331,
      department: "Pet Supplies",
      manufacturer: "KISENG",
      model_number: "T902",
      item_weight: "7.3 Pounds",
      product_dimensions: '22.8"L x 14.9"W x 7.87"H',
      date_first_available: "May 16, 2026",
      images_count: 8,
      video_count: 0,
      video: false,
      plus_content: true,
      upc: null,
      ISBN10: null,
      top_review: null,
      variations: [
        { asin: "B0GVNGB3XY", color: "Grey", currency: "USD", name: "Grey" },
      ],
      delivery: [
        "FREE delivery Monday, July 27",
        "Or Prime members get FREE delivery Friday, July 24",
      ],
      url: "https://www.amazon.com/dp/B0GVNGB3XY",
    },
  },
  {
    slug: "amazon-reviews",
    name: "Amazon Reviews",
    domain: "amazon.com",
    category: "E-commerce",
    icon: "★",
    color: "#FF9900",
    tagline: "Review text, rating, author and verified status per product.",
    description:
      "Collect the review stream for any Amazon product: rating, title, body, author, verified-purchase flag, helpful count and Vine status. Requires a product URL containing /dp/.",
    popular: true,
    datasetId: "gd_le8e811kzy4ggddlq",
    mcp: { tool: "web_data_amazon_product_reviews", group: "ecommerce" },
    endpoints: [{ name: "Collect by URL", desc: "Pass product URLs to collect their reviews." }],
    responseTime: "~20s per input",
    benchmark: {
      rank: "#1 Amazon review scraper",
      note: "Highest accuracy with the most metadata fields per review, tested across 2,500 requests.",
      source: "AIMultiple, 2026",
      url: "https://research.aimultiple.com/amazon-reviews-scraping/",
    },
    inputs: [
      { name: "url", type: "string", required: true, example: "https://www.amazon.com/dp/B0CX23V2ZK", description: "Amazon product URL containing /dp/." },
      { name: "max_reviews", type: "number", required: false, example: "20", description: "Cap the number of reviews returned per product." },
      { name: "variation_specific", type: "boolean", required: false, example: "true", description: "Limit reviews to the specific product variation in the URL." },
      { name: "reviews_to_not_include", type: "array", required: false, example: "[]", description: "Review IDs to exclude, useful for incremental collection." },
    ],
    dictionary: [
      { name: "review_id", description: "Unique identifier for the review", type: "Text" },
      { name: "review_header", description: "Review title", type: "Text" },
      { name: "rating", description: "Star rating given by the reviewer", type: "Number" },
      { name: "author_name", description: "Reviewer display name", type: "Text" },
      { name: "author_id", description: "Reviewer identifier", type: "Text" },
      { name: "author_link", description: "Reviewer profile URL", type: "Url" },
      { name: "is_verified", description: "Whether the purchase was verified", type: "Boolean" },
      { name: "is_amazon_vine", description: "Whether the review is part of Amazon Vine", type: "Boolean" },
      { name: "helpful_count", description: "Number of readers who found the review helpful", type: "Number" },
      { name: "review_country", description: "Marketplace the review was posted on", type: "Text" },
      { name: "review_images", description: "Images attached to the review", type: "Array" },
      { name: "badge", description: "Reviewer badge, if any", type: "Text" },
      { name: "product_name", description: "Product the review belongs to", type: "Text" },
      { name: "product_rating", description: "Overall product rating", type: "Number" },
      { name: "product_rating_count", description: "Total number of product ratings", type: "Number" },
      { name: "asin", description: "Product ASIN", type: "Text" },
      { name: "brand", description: "Product brand", type: "Text" },
      { name: "categories", description: "Product categories", type: "Array" },
    ],
    sampleOutput: {
      review_id: "R2XQ8F1K9ZLM3P",
      review_header: "Sturdy and genuinely easy to clean",
      rating: 5,
      author_name: "M. Rivera",
      is_verified: true,
      is_amazon_vine: false,
      helpful_count: 14,
      review_country: "US",
      asin: "B0GVNGB3XY",
      product_rating: 4.1,
      product_rating_count: 23,
    },
  },
  {
    slug: "amazon-search",
    name: "Amazon Search",
    domain: "amazon.com",
    category: "E-commerce",
    icon: "⌕",
    color: "#FF9900",
    tagline: "Search results by keyword: rank, price, rating and sponsored flag.",
    description:
      "Run a keyword search on any Amazon domain and collect the results page: position, title, ASIN, price, rating, review count and whether the placement is sponsored.",
    datasetId: "gd_lwdb4vjm1ehb499uxs",
    mcp: { tool: "web_data_amazon_product_search", group: "ecommerce" },
    endpoints: [{ name: "Collect by URL", desc: "Pass a search results URL for a keyword." }],
    responseTime: "~15s per input",
    inputs: [
      { name: "keyword", type: "string", required: true, example: "stainless steel litter box", description: "Search term to run on Amazon." },
      { name: "url", type: "string", required: true, example: "https://www.amazon.com", description: "Amazon domain to search on." },
    ],
    dictionary: [
      { name: "position", description: "Rank of the result on the page", type: "Number" },
      { name: "title", description: "Product title", type: "Text" },
      { name: "asin", description: "Product ASIN", type: "Text" },
      { name: "price", description: "Listed price", type: "Price" },
      { name: "currency", description: "Currency of the price", type: "Text" },
      { name: "rating", description: "Average product rating", type: "Number" },
      { name: "reviews_count", description: "Number of reviews", type: "Number" },
      { name: "sponsored", description: "Whether the placement is sponsored", type: "Boolean" },
      { name: "image", description: "Product image URL", type: "Url" },
      { name: "url", description: "Product page URL", type: "Url" },
      { name: "keyword", description: "The search term used", type: "Text" },
    ],
    sampleOutput: {
      position: 1,
      title: "2-Pack Stainless Steel Litter Box Large Easy Clean",
      asin: "B0GVNGB3XY",
      price: 43.99,
      currency: "USD",
      rating: 4.1,
      reviews_count: 23,
      sponsored: false,
      keyword: "stainless steel litter box",
    },
  },
  {
    slug: "amazon-sellers",
    name: "Amazon Sellers",
    domain: "amazon.com",
    category: "E-commerce",
    icon: "⛁",
    color: "#FF9900",
    tagline: "Seller profile: name, rating, feedback and business details.",
    description:
      "Collect a seller storefront on Amazon: seller name and ID, rating, feedback counts, business name and address, and the marketplace they operate on.",
    datasetId: "gd_lhotzucw1etoe5iw1k",
    endpoints: [{ name: "Collect by URL", desc: "Pass a seller storefront URL." }],
    responseTime: "~15s per input",
    inputs: [
      { name: "url", type: "string", required: true, example: "https://www.amazon.com/sp?seller=A2QNYS4JLVRNDY", description: "Amazon seller storefront URL." },
    ],
    dictionary: [
      { name: "seller_id", description: "Unique identifier for the seller", type: "Text" },
      { name: "seller_name", description: "Seller display name", type: "Text" },
      { name: "business_name", description: "Registered business name", type: "Text" },
      { name: "business_address", description: "Registered business address", type: "Text" },
      { name: "rating", description: "Seller rating", type: "Number" },
      { name: "ratings_count", description: "Number of seller ratings", type: "Number" },
      { name: "feedback_percentage", description: "Positive feedback percentage", type: "Number" },
      { name: "country", description: "Country the seller operates from", type: "Text" },
      { name: "url", description: "Seller storefront URL", type: "Url" },
    ],
    sampleOutput: {
      seller_id: "A2QNYS4JLVRNDY",
      seller_name: "Kiseng",
      business_name: "KISENG TRADING CO., LTD",
      rating: 4.6,
      ratings_count: 1284,
      feedback_percentage: 96,
      country: "CN",
    },
  },
  {
    slug: "amazon-global-dataset",
    name: "Amazon Global Dataset",
    domain: "amazon.com",
    category: "E-commerce",
    icon: "◍",
    color: "#FF9900",
    tagline: "Products across all Amazon marketplaces, by brand, category or seller.",
    description:
      "The global Amazon product dataset. Collect by URL, or discover products by brand, category, keyword or seller across Amazon's international marketplaces.",
    datasetId: "gd_lwhideng15g8jg63s7",
    endpoints: [
      { name: "Collect by URL", desc: "Pass product URLs directly." },
      { name: "Discover by brand", desc: "Expand a brand into its catalog." },
      { name: "Discover by category URL", desc: "Expand a category listing into products." },
      { name: "Discover by keywords", desc: "Run search terms and collect the results." },
      { name: "Discover by seller", desc: "Expand a seller storefront into products." },
    ],
    responseTime: "~20s per input",
    inputs: [
      { name: "url", type: "string", required: true, example: "https://www.amazon.de/dp/B0CX23V2ZK", description: "Amazon product URL on any marketplace." },
    ],
    dictionary: [
      { name: "title", description: "Product title", type: "Text" },
      { name: "brand", description: "Product brand", type: "Text" },
      { name: "asin", description: "Product ASIN", type: "Text" },
      { name: "final_price", description: "Final price of the product", type: "Price" },
      { name: "currency", description: "Currency of the product", type: "Text" },
      { name: "availability", description: "Product availability", type: "Text" },
      { name: "rating", description: "Average product rating", type: "Number" },
      { name: "reviews_count", description: "Number of reviews", type: "Number" },
      { name: "categories", description: "Product categories", type: "Array" },
      { name: "seller_name", description: "Seller name", type: "Text" },
      { name: "domain", description: "Amazon marketplace domain", type: "Url" },
    ],
    sampleOutput: {
      title: "Anker Portable Charger, 10000mAh Power Bank",
      brand: "Anker",
      asin: "B0CX23V2ZK",
      final_price: 21.99,
      currency: "EUR",
      availability: "In Stock",
      rating: 4.6,
      reviews_count: 18432,
      domain: "https://www.amazon.de",
    },
  },
  {
    slug: "linkedin-profile",
    name: "LinkedIn Profile",
    domain: "linkedin.com",
    category: "Business (B2B)",
    icon: "in",
    color: "#0A66C2",
    tagline: "Public profile: role, company, experience and skills.",
    description:
      "Turn a public LinkedIn profile URL into structured JSON: current position, past experience, education, and skills. Publicly available data only, no login-gated fields.",
    popular: true,
    datasetId: "gd_l1viktl72bvl7bjuj0",
    mcp: { tool: "web_data_linkedin_person_profile", group: "social" },
    endpoints: [
      { name: "Collect by URL", desc: "Pass public profile URLs directly." },
      { name: "Discover by name", desc: "Resolve profiles from a person and company name." },
    ],
    responseTime: "~8s per input",
    benchmark: {
      rank: "#1 LinkedIn scraper",
      note: "Ranked first for large-scale collection across 9,000 requests covering posts, profiles and jobs.",
      source: "AIMultiple, 2026",
      url: "https://research.aimultiple.com/linkedin-scrapers/",
    },
    inputs: [
      { name: "url", type: "string", required: true, example: "https://www.linkedin.com/in/satyanadella", description: "Public LinkedIn profile URL." },
    ],
    dictionary: [
      { name: "name", description: "Full name on the profile", type: "Text" },
      { name: "headline", description: "Profile headline", type: "Text" },
      { name: "location", description: "Stated location", type: "Text" },
      { name: "current_company", description: "Current employer", type: "Text" },
      { name: "current_title", description: "Current job title", type: "Text" },
      { name: "experience", description: "Past positions with company, title and dates", type: "Array" },
      { name: "education", description: "Schools, degrees and dates", type: "Array" },
      { name: "skills", description: "Listed skills", type: "Array" },
      { name: "followers", description: "Follower count", type: "Number" },
      { name: "url", description: "Profile URL", type: "Text" },
    ],
    sampleOutput: {
      name: "Satya Nadella",
      headline: "Chairman and CEO at Microsoft",
      location: "Redmond, Washington",
      current_company: "Microsoft",
      current_title: "Chairman and CEO",
      followers: 11200000,
      skills: ["Leadership", "Cloud Computing", "Strategy"],
    },
  },
  {
    slug: "instagram-profile",
    name: "Instagram Profile",
    domain: "instagram.com",
    category: "Social Media",
    icon: "◎",
    color: "#E1306C",
    tagline: "Follower counts, bio and recent public posts.",
    description:
      "Collect a public Instagram profile: follower and following counts, bio, verification, and the most recent public posts with engagement metrics.",
    popular: true,
    datasetId: "gd_l1vikfch901nx3by4",
    mcp: { tool: "web_data_instagram_profiles", group: "social" },
    endpoints: [
      { name: "Collect by URL", desc: "Pass public profile URLs directly." },
      { name: "Discover posts by URL", desc: "Expand a profile into its recent posts." },
    ],
    responseTime: "~7s per input",
    benchmark: {
      rank: "#1 Instagram scraper",
      note: "Fastest response time and best cost-efficiency at scale on one of the hardest sites to unblock.",
      source: "AIMultiple, 2026",
      url: "https://research.aimultiple.com/instagram-scraping/",
    },
    inputs: [
      { name: "url", type: "string", required: true, example: "https://www.instagram.com/nasa", description: "Public Instagram profile URL." },
      { name: "posts_limit", type: "number", required: false, example: "12", description: "Number of recent posts to include." },
    ],
    dictionary: [
      { name: "username", description: "Account handle", type: "Text" },
      { name: "full_name", description: "Display name", type: "Text" },
      { name: "followers", description: "Follower count", type: "Number" },
      { name: "following", description: "Following count", type: "Number" },
      { name: "posts_count", description: "Total public posts", type: "Number" },
      { name: "is_verified", description: "Whether the account is verified", type: "Boolean" },
      { name: "biography", description: "Profile bio text", type: "Text" },
      { name: "profile_image", description: "Profile picture URL", type: "Text" },
      { name: "recent_posts", description: "Recent posts with captions and engagement", type: "Array" },
    ],
    sampleOutput: {
      username: "nasa",
      full_name: "NASA",
      followers: 97400000,
      following: 78,
      posts_count: 4123,
      is_verified: true,
      biography: "Explore the universe and discover our home planet.",
    },
  },
  {
    slug: "google-maps",
    name: "Google Maps",
    domain: "google.com",
    category: "Search",
    icon: "▲",
    color: "#4285F4",
    tagline: "Business listings: name, address, phone, rating and coordinates.",
    description:
      "Collect full Google Maps business listings. Pass a place URL, or discover places by location, CID or place_id. Returns name, category, address, phone, rating, review count, hours and coordinates.",
    popular: true,
    datasetId: "gd_m8ebnr0q2qlklc02fz",
    endpoints: [
      { name: "Collect by URL", desc: "Resolve a single Maps place URL." },
      { name: "Discover by location", desc: "Find places within a location." },
      { name: "Discover by cid", desc: "Resolve places from Google CID values." },
      { name: "Discover by place_id", desc: "Resolve places from Google place IDs." },
    ],
    responseTime: "~10s per input",
    benchmark: {
      rank: "#1 Google Maps scraper",
      note: "Ranked first across 100 searches and 4,000 business listings in 10 categories.",
      source: "AIMultiple, 2026",
      url: "https://research.aimultiple.com/google-maps-scraper/",
    },
    inputs: [
      { name: "url", type: "string", required: true, example: "https://www.google.com/maps/place/Pizza+Inn+Magdeburg", description: "Google Maps place URL." },
    ],
    dictionary: [
      { name: "name", description: "Business name", type: "Text" },
      { name: "category", description: "Primary business category", type: "Text" },
      { name: "address", description: "Full street address", type: "Text" },
      { name: "phone", description: "Listed phone number", type: "Text" },
      { name: "rating", description: "Average star rating", type: "Number" },
      { name: "reviews_count", description: "Number of reviews", type: "Number" },
      { name: "hours", description: "Opening hours by day", type: "Array" },
      { name: "latitude", description: "Latitude coordinate", type: "Number" },
      { name: "longitude", description: "Longitude coordinate", type: "Number" },
      { name: "website", description: "Business website URL", type: "Url" },
      { name: "place_id", description: "Google place identifier", type: "Text" },
      { name: "cid", description: "Google CID for the listing", type: "Text" },
    ],
    sampleOutput: {
      name: "Radio Coffee & Beer",
      category: "Coffee shop",
      address: "3504 Manchaca Rd, Austin, TX 78704",
      phone: "+1 512-394-7844",
      rating: 4.6,
      reviews_count: 2871,
      latitude: 30.2384,
      longitude: -97.7936,
    },
  },
  {
    slug: "google-maps-reviews",
    name: "Google Maps Reviews",
    domain: "google.com",
    category: "Search",
    icon: "★",
    color: "#4285F4",
    tagline: "Review text, rating, author and date for any Maps listing.",
    description:
      "Collect the review stream for a Google Maps business: rating, review text, author, date and owner responses. Accepts an optional day limit to bound how far back to collect.",
    datasetId: "gd_luzfs1dn2oa0teb81",
    mcp: { tool: "web_data_google_maps_reviews", group: "business" },
    endpoints: [{ name: "Collect by URL", desc: "Pass a Maps place URL to collect its reviews." }],
    responseTime: "~12s per input",
    inputs: [
      { name: "url", type: "string", required: true, example: "https://www.google.com/maps/place/Radio+Coffee+%26+Beer", description: "Google Maps place URL." },
      { name: "days_limit", type: "number", required: false, example: "3", description: "How many days back to collect reviews." },
    ],
    dictionary: [
      { name: "review_id", description: "Unique identifier for the review", type: "Text" },
      { name: "reviewer_name", description: "Review author name", type: "Text" },
      { name: "rating", description: "Star rating given", type: "Number" },
      { name: "review_text", description: "Body of the review", type: "Text" },
      { name: "review_date", description: "When the review was posted", type: "Date" },
      { name: "owner_response", description: "Business reply, if any", type: "Text" },
      { name: "reviewer_reviews_count", description: "Total reviews written by this author", type: "Number" },
      { name: "place_name", description: "Business the review belongs to", type: "Text" },
      { name: "place_id", description: "Google place identifier", type: "Text" },
    ],
    sampleOutput: {
      review_id: "ChdDSUhNMG9nS0VJQ0FnSUNs",
      reviewer_name: "Dana W.",
      rating: 5,
      review_text: "Great patio, excellent cold brew, dog friendly.",
      review_date: "2026-06-14",
      place_name: "Radio Coffee & Beer",
    },
  },
  {
    slug: "google-maps-images",
    name: "Google Maps Images",
    domain: "google.com",
    category: "Search",
    icon: "▣",
    color: "#4285F4",
    tagline: "Business listing photos and their metadata.",
    description:
      "Collect the images published on a Google Maps business listing, with source and caption metadata. Useful for local SEO audits and listing quality checks.",
    datasetId: "gd_min8y25y1z5op1eska",
    endpoints: [{ name: "Collect by URL", desc: "Pass a Maps place URL to collect its images." }],
    responseTime: "~10s per input",
    inputs: [
      { name: "url", type: "string", required: true, example: "https://www.google.com/maps/place/Radio+Coffee+%26+Beer", description: "Google Maps place URL." },
    ],
    dictionary: [
      { name: "image_url", description: "Direct URL to the image", type: "Url" },
      { name: "caption", description: "Image caption, if present", type: "Text" },
      { name: "uploaded_by", description: "Whether the image came from the owner or a user", type: "Text" },
      { name: "place_name", description: "Business the image belongs to", type: "Text" },
      { name: "place_id", description: "Google place identifier", type: "Text" },
    ],
    sampleOutput: {
      image_url: "https://lh3.googleusercontent.com/places/example",
      caption: "Patio seating",
      uploaded_by: "owner",
      place_name: "Radio Coffee & Beer",
    },
  },
  {
    slug: "tiktok-posts",
    name: "TikTok Posts",
    domain: "tiktok.com",
    category: "Social Media",
    icon: "♪",
    color: "#25F4EE",
    tagline: "Video metadata, views, likes and hashtags by profile.",
    description:
      "Collect public TikTok posts for a profile or hashtag: caption, play count, likes, comments, shares, music, and hashtags. Ideal for trend and creator analysis.",
    datasetId: "gd_lu702nij2f790tmv9h",
    mcp: { tool: "web_data_tiktok_posts", group: "social" },
    endpoints: [
      { name: "Collect by URL", desc: "Pass post or profile URLs directly." },
      { name: "Discover by keyword", desc: "Search a term and collect matching posts." },
      { name: "Discover by profile URL", desc: "Expand a profile into its posts." },
    ],
    responseTime: "~9s per input",
    benchmark: {
      rank: "#1 TikTok scraper",
      note: "Highest success rate and richest metadata, tested on 500 video URLs per provider.",
      source: "AIMultiple, 2026",
      url: "https://research.aimultiple.com/tiktok-scraping/",
    },
    inputs: [
      { name: "url", type: "string", required: true, example: "https://www.tiktok.com/@khaby.lame", description: "Public profile or hashtag URL." },
      { name: "posts_limit", type: "number", required: false, example: "20", description: "Max posts to collect." },
    ],
    dictionary: [
      { name: "post_id", description: "Unique post identifier", type: "Text" },
      { name: "author", description: "Creator handle", type: "Text" },
      { name: "caption", description: "Post caption text", type: "Text" },
      { name: "play_count", description: "Number of plays", type: "Number" },
      { name: "likes", description: "Number of likes", type: "Number" },
      { name: "comments", description: "Number of comments", type: "Number" },
      { name: "shares", description: "Number of shares", type: "Number" },
      { name: "hashtags", description: "Hashtags used in the post", type: "Array" },
      { name: "music", description: "Track name and author", type: "Text" },
      { name: "create_time", description: "Publication timestamp", type: "Date" },
    ],
    sampleOutput: {
      post_id: "7361029384756",
      author: "khaby.lame",
      caption: "When it's too easy 😂 #learnfromkhaby",
      play_count: 41200000,
      likes: 3800000,
      comments: 21400,
      shares: 190200,
      hashtags: ["learnfromkhaby", "comedy"],
    },
  },
  {
    slug: "zillow-listings",
    name: "Zillow Listings",
    domain: "zillow.com",
    category: "Real Estate",
    icon: "⌂",
    color: "#006AFF",
    tagline: "Property price, beds, baths, sqft and listing status.",
    description:
      "Collect for-sale and for-rent property listings from Zillow: price, beds, baths, square footage, lot size, year built, listing status, and agent details.",
    datasetId: "gd_lfqkr8wm13ixtbd8f5",
    mcp: { tool: "web_data_zillow_properties_listing", group: "business" },
    endpoints: [
      { name: "Collect by URL", desc: "Pass property detail URLs directly." },
      { name: "Discover by keyword", desc: "Expand a search or area into listings." },
    ],
    responseTime: "~8s per input",
    inputs: [
      { name: "url", type: "string", required: true, example: "https://www.zillow.com/homedetails/12345_zpid/", description: "Property detail or search results URL." },
    ],
    dictionary: [
      { name: "zpid", description: "Zillow property identifier", type: "Text" },
      { name: "address", description: "Full property address", type: "Text" },
      { name: "price", description: "Listing price", type: "Price" },
      { name: "beds", description: "Number of bedrooms", type: "Number" },
      { name: "baths", description: "Number of bathrooms", type: "Number" },
      { name: "living_area_sqft", description: "Interior living area in square feet", type: "Number" },
      { name: "lot_size", description: "Lot size", type: "Number" },
      { name: "year_built", description: "Year the property was built", type: "Number" },
      { name: "home_status", description: "Listing status, for example FOR_SALE", type: "Text" },
      { name: "zestimate", description: "Zillow estimated value", type: "Price" },
    ],
    sampleOutput: {
      zpid: "12345",
      address: "742 Evergreen Terrace, Springfield, IL 62704",
      price: 389000,
      beds: 4,
      baths: 2,
      living_area_sqft: 2100,
      year_built: 1994,
      home_status: "FOR_SALE",
      zestimate: 402100,
    },
  },
];

export function getTemplate(slug: string) {
  return templates.find((t) => t.slug === slug);
}

/**
 * Related scrapers, ranked by search intent: same site first (someone on
 * "Amazon Product" most likely wants "Amazon Reviews"), then same category,
 * then anything else popular.
 */
export function relatedTemplates(t: Template, limit = 4) {
  const others = templates.filter((x) => x.slug !== t.slug);
  const sameSite = others.filter((x) => x.domain === t.domain);
  const sameCategory = others.filter(
    (x) => x.domain !== t.domain && x.category === t.category
  );
  const rest = others.filter(
    (x) => x.domain !== t.domain && x.category !== t.category
  );
  return [...sameSite, ...sameCategory, ...rest].slice(0, limit);
}
