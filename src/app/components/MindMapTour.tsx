import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "motion/react";
import mindMapSvg from "@/assets/research/mind-map.svg?raw";

const SANS = "'Roboto', sans-serif";

/* The map, in the units of the Figma section (5360 x 6496). Everything below is placed in these units,
   so the tour stays correct at any size and for any image of the map (PNG now, SVG later). */
const MAP_W = 5360;
const MAP_H = 6496;

type Rect = { x: number; y: number; w: number; h: number };

// the three things the tour lands on, with a little room around each
const TARGETS: Record<"hmw" | "idea1" | "idea4", { hole: Rect; view: Rect }> = {
  // How Might We, the root on the far left
  hmw: { hole: { x: 152, y: 2832, w: 656, h: 428 }, view: { x: 0, y: 2150, w: 1500, h: 0 } },
  // Automated Pre-Ingestion Context Compiler: its tag, the idea, and its description
  idea1: { hole: { x: 3432, y: 636, w: 1792, h: 284 }, view: { x: 3380, y: 0, w: 1960, h: 0 } },
  // Record AI assumptions and force explicit human gating
  idea4: { hole: { x: 3432, y: 4770, w: 1792, h: 284 }, view: { x: 3380, y: 0, w: 1960, h: 0 } },
};

// The camera: which part of the map fills the frame at each step. `aspect` is the frame's width / height.
function viewFor(step: number, aspect: number): Rect {
  const keys = [null, "hmw", "idea1", "idea4"] as const;
  const key = keys[step];
  if (!key) {
    // the whole map, as large as it fits, centred
    const w = Math.max(MAP_W, MAP_H * aspect);
    return { x: (MAP_W - w) / 2, y: 0, w, h: MAP_H };
  }
  const t = TARGETS[key];
  const w = t.view.w;
  const h = w / aspect;
  const cy = t.hole.y + t.hole.h / 2;
  const x = Math.min(Math.max(key === "hmw" ? 0 : t.view.x, 0), MAP_W - w);
  const y = Math.min(Math.max(cy - h / 2, 0), MAP_H - h);
  return { x, y, w, h };
}

// step 0 overview, 1 How Might We, 2 first idea, 3 second idea, 4 back out with the three outlined
const HOLD = [1000, 2300, 2500, 2500];
const MOVE = 1400;
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const HOLES_BY_STEP: ("hmw" | "idea1" | "idea4")[][] = [[], ["hmw"], ["idea1"], ["idea4"], ["hmw", "idea1", "idea4"]];

// The map is exported from Figma as an SVG with live text, so it stays sharp at any zoom. It is drawn
// inline (not as an <img>) so the page can supply the Inter font the text uses.
const MAP_SVG = mindMapSvg.replace(
  /^<svg[^>]*>/,
  `<svg viewBox="0 0 ${MAP_W} ${MAP_H}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Research mind map: four pain clusters, twelve actions and five counter-evidence cards" style="display:block;font-family:Inter,'Roboto',sans-serif" fill="none">`,
);

function Art({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      style={{ width: "100%", aspectRatio: `${MAP_W} / ${MAP_H}`, ...style }}
      dangerouslySetInnerHTML={{ __html: MAP_SVG }}
    />
  );
}

const box = (r: Rect) => ({ x: r.x, y: r.y, width: r.w, height: r.h });

/** Fades everything except the chosen nodes and outlines them. Drawn in map units over the art. */
function Spotlight({ step }: { step: number }) {
  const id = useId().replace(/:/g, "");
  const active = HOLES_BY_STEP[step];
  const all = Object.keys(TARGETS) as ("hmw" | "idea1" | "idea4")[];
  const veil = step === 0 ? 0 : step === 4 ? 0.5 : 0.78;
  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      width="100%"
      height="100%"
      aria-hidden
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <defs>
        <mask id={`m-${id}`}>
          <rect width={MAP_W} height={MAP_H} fill="#fff" />
          {all.map((k) => (
            <rect
              key={k}
              {...box(TARGETS[k].hole)}
              rx={28}
              fill="#000"
              style={{ opacity: active.includes(k) ? 1 : 0, transition: "opacity 600ms ease" }}
            />
          ))}
        </mask>
      </defs>
      <rect
        width={MAP_W}
        height={MAP_H}
        fill="#fff"
        mask={`url(#m-${id})`}
        style={{ opacity: veil, transition: "opacity 700ms ease" }}
      />
    </svg>
  );
}

const pill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 12px",
  borderRadius: 999,
  border: "1px solid rgba(0,0,0,0.06)",
  background: "rgba(236,236,236,0.8)",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  color: "rgba(0,0,0,0.72)",
  fontFamily: SANS,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
};

/**
 * The research mind map. After a short pause it zooms to the How Might We on the left, then to the two
 * ideas the work was built on, then pulls back with the three outlined. It plays once; hovering holds it,
 * Replay runs it again, and the map can be opened full size.
 */
export function MindMapTour({ caption }: { caption?: string }) {
  const reduced = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameW, setFrameW] = useState(735);
  const [winH, setWinH] = useState(() => (typeof window === "undefined" ? 900 : window.innerHeight));
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [held, setHeld] = useState(false);
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);
  const finished = step === 4;

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => {
      setFrameW(el.clientWidth);
      setWinH(window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // start once, when the map is mostly on screen
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    if (reduced) {
      setStep(4);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.5)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: [0.5] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  // the timeline: wait, then advance through the steps, unless the viewer is holding it
  useEffect(() => {
    if (!started || held || finished) return;
    const t = window.setTimeout(() => setStep((s) => Math.min(4, s + 1)), HOLD[step] + (step === 0 ? 0 : MOVE));
    return () => window.clearTimeout(t);
  }, [started, held, finished, step]);

  const replay = useCallback(() => {
    setHeld(false);
    setStep(0);
    setStarted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // The frame is as tall as the whole map would be at this width, but never taller than the window,
  // so the zoomed views always sit inside what the viewer can see.
  const mapH = (frameW * MAP_H) / MAP_W;
  const frameH = Math.max(360, Math.min(mapH, winH * 0.82));
  const v = viewFor(step, frameW / frameH);
  const k = MAP_W / v.w;
  const tx = (-v.x * frameW) / v.w;
  const ty = (-v.y * frameW) / v.w;

  return (
    <figure className="m-0 w-full" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        ref={frameRef}
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        style={{
          position: "relative",
          width: "100%",
          height: frameH,
          overflow: "hidden",
          background: "#fff",
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 10,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: frameW,
            height: mapH,
            transformOrigin: "0 0",
            transform: `translate(${tx}px, ${ty}px) scale(${k})`,
            transition: reduced ? "none" : `transform ${MOVE}ms ${EASE}`,
            willChange: "transform",
          }}
        >
          <Art />
          <Spotlight step={step} />
        </div>

        <div style={{ position: "absolute", right: 12, bottom: 12, display: "flex", gap: 8 }}>
          {(started || finished) && (
            <button type="button" onClick={replay} style={pill} aria-label="Replay the zoom">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M1.5 6a4.5 4.5 0 1 0 1.4-3.3M1.5 1.2v2.4h2.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Replay
            </button>
          )}
          <button type="button" onClick={() => setOpen(true)} style={pill} aria-label="Open the whole map larger">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M7 1h4v4M5 11H1V7M11 1 7.5 4.5M1 11l3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Click to enlarge
          </button>
        </div>
      </div>
      {caption && (
        <figcaption style={{ fontFamily: SANS, fontSize: 13, lineHeight: "18px", color: "rgba(0,0,0,0.5)", textAlign: "center" }}>
          {caption}
        </figcaption>
      )}

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Research mind map"
            onClick={() => {
              setOpen(false);
              setFull(false);
            }}
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(8,8,8,0.92)", display: "flex", flexDirection: "column" }}
          >
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", fontFamily: SANS, color: "#fff", fontSize: 13 }}
              onClick={(e) => e.stopPropagation()}
            >
              <span style={{ color: "rgba(255,255,255,0.65)" }}>{full ? "Click the map to fit the screen" : "Click the map for full size"}</span>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setFull(false);
                }}
                style={{ padding: "8px 16px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.3)", background: "transparent", color: "#fff", fontFamily: SANS, fontSize: 13, cursor: "pointer" }}
              >
                Close
              </button>
            </div>
            <div style={{ flex: 1, minHeight: 0, overflow: "auto", display: "flex", justifyContent: "center", alignItems: full ? "flex-start" : "center", padding: "0 20px 20px" }}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setFull((f) => !f);
                }}
                style={full ? { width: MAP_W, flexShrink: 0, cursor: "zoom-out", background: "#fff" } : { maxWidth: "100%", maxHeight: "100%", height: "100%", aspectRatio: `${MAP_W} / ${MAP_H}`, cursor: "zoom-in", background: "#fff" }}
              >
                <Art style={{ width: "100%", height: "100%" }} />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </figure>
  );
}
