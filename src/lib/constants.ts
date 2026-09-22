export const ITEMS_PER_PAGE = 10;

export const MAX_ENTRIES_LIMIT = 100;

/** バージョンを固定する（@latest は CDN のキャッシュ寿命が短い）。 */
export const FONT_CDN_BASE = "https://cdn.jsdelivr.net/npm/gen-interface-jp@0.8.0/cdn";

export const FONT_WEIGHTS = [400, 500, 700] as const;

/** エントリ由来のレスポンスに付くキャッシュタグ。cron 後の purge と対になる。 */
export const CACHE_TAG_ENTRIES = "entries";

/** エントリの更新は cron のみ。エッジで使い回し、裏で再検証する。 */
export function entriesCacheRule() {
  return {
    maxAge: 60 * 60,
    swr: 60 * 60 * 24,
    tags: [CACHE_TAG_ENTRIES],
  };
}
