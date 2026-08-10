"use client";

import { useState, type ReactNode } from "react";

type Lang = "cURL" | "Python" | "Node.js";

type TokKind = "bash" | "python" | "js" | "json";

const TOKEN_RES: Record<TokKind, RegExp> = {
  bash: /(#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\bcurl\b|\bPOST\b|\s-{1,2}[A-Za-z][\w-]*)|(\b\d+(?:\.\d+)?\b)/g,
  python: /(#[^\n]*)|("(?:[^"\\]|\\.)*")|(\bimport\b|\bprint\b|\brequests\b)|(\b\d+(?:\.\d+)?\b)/g,
  js: /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|(\bconst\b|\bawait\b|\bfetch\b|\bconsole\b|\bJSON\b|\bmethod\b)|(\b\d+(?:\.\d+)?\b)/g,
  json: /("(?:[^"\\]|\\.)*")(\s*:)|("(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?\b)|(\btrue\b|\bfalse\b|\bnull\b)/g,
};

const GROUP_CLASSES: Record<TokKind, (string | null)[]> = {
  bash: ["cx-com", "cx-str", "cx-kw", "cx-num"],
  python: ["cx-com", "cx-str", "cx-kw", "cx-num"],
  js: ["cx-com", "cx-str", "cx-kw", "cx-num"],
  json: ["cx-key", null, "cx-str", "cx-num", "cx-bool"],
};

function Highlighted({ code, kind }: { code: string; kind: TokKind }) {
  const re = new RegExp(TOKEN_RES[kind].source, "g");
  const classes = GROUP_CLASSES[kind];
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code)) !== null) {
    if (m.index > last) out.push(code.slice(last, m.index));
    for (let g = 1; g < m.length; g++) {
      if (m[g] === undefined) continue;
      const cls = classes[g - 1];
      out.push(cls ? <span key={out.length} className={cls}>{m[g]}</span> : m[g]);
    }
    last = m.index + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return <>{out}</>;
}

/** Real dataset IDs from lib/templates.ts; sample URLs are public canonical examples. */
const TARGETS = [
  {
    name: "Amazon",
    datasetId: "gd_l1vijqt9jfj7olije",
    url: "https://www.amazon.com/Quencher-FlowState-Stainless-Insulated-Smoothie/dp/B0CRMZHDG8",
    printFields: ["title", "final_price"],
    domain: "amazon.com",
    response: `[
  {
    "title": "STANLEY Quencher H2.0 Flow State Tumbler, 40 oz, Fuchsia | Handle and Straw | 3-…",
    "seller_name": "Avrix Brands",
    "brand": "STANLEY",
    "description": "Constructed of recycled stainless steel for sustainable sipping, our 40 oz Quenc…",
    "initial_price": 45,
    "currency": "USD",
    "availability": "In Stock",
    "reviews_count": 203567,
    "categories": ["Home & Kitchen", "Kitchen & Dining", "Storage & Organization", "Thermoses", "…"],
    "parent_asin": "B0DG5KQ24H",
    "asin": "B0CRMZHDG8",
    "buybox_seller": "Avrix Brands",
    "number_of_sellers": 1,
    "root_bs_rank": 8,
    "answered_questions": 0,
    "domain": "https://www.amazon.com/",
    "images_count": 10,
    "url": "https://www.amazon.com/STANLEY-Quencher-State-Tumbler-Fuchsia/dp/B0CRMZHDG8?th=1…",
    "video_count": 1,
    "image_url": "https://m.media-amazon.com/images/I/61Q4eGZWFSL._AC_SL1500_.jpg",
    "item_weight": "1.4 pounds",
    "rating": 4.7,
    "product_dimensions": "10\"W x 13.25\"H",
    "seller_id": "A2XPYBBX7QV442",
    "image": "https://m.media-amazon.com/images/I/61Q4eGZWFSL._AC_SL1500_.jpg",
    "discount": "-13%",
    "model_number": "100000003926",
    "manufacturer": "Stanley",
    "department": "Home & Kitchen",
    "plus_content": true,
    "upc": "041604394331",
    "video": true,
    "final_price": 38.99,
    "variations": ["…"],
    "delivery": ["FREE delivery Saturday, August 15", "…"],
    "features": ["…"],
    "buybox_prices": {"final_price": 38.99, "initial_price": 45, "discount": "-13%", "unit_price": null},
    "bought_past_month": 400,
    "is_available": true,
    "root_bs_category": "Kitchen & Dining",
    "bs_category": "Insulated Tumblers",
    "bs_rank": 2,
    "subcategory_rank": [{"subcategory_name": "Insulated Tumblers", "subcategory_rank": 2}],
    "amazon_choice": false,
    "images": ["https://m.media-amazon.com/images/I/61Q4eGZWFSL._AC_SL1500_.jpg", "…"],
    "product_details": [{"type": "Brand Name", "value": "STANLEY"}, "…"],
    "prices_breakdown": {"typical_price": null, "list_price": 45, "deal_type": null},
    "from_the_brand": ["…"],
    "product_description": ["…"],
    "seller_url": "https://www.amazon.com/sp?ie=UTF8&seller=A2XPYBBX7QV442&asin=B0CRMZHDG8",
    "customer_says": "Customers love the tumbler's size, particularly its 30oz capacity, and appreciat…",
    "sustainability_features": ["…"],
    "climate_pledge_friendly": false,
    "videos": ["https://www.amazon.com/vdp/00e6bdd168764c04b4c944ca2303813e"],
    "other_sellers_prices": ["…"],
    "downloadable_videos": ["…"],
    "zipcode": "11001",
    "sponsered": false,
    "ships_from": "Amazon",
    "customers_say": {"text": "Customers love the tumbler's size, particularly its 30oz capacity, and appreciate its…,
    "variations_values": ["…"],
    "return_policy": "FREE 30-day refund/replacement",
    "inactive_buy_box": {"price": 27.29, "delivery": ["FREE delivery August 18 - 22 on orders shipped by Amazon over $3…,
    "premium_brand": false,
    "amazon_prime": true,
    "sponsored": false,
    "category_tree": ["…"],
    "variant_attributes": [{"name": "Size", "value": "40 Ounces"}, {"name": "Color", "value": "Fuchsia"}],
    "variants": [{"variant_type": "Size", "variant_options": null}, "…"],
    "target_countries": ["us"],
    "category_urls": ["…"],
    "subcategory_link": ["…"],
    "is_frequently_returned_item_badge": false,
    "is_customers_usually_keep": false,
    "review_images": ["https://m.media-amazon.com/images/I/51lKnDZIOCL.jpg", "…"],
    "review_videos": ["…"],
    "bought_past_month_text": "400+ bought in past month",
    "is_high_price": false,
    "title_highlight": " Handle and Straw ",
    "title_clean": "STANLEY Quencher H2.0 Flow State Tumbler, 40 oz, Fuchsia ",
    "customers_say_topics": ["…"],
    "timestamp": "2026-08-10T22:11:53.154Z",
    "input": {"url": "https://www.amazon.com/Quencher-FlowState-Stainless-Insulated-Smoothie/dp/B0CRMZHDG8",…
  }
]`,
  },
  {
    name: "LinkedIn",
    datasetId: "gd_l1viktl72bvl7bjuj0",
    url: "https://www.linkedin.com/in/satyanadella",
    printFields: ["name", "position"],
    domain: "linkedin.com",
    response: `[
  {
    "id": "satyanadella",
    "name": "Satya Nadella",
    "city": "Redmond, Washington, United States",
    "country_code": "US",
    "position": "Chairman and CEO at Microsoft",
    "about": "As chairman and CEO of Microsoft, I define my mission and that of my company as empow…",
    "posts": [{ "title": "How do we build a frontier intelligence ecosystem?", "attribution": "Great to be back at Microsoft Build today.", "…": "…" }, "… 9 more"],
    "current_company": { "name": "Microsoft", "company_id": "microsoft", "title": "Chairman and CEO", "location": "Greater Seattle Area" },
    "experience": [{ "title": "Chairman and CEO", "start_date": "Feb 2014", "…": "…" }, "… 4 more"],
    "url": "https://ua.linkedin.com/in/satyanadella",
    "people_also_viewed": [{ "name": "Tony Bates" }, "… 9 more"],
    "educations_details": "The University of Chicago Booth School of Business",
    "education": [{ "title": "The University of Chicago Booth School of Business", "start_year": "1994", "…": "…" }, "… 2 more"],
    "avatar": "https://media.licdn.com/dms/image/v2/C5603AQHHUuOSlRVA1w/profile-displayphoto-shrink_200_200.jpg",
    "followers": 12109784,
    "connections": 500,
    "current_company_company_id": "microsoft",
    "current_company_name": "Microsoft",
    "location": "Redmond",
    "input_url": "https://www.linkedin.com/in/satyanadella",
    "linkedin_id": "satyanadella",
    "activity": [{ "interaction": "Shared by Satya Nadella", "title": "Some more detail on the ROIC Intelligence App I built yesterday", "…": "…" }, "… 12 more"],
    "linkedin_num_id": "19186432",
    "banner_image": "https://media.licdn.com/dms/image/v2/D5616AQFVwYcBLAcPqQ/profile-displaybackgroundimage.jpg",
    "default_avatar": false,
    "memorialized_account": false,
    "bio_links": [{ "title": "Company Website", "link": "https://snscratchpad.com/" }],
    "first_name": "Satya",
    "last_name": "Nadella",
    "influencer": true,
    "timestamp": "2026-08-10T22:19:44.613Z",
    "input": { "url": "https://www.linkedin.com/in/satyanadella" }
  }
]`,
  },
  {
    name: "Instagram",
    datasetId: "gd_l1vikfch901nx3by4",
    url: "https://www.instagram.com/instagram/",
    printFields: ["followers", "bio"],
    domain: "instagram.com",
    response: `[
  {
    "account": "instagram",
    "full_name": "Instagram",
    "followers": 690845210,
    "posts_count": 8062,
    "is_verified": true,
    "bio": "Discovering and telling stories from around the world.",
    "engagement_rate": 0.011
  }
]`,
  },
] as const;

type TargetName = (typeof TARGETS)[number]["name"];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); }
        catch { /* fallback */ }
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className="shrink-0 rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[11px] font-medium text-white/80 transition hover:bg-white/10"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

type HubCodeExampleProps = {
  /** When set, renders a single fixed example for this URL (hub pages). Without it, shows the Amazon/LinkedIn/Instagram switcher. */
  sampleUrl?: string;
  className?: string;
};

export default function HubCodeExample({ sampleUrl, className = "" }: HubCodeExampleProps) {
  const [lang, setLang] = useState<Lang>("cURL");
  const [targetName, setTargetName] = useState<TargetName>("Amazon");
  const multiTarget = !sampleUrl;
  const target = multiTarget
    ? TARGETS.find((t) => t.name === targetName) ?? TARGETS[0]
    : { name: "custom", datasetId: "DATASET_ID", url: sampleUrl, printFields: ["title", "price"] as const, domain: "", response: "" };
  const [f1, f2] = target.printFields;

  const curlCode = `# Synchronous request: results returned in real time\ncurl -X POST "https://api.brightdata.com/datasets/v3/scrape?dataset_id=${target.datasetId}&format=json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '[{"url": "${target.url}"}]'`;

  const pythonCode = `# Synchronous request: results returned in real time\nimport requests

response = requests.post(
    "https://api.brightdata.com/datasets/v3/scrape",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
    },
    params={"dataset_id": "${target.datasetId}", "format": "json"},
    json=[{"url": "${target.url}"}],
)

data = response.json()
print(data[0]["${f1}"], data[0]["${f2}"])`;

  const nodeCode = `// Synchronous request: results returned in real time\nconst response = await fetch(
  "https://api.brightdata.com/datasets/v3/scrape?dataset_id=${target.datasetId}&format=json",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify([{ url: "${target.url}" }]),
  }
);

const data = await response.json();
console.log(data[0].${f1}, data[0].${f2});`;

  const codeMap: Record<Lang, string> = { cURL: curlCode, Python: pythonCode, "Node.js": nodeCode };
  const langs: Lang[] = ["cURL", "Python", "Node.js"];

  const requestCard = (
    <div className={`hub-code-example ${multiTarget ? "" : className}`}>
      <div className="hub-code-tabs">
        {langs.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={`hub-code-tab ${lang === l ? "active" : ""}`}
          >
            {l}
          </button>
        ))}
        <div className="hub-code-copy">
          <CopyBtn text={codeMap[lang]} />
        </div>
      </div>
      <pre className="hub-code-pre">
        <code>
          <Highlighted
            code={codeMap[lang]}
            kind={lang === "cURL" ? "bash" : lang === "Python" ? "python" : "js"}
          />
        </code>
      </pre>
    </div>
  );

  if (!multiTarget) return requestCard;

  return (
    <div className={className}>
      <div className="hub-code-targets" role="tablist" aria-label="Example target">
        {TARGETS.map((t) => (
          <button
            key={t.name}
            type="button"
            role="tab"
            aria-selected={targetName === t.name}
            onClick={() => setTargetName(t.name)}
            className={`hub-code-target ${targetName === t.name ? "active" : ""}`}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div className="hub-code-duo">
        <div className="hub-code-col">
          <p className="hub-code-kicker">Request</p>
          {requestCard}
        </div>
        <div className="hub-code-col">
          <p className="hub-code-kicker">Response</p>
          <div className="hub-code-response">
            <div className="hub-code-response-chrome">
              <span className="hub-code-dots" aria-hidden="true">
                <i /><i /><i />
              </span>
              200 OK · {target.domain}
            </div>
            <pre className="hub-code-pre">
              <code>
                <Highlighted code={target.response} kind="json" />
              </code>
            </pre>
          </div>
          <p className="hub-code-note">
            Large or slow scrapes return a <code>snapshot_id</code> instead of records.
            Track it via the{" "}
            <a
              href="https://docs.brightdata.com/api-reference/web-scraper-api/management-apis/monitor-progress"
              target="_blank"
              rel="noopener noreferrer"
            >
              Monitor Snapshot endpoint
            </a>{" "}
            and download the result when ready.
          </p>
        </div>
      </div>
      <p className="hub-code-auth">
        <span aria-hidden="true">🔑</span> <strong>Authentication:</strong> pass your API
        key as a Bearer token in the <code>Authorization</code> header. Get your key at{" "}
        <a
          href="https://brightdata.com/cp/setting/users"
          target="_blank"
          rel="noopener noreferrer"
        >
          brightdata.com/cp/setting/users
        </a>
        .
      </p>
    </div>
  );
}
