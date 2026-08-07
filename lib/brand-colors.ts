/** Brand accent colors keyed by domain (used for letter marks on cards). */
export const BRAND_COLORS: Record<string, string> = {
  "amazon.com": "#FF9900",
  "linkedin.com": "#0A66C2",
  "instagram.com": "#E4405F",
  "tiktok.com": "#00F2EA",
  "google.com/maps": "#34A853",
  "google.com": "#4285F4",
  "play.google.com": "#01875F",
  "zillow.com": "#006AFF",
  "x.com": "#A8B3BD",
  "twitter.com": "#A8B3BD",
  "facebook.com": "#1877F2",
  "youtube.com": "#FF0000",
  "crunchbase.com": "#0288D1",
  "indeed.com": "#2164F3",
  "walmart.com": "#0071CE",
  "reddit.com": "#FF4500",
  "glassdoor.com": "#0CAA41",
  "booking.com": "#003580",
  "airbnb.com": "#FF5A5F",
  "finance.yahoo.com": "#6001D2",
  "ebay.com": "#E53238",
  "etsy.com": "#F1641E",
  "shopify.com": "#96BF48",
  "tripadvisor.com": "#34E0A1",
  "pinterest.com": "#E60023",
  "yelp.com": "#D32323",
  "trustpilot.com": "#00B67A",
  "target.com": "#CC0000",
  "bestbuy.com": "#0046BE",
  "twitch.tv": "#9146FF",
  "discord.com": "#5865F2",
  "quora.com": "#B92B27",
  "medium.com": "#A8B3BD",
  "expedia.com": "#FFDC00",
  "redfin.com": "#A02021",
  "realtor.com": "#D92228",
  "apollo.io": "#6B4FBB",
  "g2.com": "#FF492C",
  "upwork.com": "#14A800",
  "fiverr.com": "#1DBF73",
  "coinmarketcap.com": "#17C784",
  "bloomberg.com": "#5E00FF",
  "openai.com": "#10A37F",
  "homedepot.com": "#F96302",
  "zoopla.co.uk": "#7B0099",
  "zonaprop.com.ar": "#FF6611",
  "inmuebles24.com": "#FF6611",
  "metrocuadrado.com": "#004CFF",
  "agoda.com": "#5392F7",
  "trip.com": "#287DFA",
  "aliexpress.com": "#E43225",
  "shein.com": "#000000",
  "temu.com": "#FB7701",
  "shopee.com": "#EE4D2D",
  "nike.com": "#111111",
  "stockx.com": "#006340",
  "wayfair.com": "#7B2D8B",
  "costco.com": "#E31837",
  "zara.com": "#000000",
  "threads.net": "#A8B3BD",
  "telegram.org": "#0088CC",
  "snapchat.com": "#FFFC00",
  "bing.com": "#008373",
  "duckduckgo.com": "#DE5833",
  "zoominfo.com": "#5849BC",
  "clutch.co": "#FF3D2E",
  "wellfound.com": "#A8B3BD",
  "pitchbook.com": "#003B5C",
  "investing.com": "#143E5B",
  "robinhood.com": "#00C805",
  "reuters.com": "#FF8000",
  "techcrunch.com": "#0A9E01",
  "bbc.com": "#BB1919",
  "cnn.com": "#CC0000",
  "wikipedia.org": "#A8B3BD",
  "substack.com": "#FF6719",
  "producthunt.com": "#DA552F",
  "news.ycombinator.com": "#FF6600",
  "capterra.com": "#FF9D28",
  "trustradius.com": "#333F48",
  "ziprecruiter.com": "#25C764",
  "monster.com": "#6E45A5",
  "dice.com": "#EB1C26",
  "careerbuilder.com": "#0075CF",
  "hotels.com": "#D32F2F",
  "kayak.com": "#FF690F",
  "skyscanner.com": "#0770E3",
  "vrbo.com": "#3D67FF",
  "rightmove.co.uk": "#00DEB6",
  "trulia.com": "#4EA85E",
};

export function brandColor(domain: string): string {
  const d = domain.toLowerCase().replace(/^www\./, "");
  if (BRAND_COLORS[d]) return BRAND_COLORS[d];
  for (const [key, color] of Object.entries(BRAND_COLORS)) {
    if (d === key || d.endsWith("." + key) || d.startsWith(key)) return color;
  }
  const root = d.split(".")[0];
  for (const [key, color] of Object.entries(BRAND_COLORS)) {
    if (key.startsWith(root)) return color;
  }
  return "#6ea0ff";
}

/** First letter of the domain root for card marks (e.g. amazon.com → A, google.com/maps → G). */
export function brandLetter(domain: string): string {
  const d = domain.toLowerCase().replace(/^www\./, "");
  const root = d.split(/[./]/)[0] || d;
  return root.charAt(0).toUpperCase();
}
