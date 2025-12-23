"use client";

interface CloudflareLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudflareLoader({ src }: CloudflareLoaderProps) {
  // src は "/logo-nextjs.svg" のような形式を想定
  // 先頭のスラッシュを削除
  const cleanSrc = src.startsWith("/") ? src.slice(1) : src;

  // ローカル開発環境では、そのままのパスを返す
  if (process.env.NODE_ENV === "development") {
    return src;
  }

  // API Route経由でR2の画像を取得
  // Cloudflare Image ResizingはAPI経由では動作しないため、直接API routeを使用
  return `/api/assets/${cleanSrc}`;
}
