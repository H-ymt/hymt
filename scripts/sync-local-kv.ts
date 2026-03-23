import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const entriesJsonPath = join(process.cwd(), "src/data/entries.json");
const KV_KEY = "knowledge:entries";
const LOCAL_KV_PATH = join(process.cwd(), ".wrangler/state/v3/kv/miniflare-KVNamespaceObject");

async function main() {
  try {
    console.log("[sync-local-kv] Reading entries.json...");
    const fileContents = await readFile(entriesJsonPath, "utf-8");
    const entries = JSON.parse(fileContents);

    if (!Array.isArray(entries)) {
      throw new Error("entries.json is not an array");
    }

    console.log(`[sync-local-kv] Found ${entries.length} entries`);

    // ローカルKVディレクトリを作成
    await mkdir(LOCAL_KV_PATH, { recursive: true });

    // miniflare形式でKVに保存（キーをファイル名として保存）
    // miniflareはキーをそのままファイル名として使う
    const kvFilePath = join(LOCAL_KV_PATH, encodeURIComponent(KV_KEY));
    await writeFile(kvFilePath, JSON.stringify(entries), "utf-8");

    console.log(`[sync-local-kv] Successfully synced ${entries.length} entries to local KV`);
  } catch (error) {
    console.error("[sync-local-kv] Error:", error);
    process.exit(1);
  }
}

main();
