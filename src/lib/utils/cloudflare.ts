import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Cloudflare環境変数を取得する
 * getCloudflareContext()を優先し、利用できない場合はglobalThisから取得
 */
export function getCloudflareEnv(): CloudflareEnv | undefined {
  try {
    const context = getCloudflareContext();
    return context?.env as CloudflareEnv | undefined;
  } catch {
    // getCloudflareContextが利用できない場合は、globalThisから取得
    return (globalThis as unknown as { env?: CloudflareEnv }).env;
  }
}

/**
 * KVストレージの名前空間を取得する
 */
export function getKnowledgeKV(): KVNamespace | undefined {
  const env = getCloudflareEnv();
  return env?.KNOWLEDGE_KV;
}

/**
 * Cloudflare環境変数からfetch-knowledge用の環境変数を取得する
 */
export function getFetchKnowledgeEnv(): {
  GITHUB_USERNAME?: string;
  GITHUB_TOKEN?: string;
  ZENN_USER?: string;
} {
  const cloudflareEnv = getCloudflareEnv();
  return {
    GITHUB_USERNAME: cloudflareEnv?.GITHUB_USERNAME || process.env.GITHUB_USERNAME,
    GITHUB_TOKEN: cloudflareEnv?.GITHUB_TOKEN || process.env.GITHUB_TOKEN,
    ZENN_USER: cloudflareEnv?.ZENN_USER || process.env.ZENN_USER,
  };
}

