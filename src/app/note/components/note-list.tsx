"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { KnowledgeEntry, Tag } from "../../../lib/types";
import styles from "../page.module.css";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function LoadingSpinner() {
  return (
    <svg
      className={styles.spinner}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75" strokeDasharray="31.416" strokeDashoffset="31.416">
        <animate attributeName="stroke-dashoffset" dur="1.5s" values="31.416;0" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

function SourceIcon({ source }: { source: "gist" | "zenn" }) {
  if (source === "gist") {
    return (
      <svg className={styles.sourceIcon} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
      </svg>
    );
  }

  return (
    <svg className={styles.sourceIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M.264 23.771h4.984c.264 0 .498-.147.645-.352L19.614.874c.176-.293-.029-.645-.381-.645h-4.72c-.235 0-.44.117-.557.323L.03 23.361c-.088.176.029.41.234.41zM17.445 23.419l6.479-10.408c.205-.323-.029-.733-.41-.733h-4.691c-.176 0-.352.088-.44.235l-6.655 10.643c-.176.264.029.616.352.616h4.779c.234-.001.468-.118.586-.353z" />
    </svg>
  );
}

async function fetchEntries(page: number): Promise<{ entries: KnowledgeEntry[]; hasMore: boolean }> {
  const res = await fetch(`/api/entries?page=${page}&limit=${ITEMS_PER_PAGE}`);
  if (!res.ok) {
    throw new Error("Failed to fetch entries");
  }
  return res.json();
}

export default function NoteList({ initialEntries }: { initialEntries: KnowledgeEntry[] }) {
  const observerTarget = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery({
    queryKey: ["entries"],
    queryFn: ({ pageParam = 1 }) => fetchEntries(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialData: {
      pages: [
        {
          entries: initialEntries.slice(0, ITEMS_PER_PAGE),
          hasMore: initialEntries.length > ITEMS_PER_PAGE,
        },
      ],
      pageParams: [1],
    },
    staleTime: 60 * 1000, // 1分
    // スクロール位置を保持するための設定
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.8, // 要素の80%が見えるまで待つ
        // 読み込み開始を遅らせるため、要素がほぼ完全に画面に入ってから読み込む
        rootMargin: "0px",
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allEntries = data?.pages.flatMap((page) => page.entries) ?? [];

  if (isPending && allEntries.length === 0) {
    return (
      <div className={styles.empty}>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (allEntries.length === 0) {
    return (
      <div className={styles.empty}>
        <p>記事がありません。</p>
        <p className={styles.emptySub}>entries.jsonを生成するには、fetch-knowledgeスクリプトを実行してください。</p>
      </div>
    );
  }

  return (
    <section className={styles.section}>
      <ul className={styles.entryList}>
        {allEntries.map((entry: KnowledgeEntry) => (
          <li key={entry.id} className={styles.entryItem}>
            <article className={styles.entry}>
              <header className={styles.entryHeader}>
                <div className={styles.entryMeta}>
                  <time className={styles.entryDate} dateTime={entry.publishedAt}>
                    {formatDate(entry.publishedAt)}
                  </time>
                </div>
                <h2 className={styles.entryTitle}>
                  <span className={styles.entrySource}>
                    <SourceIcon source={entry.source} />
                  </span>
                  <Link href={entry.url} target="_blank" rel="noopener noreferrer" className={styles.entryLink}>
                    {entry.title}
                    <svg
                      className={styles.externalIcon}
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M13 5H19V11" />
                      <path d="M19 5L5 19" />
                    </svg>
                  </Link>
                </h2>
              </header>
              {entry.summary && <p className={styles.entrySummary}>{entry.summary}</p>}
              {entry.tags.length > 0 && (
                <ul className={styles.tagList}>
                  {entry.tags.map((tag: Tag) => (
                    <li key={tag} className={styles.tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </li>
        ))}
      </ul>
      <div ref={observerTarget} className={styles.observerTarget}>
        {isFetchingNextPage && (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
            <p className={styles.loading}>読み込み中...</p>
          </div>
        )}
        {!hasNextPage && allEntries.length > 0 && null}
      </div>
    </section>
  );
}
