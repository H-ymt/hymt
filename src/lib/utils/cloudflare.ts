import { env } from "cloudflare:workers";

export function getKnowledgeKV(): KVNamespace | undefined {
  return (env as CloudflareEnv).KNOWLEDGE_KV;
}

export function getResendApiKey(): string | undefined {
  return (env as CloudflareEnv).RESEND_API_KEY;
}

export function getTurnstileSecretKey(): string | undefined {
  return (env as CloudflareEnv).TURNSTILE_SECRET_KEY;
}

export function getCronSecret(): string | undefined {
  return (env as CloudflareEnv).CRON_SECRET;
}

export function getFetchKnowledgeEnv(): {
  GITHUB_USERNAME?: string;
  GITHUB_TOKEN?: string;
  ZENN_USER?: string;
} {
  const cfEnv = env as CloudflareEnv;
  return {
    GITHUB_USERNAME: cfEnv.GITHUB_USERNAME,
    GITHUB_TOKEN: cfEnv.GITHUB_TOKEN,
    ZENN_USER: cfEnv.ZENN_USER,
  };
}
