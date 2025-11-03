import { KnowledgeEntry } from "../types";
import { GistApiItem } from "../clients/gist";
import { ZennFeed } from "../clients/zenn";
import { toSlugWithHint, buildTags, toISODateString } from "../utils";

/**
 * Gist APIのレスポンスをKnowledgeEntry形式に正規化する
 */
export function normalizeGist(gists: ReadonlyArray<GistApiItem>): KnowledgeEntry[] {
  return gists.map((g) => {
    const title = g.description?.trim() || (Object.keys(g.files)[0] ?? g.id);
    const slug = toSlugWithHint(title, g.id);
    const languages = Object.values(g.files)
      .map((f) => f.language || "")
      .filter(Boolean) as string[];
    const tags = buildTags(["gist", ...languages]);
    const publishedAt = toISODateString(g.created_at) ?? toISODateString(g.updated_at)!;

    return {
      id: g.id,
      source: "gist",
      slug,
      title,
      summary: g.description ?? title,
      url: g.html_url,
      tags,
      publishedAt,
      updatedAt: toISODateString(g.updated_at) ?? undefined,
      author: g.owner?.login ?? undefined,
    };
  });
}

/**
 * Zenn RSSフィードをKnowledgeEntry形式に正規化する
 */
export function normalizeZenn(feed: ZennFeed): KnowledgeEntry[] {
  return feed.items.map((it) => {
    const title = it.title?.trim() ?? it.link;
    const id = it.id ?? it.link;
    const slug = toSlugWithHint(title, id);
    const publishedAt = it.pubDate ? toISODateString(it.pubDate) : null;
    const tags = buildTags(["zenn"]);

    return {
      id,
      source: "zenn",
      slug,
      title,
      summary: it.description ?? title,
      url: it.link,
      tags,
      publishedAt: publishedAt ?? toISODateString(Date.now())!,
    };
  });
}

