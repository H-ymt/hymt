import { readdir } from "fs/promises";
import { join, relative } from "path";
import { execSync } from "child_process";

const PUBLIC_DIR = join(process.cwd(), "public");
const BUCKET_NAME = "hymt-assets";
const ACCOUNT_ID = "06908d43a5be3581635f875e0293a770";

// アップロード対象の拡張子
const TARGET_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif"];

async function getFiles(dir: string): Promise<string[]> {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = join(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return files.flat();
}

async function main() {
  try {
    console.log(`[upload-assets] Scanning ${PUBLIC_DIR}...`);
    const allFiles = await getFiles(PUBLIC_DIR);

    const targetFiles = allFiles.filter((file) => {
      const ext = file.toLowerCase().slice(file.lastIndexOf("."));
      return TARGET_EXTENSIONS.includes(ext);
    });

    console.log(`[upload-assets] Found ${targetFiles.length} images to upload.`);

    for (const file of targetFiles) {
      const relativePath = relative(PUBLIC_DIR, file);
      // R2のパス（キー）は先頭にスラッシュを入れないのが一般的
      const key = relativePath;

      console.log(`[upload-assets] Uploading ${relativePath} to R2 bucket ${BUCKET_NAME}...`);

      const command = `CLOUDFLARE_ACCOUNT_ID=${ACCOUNT_ID} pnpm wrangler r2 object put "${BUCKET_NAME}/${key}" --file="${file}"`;

      try {
        execSync(command, { stdio: "inherit" });
      } catch (error) {
        console.error(`[upload-assets] Failed to upload ${relativePath}:`, error);
      }
    }

    console.log("[upload-assets] All assets processed.");
  } catch (error) {
    console.error("[upload-assets] Error:", error);
    process.exit(1);
  }
}

main();
