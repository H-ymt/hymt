import type { APIRoute } from "astro";
import { saveEntries } from "../../lib/data/entries";
import { fetchKnowledgeEntries } from "../../lib/fetch-knowledge-worker";
import { getFetchKnowledgeEnv, getKnowledgeKV } from "../../lib/utils/cloudflare";

export const POST: APIRoute = async ({ request, locals }) => {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const fetchEnv = getFetchKnowledgeEnv();
    const cloudflareEnv = locals.runtime?.env as CloudflareEnv | undefined;
    const kv = cloudflareEnv ? getKnowledgeKV(cloudflareEnv) : undefined;

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

    let options: { source?: "all" | "gist" | "zenn"; force?: boolean } = {};
    try {
      const body = (await request.json()) as { source?: "all" | "gist" | "zenn"; force?: boolean };
      options = { source: body.source || "all", force: body.force === true };
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
      JSON.stringify({
        error: "Failed to fetch knowledge entries",
        message: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
