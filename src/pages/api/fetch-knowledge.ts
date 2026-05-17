import type { APIRoute } from "astro";
import { saveEntries } from "../../lib/data/entries";
import { fetchKnowledgeEntries } from "../../lib/fetch-knowledge-worker";
import { getCronSecret, getFetchKnowledgeEnv, getKnowledgeKV } from "../../lib/utils/cloudflare";

export const POST: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get("authorization");
  const cronSecret = getCronSecret();

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const fetchEnv = getFetchKnowledgeEnv();
    const kv = getKnowledgeKV();

    if (!kv) {
      const entries = await fetchKnowledgeEntries(fetchEnv, { source: "all" });
      return new Response(
        JSON.stringify({
          success: true,
          count: entries.length,
          message: `Successfully fetched ${entries.length} entries (KV storage not available, not saved)`,
          warning: "KV storage not available",
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    }

    const ALLOWED_SOURCES = ["all", "gist", "zenn"] as const;
    type Source = (typeof ALLOWED_SOURCES)[number];
    let options: { source?: Source; force?: boolean } = {};
    try {
      const body = (await request.json()) as { source?: unknown; force?: unknown };
      if (body.source !== undefined && !ALLOWED_SOURCES.includes(body.source as Source)) {
        return new Response(
          JSON.stringify({ error: "Invalid source. Must be one of: all, gist, zenn" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
      options = { source: (body.source as Source) || "all", force: body.force === true };
    } catch {
      // ボディなしの場合はデフォルト値を使用
    }

    const entries = await fetchKnowledgeEntries(fetchEnv, options);
    await saveEntries(entries, { KNOWLEDGE_KV: kv });

    return new Response(
      JSON.stringify({
        success: true,
        count: entries.length,
        message: `Successfully fetched and saved ${entries.length} entries`,
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("[fetch-knowledge API] Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
