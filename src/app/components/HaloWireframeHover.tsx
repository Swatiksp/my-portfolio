import { useState } from "react";
import img99 from "@/assets/halo/frames/99.png";
import img100 from "@/assets/halo/frames/100.png";
import img101 from "@/assets/halo/frames/101.png";
import img102 from "@/assets/halo/frames/102.png";
import img103 from "@/assets/halo/frames/103.png";
import img104 from "@/assets/halo/frames/104.png";

/** Figma component 291:1294 — 2×3 grid; hover enlarges one frame, neighbors fade. */
const CANVAS = { w: 1360, h: 569.5 };

const FRAMES = [
  { src: img99, alt: "Prepare — research the client’s situation", grid: { x: 0, y: 0.5, w: 444, h: 277 }, large: { x: 0, y: 0, w: 902, h: 563 } },
  { src: img100, alt: "Deck builder — choose a Halo conversation", grid: { x: 458.23, y: 0, w: 443.55, h: 277.41 }, large: { x: 229, y: 0, w: 910, h: 569 } },
  { src: img103, alt: "Deck builder — client interest areas", grid: { x: 915.68, y: 0, w: 444.32, h: 277.41 }, large: { x: 450, y: 0, w: 910, h: 569 } },
  { src: img101, alt: "Future of Work and Digital Core form", grid: { x: 0, y: 291.32, w: 444.32, h: 278.18 }, large: { x: 0, y: 0, w: 910, h: 570 } },
  { src: img102, alt: "Presentation deck is ready", grid: { x: 458.23, y: 291.32, w: 443.55, h: 278.18 }, large: { x: 229, y: 0.5, w: 910, h: 571 } },
  { src: img104, alt: "Solution finder offerings", grid: { x: 915.68, y: 291.32, w: 444.32, h: 277.41 }, large: { x: 450, y: 0, w: 910, h: 568 } },
] as const;

function pct(n: number, of: number) {
  return `${(n / of) * 100}%`;
}

export function HaloWireframeHover() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div
      className="relative w-full"
      onMouseLeave={() => setActive(null)}
      style={{
        aspectRatio: `${CANVAS.w} / ${CANVAS.h}`,
        overflow: "hidden",
      }}
    >
      {FRAMES.map((frame, i) => {
        const enlarged = active === i;
        const dimmed = active != null && !enlarged;
        const box = enlarged ? frame.large : frame.grid;
        return (
          <button
            key={frame.src}
            type="button"
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive((current) => (current === i ? null : current))}
            className="absolute p-0 border-none cursor-pointer overflow-hidden"
            style={{
              left: pct(box.x, CANVAS.w),
              top: pct(box.y, CANVAS.h),
              width: pct(box.w, CANVAS.w),
              height: pct(box.h, CANVAS.h),
              borderRadius: 15,
              outline: "none",
              background: "#ffffff",
              opacity: dimmed ? 0.2 : 1,
              zIndex: enlarged ? 3 : 1,
              transition:
                "left 280ms ease, top 280ms ease, width 280ms ease, height 280ms ease, opacity 280ms ease",
            }}
            aria-label={`Enlarge ${frame.alt}`}
          >
            <img src={frame.src} alt={enlarged || active == null ? frame.alt : ""} className="absolute inset-0 w-full h-full object-cover" />
          </button>
        );
      })}
    </div>
  );
}
