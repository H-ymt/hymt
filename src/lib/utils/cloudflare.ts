import { env } from "cloudflare:workers";

export function getKnowledgeKV(): KVNamespace | undefined {
  return (env as CloudflareEnv).KNOWLEDGE_KV;
}

export function getFetchKnowledgeEnv(): {
  GITHUB_USERNAME?: string;
  GITHUB_TOKEN?: string;
  ZENN_USER?: string;
} {
  const cfEnv = env as CloudflareEnv;
  return {
    GITHUB_USERNAME: cfEnv.GITHUB_USERNAME || process.env.GITHUB_USERNAME,
    GITHUB_TOKEN: cfEnv.GITHUB_TOKEN || process.env.GITHUB_TOKEN,
    ZENN_USER: cfEnv.ZENN_USER || process.env.ZENN_USER,
  };
}
