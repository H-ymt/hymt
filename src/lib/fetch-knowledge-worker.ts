import { createGistClient } from "./clients/gist";
import { createZennClient } from "./clients/zenn";
import { normalizeGist, normalizeZenn } from "./adapters/normalize";
import { KnowledgeEntry } from "./types";
import { ensureUniqueSlugs, toSinceIso, timeIt } from "./utils";

export interface FetchKnowledgeEnv {
  GITHUB_USERNAME?: string;
  GITHUB_TOKEN?: string;
  ZENN_USER?: string;
}

export interface FetchKnowledgeOptions {
  source?: "all" | "gist" | "zenn";
  force?: boolean;
  limit?: number;
  since?: string;
}

/**
 * Workersエッジで実行可能なfetch-knowledge関数
 */
export async function fetchKnowledgeEntries(
  env: FetchKnowledgeEnv,
  options: FetchKnowledgeOptions = {}
): Promise<KnowledgeEntry[]> {
  const source = options.source || "all";

  console.log("[fetch-knowledge-worker] Starting...");
  console.log(`[fetch-knowledge-worker] Source: ${source}`);
  console.log(`[fetch-knowledge-worker] Force: ${options.force ? "yes" : "no"}`);

  // 並列データ取得
  const tasks: Promise<KnowledgeEntry[]>[] = [];

  // Gist取得タスク
  if (env.GITHUB_USERNAME && (source === "all" || source === "gist")) {
    tasks.push(
      timeIt("gist", async () => {
        const gist = createGistClient({
          username: env.GITHUB_USERNAME!,
          token: env.GITHUB_TOKEN,
        });
        const items = await gist.fetchUserGists({ force: options.force });
        return normalizeGist(items);
      }).catch((e) => {
        console.warn("[fetch-knowledge-worker] gist skipped: %s", String(e));
        return [] as KnowledgeEntry[];
      })
    );
  }

  // Zenn取得タスク
  if (env.ZENN_USER && (source === "all" || source === "zenn")) {
    tasks.push(
      timeIt("zenn", async () => {
        const zenn = createZennClient({
          user: env.ZENN_USER!,
          includeScraps: true,
        });
        const feed = await zenn.fetchFeed({ force: options.force });
        return normalizeZenn(feed);
      }).catch((e) => {
        console.warn("[fetch-knowledge-worker] zenn skipped: %s", String(e));
        return [] as KnowledgeEntry[];
      })
    );
  }

  // 結果の統合
  const lists = await Promise.all(tasks);
  let entries = lists.flat();

  // フィルタリング
  if (options.since) {
    const sinceIso = toSinceIso(options.since);
    if (sinceIso) {
      entries = entries.filter((e) => e.publishedAt >= sinceIso);
    }
  }

  // 重複スラッグの解消
  entries = ensureUniqueSlugs(entries);

  // ソート
  entries.sort((a, b) => {
    if (a.publishedAt > b.publishedAt) return -1;
    if (a.publishedAt < b.publishedAt) return 1;
    return a.id.localeCompare(b.id);
  });

  // リミット
  if (options.limit && options.limit > 0) {
    entries = entries.slice(0, options.limit);
  }

  console.log(`[fetch-knowledge-worker] Completed! ${entries.length} entries fetched`);
  return entries;
}

