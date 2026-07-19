/**
 * Workers 互換の ETag ストア。
 * エッジ実行時はファイルシステムが使えないため、デフォルトは no-op。
 */
export async function getETag(_key: string): Promise<string | undefined> {
  return undefined;
}

export async function setETag(_key: string, _etag: string): Promise<void> {
  // no-op
}
