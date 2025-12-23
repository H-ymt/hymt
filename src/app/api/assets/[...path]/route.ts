import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const key = path.join("/");

  console.log(`[API] logic request for ${key}`);

  const ctx = await getCloudflareContext();
  const env = ctx.env as { ASSETS_BUCKET?: R2Bucket };

  if (!env.ASSETS_BUCKET) {
    console.error("[API] ASSETS_BUCKET is not bound");
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  const object = await env.ASSETS_BUCKET.get(key);

  if (!object) {
    console.warn(`[API] Object not found: ${key}`);
    return new NextResponse("Not Found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new NextResponse(object.body, {
    headers,
  });
}
