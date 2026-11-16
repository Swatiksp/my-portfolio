import { useLayoutEffect, useRef, useState } from "react";
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
                <img decoding="async" src={radio} alt="" width={14} height={14} draggable={false} style={{ display: "block" }} />
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
                  <img decoding="async"
                    src={btnExport}
                    alt=""
                    width={30}
                    height={30}
                    draggable={false}
                    style={{ position: "absolute", inset: 0, opacity: 1 - ready, transform: "rotate(90deg)" }}
                  />
                  <img decoding="async"
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
          <img decoding="async" src={iconChip} alt="" width={34} height={33} draggable={false} style={{ display: "block" }} />
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
/* Step 10: the export window (Spec document, Export tab).             */
/* Drawn at the size of the product's own window: 1100 x 880.          */
/* One window, three ways out: Copilot issue, Jira ticket, PDF.        */
/* ------------------------------------------------------------------ */

export const EXPORT_W = 1100;
export const EXPORT_H = 880;

const SPEC_ORIGINAL =
  "Add sign-in to the Repair Tracker mobile app using our company-approved authentication library. When a technician opens the app signed out, they see a Sign in screen with one button. Tapping it opens the company login page. After a successful login the technician returns to the app and lands on My Repairs, which lists the repairs assigned to them. Signed-out users should never see My Repairs. The app should keep the technician signed in between launches. Use the existing navigation and the folder structure under /features. Sign-out goes in the Settings screen.";

// lines added during review, in the order the product lists them
const REVIEW_LINES: [string, string][] = [
  ["G-01", "Assumption: the company login page already works in a mobile browser."],
  ["S-02", "Scope: the Repair Tracker mobile app only. No web sign-in."],
  ["D-03", "Sessions use refresh tokens."],
  ["D-04", "Store the token in app preferences."],
  ["D-05", "Show sign-in errors as a banner at the top of the screen."],
  ["D-06", "Use the company-approved authentication library."],
  ["D-07", "Name the new screen SignIn."],
  ["D-08", "Put new files under /features."],
  ["D-09", "Log sign-in failures with the standard logger."],
  ["E-03", "After two failed sign-ins, show a Contact IT link."],
  ["A-01", "Check: sign-in works on the two most recent iOS and Android versions."],
  ["N-02", "Technicians who already have an account get a default value in the new api-core column."],
  ["D-01", "Sessions last 12 hours."],
  ["D-02", "Add a column to the shared user table in api-core to hold the sign-in state."],
  ["R-01", "Sign-in should feel quick."],
  ["R-02", "If the company login page has not loaded after 30 seconds, show a Try again button."],
  ["R-03", "Supervisors see the repairs of their team on My Repairs."],
];

const ink = "#ecedef";
const muted = "#9096a0";
const line = "#2b2e33";
const green = "#5ccb8a";
const mono: CSSProperties = { fontFamily: PLEX_MONO, fontSize: 12, lineHeight: "18px", whiteSpace: "pre-wrap", color: ink };

function JiraMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path d="M12.6 1.5 3.2 10.9a1 1 0 0 0 0 1.4l2.9 2.9 6.5-6.5 6.5 6.5 2.9-2.9a1 1 0 0 0 0-1.4L12.6 1.5Z" fill="#2684ff" transform="translate(-0.6 0)" />
      <path d="M12 12.7 8.6 16.1l3.4 3.4 3.4-3.4L12 12.7Z" fill="#0052cc" />
    </svg>
  );
}

function Check({ on = true, size = 18 }: { on?: boolean; size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        boxSizing: "border-box",
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1.5px solid ${on ? ink : "#6b7078"}`,
        borderRadius: 3,
      }}
    >
      {on ? (
        <svg width={size - 6} height={size - 6} viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="m2.2 6.4 2.4 2.4 5-5.4" stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </span>
  );
}

function Field({ label, children, style }: { label: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ position: "absolute", display: "flex", flexDirection: "column", gap: 8, ...style }}>
      <span style={{ fontSize: 12, color: ink }}>{label}</span>
      {children}
    </div>
  );
}

const input: CSSProperties = {
  boxSizing: "border-box",
  height: 40,
  padding: "0 12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: 14,
  border: `1px solid ${line}`,
  borderRadius: 4,
  background: "#0c0d0f",
};

export function ExportScene({ q }: { q: number }) {
  // q 0..1: Copilot issue (its text scrolls to show every line added in review, then it is created), the cursor picks
  // Jira ticket (fields filled in, created), then PDF (file name, parts to include, page preview, saved).
  const toJira = ramp(q, 0.4, 0.46);
  const toPdf = ramp(q, 0.74, 0.8);
  const wA = 1 - toJira;
  const wC = toPdf;
  const wB = toJira - toPdf;
  const w = [wA, wB, wC];

  const scrollA = ramp(q, 0.05, 0.28) * 24;
  const scrollB = ramp(q, 0.48, 0.64) * 110;
  const doneA = ramp(q, 0.3, 0.34);
  const doneB = ramp(q, 0.66, 0.7);
  const doneC = ramp(q, 0.94, 0.98);
  const done = [doneA, doneB, doneC];

  // the cursor: it appears, goes to the next card, clicks, and leaves
  const c1 = ramp(q, 0.34, 0.4);
  const c2 = ramp(q, 0.69, 0.745);
  const cx = q < 0.55 ? 150 + (400 - 150) * c1 : 400 + (755 - 400) * c2;
  const cy = q < 0.55 ? 330 + (205 - 330) * c1 : 205;
  const cOpacity = clamp(ramp(q, 0.32, 0.35) * (1 - ramp(q, 0.44, 0.47)) + ramp(q, 0.67, 0.7) * (1 - ramp(q, 0.78, 0.81)));
  const press = q < 0.55 ? ramp(q, 0.395, 0.41) * (1 - ramp(q, 0.41, 0.43)) : ramp(q, 0.74, 0.755) * (1 - ramp(q, 0.755, 0.775));

  const cards = [
    { name: "Copilot issue", sub: "Creates an issue Copilot can pick up" },
    { name: "Jira ticket", sub: "Creates a ticket in your Jira project" },
    { name: "PDF", sub: "A document to share or file" },
  ];
  const buttons = ["Create issue for Copilot", "Create Jira ticket", "Save PDF"];
  const results = [
    <>
      Created: <u>Issue #482 created</u>
    </>,
    <>
      Created: <u>RT-482 · Add sign-in to the Repair Tracker mobile app</u>
    </>,
    <>Saved: SpecTrim · Repair Tracker sign-in.pdf</>,
  ];

  return (
    <div
      style={{
        position: "relative",
        width: EXPORT_W,
        height: EXPORT_H,
        overflow: "hidden",
        boxSizing: "border-box",
        background: "#0c0d0f",
        border: "1px solid #3a3e45",
        borderRadius: 6,
        filter: "drop-shadow(0px 10px 14px rgba(0,0,0,0.5))",
        fontFamily: PLEX,
        color: ink,
        textAlign: "left",
      }}
    >
      {/* header */}
      <span style={{ position: "absolute", left: 25, top: 20, fontSize: 11, letterSpacing: "0.3px" }}>SPEC DOCUMENT</span>
      <span style={{ position: "absolute", left: 25, top: 40, fontWeight: 500, fontSize: 22 }}>Your spec, as it stands</span>
      <span style={{ position: "absolute", right: 26, top: 26, padding: "9px 16px", fontSize: 14, background: "#25282c", borderRadius: 999 }}>Close</span>

      {/* tabs: Export is the open one */}
      <div style={{ position: "absolute", left: 12, right: 12, top: 78, height: 36, borderBottom: `1px solid ${line}`, display: "flex", alignItems: "center", fontSize: 14 }}>
        <span style={{ padding: "0 4px 0 4px", marginRight: 28, color: ink }}>Working spec</span>
        <span style={{ marginRight: 28, color: ink }}>Original, unchanged</span>
        <span style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, height: "100%", fontWeight: 500 }}>
          Export
          <span style={{ fontSize: 12, fontWeight: 400, padding: "3px 8px", borderRadius: 10, color: green, background: "#17301f" }}>Ready</span>
          <span aria-hidden style={{ position: "absolute", left: -16, right: -16, bottom: -1, height: 2, background: "#4457f0" }} />
        </span>
      </div>

      <span style={{ position: "absolute", left: 25, top: 136, fontSize: 11, letterSpacing: "0.6px" }}>SEND IT TO</span>

      {/* the three ways out */}
      {cards.map((c, i) => (
        <div
          key={c.name}
          style={{
            position: "absolute",
            left: 25 + i * 353,
            top: 163,
            width: 341,
            height: 70,
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "0 14px",
            borderRadius: 6,
            border: `1px solid ${w[i] > 0.5 ? "#fff" : line}`,
            background: w[i] > 0.5 ? "#16181c" : "#0c0d0f",
            transition: "border-color 120ms",
          }}
        >
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: 6,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: i === 0 ? "#25282c" : i === 1 ? "#fff" : "#9a9cf8",
              color: i === 0 ? "#9096a0" : "#262a86",
              fontFamily: i === 0 ? PLEX_MONO : PLEX,
              fontWeight: 600,
              fontSize: i === 0 ? 13 : 11,
            }}
          >
            {i === 0 ? "</>" : i === 1 ? <JiraMark /> : "PDF"}
          </span>
          <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{c.name}</span>
            <span style={{ fontSize: 12, color: muted }}>{c.sub}</span>
          </span>
          {w[i] > 0.5 ? (
            <span style={{ position: "absolute", right: 10, top: 8 }}>
              <Check />
            </span>
          ) : null}
        </div>
      ))}

      {/* 1 Copilot issue: the text that is sent */}
      <div style={{ position: "absolute", left: 25, top: 245, width: 1048, height: 543, boxSizing: "border-box", overflow: "hidden", opacity: wA, background: "#111316", border: `1px solid ${line}`, borderRadius: 6, padding: 16, visibility: wA <= 0.001 ? "hidden" : "visible" }}>
        <div style={{ ...mono, transform: `translateY(${-scrollA}px)` }}>
          {"Title: Add sign-in to the Repair Tracker mobile app\nSpec: "}
          {SPEC_ORIGINAL}
          {"\nAdded during review:\n"}
          {REVIEW_LINES.map(([id, text]) => `  ${id}: ${text}\n`).join("")}
          {"Unreviewed lines:\n  G-01\n  S-02\n  D-03\n  D-04"}
        </div>
      </div>

      {/* 2 Jira ticket: the fields, filled in and editable, and the description */}
      <div style={{ position: "absolute", inset: 0, opacity: wB, visibility: wB <= 0.001 ? "hidden" : "visible" }}>
        <Field label="Project" style={{ left: 25, top: 258, width: 400 }}>
          <div style={input}>
            <span>Repair Tracker (RT)</span>
            <span style={{ color: muted, fontSize: 11 }}>⌄</span>
          </div>
        </Field>
        <Field label="Issue type" style={{ left: 25, top: 338, width: 400 }}>
          <div style={input}>
            <span>Story</span>
            <span style={{ color: muted, fontSize: 11 }}>⌄</span>
          </div>
        </Field>
        <Field label="Summary" style={{ left: 25, top: 418, width: 400 }}>
          <div style={input}>Add sign-in to the Repair Tracker mobile app</div>
        </Field>
        <Field label="Labels" style={{ left: 25, top: 498, width: 400 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {["spectrim", "sign-in", "+ add"].map((t, i) => (
              <span key={t} style={{ fontFamily: PLEX_MONO, fontSize: 12, padding: "4px 12px", borderRadius: 999, border: `1px ${i === 2 ? "dashed" : "solid"} #4a4f57`, color: i === 2 ? muted : ink }}>
                {t}
              </span>
            ))}
          </div>
        </Field>
        <div style={{ position: "absolute", left: 25, top: 558, display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
          <Check /> Attach the original, unchanged spec
        </div>
        <span style={{ position: "absolute", left: 25, top: 596, fontSize: 12, color: muted }}>You can edit any field before the ticket is created.</span>
        <Field label="Description" style={{ left: 457, top: 258 }}>
          <div style={{ boxSizing: "border-box", width: 616, height: 515, overflow: "hidden", background: "#111316", border: `1px solid ${line}`, borderRadius: 6, padding: 16 }}>
            <div style={{ ...mono, transform: `translateY(${-scrollB}px)` }}>
              {"Spec\n"}
              {SPEC_ORIGINAL}
              {"\n\nAdded during review\n"}
              {REVIEW_LINES.map(([id, text]) => `  ${id}  ${text}\n`).join("")}
            </div>
          </div>
        </Field>
      </div>

      {/* 3 PDF: file name, what to include, page size, and a page preview */}
      <div style={{ position: "absolute", inset: 0, opacity: wC, visibility: wC <= 0.001 ? "hidden" : "visible" }}>
        <Field label="File name" style={{ left: 25, top: 258, width: 420 }}>
          <div style={input}>SpecTrim · Repair Tracker sign-in.pdf</div>
        </Field>
        <Field label="Include" style={{ left: 25, top: 338 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
            {[
              ["Spec", true],
              ["Added during review", true],
              ["Left out on purpose", true],
              ["Still open", true],
              ["Original, unchanged", false],
            ].map(([t, on]) => (
              <div key={t as string} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Check on={on as boolean} /> {t as string}
              </div>
            ))}
          </div>
        </Field>
        <Field label="Page size" style={{ left: 25, top: 530 }}>
          <div style={{ display: "flex", width: 220, height: 36, border: `1px solid ${line}`, borderRadius: 4, overflow: "hidden", fontSize: 12 }}>
            <span style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#33373d", fontWeight: 500 }}>A4</span>
            <span style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: muted }}>Letter</span>
          </div>
        </Field>
        <Field label="Preview · page 1 of 2" style={{ left: 537, top: 258 }}>
          <div style={{ boxSizing: "border-box", width: 400, height: 515, background: "#fff", color: "#16181c", padding: "30px 30px" }}>
            <div style={{ fontWeight: 600, fontSize: 18, lineHeight: "25px" }}>Add sign-in to the Repair Tracker mobile app</div>
            <div style={{ marginTop: 10, fontSize: 9, color: "#6b7078" }}>SpecTrim · Nov 15, 2026 · 5 items approved</div>
            <div style={{ marginTop: 22, fontSize: 8, fontWeight: 700, letterSpacing: "0.5px" }}>SPEC</div>
            {[1, 1, 1, 0.55].map((wd, i) => (
              <div key={i} style={{ height: 4, width: `${wd * 100}%`, background: "#dcdde0", borderRadius: 2, marginTop: 8 }} />
            ))}
            <div style={{ marginTop: 28, fontSize: 8, fontWeight: 700, letterSpacing: "0.5px" }}>ADDED DURING REVIEW</div>
            {[
              ["G-01", "Assumption: the company login page already works in a mobile browser"],
              ["S-02", "Scope: the Repair Tracker mobile app only. No web sign-in."],
              ["D-03", "Sessions use refresh tokens."],
            ].map(([id, t]) => (
              <div key={id} style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 8 }}>
                <span style={{ fontFamily: PLEX_MONO, color: "#8a8f98" }}>{id}</span>
                <span>{t}</span>
              </div>
            ))}
            <div style={{ marginTop: 26, fontSize: 8, fontWeight: 700, letterSpacing: "0.5px" }}>STILL OPEN</div>
            {[1, 0.55].map((wd, i) => (
              <div key={i} style={{ height: 4, width: `${wd * 100}%`, background: "#dcdde0", borderRadius: 2, marginTop: 8 }} />
            ))}
          </div>
        </Field>
      </div>

      {/* footer: the button for the chosen way out, and what it did */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, height: 1, background: line }} />
      {buttons.map((b, i) => (
        <div
          key={b}
          style={{
            position: "absolute",
            left: 25,
            top: 817,
            height: 44,
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: w[i],
            visibility: w[i] <= 0.001 ? "hidden" : "visible",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 6px 0 16px", height: 44, boxSizing: "border-box", borderRadius: 8, background: "#5dd391", border: "2px solid #a8f0c6", color: "#0b2316", fontWeight: 500, fontSize: 14 }}>
            {b}
            <span style={{ width: 34, height: 34, borderRadius: 6, background: "#0b1510", color: "#5dd391", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>↗</span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: green, opacity: done[i] }}>
            <Check size={16} /> {results[i]}
          </span>
        </div>
      ))}

      <div style={{ position: "absolute", inset: 0, opacity: cOpacity, pointerEvents: "none" }}>
        <Cursor x={cx} y={cy} press={press} />
      </div>
    </div>
  );
}
