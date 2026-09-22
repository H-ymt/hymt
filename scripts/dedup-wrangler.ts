import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { CACHE_TAG_ENTRIES } from "../src/lib/constants";

const distServerDir = join(process.cwd(), "dist/server");
const wranglerJsonPath = join(distServerDir, "wrangler.json");
const entryPath = join(distServerDir, "entry.mjs");
const chunksDir = join(distServerDir, "chunks");

async function dedupKvNamespaces(): Promise<void> {
  const raw = await readFile(wranglerJsonPath, "utf-8");
  const config = JSON.parse(raw);

  if (Array.isArray(config.kv_namespaces)) {
    const seen = new Set<string>();
    config.kv_namespaces = config.kv_namespaces.filter((kv: { binding: string }) => {
      if (seen.has(kv.binding)) return false;
      seen.add(kv.binding);
      return true;
    });
  }

  // triggers.crons はアダプタが wrangler.jsonc から引き継ぐので、ここでは触らない。

  await writeFile(wranglerJsonPath, JSON.stringify(config), "utf-8");
}

async function findChunkExporting(symbol: string): Promise<string> {
  const files = await readdir(chunksDir);
  for (const file of files) {
    if (!file.endsWith(".mjs")) continue;
    const content = await readFile(join(chunksDir, file), "utf-8");
    if (content.includes(`async function ${symbol}(`) || content.includes(`function ${symbol}(`)) {
      return file;
    }
  }
  throw new Error(`Chunk exporting ${symbol} not found`);
}

async function ensureExport(chunkFile: string, symbol: string): Promise<void> {
  const path = join(chunksDir, chunkFile);
  const content = await readFile(path, "utf-8");
  if (new RegExp(`\\b${symbol}\\b\\s*[,}]`).test(content.split("export {")[1] ?? "")) {
    return;
  }
  const updated = `${content}\nexport { ${symbol} };\n`;
  await writeFile(path, updated, "utf-8");
}

/**
 * scheduled ハンドラ本体。fetch の束縛先だけが注入先によって変わる。
 *
 * キャッシュの破棄は `cloudflare:workers` の `cache` を使う。
 * これは ExecutionContext ではなくモジュールのトップレベル export で、
 * @astrojs/cloudflare の cache provider (dist/cache/provider.js) と同じ経路。
 */
function buildScheduledHandler(fetchBinding: string): string {
  return `export default {
  fetch: ${fetchBinding},
  async scheduled(_controller, env, ctx) {
    const task = (async () => {
      try {
        const count = await runScheduledFetch({
          GITHUB_USERNAME: env.GITHUB_USERNAME,
          GITHUB_TOKEN: env.GITHUB_TOKEN,
          ZENN_USER: env.ZENN_USER,
          KNOWLEDGE_KV: env.KNOWLEDGE_KV,
        });
        console.log("[scheduled] fetched " + count + " entries");
        // KV を更新したので、entries タグの付いたエッジキャッシュを破棄する
        await cache.purge({ tags: ["${CACHE_TAG_ENTRIES}"] });
      } catch (err) {
        console.error("[scheduled] failed:", err);
        throw err;
      }
    })();
    ctx.waitUntil(task);
  },
};
`;
}

async function injectScheduledHandler(): Promise<void> {
  const chunk = await findChunkExporting("runScheduledFetch");
  await ensureExport(chunk, "runScheduledFetch");

  const entryContent = await readFile(entryPath, "utf-8");
  const workerEntryChunk = (await readdir(chunksDir)).find((f) => f.startsWith("worker-entry_"));

  if (workerEntryChunk) {
    const newEntry = `globalThis.process ??= {};
globalThis.process.env ??= {};
import { w as astroWorker } from "./chunks/${workerEntryChunk}";
import { runScheduledFetch } from "./chunks/${chunk}";
import { cache } from "cloudflare:workers";

${buildScheduledHandler("astroWorker.fetch.bind(astroWorker)")}`;
    await writeFile(entryPath, newEntry, "utf-8");
    return;
  }

  const scheduledHandler = `
import { runScheduledFetch } from "./chunks/${chunk}";
import { cache } from "cloudflare:workers";

${buildScheduledHandler("worker_entry_default.fetch.bind(worker_entry_default)")}`;

  const exportPattern = /export \{ worker_entry_default as default \};\s*$/;
  if (!exportPattern.test(entryContent)) {
    throw new Error("worker entry export not found in entry.mjs");
  }

  const updatedEntry = entryContent.replace(exportPattern, scheduledHandler);
  await writeFile(entryPath, updatedEntry, "utf-8");
}

async function main(): Promise<void> {
  await dedupKvNamespaces();
  await injectScheduledHandler();
  console.log("[dedup-wrangler] Done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
