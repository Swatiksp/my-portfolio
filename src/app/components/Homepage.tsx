import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import linkedInIcon from "@/imports/Frame7/b9ce6f119974543779bbcad7563e234be8edd900.png";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useMotionValue,
  useSpring,
  animate as motionAnimate,
  type MotionValue,
} from "motion/react";
import { PROJECTS } from "../data/projects";
import { FrostBitmap, useFrostBitmaps } from "../lib/frostBitmaps";
import { GlyphCursorTrail } from "./GlyphCursorTrail";
import { PrismCraftCard } from "./PrismCraftCard";
import { HaloCraftCard } from "./HaloCraftCard";

/* ───────────────────────── Design tokens (from Figma "Homepage") ───────────────────────── */
const COLORS = {
  forest: "#1f3d2b",
  cream: "#fbf6ec",
  black: "#000000", // headings and labels (Figma "text/ink")
  ink: "#2a2018", // body copy and nav
  inkMuted: "#7b6a58",
};
// Headings, nav and labels: Roboto Condensed Bold. Body: Roboto. Glyphs: Yarndings 12.
const FONT_SANS = "'Roboto', sans-serif";
const FONT_COND = "'Roboto Condensed', 'Roboto', sans-serif";
const FONT_DING = "'Yarndings 12', sans-serif";

const NAV_H = 66;
const WRAPPER_SPRING = { type: "spring" as const, stiffness: 55, damping: 22 };

/* Subtle Unseen-style viewpoint: the staircase is one shallow set. Pointer looks around it.
   Magnitudes stay small so the Figma layout still reads as the rest pose. */
const LOOK_SPRING = { stiffness: 48, damping: 24, mass: 0.55 };
const LOOK_ROTATE_Y = 4.2; // deg at the screen edge
const LOOK_ROTATE_X = -2.8;
const LOOK_SHIFT_X = 16; // px on the nearest (largest) tile
const LOOK_SHIFT_Y = 10;

/* Ceramic glaze: cursor-as-light. The highlight always follows the cursor (even off the tiles); the nearest
   tile gets the strongest sheen. NEIGHBOUR_FALLOFF is how quickly the others drop off relative to the nearest. */
const GLAZE_NEIGHBOUR_FALLOFF_PX = 420;

function useHeroLook(active: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, LOOK_SPRING);
  const y = useSpring(rawY, LOOK_SPRING);

  useEffect(() => {
    if (!active) {
      rawX.set(0);
      rawY.set(0);
      return;
    }

    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)");
    if (!hover.matches || !motionOk.matches) return;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      rawX.set((event.clientX / window.innerWidth) * 2 - 1);
      rawY.set((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [active, rawX, rawY]);

  return { x, y };
}

function useTileGlaze() {
  useEffect(() => {
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)");
    if (!hover.matches || !motionOk.matches) return;

    let tiles = Array.from(document.querySelectorAll<HTMLElement>("[data-tile-glaze]"));
    let raf = 0;
    let pending: { x: number; y: number } | null = null;

    const refresh = () => {
      tiles = Array.from(document.querySelectorAll<HTMLElement>("[data-tile-glaze]"));
    };

    const apply = (x: number, y: number) => {
      const rects = tiles.map((el) => el.getBoundingClientRect());
      const dists = rects.map((r) => {
        const dx = x < r.left ? r.left - x : x > r.right ? x - r.right : 0;
        const dy = y < r.top ? r.top - y : y > r.bottom ? y - r.bottom : 0;
        return Math.hypot(dx, dy);
      });
      const nearest = Math.min(...dists);
      for (let i = 0; i < tiles.length; i++) {
        const r = rects[i];
        // Full strength on the closest tile; neighbours fade by how much farther they are.
        const glow = Math.max(0, 1 - (dists[i] - nearest) / GLAZE_NEIGHBOUR_FALLOFF_PX);
        const el = tiles[i];
        el.style.setProperty("--mx", `${x - r.left}px`);
        el.style.setProperty("--my", `${y - r.top}px`);
        el.style.setProperty("--glow", glow.toFixed(3));
      }
    };

    const onMove = (e: PointerEvent) => {
      pending = { x: e.clientX, y: e.clientY };
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (pending) apply(pending.x, pending.y);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", refresh);
    window.addEventListener("scroll", refresh, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("scroll", refresh);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}

/* ───────────────────────── Tile geometry ───────────────────────── */
// Every tile is a glass card: 1px border + 20px padding around a 16:9 image.
const CARD_PAD = 20;
const CARD_BORDER = 1;
const CARD_CHROME = (CARD_PAD + CARD_BORDER) * 2; // horizontal / vertical non-image space
const CARD_RADIUS = 20;
const IMAGE_RADIUS = 15;
const INFO_H = 130; // title + description + tags shown when the tile is in the grid

const DESIGN_W = 1440;
const pct = (px: number) => (px / DESIGN_W) * 100;

/** Outer card height for a given outer width, keeping the image locked to 16:9. */
const cardHeight = (outerW: number, extra = 0) => ((outerW - CARD_CHROME) * 9) / 16 + CARD_CHROME + extra;

// Staircase (hero) — index 0 is the smallest/top-right tile (Tile 5), index 4 is the largest (Tile 1).
// Figma "Homepage" (674:1250): outer-card position/width on the 1440px frame. The glass padding grows with the
// tile (10 → 18) and the photo is 1.791 : 1.
const STAIRCASE_DESIGN = [
  { top: 162, left: 1134, width: 226, pad: 10 },
  { top: 261, left: 965, width: 289, pad: 12 },
  { top: 371, left: 732, width: 406, pad: 14 },
  { top: 504, left: 387, width: 573, pad: 16 },
  { top: 625, left: 74, width: 638, pad: 18 },
];
const STAIR_IMAGE_RATIO = 0.5583; // height / width of the photo in the hero tiles

// Grid — 2 columns × 3 rows. With 5 tiles, the last row holds a single tile in the left column.
const GRID_W_PCT = 43.2;
const GRID_COL_L = 5.56;
const GRID_COL_R = 52.6;
const CARD_GAP = 36;
const GRID_TITLE_TOP = 86;
const GRID_TOP_PAD = 152;

// Staggered (closing) layout — tiles flank the centered text.
const STAG_W_PCT = 22.7;
const STAGGERED_DESIGN = [
  { top: 116, left: 9.72 },
  { top: 116, left: 67.57 },
  { top: 414, left: -1.39 },
  { top: 414, left: 78.68 },
  { top: 712, left: (100 - STAG_W_PCT) / 2 },
];

interface Rect {
  top: number;
  left: number; // %
  width: number; // %
  height: number; // px
}

function buildLayouts(viewportW: number) {
  const toPx = (p: number) => (p / 100) * viewportW;

  const staircase: Rect[] = STAIRCASE_DESIGN.map((c) => ({
    top: c.top,
    left: pct(c.left),
    width: pct(c.width),
    height: (toPx(pct(c.width)) - 2 * c.pad - 2) * STAIR_IMAGE_RATIO + 2 * c.pad + 2,
  }));

  const gridH = cardHeight(toPx(GRID_W_PCT), INFO_H);
  const gridLefts = [GRID_COL_L, GRID_COL_R, GRID_COL_L, GRID_COL_R, GRID_COL_L];
  const gridRows = [0, 0, 1, 1, 2];
  const grid: Rect[] = gridLefts.map((left, i) => ({
    top: GRID_TOP_PAD + gridRows[i] * (gridH + CARD_GAP),
    left,
    width: GRID_W_PCT,
    height: gridH,
  }));
  const gridTotalH = GRID_TOP_PAD + gridH * 3 + CARD_GAP * 2;

  const stagH = cardHeight(toPx(STAG_W_PCT));
  const staggered: Rect[] = STAGGERED_DESIGN.map((c) => ({
    top: c.top,
    left: c.left,
    width: STAG_W_PCT,
    height: stagH,
  }));

  return { staircase, grid, staggered, gridTotalH };
}

function useViewport() {
  const read = () => ({
    w: typeof window !== "undefined" ? window.innerWidth : DESIGN_W,
    h: typeof window !== "undefined" ? window.innerHeight : 900,
  });
  const [size, setSize] = useState(read);
  useEffect(() => {
    const onResize = () => setSize(read());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

/* ───────────────────────── Card ───────────────────────── */
const glassFace: React.CSSProperties = {
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  background: "rgba(255,255,255,0.55)",
  border: `${CARD_BORDER}px solid rgba(255,255,255,0.9)`,
  borderRadius: CARD_RADIUS,
  padding: CARD_PAD,
  filter: "drop-shadow(0px 16px 20px rgba(89,51,13,0.24))",
  boxSizing: "border-box",
};

function TileImage({
  src,
  flatSrc,
  flatten = false,
  aspect = "16 / 9",
  flat = false,
  glaze = false,
  dark = false,
}: {
  src: string;
  flatSrc?: ImageBitmap;
  flatten?: boolean;
  aspect?: string;
  flat?: boolean;
  glaze?: boolean;
  dark?: boolean;
}) {
  const [svgReady, setSvgReady] = useState(!dark);

  useEffect(() => {
    if (!dark) {
      setSvgReady(true);
      return;
    }
    setSvgReady(false);
    let cancelled = false;
    const img = new Image();
    img.src = src;
    const done = () => {
      if (!cancelled) setSvgReady(true);
    };
    img.decode().then(done).catch(done);
    return () => {
      cancelled = true;
    };
  }, [dark, src]);

  const useFlat = Boolean(dark && flatSrc && (flatten || !svgReady));

  return (
    <div
      className={`relative w-full shrink-0${glaze && !dark ? " tile-glaze" : ""}`}
      data-tile-glaze={glaze && !dark ? "" : undefined}
      style={{
        aspectRatio: aspect,
        borderRadius: IMAGE_RADIUS,
        boxShadow: dark || flat ? "none" : "0px 2px 7px 5px rgba(0,0,0,0.1)",
        background: dark ? "rgba(255,255,255,0.1)" : undefined,
      }}
    >
      {useFlat && flatSrc ? (
        <FrostBitmap bitmap={flatSrc} radius={IMAGE_RADIUS} />
      ) : (
        <img
          src={src}
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ borderRadius: IMAGE_RADIUS }}
        />
      )}
    </div>
  );
}

function Card({
  index,
  isGrid,
  isStaggered,
  layouts,
  onNavigate,
  dark,
  frostBitmaps,
  lookX,
  lookY,
}: {
  index: number;
  isGrid: boolean;
  isStaggered: boolean;
  layouts: ReturnType<typeof buildLayouts>;
  onNavigate: (slug: string) => void;
  dark: boolean;
  frostBitmaps: Record<string, ImageBitmap>;
  lookX: MotionValue<number>;
  lookY: MotionValue<number>;
}) {
  const last = PROJECTS.length - 1;
  const from = layouts.staircase[index];
  const toGrid = layouts.grid[last - index];
  const toStag = layouts.staggered[last - index];
  const project = PROJECTS[last - index];
  const tileSrc = dark ? project.frost : project.image;
  const flatSrc = frostBitmaps[project.frost];
  const faceStyle: React.CSSProperties = dark ? { ...glassFace, filter: "none" } : glassFace;

  const delay = isStaggered
    ? index * 0.06
    : isGrid
    ? index * 0.07
    : (PROJECTS.length - 1 - index) * 0.05;

  const target = isStaggered ? toStag : isGrid ? toGrid : from;
  const isRightCol = toGrid.left === GRID_COL_R;
  const interactive = isGrid && !isStaggered;
  const isHero = !isGrid && !isStaggered;
  const layoutKey = isStaggered ? "stag" : isGrid ? "grid" : "hero";
  const layoutRef = useRef(layoutKey);
  const pendingAnims = useRef(0);
  const [flatten, setFlatten] = useState(false);

  if (layoutRef.current !== layoutKey) {
    layoutRef.current = layoutKey;
    if (!flatten) setFlatten(true);
  }

  useEffect(() => {
    if (!flatten) return;
    const timeout = window.setTimeout(() => {
      pendingAnims.current = 0;
      setFlatten(false);
    }, 1800);
    return () => window.clearTimeout(timeout);
  }, [flatten, layoutKey]);

  const onAnimStart = () => {
    pendingAnims.current += 1;
    setFlatten(true);
  };
  const onAnimComplete = () => {
    pendingAnims.current = Math.max(0, pendingAnims.current - 1);
    if (pendingAnims.current === 0) setFlatten(false);
  };

  // Larger staircase tiles sit closer, so they travel a little more than the small ones.
  const depth = 0.4 + (index / Math.max(1, last)) * 0.6;
  const lookShiftX = useTransform(lookX, (v) => v * depth * LOOK_SHIFT_X);
  const lookShiftY = useTransform(lookY, (v) => v * depth * LOOK_SHIFT_Y);

  return (
    <motion.div
      className={`absolute${isHero ? " hero-tile" : ""}`}
      style={{ perspective: "1200px", x: lookShiftX, y: lookShiftY }}
      initial={{
        top: from.top,
        left: `${from.left}%`,
        width: `${from.width}%`,
        height: from.height,
      }}
      animate={{
        top: target.top,
        left: `${target.left}%`,
        width: `${target.width}%`,
        height: target.height,
      }}
      transition={{ type: "spring", stiffness: 70, damping: 18, delay }}
      onAnimationStart={onAnimStart}
      onAnimationComplete={onAnimComplete}
    >
      <div
        className={isHero ? "hero-tile-shadow w-full h-full" : "w-full h-full"}
        style={{ transformStyle: "preserve-3d" }}
      >
      <motion.div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          cursor: interactive ? "pointer" : "default",
        }}
        animate={{ rotateY: isStaggered ? 180 : isGrid ? 0 : 180 }}
        transition={{ type: "spring", stiffness: 80, damping: 18, delay: delay + 0.05 }}
        onAnimationStart={onAnimStart}
        onAnimationComplete={onAnimComplete}
        onClick={() => interactive && onNavigate(project.slug)}
      >
        {/* Back face — image-only glass tile (staircase + staggered states) */}
        <div
          className="absolute inset-0 flex flex-col items-start"
          style={{
            ...faceStyle,
            filter: isHero || dark ? "none" : glassFace.filter,
            transform: "rotateY(180deg)",
            // Hero staircase: padding grows with the tile (Figma). The closing layout keeps the standard 20px.
            padding: isStaggered ? CARD_PAD : STAIRCASE_DESIGN[index].pad,
          }}
        >
          <TileImage
            src={tileSrc}
            flatSrc={flatSrc}
            flatten={flatten}
            aspect={isStaggered ? "16 / 9" : `1 / ${STAIR_IMAGE_RATIO}`}
            flat={!isStaggered && index >= 3}
            glaze
            dark={dark}
          />
        </div>

        {/* Front face — live case studies keep the glass tile chrome and reveal the craft card. */}
        {project.slug === "prism" || project.slug === "halo-conversations" ? (
          <div
            className={`craft-card-face absolute inset-0 flex flex-col overflow-hidden${isRightCol ? " craft-chrome-end" : ""}`}
            style={faceStyle}
          >
            <div
              className="relative w-full h-full min-h-0"
              style={{
                borderRadius: IMAGE_RADIUS,
                overflow: "hidden",
                boxShadow: dark ? "none" : "0px 2px 7px 5px rgba(0,0,0,0.1)",
              }}
            >
              {project.slug === "prism" ? <PrismCraftCard /> : <HaloCraftCard />}
            </div>
          </div>
        ) : (
        <div className="absolute inset-0 flex flex-col overflow-hidden" style={faceStyle}>
          <TileImage src={tileSrc} flatSrc={flatSrc} flatten={flatten} dark={dark} />

          <div className="flex flex-col gap-[10px] flex-1 min-h-0 overflow-hidden" style={{ paddingTop: 16 }}>
            <span
              className="leading-none"
              style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: "24px", color: dark ? "#ffffff" : COLORS.black }}
            >
              {project.title}
            </span>
            <p
              className="m-0 leading-snug"
              style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: "14px", color: dark ? "rgba(255,255,255,0.82)" : COLORS.ink }}
            >
              {project.desc}
            </p>
            <div className="flex gap-[8px] flex-wrap">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-[10px] py-[5px] rounded-[4px]"
                  style={{
                    background: dark ? "rgba(255,255,255,0.12)" : "rgba(31,61,43,0.08)",
                    color: dark ? "#ffffff" : COLORS.forest,
                    fontFamily: FONT_SANS,
                    fontWeight: 500,
                    fontSize: "12px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        )}
      </motion.div>
      </div>
    </motion.div>
  );
}

/* ───────────────────────── Page ───────────────────────── */
export function Homepage() {
  const navigate = useNavigate();
  const [isGrid, setIsGrid] = useState(false);
  const [isStaggered, setIsStaggered] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const frostBitmaps = useFrostBitmaps(darkMode);
  useTileGlaze();
  const look = useHeroLook(!isGrid && !isStaggered);
  const lookRotateY = useTransform(look.x, (v) => v * LOOK_ROTATE_Y);
  const lookRotateX = useTransform(look.y, (v) => v * LOOK_ROTATE_X);

  // Light: white page. Dark: black page. The cream gradient is for other routes.
  useEffect(() => {
    const els = [document.documentElement, document.body];
    els.forEach((el) => {
      el.style.backgroundColor = darkMode ? "#000000" : "#ffffff";
      el.style.backgroundImage = "none";
    });
    return () => {
      els.forEach((el) => {
        el.style.backgroundColor = "";
        el.style.backgroundImage = "";
      });
    };
  }, [darkMode]);

  const { w: viewportW, h: vh } = useViewport();
  const layouts = useMemo(() => buildLayouts(viewportW), [viewportW]);

  const { scrollY } = useScroll();
  const contentH = vh - NAV_H;

  const animEnd = vh * 1.8;
  const maxGridScroll = Math.max(0, layouts.gridTotalH - contentH + 60);
  const maxScrollY = animEnd + maxGridScroll * 1.2;
  const staggeredStart = maxScrollY + vh * 0.05;
  const wrapperH = staggeredStart + vh * 1.5;

  const scrollYProgress = useTransform(scrollY, [0, animEnd], [0, 1], { clamp: true });

  const gridScrollY = useTransform(scrollY, [animEnd, maxScrollY], [0, -maxGridScroll], { clamp: true });

  const staggeredOffset = useMotionValue(0);
  const wrapperY = useTransform(
    [gridScrollY, staggeredOffset] as const,
    ([gY, sO]: number[]) => gY + sO
  );

  useEffect(() => {
    motionAnimate(staggeredOffset, isStaggered ? maxGridScroll : 0, WRAPPER_SPRING);
  }, [isStaggered, maxGridScroll]);

  const heroOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const heroX = useTransform(scrollYProgress, [0, 0.28], [0, -140]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > 0.35 && !isGrid) setIsGrid(true);
    if (v < 0.28 && isGrid) setIsGrid(false);
  });

  useMotionValueEvent(scrollY, "change", (v) => {
    if (v > staggeredStart && !isStaggered) setIsStaggered(true);
    if (v < staggeredStart - vh * 0.15 && isStaggered) setIsStaggered(false);
  });

  const handleNavigate = (slug: string) => {
    navigate(`/projects/${slug}`);
  };

  const scrollTo = (top: number) => window.scrollTo({ top, behavior: "smooth" });

  const heading = darkMode ? "#ffffff" : COLORS.black;
  const copy = darkMode ? "#ffffff" : COLORS.ink;
  const muted = darkMode ? "rgba(255,255,255,0.62)" : COLORS.inkMuted;
  const mark = darkMode ? "#ffffff" : COLORS.forest;

  const navLinkStyle: React.CSSProperties = {
    fontFamily: FONT_COND,
    fontWeight: 700,
    fontSize: "14px",
    lineHeight: "24px",
    letterSpacing: "1.12px",
    color: copy,
    textDecoration: "none",
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
  };

  const primaryButton: React.CSSProperties = {
    background: darkMode ? "#ffffff" : COLORS.forest,
    color: darkMode ? "#000000" : COLORS.cream,
    fontFamily: FONT_COND,
    fontWeight: 700,
    fontSize: "14px",
    lineHeight: "24px",
    letterSpacing: "1.12px",
    borderRadius: 4,
    border: "none",
    padding: "10px 20px",
    cursor: "pointer",
  };

  return (
    <div className={`w-full${darkMode ? " home-dark" : ""}`} style={{ fontFamily: FONT_SANS, background: darkMode ? "#000000" : "#ffffff", color: copy }}>
      {/* Cursor glyph trail (sits behind the page content, above the white page background) */}
      <GlyphCursorTrail />

      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center"
        style={{
          height: NAV_H,
          paddingLeft: 71,
          paddingRight: 80,
          paddingBottom: 1,
          background: darkMode ? "rgba(0,0,0,0.92)" : "rgba(255,255,255,0.92)",
          borderBottom: darkMode ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(42,32,24,0.1)",
        }}
      >
        <div className="flex flex-1 items-center justify-between">
          <button
            aria-label="Back to top"
            onClick={() => scrollTo(0)}
            className="shrink-0 border-none cursor-pointer p-0"
            style={{ width: 44, height: 44, background: mark, borderRadius: 4 }}
          />
          <div className="flex items-center gap-[40px]">
            <button
              type="button"
              onClick={() => setDarkMode((v) => !v)}
              className="hover:opacity-60 transition-opacity"
              style={navLinkStyle}
              aria-pressed={darkMode}
            >
              {darkMode ? "LIGHT MODE" : "DARK MODE"}
            </button>
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                scrollTo(animEnd);
              }}
              className="hover:opacity-60 transition-opacity"
              style={navLinkStyle}
            >
              WORK
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollTo(staggeredStart + 1);
              }}
              className="hover:opacity-60 transition-opacity"
              style={navLinkStyle}
            >
              ABOUT
            </a>
            <button className="hover:opacity-85 transition-opacity" style={primaryButton}>
              VIEW RESUME
            </button>
          </div>
        </div>
      </nav>

      {/* Scroll space */}
      <div style={{ height: `${wrapperH}px` }}>
        <div className="sticky overflow-hidden" style={{ top: 0, height: "100vh" }}>
          <div className="relative w-full" style={{ height: "100vh" }}>
            {/* Hero text */}
            <motion.div
              className="absolute flex flex-col"
              style={{
                left: 70,
                top: 162,
                width: 595,
                gap: 20,
                opacity: heroOpacity,
                x: heroX,
              }}
            >
              <div className="flex flex-col" style={{ gap: 11.487 }}>
                <div className="flex flex-col" style={{ gap: 20 }}>
                  <p
                    className="m-0 whitespace-nowrap [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                    style={{
                      fontFamily: FONT_SANS,
                      fontWeight: 700,
                      fontSize: "16px",
                      lineHeight: "25.6px",
                      color: heading,
                    }}
                  >
                    Glad you’re here!
                  </p>
                  <p
                    className="m-0 uppercase [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                    style={{
                      fontFamily: FONT_COND,
                      fontWeight: 700,
                      fontSize: "36px",
                      lineHeight: "57.6px",
                      color: heading,
                    }}
                  >
                    I’m Swatik
                  </p>
                </div>
                <p
                  className="m-0"
                  style={{
                    fontFamily: FONT_SANS,
                    fontWeight: 400,
                    fontSize: "20px",
                    lineHeight: "32px",
                    color: copy,
                  }}
                >
                  A UX designer crafting intuitive digital experiences that leverage emerging technologies,
                  enhance usability, and create meaningful connections.
                </p>
              </div>

              <div className="flex flex-col" style={{ gap: 3, fontFamily: FONT_SANS }}>
                <p className="m-0" style={{ fontWeight: 700, fontSize: "16px", color: heading }}>
                  Previously designed at
                </p>
                <p className="m-0 whitespace-nowrap" style={{ fontWeight: 400, fontSize: "20px", color: copy }}>
                  Accenture Microsoft Business Group
                </p>
              </div>

              <div className="flex flex-col" style={{ gap: 3, fontFamily: FONT_SANS }}>
                <p className="m-0" style={{ fontWeight: 700, fontSize: "16px", color: heading }}>
                  Currently Studying at
                </p>
                <div className="flex items-center" style={{ gap: 10 }}>
                  <p className="m-0 whitespace-nowrap" style={{ fontWeight: 400, fontSize: "20px", color: copy }}>
                    North Carolina State University
                  </p>
                  <div className="flex items-center">
                    <span
                      aria-hidden
                      className="flex items-center justify-center shrink-0"
                      style={{ width: 26.163, height: 26.163, marginRight: -2 }}
                    >
                      <span
                        style={{
                          display: "block",
                          transform: "rotate(45deg)",
                          fontFamily: FONT_DING,
                          fontSize: "20px",
                          lineHeight: "normal",
                          color: copy,
                        }}
                      >
                        H
                      </span>
                    </span>
                    <p
                      className="m-0 uppercase whitespace-nowrap"
                      style={{ fontFamily: FONT_COND, fontWeight: 700, fontSize: "20px", color: copy }}
                    >
                      gowolfpack!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Caption under the staircase (Figma 865:1254) */}
            <motion.div
              className="absolute flex flex-col"
              style={{
                right: 80,
                bottom: 26,
                width: 292,
                opacity: heroOpacity,
                x: heroX,
              }}
            >
              <p
                className="m-0"
                style={{
                  fontFamily: FONT_COND,
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "25.6px",
                  color: copy,
                }}
              >
                Each tile represents a body of work.
              </p>
              <p
                className="m-0 flex items-center"
                style={{
                  fontFamily: FONT_COND,
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "26px",
                  color: copy,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    fontFamily: FONT_DING,
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "26px",
                    color: heading,
                    marginRight: 6,
                  }}
                >
                  z
                </span>
                <span style={{ fontWeight: 700 }}>Scroll down</span>
                <span>&nbsp;to view the work behind them.</span>
              </p>
            </motion.div>

            {/* Cards wrapper — slight camera look in the hero; springs back to rest once the grid takes over. */}
            <motion.div
              className="absolute inset-0"
              style={{
                y: wrapperY,
                rotateX: lookRotateX,
                rotateY: lookRotateY,
                transformPerspective: 1600,
                transformOrigin: "70% 48%",
              }}
            >
              {/* My Craft title */}
              <motion.h2
                className="absolute m-0 [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                style={{
                  top: GRID_TITLE_TOP,
                  left: `${GRID_COL_L}%`,
                  fontFamily: FONT_COND,
                  fontWeight: 700,
                  fontSize: "36px",
                  textTransform: "uppercase",
                  color: heading,
                }}
                animate={isGrid && !isStaggered ? { opacity: 1, x: 0 } : { opacity: 0, x: -48 }}
                transition={
                  isGrid && !isStaggered
                    ? { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }
                    : { duration: 0.15, ease: "easeIn", delay: 0 }
                }
              >
                My Craft
              </motion.h2>

              {PROJECTS.map((_, i) => (
                <Card
                  key={i}
                  index={i}
                  isGrid={isGrid}
                  isStaggered={isStaggered}
                  layouts={layouts}
                  onNavigate={handleNavigate}
                  dark={darkMode}
                  frostBitmaps={frostBitmaps}
                  lookX={look.x}
                  lookY={look.y}
                />
              ))}
            </motion.div>

            {/* Closing statement, centered between the staggered tiles */}
            <motion.div
              className="absolute pointer-events-none"
              style={{ left: "50%", top: "50%", x: "-50%", y: "-50%", width: 478 }}
              animate={
                isStaggered
                  ? { opacity: 1, scale: 1, pointerEvents: "auto" }
                  : { opacity: 0, scale: 0.92, pointerEvents: "none" }
              }
              transition={
                isStaggered
                  ? { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.25 }
                  : { duration: 0.2, ease: "easeIn" }
              }
            >
              <div className="flex flex-col gap-[20px] items-center">
                <p
                  className="text-center m-0 leading-normal"
                  style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: "26px", lineHeight: "40px", color: heading }}
                >
                  A text here that describes what this portfolio entails and elaborates on its curation.
                </p>
                <div className="flex gap-[11px] items-center">
                  <button style={primaryButton}>About me</button>
                  <button className="flex items-center gap-[10px]" style={primaryButton}>
                    Let's Connect
                    <img src={linkedInIcon} alt="LinkedIn" className="w-[17px] h-[16px] object-cover" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="relative w-full flex flex-col gap-[60px] px-[80px] pt-[40px] pb-[80px] overflow-hidden"
        style={{ borderTop: darkMode ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(42,32,24,0.1)" }}
      >
        <div className="flex items-start justify-between w-full">
          <div className="flex items-center gap-[10px]">
            <div className="shrink-0" style={{ width: 33, height: 33, background: mark, borderRadius: 4 }} />
            <p
              className="m-0 whitespace-nowrap"
              style={{ fontFamily: FONT_COND, fontWeight: 700, fontSize: "36px", textTransform: "uppercase", color: heading }}
            >
              Swatik SP
            </p>
          </div>
          <div className="flex flex-col gap-[20px]">
            {["About me", "My work"].map((link) => (
              <a
                key={link}
                href="#"
                className="hover:opacity-60 transition-opacity"
                style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: "16px", color: copy, textDecoration: "none" }}
              >
                {link}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-[10px]">
            {["Let's work together!", "spswatik@gmail.com"].map((line) => (
              <p key={line} className="m-0" style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: "16px", color: copy }}>
                {line}
              </p>
            ))}
          </div>
        </div>
        <p
          className="text-center w-full m-0"
          style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: "16px", color: muted }}
        >
          Built on Figma
        </p>
      </footer>
    </div>
  );
}
