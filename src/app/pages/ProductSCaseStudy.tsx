import { useContext } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Focus, FocusCtx, LensDrift, revealText, SectionFocusProvider } from "../components/SectionReveal";
import { PROJECTS } from "../data/projects";
import { StepScrollScene } from "../components/StepScrollScene";
import { EdgeGlyphs } from "../components/EdgeGlyphs";
import { SectionProgressBar, PROGRESS_BAR_HEIGHT } from "../components/SectionProgressBar";
import { SddLifecycleCompare } from "../components/SddLifecycleCompare";

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
  heading1: { fontFamily: MONO, fontWeight: 700, fontSize: 32, lineHeight: "40px", textTransform: "uppercase", color: C.ink },
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
      {children}
    </span>
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
        {label}
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

const IDEAS = [
  {
    title: "Context compiler",
    chips: ["Gaps", "Context", "Dependencies"],
    body: "It reads the spec against the repo’s patterns, tech stack and dependencies, finds what the spec leaves out, and drafts a suggested line for each gap.",
  },
  {
    title: "Assumption gating",
    chips: ["Assumptions", "Approval", "Traceability"],
    body: "It holds the handoff until an engineer approves the lines that matter. Blocking lines must be approved; optional ones travel on, labelled Still open.",
  },
];

const SCREENS = [
  {
    title: "One map of the whole spec.",
    body: "Each section shows how many gaps it holds and how many block export.",
    visual: "Spec map recording",
  },
  {
    title: "Blocking items come first.",
    body: "Only items marked Blocks export stop the handoff. Optional ones travel on, labelled Still open.",
    visual: "Review list",
  },
  {
    title: "Every suggestion shows its source.",
    body: "Why it is there, what the AI looked for, and the authority it cites.",
    visual: "Item dialog",
  },
  {
    title: "Export carries what is unresolved.",
    body: "The preview lists approved, unreviewed and open lines, and tells the agent to treat the last two as suggestions.",
    visual: "Export preview",
  },
];

const STATS = [
  { n: "6", label: "Interviews" },
  { n: "30", label: "Cited excerpts" },
  { n: "4", label: "Pain clusters" },
  { n: "5", label: "Questionnaire versions" },
  { n: "5", label: "Usability sessions" },
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

function ProductSProgressBar() {
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

export function ProductSCaseStudy() {
  const navigate = useNavigate();
  const tags = PROJECTS.find((p) => p.slug === "project-s")?.tags ?? [];

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
          style={{ width: 44, height: 44, background: C.forest, borderRadius: 4 }}
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
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex flex-col w-full" style={{ gap: 200 }}>
            <Focus as="header" index={0} className="flex flex-col gap-[40px] items-start w-full">
              <div
                className="relative w-full overflow-hidden flex flex-col gap-[20px] items-start"
                style={{ minHeight: 485, padding: 20, borderRadius: 15 }}
              >
                <div
                  className="halo-soft pointer-events-none absolute inset-0"
                  aria-hidden
                  style={{
                    borderRadius: 15,
                    backgroundColor: C.sand,
                    backgroundImage:
                      "radial-gradient(ellipse 1100px 820px at 0% 85%, #ffffff 27.4%, rgba(255,255,255,0.71) 42.3%, rgba(255,255,255,0) 80%)",
                  }}
                />
                <h1
                  className="relative z-[1] m-0"
                  style={{
                    fontFamily: MONO,
                    fontWeight: 700,
                    fontSize: 62,
                    lineHeight: "68px",
                    letterSpacing: "0.62px",
                    color: C.prism,
                    maxWidth: 720,
                  }}
                >
                  <LensDrift text="PROJECT S" />
                </h1>
                <p className="relative z-[1] m-0" style={{ fontFamily: SANS, fontSize: 18, lineHeight: "32px", color: C.ink, maxWidth: 720 }}>
                  <LensDrift text="Product S catches missing context before an AI agent writes code." />
                </p>
                <div className="relative z-[1] flex gap-[8px] items-start flex-wrap">
                  {tags.map((tag, i) => (
                    <Tag key={tag} color={TAG_COLORS[i % TAG_COLORS.length]}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>

              <div className="grid w-full items-start max-lg:grid-cols-1" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 20 }}>
                <div className="flex flex-col gap-[20px] min-w-0">
                  <p className="m-0" style={{ fontFamily: SANS, fontWeight: 500, fontSize: 28, lineHeight: "36px", color: C.ink }}>
                    <LensDrift text="A map of your spec, and where the AI needs you." />
                  </p>
                  <p className="m-0" style={T.intro}>
                    <LensDrift text="Product S turns a specification into a spec map. It shows what a spec is made of and which parts can go wrong, what the AI has already covered, and the high-stakes areas where it needs your input before an agent builds." />
                  </p>
                </div>

                <div className="halo-soft flex flex-col gap-[20px] min-w-0">
                  <div className="grid w-full items-start" style={{ gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 20 }}>
                    <MetaCell label="Role" labelStyle={T.storyMetaLabel} gap={10}>
                      <p className="m-0" style={T.metaValue}>
                        Sole designer
                      </p>
                      <p className="m-0" style={T.muted}>
                        Research to prototype
                      </p>
                    </MetaCell>
                    <MetaCell label="Duration" labelStyle={T.storyMetaLabel} gap={10}>
                      <p className="m-0" style={T.metaValue}>
                        Aug 20, 2026 to ongoing
                      </p>
                    </MetaCell>
                    <MetaCell label="Course" labelStyle={T.storyMetaLabel} gap={10}>
                      <p className="m-0" style={T.metaValue}>
                        NC State GD 503
                      </p>
                      <p className="m-0" style={T.muted}>
                        Brief provided by IBM
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
                <H1>What I developed</H1>
                <p className="m-0" style={{ fontFamily: SANS, fontSize: 18, lineHeight: "28px", color: C.ink, maxWidth: 720 }}>
                  <B>
                    <LensDrift text="Two ideas: a context compiler and assumption gating." />
                  </B>
                </p>
                <div className="grid w-full text-left max-md:grid-cols-1" style={{ gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {IDEAS.map((idea) => (
                    <div
                      key={idea.title}
                      className="flex flex-col items-start"
                      style={{ gap: 12, background: C.cream, borderRadius: 15, padding: 20, minHeight: 160 }}
                    >
                      <p className="m-0" style={{ fontFamily: SANS, fontWeight: 500, fontSize: 18, lineHeight: "24px", color: C.ink }}>
                        <LensDrift text={idea.title} />
                      </p>
                      <div className="flex gap-[8px] items-start flex-wrap">
                        {idea.chips.map((chip, i) => (
                          <Tag key={chip} color={TAG_COLORS[i % TAG_COLORS.length]}>
                            {chip}
                          </Tag>
                        ))}
                      </div>
                      <p className="m-0" style={{ ...T.intro, lineHeight: "26px" }}>
                        <LensDrift text={idea.body} />
                      </p>
                    </div>
                  ))}
                </div>
              </SddLifecycleCompare>
            </Focus>

            <Focus index={5} className="flex flex-col items-center w-full text-center" style={{ gap: 40 }}>
              <H1>Hi-fi screens</H1>
              <div className="flex flex-col w-full" style={{ gap: 40 }}>
                {SCREENS.map((screen, i) => (
                  <div key={screen.title} className="flex flex-col items-center w-full text-center" style={{ gap: 20 }}>
                    <div className="flex flex-col items-center" style={{ gap: 8, maxWidth: 570 }}>
                      <Mark n={i + 1} />
                      <H2>{screen.title}</H2>
                      <P style={{ lineHeight: "28px" }}>{screen.body}</P>
                      <p className="m-0" style={T.muted}>
                        Result.
                      </p>
                    </div>
                    <VisualSlot label={screen.visual} />
                  </div>
                ))}
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

          <section className="flex flex-col w-full" style={{ gap: 200 }}>
            <Focus index={8} className="flex flex-col items-center w-full text-center" style={{ gap: 40 }}>
              <H1>By the numbers</H1>
              <div className="grid w-full" style={{ gridTemplateColumns: "repeat(5, minmax(0,1fr))", gap: 20 }}>
                {STATS.map((stat) => (
                  <MetaCell key={stat.label} label={stat.label} labelStyle={{ ...T.storyMetaLabel, textAlign: "center" }} gap={10}>
                    <p className="m-0" style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, lineHeight: "40px", color: C.ink }}>
                      {stat.n}
                    </p>
                  </MetaCell>
                ))}
              </div>
              <p className="m-0" style={T.muted}>
                Five usability sessions, one with my professor.
              </p>

              <div className="flex flex-col items-center" style={{ gap: 20, maxWidth: 570 }}>
                <H1>Research</H1>
                <H2>I asked before I designed.</H2>
                <P style={{ lineHeight: "28px" }}>
                  I had never heard of SDD, so I started with secondary research on its lifecycle, then several questionnaires,
                  then interviews with 6 engineers, from a junior engineer to a director.
                </P>
              </div>
              <VisualSlot label="The questionnaires" />

              <div className="flex flex-col items-center" style={{ gap: 20, maxWidth: 570 }}>
                <H2>Missing context, detected before code is generated.</H2>
                <P style={{ lineHeight: "28px" }}>
                  Problem statements from the interviews pointed to one central theme, and I held every later decision to it.
                </P>
              </div>
              <VisualSlot label="Problem statements" minHeight={280} />
              <VisualSlot label="Pain-point synthesis" />

              <div className="flex flex-col items-center" style={{ gap: 20, maxWidth: 570 }}>
                <H2>Not every engineer writes a spec.</H2>
                <P style={{ lineHeight: "28px" }}>
                  One participant said a detailed spec up front does not produce better code. So the idea had to work for prompts
                  and chats too.
                </P>
              </div>
              <VisualSlot label="Finalized mind map and counter-evidence cards" />
            </Focus>

            <Focus index={9} className="flex flex-col items-center w-full text-center" style={{ gap: 40 }}>
              <div className="flex flex-col items-center" style={{ gap: 20, maxWidth: 570 }}>
                <H1>From problem to ideas</H1>
                <P style={{ lineHeight: "28px" }}>The problem statements became one How Might We.</P>
                <H2>
                  How might we automatically detect and surface architectural and query missing context gaps before code is
                  generated to prevent unauthorized agent inferences?
                </H2>
              </div>
              <VisualSlot label="HMW" minHeight={240} />

              <div className="flex flex-col items-center" style={{ gap: 20, maxWidth: 570 }}>
                <P style={{ lineHeight: "28px" }}>The HMW became a user story.</P>
                <P style={{ lineHeight: "28px" }}>
                  As a Senior Software Engineer, I want the system to detect and surface missing context gaps before code
                  generation, so that I can prevent unauthorized agent inferences.
                </P>
              </div>
              <VisualSlot label="User story" minHeight={240} />

              <div className="grid w-full max-md:grid-cols-1" style={{ gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <VisualSlot label="Stakeholder map" />
                <VisualSlot label="Ecosystem map" />
              </div>
              <VisualSlot label="User journey map" />
              <VisualSlot label="Mind map: four places to design" />

              <div className="flex flex-col items-center" style={{ gap: 20, maxWidth: 570 }}>
                <H2>Finalized mind map: two ideas had the strongest evidence.</H2>
                <P style={{ lineHeight: "28px" }}>
                  Two actions had strong evidence, from four or more of the six participants: a pre-ingestion context compiler, and
                  recording AI assumptions with explicit human gating. I built on those two and parked the rest.
                </P>
              </div>
              <VisualSlot label="Finalized mind map" />
            </Focus>

            <Focus index={10} className="flex flex-col items-center w-full text-center" style={{ gap: 40 }}>
              <div className="flex flex-col items-center" style={{ gap: 20, maxWidth: 570 }}>
                <H1>Design approach</H1>
                <H2>Fitting the idea into the SDD lifecycle.</H2>
                <P style={{ lineHeight: "28px" }}>
                  I simplified the standard lifecycle, then placed the context compiler and the approval gate inside it.
                </P>
              </div>
              <VisualSlot label="SDD lifecycle with the compiler and the gate" />

              <div className="flex flex-col items-center" style={{ gap: 20, maxWidth: 570 }}>
                <H2>Several user flows, one final.</H2>
                <P style={{ lineHeight: "28px" }}>
                  The last flow is the one the prototype follows, and it moved the gate to sit right after the compiler, before
                  design.
                </P>
              </div>
              <VisualSlot label="User flow, the prototype as it is now (Review list model, Version 23)" />

              <div className="flex flex-col items-center" style={{ gap: 20, maxWidth: 570 }}>
                <H2>First interface: Core Flow.</H2>
                <P style={{ lineHeight: "28px" }}>
                  It followed the earlier flow, and it felt too jarring. I wanted to see how the spec breaks apart straight away.
                </P>
              </div>
              <VisualSlot label="Core Flow section, Interface Design page" />

              <div className="flex flex-col items-center" style={{ gap: 20, maxWidth: 570 }}>
                <H2>New idea: the spec map.</H2>
                <P style={{ lineHeight: "28px" }}>
                  One view of the whole spec, with the gaps shown in place. I built an environment for it and drew simple
                  wireframes.
                </P>
              </div>
              <VisualSlot label="Spec map new idea section" />
            </Focus>

            <Focus index={11} className="flex flex-col items-center w-full text-center" style={{ gap: 40 }}>
              <div className="flex flex-col items-center" style={{ gap: 20, maxWidth: 570 }}>
                <H1>Validating through iteration</H1>
                <H2>Test 1: two participants on the spec map.</H2>
                <p className="m-0" style={T.muted}>
                  Two or three findings. I changed the interface from what they said.
                </p>
              </div>
              <VisualSlot label="Wireframes beside the revised screens, changes marked" />

              <div className="flex flex-col items-center" style={{ gap: 20, maxWidth: 570 }}>
                <H2>Test 2: three people on the redesign.</H2>
                <P style={{ lineHeight: "28px" }}>
                  I tested my professor as a stakeholder, giving him three tasks and judging how he did, then two classmates,
                  participants 1 and 2.
                </P>
                <p className="m-0" style={T.muted}>
                  Task results and findings.
                </p>
              </div>
              <VisualSlot label="Task results" />

              <div className="flex flex-col items-center" style={{ gap: 20, maxWidth: 570 }}>
                <H2>Final redesign.</H2>
                <p className="m-0" style={T.muted}>
                  The changes this round caused.
                </p>
              </div>
              <VisualSlot label="Prototype; Technical Review page, before and after" />
            </Focus>

            <Focus as="section" index={12} className="flex flex-col items-center w-full text-center" style={{ gap: 20 }}>
              <H1>Reflection</H1>
              <P style={{ lineHeight: "28px", maxWidth: 570 }}>
                I started without knowing what SDD was and have so far tested a prototype with five people. The spec map and the
                blocking-versus-optional split are my design decisions, not findings from the interviews, and a small sample
                shows that a problem exists, not how often. Parts of the flow are still simulated: the owner’s reply and the
                Copilot handoff.
              </P>
              <p className="m-0" style={{ ...T.muted, maxWidth: 570 }}>
                One line on what you would do differently.
              </p>
            </Focus>
          </section>
        </motion.main>
        <ProductSProgressBar />
      </SectionFocusProvider>
    </div>
  );
}
