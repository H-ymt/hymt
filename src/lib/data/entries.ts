import type { KnowledgeEntry } from "../types";
import entriesJson from "../../data/entries.json";

const KV_KEY = "knowledge:entries";

export async function getEntries(env?: { KNOWLEDGE_KV?: KVNamespace }): Promise<KnowledgeEntry[]> {
  if (env?.KNOWLEDGE_KV) {
    try {
      const cached = await env.KNOWLEDGE_KV.get<KnowledgeEntry[]>(KV_KEY, "json");
      if (cached && Array.isArray(cached) && cached.length > 0) {
        return cached;
      }
    } catch (error) {
      console.warn("[getEntries] Failed to load from KV:", error);
    }
  }

  return entriesJson as KnowledgeEntry[];
}

export async function saveEntries(
  entries: KnowledgeEntry[],
  env: { KNOWLEDGE_KV: KVNamespace },
): Promise<void> {
  await env.KNOWLEDGE_KV.put(KV_KEY, JSON.stringify(entries));
}
