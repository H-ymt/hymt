import { NextRequest, NextResponse } from "next/server";
import { fetchKnowledgeEntries } from "../../../lib/fetch-knowledge-worker";
import { saveEntries } from "../../../lib/data/entries";

/**
 * Workersエッジでfetch-knowledgeを実行するAPIルート
 * POST /api/fetch-knowledge
 * Cronトリガーからも呼び出し可能
 */
export async function POST(request: NextRequest) {
  try {
    // Cloudflare環境からKVと環境変数を取得
    const cloudflareEnv = (globalThis as unknown as { env?: CloudflareEnv }).env;

    // 環境変数から取得（Cloudflare環境変数またはprocess.env）
    const env = {
      GITHUB_USERNAME: cloudflareEnv?.GITHUB_USERNAME || process.env.GITHUB_USERNAME,
      GITHUB_TOKEN: cloudflareEnv?.GITHUB_TOKEN || process.env.GITHUB_TOKEN,
      ZENN_USER: cloudflareEnv?.ZENN_USER || process.env.ZENN_USER,
    };

    // KVストレージが利用可能かチェック
    if (!cloudflareEnv?.KNOWLEDGE_KV) {
      console.warn("[fetch-knowledge API] KV storage not available, fetching without saving");
      // KVストレージが利用できない場合でも、記事データを取得して返す（保存はスキップ）
      const entries = await fetchKnowledgeEntries(env, { source: "all" });
      return NextResponse.json({
        success: true,
        count: entries.length,
        message: `Successfully fetched ${entries.length} entries (KV storage not available, not saved)`,
        warning: "KV storage not available",
      });
    }

    // リクエストボディからオプションを取得（オプション）
    let options: { source?: "all" | "gist" | "zenn"; force?: boolean } = {};
    try {
      const body = (await request.json()) as { source?: "all" | "gist" | "zenn"; force?: boolean };
      options = {
        source: body.source || "all",
        force: body.force === true,
      };
    } catch {
      // ボディが無い場合はデフォルト値を使用
    }

    // 記事データを取得
    const entries = await fetchKnowledgeEntries(env, options);

    // KVストレージに保存
    await saveEntries(entries, { KNOWLEDGE_KV: cloudflareEnv.KNOWLEDGE_KV });

    return NextResponse.json({
      success: true,
      count: entries.length,
      message: `Successfully fetched and saved ${entries.length} entries`,
    });
  } catch (error) {
    console.error("[fetch-knowledge API] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch knowledge entries",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * Cronトリガー用のハンドラー
 * OpenNextJSでは、scheduled関数をworker.tsで定義する必要があります
 */
