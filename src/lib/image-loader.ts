"use client";

interface CloudflareLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudflareLoader({ src, width, quality }: CloudflareLoaderProps) {
  // src は "/logo-nextjs.svg" のような形式を想定
  // 先頭のスラッシュを削除
  const cleanSrc = src.startsWith("/") ? src.slice(1) : src;

  // Cloudflare Image Resizing のパラメータ
  // format=auto はブラウザの対応状況に合わせて webp/avif などを自動選択します
  const params = [`width=${width}`, `quality=${quality || 75}`, "format=auto", "fit=cover"].join(",");

  // 本番環境（Cloudflare上）では相対パスで /cdn-cgi/image/... を使用
  // ローカル開発環境では、Cloudflare のドメインが未定のため、そのままのパスを返すか、
  // もし特定のテスト用ドメインがある場合はそれを指定します。

  if (process.env.NODE_ENV === "development") {
    return src;
  }

  // API Route経由でR2の画像を取得するように変更
  return `/cdn-cgi/image/${params}/api/assets/${cleanSrc}`;
}
