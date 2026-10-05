"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useBlobSrc } from "@/lib/use-blob-src";

type Labels = {
  /** Accessible description of the video (no captions, so this is the text alternative). */
  video: string;
  play: string;
  close: string;
};

type ProjectVideoProps = {
  src: string;
  poster: string;
  /** WebVTT captions URL and its language. */
  captions: string;
  lang: string;
  /** Title shown in the player's header. */
  title: string;
  labels: Labels;
  /**
   * `preview`: muted loop that autoplays only while visible, with a play
   * button opening the immersive player (project cards).
   * `full`: native controls inline, sound available (case-study page).
   */
  mode?: "preview" | "full";
  className?: string;
};

/**
 * A project card that plays instead of a still. The preview plays only while
 * in view and only when the user allows motion, so a list of cards never turns
 * into a wall of autoplaying video; the poster shows everywhere else. The play
 * button opens the full player in a native <dialog>: top layer, Escape, focus
 * trapping and backdrop come for free. The film is served as a `blob:` URL
 * (see useBlobSrc), fetched once the card nears the viewport or the player
 * opens.
 */
export function ProjectVideo({
  src,
  poster,
  captions,
  lang,
  title,
  labels,
  mode = "preview",
  className = "",
}: ProjectVideoProps) {
  const inline = useRef<HTMLVideoElement>(null);
  const player = useRef<HTMLVideoElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [motion, setMotion] = useState(true);
  const [open, setOpen] = useState(false);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  // A still preview (reduced motion) has no use for the film until the player opens.
  const blob = useBlobSrc(src, open || (near && (mode === "full" || motion)));

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMotion(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // `near` starts the download a little ahead; `visible` drives playback.
  useEffect(() => {
    const el = inline.current;
    if (!el) return;
    const nearIo = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: "300px 0px" },
    );
    const viewIo = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.4 },
    );
    nearIo.observe(el);
    viewIo.observe(el);
    return () => {
      nearIo.disconnect();
      viewIo.disconnect();
    };
  }, []);

  // Autoplay the muted preview only while the card is on screen and the
  // player is closed; it resumes on its own when the player closes.
  useEffect(() => {
    const el = inline.current;
    if (!el || mode !== "preview" || !blob) return;
    if (motion && visible && !open) {
      el.play().catch(() => {
        /* autoplay refused: the poster stays, nothing to do */
      });
    } else {
      el.pause();
    }
  }, [mode, motion, visible, open, blob]);

  // Start the player once it is open and the film is there (it may still be
  // downloading when the play button is pressed).
  useEffect(() => {
    const v = player.current;
    if (!v || !open || !blob) return;
    v.play().catch(() => {
      /* the user can press play on the controls */
    });
  }, [open, blob]);

  const openPlayer = useCallback(() => {
    const d = dialog.current;
    if (!d) return;
    setOpen(true);
    if (!d.open) d.showModal();
    const v = player.current;
    if (v) {
      v.currentTime = 0;
      v.muted = false;
    }
  }, []);

  const closePlayer = useCallback(() => {
    const d = dialog.current;
    player.current?.pause();
    if (d?.open) d.close();
    setOpen(false);
  }, []);

  // Escape closes the dialog natively; keep React state in sync.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClose = () => {
      player.current?.pause();
      setOpen(false);
    };
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  // Freeze page scroll while the player is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (mode === "full") {
    return (
      <video
        ref={inline}
        src={blob}
        poster={poster}
        aria-label={labels.video}
        playsInline
        controls
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        preload="metadata"
        className={`h-full w-full object-cover object-top ${className}`}
      >
        <track kind="captions" src={captions} srcLang={lang} />
      </video>
    );
  }

  return (
    <>
      <video
        ref={inline}
        src={blob}
        poster={poster}
        aria-label={labels.video}
        muted
        loop
        playsInline
        onContextMenu={(e) => e.preventDefault()}
        preload="metadata"
        className={`h-full w-full object-cover object-top ${className}`}
      >
        {/* Captions describe on-screen text (no speech): available in the controls, off by default. */}
        <track kind="captions" src={captions} srcLang={lang} />
      </video>

      {/* Play button: sits above the preview, opens the immersive player. */}
      <button
        type="button"
        onClick={openPlayer}
        aria-label={labels.play}
        className="absolute inset-0 flex items-center justify-center bg-transparent transition-colors hover:bg-black/10 focus-visible:bg-black/10 focus-visible:outline-none"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-black shadow-[0_8px_30px_rgba(0,0,0,0.25)] ring-1 ring-black/10 backdrop-blur transition-transform duration-300 ease-out group-hover:scale-105">
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="currentColor"
            aria-hidden="true"
            className="ml-0.5"
          >
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
        </span>
      </button>

      {/* Immersive player. Backdrop click closes; the frame itself swallows clicks. */}
      <dialog
        ref={dialog}
        onClick={(e) => {
          if (e.target === e.currentTarget) closePlayer();
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") closePlayer();
        }}
        aria-label={title}
        className="video-player m-auto h-fit w-[min(96vw,1200px)] max-w-none overflow-visible border-0 bg-transparent p-0 text-white backdrop:bg-black/90 backdrop:backdrop-blur-md"
      >
        <div className="video-player-frame">
          <div className="mb-3 flex items-center justify-between px-1">
            <p className="font-medium text-sm text-white/90 tracking-tight">
              {title}
            </p>
            <button
              type="button"
              onClick={closePlayer}
              aria-label={labels.close}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className="overflow-hidden rounded-xl bg-black shadow-[0_40px_120px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
            {/* Same blob as the preview: opening the player downloads nothing new. */}
            <video
              ref={player}
              src={blob}
              poster={poster}
              aria-label={labels.video}
              playsInline
              controls
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              preload="none"
              className="aspect-video w-full"
            >
              <track kind="captions" src={captions} srcLang={lang} />
            </video>
          </div>
        </div>
      </dialog>
    </>
  );
}
