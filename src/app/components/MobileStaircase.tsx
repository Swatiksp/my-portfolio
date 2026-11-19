import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MutableRefObject, type ReactNode } from "react";
import { motion, animate as motionAnimate, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { PROJECTS, isOpenable } from "../data/projects";
import { FrostBitmap, useFrostBitmaps } from "../lib/frostBitmaps";
import { GearsIcon } from "./GearsIcon";
import { TypeIn } from "./TypeIn";
import { PrismCraftCard } from "./PrismCraftCard";
import { HaloCraftCard } from "./HaloCraftCard";
import { ProjectSCraftCard } from "./ProjectSCraftCard";
import { ThesisCraftCard } from "./ThesisCraftCard";
import { ShowcaseCraftCard } from "./ShowcaseCraftCard";

/* The phone version of the homepage's pinned stage, the same behaviour as the desktop page.

   At rest the intro sits at the top, the five glass tiles step up and to the right between it and the hint along the
   bottom (Figma "Frame 1", 1102:2210). Scrolling turns every tile over to reveal its craft card and lays the cards
   out in one column, which then scrolls up under the My Craft title. The stage is pinned to the screen the whole
   time and released into the footer at the end.

   Like the desktop page, a tile travels between its two layouts on a spring, and each face turns on its own
   (perspective + rotateY), so nothing depends on preserve-3d, which Safari flattens.

   Two heights matter in mobile Safari: the screen with its toolbars showing (svh), which the intro, tiles and hint are
   laid out for, and the screen with them tucked away (lvh), which the pinned stage fills so the cards never stop short
   of the bottom edge. */

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
const TILE_RATIO = 0.5583; // height / width of the artwork in the staircase tiles

const FONT_COND = "'Roboto Condensed', 'Roboto', sans-serif";
const FONT_DING = "'Yarndings 12', sans-serif";
const SERIF = "'Newsreader', 'Iowan Old Style', Georgia, serif";

// The craft card, as it sits in the column: a thin glass frame, so the card itself gets the width
const CARD_PAD = 8;
const CARD_BORDER = 1;
const CHROME = (CARD_PAD + CARD_BORDER) * 2;
const CARD_RADIUS = 18;
const IMAGE_RADIUS = 12;
const POSTER_RATIO = 1.12; // card height / width

const SIDE = 14; // the cards' margin
const TEXT_SIDE = 24; // the text's margin
const LABEL_H = 38; // the "case study in progress" row under a card that isn't open yet
const GAP = 28;
const TITLE_TOP = 84;
const GRID_TOP = 150;

const NAV_H = 60;
const LAST = PROJECTS.length - 1;
const LINE_H = 22; // one line of the hint
const HINT_BOTTOM = 14;
const HERO_TOP = NAV_H + 24;
// Shorter screens give up the logo strip (tier 1), then the first line of the hint and some spacing (tier 2).
const TIER1_BELOW = 750;
const TIER2_BELOW = 690;

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const heroPad = (width: number) => Math.max(6, Math.round(width * 0.04));
const heroRadius = (width: number) => Math.max(9, Math.round(width * 0.075));

function buildLayouts(w: number, stackTop: number) {
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
  let y = GRID_TOP;
  const grid: Rect[] = PROJECTS.map((project) => {
    const r = { top: y, left: SIDE, width: cardW, height: cardH };
    y += cardH + (isOpenable(project) ? 0 : LABEL_H) + GAP;
    return r;
  });
  const gridTotalH = y - GAP;
  return { staircase, grid, gridTotalH };
}

/** Width and both heights of the pinned stage. The stage fills the full screen (lvh); a hidden probe is the small one (svh). */
function useStageSize(stageRef: React.RefObject<HTMLElement | null>, probeRef: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ w: 393, hL: 760, hS: 700 });
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const probe = probeRef.current;
    if (!stage || !probe) return;
    const read = () =>
      setSize((cur) => {
        const next = { w: stage.clientWidth, hL: stage.clientHeight, hS: probe.clientHeight };
        return cur.w === next.w && cur.hL === next.hL && cur.hS === next.hS ? cur : next;
      });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(stage);
    ro.observe(probe);
    return () => ro.disconnect();
  }, [stageRef, probeRef]);
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
  const probeRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [isGrid, setIsGrid] = useState(false);
  const [craftReady, setCraftReady] = useState(false);
  const frostBitmaps = useFrostBitmaps(dark);

  const { w, hL, hS } = useStageSize(stageRef, probeRef);
  const tier = hS < TIER2_BELOW ? 2 : hS < TIER1_BELOW ? 1 : 0;

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

  // The craft cards are heavy, so they are only built once the page has settled (or the moment scrolling starts).
  useEffect(() => {
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const id = ric ? ric(() => setCraftReady(true), { timeout: 2500 }) : window.setTimeout(() => setCraftReady(true), 1500);
    return () => {
      if (ric) (window as unknown as { cancelIdleCallback?: (n: number) => void }).cancelIdleCallback?.(id);
      else window.clearTimeout(id);
    };
  }, []);

  // Intro at the top, hint along the bottom, and the stack centred in the space between them.
  const heroTop = tier === 2 ? NAV_H + 16 : HERO_TOP;
  const hintLines = tier === 2 ? 1 : 2;
  const hintTop = hS - HINT_BOTTOM - hintLines * LINE_H;
  const heroBottom = heroTop + heroH;
  const stackH = (FIG_H - FIG_TOP) * (w / FIG_W);
  const gapEach = Math.max(6, (hintTop - heroBottom - stackH) / 2);
  const stackTop = heroBottom + gapEach;
  const layouts = buildLayouts(w, stackTop);

  // Scroll budget: the stage is pinned for one stretch while the tiles turn over. After that it is released and the
  // column of cards is ordinary page content, scrolled by the browser itself (a column moved by script on every scroll
  // event is what made the phone stutter). The spacer below the stage is the room the column needs.
  const animEnd = hS * 1.1;
  const pinH = animEnd + hL;
  const tailH = Math.max(0, layouts.gridTotalH - hL) + 56;

  // 0..1 across the pinned stretch
  const pinTop = useRef(0);
  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, (y) => Math.min(1, Math.max(0, (y - pinTop.current) / animEnd)));

  const heroOpacity = useTransform(progress, [0, 0.28], [1, 0]);
  const heroX = useTransform(progress, [0, 0.28], [0, -60]);

  useMotionValueEvent(progress, "change", (v) => {
    if (v > 0.02 && !craftReady) setCraftReady(true);
    if (v > 0.35 && !isGrid) setIsGrid(true);
    if (v < 0.28 && isGrid) setIsGrid(false);
  });

  // WORK links land where the column is fully in place.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    pinTop.current = el.getBoundingClientRect().top + window.scrollY;
    workScrollRef.current = pinTop.current + animEnd;
  });

  return (
    <div id="work">
    <div ref={wrapRef} style={{ height: pinH, position: "relative" }}>
      <div ref={stageRef} className="m-stair-stage" data-compact={tier > 0 ? String(tier) : undefined}>
        <div ref={probeRef} aria-hidden className="m-stair-probe" />

        <motion.div
          ref={heroRef}
          className="absolute"
          style={{ left: TEXT_SIDE, right: TEXT_SIDE, top: heroTop, opacity: heroOpacity, x: heroX, pointerEvents: isGrid ? "none" : "auto" }}
        >
          {hero}
        </motion.div>

        {/* The hint under the stack, as on the desktop page. It leaves with the intro. */}
        <motion.div className="absolute flex flex-col" style={{ left: TEXT_SIDE, right: TEXT_SIDE, top: hintTop, opacity: heroOpacity, x: heroX, pointerEvents: "none" }}>
          {tier < 2 && (
            <p className="m-0" style={{ fontFamily: FONT_COND, fontWeight: 400, fontSize: 14, lineHeight: `${LINE_H}px`, color: copy }}>
              <TypeIn text="Each tile represents a body of work." />
            </p>
          )}
          <p className="m-0 flex items-center" style={{ fontFamily: FONT_COND, fontWeight: 400, fontSize: 14, lineHeight: `${LINE_H}px`, color: copy }}>
            <span aria-hidden style={{ fontFamily: FONT_DING, fontWeight: 400, fontSize: 16, lineHeight: `${LINE_H}px`, color: heading, marginRight: 6 }}>
              z
            </span>
            <span style={{ fontWeight: 700 }}>
              <TypeIn text="Scroll down" />
            </span>
            <span>
              <TypeIn text={"\u00A0to view the work behind them."} />
            </span>
          </p>
        </motion.div>

        <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
          <motion.h2
            initial={false}
            className="absolute m-0"
            style={{ top: TITLE_TOP, left: TEXT_SIDE, fontFamily: SERIF, fontWeight: 400, fontSize: 40, lineHeight: "44px", letterSpacing: "-0.02em", color: heading }}
            animate={isGrid ? { opacity: 1, x: 0 } : { opacity: 0, x: -32 }}
            transition={isGrid ? { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 } : { duration: 0.15, ease: "easeIn", delay: 0 }}
          >
            My Craft
          </motion.h2>

          {PROJECTS.map((_, i) => (
            <MobileTile key={i} index={i} isGrid={isGrid} craftReady={craftReady} layouts={layouts} stageW={w} dark={dark} frostBitmaps={frostBitmaps} onOpen={onOpen} />
          ))}

          {/* Only the cards that can't be opened yet say so */}
          {PROJECTS.map((project, j) => {
            if (isOpenable(project)) return null;
            const r = layouts.grid[j];
            return (
              <motion.div
                key={project.slug}
                initial={false}
                className="absolute flex items-center"
                style={{ top: r.top + r.height + 2, left: r.left + 10, height: LABEL_H - 2, pointerEvents: "none" }}
                animate={{ opacity: isGrid ? 1 : 0 }}
                transition={{ duration: 0.3, delay: isGrid ? 0.5 : 0 }}
              >
                <span style={{ ...link, gap: 10, padding: "4px 2px", color: muted, cursor: "default" }}>
                  <GearsIcon size={20} /> CASE STUDY IN PROGRESS
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
    <div aria-hidden style={{ height: tailH }} />
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
  craftReady,
}: {
  index: number;
  isGrid: boolean;
  craftReady: boolean;
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
  // The face turned away is hidden outright, so the phone never paints a second, invisible card under the first.
  const frontShown = useTransform(flip, (v) => (v < 90 ? "visible" : "hidden"));
  const backShown = useTransform(flip, (v) => (v < 90 ? "hidden" : "visible"));
  const frontFlip = { rotateY: flip, transformPerspective: 1200, visibility: frontShown };
  const backFlip = { rotateY: backAngle, transformPerspective: 1200, visibility: backShown };

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
              style={{ position: "absolute", left: 0, top: 0, width: gridInnerW, height: gridInnerH, scaleX: posterScaleX, scaleY: posterScaleY, transformOrigin: "0 0" }}
            >
              {craftReady && <CraftFor slug={project.slug} />}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
