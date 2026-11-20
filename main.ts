// gta6-clipper-01 — entrypoint (Node 22, standard library only).
//
// The entry is the YouTube video itself, not this program. All this file
// does is hand the house the video's address: it reads VIDEO.json from the
// repository root and writes the same bytes to the output directory, where
// the gate reads it and looks the video up through the YouTube Data API.
// Nothing written here about the video is scored.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// It prints nothing on success and exits non-zero if VIDEO.json is missing
// or is not a JSON object with a url string.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const sourcePath = join(repoRoot, "VIDEO.json");
const targetPath = join(outDir, "VIDEO.json");

const raw = readFileSync(sourcePath, "utf8");
const parsed: unknown = JSON.parse(raw);
if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
  throw new Error("VIDEO.json must be a JSON object");
}
if (typeof (parsed as { url?: unknown }).url !== "string") {
  throw new Error("VIDEO.json must carry a url string");
}
const videoUrl = (parsed as { url: string }).url;
let parsedUrl: URL;
try {
  parsedUrl = new URL(videoUrl);
} catch {
  throw new Error(`VIDEO.json url is not a valid URL: ${videoUrl}`);
}
if (parsedUrl.protocol !== "https:") {
  throw new Error(`VIDEO.json url must use https:, got ${parsedUrl.protocol}`);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(targetPath, raw);
