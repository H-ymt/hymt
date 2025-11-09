import { readFile, writeFile, unlink } from "fs/promises";
import { join } from "path";
import { execSync } from "child_process";
import { tmpdir } from "os";

const entriesJsonPath = join(process.cwd(), "src/data/entries.json");
const KV_KEY = "knowledge:entries";
const KV_NAMESPACE_ID = "cfe3bfbb717248738dce1190e5bd2337";

async function main() {
  let tempFilePath: string | null = null;

  try {
    console.log("[sync-kv] Reading entries.json...");
    const fileContents = await readFile(entriesJsonPath, "utf-8");
    const entries = JSON.parse(fileContents);

    if (!Array.isArray(entries)) {
      throw new Error("entries.json is not an array");
    }

    console.log(`[sync-kv] Found ${entries.length} entries`);

    // 一時ファイルを作成してWrangler CLIに渡す
    tempFilePath = join(tmpdir(), `kv-${Date.now()}.json`);
    await writeFile(tempFilePath, JSON.stringify(entries, null, 2), "utf-8");

    // Wrangler CLIを使用してKVストレージに書き込む
    console.log("[sync-kv] Writing to KV storage...");
    const command = `wrangler kv key put "${KV_KEY}" --path="${tempFilePath}" --namespace-id=${KV_NAMESPACE_ID} --remote`;

    execSync(command, {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    console.log(`[sync-kv] Successfully synced ${entries.length} entries to KV storage`);
  } catch (error) {
    console.error("[sync-kv] Error:", error);
    process.exit(1);
  } finally {
    // 一時ファイルを削除
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch {
        // 削除に失敗しても無視
      }
    }
  }
}

main();
