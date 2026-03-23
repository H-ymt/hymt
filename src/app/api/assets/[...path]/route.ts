import { getCloudflareContext } from "@opennextjs/cloudflare";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
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

  if (!headers.has("content-type")) {
    const ext = key.split(".").pop()?.toLowerCase();
    const contentType = getContentType(ext);
    if (contentType) {
      headers.set("Content-Type", contentType);
    }
  }

  return new NextResponse(object.body, {
    headers,
  });
}

function getContentType(ext?: string): string | undefined {
  if (!ext) return undefined;
  const map: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
    avif: "image/avif",
    ico: "image/x-icon",
  };
  return map[ext];
}
