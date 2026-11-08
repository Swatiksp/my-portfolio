import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import s1 from "@/assets/final-concept/final-1.jpg";
import s2 from "@/assets/final-concept/final-2.jpg";
import s3 from "@/assets/final-concept/final-3.jpg";
import s4 from "@/assets/final-concept/final-4.jpg";
import s5 from "@/assets/final-concept/final-5.jpg";
import s6 from "@/assets/final-concept/final-6.jpg";
import s7 from "@/assets/final-concept/final-7.jpg";
import s8 from "@/assets/final-concept/final-8.jpg";

const FOREST = "#1f3d2b";
const INK = "#000000";
const MUTED = "#5c4a38";
const CREAM = "#fbf6ec";
const SAND = "#f3e7d4";
const LINE = "#e5daca";
const SANS = "'Roboto', sans-serif";

const DWELL = 7000;
const ASPECT = 16 / 9;

type Screen = { image: string; title: string; note: string; alt: string };

/** High-fidelity screens as they stood before the final critique, in flow order. */
const SCREENS: readonly Screen[] = [
  {
    image: s1,
    title: "Report queue",
    note: "Reports as cards, filtered by priority and status.",
    alt: "A grid of report cards with priority and status filters above.",
  },
  {
    image: s2,
    title: "One report, with its context",
    note: "Sources on the left, flagged edits and comments on the right.",
    alt: "A Tier 1 report in the middle, a list of utilized sources on the left and a comments panel on the right.",
  },
  {
    image: s3,
    title: "Tiers side by side",
    note: "Tiers 2 to 4 sit beside Tier 1, with the same edits traced across.",
    alt: "Tier 1 on the left with Tiers 2, 3 and 4 stacked beside it, each with highlighted passages.",
  },
  {
    image: s4,
    title: "A source joins the canvas",
    note: "Selecting a source opens it as a node next to the report.",
    alt: "A source node appearing to the left of the report on the canvas.",
  },
  {
    image: s5,
    title: "The mind map",
    note: "Sources, policies and annotations connect back to the report.",
    alt: "A mind map of source and policy nodes linked to the report and its tiers.",
  },
  {
    image: s6,
    title: "Sources and policies pinned",
    note: "Pinned nodes stay next to the tiers while the comments panel returns.",
    alt: "A source node and a policy node pinned left of the report, with the comments panel open on the right.",
  },
  {
    image: s7,
    title: "Policy search",
    note: "AI relevance tags and the most commonly missed policies.",
    alt: "An AI policy search engine with relevance tags, commonly missed policies and filtered results.",
  },
  {
    image: s8,
    title: "Policy documents",
    note: "Matching passages are highlighted in the policy text.",
    alt: "Three policy documents side by side with the relevant passages highlighted.",
  },
];

/**
 * Quiet walkthrough of the high-fidelity screens. One large screen plays on top, the rest are laid out below.
 * Hover or focus pauses it. Click the large screen to read it at full size.
 */
export function FinalConceptGallery() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(0);
  const [open, setOpen] = useState(false);
  const current = SCREENS[active];
  const n = SCREENS.length;

  const goTo = useCallback(
    (i: number) => {
      const next = ((i % n) + n) % n;
      setPrev(active);
      setActive(next);
    },
    [active, n],
  );
  const next = useCallback(() => {
    if (!reduceMotion) goTo(active + 1);
  }, [active, goTo, reduceMotion]);
  const close = useCallback(() => setOpen(false), []);
  const step = useCallback(
    (d: number) => {
      const i = ((active + d) % n + n) % n;
      goTo(i);
    },
    [active, goTo, n],
  );

  useEffect(() => {
    SCREENS.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, step]);

  return (
    <div className="flex flex-col gap-[16px] w-full">
      <div
        className="concept-carousel relative w-full overflow-hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="High-fidelity screens of the infinity canvas, as they stood before the final critique"
        style={{ background: "transparent", borderRadius: 15, padding: "22px 22px 20px" }}
      >
        {/* Stage */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Open full size: ${current.title}`}
          className="relative block w-full border-0 p-0 cursor-zoom-in overflow-hidden outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
          style={{
            aspectRatio: `${ASPECT}`,
            borderRadius: 10,
            background: "#fff",
            boxShadow: "0 2px 7px rgba(0,0,0,0.08), 0 16px 32px -10px rgba(89,51,13,0.18)",
            outlineColor: FOREST,
          }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.img
              key={current.image}
              src={current.image}
              alt={current.alt}
              draggable={false}
              className="absolute inset-0 block w-full h-full object-cover select-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
          </AnimatePresence>
        </button>

        {/* Caption */}
        <div className="flex items-end justify-between gap-[16px]" style={{ paddingTop: 16, minHeight: 48 }} aria-live={reduceMotion ? "polite" : "off"}>
          <div>
            <p
              className="m-0"
              style={{ fontFamily: SANS, fontWeight: 600, fontSize: 11, lineHeight: "16px", letterSpacing: "1.1px", textTransform: "uppercase", color: FOREST }}
            >
              Screen {active + 1} of {n}
            </p>
            <p className="m-0" style={{ fontFamily: SANS, fontWeight: 500, fontSize: 18, lineHeight: "28px", color: INK }}>
              {current.title}
            </p>
          </div>
          <p className="m-0" style={{ fontFamily: SANS, fontSize: 14, lineHeight: "20px", color: MUTED, maxWidth: 420, textAlign: "right" }}>
            {current.note}
          </p>
        </div>

        {/* Filmstrip: every screen, in order. The underline under the active one is the timer. */}
        <div className="flex items-end" style={{ paddingTop: 16, gap: 8 }} role="tablist" aria-label="Screens">
          {SCREENS.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.image}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show screen ${i + 1}: ${s.title}`}
                onClick={() => goTo(i)}
                className="flex-1 min-w-0 border-0 bg-transparent p-0 cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 flex flex-col"
                style={{ gap: 6, outlineColor: FOREST }}
              >
                <img
                  src={s.image}
                  alt=""
                  draggable={false}
                  className="block w-full"
                  style={{
                    aspectRatio: `${ASPECT}`,
                    objectFit: "cover",
                    borderRadius: 5,
                    opacity: isActive ? 1 : 0.55,
                    outline: isActive ? `2px solid ${FOREST}` : `1px solid ${LINE}`,
                    outlineOffset: isActive ? 1 : 0,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    transition: "opacity 250ms ease",
                  }}
                />
                <span className="block w-full overflow-hidden" style={{ height: 3, borderRadius: 3, background: "rgba(31,61,43,0.16)" }}>
                  {i < active && <span className="block w-full h-full" style={{ background: FOREST }} />}
                  {isActive && !reduceMotion && (
                    <span
                      key={`${active}-${prev}`}
                      className="concept-progress-fill block w-full h-full"
                      style={{ background: FOREST, animationDuration: `${DWELL}ms` }}
                      onAnimationEnd={next}
                    />
                  )}
                  {isActive && reduceMotion && <span className="block w-full h-full" style={{ background: FOREST }} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="m-0" style={{ fontFamily: SANS, fontWeight: 400, fontSize: 13, lineHeight: "18px", color: INK }}>
        Shown as they were before the final feedback session. I’ve since revised the high-fidelity wire frames based on that feedback.
      </p>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="lightbox"
                role="dialog"
                aria-modal="true"
                aria-label={`${current.title}, screen ${active + 1} of ${n}`}
                className="fixed inset-0 flex flex-col items-center justify-center"
                style={{ zIndex: 100, background: "rgba(24, 18, 12, 0.88)", padding: "40px 72px" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                onClick={close}
              >
                <img
                  src={current.image}
                  alt={current.alt}
                  draggable={false}
                  className="block"
                  style={{ maxWidth: "100%", maxHeight: "calc(100vh - 150px)", borderRadius: 10, boxShadow: "0 20px 60px rgba(0,0,0,0.45)" }}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="mt-[16px] text-center" onClick={(e) => e.stopPropagation()}>
                  <p className="m-0" style={{ fontFamily: SANS, fontWeight: 500, fontSize: 18, lineHeight: "28px", color: CREAM }}>
                    {active + 1}. {current.title}
                  </p>
                  <p className="m-0" style={{ fontFamily: SANS, fontSize: 14, lineHeight: "20px", color: "rgba(251,246,236,0.7)" }}>
                    {current.note}
                  </p>
                </div>
                <NavButton label="Previous screen" side="left" onClick={() => step(-1)} />
                <NavButton label="Next screen" side="right" onClick={() => step(1)} />
                <button
                  type="button"
                  aria-label="Close"
                  onClick={(e) => {
                    e.stopPropagation();
                    close();
                  }}
                  className="absolute border-0 cursor-pointer outline-none focus-visible:outline-2"
                  style={{
                    top: 20,
                    right: 24,
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    background: "rgba(251,246,236,0.14)",
                    color: CREAM,
                    fontSize: 22,
                    lineHeight: "40px",
                    outlineColor: CREAM,
                  }}
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}

function NavButton({ label, side, onClick }: { label: string; side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="absolute border-0 cursor-pointer outline-none focus-visible:outline-2"
      style={{
        top: "50%",
        [side]: 20,
        width: 44,
        height: 44,
        marginTop: -22,
        borderRadius: 999,
        background: "rgba(251,246,236,0.14)",
        color: CREAM,
        fontSize: 22,
        lineHeight: "44px",
        outlineColor: CREAM,
      }}
    >
      {side === "left" ? "‹" : "›"}
    </button>
  );
}
