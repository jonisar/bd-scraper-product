/**
 * The six API examples shown on the Amazon Product Scraper page.
 *
 * Single source of truth: the page renders these strings and
 * scripts/validate-api-examples.mjs executes these same strings against the
 * live API. If a snippet is edited here, the daily validator tests the edit.
 *
 * Sync snippets are shared with /products/web-scraper#code via buildSnippets().
 */
import { buildSnippets, getHubTarget } from "@/components/HubCodeExample";

const AMAZON_TARGET = getHubTarget("amazon.com")!;
const SHARED = buildSnippets(AMAZON_TARGET);
const DATASET_ID = AMAZON_TARGET.datasetId;

/** Two real ASINs, used by the async examples to show batching. */
const BATCH_URLS = `URLS = [
    "https://www.amazon.com/dp/B0CRMZHDG8",
    "https://www.amazon.com/dp/B09X7MPX8L",
]`;

export const CURL_SYNC = SHARED.cURL;

export const CURL_ASYNC = `# Step 1: Trigger the collection
curl -X POST \\
  "https://api.brightdata.com/datasets/v3/trigger?dataset_id=${DATASET_ID}&format=json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '[
    {"url": "https://www.amazon.com/dp/B0CRMZHDG8"},
    {"url": "https://www.amazon.com/dp/B09X7MPX8L"}
  ]'
# → Returns: {"snapshot_id": "sd_abc123..."}

# Step 2: Poll progress until status is "ready"
curl "https://api.brightdata.com/datasets/v3/progress/sd_abc123" \\
  -H "Authorization: Bearer YOUR_API_KEY"
# → Returns: {"status": "ready", "records": 2, "errors": 0}
# "ready" means finished, not successful. Check records and errors:
# a snapshot with errors > 0 downloads as an empty array.

# Step 3: Download the results
curl "https://api.brightdata.com/datasets/v3/snapshot/sd_abc123?format=json" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

export const PYTHON_SYNC = SHARED.Python;

export const PYTHON_ASYNC = `# pip install brightdata-sdk
import time
from brightdata import SyncBrightDataClient

${BATCH_URLS}

with SyncBrightDataClient(token="YOUR_API_KEY") as client:
    amazon = client.scrape.amazon

    # Step 1: Trigger the collection, returns a snapshot id right away
    job = amazon.products_trigger(url=URLS)
    print("Snapshot:", job.snapshot_id)

    # Step 2: Poll until the snapshot is ready
    while amazon.products_status(job.snapshot_id) != "ready":
        time.sleep(5)

    # Step 3: Download the results
    for product in amazon.products_fetch(job.snapshot_id):
        print(product["title"], product["final_price"])

# 📚 Docs → https://docs.brightdata.com/api-reference/SDK`;

export const JS_SYNC = SHARED["Node.js"];

export const JS_ASYNC = `// npm install @brightdata/sdk
import { bdclient } from '@brightdata/sdk';

const urls = [
  "https://www.amazon.com/dp/B0CRMZHDG8",
  "https://www.amazon.com/dp/B09X7MPX8L",
];

const client = new bdclient({ apiKey: "YOUR_API_KEY" });

// Step 1: Trigger the collection, returns a job with a snapshot id
const job = await client.scrape.amazon.collectProducts(urls, { async: true, format: "json" });
console.log("Snapshot:", job.snapshotId);

// Step 2: Poll until the snapshot is ready
await job.wait({ pollInterval: 5000 });

// Step 3: Fetch the results
const products = await job.fetch();
products.forEach((p) => console.log(p.title, p.final_price));

// 📚 Docs → https://docs.brightdata.com/api-reference/SDK-JS`;

export type ApiExample = {
  id: string;
  language: "bash" | "python" | "node";
  mode: "sync" | "async";
  code: string;
};

/** Everything the daily validator executes. */
export const API_EXAMPLES: ApiExample[] = [
  { id: "curl-sync", language: "bash", mode: "sync", code: CURL_SYNC },
  { id: "curl-async", language: "bash", mode: "async", code: CURL_ASYNC },
  { id: "python-sync", language: "python", mode: "sync", code: PYTHON_SYNC },
  { id: "python-async", language: "python", mode: "async", code: PYTHON_ASYNC },
  { id: "node-sync", language: "node", mode: "sync", code: JS_SYNC },
  { id: "node-async", language: "node", mode: "async", code: JS_ASYNC },
];
