import cloudflare from "@astrojs/cloudflare";
import { cacheCloudflare } from "@astrojs/cloudflare/cache";
import { defineConfig } from "astro/config";
import { entriesCacheRule } from "./src/lib/constants";

export default defineConfig({
  output: "server",
  adapter: cloudflare({ prerenderEnvironment: "node" }),
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  experimental: {
    clientPrerender: true,
  },
  cache: {
    provider: cacheCloudflare(),
  },
  routeRules: {
    "/note": entriesCacheRule(),
    "/api/entries": entriesCacheRule(),
  },
});
