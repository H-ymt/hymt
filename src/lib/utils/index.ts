import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { ISODateString, Tag, Slug } from "../types";

const cacheDir = join(process.cwd(), ".cache");
const etagJsonPath = join(cacheDir, "etag.json");

/**
 * ETagを取得する
 */
export async function getETag(key: string): Promise<string | undefined> {
  try {
    const content = await readFile(etagJsonPath, "utf-8");
    const etags: Record<string, string> = JSON.parse(content);
    return etags[key];
  } catch {
    return undefined;
  }
}

/**
 * ETagを保存する
 */
export async function setETag(key: string, etag: string): Promise<void> {
  try {
    await mkdir(cacheDir, { recursive: true });
    let etags: Record<string, string> = {};
    try {
      const content = await readFile(etagJsonPath, "utf-8");
      etags = JSON.parse(content);
    } catch {
      // ファイルが存在しない場合は空オブジェクトから開始
    }
    etags[key] = etag;
    await writeFile(etagJsonPath, JSON.stringify(etags, null, 2));
  } catch (error) {
    console.warn(`[setETag] Failed to save ETag for ${key}:`, error);
  }
}

/**
 * Linkヘッダーをパースする
 */
export function parseLinkHeader(linkHeader: string | null): { next?: string; prev?: string; first?: string; last?: string } {
  const links: Record<string, string> = {};
  if (!linkHeader) return links;

  linkHeader.split(",").forEach((link) => {
    const match = link.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match) {
      const url = match[1];
      const rel = match[2];
      links[rel] = url;
    }
  });

  return links;
}

/**
 * 日付文字列をISO8601形式に変換する
 */
export function toISODateString(date: string | number | Date): ISODateString | null {
  try {
    const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
    if (isNaN(d.getTime())) return null;
    return d.toISOString() as ISODateString;
  } catch {
    return null;
  }
}

/**
 * URLセーフなスラッグを生成する（ヒント付き）
 */
export function toSlugWithHint(title: string, hint: string): Slug {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  const hintPart = hint.slice(0, 8).toLowerCase().replace(/[^\w-]/g, "");
  return `${slug}-${hintPart}` as Slug;
}

/**
 * タグを構築する
 */
export function buildTags(tags: string[]): ReadonlyArray<Tag> {
  return tags.map((tag) => tag.toLowerCase().trim()).filter(Boolean) as Tag[];
}

/**
 * スラッグの重複を解消する
 */
export function ensureUniqueSlugs<T extends { slug: Slug }>(entries: T[]): T[] {
  const counter = new Map<string, number>();
  return entries.map((e) => {
    const s = e.slug;
    const n = counter.get(s) ?? 0;
    counter.set(s, n + 1);
    if (n === 0) return e;
    const newSlug = (`${s}-${n}` as string) as Slug;
    return { ...e, slug: newSlug };
  });
}

/**
 * --sinceオプションの値をISO8601形式に変換する
 */
export function toSinceIso(since: string): string | null {
  try {
    // YYYY-MM-DD形式を想定
    const date = new Date(since);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  } catch {
    return null;
  }
}

/**
 * 実行時間を計測する
 */
export async function timeIt<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    const elapsed = Date.now() - start;
    console.log(`[${label}] completed in ${elapsed}ms`);
    return result;
  } catch (error) {
    const elapsed = Date.now() - start;
    console.error(`[${label}] failed after ${elapsed}ms:`, error);
    throw error;
  }
}

