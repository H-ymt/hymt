export function getKnowledgeKV(env: CloudflareEnv): KVNamespace | undefined {
  return env?.KNOWLEDGE_KV;
}

export function getFetchKnowledgeEnv(): {
  GITHUB_USERNAME?: string;
  GITHUB_TOKEN?: string;
  ZENN_USER?: string;
} {
  return {
    GITHUB_USERNAME: process.env.GITHUB_USERNAME,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    ZENN_USER: process.env.ZENN_USER,
  };
}
