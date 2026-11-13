import { SiteFooter } from "../components/SiteFooter";
import { SiteNav } from "../components/SiteNav";
import { useContext, useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { TypeIn } from "../components/TypeIn";
import { CaseHero, HeroPill } from "../components/CaseHero";
import herosBg from "@/assets/craft-poster/s-bg.webp";
import herosShot from "@/assets/craft-poster/s-shot.webp";
import { motion } from "motion/react";
import { Focus, FocusCtx, LensDrift, revealText, SectionFocusProvider } from "../components/SectionReveal";
import { PROJECTS } from "../data/projects";
import { StepScrollScene } from "../components/StepScrollScene";
import { EdgeGlyphs } from "../components/EdgeGlyphs";
import { SectionProgressBar, PROGRESS_BAR_HEIGHT } from "../components/SectionProgressBar";
import { SddLifecycleCompare } from "../components/SddLifecycleCompare";
import { ConceptScrollStory } from "../components/ConceptScrollStory";
import { ScreensGallery } from "../components/ScreensGallery";
import { PainClusters } from "../components/ResearchStory";
import stakeholderMap from "@/assets/research/stakeholder-map.png";
import ecosystemMap from "@/assets/research/ecosystem-map.png";
import journeyMap from "@/assets/research/journey-map.png";
import lifecycle from "@/assets/research/lifecycle.png";
import userFlow from "@/assets/research/user-flow.png";
import { ExpandableImage } from "../components/ExpandableImage";
import { MindMapTour } from "../components/MindMapTour";
import { ProblemDeck } from "../components/ProblemDeck";
import { VersionPreview } from "../components/VersionPreview";
import v1a from "@/assets/versions/v1-1-spec-input.png";
import v1b from "@/assets/versions/v1-2-compiler-result.png";
import v1c from "@/assets/versions/v1-3-review-plan.png";
import v1d from "@/assets/versions/v1-4-assumption-detail.png";
import v1e from "@/assets/versions/v1-7-node-view.png";
import v2a from "@/assets/versions/v2-8-spec-map.png";
import v2b from "@/assets/versions/v2-8b-goals-context.png";
import v2c from "@/assets/versions/v2-8c-edge-cases.png";
import v2d from "@/assets/versions/v2-8d-decisions-assumptions.png";
import v2e from "@/assets/versions/v2-8e-plan-approved.png";


const C = {
  forest: "#1f3d2b",
  prism: "#396f4e",
  ink: "#000000",
  cream: "#fbf6ec",
  sand: "#f3e7d4",
  line: "#e5daca",
  bar: "#133e2b",
};
const MONO = "'Roboto Condensed', 'Roboto', sans-serif";
const SANS = "'Roboto', sans-serif";
const NAV = "'Plus Jakarta Sans', sans-serif";

const NAV_H = 66;
const STEP_DIM = "rgba(0,0,0,0.25)";
const SCENE_MAX = 1167;

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
  intro: { fontFamily: SANS, fontWeight: 400, fontSize: 18, lineHeight: "28px", color: C.ink },
} satisfies Record<string, CSSProperties>;

const MapBlock = ({ title, paragraphs, children }: { title: string; paragraphs: string[]; children: ReactNode }) => (
  <div className="flex flex-col items-center w-full" style={{ gap: 20 }}>
    <div className="flex flex-col items-center" style={{ gap: 12, maxWidth: 570 }}>
      <h3 className="m-0" style={{ fontFamily: "'Newsreader', 'Iowan Old Style', Georgia, serif", fontWeight: 400, fontSize: 34, lineHeight: "40px", letterSpacing: "-0.02em", color: C.ink }}>
        {revealText(title)}
      </h3>
      {paragraphs.map((t) => (
        <P key={t} style={{ lineHeight: "28px" }}>
          {t}
        </P>
      ))}
    </div>
    {children}
  </div>
);

const P = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <p className="m-0" style={{ ...T.body, ...style }}>
    {revealText(children)}
  </p>
);
const B = ({ children }: { children: ReactNode }) => <strong style={{ fontWeight: 700 }}>{children}</strong>;
const SDD_GREEN = "#2d4a36";

function MethodRow({
  label,
  labelWeight = 400,
  inverted,
  children,
}: {
  label: string;
  labelWeight?: 400 | 700;
  inverted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className="flex items-start justify-center max-w-full"
      style={{
        gap: 10,
        flexWrap: "wrap",
        width: inverted ? "100%" : undefined,
        boxSizing: "border-box",
        padding: inverted ? 20 : 0,
        borderRadius: inverted ? 10 : 0,
        background: inverted ? SDD_GREEN : undefined,
      }}
    >
      <span
        className="shrink-0 whitespace-nowrap"
        style={{
          background: inverted ? SDD_GREEN : "rgba(45, 74, 54, 0.6)",
          color: "#fff",
          fontFamily: SANS,
          fontWeight: labelWeight,
          fontSize: 18,
          lineHeight: "28px",
          padding: "6px 10px",
          borderRadius: 10,
        }}
      >
        {label}
      </span>
      <p
        className="m-0 text-left min-w-0"
        style={{
          ...T.body,
          lineHeight: "28px",
          width: 570,
          maxWidth: "100%",
          flex: "1 1 280px",
          color: inverted ? "#fff" : C.ink,
        }}
      >
        {children}
      </p>
    </div>
  );
}

const H1 = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <h2 className="m-0" style={{ ...T.heading1, ...style }}>
    {revealText(children)}
  </h2>
);
const H2 = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <h3 className="m-0" style={{ ...T.heading2, fontWeight: 700, ...style }}>
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

function Chip({ children, bold = false }: { children: ReactNode; bold?: boolean }) {
  return (
    <span
      className="whitespace-nowrap inline-flex flex-col items-center"
      style={{
        background: "#fff",
        color: "#000",
        fontFamily: SANS,
        fontWeight: bold ? 700 : 400,
        fontSize: 16,
        lineHeight: "18px",
        padding: "4px 12px",
        borderRadius: 999,
        filter: "drop-shadow(0px 0px 2.5px rgba(0,0,0,0.1))",
      }}
    >
      {children}
      {/* Invisible bold copy reserves the bold width so chips don't shift when they turn bold */}
      <span aria-hidden style={{ fontWeight: 700, height: 0, overflow: "hidden", visibility: "hidden" }}>
        {children}
      </span>
    </span>
  );
}

// Renders text where **keyword** segments turn bold when `bold` is true, without changing their width.
function KeywordText({ text, bold }: { text: string; bold: boolean }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 === 0 ? (
          <LensDrift key={i} text={part} />
        ) : (
          <span key={i} className="whitespace-nowrap inline-flex flex-col align-top" style={{ fontWeight: bold ? 700 : 400 }}>
            {part}
            <span aria-hidden style={{ fontWeight: 700, height: 0, overflow: "hidden", visibility: "hidden" }}>
              {part}
            </span>
          </span>
        ),
      )}
    </>
  );
}

function Mark({ n, style }: { n: number; style?: CSSProperties }) {
  return (
    <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, lineHeight: "30px", color: C.ink, ...style }}>[{n}]</span>
  );
}

function SceneCopy({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-[20px]">{children}</div>;
}

function SceneStep({ n, active, children }: { n: number; active: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[8px]" style={{ color: active ? C.ink : STEP_DIM, transition: "color 280ms ease" }}>
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

function VisualSlot({ label, minHeight = 360 }: { label: string; minHeight?: number }) {
  return (
    <div
      className="w-full flex items-center justify-center text-center"
      style={{ minHeight, background: C.sand, borderRadius: 15, padding: 24 }}
    >
      <p className="m-0" style={{ ...T.muted, maxWidth: 420 }}>
        {label}
      </p>
    </div>
  );
}

const TAG_COLORS = [C.ink, C.forest];

const FINDING_STEPS = [
  "Generated code hides architectural violations. Engineers inspect it line by line to find them.",
  "Context stays trapped in private chats. Reviewers cannot see the why behind a decision, so reviews turn into skimming.",
  "Short prompts let agents guess. Exhaustive prompts take too long to write, so agents make unauthorized decisions in the gaps.",
];

const VALIDATION_STEPS = [
  "Test 1: two participants on the spec map. What they found hard, and what I changed because of it.",
  "Test 2: three people on the redesign. My professor as a stakeholder, then two classmates, with the results of each task.",
  "What changed the direction. The changes from testing that led to the final screens, shown before and after.",
];

const IDEAS = [
  {
    title: "Context compiler",
    boldAt: 0.41, // handle has passed the Context Compiler box in the flowchart
    chips: ["Gaps", "Context", "Dependencies"],
    body: "It reads the spec against the repo’s **patterns**, **tech stack** and **dependencies**, finds what the spec leaves out, and drafts a suggested line for each **gap**.",
  },
  {
    title: "Assumption gating",
    boldAt: 0.69, // handle has passed Approve Lines and Review Panel in the flowchart
    chips: ["Assumptions", "Approval", "Traceability"],
    body: "It holds the handoff until an engineer **approves** the lines that matter. **Blocking** lines must be **approved**; optional ones travel on, labelled **Still open**.",
  },
];

const VERSION_1 = [
  { src: v1a, label: "1 · Spec input" },
  { src: v1b, label: "2 · Compiler result" },
  { src: v1c, label: "3 · Review plan" },
  { src: v1d, label: "4 · Assumption detail" },
  { src: v1e, label: "7 · Node view" },
];

const VERSION_2 = [
  { src: v2a, label: "8 · Spec map" },
  { src: v2b, label: "8b · Side open · Goals & Context" },
  { src: v2c, label: "8c · Side open · Edge Cases" },
  { src: v2d, label: "8d · Side open · Decisions & Assumptions" },
  { src: v2e, label: "8e · Spec map, plan approved" },
];

const PROGRESS_SECTIONS: { label: string; short: string; group: "story" | "research"; focus: number[] }[] = [
  { label: "Intro", short: "Intro", group: "story", focus: [0] },
  { label: "The problem", short: "Problem", group: "story", focus: [1] },
  { label: "So what's the issue?", short: "Issue", group: "story", focus: [2] },
  { label: "What I found", short: "Found", group: "story", focus: [3] },
  { label: "What I developed", short: "Made", group: "story", focus: [4] },
  { label: "Screens", short: "Screens", group: "story", focus: [5] },
  { label: "Where it stands", short: "Now", group: "story", focus: [6] },
  { label: "Research", short: "Research", group: "research", focus: [7, 8] },
  { label: "Ideas", short: "Ideas", group: "research", focus: [9] },
  { label: "Approach", short: "Approach", group: "research", focus: [10] },
  { label: "Testing", short: "Testing", group: "research", focus: [11, 12] },
];

function ProductSProgressBar({ dark }: { dark: boolean }) {
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
      dark={dark}
    />
  );
}

const HERO_DESC = "SpecTrim catches missing context before an AI agent writes code.";

export function ProductSCaseStudy() {
  const tags = PROJECTS.find((p) => p.slug === "project-s")?.tags ?? [];

  // The concept section dissolves the whole screen to dark and back. The fixed nav and section
  // bar follow, so everything reads as dark mode while the section is the main thing on screen.
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const check = () => {
      const band = document.querySelector<HTMLElement>('[data-focus-section="5"]');
      if (!band) return;
      const r = band.getBoundingClientRect();
      const vh = window.innerHeight;
      // in once the section's top reaches the upper third; out as its end rises, before the next section arrives
      setDark(r.top < vh * 0.3 && r.bottom > vh * 0.8);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);


  return (
    <div className="min-h-screen" style={{ fontFamily: SANS, color: C.ink, background: "#FFFFFF", overflowX: "clip" }}>
      {/* the dark screen: fades in and out behind the content */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{ background: "#0b0c0e", opacity: dark ? 1 : 0, transition: "opacity 500ms ease", zIndex: 0 }}
      />
      <EdgeGlyphs />
      <SiteNav current="work" />

      <SectionFocusProvider>
        <motion.main
          className="case-main mx-auto w-full flex flex-col"
          style={{
            maxWidth: 1440,
            padding: `${NAV_H + PROGRESS_BAR_HEIGHT + 128}px 80px 40vh`,
            boxSizing: "border-box",
            gap: 200,
            position: "relative",
            zIndex: 1,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div className="case-gap flex flex-col w-full" style={{ gap: 200 }}>
            <Focus as="header" index={0} className="flex flex-col gap-[40px] items-start w-full">
              <CaseHero bg={herosBg} shot={herosShot} shotAlt="SpecTrim spec map with the review list" glyph="#c9f2dc" bgRotate={180}>
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
                  <TypeIn text="SpecTrim" />
                </h1>
                <p className="m-0" style={{ fontFamily: SANS, fontSize: 18, lineHeight: "32px", color: "#fff", maxWidth: 720 }}>
                  <TypeIn text={HERO_DESC} />
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
                    <TypeIn text="A map of your spec, and where the AI needs you." />
                  </p>
                  <p className="m-0" style={T.intro}>
                    <TypeIn text="SpecTrim turns a specification into a spec map. It shows what a spec is made of and which parts can go wrong, what the AI has already covered, and the high-stakes areas where it needs your input before an agent builds." />
                  </p>
                </div>

                <div className="halo-soft flex flex-col gap-[20px] min-w-0">
                  <div className="grid w-full items-start" style={{ gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 20 }}>
                    <MetaCell label="Role" labelStyle={T.storyMetaLabel} gap={10}>
                      <p className="m-0" style={T.metaValue}>
                        <TypeIn text="Sole designer" />
                      </p>
                      <p className="m-0" style={T.muted}>
                        <TypeIn text="Research to prototype" />
                      </p>
                    </MetaCell>
                    <MetaCell label="Duration" labelStyle={T.storyMetaLabel} gap={10}>
                      <p className="m-0" style={T.metaValue}>
                        <TypeIn text="Aug 20, 2026 to ongoing" />
                      </p>
                    </MetaCell>
                    <MetaCell label="Course" labelStyle={T.storyMetaLabel} gap={10}>
                      <p className="m-0" style={T.metaValue}>
                        <TypeIn text="NC State GD 503" />
                      </p>
                      <p className="m-0" style={T.muted}>
                        <TypeIn text="Brief provided by IBM" />
                      </p>
                    </MetaCell>
                  </div>
                  <MetaCell label="Tools" labelStyle={T.storyMetaLabel} gap={10}>
                    <div className="flex gap-[8px] items-start flex-wrap">
                      {["Claude", "Cursor", "Figma"].map((tool, i) => (
                        <Tag key={tool} color={TAG_COLORS[i % TAG_COLORS.length]}>
                          {tool}
                        </Tag>
                      ))}
                    </div>
                  </MetaCell>
                </div>
              </div>
            </Focus>

            <Focus as="section" index={1} className="flex flex-col items-center w-full" style={{ gap: 40 }}>
              <div className="flex flex-col items-center w-full text-center" style={{ gap: 10 }}>
                <H1>What is specification-driven development AKA SDD?</H1>
                <H2>The spec is the source of truth, and the AI builds from it.</H2>
              </div>
              <div
                className="flex flex-col items-center w-full"
                style={{
                  maxWidth: 912,
                  gap: 20,
                  padding: "20px 0",
                  background: "#fff",
                  borderRadius: 10,
                  boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                <MethodRow label="specification-driven development" labelWeight={700} inverted>
                  you <B>write down what</B> the <B>software should do</B>, <B>how it should work</B> and{" "}
                  <B>what the tasks are</B>, and an <B>AI agent builds</B> from that.
                </MethodRow>
                <MethodRow label="Traditional Development">
                  relies on <B>engineers filling the gaps</B> with <B>judgment</B> and <B>conversation</B>.
                </MethodRow>
                <MethodRow label="Vibe Coding">
                  <B>leaves the intent</B> in a chat, where the <B>AI’s assumptions stay invisible</B>.
                </MethodRow>
              </div>
            </Focus>

            <Focus as="section" index={2} className="flex flex-col items-center w-full text-center" style={{ gap: 20 }}>
              <H1>So what’s the issue?</H1>
              <div className="flex flex-col items-center w-full" style={{ gap: 12, maxWidth: 800 }}>
                <P style={{ fontSize: 24, lineHeight: "34px" }}>
                  <B>SDD only works if the spec is complete, but specs rarely are</B>
                </P>
                <P style={{ fontSize: 24, lineHeight: "34px" }}>
                  AI agents fill the gaps with assumptions nobody sees, and IBM asked us to find a way to make SDD an
                  effective method for coding.
                </P>
              </div>
            </Focus>

            <Focus as="section" index={3} className="w-full">
              <ProblemLikeScene
                left={
                  <SceneCopy>
                    <H1>
                      <LensDrift text="What I found" />
                    </H1>
                    <p className="m-0" style={{ ...T.body, lineHeight: "28px" }}>
                      <LensDrift text="Missing context, detected before code is generated." />
                    </p>
                    <p className="m-0" style={{ ...T.body, lineHeight: "28px" }}>
                      <LensDrift text="These problems matter most to senior software engineers, so they are who I designed for. Interviews pointed to three." />
                    </p>
                  </SceneCopy>
                }
                count={FINDING_STEPS.length}
                renderStep={(i, active) => (
                  <SceneStep n={i + 1} active={active}>
                    <P style={{ fontWeight: active ? 700 : 400, color: "inherit", lineHeight: "28px" }}>
                      <LensDrift text={FINDING_STEPS[i]} />
                    </P>
                  </SceneStep>
                )}
              />
            </Focus>

            <Focus index={4} className="w-full">
              <SddLifecycleCompare>
                {(t: number) => (
                <>
                <H1>What I developed</H1>
                <div className="grid w-full text-left max-md:grid-cols-1" style={{ gridTemplateColumns: "1fr 1fr", gap: 40 }}>
                  {IDEAS.map((idea) => (
                    <div key={idea.title} className="flex flex-col items-start" style={{ gap: 12 }}>
                      <p className="m-0" style={{ fontFamily: SANS, fontWeight: 500, fontSize: 18, lineHeight: "24px", color: C.ink }}>
                        <LensDrift text={idea.title} />
                      </p>
                      <div className="flex gap-[8px] items-start flex-wrap">
                        {idea.chips.map((chip) => (
                          <Chip key={chip} bold={t >= idea.boldAt}>
                            {chip}
                          </Chip>
                        ))}
                      </div>
                      <p className="m-0" style={{ ...T.intro, lineHeight: "26px" }}>
                        <KeywordText text={idea.body} bold={t >= idea.boldAt} />
                      </p>
                    </div>
                  ))}
                </div>
                </>
                )}
              </SddLifecycleCompare>
            </Focus>

            {/* the concept story: the screen dissolves to dark for it, then back */}
            <Focus
              index={5}
              className="flex flex-col items-center text-center"
              style={{ gap: 40, padding: "100px 0" }}
            >
              <div
                className="flex flex-col items-center w-full"
                style={{
                  gap: 40,
                  maxWidth: 1120,
                  opacity: dark ? 1 : 0,
                  transition: "opacity 500ms ease",
                }}
              >
                <H1 style={{ color: "#fff" }}>Developing high fidelity concept</H1>
                <ConceptScrollStory />
                <div className="w-full" style={{ marginTop: 100 }}>
                  <ScreensGallery />
                </div>
              </div>
            </Focus>

            <Focus as="section" index={6} className="flex flex-col items-center w-full text-center" style={{ gap: 20 }}>
              <H1>Where it stands</H1>
              <P style={{ lineHeight: "28px", maxWidth: 570 }}>
                This is an ongoing project. My user testing is not finished, and I present it to the stakeholders at IBM at the
                IBM/NC State symposium on November 23.
              </P>
            </Focus>
          </div>

          <Focus as="section" index={7} className="flex flex-col items-center w-full text-center" style={{ gap: 20 }}>
            <p className="m-0" style={T.eyebrow}>
              <LensDrift text="Optional reading" />
            </p>
            <H1>How I got from the brief to these screens</H1>
            <P style={{ lineHeight: "28px", maxWidth: 570 }}>The research, the maps, the flows, and the tests so far.</P>
          </Focus>

          <section className="case-gap flex flex-col w-full" style={{ gap: 200 }}>
            <Focus index={8} className="flex flex-col items-center w-full text-center" style={{ gap: 40 }}>
              <div className="flex flex-col items-center" style={{ gap: 20, maxWidth: 570 }}>
                <H1>Research</H1>
                <H2>Six interviews, four clusters of pain.</H2>
                <P style={{ lineHeight: "28px" }}>
                  I had never heard of SDD, so I started with its lifecycle, then interviewed 6 engineers, from a junior engineer
                  to a director. I cited 30 excerpts from those interviews and sorted them into four clusters of pain. Two of the
                  clusters are what I built my ideas on.
                </P>
              </div>
              <PainClusters />

              <div className="flex flex-col items-center" style={{ gap: 20, maxWidth: 570 }}>
                <H2>What it all came down to.</H2>
                <P style={{ lineHeight: "28px" }}>
                  Engineers need a way to ground AI tools in their team’s rules and context, and to check generated code against
                  their architecture.
                </P>
                <P style={{ lineHeight: "28px" }}>
                  Today, short prompts let agents guess in the gaps, and context trapped in private chats leaves reviewers
                  skimming.
                </P>
              </div>

              <div className="flex flex-col items-center w-full" style={{ gap: 20 }}>
                <MindMapTour caption="The research mind map, with the counter-evidence cards at the bottom." />
              </div>
            </Focus>

            <Focus index={9} className="flex flex-col items-center w-full text-center" style={{ gap: 40 }}>
              <H1>From problem to ideas</H1>
              <ProblemDeck />

              <MapBlock
                title="Stakeholder map"
                paragraphs={[
                  "Showed why I focused on senior engineers: they run spec development, while principals hand it down and juniors don’t call the shots.",
                ]}
              >
                <ExpandableImage src={stakeholderMap} alt="Stakeholder map" width={2800} height={2030} />
              </MapBlock>
              <div className="grid w-full max-md:grid-cols-1" style={{ gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
                <MapBlock
                  title="Ecosystem map"
                  paragraphs={[
                    "Showed the tools, people, processes and props around each stage of specification-driven development, and where my idea sits in that lifecycle.",
                  ]}
                >
                  <ExpandableImage src={ecosystemMap} alt="Ecosystem map" width={2800} height={2800} />
                </MapBlock>
                <MapBlock
                  title="User journey"
                  paragraphs={[
                    "Mapped the actions, needs, pain points and gain points of a senior software engineer’s workflow.",
                  ]}
                >
                  <ExpandableImage src={journeyMap} alt="User journey map: The Conductor" width={2857} height={3200} />
                </MapBlock>
              </div>
              <P style={{ lineHeight: "28px", maxWidth: 570 }}>
                Together, these maps, built on primary and secondary data, gave my problem statement weight.
              </P>
            </Focus>

            <Focus index={10} className="flex flex-col items-center w-full text-center" style={{ gap: 40 }}>
              <div className="flex flex-col items-center" style={{ gap: 20, maxWidth: 570 }}>
                <H1>Design approach</H1>
                <H2>Fitting the idea into the SDD lifecycle.</H2>
                <P style={{ lineHeight: "28px" }}>
                  I simplified the standard lifecycle, then placed the context compiler and the approval gate inside it.
                </P>
              </div>
              <ExpandableImage
                src={lifecycle}
                alt="SDD lifecycle with the context compiler and the assumption gate"
                width={3600}
                height={671}
                caption="The SDD lifecycle with the compiler and the gate."
              />

              <div className="flex flex-col items-center" style={{ gap: 20, maxWidth: 570 }}>
                <H2>Several user flows, one final.</H2>
                <P style={{ lineHeight: "28px" }}>
                  The last flow is the one the prototype follows, and it moved the gate to sit right after the compiler, before
                  design.
                </P>
              </div>
              <ExpandableImage
                src={userFlow}
                alt="User flow: the prototype as it is now (Review list model, Version 23)"
                width={3700}
                height={2900}
                caption="The final user flow."
              />

              <div className="flex flex-col items-center" style={{ gap: 20, maxWidth: 570 }}>
                <H2>From version 1 to version 2.</H2>
                <P style={{ lineHeight: "28px" }}>
                  The first iteration of the interface showed the process one step at a time. This process was deemed too jarring.
                </P>
                <P style={{ lineHeight: "28px" }}>
                  This led me to creating the spec map. The spec map viewed the whole spec in one place and made visible everything
                  that the spec contained.
                </P>
              </div>
              <div className="grid w-full max-md:grid-cols-1" style={{ gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
                <VersionPreview
                  title="Version 1: the core flow"
                  caption="Version 1: the core flow"
                  screens={VERSION_1}
                  thumbIndex={1}
                />
                <VersionPreview
                  title="Version 2: the spec map"
                  caption="Version 2: the spec map idea"
                  screens={VERSION_2}
                  thumbIndex={0}
                />
              </div>
            </Focus>

            <Focus as="section" index={11} className="w-full">
              <ProblemLikeScene
                left={
                  <SceneCopy>
                    <H1>
                      <LensDrift text="Validating through iteration" />
                    </H1>
                    <p className="m-0" style={{ ...T.body, lineHeight: "28px", fontWeight: 700 }}>
                      <LensDrift text="This section is still being written." />
                    </p>
                    <p className="m-0" style={{ ...T.body, lineHeight: "28px" }}>
                      <LensDrift text="My user testing is not finished. I present the work to the stakeholders at IBM at the IBM/NC State symposium on November 23, and I will add the results here after that." />
                    </p>
                  </SceneCopy>
                }
                count={VALIDATION_STEPS.length}
                renderStep={(i, active) => (
                  <SceneStep n={i + 1} active={active}>
                    <P style={{ fontWeight: active ? 700 : 400, color: "inherit", lineHeight: "28px" }}>
                      <LensDrift text={VALIDATION_STEPS[i]} />
                    </P>
                  </SceneStep>
                )}
              />
            </Focus>

            <Focus as="section" index={12} className="flex flex-col items-center w-full text-center" style={{ gap: 20 }}>
              <H1>Reflection</H1>
              <div className="flex flex-col items-center" style={{ gap: 20, maxWidth: 570 }}>
                <P style={{ lineHeight: "28px" }}>
                  I started without knowing what SDD was, and so far I have tested a prototype with five people.
                </P>
                <P style={{ lineHeight: "28px" }}>
                  The spec map and the blocking-versus-optional split are my design decisions, not findings from the interviews.
                  A small sample shows that a problem exists, not how often.
                </P>
                <P style={{ lineHeight: "28px" }}>
                  Parts of the flow are still simulated: the owner’s reply and the Copilot handoff.
                </P>
              </div>
            </Focus>
          </section>
        </motion.main>
        <ProductSProgressBar dark={dark} />
      </SectionFocusProvider>
      <SiteFooter />
    </div>
  );
}
