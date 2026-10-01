"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { GuideLines } from "./guide";

const Guide = dynamic(() => import("./guide"), { ssr: false });

/** The avatar guiding a section; skipped for reduced-motion visitors. */
export function SectionGuide({
  sectionId,
  lines,
}: {
  sectionId: string;
  lines: GuideLines;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(!matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return enabled ? <Guide sectionId={sectionId} lines={lines} /> : null;
}
