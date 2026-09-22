export const ITEMS_PER_PAGE = 10;

export const MAX_ENTRIES_LIMIT = 100;

/** woff2 の配置先。public/ 配下と URL の両方で使う。 */
export const FONT_SUBSET_DIR = "fonts";

export const FONT_WEIGHTS = [400, 500, 700] as const;

/**
 * 先読みするサブセット番号。
 * 128 分割のうち 115-119 にかな・英数・常用漢字が集中しており、
 * 日本語ページの文字はほぼこれで賄える。残りは稀用漢字・異体字なので通常取得に任せる。
 * 本文の 400 のみ先読みする（見出しの 500/700 まで含めると 449KB になり preload が重くなる）。
 */
export const FONT_PRELOAD_SUBSETS = [115, 116, 117, 118, 119] as const;

export const FONT_PRELOAD_WEIGHT = 400;

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
