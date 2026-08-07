import { brandColor, brandLetter } from "@/lib/brand-colors";

type DomainMarkProps = {
  domain: string;
  /** Visual size variant — scraper cards vs domain cards */
  size?: "scraper" | "domain";
  className?: string;
  color?: string;
};

/**
 * Letter + brand-color mark used on scraper and domain cards.
 * No logo images — matches /amazon, /zillow hub card treatment.
 */
export default function DomainMark({
  domain,
  size = "scraper",
  className = "",
  color,
}: DomainMarkProps) {
  const bc = color || brandColor(domain);
  const letter = brandLetter(domain);
  const iconClass = size === "domain" ? "cc-icon" : "fc-icon";
  const letterClass = size === "domain" ? "cc-icon-letter" : "fc-icon-letter";

  return (
    <div
      className={`${iconClass} ${className}`.trim()}
      style={{
        background: `linear-gradient(135deg, ${bc}22, ${bc}0a)`,
        borderColor: `${bc}33`,
      }}
      aria-hidden="true"
    >
      <span className={letterClass} style={{ color: bc }}>
        {letter}
      </span>
    </div>
  );
}
