import { copyFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { FONT_SUBSET_DIR, FONT_WEIGHTS } from "../src/lib/constants";

const pkgDir = join(process.cwd(), "node_modules/gen-interface-jp");
const outDir = join(process.cwd(), "public", FONT_SUBSET_DIR);

/**
 * CDN の CSS は全 128 サブセットを絶対 URL で参照する。
 * 自ドメインから配信するため、@font-face をこちらで組み直す。
 * font-display は swap のまま（block は日本語サブセットだと FOIT が遷移ごとに出る）。
 */
async function buildFaceCss(weight: number): Promise<string> {
  // パッケージ同梱の CSS から unicode-range を拝借する。自前で持つと font 側の更新に追随できない。
  const src = await readFile(join(pkgDir, `${weight}.css`), "utf-8");
  const faces = src.match(/@font-face\{.*?\}/g);
  if (!faces) throw new Error(`@font-face not found in ${weight}.css`);

  return faces
    .map((face) => {
      const range = face.match(/unicode-range:([^;}]*)/)?.[1];
      const file = face
        .match(/url\("?([^")]+)"?\)/)?.[1]
        ?.split("/")
        .pop();
      if (!range || !file) throw new Error(`failed to parse @font-face in ${weight}.css`);
      return [
        "@font-face{",
        'font-family:"Gen Interface JP";',
        "font-style:normal;",
        `font-weight:${weight};`,
        "font-display:swap;",
        `src:url("/${FONT_SUBSET_DIR}/${weight}/${file}") format("woff2");`,
        `unicode-range:${range}`,
        "}",
      ].join("");
    })
    .join("\n");
}

async function copyWeight(weight: number): Promise<number> {
  const srcDir = join(pkgDir, "w/normal", String(weight));
  const destDir = join(outDir, String(weight));
  await mkdir(destDir, { recursive: true });

  const files = (await readdir(srcDir)).filter((f) => f.endsWith(".woff2"));
  await Promise.all(files.map((f) => copyFile(join(srcDir, f), join(destDir, f))));
  return files.length;
}

async function main(): Promise<void> {
  await mkdir(outDir, { recursive: true });

  let total = 0;
  const css: string[] = [];
  for (const weight of FONT_WEIGHTS) {
    total += await copyWeight(weight);
    css.push(await buildFaceCss(weight));
  }

  // OFL-1.1 の条件。フォントと一緒に配布する。
  await copyFile(join(pkgDir, "OFL.txt"), join(outDir, "OFL.txt"));

  await writeFile(join(process.cwd(), "src/styles/fonts.css"), `${css.join("\n")}\n`, "utf-8");

  console.log(`[copy-fonts] ${total} woff2 -> public/${FONT_SUBSET_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
