import { useEffect, useLayoutEffect, useRef, useState } from "react";

/* Case study section bar: pinned under the site nav. Story segments sit first
   and read louder than Research. The fill follows the section in view. */

const FOREST = "#1f3d2b";
const ACTIVE_TEXT = "#e1eae3";
const BAR_H = 32;

export const PROGRESS_BAR_HEIGHT = BAR_H;

export type ProgressItem = {
  label: string;
  short?: string;
  group?: "story" | "research";
};

const FULL_LABELS_MIN_WIDTH = 1280;

function useRoomForFullLabels() {
  const query = `(min-width: ${FULL_LABELS_MIN_WIDTH}px)`;
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return wide;
}

export function SectionProgressBar({
  items,
  activeIndex,
  onSelect,
  offsetTop = 66,
  dark = false,
}: {
  items: ProgressItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  offsetTop?: number;
  dark?: boolean;
}) {
  const segRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rowRef = useRef<HTMLDivElement>(null);
  const [fill, setFill] = useState<{ left: number; width: number } | null>(null);
  const [animate, setAnimate] = useState(false);
  const fullLabels = useRoomForFullLabels();

  useLayoutEffect(() => {
    const measure = () => {
      const el = segRefs.current[activeIndex];
      const row = rowRef.current;
      if (!el || !row) return;
      const next = { left: el.offsetLeft, width: el.offsetWidth };
      setFill((p) => (p && p.left === next.left && p.width === next.width ? p : next));
    };
    measure();
    const row = rowRef.current;
    if (!row) return;
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    return () => ro.disconnect();
  }, [activeIndex, items.length, fullLabels]);

  useEffect(() => {
    if (fill && !animate) {
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }
  }, [fill, animate]);

  const firstResearch = items.findIndex((item) => item.group === "research");

  return (
    <nav
      aria-label="Case study sections"
      className="fixed left-0 right-0 hidden min-[900px]:block"
      style={{
        top: offsetTop,
        height: BAR_H,
        zIndex: 45,
        background: dark ? "rgba(11,12,14,0.92)" : "rgba(255,255,255,0.92)",
        borderBottom: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(42,32,24,0.1)",
        transition: "background 500ms ease, border-color 500ms ease",
      }}
    >
      <div ref={rowRef} className="relative flex w-full h-full">
        {fill && (
          <div
            aria-hidden
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{
              left: fill.left,
              width: fill.width,
              background: FOREST,
              transition: animate
                ? "left 450ms cubic-bezier(0.25, 0.46, 0.45, 0.94), width 450ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                : "none",
            }}
          />
        )}
        {items.map((item, i) => {
          const active = i === activeIndex;
          const research = item.group === "research";
          const splitBefore = firstResearch > 0 && i === firstResearch;
          return (
            <button
              key={item.label}
              ref={(el) => {
                segRefs.current[i] = el;
              }}
              type="button"
              aria-current={active ? "true" : undefined}
              onClick={() => onSelect(i)}
              className="relative border-none bg-transparent cursor-pointer p-0 flex items-center justify-center whitespace-nowrap overflow-hidden"
              style={{
                flex: research ? (active ? "0.85 1 auto" : "0.7 1 auto") : active ? "1.15 0 auto" : "1 1 auto",
                minWidth: 0,
                marginLeft: splitBefore ? 10 : 0,
                padding: fullLabels ? "0 10px" : "0 8px",
                fontFamily: "'Roboto Condensed', 'Roboto', sans-serif",
                fontSize: 12,
                lineHeight: "16px",
                fontWeight: active ? 700 : research ? 400 : 500,
                letterSpacing: research && !active ? "0.4px" : undefined,
                textTransform: "uppercase",
                textOverflow: "ellipsis",
                color: active ? ACTIVE_TEXT : dark ? (research ? "rgba(255,255,255,0.5)" : "#ffffff") : research ? "rgba(0,0,0,0.46)" : "#000000",
                opacity: research && !active ? 0.9 : 1,
                transition: "color 500ms ease",
                boxShadow: splitBefore ? "inset 1px 0 0 rgba(42,32,24,0.16)" : undefined,
              }}
            >
              <span className="overflow-hidden text-ellipsis">
                {active || fullLabels ? item.label : item.short ?? item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
