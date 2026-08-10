type DatasetCtaBannerProps = {
  /** Domain/vertical name — e.g. "Amazon", "Social Media". Omit for generic copy. */
  name?: string;
  /** Direct link to the dataset page. Falls back to the general datasets hub. */
  href?: string;
};

export default function DatasetCtaBanner({
  name,
  href = "https://brightdata.com/products/datasets",
}: DatasetCtaBannerProps) {
  const article = name
    ? /^[aeiou]/i.test(name) ? "an" : "a"
    : "a";

  return (
    <div className="container dataset-cta-wrap">
      <div className="dataset-cta-banner">
        <p>
          {name
            ? `Just want ${name} data? Skip scraping.`
            : "Just want the data? Skip scraping."}
        </p>
        <p>
          Purchase {article}{" "}
          <a href={href} target="_blank" rel="noopener noreferrer">
            {name ? `${name} dataset` : "ready-made dataset"}
          </a>
        </p>
      </div>
    </div>
  );
}
