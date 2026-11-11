import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import diya1 from "@/assets/final-flow/diya-1.jpg";
import diya2 from "@/assets/final-flow/diya-2.jpg";
import swatik1 from "@/assets/final-flow/swatik-1.jpg";
import swatik2 from "@/assets/final-flow/swatik-2.jpg";
import swatik3 from "@/assets/final-flow/swatik-3.jpg";
import swatik4 from "@/assets/final-flow/swatik-4.jpg";
import swatik5 from "@/assets/final-flow/swatik-5.jpg";
import colton1 from "@/assets/final-flow/colton-1.jpg";
import colton2 from "@/assets/final-flow/colton-2.jpg";
import colton3 from "@/assets/final-flow/colton-3.jpg";
import colton4 from "@/assets/final-flow/colton-4.jpg";
import colton5 from "@/assets/final-flow/colton-5.jpg";
import colton6 from "@/assets/final-flow/colton-6.jpg";
import colton7 from "@/assets/final-flow/colton-7.jpg";
import colton8 from "@/assets/final-flow/colton-8.jpg";
import { useIsMobile } from "../lib/useIsMobile";

const FOREST = "#1f3d2b";
const CREAM = "#fbf6ec";
const INK = "#000000";
const MUTED = "#5c4a38";
const SAND = "#f3e7d4";
const SANS = "'Roboto', sans-serif";

interface Screen {
  image: string;
  title: string;
  alt: string;
}
interface Section {
  id: "diya" | "swatik" | "colton";
  heading: string;
  person: string;
  /** Marks the finalized workflow, which gets the spotlight. */
  final?: boolean;
  /** How long each screen stays up, in ms. The final workflow gets the longest. */
  dwell: number;
  /** Thumbnail height in the filmstrip. */
  thumbH: number;
  screens: readonly Screen[];
}

/** Played in this order: Diya, then Swatik (the final workflow), then Colton. */
const SECTIONS: readonly Section[] = [
  {
    id: "diya",
    heading: "Concept by Diya Franklin",
    person: "Diya Franklin",
    dwell: 2400,
    thumbH: 32,
    screens: [
      {
        image: diya1,
        title: "A report queue with priority and status filters",
        alt: "Wireframe: two high priority reports added to the queue, with filters for priority and status and a grid of report cards.",
      },
      {
        image: diya2,
        title: "A report summary with its flagged edits",
        alt: "Wireframe: report information and an AI summary on the left, flagged edits with their explanations on the right.",
      },
    ],
  },
  {
    id: "swatik",
    heading: "Concept by Swatik",
    person: "Swatik",
    final: true,
    dwell: 4000,
    thumbH: 52,
    screens: [
      {
        image: swatik1,
        title: "An outdated source flagged beside the report",
        alt: "Prototype: the edited report in the middle, tier buttons and sources on the left, and an outdated resource warning in the right-hand edits panel.",
      },
      {
        image: swatik2,
        title: "Edits grouped by analysis, confidence and policy",
        alt: "Prototype: the Edits Made panel grouped into Contextual Analysis, Confidence Language and Policy and Protection, with a phrase highlighted in the report.",
      },
      {
        image: swatik3,
        title: "Tier 2 shown with the same edits alongside",
        alt: "Prototype: a Tier 2 controlled analytic narrative in the middle while the same edits stay in the right-hand panel.",
      },
      {
        image: swatik4,
        title: "Tier 3 for partners, with sources abstracted",
        alt: "Prototype: a Tier 3 partner-releasable summary with the first three tier buttons selected.",
      },
      {
        image: swatik5,
        title: "All tiers laid out together on the canvas",
        alt: "Prototype: the Tier 1, Tier 2 and Tier 3 reports placed side by side on one canvas, with the edits panel still on the right.",
      },
    ],
  },
  {
    id: "colton",
    heading: "Concept by Colton Hendrix",
    person: "Colton Hendrix",
    dwell: 2000,
    thumbH: 32,
    screens: [
      {
        image: colton1,
        title: "A blank canvas with modules to add",
        alt: "Prototype: an empty grid canvas with two comment modules and buttons to add a source, policy, comment or AI assessment.",
      },
      {
        image: colton2,
        title: "Comments, tiers, policy and AI assessment, linked",
        alt: "Prototype: a flagged comment connected to two tier narratives, then to an ICD-203 policy module and an AI assessment module.",
      },
      {
        image: colton3,
        title: "Policy search with AI-suggested keywords",
        alt: "Prototype: a policy search window with suggested keywords, recommended policies and a matching ICD-203 result.",
      },
      {
        image: colton4,
        title: "The policy added to the flow",
        alt: "Prototype: the ICD-203 policy module added between the compliance check and the AI assessment.",
      },
      {
        image: colton5,
        title: "Adding the next connected module",
        alt: "Prototype: a menu from the AI assessment module offering to add a tier, source, policy, comment or AI assessment.",
      },
      {
        image: colton6,
        title: "Editing a comment with excerpts to link",
        alt: "Prototype: an Edit Comment window with suggested excerpts to link, a title and a content field.",
      },
      {
        image: colton7,
        title: "AI suggestions and checks for the flow",
        alt: "Prototype: an AI assistant panel listing suggestions such as enhancing contextual analysis, with high and medium priority labels.",
      },
      {
        image: colton8,
        title: "The finished flow, with a flagged comment",
        alt: "Prototype: the full canvas with the connected modules and a flagged comment at the end of the flow.",
      },
    ],
  },
];

interface Flat {
  section: Section;
  sectionIndex: number;
  indexInSection: number;
  screen: Screen;
  aspect: number;
}
// Natural aspect ratios of the exported screens (width / height), so each frame fits its screenshot exactly.
const ASPECTS: Record<Section["id"], number[]> = {
  diya: [1800 / 1181, 1800 / 1154],
  swatik: [1800 / 1101, 1800 / 1101, 1800 / 1101, 1800 / 1101, 1800 / 1101],
  colton: [1800 / 1031, 1800 / 1033, 1800 / 1032, 1800 / 1032, 1800 / 1033, 1800 / 1032, 1800 / 1030, 1800 / 1032],
};
const FLAT: Flat[] = SECTIONS.flatMap((section, sectionIndex) =>
  section.screens.map((screen, indexInSection) => ({
    section,
    sectionIndex,
    indexInSection,
    screen,
    aspect: ASPECTS[section.id][indexInSection],
  })),
);
const FIRST_INDEX = SECTIONS.map((_, i) => FLAT.findIndex((f) => f.sectionIndex === i));
const N = FLAT.length;

const SIDE_SCALE = 0.7;
const SIDE_OPACITY = 0.45;
const FINAL_SCALE = 1;
const OTHER_SCALE = 0.84; // the teammates' screens play a little smaller, so the final workflow stands out

/** Stage geometry. Desktop keeps the design numbers; a phone sizes the frames to the width it has. */
function geometry(containerW: number | null) {
  const phone = containerW !== null;
  const baseH = phone ? Math.round((containerW * 0.8) / (1800 / 1101)) : 360; // stage height of the spotlighted frame
  const stageTop = phone ? 56 : 68;
  const captionH = phone ? 78 : 44;
  return {
    phone,
    baseH,
    stageTop,
    gap: phone ? 14 : 28,
    captionH,
    height: phone ? stageTop + baseH + 14 + captionH + 14 + 54 + 14 : 604,
    widthOf: (f: Flat) => baseH * f.aspect,
  };
}
type Geo = ReturnType<typeof geometry>;

/**
 * Auto-scrolling walkthrough of the finalized flow. Screens play Diya's first, then Swatik's (the final workflow,
 * which gets the biggest frame, the longest dwell time and a highlighted ring), then Colton's, then loop.
 * The filmstrip lays out every screen in its section and its progress underline doubles as the timer.
 * It keeps playing on hover, and reduced-motion users get manual control only.
 */
export function FinalFlowCarousel() {
  const reduceMotion = useReducedMotion();
  const mobile = useIsMobile();
  // Starts on Swatik's concept, the one I want people looking at.
  const [{ active, prev }, setPos] = useState({ active: FIRST_INDEX[1], prev: FIRST_INDEX[1] });
  const goTo = (n: number) => setPos((s) => (s.active === n ? s : { active: n, prev: s.active }));
  const next = () => setPos((s) => ({ active: (s.active + 1) % N, prev: s.active }));

  const cur = FLAT[active];

  const rootRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !mobile) return;
    const measure = () => setWidth(el.clientWidth);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, [mobile]);
  const geo = useMemo(() => geometry(mobile && width > 0 ? width : null), [mobile, width]);
  const { baseH, stageTop, gap: GAP, widthOf } = geo;

  // It keeps running while off screen, so each time it scrolls back into view it restarts on Swatik's concept.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let seen = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !seen) {
          seen = true;
          setPos({ active: FIRST_INDEX[1], prev: FIRST_INDEX[1] });
        } else if (!e.isIntersecting) {
          seen = false;
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Warm the cache so no screen pops in when it takes the spotlight.
  useEffect(() => {
    FLAT.forEach((f) => {
      const img = new Image();
      img.src = f.screen.image;
    });
  }, []);

  const slideProps = useMemo(() => {
    const scaleOf = (f: Flat, centre: boolean) => (centre ? (f.section.final ? FINAL_SCALE : OTHER_SCALE) : SIDE_SCALE);
    const centre = FLAT[active];
    const jump = Math.abs(active - prev) > 1; // loop-around or a click on a far thumbnail: cut instead of racing across
    const ease = [0.22, 1, 0.36, 1] as const;
    return FLAT.map((f, i) => {
      const o = i - active;
      const visible = Math.abs(o) <= 1;
      const isCentre = o === 0;
      let x = 0;
      if (o !== 0) {
        const sign = Math.sign(o);
        const near = (widthOf(centre) * scaleOf(centre, true)) / 2 + GAP + (widthOf(FLAT[active + sign] ?? f) * SIDE_SCALE) / 2;
        // Neighbours sit beside the centre frame; anything further out waits off-stage.
        x = sign * (near + (Math.abs(o) - 1) * (geo.phone ? 260 : 420));
      }
      const target = {
        x,
        scale: scaleOf(f, isCentre),
        opacity: isCentre ? 1 : visible ? SIDE_OPACITY : 0,
      };
      const dur = reduceMotion ? 0 : 0.85;
      return jump
        ? {
            animate: { ...target, opacity: target.opacity === 0 ? 0 : [0, target.opacity] },
            transition: { x: { duration: 0 }, scale: { duration: 0 }, opacity: { duration: reduceMotion ? 0 : 0.6, ease } },
          }
        : { animate: target, transition: { duration: dur, ease } };
    });
  }, [active, prev, reduceMotion, geo]);

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-hidden"
      role="region"
      aria-roledescription="carousel"
      aria-label="The finalized workflow: concepts by Diya Franklin, Swatik and Colton Hendrix"
      style={{ background: "transparent", borderRadius: 15, height: geo.height }}
    >
      {/* Section headings */}
      <div className="absolute flex items-end justify-center" style={{ top: 16, left: geo.phone ? 8 : 28, right: geo.phone ? 8 : 28, gap: geo.phone ? 18 : 32, zIndex: 5 }} role="tablist" aria-label="Sections">
        {SECTIONS.map((s, i) => {
          const selected = i === cur.sectionIndex;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => goTo(FIRST_INDEX[i])}
              className="relative flex items-center gap-[10px] border-0 bg-transparent p-0 cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{
                fontFamily: SANS,
                fontWeight: selected ? 500 : 400,
                fontSize: geo.phone ? 17 : 22,
                lineHeight: "30px",
                color: selected ? INK : MUTED,
                opacity: selected || s.final ? 1 : 0.55,
                paddingBottom: 6,
                transition: "opacity 250ms ease, color 250ms ease",
                outlineColor: FOREST,
              }}
            >
              {geo.phone ? s.person.split(" ")[0] : s.heading}
              {s.final && (
                <span
                  style={{
                    background: FOREST,
                    color: CREAM,
                    fontFamily: SANS,
                    fontWeight: 600,
                    fontSize: 10.5,
                    lineHeight: "14px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    padding: "3px 9px",
                    borderRadius: 999,
                  }}
                >
                  {geo.phone ? "Primary" : "Primary concept"}
                </span>
              )}
              {selected && (
                <motion.span
                  layoutId="final-flow-underline"
                  aria-hidden
                  className="absolute left-0 right-0 bottom-0"
                  style={{ height: 2, borderRadius: 2, background: FOREST }}
                  transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Stage */}
      <div className="absolute left-0 right-0" style={{ top: stageTop, height: baseH }} aria-live="off">
        {FLAT.map((f, i) => {
          const isActive = i === active;
          const near = Math.abs(i - active) <= 1;
          const { animate, transition } = slideProps[i];
          const w = widthOf(f);
          return (
            <motion.div
              key={f.screen.image}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${N}`}
              aria-hidden={!isActive}
              onClick={near && !isActive ? () => goTo(i) : undefined}
              className="absolute"
              style={{
                left: "50%",
                top: 0,
                marginLeft: -w / 2,
                width: w,
                height: baseH,
                zIndex: isActive ? 2 : 1,
                pointerEvents: near ? "auto" : "none",
                cursor: near && !isActive ? "pointer" : "default",
                borderRadius: 12,
                overflow: "hidden",
                background: "#fff",
                boxShadow:
                  isActive && f.section.final
                    ? `0 0 0 3px ${FOREST}, 0 26px 50px -12px rgba(31,61,43,0.4)`
                    : "0 2px 7px rgba(0,0,0,0.1), 0 18px 36px -8px rgba(89,51,13,0.22)",
                transition: "box-shadow 400ms ease",
              }}
              initial={false}
              animate={animate}
              transition={transition}
            >
              <img src={f.screen.image} alt={isActive ? f.screen.alt : ""} draggable={false} className="block w-full h-full select-none" />
              {isActive && f.section.final && (
                <span
                  aria-hidden
                  className="absolute"
                  style={{
                    top: 10,
                    left: "50%",
                    transform: "translateX(-50%)", // sits in the empty middle of the screen's top bar
                    background: FOREST,
                    color: CREAM,
                    fontFamily: SANS,
                    fontWeight: 600,
                    fontSize: 10.5,
                    lineHeight: "14px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    borderRadius: 999,
                  }}
                >
                  Primary concept
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Caption */}
      <div
        className="absolute left-0 right-0 text-center"
        style={{ top: stageTop + baseH + 14, minHeight: geo.captionH, paddingInline: geo.phone ? 4 : 0 }}
        aria-live={reduceMotion ? "polite" : "off"}
      >
        <p
          className="m-0"
          style={{ fontFamily: SANS, fontWeight: 600, fontSize: 11, lineHeight: "16px", letterSpacing: "1.1px", textTransform: "uppercase", color: FOREST }}
        >
          {cur.section.person} · Screen {cur.indexInSection + 1} of {cur.section.screens.length}        </p>
        <p className="m-0" style={{ fontFamily: SANS, fontWeight: 500, fontSize: 18, lineHeight: "28px", color: INK }}>
          {cur.screen.title}
        </p>
      </div>

      {/* Filmstrip: every screen, grouped by section. The underline under the active one is the timer.
          A phone shows only the section being played, so the thumbnails stay big enough to tap. */}
      <div
        className="absolute left-0 right-0 flex justify-center items-end"
        style={{ bottom: geo.phone ? 14 : 22, gap: 28, paddingInline: geo.phone ? 4 : 0 }}
      >
        {SECTIONS.map((s, si) => {
          if (geo.phone && si !== cur.sectionIndex) return null;
          return (
            <div key={s.id} className="flex items-end" style={{ gap: 6, width: geo.phone ? "100%" : undefined }}>
              {s.screens.map((sc, k) => {
                const idx = FIRST_INDEX[si] + k;
                const isActive = idx === active;
                const w = s.thumbH * ASPECTS[s.id][k];
                return (
                  <button
                    key={sc.image}
                    type="button"
                    aria-label={`Show ${s.person}, screen ${k + 1}: ${sc.title}`}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => goTo(idx)}
                    className="border-0 bg-transparent p-0 cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 flex flex-col"
                    style={geo.phone ? { flex: "1 1 0", minWidth: 0, gap: 5, outlineColor: FOREST } : { width: w, gap: 5, outlineColor: FOREST }}
                  >
                    <img
                      src={sc.image}
                      alt=""
                      draggable={false}
                      className="block"
                      style={{
                        width: geo.phone ? "100%" : w,
                        height: geo.phone ? "auto" : s.thumbH,
                        aspectRatio: geo.phone ? `${ASPECTS[s.id][k]}` : undefined,
                        borderRadius: 5,
                        objectFit: "cover",
                        opacity: isActive ? 1 : 0.6,
                        outline: isActive ? `2px solid ${FOREST}` : "1px solid rgba(0,0,0,0.12)",
                        outlineOffset: isActive ? 1 : 0,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                        transition: "opacity 250ms ease",
                      }}
                    />
                    <span className="block w-full overflow-hidden" style={{ height: 3, borderRadius: 3, background: "rgba(31,61,43,0.16)" }}>
                      {idx < active && <span className="block w-full h-full" style={{ background: FOREST }} />}
                      {isActive && (
                        <span
                          key={`${active}-${prev}`}
                          className="concept-progress-fill block w-full h-full"
                          style={{ background: FOREST, animationDuration: `${s.dwell}ms` }}
                          onAnimationEnd={next}
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
