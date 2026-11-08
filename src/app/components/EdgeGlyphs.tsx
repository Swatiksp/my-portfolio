import { useEffect, useState } from "react";

/* ───────────── Edge glyph columns ─────────────
   Figma "Example 1.1" (node 801:42150): two vertical auto-layouts of Yarndings 12 glyphs, one on each side edge of the
   page, below the nav. Each column is 70px wide with 10px padding around 61.2px glyphs (q, k, r, s repeating), no gap,
   in #f2ddcc, and sticks out 20px past the page edge so the pattern is cut off by the window. They stay put while the
   page scrolls. Hidden on narrow windows where they would run into the content. */

const GLYPHS = ["q", "k", "r", "s"];
const COLOR = "#f2ddcc";
const SIZE = 61.2;
const NAV_H = 66;
const COLUMN_W = 70;
const PAD = 10;
const OVERHANG = 20;
const MIN_WIDTH = 900;

function useViewport() {
  const read = () => ({
    w: typeof window === "undefined" ? 1440 : window.innerWidth,
    h: typeof window === "undefined" ? 900 : window.innerHeight,
  });
  const [size, setSize] = useState(read);
  useEffect(() => {
    const on = () => setSize(read());
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return size;
}

function Column({ side, count }: { side: "left" | "right"; count: number }) {
  return (
    <div
      aria-hidden
      className="fixed flex flex-col items-start overflow-hidden pointer-events-none select-none"
      style={{
        [side]: -OVERHANG,
        top: NAV_H + 32,
        bottom: 0,
        width: COLUMN_W,
        padding: PAD,
        justifyContent: "center",
        boxSizing: "border-box",
        zIndex: 1,
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="block shrink-0"
          style={{
            width: COLUMN_W - 2 * PAD,
            fontFamily: "'Yarndings 12', sans-serif",
            fontSize: SIZE,
            height: SIZE,
            lineHeight: `${SIZE}px`,
            color: COLOR,
          }}
        >
          {GLYPHS[i % GLYPHS.length]}
        </span>
      ))}
    </div>
  );
}

export function EdgeGlyphs() {
  const { w, h } = useViewport();
  if (w < MIN_WIDTH) return null;
  // As many glyphs as fit between the nav and the bottom of the window (16 in the 998px-tall Figma column).
  const count = Math.max(1, Math.floor((h - NAV_H - 2 * PAD) / SIZE));
  return (
    <>
      <Column side="left" count={count} />
      <Column side="right" count={count} />
    </>
  );
}
