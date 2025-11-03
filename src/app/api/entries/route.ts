import { NextRequest, NextResponse } from "next/server";
import { getEntries } from "../../../lib/data/entries";

const ITEMS_PER_PAGE = 10;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || String(ITEMS_PER_PAGE), 10);

  // Cloudflare環境からKVを取得
  const cloudflareEnv = (globalThis as unknown as { env?: CloudflareEnv }).env;
  const env = cloudflareEnv?.KNOWLEDGE_KV ? { KNOWLEDGE_KV: cloudflareEnv.KNOWLEDGE_KV } : undefined;

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
