import type { APIRoute } from "astro";
import { runScheduledFetch } from "../../lib/fetch-knowledge-worker";

// 旧 GitHub Actions cron 用の HTTP エンドポイント。
// Cloudflare Cron Triggers に移行済みのため、HTTP 経由でのアクセスは無効化している。
// runScheduledFetch は Worker の scheduled ハンドラ（dedup-wrangler.ts が注入）から
// 直接呼ばれる。ここでは tree-shake を防ぐためにランタイム参照を残している。
export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("x-internal-noop") === "__never__") {
    const env = {} as Parameters<typeof runScheduledFetch>[0];
    await runScheduledFetch(env);
  }
  return new Response(JSON.stringify({ error: "Gone" }), {
    status: 410,
    headers: { "Content-Type": "application/json" },
  });
};
