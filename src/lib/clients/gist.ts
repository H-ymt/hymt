import { getETag, setETag, parseLinkHeader } from "../utils";

export interface GistApiFileInfo {
  readonly filename: string;
  readonly type: string;
  readonly language: string | null;
  readonly raw_url: string;
  readonly size: number;
  readonly truncated?: boolean;
  readonly content?: string;
}

export interface GistApiItem {
  readonly id: string;
  readonly html_url: string;
  readonly description: string | null;
  readonly public: boolean;
  readonly created_at: string; // ISO8601
  readonly updated_at: string; // ISO8601
  readonly files: Record<string, GistApiFileInfo>;
  readonly owner?: { readonly login: string } | null;
}

export interface GistClientOptions {
  username: string;
  token?: string;
}

export interface FetchOptions {
  force?: boolean;
}

/**
 * リトライ付きfetch
 */
async function fetchWithRetry(
  input: URL | string,
  headers: Record<string, string>,
  maxAttempts = 3
): Promise<Response> {
  let attempt = 0;
  const now = Math.floor(Date.now() / 1000);

  while (true) {
    attempt++;
    const res = await fetch(input, { headers });

    if (res.ok || res.status === 304) return res;
    if (attempt >= maxAttempts || (res.status < 500 && res.status !== 429)) return res;

    // レート制限の場合はリセット時刻まで待機
    const reset = res.headers.get("x-ratelimit-reset");
    const waitMs =
      res.status === 429 && reset
        ? Math.max(0, (parseInt(reset, 10) - now) * 1000)
        : 300 * Math.pow(2, attempt - 1);

    await new Promise((r) => setTimeout(r, waitMs));
  }
}

/**
 * Gistクライアントを作成する
 */
export function createGistClient(options: GistClientOptions) {
  const { username, token } = options;

  return {
    /**
     * ユーザーのGistを取得する
     */
    async fetchUserGists(options?: FetchOptions): Promise<GistApiItem[]> {
      const etagKey = `gist:${username}`;
      const prevEtag = options?.force ? undefined : await getETag(etagKey);

      const headers: Record<string, string> = {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "fetch-knowledge-script",
      };

      if (token) {
        headers.Authorization = `token ${token}`;
      }

      if (prevEtag) {
        headers["If-None-Match"] = prevEtag;
      }

      const collected: GistApiItem[] = [];
      let page = 1;
      let nextUrl: URL | null = new URL(`https://api.github.com/users/${username}/gists?per_page=100&page=${page}`);

      while (nextUrl) {
        const res = await fetchWithRetry(nextUrl, headers);

        if (res.status === 304) {
          // 更新なし
          const etag = res.headers.get("etag");
          if (etag) await setETag(etagKey, etag);
          break;
        }

        if (!res.ok) {
          throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
        }

        const data = (await res.json()) as GistApiItem[];
        collected.push(...data);

        const etag = res.headers.get("etag");
        if (etag) await setETag(etagKey, etag);

        const links = parseLinkHeader(res.headers.get("link"));
        if (links.next) {
          nextUrl = new URL(links.next);
          page += 1;
        } else {
          nextUrl = null;
        }
      }

      return collected;
    },
  };
}

