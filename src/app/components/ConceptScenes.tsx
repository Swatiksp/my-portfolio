import type { CSSProperties, ReactNode } from "react";
import iconChip from "@/assets/concept/icon-chip.svg";
import btnExport from "@/assets/concept/btn-export.svg";
import btnExportReady from "@/assets/concept/btn-export-ready.svg";
import radio from "@/assets/concept/radio.svg";

const PLEX = "'IBM Plex Sans', sans-serif";
const PLEX_MONO = "'IBM Plex Mono', monospace";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smooth = (x: number) => {
  const t = clamp(x);
  return t * t * (3 - 2 * t);
};
/** 0 before `a`, 1 after `b`. */
const ramp = (q: number, a: number, b: number) => smooth((q - a) / (b - a));

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

const Button = ({ children, primary = false, style }: { children: ReactNode; primary?: boolean; style?: CSSProperties }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "8px 16px",
      borderRadius: 8,
      fontWeight: 500,
      fontSize: 13,
      whiteSpace: "nowrap",
      color: primary ? "#fff" : "#ecedef",
      background: primary ? "#2f3338" : "#25282c",
      border: `1px solid ${primary ? "#9096a0" : "#3a3e45"}`,
      ...style,
    }}
  >
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* Step 6: the gap dialog (Item dialog / 1 Gap)                         */
/* ------------------------------------------------------------------ */

const CHOICES = ["Under 2 seconds", "Under 5 seconds", "No time target"];

export function GapDialog({ q }: { q: number }) {
  // q: 0..1 across the answer. The first choice is picked, then it is added to the spec.
  const picked = ramp(q, 0.18, 0.3);
  const press = ramp(q, 0.62, 0.72);
  const done = ramp(q, 0.78, 0.9);
  return (
    <div
      style={{
        width: 520,
        boxSizing: "border-box",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        background: "#141517",
        border: "1px solid #3a3e45",
        borderRadius: 16,
        filter: "drop-shadow(0px 10px 14px rgba(0,0,0,0.5))",
        fontFamily: PLEX,
        color: "#ecedef",
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontFamily: PLEX_MONO,
            fontWeight: 500,
            fontSize: 11,
            letterSpacing: "0.44px",
            color: done > 0.5 ? "#5ccb8a" : "#ff7a6b",
            background: done > 0.5 ? "#17301f" : "#3a1d1a",
            border: `1px solid ${done > 0.5 ? "#2c5e3c" : "#6b2f28"}`,
            borderRadius: 999,
            padding: "4px 12px",
            transition: "all 250ms ease",
          }}
        >
          {done > 0.5 ? "ANSWERED · ADDED TO SPEC" : "GAP · DOES NOT BLOCK EXPORT"}
        </span>
        <span
          style={{
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#25282c",
            border: "1px solid #3a3e45",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          ×
        </span>
      </div>
      <p style={{ margin: 0, fontWeight: 600, fontSize: 20 }}>How fast should sign-in feel?</p>
      <p style={{ margin: 0, fontSize: 13, color: "#9096a0" }}>
        Why you’re asked: your spec says a technician signs in, but not how quickly the app should respond.
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: 8,
          background: "#1b1d20",
          border: "1px solid #2b2e33",
          borderRadius: 12,
        }}
      >
        {[
          ["Your spec", "No sentence covers this. Closest: sentence 2 ↗"],
          ["Looked for", "Response time, loading states, and what a slow login page does. Checked the whole spec."],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "flex",
              gap: 12,
              padding: "4px 8px",
              background: "#1b1d20",
              border: "1px solid #2b2e33",
              borderRadius: 8,
              fontSize: 12,
            }}
          >
            <span style={{ width: 76, flexShrink: 0, fontWeight: 600, color: "#9096a0" }}>{k}</span>
            <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {v}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontWeight: 600, fontSize: 12 }}>Pick an answer, or write your own</span>
        {CHOICES.map((c, i) => {
          const on = i === 0 && picked > 0.5;
          return (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0" }}>
              <span style={{ position: "relative", width: 14, height: 14 }}>
                <img src={radio} alt="" width={14} height={14} draggable={false} style={{ display: "block" }} />
                <span
                  style={{
                    position: "absolute",
                    inset: 3,
                    borderRadius: 999,
                    background: "#9aa6ff",
                    transform: `scale(${on ? 1 : 0})`,
                    transition: "transform 200ms ease",
                  }}
                />
              </span>
              <span style={{ fontSize: 13, color: on ? "#fff" : "#ecedef" }}>{c}</span>
            </div>
          );
        })}
        <div
          style={{
            padding: 12,
            background: "#1b1d20",
            border: "1px dashed #3a3e45",
            borderRadius: 4,
            fontSize: 13,
            color: "#9096a0",
          }}
        >
          Or write your own answer…
        </div>
        <span style={{ fontSize: 11 }}>Your answer is added to the spec as a new line.</span>
      </div>
      <div style={{ height: 1, background: "#2b2e33" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <Button>Skip for now</Button>
          <Button>Ask someone else ▾</Button>
        </div>
        <Button
          primary
          style={{
            transform: `scale(${1 - 0.06 * Math.sin(press * Math.PI)})`,
            background: done > 0.5 ? "#17301f" : "#2f3338",
            borderColor: done > 0.5 ? "#5ccb8a" : "#9096a0",
            color: done > 0.5 ? "#5ccb8a" : "#fff",
            transition: "background 200ms ease, border-color 200ms ease, color 200ms ease",
          }}
        >
          {done > 0.5 ? "✓ Added" : "Add to spec"}
        </Button>
      </div>
      <span style={{ fontSize: 11, color: "#9096a0" }}>Skipping keeps this gap open. It only warns at export.</span>
    </div>
  );
}

/** a pointer that glides from (x0,y0) to (x1,y1) */
export function Cursor({ x, y, press }: { x: number; y: number; press: number }) {
  return (
    <svg
      width="22"
      height="28"
      viewBox="0 0 22 28"
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${1 - 0.12 * press})`,
        transformOrigin: "2px 2px",
        pointerEvents: "none",
        filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.5))",
      }}
      aria-hidden
    >
      <path d="M2 2 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.8 L18.5 15.8 Z" fill="#fff" stroke="#0b0c0e" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Step 8: the key (what the marks on the map mean)                    */
/* ------------------------------------------------------------------ */

export function KeyScene({ q }: { q: number }) {
  const rows = [
    {
      title: "AI",
      body: "The AI wrote or guessed this. Every AI change waits for a person to approve it.",
      swatch: (
        <span
          style={{
            fontWeight: 500,
            fontSize: 11,
            color: "#9aa6ff",
            background: "#222659",
            border: "1px solid #3a44a6",
            borderRadius: 999,
            padding: "2px 8px",
          }}
        >
          1 AI
        </span>
      ),
    },
    {
      title: "Nothing found",
      body: "The AI found no gap in this part, so nothing is left to decide here.",
      swatch: (
        <span
          style={{
            fontWeight: 500,
            fontSize: 11,
            color: "#5ccb8a",
            background: "#17301f",
            border: "1px solid #2c5e3c",
            borderRadius: 999,
            padding: "3px 8px",
            whiteSpace: "nowrap",
          }}
        >
          ✓ No gaps found
        </span>
      ),
    },
    {
      title: "Export ring",
      body: "A dashed ring means export is blocked: a must-approve item is still open. Solid means ready.",
      swatch: null,
    },
  ];
  const ready = ramp(q, 0.7, 0.85);
  return (
    <div
      style={{
        width: 560,
        boxSizing: "border-box",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        background: "#141517",
        border: "1px solid #2b2e33",
        borderRadius: 16,
        fontFamily: PLEX,
        color: "#ecedef",
        textAlign: "left",
      }}
    >
      <span style={{ fontFamily: PLEX_MONO, fontWeight: 500, fontSize: 10, letterSpacing: "0.6px", color: "#9096a0", marginBottom: 8 }}>
        KEY
      </span>
      {rows.map((r, i) => {
        const on = ramp(q, i * 0.28, i * 0.28 + 0.14);
        return (
          <div
            key={r.title}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "16px 12px",
              borderRadius: 12,
              background: `rgba(255,255,255,${0.04 * on})`,
              opacity: 0.35 + 0.65 * on,
              transform: `translateX(${(1 - on) * 6}px)`,
            }}
          >
            <div style={{ width: 150, flexShrink: 0, display: "flex", justifyContent: "center" }}>
              {r.swatch ?? (
                <span style={{ position: "relative", width: 30, height: 30 }}>
                  <img
                    src={btnExport}
                    alt=""
                    width={30}
                    height={30}
                    draggable={false}
                    style={{ position: "absolute", inset: 0, opacity: 1 - ready, transform: "rotate(90deg)" }}
                  />
                  <img
                    src={btnExportReady}
                    alt=""
                    width={30}
                    height={30}
                    draggable={false}
                    style={{ position: "absolute", inset: 0, opacity: ready, transform: "rotate(90deg)" }}
                  />
                </span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontWeight: 500, fontSize: 14 }}>{r.title}</span>
              <span style={{ fontSize: 13, lineHeight: "18px", color: "#9096a0" }}>{r.body}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 9: the review list, ready to export                            */
/* ------------------------------------------------------------------ */

const DONE_ROWS = [
  { id: "D-01", title: "Keep sessions for 12 hours", meta: "D-01 · Decisions", tag: "Approved", ai: true },
  { id: "D-02", title: "Add a column to the shared user table in api-core", meta: "D-02 · Decisions", tag: "Approved", ai: true },
  { id: "R-02", title: "Give up on the login page after 30 seconds", meta: "R-02 · Requirements", tag: "Approved", ai: true },
  { id: "R-01", title: "How fast should sign-in feel?", meta: "R-01 · Requirements", tag: "Answered", ai: false },
];

export function ReviewListScene({ q }: { q: number }) {
  const pulse = ramp(q, 0.7, 0.85);
  return (
    <div
      style={{
        width: 420,
        boxSizing: "border-box",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        background: "#141517",
        border: "1px solid #3a3e45",
        borderRadius: 16,
        filter: "drop-shadow(0px 10px 14px rgba(0,0,0,0.5))",
        fontFamily: PLEX,
        color: "#ecedef",
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#25282c",
            border: "1px solid #3a3e45",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          «
        </span>
        <span style={{ flex: 1, fontWeight: 600, fontSize: 16 }}>Review list</span>
        <span
          style={{
            fontWeight: 500,
            fontSize: 11,
            padding: "4px 12px",
            background: "#25282c",
            border: "1px solid #3a3e45",
            borderRadius: 8,
          }}
        >
          + Add a line
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: 12,
          background: "#17301f",
          border: "1px solid #2c5e3c",
          borderRadius: 12,
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 14, color: "#5ccb8a" }}>Ready to export</span>
        <span style={{ fontSize: 12 }}>
          Every must-approve item is approved. Anything optional travels on, labelled Still open.
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                background: ramp(q, 0.1 + i * 0.12, 0.2 + i * 0.12) > 0.5 ? "#5ccb8a" : "#3a3e45",
                transition: "background 250ms ease",
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: 11, color: "#9096a0" }}>3 of 3 must-approve items approved</span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            height: 41,
            padding: "4px 4px 4px 38px",
            boxSizing: "border-box",
            background: "#2f3338",
            border: "1px solid #9096a0",
            borderRadius: 11,
            boxShadow: `0 0 0 ${6 * pulse}px rgba(92,203,138,${0.25 * (1 - pulse * 0.4)})`,
          }}
        >
          <span style={{ flex: 1, textAlign: "center", fontWeight: 500, fontSize: 13, color: "#fff" }}>Export to Copilot</span>
          <img src={iconChip} alt="" width={34} height={33} draggable={false} style={{ display: "block" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 2, padding: 4, background: "#0c0d0f", border: "1px solid #2b2e33", borderRadius: 10 }}>
        {[
          ["Needs you · 0", true],
          ["Review later · 6", false],
          ["Decided by rule · 5", false],
        ].map(([t, on]) => (
          <span
            key={t as string}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "8px 4px",
              borderRadius: 8,
              fontSize: 11,
              whiteSpace: "nowrap",
              fontWeight: on ? 500 : 400,
              color: on ? "#ecedef" : "#9096a0",
              background: on ? "#25282c" : "transparent",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontFamily: PLEX_MONO, fontWeight: 500, fontSize: 11, letterSpacing: "0.66px", color: "#9096a0" }}>
          DONE · 4
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {DONE_ROWS.map((r, i) => {
            const k = ramp(q, i * 0.1, i * 0.1 + 0.2);
            return (
              <div
                key={r.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 8,
                  background: "#1b1d20",
                  border: "1px solid #2b2e33",
                  borderRadius: 10,
                  opacity: k,
                  transform: `translateY(${(1 - k) * 8}px)`,
                }}
              >
                {r.ai && (
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: PLEX_MONO,
                      fontWeight: 500,
                      fontSize: 10,
                      color: "#9aa6ff",
                      background: "#222659",
                      border: "1px solid #3a44a6",
                      borderRadius: 8,
                    }}
                  >
                    AI
                  </span>
                )}
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontWeight: 500, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.title}
                  </span>
                  <span style={{ fontSize: 11, color: "#9096a0" }}>{r.meta}</span>
                </div>
                <span
                  style={{
                    width: 96,
                    flexShrink: 0,
                    textAlign: "center",
                    padding: "8px 12px",
                    boxSizing: "border-box",
                    fontWeight: 500,
                    fontSize: 12,
                    color: "#5ccb8a",
                    background: "#17301f",
                    border: "1px solid #2c5e3c",
                    borderRadius: 8,
                  }}
                >
                  ✓ {r.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 10: the export window                                          */
/* ------------------------------------------------------------------ */

const SPEC_ORIGINAL =
  "Add sign-in to the Repair Tracker mobile app using our company-approved authentication library. When a technician opens the app signed out, they see a Sign in screen with one button. Tapping it opens the company login page. After a successful login the technician returns to the app and lands on My Repairs, which lists the repairs assigned to them. Signed-out users should never see My Repairs. The app should keep the technician signed in between launches. Use the existing navigation and the folder structure under /features. Sign-out goes in the Settings screen.";

const ADDED = [
  ["R-01", "Sign-in finishes within 2 seconds on a normal connection.", "Answered by you · Requirements"],
  ["R-02", "If the company login page has not loaded after 30 seconds, show a Try again button.", "Approved by you · Requirements"],
  ["D-01", "Keep sessions for 12 hours.", "Approved by you · Decisions"],
  ["D-02", "Add a column to the shared user table in api-core.", "Approved by you · Decisions"],
];

const UNREVIEWED = [
  ["G-01", "Assumption: the company login page already works in a mobile browser.", "Goals"],
  ["S-02", "Scope: the Repair Tracker mobile app only. No web sign-in.", "Scope"],
  ["D-03", "Sessions use refresh tokens.", "Decisions"],
  ["D-04", "Store the token in app preferences.", "Decisions"],
  ["D-05", "Show sign-in errors as a banner at the top of the screen.", "Decisions"],
];

export function ExportScene({ q }: { q: number }) {
  // first the working spec (every change), then the export itself
  const tab = ramp(q, 0.42, 0.52); // 0 = working spec, 1 = export
  const scroll = ramp(q, 0.12, 0.4) * 60 + ramp(q, 0.6, 0.95) * 150;
  const Tab = ({ label, on }: { label: string; on: boolean }) => (
    <span
      style={{
        padding: "10px 0",
        marginRight: 24,
        fontSize: 14,
        fontWeight: on ? 500 : 400,
        color: on ? "#ecedef" : "#9096a0",
        borderBottom: `2px solid ${on ? "#4457f0" : "transparent"}`,
        transition: "all 200ms ease",
      }}
    >
      {label}
    </span>
  );
  return (
    <div
      style={{
        position: "relative",
        width: 900,
        height: 720,
        boxSizing: "border-box",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        overflow: "hidden",
        background: "#0c0d0f",
        border: "1px solid #3a3e45",
        borderRadius: 16,
        filter: "drop-shadow(0px 10px 14px rgba(0,0,0,0.5))",
        fontFamily: PLEX,
        color: "#ecedef",
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 11, color: "#9096a0", letterSpacing: "0.3px" }}>
            {tab > 0.5 ? "EXPORT PREVIEW" : "SPEC DOCUMENT"}
          </span>
          <span style={{ fontWeight: 500, fontSize: 24 }}>{tab > 0.5 ? "Export to Copilot" : "Your spec, as it stands"}</span>
        </div>
        <span style={{ padding: "10px 24px", fontSize: 14, background: "#25282c", borderRadius: 999 }}>Close</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #2b2e33" }}>
        <Tab label="Working spec" on={tab <= 0.5} />
        <Tab label="Original, unchanged" on={false} />
        <Tab label="Export to Copilot" on={tab > 0.5} />
        <span
          style={{
            marginLeft: -8,
            fontSize: 12,
            padding: "3px 12px",
            borderRadius: 6,
            color: "#5ccb8a",
            background: "#17301f",
          }}
        >
          Ready
        </span>
      </div>

      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
        {/* working spec: every change */}
        <div style={{ position: "absolute", inset: 0, opacity: 1 - tab, transform: `translateY(${-scroll * (1 - tab)}px)` }}>
          <div style={{ padding: "10px 12px", background: "#1f222e", border: "1px solid #2b2e33", borderRadius: 12, fontSize: 12, lineHeight: "18px" }}>
            <b style={{ display: "block", marginBottom: 4 }}>Your original text, unchanged</b>
            {SPEC_ORIGINAL}
          </div>
          <div style={{ margin: "16px 0 8px", fontSize: 13 }}>
            Added during review <span style={{ color: "#9096a0" }}>· {ADDED.length + UNREVIEWED.length}</span>
          </div>
          {[...ADDED, ...UNREVIEWED].map(([id, text, meta], i) => {
            const mine = i < ADDED.length;
            const k = ramp(q, 0.02 + i * 0.03, 0.12 + i * 0.03);
            return (
              <div
                key={id}
                style={{
                  display: "flex",
                  gap: 16,
                  padding: "12px 0",
                  borderTop: "1px solid #2b2e33",
                  opacity: k,
                  transform: `translateY(${(1 - k) * 10}px)`,
                }}
              >
                <span style={{ width: 40, fontWeight: 600, fontSize: 14 }}>{id}</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                  <span style={{ fontSize: 14 }}>“{text}”</span>
                  <span style={{ fontSize: 12, color: mine ? "#5ccb8a" : "#9096a0" }}>
                    {mine ? meta : `${meta} · Unreviewed · in the digest`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* export preview */}
        <div style={{ position: "absolute", inset: 0, opacity: tab, transform: `translateY(${(1 - tab) * 14}px)` }}>
          <div
            style={{
              padding: "14px 20px",
              marginBottom: 14,
              background: "#17301f",
              border: "1px solid #2c5e3c",
              borderRadius: 12,
              fontSize: 14,
              lineHeight: "20px",
            }}
          >
            <b style={{ display: "block", color: "#5ccb8a", marginBottom: 2 }}>Ready to export</b>
            Every must-approve item is approved. Unreviewed lines and Still open items go along as suggestions.
          </div>
          <div style={{ overflow: "hidden", height: 470, borderRadius: 12, background: "#1f222e" }}>
            <div style={{ padding: "16px 20px", fontSize: 13, lineHeight: "20px", transform: `translateY(${-scroll * tab}px)` }}>
              <p style={{ margin: "0 0 14px" }}>Title: Add sign-in to the Repair Tracker mobile app using our company-approved authentication library.</p>
              <b>## Spec (original text, unchanged)</b>
              <p style={{ margin: "6px 0 14px" }}>{SPEC_ORIGINAL}</p>
              <b>## Added during review (approved or answered by a person)</b>
              {ADDED.map(([id, text]) => (
                <p key={id} style={{ margin: "6px 0", color: "#83ecaf" }}>
                  - [{id}] {text}
                </p>
              ))}
              <b style={{ display: "block", marginTop: 14 }}>## Unreviewed lines (no person has approved these yet)</b>
              {UNREVIEWED.map(([id, text]) => (
                <p key={id} style={{ margin: "6px 0" }}>
                  - [{id}] {text} (Unreviewed · in the digest)
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
