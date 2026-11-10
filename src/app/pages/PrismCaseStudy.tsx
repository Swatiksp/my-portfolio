import logoMark from "@/assets/logo/logo.svg";
import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { TypeIn } from "../components/TypeIn";
import { CaseHero, HeroPill } from "../components/CaseHero";
import heropBg from "@/assets/craft-poster/p-bg.webp";
import heropShot from "@/assets/craft-poster/p-shot.webp";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Focus, FocusCtx, LensDrift, revealText, SectionFocusProvider } from "../components/SectionReveal";
import { PROJECTS } from "../data/projects";
import { PAIN_POINTS, type PainPoint } from "../data/prismPainPoints";
import { ConceptCarousel } from "../components/ConceptCarousel";
import { FinalFlowCarousel } from "../components/FinalFlowCarousel";
import { FinalConceptGallery } from "../components/FinalConceptGallery";
import { OutcomeVideoCards } from "../components/OutcomePlaceholderCard";
import { IdeasDevelopedCards } from "../components/IdeasDevelopedCards";
import { MarcusPersonaCard, MeetMarcusStrip } from "../components/MarcusPersona";
import { JourneyScrollScene } from "../components/JourneyScrollScene";
import { StepScrollScene } from "../components/StepScrollScene";
import { EdgeGlyphs } from "../components/EdgeGlyphs";
import { SectionProgressBar, PROGRESS_BAR_HEIGHT } from "../components/SectionProgressBar";
import evidenceBg from "@/assets/final-outcomes/bg.jpg";

/* ───────────────────────── Design tokens (Figma "Prism case study — live", node 766:1250) ───────────────────────── */
const C = {
  forest: "#1f3d2b",
  prism: "#396f4e",
  ink: "#000000",
  cream: "#fbf6ec",
  evidence: "#fbf6ef",
  sand: "#f3e7d4",
  line: "#e5daca",
  rule: "#536454",
  bar: "#133e2b",
};
const MONO = "'Roboto Condensed', 'Roboto', sans-serif";
const SANS = "'Roboto', sans-serif";
const NAV = "'Plus Jakarta Sans', sans-serif";

const NAV_H = 66;

const T = {
  eyebrow: {
    fontFamily: SANS,
    fontWeight: 600,
    fontSize: 12,
    lineHeight: "16px",
    letterSpacing: "1.44px",
    textTransform: "uppercase",
    color: C.forest,
  },
  heading1: { fontFamily: "'Newsreader', 'Iowan Old Style', Georgia, serif", fontWeight: 400, fontSize: 42, lineHeight: "48px", letterSpacing: "-0.02em", color: C.ink },
  metaLabel: {
    fontFamily: SANS,
    fontWeight: 600,
    fontSize: 12,
    lineHeight: "16px",
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    color: "rgba(0,0,0,0.42)",
  },
  storyMetaLabel: {
    fontFamily: SANS,
    fontWeight: 500,
    fontSize: 18,
    lineHeight: "16px",
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    color: "rgba(0,0,0,0.42)",
  },
  metaValue: { fontFamily: SANS, fontWeight: 400, fontSize: 16, lineHeight: "22px", color: C.ink },
  muted: { fontFamily: SANS, fontWeight: 400, fontSize: 13, lineHeight: "18px", color: "rgba(0,0,0,0.45)" },
  heading2: {
    fontFamily: SANS,
    fontWeight: 400,
    fontSize: 24,
    lineHeight: "34px",
    letterSpacing: "0.26px",
    color: C.ink,
  },
  body: { fontFamily: SANS, fontWeight: 400, fontSize: 18, lineHeight: "32px", color: C.ink },
  bodyTight: { fontFamily: SANS, fontWeight: 400, fontSize: 18, lineHeight: "24px", color: C.ink },
  intro: { fontFamily: SANS, fontWeight: 400, fontSize: 18, lineHeight: "28px", color: C.ink },
  label: { fontFamily: SANS, fontWeight: 700, fontSize: 18, lineHeight: "20px", color: C.ink },
  factLabel: { fontFamily: SANS, fontWeight: 700, fontSize: 18, lineHeight: "16px", color: C.forest },
  quote: { fontFamily: SANS, fontWeight: 400, fontSize: 24, lineHeight: "38px", color: C.ink },
  small: { fontFamily: NAV, fontWeight: 400, fontSize: 14, lineHeight: "20px", color: C.ink },
  mark: { fontFamily: MONO, fontWeight: 700, fontSize: 20, lineHeight: "30px", color: C.ink },
  painIndex: {
    fontFamily: MONO,
    fontWeight: 700,
    fontSize: 26,
    lineHeight: "34px",
    letterSpacing: "0.26px",
    color: C.forest,
  },
  painTitle: {
    fontFamily: SANS,
    fontWeight: 400,
    fontSize: 24,
    lineHeight: "34px",
    letterSpacing: "0.26px",
    color: C.ink,
  },
  cardTitle: { fontFamily: SANS, fontWeight: 500, fontSize: 18, lineHeight: "32px", color: C.ink },
} satisfies Record<string, CSSProperties>;

const P = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <p className="m-0" style={{ ...T.body, ...style }}>
    {revealText(children)}
  </p>
);
const B = ({ children }: { children: ReactNode }) => <strong style={{ fontWeight: 700 }}>{children}</strong>;
const H1 = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <h2 className="m-0" style={{ ...T.heading1, ...style }}>
    {revealText(children)}
  </h2>
);
const H2 = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <h3 className="m-0" style={{ ...T.heading2, ...style }}>
    {revealText(children)}
  </h3>
);

function Tag({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span
      className="whitespace-nowrap"
      style={{
        background: C.cream,
        color,
        fontFamily: SANS,
        fontWeight: 400,
        fontSize: 16,
        lineHeight: "18px",
        padding: "4px 12px",
        borderRadius: 999,
      }}
    >
      {typeof children === "string" ? <TypeIn text={children} /> : children}
    </span>
  );
}

function Mark({ n, style }: { n: number; style?: CSSProperties }) {
  return <span style={{ ...T.mark, ...style }}>[{n}]</span>;
}

function SceneCopy({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-[20px]">{children}</div>;
}

function SceneStep({ n, active, children }: { n: number; active: boolean; children: ReactNode }) {
  return (
    <div
      className="flex flex-col gap-[8px]"
      style={{ color: active ? C.ink : STEP_DIM, transition: "color 280ms ease" }}
    >
      <Mark n={n} style={{ color: "inherit" }} />
      {children}
    </div>
  );
}

function ProblemLikeScene({
  left,
  count,
  renderStep,
}: {
  left: ReactNode;
  count: number;
  renderStep: (index: number, active: boolean) => ReactNode;
}) {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full" style={{ maxWidth: SCENE_MAX }}>
        <StepScrollScene gap={20} endOffset={11} left={left} count={count} renderStep={renderStep} />
      </div>
    </div>
  );
}

function MetaCell({
  label,
  children,
  labelStyle,
  gap = 6,
}: {
  label: string;
  children: ReactNode;
  labelStyle?: CSSProperties;
  gap?: number;
}) {
  return (
    <div className="flex flex-col min-w-0" style={{ gap }}>
      <p className="m-0" style={labelStyle ?? T.metaLabel}>
        <TypeIn text={label} />
      </p>
      {children}
    </div>
  );
}

function HighlightedQuote({ quote, highlight }: { quote: string; highlight: string }) {
  const at = quote.indexOf(highlight);
  if (at === -1) return <>{quote}</>;
  return (
    <>
      {quote.slice(0, at)}
      <mark
        style={{
          background: C.forest,
          color: "#ffffff",
          fontWeight: 700,
          borderRadius: 2,
          padding: "1px 3px",
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
        }}
      >
        {highlight}
      </mark>
      {quote.slice(at + highlight.length)}
    </>
  );
}

/** Interview excerpts for the hovered pain point. Copy stays on the existing excerpts. */
function EvidencePanel({ painPoint }: { painPoint: PainPoint }) {
  return (
    <div
      id="pain-point-evidence"
      role="region"
      aria-live="polite"
      aria-label={`Interview excerpts for: ${painPoint.title}`}
      className="relative w-full overflow-hidden"
      style={{ borderRadius: 15, height: 624 }}
    >
      {/* Figma "Evidence Panel": photo, then a #1f3d2b @ 60% layer with a background blur of 50 (CSS 25). */}
      <div
        aria-hidden
        className="absolute"
        style={{
          left: 0,
          top: -168,
          width: 1280,
          height: 1095,
          backgroundImage: `url(${evidenceBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "rgba(31,61,43,0.6)" }}
      />

      <div className="absolute inset-0 flex flex-col" style={{ padding: 20, overflowY: "auto" }}>
        <motion.div
          key={painPoint.title}
          className="flex flex-col flex-1"
          initial="hidden"
          animate="shown"
          variants={{ shown: { transition: { staggerChildren: 0.07 } } }}
        >
          <motion.div
            className="flex items-baseline justify-between"
            variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
          >
            <p className="m-0" style={{ ...T.eyebrow, color: "rgba(255,255,255,0.9)" }}>
              Where this came from
            </p>
            <span style={{ fontFamily: SANS, fontWeight: 400, fontSize: 12, lineHeight: "20px", color: "rgba(255,255,255,0.9)" }}>
              {painPoint.excerpts.length} interview excerpts
            </span>
          </motion.div>

          <div className="flex flex-col" style={{ gap: 20, margin: "auto 0" }}>
            {painPoint.excerpts.map((ex) => (
              <motion.figure
                key={ex.quote}
                className="m-0 flex flex-col"
                style={{
                  background: "#ffffff",
                  borderRadius: 10,
                  padding: 10,
                  gap: 8,
                  boxShadow: "0 2px 7px rgba(0,0,0,0.18)",
                }}
                variants={{ hidden: { opacity: 0, y: 8 }, shown: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <blockquote
                  className="m-0"
                  style={{ fontFamily: SANS, fontWeight: 400, fontSize: 18, lineHeight: "25px", color: C.ink }}
                >
                  “<HighlightedQuote quote={ex.quote} highlight={ex.highlight} />”
                </blockquote>
                <figcaption
                  style={{
                    fontFamily: SANS,
                    fontWeight: 600,
                    fontSize: 11,
                    lineHeight: "16px",
                    letterSpacing: "1.1px",
                    textTransform: "uppercase",
                    color: C.ink,
                  }}
                >
                  Marcus Interview {ex.interview}
                  {ex.time ? ` · ${ex.time}` : ""}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const STEP_DIM = "rgba(0,0,0,0.25)";
const SCENE_MAX = 1167;

const PROBLEM_STEPS = [
  "Edits arrive through email, Slack, the editing software and in-person conversations, so he has to piece them together.",
  "Policy review depends on memory and keyword searches across several databases.",
  "Nothing shows who is busy, so urgent reports land on him mid-task.",
  "The system does not check anyone’s work, so junior mistakes reach him to clean up.",
];

const DAY_STEPS: ReactNode[][] = [
  [
    <>
      <B>Two reports at once.</B> An operations report for the Navy and a strategic assessment on military movements arrive
      together with competing deadlines.
    </>,
    <>
      <B>He ends up an hour late.</B>
    </>,
  ],
  [
    <>
      <B>An urgent drop-in.</B> Aisha sends an emerging chemical weapons activity report due at 12:00pm, and he must drop his
      morning queue.
    </>,
    <>
      He <B>spots a paragraph</B> that could <B>reveal collection methods</B>, and consults Aisha and Raymond to reword it safely.
    </>,
  ],
];

const TURNING_STEPS = [
  {
    quote: "“How do we know the AI is right?”",
    body: "One reviewer’s biggest concern was grounding. Every recommendation needs a quick path back to actual policy, with the reason shown, not just “AI recommends this.”",
  },
  {
    quote: "“Can you take steps out, rather than adding more?”",
    body: "Another reviewer pointed out that Marcus’s task flow was already heavy, and that a prioritization overview or checklist reduces load under pressure.",
  },
];

const TAG_COLORS = [C.ink, C.forest];

/* Story first, then research. `focus` lists the Focus indexes each segment covers. */
const PROGRESS_SECTIONS: { label: string; short: string; group: "story" | "research"; focus: number[] }[] = [
  { label: "Intro", short: "Intro", group: "story", focus: [0] },
  { label: "The problem", short: "Problem", group: "story", focus: [1, 2] },
  { label: "What we made", short: "Made", group: "story", focus: [3, 4] },
  { label: "Outcomes", short: "Outcomes", group: "story", focus: [5, 6] },
  { label: "Journey", short: "Journey", group: "research", focus: [7, 8, 9, 10] },
  { label: "Pain points", short: "Pains", group: "research", focus: [11] },
  { label: "Concepts", short: "Concepts", group: "research", focus: [12, 13, 14] },
  { label: "Decisions", short: "Decisions", group: "research", focus: [15, 16] },
];

function PrismProgressBar() {
  const { focused, focusOn } = useContext(FocusCtx);
  const active = Math.max(0, PROGRESS_SECTIONS.findIndex((s) => s.focus.includes(focused)));

  const jumpTo = (i: number) => {
    const target = PROGRESS_SECTIONS[i].focus[0];
    const el = document.querySelector<HTMLElement>(`[data-focus-section="${target}"]`);
    if (!el) return;
    focusOn(target);
    const chrome = NAV_H + PROGRESS_BAR_HEIGHT;
    const visible = window.innerHeight - chrome;
    const r = el.getBoundingClientRect();
    const offset = r.height < visible ? chrome + (visible - r.height) / 2 : chrome + 24;
    window.scrollTo({ top: Math.max(0, window.scrollY + r.top - offset), behavior: "smooth" });
  };

  return (
    <SectionProgressBar
      items={PROGRESS_SECTIONS.map((s) => ({ label: s.label, short: s.short, group: s.group }))}
      activeIndex={active}
      onSelect={jumpTo}
      offsetTop={NAV_H}
    />
  );
}


export function PrismCaseStudy() {
  const navigate = useNavigate();
  const tags = PROJECTS.find((p) => p.slug === "prism")?.tags ?? [];
  const [activePain, setActivePain] = useState(0);
  const painListRef = useRef<HTMLDivElement>(null);
  const painItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [painBar, setPainBar] = useState<{ top: number; height: number } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const list = painListRef.current;
      const el = painItemRefs.current[activePain];
      if (!el || !list) return;
      const listBox = list.getBoundingClientRect();
      const elBox = el.getBoundingClientRect();
      const next = { top: elBox.top - listBox.top + 4, height: elBox.height - 8 };
      setPainBar((prev) => (prev && prev.top === next.top && prev.height === next.height ? prev : next));
    };
    measure();
    const list = painListRef.current;
    if (!list) return;
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [activePain]);

  const navLink: CSSProperties = {
    fontFamily: NAV,
    fontWeight: 500,
    fontSize: 13,
    lineHeight: "24px",
    letterSpacing: "1.04px",
    color: C.ink,
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: SANS, color: C.ink, background: "#FFFFFF" }}>
      <EdgeGlyphs />
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{
          height: NAV_H,
          paddingLeft: 71,
          paddingRight: 80,
          paddingBottom: 1,
          background: "rgba(255,255,255,0.92)",
          borderBottom: "1px solid rgba(42,32,24,0.1)",
        }}
      >
        <button
          aria-label="Back to portfolio"
          onClick={() => navigate("/")}
          className="shrink-0 border-none cursor-pointer p-0"
          style={{ width: 44, height: 44, background: `url("${logoMark}") center / cover no-repeat`, borderRadius: 4 }}
        />
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-[8px] bg-transparent border-none cursor-pointer p-0 hover:opacity-60 transition-opacity"
          style={navLink}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          BACK TO PORTFOLIO
        </button>
      </nav>

      <SectionFocusProvider>
      <motion.main
        className="mx-auto w-full flex flex-col"
        style={{
          maxWidth: 1440,
          padding: `${NAV_H + PROGRESS_BAR_HEIGHT + 128}px 80px 40vh`,
          boxSizing: "border-box",
          gap: 200,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="flex flex-col w-full" style={{ gap: 200 }}>
        {/* ── Header + overview (one story beat, so the hero stays sharp) ── */}
        <Focus as="header" index={0} className="flex flex-col gap-[40px] items-start w-full">
          <CaseHero bg={heropBg} shot={heropShot} shotAlt="Prism workspace for intelligence editors" glyph="#ffd7a6" bgRotate={0}>
            <h1
              className="m-0"
              style={{
                fontFamily: "'Newsreader', 'Iowan Old Style', Georgia, serif",
                fontWeight: 700,
                fontSize: 64,
                lineHeight: "66px",
                letterSpacing: "-0.02em",
                color: "#fff",
                maxWidth: 720,
              }}
            >
              <TypeIn text="Prism" />
            </h1>
            <p className="m-0" style={{ fontFamily: "'Newsreader', 'Iowan Old Style', Georgia, serif", fontSize: 24, lineHeight: "30px", color: "#fff", maxWidth: 720 }}>
              <TypeIn text="formerly" /> <em style={{ fontStyle: "italic" }}><TypeIn text="Infinite Canvas" /></em>
            </p>
            <p className="m-0" style={{ fontFamily: SANS, fontSize: 18, lineHeight: "32px", color: "#fff", maxWidth: 720 }}>
              <TypeIn text="An AI workspace for intelligence editors" />
            </p>
            <div className="flex gap-[8px] items-start flex-wrap">
              {tags.map((tag, i) => (
<HeroPill key={tag}>{tag}</HeroPill>
))}
            </div>
                    </CaseHero>

          <div className="grid w-full items-start max-lg:grid-cols-1" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 20 }}>
            <div className="flex flex-col gap-[20px] min-w-0">
              <p className="m-0" style={{ fontFamily: SANS, fontWeight: 500, fontSize: 28, lineHeight: "36px", color: C.ink }}>
                <TypeIn text="One report has to reach several audiences. None of them can see what they shouldn’t." />
              </p>
              <p className="m-0" style={T.intro}>
                <TypeIn text="Prism is the workspace we designed for intelligence analytic editors for Laboratory of Analytical Sciences, so they can rewrite the same intelligence across 5 clearance levels without losing the source, the policy, or the deadline." />
              </p>
            </div>

            <div className="halo-soft flex flex-col gap-[20px] min-w-0">
              <div className="grid w-full items-start" style={{ gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 20 }}>
                <MetaCell label="Client" labelStyle={T.storyMetaLabel} gap={10}>
                  <p className="m-0" style={T.metaValue}>
                    <TypeIn text="Laboratory for Analytic Sciences" />
                  </p>
                  <p className="m-0" style={T.muted}>
                    <TypeIn text="A research wing of NSA" />
                  </p>
                </MetaCell>
                <MetaCell label="Duration" labelStyle={T.storyMetaLabel} gap={10}>
                  <p className="m-0" style={T.metaValue}>
                    <TypeIn text="Spring 2026" />
                  </p>
                  <p className="m-0" style={T.muted}>
                    <TypeIn text="Feb–Mar" />
                  </p>
                </MetaCell>
                <MetaCell label="Team" labelStyle={T.storyMetaLabel} gap={10}>
                  <p className="m-0" style={T.metaValue}>
                    <TypeIn text="Diya Franklin, Colton Hendrix, and me" />
                  </p>
                </MetaCell>
              </div>

              <div className="grid w-full items-start" style={{ gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 20 }}>
                <MetaCell label="Role" labelStyle={T.storyMetaLabel} gap={10}>
                  <div className="flex gap-[8px] items-start flex-wrap">
                    {["Infinity canvas", "UI", "Prototyping", "Research"].map((role, i) => (
                      <Tag key={role} color={TAG_COLORS[i % TAG_COLORS.length]}>
                        {role}
                      </Tag>
                    ))}
                  </div>
                </MetaCell>
                <MetaCell label="User" labelStyle={T.storyMetaLabel} gap={10}>
                  <p className="m-0" style={T.metaValue}>
                    <TypeIn text="Marcus, analytic editor" />
                  </p>
                </MetaCell>
              </div>
            </div>
          </div>
        </Focus>

        {/* ── The problem ── */}
        <Focus as="section" index={1} className="w-full">
          <ProblemLikeScene
            left={
              <SceneCopy>
                <H1>A slow edit can still leak a source</H1>
                <p className="m-0" style={{ ...T.body, lineHeight: "28px" }}>
                  <LensDrift text="Our provided persona ‘Marcus’ is the last person who sees a report before it leaves." />
                </p>
                <p className="m-0" style={{ ...T.body, lineHeight: "28px" }}>
                  <LensDrift text="He has to confirm accuracy, sourcing, confidence language and policy before a report moves on." />
                </p>
                <p className="m-0" style={{ ...T.body, lineHeight: "28px" }}>
                  <LensDrift text="His tools do not keep up." />
                </p>
              </SceneCopy>
            }
            count={PROBLEM_STEPS.length}
            renderStep={(i, active) => (
              <SceneStep n={i + 1} active={active}>
                <P style={{ fontWeight: active ? 700 : 400, color: "inherit", lineHeight: "28px" }}>{PROBLEM_STEPS[i]}</P>
              </SceneStep>
            )}
          />
        </Focus>

        <Focus index={2} className="w-full">
          <MeetMarcusStrip />
        </Focus>

        {/* ── Ideas we developed ── */}
        <Focus index={3} className="flex flex-col items-center w-full text-center" style={{ gap: 20 }}>
          <H1>Ideas we developed</H1>
          <p className="m-0" style={{ fontFamily: SANS, fontSize: 18, lineHeight: "28px", color: C.ink, maxWidth: 720 }}>
            <B>
              <LensDrift text="An infinity canvas tool" />
            </B>
            <br />
            <LensDrift text="View sources, the report, and its tiers in one view." />
          </p>
          <IdeasDevelopedCards />
        </Focus>

        {/* ── How the canvas works ── */}
        <Focus index={4} className="flex flex-col items-center w-full" style={{ gap: 20 }}>
          <div className="flex flex-col items-center text-center" style={{ gap: 20 }}>
            <H1 style={{ lineHeight: "34px" }}>How the canvas works</H1>
            <p className="m-0" style={{ ...T.body, lineHeight: "28px", maxWidth: 570 }}>
              <LensDrift text="Workflow sorting, alerts when a change hits another tier, multi-tier analysis, and a mind map of sources, policies, and annotations." />
            </p>
          </div>
          <FinalConceptGallery />
        </Focus>

        {/* ── Outcomes ── */}
        <Focus as="section" index={5} className="flex flex-col items-center w-full" style={{ gap: 40 }}>
          <div className="flex flex-col items-center text-center" style={{ gap: 20, maxWidth: 572 }}>
            <H1>See it in use</H1>
            <P>Walkthroughs of the revised interface after the final critique.</P>
          </div>
          <OutcomeVideoCards />
        </Focus>

        {/* ── What I learned ── */}
        <Focus as="section" index={6} className="flex flex-col items-center w-full text-center" style={{ gap: 20 }}>
          <H1>What I learned</H1>
          <P style={{ lineHeight: "28px", maxWidth: 570 }}>
            Make the better choice the easier one. The job was not more AI. It was keeping source, policy, and edit in one place so
            Marcus did not have to hunt.
          </P>
          <P style={{ lineHeight: "28px", maxWidth: 570 }}>The person still decides. The AI points; Marcus signs off.</P>
        </Focus>
        </div>

        {/* ── Research divider ── */}
        <Focus as="section" index={7} className="flex flex-col items-center w-full text-center" style={{ gap: 20 }}>
          <p className="m-0" style={T.eyebrow}>
            <LensDrift text="Optional reading" />
          </p>
          <H1>The research behind this</H1>
          <P style={{ lineHeight: "28px", maxWidth: 570 }}>
            The days we mapped, the pains we chose, the critiques that changed the work, and the calls that were mine.
          </P>
        </Focus>

        {/* ── What we learned ── */}
        <section className="flex flex-col w-full" style={{ gap: 200 }}>
          <Focus index={8} className="flex flex-col items-center w-full text-center" style={{ gap: 40 }}>
            <H1>Here’s a little more about Marcus</H1>
            <div className="w-full text-left">
              <MarcusPersonaCard />
            </div>
          </Focus>

          <Focus index={9} className="w-full">
            <ProblemLikeScene
              left={
                <SceneCopy>
                  <H1>Two days under deadline</H1>
                  <p className="m-0" style={{ ...T.body, lineHeight: "28px" }}>
                    <LensDrift text="We combined LAS research, secondary research, benchmarks of AI document tools, and interviews. Then we mapped two of Marcus’s days." />
                  </p>
                </SceneCopy>
              }
              count={DAY_STEPS.length}
              renderStep={(i, active) => (
                <SceneStep n={i + 1} active={active}>
                  <div className="flex flex-col gap-[20px]">
                    {DAY_STEPS[i].map((para, p) => (
                      <P key={p} style={{ fontWeight: active ? 700 : 400, color: "inherit", lineHeight: "28px" }}>
                        {para}
                      </P>
                    ))}
                  </div>
                </SceneStep>
              )}
            />
          </Focus>

          <Focus index={10} className="w-full">
            <JourneyScrollScene
              mapAlt="User journey map for Marcus, Analytic Editor, reviewing high-stakes reports under deadline"
              heading={
                <>
                  <H1>Where the stress hits</H1>
                  <p className="m-0" style={{ ...T.body, lineHeight: "34px", letterSpacing: "0.26px" }}>
                    <LensDrift text="The journey map plots his day from stressed to relieved, and pins each pain point to the moment it happens." />
                  </p>
                </>
              }
            />
          </Focus>

          <Focus index={11} className="flex flex-col gap-[20px] w-full">
            <H1>Five pains we designed against</H1>
            <p className="m-0" style={{ ...T.muted, fontSize: 16, lineHeight: "24px" }}>Hover over each item to see excerpts from the interviews for that area.</p>
            <div className="grid grid-cols-[minmax(0,630fr)_minmax(0,650fr)] gap-x-[40px] w-full items-start" style={{ marginTop: 0 }}>
              <EvidencePanel painPoint={PAIN_POINTS[activePain]} />
              <div ref={painListRef} className="relative flex flex-col gap-[24px]" style={{ paddingLeft: 20, paddingTop: 0 }}>
                {painBar && (
                  <motion.div
                    aria-hidden
                    className="absolute"
                    style={{ left: 0, width: 6, borderRadius: 10, background: C.bar, pointerEvents: "none" }}
                    initial={false}
                    animate={{ top: painBar.top, height: painBar.height }}
                    transition={{ type: "spring", stiffness: 420, damping: 38 }}
                  />
                )}
                {PAIN_POINTS.map((pp, i) => {
                  const active = i === activePain;
                  const select = () => setActivePain(i);
                  return (
                    <div
                      key={pp.title}
                      ref={(el) => {
                        painItemRefs.current[i] = el;
                      }}
                      role="button"
                      tabIndex={0}
                      aria-controls="pain-point-evidence"
                      aria-pressed={active}
                      onMouseEnter={select}
                      onFocus={select}
                      onClick={select}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          select();
                        }
                      }}
                      className="flex flex-col gap-[10px] cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                      style={{
                        opacity: active ? 1 : 0.45,
                        transform: active ? "translateX(6px)" : "none",
                        transition: "opacity 200ms ease, transform 200ms ease",
                        outlineColor: C.forest,
                      }}
                    >
                      <div className="flex gap-[20px] items-start">
                        <span style={T.painIndex}>[{i + 1}]</span>
                        <span style={{ ...T.painTitle, fontWeight: active ? 700 : 400 }}>{pp.title}</span>
                      </div>
                      <P>{pp.desc}</P>
                    </div>
                  );
                })}
              </div>
            </div>
          </Focus>
        </section>

        {/* ── The turning point ── */}
        <Focus as="section" index={12} className="w-full">
          <ProblemLikeScene
            left={
              <SceneCopy>
                <H1>Stop adding steps. Keep the trail.</H1>
                <p className="m-0" style={{ ...T.body, lineHeight: "28px" }}>
                  <LensDrift text="Critique pushed us off “more AI around the workflow.” The job became one place where sources, policies, and edits stay together and stay traceable across tiers." />
                </p>
              </SceneCopy>
            }
            count={TURNING_STEPS.length}
            renderStep={(i, active) => (
              <SceneStep n={i + 1} active={active}>
                <P style={{ fontWeight: active ? 700 : 400, color: "inherit", lineHeight: "28px" }}>{TURNING_STEPS[i].quote}</P>
                <P style={{ fontWeight: active ? 700 : 400, color: "inherit", lineHeight: "28px" }}>{TURNING_STEPS[i].body}</P>
              </SceneStep>
            )}
          />
        </Focus>

        {/* ── Concepts ── */}
        <section className="flex flex-col gap-[56px] w-full">
          <Focus index={13} className="flex flex-col gap-[24px] w-full">
          <div className="flex flex-col gap-[8px]">
            <H1>How the concepts split the problem</H1>
            <H2>Critique 1</H2>
            <p className="m-0" style={T.bodyTight}>
              <LensDrift text="Three concepts, each aimed at a different pain:" />
            </p>
          </div>
          <div className="flex flex-col gap-[20px] items-start w-full">
            <div className="grid grid-cols-[305px_1fr] gap-[20px] w-full items-start">
              <div className="flex flex-col gap-[26px]" style={{ padding: "20px 0" }}>
                <div className="relative">
                  {/* Green stroke to the left of the active concept (Figma 816:3474: 6px wide, radius 10, #133e2b). */}
                  <span
                    aria-hidden
                    className="absolute"
                    style={{ left: -14, top: 10, bottom: 4, width: 6, borderRadius: 10, background: C.bar }}
                  />
                  <P>
                    <B>AI Suggestions for Collaboration and Adherence (mine):</B> an AI overview of policies &amp; sources missing
                    from the report, with auto-suggestions, prompts on selected text, and a comment panel.
                  </P>
                </div>
                <P style={{ opacity: 0.6 }}>
                  <B>Predictive Tier Review (Diya):</B> an early warning for sections likely to escalate.
                </P>
                <P style={{ opacity: 0.6 }}>
                  <B>Tier Comparison and Analysis (Colton):</B> side-by-side tiers with a report-level chat.
                </P>
              </div>
              <ConceptCarousel />
            </div>
          </div>
          </Focus>

          <Focus index={14} className="flex flex-col gap-[20px] items-start w-full" style={{ paddingTop: 20 }}>
            <div className="flex flex-col gap-[8px]" style={{ maxWidth: 720 }}>
              <H2>Critique 2</H2>
              <p className="m-0" style={T.bodyTight}>
                <LensDrift text="Two prototypes. I presented the canvas." />
              </p>
            </div>
            <div className="grid grid-cols-3 gap-[32px] w-full items-start">
              {[
                { title: "Canvas", note: "Tiers in space, sources on the left, flags on the right. Document view as backup." },
                { title: "Flag to source", note: "Click a flag and see the sentence, the source, and a suggested fix." },
                { title: "Queue + comments", note: "What’s due, plus comments that aren’t only policy edits." },
              ].map((item) => (
                <div key={item.title} className="flex flex-col gap-[6px] min-w-0">
                  <p className="m-0" style={T.metaLabel}>
                    <LensDrift text={item.title} />
                  </p>
                  <p className="m-0" style={T.metaValue}>
                    <LensDrift text={item.note} />
                  </p>
                </div>
              ))}
            </div>
            <p className="m-0" style={{ ...T.bodyTight, maxWidth: 720 }}>
              <LensDrift text="The other concept was a modular workflow you could run with or without AI." />
            </p>
            <FinalFlowCarousel />
          </Focus>
        </section>

        {/* ── My decisions & trade-offs ── */}
        <Focus as="section" index={15} className="flex flex-col gap-[20px] w-full" style={{ maxWidth: 720 }}>
          <div className="flex flex-col gap-[8px]">
            <H1>The calls that were mine</H1>
            <P>
              I proposed the canvas and made the UI and prototype calls. Journey mapping and research we shared.
            </P>
          </div>
          <P>
            <B>Why the canvas.</B> A document view hides how a sentence connects to its source. The canvas keeps that in front of
            you. We took both to stakeholders; they picked the canvas.
          </P>
          <P>
            The policy engine was too heavy — first thing I cut back after critique. No product metrics: the workflow ran on pen,
            paper, and fax.
          </P>
        </Focus>

        {/* ── Reflections ── */}
        <Focus as="section" index={16} className="flex flex-col gap-[20px] w-full" style={{ maxWidth: 720 }}>
          <div className="flex flex-col gap-[8px]">
            <H1>What critique changed</H1>
            <P>
              They preferred the canvas, with a document view as backup. Line up matching passages across tiers. Resolve a flag on
              one tier or on all of them.
            </P>
          </div>
          <P>
            After that I simplified the policy engine, made source flags more precise, and refreshed the look.
          </P>
        </Focus>

      </motion.main>
      <PrismProgressBar />
      </SectionFocusProvider>
    </div>
  );
}
