import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0f1e",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Web Scraping API | Bright Data",
    template: "%s | Bright Data",
  },
  description:
    "The most reliable Web Scraping API. 1,300+ production-ready scrapers with automatic proxy rotation, anti-bot bypass, and JavaScript rendering.",
  metadataBase: new URL("https://brightdata.com"),
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Bright Data",
    locale: "en_US",
    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "Bright Data Web Scraping API",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@brightdata",
    creator: "@brightdata",
  },
  alternates: {
    canonical: "https://brightdata.com/products/web-scraper",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://brightdata.com#website",
  name: "Bright Data",
  url: "https://brightdata.com",
  publisher: { "@id": "https://brightdata.com#organization" },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://brightdata.com#organization",
  name: "Bright Data",
  url: "https://brightdata.com",
  logo: "https://brightdata.com/images/bright-data-logo.svg",
  sameAs: [
    "https://twitter.com/brightdata",
    "https://www.linkedin.com/company/bright-data/",
    "https://github.com/niceprogrammer",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
