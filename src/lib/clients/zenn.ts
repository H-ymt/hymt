import { getETag, setETag } from "../utils";

export interface ZennFeedItem {
  readonly id?: string;
  readonly title: string;
  readonly link: string;
  readonly description?: string;
  readonly pubDate?: string; // RFC822 or ISO-like
}

export interface ZennFeed {
  readonly title?: string;
  readonly link?: string;
  readonly items: ReadonlyArray<ZennFeedItem>;
}

export interface ZennClientOptions {
  user: string;
  includeScraps?: boolean;
}

export interface FetchOptions {
  force?: boolean;
}

/**
 * XMLタグを抽出する
 */
function parseTag(xml: string, tagName: string): string[] {
  const regex = new RegExp(`<${tagName}[^>]*>(.*?)</${tagName}>`, "gs");
  const matches: string[] = [];
  let match;

  while ((match = regex.exec(xml)) !== null) {
    matches.push(match[1]);
  }

  return matches;
}

/**
 * linkタグのhref属性を抽出する
 */
function parseLinkHref(xml: string): string {
  const match = xml.match(/<link[^>]*href=["']([^"']+)["']/);
  return match ? match[1] : "";
}

/**
 * HTMLエンティティをデコードする
 */
function unescapeHtml(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

/**
 * CDATAセクションを除去する
 */
function removeCdata(text: string): string {
  return text.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1");
}

/**
 * ZennのXMLフィードをパースする
 */
function parseZennXml(xml: string, link: string): ZennFeed {
  const rssItems = parseTag(xml, "item");
  const atomEntries = rssItems.length === 0 ? parseTag(xml, "entry") : [];
  const blocks = rssItems.length > 0 ? rssItems : atomEntries;

  const items: ZennFeedItem[] = blocks.map((block) => {
    const titleText = parseTag(block, "title")[0] ?? "";
    const title = unescapeHtml(removeCdata(titleText)).trim();

    const linkText = parseTag(block, "link")[0] || parseLinkHref(block);
    const linkUrl = linkText.trim() || link;

    const descriptionText = parseTag(block, "description")[0] || parseTag(block, "content")[0] || "";
    const description = descriptionText ? unescapeHtml(removeCdata(descriptionText)).trim() : undefined;

    const pubDateText = parseTag(block, "pubDate")[0] || parseTag(block, "published")[0] || "";
    const pubDate = pubDateText.trim() || undefined;

    const idText = parseTag(block, "guid")[0] || parseTag(block, "id")[0] || "";
    const id = idText.trim() || undefined;

    return {
      id,
      title,
      link: linkUrl,
      description,
      pubDate,
    };
  });

  return {
    title: parseTag(xml, "title")[0] || undefined,
    link,
    items,
  };
}

/**
 * Zennクライアントを作成する
 */
export function createZennClient(options: ZennClientOptions) {
  const { user, includeScraps = true } = options;

  async function fetchOne(kind: "articles" | "scraps", options?: FetchOptions): Promise<ZennFeed> {
    const url = kind === "articles" ? `https://zenn.dev/${user}/feed` : `https://zenn.dev/${user}/scraps/feed`;
    const etagKey = `zenn:${user}:${kind}`;
    const prevEtag = options?.force ? undefined : await getETag(etagKey);

    const headers: Record<string, string> = {
      Accept: "application/rss+xml, application/xml, text/xml",
      "User-Agent": "fetch-knowledge-script",
    };

    if (prevEtag) {
      headers["If-None-Match"] = prevEtag;
    }

    const res = await fetch(url, { headers });

    if (res.status === 304) {
      // 更新なし
      const etag = res.headers.get("etag");
      if (etag) await setETag(etagKey, etag);
      return { title: `zenn:${user}:${kind}`, link: url, items: [] };
    }

    if (!res.ok) {
      if (res.status === 404 && kind === "scraps") {
        // スクラップ未利用ユーザーの場合は空配列を返す
        return { title: `zenn:${user}:${kind}`, link: url, items: [] };
      }
      throw new Error(`ZennClient: HTTP ${res.status} (${kind})`);
    }

    const xml = await res.text();
    const etag = res.headers.get("etag");
    if (etag) await setETag(etagKey, etag);

    return parseZennXml(xml, url);
  }

  return {
    /**
     * Zennのフィードを取得する
     */
    async fetchFeed(options?: FetchOptions): Promise<ZennFeed> {
      const articles = await fetchOne("articles", options);
      const scraps = includeScraps ? await fetchOne("scraps", options) : { items: [] };

      return {
        title: articles.title,
        link: articles.link,
        items: [...articles.items, ...scraps.items],
      };
    },
  };
}

