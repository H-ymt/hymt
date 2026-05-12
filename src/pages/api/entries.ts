import type { APIRoute } from "astro";
import { getEntries } from "../../lib/data/entries";
import { getKnowledgeKV } from "../../lib/utils/cloudflare";

const ITEMS_PER_PAGE = 10;

const MAX_LIMIT = 100;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);

  const rawPage = parseInt(url.searchParams.get("page") || "1", 10);
  const rawLimit = parseInt(url.searchParams.get("limit") || String(ITEMS_PER_PAGE), 10);
  const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const limit = Number.isNaN(rawLimit) || rawLimit < 1 ? ITEMS_PER_PAGE : Math.min(rawLimit, MAX_LIMIT);

  const kv = getKnowledgeKV();
  const allEntries = await getEntries(kv ? { KNOWLEDGE_KV: kv } : undefined);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const entries = allEntries.slice(startIndex, endIndex);
  const hasMore = endIndex < allEntries.length;

  return new Response(JSON.stringify({ entries, hasMore }), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
