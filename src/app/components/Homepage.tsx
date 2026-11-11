import { CompanyMarquee } from "./CompanyMarquee";
import { ToolMarks } from "./ToolMarks";
import { AboutCta } from "./AboutCta";
import { TypeIn } from "./TypeIn";
import logoMark from "@/assets/logo/logo.svg";
import { useState, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
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
import { PROJECTS, isOpenable } from "../data/projects";
import { FrostBitmap, useFrostBitmaps } from "../lib/frostBitmaps";
import { GlyphCursorTrail } from "./GlyphCursorTrail";
import { PrismCraftCard } from "./PrismCraftCard";
import { HaloCraftCard } from "./HaloCraftCard";
import { ProjectSCraftCard } from "./ProjectSCraftCard";
import { ThesisCraftCard } from "./ThesisCraftCard";
import { ShowcaseCraftCard } from "./ShowcaseCraftCard";
import { MobileHomepage } from "./MobileHome";
import { useIsMobile } from "../lib/useIsMobile";

/* ───────────────────────── Design tokens (from Figma "Homepage") ───────────────────────── */
const CRAFT_SLUGS = new Set(["prism", "halo-conversations", "project-s", "thesis", "microsoft-showcase"]);
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

// TODO: replace with the real LinkedIn profile URL.
const LINKEDIN_URL = "https://www.linkedin.com/in/swatik-s-p-909bb9233/";

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
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", refresh);
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

  return { staircase, grid, gridTotalH };
}

function useViewport() {
  const read = () => ({
    w: typeof window !== "undefined" ? document.documentElement.clientWidth || window.innerWidth : DESIGN_W,
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
  // box-shadow, not a drop-shadow filter: filters on big 3D-transformed tiles repaint every frame while scrolling.
  boxShadow: "0px 16px 20px rgba(89,51,13,0.24)",
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
  moving = false,
}: {
  src: string;
  flatSrc?: ImageBitmap;
  flatten?: boolean;
  aspect?: string;
  flat?: boolean;
  glaze?: boolean;
  dark?: boolean;
  moving?: boolean;
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
      data-moving={moving ? "" : undefined}
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
  layouts,
  onNavigate,
  dark,
  frostBitmaps,
  lookX,
  lookY,
  viewportW,
}: {
  index: number;
  viewportW: number;
  isGrid: boolean;
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
  const project = PROJECTS[last - index];
  const tileSrc = dark ? project.frost : project.image;
  const flatSrc = frostBitmaps[project.frost];

  const delay = isGrid ? index * 0.07 : (PROJECTS.length - 1 - index) * 0.05;

  const target = isGrid ? toGrid : from;
  const isRightCol = toGrid.left === GRID_COL_R;
  const interactive = isGrid && isOpenable(project);
  const isHero = !isGrid;
  const faceStyle: React.CSSProperties = dark ? { ...glassFace, boxShadow: "none" } : isHero ? { ...glassFace, boxShadow: "none" } : glassFace;
  const layoutKey = isGrid ? "grid" : "hero";
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

  // One spring (0 → 1) carries the tile from its old rectangle to the new one.
  const fromRect = useRef<Rect>(target);
  const toRect = useRef<Rect>(target);
  const progress = useMotionValue(1);
  const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
  const rectAt = (p: number): Rect => ({
    top: lerp(fromRect.current.top, toRect.current.top, p),
    left: lerp(fromRect.current.left, toRect.current.left, p),
    width: lerp(fromRect.current.width, toRect.current.width, p),
    height: lerp(fromRect.current.height, toRect.current.height, p),
  });
  const boxTop = useTransform(progress, (p) => rectAt(p).top);
  const boxLeft = useTransform(progress, (p) => `${rectAt(p).left}%`);
  const boxWidth = useTransform(progress, (p) => `${rectAt(p).width}%`);
  const boxHeight = useTransform(progress, (p) => rectAt(p).height);

  // The craft poster is laid out once, at its grid size, and only scaled while the tile resizes. Re-flowing its
  // container-query text on every frame of the flip is what made the transition stutter.
  const CHROME = (CARD_PAD + CARD_BORDER) * 2;
  const gridInnerW = (toGrid.width / 100) * viewportW - CHROME;
  const gridInnerH = toGrid.height - CHROME;
  const posterScaleX = useTransform(progress, (p) => ((rectAt(p).width / 100) * viewportW - CHROME) / gridInnerW);
  const posterScaleY = useTransform(progress, (p) => (rectAt(p).height - CHROME) / gridInnerH);

  const lastLayout = useRef({ key: layoutKey, target, viewportW });
  useLayoutEffect(() => {
    const prev = lastLayout.current;
    const changedKey = prev.key !== layoutKey;
    const cur = rectAt(progress.get());
    lastLayout.current = { key: layoutKey, target, viewportW };
    fromRect.current = changedKey ? cur : target;
    toRect.current = target;
    if (!changedKey && prev.viewportW === viewportW && prev.target === target) return;
    progress.stop();
    if (changedKey) {
      progress.set(0);
      progress.jump(0); // clears the velocity that resetting the value would otherwise hand to the spring
      onAnimStart();
      const controls = motionAnimate(progress, 1, { type: "spring", stiffness: 70, damping: 18, velocity: 0, delay });
      controls.then(onAnimComplete);
      return () => controls.stop();
    }
    // a window resize: snap to the new rectangle
    progress.set(1 - 1e-9);
    progress.set(1);
  }, [layoutKey, target, viewportW]);

  // Larger staircase tiles sit closer, so they travel a little more than the small ones.
  const depth = 0.4 + (index / Math.max(1, last)) * 0.6;
  const lookShiftX = useTransform(lookX, (v) => v * depth * LOOK_SHIFT_X);
  const lookShiftY = useTransform(lookY, (v) => v * depth * LOOK_SHIFT_Y);

  return (
    <motion.div
      className={`absolute${isHero ? " hero-tile" : ""}`}
      style={{ perspective: "1200px", x: lookShiftX, y: lookShiftY, top: boxTop, left: boxLeft, width: boxWidth, height: boxHeight, contain: "layout style" }}
      // On load the tiles just dissolve in; the spring only moves them when the layout changes.
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: (PROJECTS.length - 1 - index) * 0.06, ease: "easeOut" }}
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
          willChange: "transform",
        }}
        initial={false}
        animate={{ rotateY: isGrid ? 0 : 180 }}
        transition={{ type: "spring", stiffness: 80, damping: 18, delay: delay + 0.05 }}
        onAnimationStart={onAnimStart}
        onAnimationComplete={onAnimComplete}
        onClick={() => interactive && onNavigate(project.slug)}
      >
        {/* Back face — image-only glass tile (staircase) */}
        <div
          className="absolute inset-0 flex flex-col items-start"
          style={{
            ...faceStyle,
            boxShadow: isHero || dark ? "none" : glassFace.boxShadow,
            transform: "rotateY(180deg)",
            // Hero staircase: padding grows with the tile (Figma).
            padding: STAIRCASE_DESIGN[index].pad,
          }}
        >
          <TileImage
            src={tileSrc}
            flatSrc={flatSrc}
            flatten={flatten}
            aspect={`1 / ${STAIR_IMAGE_RATIO}`}
            flat={index >= 3}
            glaze
            moving={flatten}
            dark={dark}
          />
        </div>

        {/* Front face — live case studies keep the glass tile chrome and reveal the craft card. */}
        {CRAFT_SLUGS.has(project.slug) ? (
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
              <motion.div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: gridInnerW,
                  height: gridInnerH,
                  scaleX: posterScaleX,
                  scaleY: posterScaleY,
                  transformOrigin: "0 0",
                  willChange: "transform",
                }}
              >
                {project.slug === "prism" ? (
                  <PrismCraftCard />
                ) : project.slug === "project-s" ? (
                  <ProjectSCraftCard />
                ) : project.slug === "thesis" ? (
                  <ThesisCraftCard />
                ) : project.slug === "microsoft-showcase" ? (
                  <ShowcaseCraftCard />
                ) : (
                  <HaloCraftCard />
                )}
              </motion.div>
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
  // Phones get their own single-column layout; the pinned scroll-driven staircase below is the desktop page.
  const isMobile = useIsMobile();
  return isMobile ? <MobileHomepage /> : <DesktopHomepage />;
}

function DesktopHomepage() {
  const navigate = useNavigate();
  const [isGrid, setIsGrid] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [aboutHover, setAboutHover] = useState(false); // hovering the footer ABOUT ME button lights up ABOUT in the nav
  const [wolf, setWolf] = useState(false); // easter egg: hovering GOWOLFPACK swaps the glyph for a wolf
  const wolfRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // The cards layer sits over the intro text and catches the pointer, so test the pointer against the text's box.
    const onMove = (e: PointerEvent) => {
      const r = wolfRef.current?.getBoundingClientRect();
      const inside = !!r && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      setWolf((w) => (w === inside ? w : inside));
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  const frostBitmaps = useFrostBitmaps(darkMode);
  useTileGlaze();
  const look = useHeroLook(!isGrid);
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
  // The grid has finished scrolling at maxScrollY; one more screen of scroll lets the pinned stage release into the footer.
  const wrapperH = maxScrollY + vh;

  const scrollYProgress = useTransform(scrollY, [0, animEnd], [0, 1], { clamp: true });

  const gridScrollY = useTransform(scrollY, [animEnd, maxScrollY], [0, -maxGridScroll], { clamp: true });

  const wrapperY = gridScrollY;

  const heroOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const heroX = useTransform(scrollYProgress, [0, 0.28], [0, -140]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > 0.35 && !isGrid) setIsGrid(true);
    if (v < 0.28 && isGrid) setIsGrid(false);
  });

  const handleNavigate = (slug: string) => {
    navigate(`/projects/${slug}`);
  };

  const scrollTo = (top: number) => window.scrollTo({ top, behavior: "smooth" });

  // arriving from another page's WORK link (/#work): open on the work grid
  const { hash } = useLocation();
  useEffect(() => {
    if (hash !== "#work") return;
    const id = requestAnimationFrame(() => window.scrollTo({ top: animEnd }));
    return () => cancelAnimationFrame(id);
  }, [hash, animEnd]);
  const aboutRef = useRef<HTMLDivElement>(null);
  const scrollToAbout = () => navigate("/about");

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
            style={{ width: 44, height: 44, background: `url("${logoMark}") center / cover no-repeat`, borderRadius: 4 }}
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
                scrollToAbout();
              }}
              className="hover:opacity-60 transition-opacity"
              style={
                aboutHover
                  ? { ...navLinkStyle, color: mark, textDecoration: "underline", textDecorationThickness: 2, textUnderlineOffset: 8 }
                  : navLinkStyle
              }
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
                top: 135,
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
                    <TypeIn text="Glad you’re here!" />
                  </p>
                  <p
                    className="m-0 [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                    style={{
                      fontFamily: "'Newsreader', 'Iowan Old Style', Georgia, serif",
                      fontOpticalSizing: "auto",
                      fontWeight: 700,
                      fontSize: "52px",
                      lineHeight: "57.6px",
                      letterSpacing: "-0.02em",
                      color: heading,
                    }}
                  >
                    <TypeIn text="I’m Swatik" />
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
                  <TypeIn text="Designing digital systems and the relationships people have with them, through product and interaction design." />
                </p>
              </div>

              <CompanyMarquee dark={darkMode} />

              <div className="flex flex-col" style={{ gap: 3, fontFamily: FONT_SANS }}>
                <p className="m-0" style={{ fontWeight: 700, fontSize: "16px", color: heading }}>
                  <TypeIn text="Previously designed at" />
                </p>
                <p className="m-0 whitespace-nowrap" style={{ fontWeight: 400, fontSize: "20px", color: copy }}>
                  <TypeIn text="Accenture Microsoft Business Group" />
                </p>
              </div>

              <div className="flex flex-col" style={{ gap: 3, fontFamily: FONT_SANS }}>
                <p className="m-0" style={{ fontWeight: 700, fontSize: "16px", color: heading }}>
                  <TypeIn text="Currently Studying at" />
                </p>
                <div className="flex items-center" style={{ gap: 10 }}>
                  <p className="m-0 whitespace-nowrap" style={{ fontWeight: 400, fontSize: "20px", color: copy }}>
                    <TypeIn text="North Carolina State University" />
                  </p>
                  <div ref={wolfRef} className="flex items-center">
                    <span
                      aria-hidden
                      className="flex items-center justify-center shrink-0"
                      style={{ width: 26.163, height: 26.163, marginRight: -2 }}
                    >
                      {wolf ? (
                        <span style={{ display: "block", fontSize: "20px", lineHeight: 1, fontFamily: "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif" }}>
                          🐺
                        </span>
                      ) : (
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
                      )}
                    </span>
                    <p
                      className="m-0 uppercase whitespace-nowrap"
                      style={{ fontFamily: FONT_COND, fontWeight: 700, fontSize: "20px", color: copy }}
                    >
                      <TypeIn text="gowolfpack!" />
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
                <TypeIn text="Each tile represents a body of work." />
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
                <span style={{ fontWeight: 700 }}><TypeIn text="Scroll down" /></span>
                <span><TypeIn text={"\u00A0to view the work behind them."} /></span>
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
                initial={false}
                className="absolute m-0 [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                style={{
                  top: GRID_TITLE_TOP,
                  left: `${GRID_COL_L}%`,
                  fontFamily: "'Newsreader', 'Iowan Old Style', Georgia, serif",
                  fontWeight: 400,
                  fontSize: "52px",
                  letterSpacing: "-0.02em",
                  color: heading,
                }}
                animate={isGrid ? { opacity: 1, x: 0 } : { opacity: 0, x: -48 }}
                transition={
                  isGrid
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
                  layouts={layouts}
                  onNavigate={handleNavigate}
                  dark={darkMode}
                  frostBitmaps={frostBitmaps}
                  lookX={look.x}
                  lookY={look.y}
                  viewportW={viewportW}
                />
              ))}
            </motion.div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="relative w-full flex flex-col overflow-hidden"
        style={{
          padding: "72px 80px 32px",
          gap: 64,
          borderTop: darkMode ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(42,32,24,0.1)",
        }}
      >
        <div
          ref={aboutRef}
          id="about"
          className="flex items-center justify-between w-full"
          style={{ gap: 32, flexWrap: "wrap", paddingBottom: 56, borderBottom: darkMode ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(42,32,24,0.1)" }}
        >
          <div className="flex flex-col" style={{ gap: 12, maxWidth: 640 }}>
            <p
              className="m-0"
              style={{
                fontFamily: "'Newsreader', 'Iowan Old Style', Georgia, serif",
                fontWeight: 400,
                fontSize: "44px",
                lineHeight: "50px",
                letterSpacing: "-0.02em",
                color: heading,
              }}
            >
              Want to know more about me?
            </p>
          </div>
          <AboutCta buttonStyle={primaryButton} dark={darkMode} onHoverChange={setAboutHover} onClick={() => navigate("/about")} />
        </div>

        <div className="flex items-end justify-between w-full" style={{ gap: 48, flexWrap: "wrap" }}>
          <div className="flex flex-col" style={{ gap: 20, maxWidth: 640 }}>
            <p
              className="m-0"
              style={{
                fontFamily: "'Newsreader', 'Iowan Old Style', Georgia, serif",
                fontWeight: 400,
                fontSize: "52px",
                lineHeight: "57.6px",
                letterSpacing: "-0.02em",
                color: heading,
              }}
            >
              Let’s work together.
            </p>
            <div className="flex items-center">
              <a href="mailto:spswatik@gmail.com" className="hover:opacity-85 transition-opacity" style={{ ...primaryButton, textDecoration: "none", display: "inline-block" }}>
                SPSWATIK@GMAIL.COM
              </a>
            </div>
          </div>

          <div className="flex flex-col" style={{ gap: 14, alignItems: "flex-start", minWidth: 160 }}>
            <span style={{ ...navLinkStyle, color: muted, cursor: "default" }}>EXPLORE</span>
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
                scrollToAbout();
              }}
              className="hover:opacity-60 transition-opacity"
              style={navLinkStyle}
            >
              ABOUT
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity" style={navLinkStyle}>
              LINKEDIN ↗
            </a>
            <button type="button" onClick={() => scrollTo(0)} className="hover:opacity-60 transition-opacity" style={navLinkStyle}>
              BACK TO TOP ↑
            </button>
          </div>
        </div>

        <div
          className="w-full"
          style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 24, paddingTop: 20, borderTop: darkMode ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(42,32,24,0.1)" }}
        >
          <div className="flex items-center" style={{ gap: 10 }}>
            <div className="shrink-0" style={{ width: 28, height: 28, background: `url("${logoMark}") center / cover no-repeat`, borderRadius: 4 }} />
            <span style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: "15px", color: heading }}>Swatik SP</span>
          </div>
          <ToolMarks size={28} color={muted} fontFamily={FONT_SANS} labelSize={14} />
          <span style={{ fontFamily: FONT_SANS, fontSize: "14px", color: muted, justifySelf: "end", textAlign: "right" }}>© 2026 Swatik SP. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
