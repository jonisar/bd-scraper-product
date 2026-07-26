import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Amazon Product Scraper · API in Python · Bright Data",
  description:
    "Use this Amazon scraper to collect data based on URL and country from the Amazon website. Extract product information without using the Amazon API, including reviews, prices, descriptions, and Amazon Standard Identification Numbers (ASINs). Download data in various structured formats.",
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the Amazon Scraper API?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Amazon Scraper API is a pre-built, managed web scraping tool from Bright Data that extracts structured product data from Amazon at scale. Pass product URLs, category pages, or search keywords — get back clean JSON with prices, reviews, stock status, seller details, and more.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a free tier available for the Amazon Scraper API?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every Bright Data account includes 5,000 free records per month — no credit card required. Credits renew on the 1st of each month. Pay-as-you-go starts at $1.50/1K records, with Scale plans from $1.30/1K.",
      },
    },
    {
      "@type": "Question",
      name: "Is it legal to scrape Amazon?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bright Data only collects publicly available data. All scraping is performed in compliance with GDPR, CCPA, and SEC regulations. A dedicated compliance team ensures ethical data collection practices.",
      },
    },
    {
      "@type": "Question",
      name: "What delivery methods are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Results can be delivered via API response, webhook, Amazon S3, Google Cloud Storage, Google PubSub, Microsoft Azure Storage, Snowflake, and SFTP. Supported formats include JSON, NDJSON, CSV, and .gz (compressed).",
      },
    },
    {
      "@type": "Question",
      name: "What data can I extract from Amazon?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can extract product titles, prices, ASINs, brands, seller info, stock availability, review counts, star ratings, category paths, product images, features, and delivery estimates.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
