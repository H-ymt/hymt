import { KnowledgeEntry } from "../types";
import { readFile } from "fs/promises";
import { join } from "path";

const entriesJsonPath = join(process.cwd(), "src/data/entries.json");

/**
 * entries.jsonから記事データを読み込む
 */
export async function getEntries(): Promise<KnowledgeEntry[]> {
  try {
    const fileContents = await readFile(entriesJsonPath, "utf-8");
    const entries: unknown = JSON.parse(fileContents);
    if (Array.isArray(entries)) {
      return entries as KnowledgeEntry[];
    }
    return [];
  } catch (error) {
    // ファイルが存在しない場合や読み込みエラーの場合は空配列を返す
    console.warn("[getEntries] Failed to load entries.json:", error);
    return [];
  }
}

