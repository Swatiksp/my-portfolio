import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import v1Step1 from "@/assets/concepts/concept-3-step-1.png";
import v1Step2 from "@/assets/concepts/concept-3-step-2.png";
import v1Step3 from "@/assets/concepts/concept-3-step-3.png";
import v2Step1 from "@/assets/concepts/v2-step-1.png";
import v2Step2 from "@/assets/concepts/v2-step-2.png";
import v2Step3 from "@/assets/concepts/v2-step-3.png";

const FOREST = "#1f3d2b";
const INK = "#000000";
const MUTED = "#5c4a38";
const SAND = "#f3e7d4";
const SANS = "'Roboto', sans-serif";

interface Slide {
  image: string;
  title: string;
  detail: string;
  alt: string;
}
interface Version {
  label: string;
  slides: readonly Slide[];
}

/** Concept 3 (AI Suggestions for Collaboration and Adherence), first and second round of screens. */
const VERSIONS: readonly Version[] = [
  {
    label: "Version one",
    slides: [
      {
        image: v1Step1,
        title: "Overview and policy adherence",
        detail: "An AI summary of the report sits beside each policy check and its action items.",
        alt: "Lo-fi wireframe: an AI overview and policy adherence list on the left, a tiered report in the middle and an empty comments panel on the right.",
      },
      {
        image: v1Step2,
        title: "Highlight a sentence for a suggestion",
        detail: "The AI cites the policy it misses, suggests a rewrite and keywords, and drafts the comment.",
        alt: "Lo-fi wireframe: a highlighted sentence opens a Create Comment card with a policy prompt, an AI suggestion and keywords to include.",
      },
      {
        image: v1Step3,
        title: "Comments collect in one panel",
        detail: "Every highlighted section becomes a color-coded, time-stamped comment.",
        alt: "Lo-fi wireframe: two highlighted sections in the report, each recorded as a color-coded comment in the right-hand panel.",
      },
    ],
  },
  {
    label: "Version two",
    slides: [
      {
        image: v2Step1,
        title: "Edits and their sources side by side",
        detail: "The edit list sits left of the report, and each edit has a card for its verification sources on the right.",
        alt: "Wireframe: an edit list on the left, the missile operational report with an Edit 1 tag in the middle, and Edit 1 to 3 source cards on the right.",
      },
      {
        image: v2Step2,
        title: "Edits sorted into categories",
        detail: "Edits are grouped under headings such as Source Citation and Attribution, with the issue spelled out beside the report.",
        alt: "Wireframe: edits grouped into Contextual Analysis, Source Citation and Attribution, and Confidence Calibration, with a citation issue shown on the right.",
      },
      {
        image: v2Step3,
        title: "Outdated sources flagged, with a replacement",
        detail: "A card warns that a source is outdated, suggests a newer one, and asks whether to keep it or browse other sources.",
        alt: "Wireframe: an Outdated Resource Detected card over the report, suggesting a replacement source with Correct Source and Browse other sources buttons.",
      },
    ],
  },
];

const SLIDE_W = 462;
const SLIDE_H = 300; // keeps the 1812:1178 ratio of the Figma frames
const SIDE_SCALE = 0.88;
const SIDE_OPACITY = 0.5;
const GAP = 24;
const STEP_X = SLIDE_W / 2 + GAP + (SLIDE_W * SIDE_SCALE) / 2; // distance between slide centres
const SLIDE_TOP = 56;

/** -1 = previous (left), 0 = current, 1 = next (right) */
const offsetOf = (i: number, active: number) => ((((i - active + 1) % 3) + 3) % 3) - 1;

/** One version's screens, with caption and a segmented progress bar that doubles as the autoplay timer. */
function VersionStage({ slides, onComplete }: { slides: readonly Slide[]; onComplete: () => void }) {
  const reduceMotion = useReducedMotion();
  const [{ active, prev }, setPos] = useState({ active: 0, prev: 0 });
  const last = slides.length - 1;

  const goTo = (n: number) => setPos((s) => (s.active === n ? s : { active: n, prev: s.active }));
  // The last screen hands over to the other version instead of wrapping around.
  const next = () => (active === last ? onComplete() : goTo(active + 1));

  // Memoized so unrelated re-renders never replay a slide's animation.
  const motionProps = useMemo(
    () =>
      slides.map((_, i) => {
        const offset = offsetOf(i, active);
        const centre = offset === 0;
        const target = {
          x: offset * STEP_X,
          scale: centre ? 1 : SIDE_SCALE,
          opacity: centre ? 1 : SIDE_OPACITY,
        };
        // A slide that jumps from one side to the other (when you skip steps) does it unseen: fade out, hop, fade back in.
        const wrapped = Math.abs(offset - offsetOf(i, prev)) === 2;
        const ease = [0.22, 1, 0.36, 1] as const;
        const dur = reduceMotion ? 0 : 0.8;
        return wrapped
          ? {
              animate: { ...target, opacity: [0, target.opacity] },
              transition: { x: { duration: 0 }, scale: { duration: 0 }, opacity: { duration: reduceMotion ? 0 : 0.7, ease } },
            }
          : { animate: target, transition: { duration: dur, ease } };
      }),
    [slides, active, prev, reduceMotion],
  );

  return (
    <>
      {/* Slides */}
      <div className="absolute left-0 right-0" style={{ top: SLIDE_TOP, height: SLIDE_H }} aria-live="off">
        {slides.map((s, i) => {
          const isActive = offsetOf(i, active) === 0;
          const { animate, transition } = motionProps[i];
          return (
            <motion.div
              key={s.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              aria-hidden={!isActive}
              onClick={isActive ? undefined : () => goTo(i)}
              className="absolute"
              style={{
                left: "50%",
                marginLeft: -SLIDE_W / 2,
                width: SLIDE_W,
                height: SLIDE_H,
                zIndex: isActive ? 2 : 1,
                cursor: isActive ? "default" : "pointer",
                borderRadius: 12,
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 2px 7px rgba(0,0,0,0.1), 0 18px 36px -8px rgba(89,51,13,0.22)",
              }}
              initial={false}
              animate={animate}
              transition={transition}
            >
              <img
                src={s.image}
                alt={isActive ? s.alt : ""}
                draggable={false}
                className="block w-full h-full select-none"
                style={{ objectFit: "cover", objectPosition: "top" }}
              />
              {/* Soft fade where the wireframe page is cropped */}
              <div
                aria-hidden
                className="absolute left-0 right-0 bottom-0 pointer-events-none"
                style={{ height: 40, background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.96))" }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Caption + progress */}
      <div
        className="absolute flex flex-col gap-[10px]"
        style={{ top: SLIDE_TOP + SLIDE_H + 14, left: "50%", marginLeft: -SLIDE_W / 2, width: SLIDE_W }}
      >
        <div aria-live={reduceMotion ? "polite" : "off"} style={{ minHeight: 42, textAlign: "center" }}>
          <p
            className="m-0"
            style={{ fontFamily: SANS, fontWeight: 600, fontSize: 12, lineHeight: "16px", letterSpacing: "1.1px", textTransform: "uppercase", color: FOREST }}
          >
            Step {active + 1} of {slides.length} · Lo-fi wireframe
          </p>
          <p className="m-0" style={{ fontFamily: SANS, fontWeight: 500, fontSize: 18, lineHeight: "26px", color: INK }}>
            {slides[active].title}
          </p>
        </div>

        <div className="flex gap-[6px]">
          {slides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              aria-label={`Show step ${i + 1}: ${s.title}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => goTo(i)}
              className="flex-1 border-0 bg-transparent p-0 cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ height: 14, display: "flex", alignItems: "center", outlineColor: FOREST }}
            >
              <span className="block w-full overflow-hidden" style={{ height: 8, borderRadius: 20, background: "rgba(31,61,43,0.16)" }}>
                {i < active && <span className="block w-full h-full" style={{ background: FOREST }} />}
                {i === active && (
                  <span
                    key={`${active}-${prev}`}
                    className="concept-progress-fill block w-full h-full"
                    style={{ background: FOREST, animationDuration: "3200ms" }}
                    onAnimationEnd={next}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
        <p className="sr-only">{slides[active].detail}</p>
      </div>
    </>
  );
}

/**
 * Auto-advancing carousel for the Concept 3 wireframes, in two rounds (Version one, then Version two).
 * When the last screen of a version finishes, the stage slides over to the other version, and the pagination starts again.
 * It keeps playing on hover, and people who prefer reduced motion get manual control only.
 */
export function ConceptCarousel() {
  const [{ version, dir }, setVersion] = useState({ version: 0, dir: 1 });
  const reduceMotion = useReducedMotion();

  // Warm the cache so the other version's screens are ready when it takes over.
  useEffect(() => {
    VERSIONS.forEach((v) =>
      v.slides.forEach((s) => {
        const img = new Image();
        img.src = s.image;
      }),
    );
  }, []);

  const showVersion = (n: number) => setVersion((s) => (s.version === n ? s : { version: n, dir: n > s.version ? 1 : -1 }));
  const nextVersion = () => setVersion((s) => ({ version: (s.version + 1) % VERSIONS.length, dir: 1 }));

  const shift = reduceMotion ? 0 : 70;
  const variants = {
    enter: (d: number) => ({ x: d * shift, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d * -shift, opacity: 0 }),
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      role="region"
      aria-roledescription="carousel"
      aria-label="Concept 3 wireframes, version one and version two"
      style={{ background: "transparent", borderRadius: 0, height: 448 }}
    >
      {/* Version switcher */}
      <div className="absolute flex items-center justify-center gap-[28px]" style={{ top: 16, left: 0, right: 0, zIndex: 5 }} role="tablist" aria-label="Wireframe versions">
        {VERSIONS.map((v, i) => {
          const selected = i === version;
          return (
            <button
              key={v.label}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => showVersion(i)}
              className="relative border-0 bg-transparent p-0 cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{
                fontFamily: SANS,
                fontWeight: selected ? 500 : 400,
                fontSize: 18,
                lineHeight: "30px",
                color: selected ? INK : MUTED,
                opacity: selected ? 1 : 0.55,
                paddingBottom: 6,
                transition: "opacity 250ms ease, color 250ms ease",
                outlineColor: FOREST,
              }}
            >
              {v.label}
              {selected && (
                <motion.span
                  layoutId="concept-version-underline"
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

      {/* Screens for the current version */}
      <AnimatePresence mode="wait" custom={dir} initial={false}>
        <motion.div
          key={version}
          className="absolute inset-0"
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <VersionStage slides={VERSIONS[version].slides} onComplete={nextVersion} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
