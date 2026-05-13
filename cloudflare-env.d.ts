type KVNamespace = import("@cloudflare/workers-types").KVNamespace;

interface CloudflareEnv {
  KNOWLEDGE_KV?: KVNamespace;
  GITHUB_USERNAME?: string;
  GITHUB_TOKEN?: string;
  ZENN_USER?: string;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
}
