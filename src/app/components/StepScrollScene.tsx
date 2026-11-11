import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { useIsMobile } from "../lib/useIsMobile";

/* ───────────── Pinned step-scroll scene ─────────────
   Figma: "Idea for The problem, what we learned and the turning point" (node 818:3621).

   State 2 (start)  Left column (heading + copy) and a right column of numbered steps, step [1] level with the heading.
   State 1 (end)    The right column has slid UP inside a clipped frame, so the last step now sits at the top. The left
                    column never moves. The step that is level with the top is the "active" one (set in bold).

   The scene pins itself (position: sticky) while the steps travel, then lets go so the page carries on to the next
   section. Because it is a tall container with a sticky stage, the section keeps the page's focus for its whole length. */

const NAV_H = 66;
const HOLD_START = 40; // scroll px before anything moves
const HOLD_END = 140; // scroll px the last step stays put before the scene releases
const SPEED = 1.5; // scroll px per px the steps travel

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const stickyTopFor = (vh: number, stageH: number) => Math.max(NAV_H + 24, (vh - stageH + NAV_H) / 2);

type Props = {
  left: ReactNode;
  count: number;
  renderStep: (index: number, active: boolean) => ReactNode;
  /** Vertical gap between steps (px). */
  gap?: number;
  /** Where the last step comes to rest, measured from the top of the right column (px). */
  endOffset?: number;
};

export function StepScrollScene(props: Props) {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  if (mobile) return <StackedScene {...props} />;
  return reduced ? <StaticScene {...props} /> : <ScrubbedScene {...props} />;
}

/** Phones: nothing is pinned. The copy sits above the steps, and the step nearest the middle of the screen is the active one. */
function StackedScene({ left, count, renderStep, gap = 20 }: Props) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      const mid = window.innerHeight * 0.55;
      let best = 0;
      let bestDist = Infinity;
      refs.current.slice(0, count).forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = mid < r.top ? r.top - mid : mid > r.bottom ? mid - r.bottom : 0;
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive((a) => (a === best ? a : best));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count]);
  return (
    <div className="w-full flex flex-col" style={{ gap: 32 }}>
      <div>{left}</div>
      <div className="flex flex-col" style={{ gap: gap + 8 }}>
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
          >
            {renderStep(i, i === active)}
          </div>
        ))}
      </div>
    </div>
  );
}

const GRID = { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", columnGap: 20 } as const;

/** Reduced motion: both columns in normal flow, nothing pinned or moving. */
function StaticScene({ left, count, renderStep, gap = 20 }: Props) {
  return (
    <div className="w-full" style={{ ...GRID, alignItems: "start" }}>
      <div>{left}</div>
      <div className="flex flex-col" style={{ gap }}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i}>{renderStep(i, false)}</div>
        ))}
      </div>
    </div>
  );
}

type Geo = { stageH: number; shift: number; tops: number[] };

function ScrubbedScene({ left, count, renderStep, gap = 20, endOffset = 0 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [active, setActive] = useState(0);
  const [vh, setVh] = useState(() => (typeof window === "undefined" ? 900 : window.innerHeight));
  const [geo, setGeo] = useState<Geo>({ stageH: 0, shift: 0, tops: [] });

  const geoRef = useRef(geo);
  geoRef.current = geo;
  const activeRef = useRef(0);

  const stickyTop = stickyTopFor(vh, geo.stageH);
  const stickyRef = useRef(stickyTop);
  stickyRef.current = stickyTop;
  const travel = HOLD_START + geo.shift * SPEED + HOLD_END;

  // Measure the layout (re-run when the width changes or fonts finish loading).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const inner = innerRef.current;
      const leftEl = leftRef.current;
      if (!inner || !leftEl) return;
      const tops = stepRefs.current.slice(0, count).map((s) => (s ? s.offsetTop : 0));
      const stageH = Math.ceil(Math.max(inner.offsetHeight, leftEl.offsetHeight));
      const shift = Math.max(0, (tops[tops.length - 1] ?? 0) - endOffset);
      setGeo((prev) =>
        prev.stageH === stageH && prev.shift === shift && prev.tops.length === tops.length && prev.tops.every((t, i) => t === tops[i])
          ? prev
          : { stageH, shift, tops },
      );
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [count, endOffset]);

  // Scroll → slide the steps.
  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      const container = containerRef.current;
      const inner = innerRef.current;
      if (!container || !inner) return;
      const g = geoRef.current;
      const total = HOLD_START + g.shift * SPEED + HOLD_END;
      const t = clamp(stickyRef.current - container.getBoundingClientRect().top, 0, total);
      const p = g.shift > 0 ? clamp((t - HOLD_START) / (g.shift * SPEED), 0, 1) : 0;
      const s = p * g.shift;

      inner.style.transform = `translate3d(0, ${(-s).toFixed(2)}px, 0)`;
      if (clipRef.current) {
        // Soft top edge while steps are leaving; gone once the last step has come to rest.
        const fade = Math.min(s, 28) * (1 - clamp((p - 0.88) / 0.1, 0, 1));
        const mask = fade > 0.5 ? `linear-gradient(to bottom, transparent 0, #000 ${fade.toFixed(1)}px)` : "none";
        clipRef.current.style.maskImage = mask;
        clipRef.current.style.webkitMaskImage = mask;
      }

      // Active step = the one closest to the top of the frame.
      let best = 0;
      let bestDist = Infinity;
      g.tops.forEach((top, i) => {
        const d = Math.abs(top - endOffset * p - s);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      if (best !== activeRef.current) {
        activeRef.current = best;
        setActive(best);
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [geo, vh, endOffset]);

  const ready = geo.stageH > 0;

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: ready ? geo.stageH + travel : undefined }}>
      <div className="sticky w-full" style={{ top: stickyTop, height: ready ? geo.stageH : undefined }}>
        <div style={{ ...GRID, alignItems: "start", height: "100%" }}>
          <div ref={leftRef}>{left}</div>
          <div ref={clipRef} className="relative overflow-hidden" style={{ height: ready ? geo.stageH : undefined }}>
            <div ref={innerRef} className="relative flex flex-col" style={{ gap, willChange: "transform" }}>
              {Array.from({ length: count }, (_, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                >
                  {renderStep(i, i === active)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
