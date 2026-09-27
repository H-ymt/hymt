type KVNamespace = import("@cloudflare/workers-types").KVNamespace;

// send_email binding（Cloudflare Email Sending）のうち、このアプリが使う部分
interface SendEmailMessage {
  from: string;
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

interface SendEmailBinding {
  send(message: SendEmailMessage): Promise<{ messageId: string }>;
}

interface CloudflareEnv {
  KNOWLEDGE_KV?: KVNamespace;
  SEND_EMAIL?: SendEmailBinding;
  GITHUB_USERNAME?: string;
  GITHUB_TOKEN?: string;
  ZENN_USER?: string;
  TURNSTILE_SECRET_KEY?: string;
  CRON_SECRET?: string;
}
