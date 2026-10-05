"use client";

import { useEffect, useState } from "react";
import { scramble } from "./video-cipher";

type Entry = {
  url: Promise<string>;
  refs: number;
  controller: AbortController;
};

/**
 * One download per file, shared by every player on the page (a card's
 * preview and its immersive player point at the same film). The object URL is
 * revoked once nobody holds it any more.
 */
const cache = new Map<string, Entry>();

function acquire(src: string): Entry {
  let entry = cache.get(src);
  if (!entry) {
    const controller = new AbortController();
    const url = fetch(src, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${src}`);
        return res.arrayBuffer();
      })
      .then((buf) =>
        URL.createObjectURL(
          new Blob([scramble(new Uint8Array(buf))], { type: "video/mp4" }),
        ),
      );
    entry = { url, refs: 0, controller };
    cache.set(src, entry);
  }
  entry.refs++;
  return entry;
}

function release(src: string, entry: Entry) {
  entry.refs--;
  // Deferred so a release immediately followed by an acquire (Strict Mode's
  // double effect, a remount) reuses the download instead of restarting it.
  setTimeout(() => {
    if (entry.refs > 0 || cache.get(src) !== entry) return;
    cache.delete(src);
    entry.controller.abort();
    entry.url.then(URL.revokeObjectURL, () => {});
  }, 0);
}

/**
 * Fetches a scrambled film (`.dat`, see lib/video-cipher.ts), restores it and
 * serves it through a `blob:` URL, so download managers (IDM and the like)
 * never see a video on the wire. Nothing is fetched until `enabled` turns
 * true, and once started the download is kept, even if `enabled` turns false
 * again. If the fetch fails, the URL stays undefined and the poster shows.
 */
export function useBlobSrc(src: string, enabled: boolean): string | undefined {
  const [wanted, setWanted] = useState(enabled);
  const [resolved, setResolved] = useState<{ src: string; url: string }>();

  if (enabled && !wanted) setWanted(true);

  useEffect(() => {
    if (!wanted) return;
    let alive = true;
    const entry = acquire(src);
    entry.url.then(
      (url) => alive && setResolved({ src, url }),
      () => {
        /* the poster stays */
      },
    );
    return () => {
      alive = false;
      release(src, entry);
    };
  }, [src, wanted]);

  return resolved?.src === src ? resolved.url : undefined;
}
