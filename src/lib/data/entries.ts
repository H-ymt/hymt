import { KnowledgeEntry } from "../types";

const KV_KEY = "knowledge:entries";

/**
 * KVストレージから記事データを読み込む
 * フォールバックとしてファイルシステムからも読み込む
 */
export async function getEntries(env?: { KNOWLEDGE_KV?: KVNamespace }): Promise<KnowledgeEntry[]> {
  // KVストレージから読み込み（Workersエッジ環境）
  if (env?.KNOWLEDGE_KV) {
    try {
      const cached = await env.KNOWLEDGE_KV.get<KnowledgeEntry[]>(KV_KEY, "json");
      if (cached && Array.isArray(cached)) {
        return cached;
      }
    } catch (error) {
      console.warn("[getEntries] Failed to load from KV:", error);
    }
  }

  // フォールバック: ファイルシステムから読み込み（ビルド時など）
  if (typeof process !== "undefined" && process.cwd) {
    try {
      const { readFile } = await import("fs/promises");
      const { join } = await import("path");
      const entriesJsonPath = join(process.cwd(), "src/data/entries.json");
      const fileContents = await readFile(entriesJsonPath, "utf-8");
      const entries: unknown = JSON.parse(fileContents);
      if (Array.isArray(entries)) {
        return entries as KnowledgeEntry[];
      }
    } catch (error) {
      console.warn("[getEntries] Failed to load entries.json:", error);
    }
  }

  return [];
}

/**
 * KVストレージに記事データを保存
 */
export async function saveEntries(
  entries: KnowledgeEntry[],
  env: { KNOWLEDGE_KV: KVNamespace }
): Promise<void> {
  await env.KNOWLEDGE_KV.put(KV_KEY, JSON.stringify(entries));
}

