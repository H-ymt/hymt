/**
 * Cloudflare Workers用のCronトリガーハンドラー
 * OpenNextJSでは、このファイルをworker.tsとして配置する必要があります
 * または、open-next.config.tsで設定できます
 */

import { fetchKnowledgeEntries } from "../src/lib/fetch-knowledge-worker";
import { saveEntries } from "../src/lib/data/entries";

/**
 * Cronトリガーで実行される関数
 * 6時間ごとに記事データを更新
 */
export async function scheduled(event: ScheduledEvent, env: CloudflareEnv, ctx: ExecutionContext): Promise<void> {
  ctx.waitUntil(
    (async () => {
      try {
        console.log("[Cron] Fetching knowledge entries...");
        
        const fetchEnv = {
          GITHUB_USERNAME: env.GITHUB_USERNAME,
          GITHUB_TOKEN: env.GITHUB_TOKEN,
          ZENN_USER: env.ZENN_USER,
        };

        if (!env.KNOWLEDGE_KV) {
          console.error("[Cron] KNOWLEDGE_KV not available");
          return;
        }

        const entries = await fetchKnowledgeEntries(fetchEnv, { source: "all" });
        await saveEntries(entries, { KNOWLEDGE_KV: env.KNOWLEDGE_KV });

        console.log(`[Cron] Successfully updated ${entries.length} entries`);
      } catch (error) {
        console.error("[Cron] Error fetching knowledge entries:", error);
      }
    })()
  );
}

