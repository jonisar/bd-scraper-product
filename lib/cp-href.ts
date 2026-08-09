import { templates } from "@/lib/templates";
import type { Template } from "@/lib/templates";

const CP_BASE = "https://brightdata.com/cp/datasets/configure";
const CP_DATASETS = "https://brightdata.com/cp/datasets";

/**
 * Map of known ID prefixes to template slugs.
 * Handles cases where multiple scraper card IDs map to the same dataset
 * (e.g., amazon-product-bestsellers, amazon-product-category → amazon-product).
 */
const ID_PREFIX_MAP: [string, string][] = [
  ["amazon-product", "amazon-product"],
  ["amazon-global", "amazon-global-dataset"],
  ["amazon-search", "amazon-search"],
  ["amazon-reviews", "amazon-reviews"],
  ["amazon-sellers", "amazon-sellers"],
  ["linkedin", "linkedin-profile"],
  ["instagram", "instagram-profile"],
  ["google-maps-reviews", "google-maps-reviews"],
  ["google-maps-images", "google-maps-images"],
  ["google-maps", "google-maps"],
  ["tiktok", "tiktok-posts"],
  ["zillow", "zillow-listings"],
];

function datasetIdForId(id: string): string | undefined {
  for (const [prefix, slug] of ID_PREFIX_MAP) {
    if (id === prefix || id.startsWith(prefix + "-")) {
      const t = templates.find((tpl) => tpl.slug === slug);
      if (t) return t.datasetId;
    }
  }
  return undefined;
}

/**
 * Resolve any scraper-like object to its Bright Data control panel URL.
 * Deep-links to the specific dataset when a match is found.
 * Falls back to the generic datasets page otherwise.
 */
export function cpHref(s: { slug?: string; domain?: string; id?: string }): string {
  if (s.id) {
    const dsId = datasetIdForId(s.id);
    if (dsId) return cpDatasetUrl(dsId);
  }

  if (s.slug) {
    const t = templates.find((tpl) => tpl.slug === s.slug);
    if (t) return cpDatasetUrl(t.datasetId);
  }

  if (s.domain) {
    const byDomain =
      templates.find((t) => t.domain === s.domain && t.popular) ||
      templates.find((t) => t.domain === s.domain);
    if (byDomain) return cpDatasetUrl(byDomain.datasetId);
  }

  return CP_DATASETS;
}

/** Build the CP configure URL for a known dataset ID. */
export function cpDatasetUrl(datasetId: string): string {
  return `${CP_BASE}?dataset_id=${datasetId}`;
}

/** Resolve a template to its CP URL (always has datasetId). */
export function cpHrefForTemplate(t: Template): string {
  return cpDatasetUrl(t.datasetId);
}
