const SIGNUP = "https://brightdata.com/cp/start";

export default function DiscountBanner() {
  return (
    <a
      href={SIGNUP}
      target="_blank"
      rel="noopener noreferrer"
      className="discount-banner"
    >
      <span className="discount-banner-emoji" aria-hidden="true">
        🎉
      </span>
      <span className="discount-banner-text">
        Get 25% off on Scraper API for 3 months. Use code <strong>APIS25</strong> at
        checkout.
      </span>
      <span className="discount-banner-cta">Start now →</span>
    </a>
  );
}
