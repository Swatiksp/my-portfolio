import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { CSSProperties, ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { PROGRESS_BAR_HEIGHT } from "./SectionProgressBar";
import pentagonSvg from "@/assets/concept/pentagon.svg";
import ringScope from "@/assets/concept/ring-scope.svg";
import ringReqs from "@/assets/concept/ring-reqs.svg";
import ringEdge from "@/assets/concept/ring-edge.svg";
import ringAccept from "@/assets/concept/ring-accept.svg";
import ringGoals from "@/assets/concept/ring-goals.svg";
import iconChip from "@/assets/concept/icon-chip.svg";
import btnOpen from "@/assets/concept/btn-open.svg";
import btnExport from "@/assets/concept/btn-export.svg";
import dotScope from "@/assets/concept/dot-scope.svg";
import dotAccept from "@/assets/concept/dot-accept.svg";
import dotGoals from "@/assets/concept/dot-goals.svg";
import btnExportReady from "@/assets/concept/btn-export-ready.svg";
import { Cursor, ExportScene, GapDialog, KeyScene, ReviewListScene } from "./ConceptScenes";

const NAV_H = 66;
const CHROME = NAV_H + PROGRESS_BAR_HEIGHT;
const SANS = "'Roboto', sans-serif";
const PLEX = "'IBM Plex Sans', sans-serif";
const PLEX_MONO = "'IBM Plex Mono', monospace";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (x: number) => {
  const t = clamp(x);
  return t * t * (3 - 2 * t);
};

/* ------------------------------------------------------------------ */
/* Copy. Five beats; text sits on the left, then right, then left...   */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    title: "Start with the spec.",
    body: "Paste the spec you want an AI agent to build from, then map it.",
    weight: 1,
  },
  {
    title: "Your spec stays live.",
    body: "It becomes one card in the middle of the map, and updates as you approve lines.",
    weight: 1,
  },
  {
    title: "The map builds the anatomy of your spec.",
    body: "Scope, requirements, edge cases, acceptance and goals each grow their own ring of lines.",
    weight: 1.2,
  },
  {
    title: "Weak areas ask for you.",
    body: "Every part shows how many lines the AI added and how many need your attention.",
    weight: 1,
  },
  {
    title: "Open a part to see every line.",
    body: "Requirements, opened up: lines grouped by priority, with the ones that need you first.",
    weight: 1,
  },
  {
    title: "Answer a gap in one place.",
    body: "Open a line, see why it is here and what the AI looked for, then answer it. Your answer joins the spec.",
    weight: 2.2,
  },
  {
    title: "Back on the map, it is green.",
    body: "Every part reports no gaps found, so nothing is left that blocks export.",
    weight: 1.3,
  },
  {
    title: "Three marks to read the map by.",
    body: "AI shows what was added. No gaps found shows what is covered. The export ring shows whether anything still blocks you.",
    weight: 1.5,
  },
  {
    title: "The review list shows the way out.",
    body: "Every must-approve item is approved, so export is ready.",
    weight: 1.3,
  },
  {
    title: "Export carries every change.",
    body: "The working spec lists each line added during review. Unreviewed lines travel on as suggestions.",
    weight: 2,
  },
];

// where each step starts, as a share of the scroll (longer steps get more room)
const B: number[] = (() => {
  const total = STEPS.reduce((a, st) => a + st.weight, 0);
  const out = [0];
  STEPS.forEach((st) => out.push(out[out.length - 1] + st.weight / total));
  return out;
})();

/* ------------------------------------------------------------------ */
/* Scene 1: Add spec                                                   */
/* ------------------------------------------------------------------ */

const SPEC_TEXT =
  "Add sign-in to the Repair Tracker mobile app using our company-approved authentication library. When a technician opens the app signed out, they see a Sign in screen with one button. Tapping it opens the company login page. After a successful login the technician returns to the app and lands on My Repairs, which lists the repairs assigned to them. Signed-out users should never see My Repairs. The app should keep the technician signed in between launches. Use the existing navigation and the folder structure under /features. Sign-out goes in the Settings screen.";

function AddSpecScene({ chars = SPEC_TEXT.length }: { chars?: number }) {
  const typing = chars < SPEC_TEXT.length;
  return (
    <div style={{ width: 388, height: 471, display: "flex", flexDirection: "column", gap: 24, fontFamily: PLEX }}>
      <p style={{ margin: 0, fontWeight: 500, fontSize: 28, lineHeight: "36px", color: "#ecedef" }}>Add Spec</p>
      <div
        style={{
          background: "#1f222e",
          borderBottom: "2px solid #3a3e45",
          borderRadius: 10,
          padding: 16,
        }}
      >
        <div style={{ position: "relative", width: 356 }}>
          {/* the full text holds the box size; the typed text sits on top of it */}
          <p style={{ margin: 0, fontSize: 16, lineHeight: "26px", visibility: "hidden" }} aria-hidden>
            {SPEC_TEXT}
          </p>
          <p style={{ margin: 0, fontSize: 16, lineHeight: "26px", color: "#ecedef", position: "absolute", inset: 0 }}>
            {SPEC_TEXT.slice(0, chars)}
            {typing && <span style={{ color: "#9aa6ff" }}>▍</span>}
          </p>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            height: 41,
            padding: "4px 4px 4px 14px",
            background: "#2f3338",
            border: "1px solid #9096a0",
            borderRadius: 11,
            boxSizing: "border-box",
          }}
        >
          <span style={{ fontWeight: 500, fontSize: 13, color: "#fff", whiteSpace: "nowrap" }}>Map this spec</span>
          <img src={iconChip} alt="" width={34} height={33} draggable={false} style={{ display: "block" }} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scene 2-4: spec map (card + rings + part labels)                    */
/* Coordinates are Figma px, relative to (1400, 540) of the page.      */
/* ------------------------------------------------------------------ */

const MAP_W = 800;
const MAP_H = 730;

function SpecLiveCard({ width = 256, ready = false }: { width?: number; ready?: boolean }) {
  return (
    <div
      style={{
        width,
        height: 191,
        boxSizing: "border-box",
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        background: "#141517",
        border: "1px solid #3a3e45",
        borderRadius: 16,
        filter: "drop-shadow(0px 10px 14px rgba(0,0,0,0.5))",
        fontFamily: PLEX,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: "#ecedef", whiteSpace: "nowrap" }}>Your spec</span>
          <span
            style={{
              fontFamily: PLEX_MONO,
              fontWeight: 500,
              fontSize: 10,
              color: "#9096a0",
              background: "#1b1d20",
              border: "1px solid #2b2e33",
              borderRadius: 999,
              padding: "2px 8px",
            }}
          >
            11 lines
          </span>
        </div>
        <span style={{ fontSize: 11, color: "#9096a0" }}>Updates as you approve lines.</span>
      </div>
      <p
        style={{
          margin: 0,
          flex: 1,
          minHeight: 0,
          fontSize: 12,
          color: "#9096a0",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 5,
          WebkitBoxOrient: "vertical",
        }}
      >
        Add sign-in to the Repair Tracker mobile app using our company-approved authentication library. When a
        technician opens the app signed out, they see a Sign in screen with one button. Tapping it opens the company
        login page. After a successful login the technician returns to the app and lands on My Repairs, which lists the
        repairs assigned to them.
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <img src={btnOpen} alt="" width={30} height={30} draggable={false} style={{ display: "block" }} />
        <img
          src={ready ? btnExportReady : btnExport}
          alt=""
          width={30}
          height={30}
          draggable={false}
          style={{ display: "block", transform: "rotate(90deg)" }}
        />
      </div>
    </div>
  );
}

/*
 * Map geometry. Everything on the map is derived from one centre and one radius, so the
 * pentagon, the five ring pieces and the spokes always line up. The scene is then scaled as a
 * single unit (see Fit), so it stays aligned on mobile, tablet and desktop.
 *   - the pentagon points up; its vertices sit at -90, -18, 54, 126 and 198 degrees
 *   - each ring piece sits on the middle of a pentagon edge (-126, -54, 18, 90, 162 degrees)
 *   - each spoke runs out from behind the card through a vertex
 */
const MAP_CX = 404; // pentagon + card centre (the Figma pentagon is 430 wide, 409 tall, top at y=69)
const MAP_CY = 295;
const MAP_R = 226; // centre to vertex
const EDGE_R = MAP_R * Math.cos(Math.PI / 5); // centre to the middle of an edge
const polar = (deg: number, r: number) => {
  const t = (deg * Math.PI) / 180;
  return { x: MAP_CX + r * Math.cos(t), y: MAP_CY + r * Math.sin(t) };
};

// The ring svgs are the unrotated clusters; turned 108deg their long axis follows the edge.
const RING_ROT = 108;
const RINGS = [
  { id: "scope", src: ringScope, angle: -126, w: 202.834, h: 163.64, hue: 135 },
  { id: "reqs", src: ringReqs, angle: -54, w: 113.13, h: 227.948, hue: 135 },
  { id: "edge", src: ringEdge, angle: 18, w: 244.37, h: 89.8579, hue: 135 },
  { id: "accept", src: ringAccept, angle: 90, w: 107.758, h: 215.742, hue: 0 },
  { id: "goals", src: ringGoals, angle: 162, w: 203.031, h: 170.355, hue: -93 },
].map((r) => ({ ...r, ...(() => { const c = polar(r.angle, EDGE_R); return { cx: c.x, cy: c.y }; })() }));

const SPOKE_START = 110; // hidden behind the card
const SPOKE_END = MAP_R * 1.2;
const TICKS: [number, number, number, number][] = [-90, -18, 54, 126, 198].map((deg) => {
  const a = polar(deg, SPOKE_START);
  const b = polar(deg, SPOKE_END);
  return [a.x, a.y, b.x, b.y];
});

type Part = {
  id: string;
  x: number;
  y: number;
  w: number;
  name: string;
  dot: string;
  pills: { text: string; bg: string; border: string; color: string }[];
};

const AI_PILL = { text: "1 AI", bg: "#222659", border: "#3a44a6", color: "#9aa6ff" };
const NEED = (t: string) => ({ text: t, bg: "#3a1d1a", border: "#6b2f28", color: "#ff7a6b" });

const PARTS: Part[] = [
  { id: "scope", x: 148, y: 8, w: 146, name: "Scope", dot: dotScope, pills: [AI_PILL, NEED("1 need you")] },
  { id: "reqs", x: 514, y: 8, w: 146, name: "Requirements", dot: dotScope, pills: [AI_PILL, NEED("2 need you")] },
  { id: "edge", x: 637, y: 360, w: 146, name: "Edge Cases", dot: dotScope, pills: [AI_PILL, NEED("1 need you")] },
  {
    id: "accept",
    x: 317,
    y: 536,
    w: 175,
    name: "Acceptance",
    dot: dotAccept,
    pills: [AI_PILL, { text: "✓ No gaps found", bg: "#17301f", border: "#2c5e3c", color: "#5ccb8a" }],
  },
  {
    id: "goals",
    x: 12,
    y: 364,
    w: 147,
    name: "Goals & Context",
    dot: dotGoals,
    pills: [AI_PILL, { text: "1 to look at", bg: "#1e2350", border: "#3a44a6", color: "#9aa6ff" }],
  },
];

const OK_PILL = { text: "✓ No gaps found", bg: "#17301f", border: "#2c5e3c", color: "#5ccb8a" };

function PartLabel({ part, green = false }: { part: Part; green?: boolean }) {
  const pills = green ? [AI_PILL, OK_PILL] : part.pills;
  return (
    <div
      style={{
        width: green ? Math.max(part.w, 176) : part.w,
        height: 69,
        boxSizing: "border-box",
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        background: "#141517",
        border: "1px solid #3a3e45",
        borderRadius: 12,
        boxShadow: "0px 8px 20px rgba(0,0,0,0.45)",
        fontFamily: PLEX,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <img src={green ? dotAccept : part.dot} alt="" width={8} height={8} draggable={false} style={{ display: "block" }} />
        <span style={{ fontWeight: 500, fontSize: 13, color: "#ecedef", whiteSpace: "nowrap" }}>{part.name}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {pills.map((p) => (
          <span
            key={p.text}
            style={{
              fontWeight: 500,
              fontSize: 11,
              color: p.color,
              background: p.bg,
              border: `1px solid ${p.border}`,
              borderRadius: 999,
              padding: "3px 8px",
              whiteSpace: "nowrap",
            }}
          >
            {p.text}
          </span>
        ))}
      </div>
    </div>
  );
}

function MapScene({
  rings,
  labels,
  startZoom = 1.9,
  green = 0,
}: {
  rings: number;
  labels: number;
  startZoom?: number;
  green?: number;
}) {
  const outline = smooth(rings / 0.3);
  // start close on the card (as wide as the Add Spec box), then pull back as the map builds around it
  const zoom = 1 + (startZoom - 1) * (1 - smooth(rings / 0.55));
  const cardW = 388 - 132 * smooth(rings / 0.35);
  return (
    <div
      style={{
        position: "relative",
        width: MAP_W,
        height: MAP_H,
        transform: `scale(${zoom})`,
        transformOrigin: "404px 295px",
      }}
    >
      {/* pentagon + spokes */}
      <img
        src={pentagonSvg}
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          left: 189.13 - 0.6,
          top: 69 - 0.64,
          width: 430.92,
          height: 409.83,
          opacity: outline,
          transform: `scale(${0.9 + 0.1 * outline})`,
          transformOrigin: "50% 50%",
        }}
      />
      <svg width={MAP_W} height={MAP_H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} aria-hidden>
        {TICKS.map(([x1, y1, x2, y2], i) => {
          const len = Math.hypot(x2 - x1, y2 - y1);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#3a3e45"
              strokeWidth={1}
              strokeDasharray={len}
              strokeDashoffset={len * (1 - smooth(rings / 0.35))}
            />
          );
        })}
      </svg>

      {/* rings (exported SVGs) */}
      {RINGS.map((r, i) => {
        const k = smooth((rings - 0.12 - i * 0.11) / 0.42);
        return (
          <div
            key={r.id}
            style={{
              position: "absolute",
              left: r.cx - r.w / 2,
              top: r.cy - r.h / 2,
              width: r.w,
              height: r.h,
              transform: `rotate(${RING_ROT}deg)`,
              pointerEvents: "none",
            }}
          >
            <img
              src={r.src}
              alt=""
              draggable={false}
              className="concept-ring"
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                opacity: k,
                // red and blue clusters turn green once every gap is filled
                filter: green > 0 ? `hue-rotate(${r.hue * green}deg)` : undefined,
                transform: `scale(${0.55 + 0.45 * k})`,
                animationDelay: `${i * -1.3}s`,
                animationPlayState: k > 0.98 ? "running" : "paused",
              }}
            />
          </div>
        );
      })}

      {/* the spec card sits in the middle of everything */}
      <div style={{ position: "absolute", left: 404 - cardW / 2, top: 200 }}>
        <SpecLiveCard width={cardW} ready={green > 0.5} />
      </div>

      {/* part labels */}
      {PARTS.map((p, i) => {
        const k = smooth((labels - i * 0.14) / 0.45);
        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              opacity: k,
              transform: `translateY(${(1 - k) * 10}px) scale(${0.94 + 0.06 * k})`,
            }}
          >
            <PartLabel part={p} green={green > 0.5} />
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scene 5: Requirements opened up                                     */
/* ------------------------------------------------------------------ */

type Tile =
  | { kind: "gap"; label: string; title: string; tag: string }
  | { kind: "ok"; sentence: number; title: string };

const BANDS: { title: string; count: ReactNode; hint: string; tiles: Tile[] }[] = [
  {
    title: "Higher priority",
    count: (
      <>
        4 items · <span style={{ color: "#ee8981" }}>2 need you</span>
      </>
    ),
    hint: "These are what you see upfront",
    tiles: [
      { kind: "gap", label: "Gap · R-01", title: "How fast should sign-in feel?", tag: "Gap" },
      { kind: "ok", sentence: 2, title: "Sign in screen shows one button" },
      { kind: "ok", sentence: 3, title: "Tapping it opens the company login page" },
      { kind: "gap", label: "✦ C · R-02", title: "Give up on the login page after 30 seconds", tag: "Needs you" },
    ],
  },
  {
    title: "Mid priority",
    count: "2 items",
    hint: "What you can do later",
    tiles: [
      { kind: "ok", sentence: 4, title: "Lands on My Repairs after login" },
      { kind: "ok", sentence: 6, title: "Stays signed in between launches" },
    ],
  },
  {
    title: "Lower priority",
    count: "1 item",
    hint: "These can be done or looked at all the way at the end",
    tiles: [{ kind: "ok", sentence: 8, title: "Sign-out is in the Settings screen" }],
  },
];

function TileView({ tile, resolved = false, press = 0 }: { tile: Tile; resolved?: boolean; press?: number }) {
  const gap = tile.kind === "gap" && !resolved;
  const accent = gap ? "#ee8981" : "#83ecaf";
  return (
    <div
      style={{
        boxSizing: "border-box",
        width: "100%",
        padding: "10px 12px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        background: gap ? "#141517" : "#101112",
        border: `2px solid ${accent}`,
        borderRadius: 10,
        textAlign: "left",
        color: "#ecedef",
        transition: "border-color 300ms ease, background 300ms ease",
        transform: `scale(${1 - 0.025 * Math.sin(press * Math.PI)})`,
        boxShadow: press > 0 && press < 1 ? "0 0 0 4px rgba(154,166,255,0.35)" : undefined,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {tile.kind === "gap" && resolved ? (
          <span style={{ fontSize: 11, lineHeight: "14px" }}>Your answer · R-01</span>
        ) : gap && tile.kind === "gap" ? (
          <span style={{ fontSize: 11, lineHeight: "14px" }}>{tile.label}</span>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, lineHeight: "14px" }}>
            <span>From your spec</span>
            <span>sentence {tile.kind === "ok" ? tile.sentence : ""}</span>
          </div>
        )}
        <span style={{ fontWeight: 500, fontSize: 12, lineHeight: "16px" }}>{tile.title}</span>
      </div>
      <div style={{ display: "flex" }}>
        <span
          style={{
            height: 24,
            display: "inline-flex",
            alignItems: "center",
            padding: "0 8px",
            borderRadius: 4,
            fontSize: 12,
            background: gap ? "#371515" : "#193422",
            color: accent,
            transition: "background 300ms ease, color 300ms ease",
          }}
        >
          {gap && tile.kind === "gap" ? tile.tag : resolved ? "✓ Answered" : "✓ In your spec"}
        </span>
      </div>
    </div>
  );
}

function RequirementsScene({ q, resolve = 0, press = 0 }: { q: number; resolve?: number; press?: number }) {
  let n = 0;
  return (
    <div style={{ display: "flex", gap: 17, width: 784, height: 560, fontFamily: PLEX }}>
      {BANDS.map((band) => (
        <div
          key={band.title}
          style={{
            boxSizing: "border-box",
            width: 250,
            height: "100%",
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            background: "#141414",
            borderRadius: 10,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4, textAlign: "left" }}>
            <span style={{ fontWeight: 600, fontSize: 13, lineHeight: "18px", color: "#ecedef" }}>{band.title}</span>
            <span style={{ fontSize: 12, lineHeight: "17px", color: "#c9cdd4" }}>
              {band.title === "Higher priority" && resolve > 0.5 ? (
                <>
                  4 items · <span style={{ color: "#ee8981" }}>1 needs you</span>
                </>
              ) : (
                band.count
              )}
            </span>
            <span style={{ fontSize: 12, lineHeight: "17px", height: 34, color: "#ecedef" }}>{band.hint}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {band.tiles.map((tile) => {
              const k = smooth((q - n++ * 0.1) / 0.4);
              return (
                <div key={tile.title} style={{ opacity: k, transform: `translateY(${(1 - k) * 14}px)` }}>
                  <TileView
                    tile={tile}
                    resolved={tile.title === "How fast should sign-in feel?" && resolve > 0.5}
                    press={tile.title === "How fast should sign-in feel?" ? press : 0}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

const TEXT_W = 250;
const GAP = 28;
const PANEL_H_WIDE = 600;
const PANEL_H_NARROW = 460;

const fitScale = (w: number, h: number, panelW: number, panelH: number, max = 1.6) =>
  Math.min(panelW / w, panelH / h, max) * 0.94;

function Fit({
  w,
  h,
  panelW,
  panelH,
  opacity,
  children,
  max = 1.6,
}: {
  w: number;
  h: number;
  panelW: number;
  panelH: number;
  opacity: number;
  children: ReactNode;
  max?: number;
}) {
  const s = fitScale(w, h, panelW, panelH, max);
  return (
    <div
      aria-hidden={opacity < 0.5}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: w,
        height: h,
        opacity,
        textAlign: "left",
        visibility: opacity <= 0.001 ? "hidden" : "visible",
        transform: `translate(-50%, -50%) scale(${s})`,
        transformOrigin: "50% 50%",
      }}
    >
      {children}
    </div>
  );
}

function StepCopy({ i, style }: { i: number; style?: CSSProperties }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left", ...style }}>
      <h3
        className="m-0"
        style={{ fontFamily: "'Newsreader', 'Iowan Old Style', Georgia, serif", fontWeight: 400, fontSize: 30, lineHeight: "36px", letterSpacing: "-0.015em", color: "#fff" }}
      >
        {STEPS[i].title}
      </h3>
      <p className="m-0" style={{ fontFamily: SANS, fontWeight: 400, fontSize: 18, lineHeight: "28px", color: "rgba(255,255,255,0.78)" }}>
        {STEPS[i].body}
      </p>
    </div>
  );
}

const panelStyle: CSSProperties = {
  position: "relative",
  // clip the zoom, but leave room for the card shadow
  clipPath: "inset(-32px)",
};

export function ConceptScrollStory() {
  const reduced = useReducedMotion();
  const pinRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [chars, setChars] = useState(0);
  const [inView, setInView] = useState(false);
  const typed = useRef(false);
  const [W, setW] = useState(900);
  const [vh, setVh] = useState(() => (typeof window === "undefined" ? 900 : window.innerHeight));

  const narrow = W < 720;
  const panelH = narrow ? PANEL_H_NARROW : PANEL_H_WIDE;
  const textBlockH = narrow ? 150 : 0;
  const stageH = panelH + textBlockH + (narrow ? 16 : 0);
  const stickyTop = CHROME + Math.max(12, (vh - CHROME - stageH) / 2);
  const travel = Math.max(vh * 8, 5200);

  useEffect(() => {
    const el = rootRef.current;
    const measure = () => {
      if (el) setW(el.clientWidth);
      setVh(window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (el) ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      const pin = pinRef.current;
      if (!pin) return;
      const r = pin.getBoundingClientRect();
      setP(clamp((stickyTop - r.top) / travel));
      // the page bar shows while the story is the thing on screen
      setInView(r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.7);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, stickyTop, travel]);

  // type the spec in, quickly, the first time the section is on screen
  useEffect(() => {
    if (reduced) return;
    const el = rootRef.current;
    if (!el) return;
    let raf = 0;
    const run = () => {
      if (typed.current) return;
      typed.current = true;
      const len = SPEC_TEXT.length;
      const dur = 1500;
      const t0 = performance.now();
      const tick = (now: number) => {
        const k = clamp((now - t0) / dur);
        setChars(Math.round(len * k));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.6)) run();
      },
      { threshold: [0.6] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const ringStyles = (
    <style>{`
      @keyframes concept-ring-drift {
        0%, 100% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.025) rotate(1.6deg); }
      }
      .concept-ring { animation: concept-ring-drift 9s ease-in-out infinite; transform-origin: 50% 50%; }
      @media (prefers-reduced-motion: reduce) { .concept-ring { animation: none; } }
    `}</style>
  );

  const panelW = narrow ? W : W - TEXT_W - GAP;
  // the first map view is zoomed so its spec card is as wide as the Add Spec box was
  const startZoom = fitScale(388, 471, panelW, panelH) / fitScale(MAP_W, MAP_H, panelW, panelH);

  /* reduced motion: every beat as a static block */
  if (reduced) {
    const statics: ReactNode[] = [
      <AddSpecScene key="0" />,
      <MapScene key="1" rings={0} labels={0} startZoom={1} />,
      <MapScene key="2" rings={1} labels={0} />,
      <MapScene key="3" rings={1} labels={1} />,
      <RequirementsScene key="4" q={1} />,
      <RequirementsScene key="5" q={1} resolve={1} />,
      <MapScene key="6" rings={1} labels={1} green={1} />,
      <KeyScene key="7" q={1} />,
      <ReviewListScene key="8" q={1} />,
      <ExportScene key="9" q={0.3} />,
    ];
    const dims = [
      [388, 471],
      [MAP_W, MAP_H],
      [MAP_W, MAP_H],
      [MAP_W, MAP_H],
      [784, 560],
      [784, 560],
      [MAP_W, MAP_H],
      [560, 340],
      [420, 640],
      [900, 720],
    ];
    return (
      <div ref={rootRef} className="flex flex-col w-full" style={{ gap: 48 }}>
        {ringStyles}
        {STEPS.map((_, i) => (
          <div key={i} className="flex flex-col" style={{ gap: 20 }}>
            <StepCopy i={i} />
            <div style={{ ...panelStyle, height: PANEL_H_NARROW }}>
              <Fit w={dims[i][0]} h={dims[i][1]} panelW={W} panelH={PANEL_H_NARROW} opacity={1}>
                {statics[i]}
              </Fit>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* step weights: smooth dissolve around each boundary */
  const N = STEPS.length;
  const H = 0.018;
  const inAt = (k: number) => (k <= 0 ? 1 : k >= N ? 0 : smooth((p - (B[k] - H)) / (2 * H)));
  const w = STEPS.map((_, i) => inAt(i) * (1 - inAt(i + 1)));
  const lp = (i: number) => clamp((p - B[i]) / (B[i + 1] - B[i])); // progress within step i
  const span = (i: number) => B[i + 1] - B[i];

  const rings = clamp((p - (B[2] - 0.02)) / (span(2) * 0.9));
  const labels = clamp((p - (B[3] - 0.01)) / (span(3) * 0.6));
  const dive = smooth((p - (B[4] - 0.035)) / 0.07);
  const tiles = clamp((p - B[4]) / (span(4) * 0.5));

  // step 6: click the gap, answer it in the dialog, the line turns green
  const q5 = lp(5);
  const press = smooth((q5 - 0.14) / 0.08);
  const dialogIn = smooth((q5 - 0.2) / 0.12);
  const dialogOut = smooth((q5 - 0.86) / 0.09);
  const dialogOpacity = dialogIn * (1 - dialogOut);
  const resolve = smooth((q5 - 0.9) / 0.06);
  const answerQ = clamp((q5 - 0.3) / 0.56);
  const cursorT = smooth(q5 / 0.15);
  const cursorOpacity = 1 - smooth((q5 - 0.2) / 0.08);

  // step 7: the whole map turns green
  const green = smooth((lp(6) - 0.05) / 0.4);

  // text sits left on steps 1, 3, 5, ... and right on 2, 4, ...; the panel slides the other way
  const panelShift = narrow ? 0 : w.reduce((s, wi, i) => s + (i % 2 === 0 ? wi : 0), 0) * (TEXT_W + GAP);

  const active = w.indexOf(Math.max(...w));
  const jumpTo = (i: number) => {
    const pin = pinRef.current;
    if (!pin) return;
    const absTop = pin.getBoundingClientRect().top + window.scrollY;
    const at = B[i] + (B[i + 1] - B[i]) * 0.35;
    window.scrollTo({ top: absTop - stickyTop + at * travel, behavior: "smooth" });
  };
  const skipToScreens = () => {
    const el = document.getElementById("screens-in-the-interface");
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - (CHROME + 24), behavior: "smooth" });
  };

  const pageBar =
    typeof document === "undefined"
      ? null
      : createPortal(
          <nav
            aria-label="Concept story steps"
            style={{
              position: "fixed",
              left: "50%",
              bottom: 24,
              zIndex: 40,
              transform: `translateX(-50%) translateY(${inView ? 0 : 12}px)`,
              opacity: inView ? 1 : 0,
              pointerEvents: inView ? "auto" : "none",
              transition: "opacity 300ms ease, transform 300ms ease",
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "10px 10px 10px 18px",
              maxWidth: "calc(100vw - 24px)",
              background: "rgba(20,21,23,0.92)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 999,
              backdropFilter: "blur(10px)",
              boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
              fontFamily: SANS,
            }}
          >
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap", minWidth: 38 }}>
              {active + 1} / {N}
            </span>
            <div className="max-sm:hidden" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {STEPS.map((st, i) => (
                <button
                  key={st.title}
                  type="button"
                  aria-label={`Step ${i + 1}: ${st.title}`}
                  aria-current={i === active ? "step" : undefined}
                  onClick={() => jumpTo(i)}
                  style={{
                    padding: "8px 0",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      width: i === active ? 26 : 14,
                      height: 4,
                      borderRadius: 2,
                      background: i === active ? "#fff" : i < active ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.22)",
                      transition: "width 250ms ease, background 250ms ease",
                    }}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={skipToScreens}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                border: "1px solid rgba(255,255,255,0.28)",
                borderRadius: 999,
                background: "rgba(255,255,255,0.06)",
                color: "#fff",
                fontFamily: SANS,
                fontWeight: 500,
                fontSize: 13,
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
            >
              Skip to the screens
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M6 2v8M2.5 6.5 6 10l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </nav>,
          document.body,
        );

  return (
    <div ref={pinRef} className="relative w-full" style={{ height: stageH + travel }}>
      {ringStyles}
      {pageBar}
      <div ref={rootRef} className="sticky w-full" style={{ top: stickyTop, height: stageH }}>
        {/* text layers */}
        {STEPS.map((_, i) => {
          const right = i % 2 === 1;
          const style: CSSProperties = narrow
            ? { position: "absolute", left: 0, right: 0, top: 0, height: textBlockH }
            : {
                position: "absolute",
                top: "50%",
                width: TEXT_W,
                [right ? "right" : "left"]: 0,
                transform: `translateY(calc(-50% + ${(1 - w[i]) * 12}px))`,
              };
          return (
            <div
              key={i}
              aria-hidden={w[i] < 0.5}
              style={{
                ...style,
                opacity: w[i] * w[i],
                visibility: w[i] <= 0.001 ? "hidden" : "visible",
                ...(narrow ? { transform: `translateY(${(1 - w[i]) * 12}px)` } : null),
              }}
            >
              <StepCopy i={i} />
            </div>
          );
        })}

        {/* visual panel */}
        <div
          style={{
            ...panelStyle,
            zIndex: 2,
            position: "absolute",
            top: narrow ? textBlockH + 16 : 0,
            left: panelShift,
            width: panelW,
            height: panelH,
          }}
        >
          {/* 1 add spec */}
          <Fit w={388} h={471} panelW={panelW} panelH={panelH} opacity={w[0]}>
            <AddSpecScene chars={chars} />
          </Fit>

          {/* 2-4 the map builds, then we dive into Requirements */}
          <Fit w={MAP_W} h={MAP_H} panelW={panelW} panelH={panelH} opacity={Math.min(1, w[1] + w[2] + w[3])}>
            <div
              style={{
                width: MAP_W,
                height: MAP_H,
                transform: `scale(${1 + 4 * dive})`,
                transformOrigin: "587px 42px",
              }}
            >
              <MapScene rings={rings} labels={labels} startZoom={startZoom} />
            </div>
          </Fit>

          {/* 5-6 Requirements, then the gap dialog on top of it */}
          <Fit w={784} h={560} panelW={panelW} panelH={panelH} opacity={Math.min(1, w[4] + w[5])}>
            <div style={{ position: "relative", width: 784, height: 560, transform: `scale(${0.45 + 0.55 * dive})` }}>
              <RequirementsScene q={tiles} resolve={resolve} press={press} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 10,
                  background: "rgba(11,12,14,0.7)",
                  opacity: dialogOpacity,
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "absolute", inset: 0, opacity: cursorOpacity, pointerEvents: "none" }}>
                <Cursor x={520 - 395 * cursorT} y={420 - 250 * cursorT} press={press} />
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: dialogOpacity,
                  transformOrigin: "125px 147px",
                  transform: `scale(${0.3 + 0.7 * dialogIn})`,
                  pointerEvents: "none",
                }}
              >
                <div style={{ position: "absolute", left: 132, top: -52, transform: "scale(0.9)", transformOrigin: "50% 0%" }}>
                  <GapDialog q={answerQ} />
                </div>
              </div>
            </div>
          </Fit>

          {/* 7 the map, all green */}
          <Fit w={MAP_W} h={MAP_H} panelW={panelW} panelH={panelH} opacity={w[6]}>
            <MapScene rings={1} labels={1} startZoom={1} green={green} />
          </Fit>

          {/* 8 the key */}
          <Fit w={560} h={340} panelW={panelW} panelH={panelH} opacity={w[7]}>
            <KeyScene q={lp(7)} />
          </Fit>

          {/* 9 the review list */}
          <Fit w={420} h={640} panelW={panelW} panelH={panelH} opacity={w[8]}>
            <ReviewListScene q={lp(8)} />
          </Fit>

          {/* 10 the export window */}
          <Fit w={900} h={720} panelW={panelW} panelH={panelH} opacity={w[9]}>
            <ExportScene q={lp(9)} />
          </Fit>
        </div>
      </div>
    </div>
  );
}
