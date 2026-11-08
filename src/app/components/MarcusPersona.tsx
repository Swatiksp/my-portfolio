import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import marcusPhoto from "@/assets/prism/marcus-persona.png";
import { PROGRESS_BAR_HEIGHT } from "./SectionProgressBar";

const FOREST = "#1f3d2b";
const INK = "#000000";
const LINE = "#e5daca";
const SANS = "'Roboto', sans-serif";
const MONO = "'Roboto Condensed', 'Roboto', sans-serif";

const photoShadow = "0 0 0 1px rgba(0,0,0,0.2), 0 0 2px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.1)";

const label: CSSProperties = {
  fontFamily: SANS,
  fontWeight: 700,
  fontSize: 15,
  lineHeight: "16px",
  color: FOREST,
  margin: 0,
};

const body: CSSProperties = {
  fontFamily: SANS,
  fontWeight: 400,
  fontSize: 18,
  lineHeight: 1.5,
  color: INK,
  margin: 0,
};

const personName: CSSProperties = {
  fontFamily: MONO,
  fontWeight: 400,
  fontSize: 28,
  lineHeight: 1.2,
  letterSpacing: "0.28px",
  margin: 0,
};

const personRole: CSSProperties = {
  fontFamily: SANS,
  fontWeight: 700,
  fontSize: 15,
  lineHeight: 1.4,
  margin: 0,
};

const personNote: CSSProperties = {
  fontFamily: SANS,
  fontWeight: 400,
  fontSize: 15,
  lineHeight: 1.4,
  margin: 0,
};

const TOOLS = [
  "Email",
  "Slack",
  "Document Editing software",
  "Policy databases",
  "In-person conversations",
  "Tangible tools such as pen and paper",
];

const NAV_H = 66;
const CHROME = NAV_H + PROGRESS_BAR_HEIGHT;
const HOLD_START = 60;
const HOLD_END = 140;
const PER_STEP = 380;
const STEP_COUNT = 5;
const STAGE_W = 640;
const STAGE_H = 300;
const PHOTO = { w: 150, h: 200, x: (640 - 150) / 2, y: 48 };

const INTRO_LINE = "He’s a quality gate between an intelligence draft and its release to the world.";
const SUBHEAD = "Why his current tools slow him down";
const SUMMARY =
  "He stitches each report across four tools that do not talk to each other. A workspace that keeps source, policy, and edit together would let him sign off without hunting.";

type Pill = { label: string; why: string; x: number; y: number; r: number };

/** Offsets from the photo center. Hidden state is the center, scaled down, under the photo. */
const PILLS: Pill[] = [
  {
    label: "Policy databases",
    why: "He hunts policy by keyword and memory, and still misses what he does not know to search.",
    x: 151,
    y: -61,
    r: 5.16,
  },
  {
    label: "Email",
    why: "Edits arrive by email with no trail back to the report they belong to.",
    x: -119,
    y: -71,
    r: 9.26,
  },
  {
    label: "Document software",
    why: "The draft sits in one window while sources and policy live in another.",
    x: -169,
    y: -15,
    r: -5.61,
  },
  {
    label: "Pen and paper",
    why: "Status and priority live on paper, so a drop-in has no queue to land in.",
    x: 138,
    y: 4,
    r: -12.11,
  },
];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

function pillProgress(t: number, i: number) {
  return easeInOut(clamp(t - i, 0, 1));
}

function captionFor(t: number) {
  if (t < 0.45) return INTRO_LINE;
  if (t >= 4.4) return SUMMARY;
  return PILLS[Math.min(PILLS.length - 1, Math.max(0, Math.floor(t + 0.05)))].why;
}

function stickyTopFor(vh: number, stageH: number) {
  return Math.max(CHROME + 24, (vh - stageH + CHROME) / 2);
}

function ToolChip({ children }: { children: string }) {
  return (
    <span
      className="whitespace-nowrap"
      style={{
        background: FOREST,
        color: "#ffffff",
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: 12,
        lineHeight: "normal",
        padding: "6px 10px",
        borderRadius: 100,
      }}
    >
      {children}
    </span>
  );
}

function PersonCard({
  name,
  role,
  note,
  highlight,
}: {
  name: string;
  role: string;
  note: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="flex flex-col min-w-0"
      style={{
        flex: 1,
        gap: 4,
        padding: "16px 20px",
        borderRadius: 15,
        background: highlight ? FOREST : "#fbf6ec",
        color: highlight ? "#ffffff" : INK,
        boxSizing: "border-box",
      }}
    >
      <p style={personName}>{name}</p>
      <p style={personRole}>{role}</p>
      <p style={personNote}>{note}</p>
    </div>
  );
}

function FactColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col min-w-0" style={{ flex: 1, gap: 12 }}>
      <p style={label}>{title}</p>
      {items.map((item, i) => (
        <p
          key={item}
          className="m-0"
          style={{
            fontFamily: MONO,
            fontWeight: 400,
            fontSize: 28,
            lineHeight: 1.2,
            letterSpacing: "0.28px",
            color: INK,
            padding: "16px 0",
            borderTop: `1px solid ${LINE}`,
            borderBottom: i === items.length - 1 ? `1px solid ${LINE}` : "none",
          }}
        >
          {item}
        </p>
      ))}
    </div>
  );
}

function MeetMarcusStage({ t }: { t: number }) {
  const subOp = clamp((t - 0.12) / 0.4, 0, 1);
  const caption = captionFor(t);

  return (
    <div className="flex flex-col items-center w-full text-center" style={{ gap: 20 }}>
      <p
        className="m-0"
        style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, lineHeight: "40px", textTransform: "uppercase", color: INK }}
      >
        Meet Marcus
      </p>

      <MeetMarcusOrbit t={t} />

      <div className="flex flex-col items-center w-full" style={{ gap: 8, maxWidth: 520 }}>
        <p
          className="m-0"
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 18,
            lineHeight: "24px",
            color: FOREST,
            opacity: subOp,
            maxHeight: subOp > 0.02 ? 48 : 0,
            overflow: "hidden",
          }}
        >
          {SUBHEAD}
        </p>
        <p className="m-0" style={{ ...body, lineHeight: "28px", minHeight: 56 }}>
          {caption}
        </p>
      </div>
    </div>
  );
}

function MeetMarcusOrbit({ t }: { t: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setScale(Math.min(1, el.clientWidth / STAGE_W));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full" style={{ maxWidth: STAGE_W, height: STAGE_H * scale }}>
      <div
        className="absolute top-0 left-1/2"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          marginLeft: -STAGE_W / 2,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          isolation: "isolate",
        }}
      >
        {PILLS.map((pill, i) => {
          const p = pillProgress(t, i);
          const ox = lerp(0, pill.x, p);
          const oy = lerp(0, pill.y, p);
          const s = lerp(0.56, 1, p);
          return (
            <span
              key={pill.label}
              className="absolute whitespace-nowrap"
              style={{
                left: PHOTO.x + PHOTO.w / 2 + ox,
                top: PHOTO.y + PHOTO.h / 2 + oy,
                transform: `translate(-50%, -50%) scale(${s}) rotate(${pill.r}deg)`,
                transformOrigin: "center center",
                zIndex: 1,
                background: FOREST,
                color: "#ffffff",
                fontFamily: SANS,
                fontWeight: 500,
                fontSize: 12,
                lineHeight: "normal",
                padding: "6px 10px",
                borderRadius: 100,
                pointerEvents: "none",
              }}
            >
              {pill.label}
            </span>
          );
        })}
        <div
          className="absolute overflow-hidden"
          style={{
            left: PHOTO.x,
            top: PHOTO.y,
            width: PHOTO.w,
            height: PHOTO.h,
            borderRadius: 15,
            boxShadow: photoShadow,
            zIndex: 4,
            transform: "translateZ(0)",
            background: FOREST,
          }}
        >
          <img
            src={marcusPhoto}
            alt="Marcus, intelligence analytic editor"
            className="absolute inset-0 size-full"
            style={{ objectFit: "cover", objectPosition: "center 20%" }}
          />
        </div>
      </div>
    </div>
  );
}

/** Short story-path intro: sticky scroll, pills fly out from behind the photo. */
export function MeetMarcusStrip() {
  const reduced = useReducedMotion();
  return reduced ? <MeetMarcusStage t={STEP_COUNT} /> : <MeetMarcusScrub />;
}

function MeetMarcusScrub() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);
  const [vh, setVh] = useState(() => (typeof window === "undefined" ? 900 : window.innerHeight));
  const [stageH, setStageH] = useState(0);

  const stickyTop = stickyTopFor(vh, stageH);
  const travel = HOLD_START + STEP_COUNT * PER_STEP + HOLD_END;

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setStageH(Math.ceil(el.offsetHeight));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      const container = containerRef.current;
      if (!container || stageH <= 0) return;
      const scrolled = clamp(stickyTop - container.getBoundingClientRect().top, 0, travel);
      const next = clamp((scrolled - HOLD_START) / PER_STEP, 0, STEP_COUNT);
      setT((prev) => (Math.abs(prev - next) < 0.001 ? prev : next));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [stageH, stickyTop, travel]);

  const ready = stageH > 0;

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: ready ? stageH + travel : undefined }}>
      <div className="sticky w-full" style={{ top: stickyTop }}>
        <div ref={stageRef}>
          <MeetMarcusStage t={t} />
        </div>
      </div>
    </div>
  );
}

/** Full research persona board. */
export function MarcusPersonaCard() {
  return (
    <div className="flex flex-col w-full items-start" style={{ gap: 64 }}>
      <div className="flex w-full items-stretch" style={{ gap: 40, flexWrap: "wrap" }}>
        <div className="flex items-start min-w-0 max-md:flex-col" style={{ gap: 40, flex: "1 0 720px", maxWidth: "100%" }}>
          <div
            className="relative shrink-0 overflow-hidden"
            style={{ width: 340, maxWidth: "100%", aspectRatio: "340 / 521", borderRadius: 15, boxShadow: photoShadow }}
          >
            <img
              src={marcusPhoto}
              alt="Marcus, intelligence analytic editor"
              className="absolute inset-0 size-full"
              style={{ objectFit: "cover", objectPosition: "center 18%" }}
            />
          </div>
          <div className="flex flex-col min-w-0" style={{ gap: 10, maxWidth: 400 }}>
            <p style={label}>User persona</p>
            <div className="flex flex-col">
              <p className="m-0" style={{ fontFamily: MONO, fontWeight: 700, fontSize: 64, lineHeight: 1, color: FOREST }}>
                Marcus
              </p>
              <p className="m-0" style={{ fontFamily: SANS, fontWeight: 400, fontSize: 20, lineHeight: "30px", color: INK }}>
                Intelligence Analytic Editor
              </p>
            </div>
            <div className="flex flex-col" style={{ gap: 6 }}>
              <p style={label}>Who he is</p>
              <p style={body}>
                Four years in intelligence, the last 18 months as an editor. Detail-oriented and a strong writer, he balances
                editorial rigor with tight operational timelines.
              </p>
            </div>
            <div className="flex flex-col" style={{ gap: 6 }}>
              <p style={label}>What he does</p>
              <p style={body}>
                He is the quality gate between a draft and its release. He checks reports for accuracy, clarity, sourcing and
                compliance before they move on.
              </p>
            </div>
            <div className="flex flex-col" style={{ gap: 10 }}>
              <p style={label}>Current tools</p>
              <div className="flex flex-wrap" style={{ gap: 8 }}>
                {TOOLS.map((tool) => (
                  <ToolChip key={tool}>{tool}</ToolChip>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col" style={{ flex: "1 0 440px", maxWidth: "100%", gap: 16, minWidth: 0 }}>
          <p style={label}>Who’s around him</p>
          <div className="flex" style={{ gap: 16 }}>
            <PersonCard
              name="Raymond"
              role="Senior Reporting Authority"
              note="Consulted on sensitive wording and guidance"
            />
            <PersonCard
              name="Aisha"
              role="Senior Report Releaser"
              note="Sends reports for a final check, then releases them"
            />
          </div>
          <div className="flex justify-center" aria-hidden>
            <span style={{ width: 2, height: 28, background: "#8a7a66" }} />
          </div>
          <PersonCard
            name="Marcus"
            role="Intelligence Analytic Editor"
            note="Reviews every draft before it moves on to release"
            highlight
          />
          <div className="flex justify-center" aria-hidden>
            <span style={{ width: 2, height: 28, background: "#8a7a66" }} />
          </div>
          <PersonCard
            name="Jordan"
            role="Entry-level reporter"
            note="Writes the drafts and receives Marcus’s feedback"
          />
        </div>
      </div>

      <div className="flex w-full items-start max-lg:flex-col" style={{ gap: 40 }}>
        <FactColumn
          title="Responsibilities"
          items={[
            "Reviewing reports for accuracy, clarity, and compliance",
            "Providing constructive feedback to improve reporting quality",
          ]}
        />
        <FactColumn
          title="Challenges"
          items={[
            "Juggling several high-priority reports at once, each with its own deadline",
            "Tracking reports through a complicated workflow",
          ]}
        />
        <FactColumn
          title="Needs"
          items={[
            "Workflow tools that show report status and priority",
            "Easy access to reference material and policy guidance",
          ]}
        />
      </div>
    </div>
  );
}
