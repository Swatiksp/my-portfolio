import { useEffect, type ReactNode } from "react";
import { CraftEnterLabel, useCraftEnterCursor } from "./CraftEnterCursor";

/**
 * The My Craft face for a project: a poster with the brand, one headline, two pills and the interface
 * cropped off the bottom edge. On hover the interface rises and tilts toward the pointer, a light follows
 * it across the screen, and the background drifts. ENTER follows the pointer.
 */
export function CraftPosterCard({
  variant,
  soon = false,
  screenNote,
  bg,
  shot,
  shotAlt,
  brand,
  headline,
  tags,
}: {
  variant: "s" | "p" | "h" | "t" | "m";
  /** The case study isn't ready: a construction icon follows the pointer instead of ENTER. */
  soon?: boolean;
  /** Text set on the interface frame while it's still a blank gradient. */
  screenNote?: string;
  bg?: string;
  shot: string;
  shotAlt: string;
  brand: ReactNode | null;
  headline: ReactNode;
  tags: string[];
}) {
  const { rootRef, enterRef } = useCraftEnterCursor();

  // Decode the images as soon as the card mounts, so the first scroll into My Craft doesn't pay for it.
  useEffect(() => {
    rootRef.current?.querySelectorAll("img").forEach((img) => {
      img.decode?.().catch(() => {});
    });
  }, [rootRef]);

  useEffect(() => {
    const card = rootRef.current;
    if (!card) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;
    const shotEl = card.querySelector<HTMLElement>(".poster-shot");
    if (!shotEl) return;

    const move = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      shotEl.style.setProperty("--mx", (x * 2 - 1).toFixed(3));
      shotEl.style.setProperty("--my", (y * 2 - 1).toFixed(3));
      const s = shotEl.getBoundingClientRect();
      shotEl.style.setProperty("--px", `${(((e.clientX - s.left) / s.width) * 100).toFixed(1)}%`);
      shotEl.style.setProperty("--py", `${(((e.clientY - s.top) / s.height) * 100).toFixed(1)}%`);
      card.style.setProperty("--bx", (x * 2 - 1).toFixed(3));
      card.style.setProperty("--by", (y * 2 - 1).toFixed(3));
    };
    const leave = () => {
      shotEl.style.setProperty("--mx", "0");
      shotEl.style.setProperty("--my", "0");
      card.style.setProperty("--bx", "0");
      card.style.setProperty("--by", "0");
    };
    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", leave);
    return () => {
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", leave);
    };
  }, [rootRef]);

  return (
    <div ref={rootRef} className={`poster poster-${variant}`}>
      {bg && <img src={bg} alt="" className="poster-bg" decoding="async" />}
      <div className="poster-top">
        {brand}
        <h3 className="poster-headline">{headline}</h3>
        <div className={`poster-tags${soon ? " poster-tags-wrap" : ""}`}>
          {tags.map((t) => (
            <span key={t} className="poster-tag">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="poster-shot">
        <img src={shot} alt={shotAlt} decoding="async" />
      </div>
      {screenNote && <p className="poster-screen-note">{screenNote}</p>}
      <CraftEnterLabel labelRef={enterRef} soon={soon} />
    </div>
  );
}
