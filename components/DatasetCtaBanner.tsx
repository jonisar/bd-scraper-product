type DatasetCtaBannerProps = {
  /** Domain/vertical name — e.g. "Amazon", "Social Media". Omit for generic copy. */
  name?: string;
  /** Direct link to the dataset page. Falls back to the general datasets hub. */
  href?: string;
};

const DATASETS_BASE = "https://brightdata.com/products/datasets";

const DATASET_SLUGS: Record<string, string> = {
  Amazon: "amazon",
  LinkedIn: "linkedin",
  Instagram: "instagram",
  TikTok: "tiktok",
  Facebook: "facebook",
  YouTube: "youtube",
  X: "x",
  Walmart: "walmart",
  Indeed: "indeed",
  Glassdoor: "glassdoor",
  Zillow: "zillow",
  Crunchbase: "crunchbase",
  "Social Media": "social-media",
  "E-commerce": "ecommerce",
  "Real Estate": "real-estate",
};

export default function DatasetCtaBanner({
  name,
  href,
}: DatasetCtaBannerProps) {
  const resolvedHref =
    href ||
    (name && DATASET_SLUGS[name]
      ? `${DATASETS_BASE}/${DATASET_SLUGS[name]}`
      : DATASETS_BASE);

  const article = name
    ? /^[aeiou]/i.test(name) ? "an" : "a"
    : "a";

  return (
    <div className="container dataset-cta-wrap">
      <div className="dataset-cta-banner">
        <p className="dataset-cta-line1">
          {name
            ? `Just want ${name} data? Skip scraping.`
            : "Just want the data? Skip scraping."}
        </p>
        <p className="dataset-cta-line2">
          Purchase {article}{" "}
          <a href={resolvedHref} target="_blank" rel="noopener noreferrer">
            {name ? `${name} dataset` : "dataset"}
          </a>
        </p>
      </div>
    </div>
  );
}
