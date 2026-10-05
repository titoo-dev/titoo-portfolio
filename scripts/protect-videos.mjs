// Watermarks and scrambles the project films before they are served.
//
//   videos/<slug>/<name>.mp4          <- originals (git-ignored: the repo is public)
//   public/videos/<slug>/<name>.dat   <- generated here: watermarked, then
//                                        XOR-scrambled (lib/video-cipher.ts)
//
// The watermark is burnt into the pixels, so it survives a download or a screen
// recording; the scrambling only keeps download managers from spotting the file.
//
//   pnpm videos                  # needs ffmpeg/ffprobe on PATH
//   WATERMARK_FONT=/path/to.ttf pnpm videos
//
// Requires Node 22.18+ (imports the TypeScript cipher directly).

import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { scramble } from "../lib/video-cipher.ts";

const ROOT = resolve(import.meta.dirname, "..");
const SOURCE = join(ROOT, "videos");
const OUT = join(ROOT, "public", "videos");
const TEXT = "titosy.dev";
const FONT = process.env.WATERMARK_FONT ?? "C:/Windows/Fonts/seguisb.ttf";

if (!existsSync(FONT)) {
  console.error(`Font not found: ${FONT} (set WATERMARK_FONT)`);
  process.exit(1);
}

// drawtext options are `:`-separated, so the drive colon must be escaped.
const fontfile = FONT.replaceAll("\\", "/").replaceAll(":", "\\:");

function height(file) {
  const out = execFileSync("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=height",
    "-of",
    "csv=p=0",
    file,
  ]);
  // Streams with an ICC profile print extra side-data lines after the height.
  const h = Number.parseInt(String(out), 10);
  if (!Number.isFinite(h)) throw new Error(`No video height for ${file}`);
  return h;
}

/**
 * Bottom-right, sized from the frame height; a soft box keeps it legible on
 * light and dark shots. The bottom margin clears a Windows taskbar (Predict is
 * a desktop screen capture).
 */
function watermark(h) {
  const size = Math.round(h * 0.03);
  const pad = Math.round(h * 0.012);
  const side = Math.round(h * 0.035);
  const bottom = Math.round(h * 0.1);
  return [
    `drawtext=fontfile='${fontfile}'`,
    `text='${TEXT}'`,
    `fontsize=${size}`,
    "fontcolor=white@0.9",
    "box=1",
    "boxcolor=black@0.35",
    `boxborderw=${pad}`,
    `x=w-tw-${side + pad}`,
    `y=h-th-${bottom + pad}`,
  ].join(":");
}

const tmp = mkdtempSync(join(tmpdir(), "protect-videos-"));
try {
  for (const slug of readdirSync(SOURCE)) {
    for (const name of readdirSync(join(SOURCE, slug))) {
      if (!name.endsWith(".mp4")) continue;
      const src = join(SOURCE, slug, name);
      const marked = join(tmp, name);
      const dest = join(OUT, slug, name.replace(/\.mp4$/, ".dat"));

      execFileSync(
        "ffmpeg",
        [
          "-v",
          "error",
          "-y",
          "-i",
          src,
          "-vf",
          `${watermark(height(src))},format=yuv420p`,
          "-c:v",
          "libx264",
          "-preset",
          "slow",
          "-crf",
          "25",
          "-c:a",
          "copy",
          "-movflags",
          "+faststart",
          marked,
        ],
        { stdio: "inherit" },
      );

      mkdirSync(join(OUT, slug), { recursive: true });
      writeFileSync(dest, scramble(readFileSync(marked)));
      console.log(`${slug}/${name} -> ${dest.slice(ROOT.length + 1)}`);
    }
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
