import { NextRequest, NextResponse } from "next/server";
import { fetchKnowledgeEntries } from "../../../lib/fetch-knowledge-worker";
import { saveEntries } from "../../../lib/data/entries";
import { getFetchKnowledgeEnv, getKnowledgeKV } from "../../../lib/utils/cloudflare";

/**
 * Workersエッジでfetch-knowledgeを実行するAPIルート
 * POST /api/fetch-knowledge
 * Cronトリガーからも呼び出し可能
 */
export async function POST(request: NextRequest) {
  try {
    const env = getFetchKnowledgeEnv();
    const kv = getKnowledgeKV();

    // KVストレージが利用可能かチェック
    if (!kv) {
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
    await saveEntries(entries, { KNOWLEDGE_KV: kv });

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
