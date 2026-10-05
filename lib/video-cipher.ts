/**
 * XOR scrambling of the project films: scripts/protect-videos.mjs writes them
 * scrambled, useBlobSrc restores them in the browser. Served as opaque `.dat`
 * bytes, they no longer look like video to download managers (IDM and the
 * like), and a grabbed file doesn't play. Obfuscation, not encryption: the key
 * ships with the page, which is why the films also carry a watermark.
 *
 * Kept free of imports and TS-only syntax so Node can run it directly.
 */
const KEY = Uint8Array.from(
  "4f0783ce2f8eccc9bde18daf7fdee7e542305bfd576052507f5b429176c6713b".match(
    /../g,
  ) ?? [],
  (byte) => Number.parseInt(byte, 16),
);

/** Scrambles or restores `bytes` in place (XOR is its own inverse). */
export function scramble<T extends Uint8Array>(bytes: T): T {
  for (let i = 0; i < bytes.length; i++) bytes[i] ^= KEY[i % KEY.length];
  return bytes;
}
