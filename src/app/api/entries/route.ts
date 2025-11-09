import { NextRequest, NextResponse } from "next/server";
import { getEntries } from "../../../lib/data/entries";
import { getKnowledgeKV } from "../../../lib/utils/cloudflare";

// ISR: 1時間ごとに再生成
export const revalidate = 3600;

const ITEMS_PER_PAGE = 10;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || String(ITEMS_PER_PAGE), 10);

  const kv = getKnowledgeKV();
  const env = kv ? { KNOWLEDGE_KV: kv } : undefined;
  const allEntries = await getEntries(env);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const entries = allEntries.slice(startIndex, endIndex);
  const hasMore = endIndex < allEntries.length;

  return NextResponse.json({
    entries,
    hasMore,
  });
}
