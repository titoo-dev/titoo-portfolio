"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { PixelArrow } from "./pixel";

type Project = {
  name: string;
  description: string;
  url: string | null;
  github?: string | null;
  images?: string[];
  highlights?: string[];
};

// Compact project rows with a cursor-following screenshot preview on
// pointer-fine devices (paco.me-style hover peek).
export function ProjectList({ projects }: { projects: Project[] }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const canHover = useRef<boolean | null>(null);

  const hoverable = () => {
    if (canHover.current === null) {
      canHover.current = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      ).matches;
    }
    return canHover.current;
  };

  return (
    <>
      <ul className="flex flex-col">
        {projects.map((project) => {
          const href = project.url ?? project.github ?? undefined;
          const image = project.images?.[0];
          const Row = (
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-mono text-[15px] font-medium text-fg">
                {project.name}
              </span>
              <span className="h-px flex-1 bg-hairline" aria-hidden />
              {href && (
                <span className="row-arrow text-faint group-hover:text-accent">
                  <PixelArrow />
                </span>
              )}
            </div>
          );

          const body = (
            <>
              {Row}
              <p className="mt-2 text-[15.5px] leading-relaxed text-muted">
                {project.description}
              </p>
              {project.github && project.url && (
                <span className="label mt-1 inline-block text-faint">
                  web + source
                </span>
              )}
            </>
          );

          return (
            <li
              key={project.name}
              className="border-b border-hairline last:border-0"
            >
              {href ? (
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group -mx-4 block px-4 py-6 transition-colors duration-150 hover:bg-tint focus-visible:bg-tint"
                  onMouseEnter={() => {
                    if (image && hoverable()) setPreview(image);
                  }}
                  onMouseMove={(e) => {
                    if (image && hoverable()) {
                      setPos({ x: e.clientX, y: e.clientY });
                    }
                  }}
                  onMouseLeave={() => setPreview(null)}
                >
                  {body}
                </Link>
              ) : (
                <div className="-mx-4 px-4 py-6">{body}</div>
              )}
            </li>
          );
        })}
      </ul>

      {preview && (
        <div
          className="pointer-events-none fixed z-50 hidden md:block"
          style={{
            left: Math.min(pos.x + 20, window.innerWidth - 360),
            top: Math.min(pos.y + 16, window.innerHeight - 235),
          }}
        >
          <Image
            src={preview}
            alt=""
            width={340}
            height={213}
            className="border border-hairline-strong bg-bg object-cover"
            style={{ width: 340, height: 213 }}
          />
        </div>
      )}
    </>
  );
}
