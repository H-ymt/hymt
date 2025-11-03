import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { config } from "dotenv";
import { createGistClient } from "../src/lib/clients/gist";
import { createZennClient } from "../src/lib/clients/zenn";
import { normalizeGist, normalizeZenn } from "../src/lib/adapters/normalize";
import { KnowledgeEntry } from "../src/lib/types";
import { ensureUniqueSlugs, toSinceIso, timeIt } from "../src/lib/utils";

// 環境変数を読み込む
const envLocalPath = join(process.cwd(), ".env.local");
const envPath = join(process.cwd(), ".env");
config({ path: envLocalPath });
config({ path: envPath }); // .envファイルも読み込む

interface Env {
  GITHUB_USERNAME?: string;
  GITHUB_TOKEN?: string;
  ZENN_USER?: string;
}

interface Args {
  source?: "all" | "gist" | "zenn";
  force?: boolean;
  limit?: number;
  since?: string;
}

/**
 * 環境変数を読み込む
 */
function readEnv(): Env {
  return {
    GITHUB_USERNAME: process.env.GITHUB_USERNAME,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    ZENN_USER: process.env.ZENN_USER,
  };
}

/**
 * コマンドライン引数を解析する
 */
function parseArgs(args: string[]): Args {
  const result: Args = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--source" && i + 1 < args.length) {
      const value = args[i + 1];
      if (value === "all" || value === "gist" || value === "zenn") {
        result.source = value;
      }
      i++;
    } else if (arg === "--force") {
      result.force = true;
    } else if (arg === "--limit" && i + 1 < args.length) {
      const value = parseInt(args[i + 1], 10);
      if (!isNaN(value)) {
        result.limit = value;
      }
      i++;
    } else if (arg === "--since" && i + 1 < args.length) {
      result.since = args[i + 1];
      i++;
    }
  }

  return result;
}

const entriesJsonPath = join(process.cwd(), "src/data/entries.json");

async function main() {
  const env = readEnv();
  const args = parseArgs(process.argv.slice(2));
  const source = args.source || "all";

  console.log("[fetch-knowledge] Starting...");
  console.log(`[fetch-knowledge] Source: ${source}`);
  console.log(`[fetch-knowledge] Force: ${args.force ? "yes" : "no"}`);
  console.log(`[fetch-knowledge] GITHUB_USERNAME: ${env.GITHUB_USERNAME ? "設定済み" : "未設定"}`);
  console.log(`[fetch-knowledge] ZENN_USER: ${env.ZENN_USER ? "設定済み" : "未設定"}`);

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
        const items = await gist.fetchUserGists({ force: args.force });
        return normalizeGist(items);
      }).catch((e) => {
        console.warn("[fetch-knowledge] gist skipped: %s", String(e));
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
        const feed = await zenn.fetchFeed({ force: args.force });
        return normalizeZenn(feed);
      }).catch((e) => {
        console.warn("[fetch-knowledge] zenn skipped: %s", String(e));
        return [] as KnowledgeEntry[];
      })
    );
  }

  // 結果の統合
  const lists = await Promise.all(tasks);
  let entries = lists.flat();

  // 304処理（更新なしの場合は既存データを保持）
  if (entries.length === 0) {
    try {
      const prevRaw = await readFile(entriesJsonPath, "utf-8");
      const prev: unknown = JSON.parse(prevRaw);
      if (Array.isArray(prev) && prev.length > 0) {
        entries = prev as KnowledgeEntry[];
        console.log("[fetch-knowledge] No updates, using existing entries.json");
        return;
      }
    } catch {
      // 既存が無ければそのまま空で進む
    }
  }

  // フィルタリング
  if (args.since) {
    const sinceIso = toSinceIso(args.since);
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
  if (args.limit && args.limit > 0) {
    entries = entries.slice(0, args.limit);
  }

  // JSON出力
  await mkdir(join(process.cwd(), "src/data"), { recursive: true });
  await writeFile(entriesJsonPath, JSON.stringify(entries, null, 2));

  console.log(`[fetch-knowledge] Completed! ${entries.length} entries saved to ${entriesJsonPath}`);
}

main().catch((error) => {
  console.error("[fetch-knowledge] Fatal error:", error);
  process.exit(1);
});

