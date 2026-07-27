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
        text: "The Amazon Scraper API is a powerful tool designed to automate data extraction from Amazon, allowing users to efficiently gather and process large volumes of data for various use cases.",
      },
    },
    {
      "@type": "Question",
      name: "How does the Amazon Scraper API work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Amazon Scraper API works by sending automated requests to Amazon, extracting the necessary data points, and delivering them in a structured format (JSON, CSV, or NDJSON). This process ensures accurate and quick data collection.",
      },
    },
    {
      "@type": "Question",
      name: "Is the Amazon Scraper API compliant with data protection regulations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the Amazon Scraper API is designed to comply with data protection regulations, including GDPR and CCPA. It ensures that all data collection activities are performed ethically and legally.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use the Amazon Scraper API for competitive analysis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. The Amazon Scraper API is ideal for competitive analysis, allowing you to gather insights into competitors' pricing, product selection, bestseller rankings, and strategies.",
      },
    },
    {
      "@type": "Question",
      name: "How can I integrate the Amazon Scraper API with my existing systems?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Amazon Scraper API offers seamless integration with various platforms and tools. Use it with your existing data pipelines, CRM systems, BI tools, or AI models. Delivery via API, webhook, Amazon S3, Google Cloud Storage, Snowflake, and more.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a free tier available for the Amazon Scraper API?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every Bright Data account includes 5,000 free records per month — no credit card required. Credits renew on the 1st of each month, and you can start making API calls immediately after signing up.",
      },
    },
    {
      "@type": "Question",
      name: "What happens when my free credits run out?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If you have pre-deposited funds, usage continues seamlessly at standard PAYG rates ($1.50/1K records). If not, requests return an error until you add funds or credits renew on the 1st of the following month. Enable auto-recharge at brightdata.com/cp/billing/settings.",
      },
    },
    {
      "@type": "Question",
      name: "What are the usage limits for the Amazon Scraper API?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There are no specific usage limits. The API supports unlimited concurrency and bulk requests of up to 5,000 URLs, giving you the flexibility to scale as needed.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide support for the Amazon Scraper API?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Bright Data offers 24/7 dedicated support. The support team is available to help with any questions or issues via chat, email, or phone.",
      },
    },
    {
      "@type": "Question",
      name: "What delivery methods are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Amazon S3, Google Cloud Storage, Google PubSub, Microsoft Azure Storage, Snowflake, and SFTP.",
      },
    },
    {
      "@type": "Question",
      name: "What file formats are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JSON, NDJSON, JSON Lines, CSV, and .gz files (compressed).",
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
