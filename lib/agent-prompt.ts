/**
 * The agent prompt and MCP config shown on the Amazon Product Scraper page's
 * Connect Agent tab.
 *
 * Single source of truth, same arrangement as lib/api-snippets.ts: the page
 * renders these strings and scripts/validate-agent-prompts.mjs feeds these
 * same strings to a real coding agent, so the eval tests what a visitor
 * actually copies.
 *
 * The MCP config is the part most worth testing. It shipped for months
 * pointing at @anthropic-ai/mcp-remote, a package that does not exist on npm,
 * and with no GROUPS set the server exposes no Amazon tools at all, so an
 * agent silently falls back to Web Unlocker and still sounds confident.
 */

export const AGENT_PROMPT = `Read https://brightdata.com/SKILL.md and set up Bright Data.

Then complete these tasks with the Amazon pipelines
(amazon_product, amazon_product_reviews, amazon_product_search):

1. Get structured JSON for https://www.amazon.com/dp/B09X7MPX8L
   via amazon_product and report title, final_price, rating, and availability.

2. Pull reviews for the same product and summarize the top
   complaints in 3 bullets.

3. Search "wireless earbuds" on https://amazon.com and save
   the results to earbuds.csv.

When done, list the commands you ran so I can rerun them.`;

/** GROUPS is load-bearing: without it the server exposes zero Amazon tools. */
export const MCP_CONFIG = `{
  "mcpServers": {
    "brightdata": {
      "command": "npx",
      "args": ["-y", "@brightdata/mcp"],
      "env": {
        "API_TOKEN": "YOUR_API_KEY",
        "GROUPS": "ecommerce"
      }
    }
  }
}`;
