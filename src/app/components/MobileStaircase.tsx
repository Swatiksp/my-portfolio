import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MutableRefObject, type ReactNode } from "react";
import { motion, animate as motionAnimate, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { PROJECTS, isOpenable } from "../data/projects";
import { FrostBitmap, useFrostBitmaps } from "../lib/frostBitmaps";
import { GearsIcon } from "./GearsIcon";
import { PrismCraftCard } from "./PrismCraftCard";
import { HaloCraftCard } from "./HaloCraftCard";
import { ProjectSCraftCard } from "./ProjectSCraftCard";
import { ThesisCraftCard } from "./ThesisCraftCard";
import { ShowcaseCraftCard } from "./ShowcaseCraftCard";

/* The phone version of the homepage's pinned stage, the same behaviour as the desktop page.

   At rest the intro sits in the open space at the top and five glass tiles step up and to the right underneath it
   (Figma "Frame 1", 1102:2210). Scrolling turns every tile over to reveal its craft card and lays the cards out in
   one column, which then scrolls up under the My Craft title. The stage is pinned to the screen the whole time and
   released into the footer at the end.

   Like the desktop page, a tile travels between its two layouts on a spring, and each face turns on its own
   (perspective + rotateY), so nothing depends on preserve-3d, which Safari flattens. */

// Figma slots, front tile first: left, top and width in the frame's own units (the frame is 204 x 357).
const FIG = [
  { l: -2, t: 291, w: 109 },
  { l: 54, t: 281, w: 97 },
  { l: 98, t: 276, w: 82 },
  { l: 131, t: 270, w: 65 },
  { l: 153, t: 264, w: 54 },
] as const;
const FIG_W = 204;
const FIG_H = 357;
const FIG_TOP = 264; // where the smallest tile starts; the stack is FIG_H - FIG_TOP tall
const GROUP_GAP = 40; // between the intro and the stack
const MIN_GAP = 20; // the least it shrinks to on a short screen
// On a short screen the company logos step aside so the intro, the stack and the hint all fit.
const COMPACT_BELOW = 720;
const CAPTION_H = 58; // the "scroll down" line along the bottom, and its margin
const FONT_COND = "'Roboto Condensed', 'Roboto', sans-serif";
const FONT_DING = "'Yarndings 12', sans-serif";
const TILE_RATIO = 0.5583; // height / width of the artwork in the staircase tiles

// The craft card, as it sits in the column
const CARD_PAD = 20;
const CARD_BORDER = 1;
const CHROME = (CARD_PAD + CARD_BORDER) * 2;
const CARD_RADIUS = 20;
const IMAGE_RADIUS = 15;
const POSTER_RATIO = 0.92; // card height / width, as the phone poster has always been drawn

const SIDE = 24;
const LABEL_H = 44; // the "view case study" row under each card
const GAP = 24;
const TITLE_TOP = 84;
const GRID_TOP = 150;

const NAV_H = 60;
const LAST = PROJECTS.length - 1;
const SERIF = "'Newsreader', 'Iowan Old Style', Georgia, serif";

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const heroPad = (width: number) => Math.max(6, Math.round(width * 0.04));
const heroRadius = (width: number) => Math.max(9, Math.round(width * 0.075));

function buildLayouts(w: number, h: number, stackTop: number) {
  const s = w / FIG_W;
  // index 0 is the smallest, top-right tile, index 4 the front one, as on the desktop page
  const staircase: Rect[] = PROJECTS.map((_, index) => {
    const f = FIG[LAST - index];
    const width = f.w * s;
    const pad = heroPad(width);
    return {
      left: f.l * s,
      width,
      top: stackTop + (f.t - FIG_TOP) * s,
      height: (width - 2 * pad - 2) * TILE_RATIO + 2 * pad + 2,
    };
  });

  const cardW = w - 2 * SIDE;
  const cardH = (cardW - CHROME) * POSTER_RATIO + CHROME;
  const grid: Rect[] = PROJECTS.map((_, j) => ({
    top: GRID_TOP + j * (cardH + LABEL_H + GAP),
    left: SIDE,
    width: cardW,
    height: cardH,
  }));
  const gridTotalH = GRID_TOP + PROJECTS.length * cardH + LAST * GAP + PROJECTS.length * LABEL_H;
  return { staircase, grid, gridTotalH };
}

/** The pinned stage's own size. It is 100svh tall, so the toolbar collapsing in Safari never changes it. */
function useStageSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ w: 393, h: 700 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setSize((cur) => (cur.w === el.clientWidth && cur.h === el.clientHeight ? cur : { w: el.clientWidth, h: el.clientHeight }));
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

type Look = { dark: boolean; heading: string; copy: string; muted: string; link: CSSProperties };

export function MobileWork({
  hero,
  dark,
  heading,
  copy,
  muted,
  link,
  onOpen,
  workScrollRef,
}: Look & {
  /** The intro text that sits above the staircase. */
  hero: ReactNode;
  onOpen: (slug: string) => void;
  /** Filled with the scroll position where the work column is fully in place, for the WORK links. */
  workScrollRef: MutableRefObject<number>;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [isGrid, setIsGrid] = useState(false);
  const frostBitmaps = useFrostBitmaps(dark);

  const { w, h } = useStageSize(stageRef);

  // The intro and the stack sit together: the stack comes right under the text, and on a tall screen the pair is
  // centred between the nav and the "scroll down" line instead of leaving a gap between them. On a short screen the
  // gap shrinks a little to make room.
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [heroH, setHeroH] = useState(430);
  useLayoutEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const read = () => setHeroH(el.offsetHeight);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const stackH = (FIG_H - FIG_TOP) * (w / FIG_W);
  const region = h - NAV_H - CAPTION_H;
  const spare = region - (heroH + GROUP_GAP + stackH);
  const gap = spare >= 0 ? GROUP_GAP : Math.max(MIN_GAP, GROUP_GAP + spare);
  const heroTop = NAV_H + Math.max(20, spare / 2);
  const stackTop = heroTop + heroH + gap;
  const layouts = buildLayouts(w, h, stackTop);

  // Scroll budget: one stretch for the turn-over, then the column scrolling under the title, then the release.
  const contentH = h - NAV_H;
  const animEnd = h * 1.1;
  const maxGridScroll = Math.max(0, layouts.gridTotalH - contentH + 40);
  const maxScrollY = animEnd + maxGridScroll * 1.1;
  const wrapperH = maxScrollY + h;

  // 0..1 across the pinned stretch; the maths below wants pixels
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const pinned = wrapperH - h;
  const px = useTransform(scrollYProgress, (v) => v * pinned);
  const progress = useTransform(px, [0, animEnd], [0, 1], { clamp: true });
  const gridScroll = useTransform(px, [animEnd, maxScrollY], [0, -maxGridScroll], { clamp: true });

  const heroOpacity = useTransform(progress, [0, 0.28], [1, 0]);
  const heroX = useTransform(progress, [0, 0.28], [0, -60]);

  useMotionValueEvent(progress, "change", (v) => {
    if (v > 0.35 && !isGrid) setIsGrid(true);
    if (v < 0.28 && isGrid) setIsGrid(false);
  });

  // WORK links land where the column is fully in place.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    workScrollRef.current = el.getBoundingClientRect().top + window.scrollY + animEnd;
  });

  return (
    <div ref={wrapRef} id="work" style={{ height: wrapperH }}>
      <div ref={stageRef} className="m-stair-stage" data-compact={h < COMPACT_BELOW ? "" : undefined}>
        <motion.div
          ref={heroRef}
          className="absolute"
          style={{ left: SIDE, right: SIDE, top: heroTop, opacity: heroOpacity, x: heroX, pointerEvents: isGrid ? "none" : "auto" }}
        >
          {hero}
        </motion.div>

        {/* The hint under the stack. It leaves with the intro. */}
        <motion.p
          className="absolute m-0 flex items-center"
          style={{ left: SIDE, right: SIDE, bottom: "max(14px, env(safe-area-inset-bottom, 0px))", opacity: heroOpacity, x: heroX, fontFamily: FONT_COND, fontSize: 15, lineHeight: "24px", color: copy }}
        >
          <span aria-hidden style={{ fontFamily: FONT_DING, fontSize: 16, lineHeight: "24px", color: heading, marginRight: 6 }}>
            z
          </span>
          <span style={{ fontWeight: 700 }}>Scroll down</span>
          <span>{"\u00A0to view the work behind them."}</span>
        </motion.p>

        <motion.div className="absolute inset-0" style={{ y: gridScroll, pointerEvents: "none" }}>
          <motion.h2
            initial={false}
            className="absolute m-0"
            style={{ top: TITLE_TOP, left: SIDE, fontFamily: SERIF, fontWeight: 400, fontSize: 40, lineHeight: "44px", letterSpacing: "-0.02em", color: heading }}
            animate={isGrid ? { opacity: 1, x: 0 } : { opacity: 0, x: -32 }}
            transition={isGrid ? { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 } : { duration: 0.15, ease: "easeIn", delay: 0 }}
          >
            My Craft
          </motion.h2>

          {PROJECTS.map((_, i) => (
            <MobileTile key={i} index={i} isGrid={isGrid} layouts={layouts} stageW={w} dark={dark} frostBitmaps={frostBitmaps} onOpen={onOpen} />
          ))}

          {PROJECTS.map((project, j) => {
            const r = layouts.grid[j];
            const open = isOpenable(project);
            return (
              <motion.div
                key={project.slug}
                initial={false}
                className="absolute flex items-center"
                style={{ top: r.top + r.height + 2, left: r.left, height: LABEL_H - 2, pointerEvents: isGrid ? "auto" : "none" }}
                animate={{ opacity: isGrid ? 1 : 0 }}
                transition={{ duration: 0.3, delay: isGrid ? 0.5 : 0 }}
              >
                {open ? (
                  <button type="button" tabIndex={isGrid ? 0 : -1} onClick={() => onOpen(project.slug)} style={{ ...link, gap: 8, padding: "4px 2px" }}>
                    VIEW CASE STUDY <span aria-hidden>→</span>
                  </button>
                ) : (
                  <span style={{ ...link, gap: 10, padding: "4px 2px", color: muted, cursor: "default" }}>
                    <GearsIcon size={20} /> CASE STUDY IN PROGRESS
                  </span>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

const CraftFor = ({ slug }: { slug: string }) =>
  slug === "prism" ? (
    <PrismCraftCard />
  ) : slug === "project-s" ? (
    <ProjectSCraftCard />
  ) : slug === "thesis" ? (
    <ThesisCraftCard />
  ) : slug === "microsoft-showcase" ? (
    <ShowcaseCraftCard />
  ) : (
    <HaloCraftCard />
  );

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

function MobileTile({
  index,
  isGrid,
  layouts,
  stageW,
  dark,
  frostBitmaps,
  onOpen,
}: {
  index: number;
  isGrid: boolean;
  layouts: ReturnType<typeof buildLayouts>;
  stageW: number;
  dark: boolean;
  frostBitmaps: Record<string, ImageBitmap>;
  onOpen: (slug: string) => void;
}) {
  const from = layouts.staircase[index];
  const toGrid = layouts.grid[LAST - index];
  const project = PROJECTS[LAST - index];
  const tileSrc = dark ? project.frost : project.image;
  const flatSrc = frostBitmaps[project.frost];
  const interactive = isGrid && isOpenable(project);

  const delay = isGrid ? index * 0.07 : (LAST - index) * 0.05;
  const target = isGrid ? toGrid : from;
  const layoutKey = isGrid ? "grid" : "hero";

  // One spring (0 -> 1) carries the tile from its old rectangle to the new one.
  const fromRect = useRef<Rect>(target);
  const toRect = useRef<Rect>(target);
  const travel = useMotionValue(1);
  const rectAt = (p: number): Rect => ({
    top: lerp(fromRect.current.top, toRect.current.top, p),
    left: lerp(fromRect.current.left, toRect.current.left, p),
    width: lerp(fromRect.current.width, toRect.current.width, p),
    height: lerp(fromRect.current.height, toRect.current.height, p),
  });
  const boxTop = useTransform(travel, (p) => rectAt(p).top);
  const boxLeft = useTransform(travel, (p) => rectAt(p).left);
  const boxWidth = useTransform(travel, (p) => rectAt(p).width);
  const boxHeight = useTransform(travel, (p) => rectAt(p).height);

  // The craft card is laid out once, at its column size, and only scaled while the tile resizes. Re-flowing its
  // container-query text on every frame of the turn is what makes it stutter.
  const gridInnerW = toGrid.width - CHROME;
  const gridInnerH = toGrid.height - CHROME;
  const posterScaleX = useTransform(travel, (p) => (rectAt(p).width - CHROME) / gridInnerW);
  const posterScaleY = useTransform(travel, (p) => (rectAt(p).height - CHROME) / gridInnerH);

  const lastLayout = useRef({ key: layoutKey, target, stageW });
  useLayoutEffect(() => {
    const prev = lastLayout.current;
    const changedKey = prev.key !== layoutKey;
    const cur = rectAt(travel.get());
    lastLayout.current = { key: layoutKey, target, stageW };
    fromRect.current = changedKey ? cur : target;
    toRect.current = target;
    if (!changedKey && prev.stageW === stageW && prev.target === target) return;
    travel.stop();
    if (changedKey) {
      travel.set(0);
      travel.jump(0); // clears the velocity that resetting the value would otherwise hand to the spring
      const controls = motionAnimate(travel, 1, { type: "spring", stiffness: 70, damping: 18, velocity: 0, delay });
      return () => controls.stop();
    }
    // a resize: snap to the new rectangle
    travel.set(1 - 1e-9);
    travel.set(1);
  }, [layoutKey, target, stageW]);

  // The turn: 0 shows the craft card, 180 the artwork.
  const flip = useMotionValue(isGrid ? 0 : 180);
  const flipMounted = useRef(false);
  useEffect(() => {
    const to = isGrid ? 0 : 180;
    if (!flipMounted.current) {
      flipMounted.current = true;
      flip.set(to);
      return;
    }
    const controls = motionAnimate(flip, to, { type: "spring", stiffness: 80, damping: 18, delay: delay + 0.05 });
    return () => controls.stop();
  }, [isGrid]);
  const backAngle = useTransform(flip, (v) => v + 180);
  const frontShown = useTransform(flip, (v) => (v < 90 ? 1 : 0));
  const backShown = useTransform(flip, (v) => (v < 90 ? 0 : 1));
  const frontFlip = { rotateY: flip, transformPerspective: 1200, opacity: frontShown, willChange: "transform" as const };
  const backFlip = { rotateY: backAngle, transformPerspective: 1200, opacity: backShown, willChange: "transform" as const };

  const pad = heroPad(from.width);
  const radius = heroRadius(from.width);
  const glass: CSSProperties = {
    background: "rgba(255,255,255,0.55)",
    border: `${CARD_BORDER}px solid rgba(255,255,255,0.9)`,
    boxSizing: "border-box",
  };

  return (
    <motion.div
      className="absolute"
      style={{ top: boxTop, left: boxLeft, width: boxWidth, height: boxHeight, contain: "layout style", pointerEvents: isGrid ? "auto" : "none" }}
      // On load the tiles just dissolve in; the spring only moves them when the layout changes.
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: (LAST - index) * 0.06, ease: "easeOut" }}
    >
      <div
        className="relative w-full h-full"
        style={{
          cursor: interactive ? "pointer" : "default",
          borderRadius: isGrid ? CARD_RADIUS : radius,
          boxShadow: dark ? "none" : isGrid ? "0px 16px 20px rgba(89,51,13,0.24)" : "0px 8px 12px rgba(89,51,13,0.2)",
          transition: "box-shadow 0.4s ease",
        }}
        onClick={() => interactive && onOpen(project.slug)}
      >
        {/* Back face: the artwork, in a glass tile (the staircase) */}
        <motion.div className="absolute inset-0 flex flex-col items-start" style={{ ...glass, ...backFlip, borderRadius: radius, padding: pad }}>
          <div
            className="relative w-full shrink-0"
            style={{ aspectRatio: `1 / ${TILE_RATIO}`, borderRadius: Math.max(6, radius - pad), overflow: "hidden", background: dark ? "rgba(255,255,255,0.1)" : undefined }}
          >
            {dark && flatSrc ? (
              <FrostBitmap bitmap={flatSrc} radius={Math.max(6, radius - pad)} />
            ) : (
              <img decoding="async" src={tileSrc} alt="" draggable={false} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
            )}
          </div>
        </motion.div>

        {/* Front face: the craft card */}
        <motion.div className="craft-card-face absolute inset-0 flex flex-col overflow-hidden" style={{ ...glass, ...frontFlip, borderRadius: CARD_RADIUS, padding: CARD_PAD }}>
          <div className="relative w-full h-full min-h-0" style={{ borderRadius: IMAGE_RADIUS, overflow: "hidden", boxShadow: dark ? "none" : "0px 2px 7px 5px rgba(0,0,0,0.1)" }}>
            <motion.div
              className="poster-mobile"
              style={{ position: "absolute", left: 0, top: 0, width: gridInnerW, height: gridInnerH, scaleX: posterScaleX, scaleY: posterScaleY, transformOrigin: "0 0", willChange: "transform" }}
            >
              <CraftFor slug={project.slug} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
