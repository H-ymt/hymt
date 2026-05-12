import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const wranglerJsonPath = join(process.cwd(), "dist/server/wrangler.json");

async function main() {
  const raw = await readFile(wranglerJsonPath, "utf-8");
  const config = JSON.parse(raw);

  if (Array.isArray(config.kv_namespaces)) {
    const seen = new Set<string>();
    config.kv_namespaces = config.kv_namespaces.filter(
      (kv: { binding: string }) => {
        if (seen.has(kv.binding)) return false;
        seen.add(kv.binding);
        return true;
      }
    );
  }

  await writeFile(wranglerJsonPath, JSON.stringify(config), "utf-8");
  console.log("[dedup-wrangler] Done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
