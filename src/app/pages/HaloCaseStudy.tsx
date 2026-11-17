import { SiteFooter } from "../components/SiteFooter";
import { SiteNav } from "../components/SiteNav";
import { useContext } from "react";
import type { CSSProperties, ReactNode } from "react";
import { TypeIn } from "../components/TypeIn";
import { CaseHero, HeroPill } from "../components/CaseHero";
import herohBg from "@/assets/craft-poster/h-bg.webp";
import herohShot from "@/assets/craft-poster/h-shot.webp";
import { motion } from "motion/react";
import { Focus, FocusCtx, LensDrift, revealText, SectionFocusProvider } from "../components/SectionReveal";
import { PROJECTS } from "../data/projects";
import { StepScrollScene } from "../components/StepScrollScene";
import { EdgeGlyphs } from "../components/EdgeGlyphs";
import { SectionProgressBar, PROGRESS_BAR_HEIGHT } from "../components/SectionProgressBar";
import { useIsMobile } from "../lib/useIsMobile";
import { HaloWireframeHover } from "../components/HaloWireframeHover";
import { HaloTaskFlow } from "../components/HaloTaskFlow";
import { HaloHifiStages } from "../components/HaloHifiStages";
import alexPhoto from "@/assets/halo/personas/alex.jpg";
import haliePhoto from "@/assets/halo/personas/halie.jpg";

const C = {
  forest: "var(--forest)",
  prism: "#396f4e",
  ink: "var(--ink)",
  cream: "var(--cream)",
  sand: "var(--sand)",
  line: "var(--line)",
  bar: "var(--bar)",
};
const MONO = "'Roboto Condensed', 'Roboto', sans-serif";
const SANS = "'Roboto', sans-serif";
const NAV = "'Plus Jakarta Sans', sans-serif";

const NAV_H = 66;
const STEP_DIM = "rgba(var(--ink-rgb),0.25)";
const SCENE_MAX = 1167;

const T = {
  eyebrow: {
    fontFamily: SANS,
    fontWeight: 600,
    fontSize: "var(--fs-label, 12px)",
    lineHeight: "var(--lh-label, 16px)",
    letterSpacing: "1.44px",
    textTransform: "uppercase",
    color: C.forest,
  },
  heading1: { fontFamily: "'Newsreader', 'Iowan Old Style', Georgia, serif", fontWeight: 400, fontSize: "var(--fs-h1, 42px)", lineHeight: "var(--lh-h1, 48px)", letterSpacing: "-0.02em", color: C.ink },
  metaLabel: {
    fontFamily: SANS,
    fontWeight: 600,
    fontSize: "var(--fs-label, 12px)",
    lineHeight: "var(--lh-label, 16px)",
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    color: "rgba(var(--ink-rgb),var(--muted-a, 0.42))",
  },
  storyMetaLabel: {
    fontFamily: SANS,
    fontWeight: 500,
    fontSize: "var(--fs-body, 18px)",
    lineHeight: "var(--lh-body, 16px)",
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    color: "rgba(var(--ink-rgb),var(--muted-a, 0.42))",
  },
  metaValue: { fontFamily: SANS, fontWeight: 400, fontSize: "var(--fs-sec, 16px)", lineHeight: "var(--lh-sec, 22px)", color: C.ink },
  muted: { fontFamily: SANS, fontWeight: 400, fontSize: "var(--fs-sec, 13px)", lineHeight: "var(--lh-sec, 18px)", color: "rgba(var(--ink-rgb),var(--muted-a, 0.45))" },
  heading2: {
    fontFamily: SANS,
    fontWeight: 400,
    fontSize: "var(--fs-h3, 24px)",
    lineHeight: "var(--lh-h3, 34px)",
    letterSpacing: "0.26px",
    color: C.ink,
  },
  body: { fontFamily: SANS, fontWeight: 400, fontSize: "var(--fs-body, 18px)", lineHeight: "var(--lh-body, 32px)", color: C.ink },
  intro: { fontFamily: SANS, fontWeight: 400, fontSize: "var(--fs-body, 18px)", lineHeight: "var(--lh-body, 28px)", color: C.ink },
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

function Tag({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span
      className="whitespace-nowrap"
      style={{
        background: C.cream,
        color,
        fontFamily: SANS,
        fontWeight: 400,
        fontSize: "var(--fs-sec, 16px)",
        lineHeight: "var(--lh-sec, 18px)",
        padding: "4px 12px",
        borderRadius: 999,
      }}
    >
      {typeof children === "string" ? <TypeIn text={children} /> : children}
    </span>
  );
}

function Mark({ n, style }: { n: number; style?: CSSProperties }) {
  return (
    <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: "var(--fs-lead, 20px)", lineHeight: "var(--lh-lead, 30px)", color: C.ink, ...style }}>[{n}]</span>
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

const TAG_COLORS = [C.ink, C.forest];

const PROBLEM_STEPS = [
  "Microsoft sales executives spent too long on decks that still missed what the client actually needed.",
  "Design and content lived in different tools, so nothing produced an industry-specific deck from a conversation.",
  "Avanade needed an internal tool on Microsoft’s own stack — Copilot, PowerPoint, Showcase — not a side product.",
];

const FEATURES = [
  {
    title: "Conversation to deck",
    body: "Copilot turns a client conversation into an industry-specific sales deck.",
  },
  {
    title: "Four conversational tones",
    body: "Copilot's existing tones, narrowed to the four testers preferred: Wave, Grove, Canyon and Meadow.",
  },
  {
    title: "Three paths from client data to a prompt",
    body: "Three flows that take what the executive knows about the client and turn it into a prompt.",
  },
];

type Persona = {
  photo: string;
  role: string;
  name: string;
  meta: string;
  quote: string;
  goals: string[];
  pains: string[];
  responsibilities: string[];
  traits: string[];
};

const PERSONAS: Persona[] = [
  {
    photo: alexPhoto,
    role: "Sales Executive",
    name: "Alex Johnson",
    meta: "36 · New York City, USA · 10+ years in sales",
    quote: "The right tools can transform how I connect with clients and close deals.",
    goals: [
      "Quickly create tailored presentations that resonate with potential clients.",
      "Impress clients with industry-specific, data-driven insights.",
    ],
    pains: [
      "Spending excessive time on presentations that fail to meet client expectations.",
      "Lack of tools that integrate both design and content creation efficiently.",
    ],
    responsibilities: [
      "Maintaining client relationships.",
      "Delivering tailored presentations",
      "Aligning clients with company offerings",
    ],
    traits: ["Empathetic", "Organized", "Analytical", "Resilient"],
  },
  {
    photo: haliePhoto,
    role: "Client support",
    name: "Halie Sharma",
    meta: "26 · Bangalore, India · 7+ years in client support",
    quote: "The right tools can transform how I connect with clients and close deals.",
    goals: [
      "Quickly resolve customer issues while maintaining a positive brand impression.",
      "Use analytics to address common client needs",
    ],
    pains: [
      "Difficulty accessing client interaction history across multiple channels.",
      "Limited tools to provide consistent, personalized responses to clients",
    ],
    responsibilities: [
      "Managing a team of support agents to ensure customer satisfaction.",
      "Analyzing support trends and improving response workflows.",
    ],
    traits: ["Empathetic", "Organized", "Analytical", "Resilient"],
  },
];

const PROGRESS_SECTIONS: { label: string; short: string; group: "story" | "research"; focus: number[] }[] = [
  { label: "Intro", short: "Intro", group: "story", focus: [0] },
  { label: "The problem", short: "Problem", group: "story", focus: [1] },
  { label: "People", short: "People", group: "story", focus: [2] },
  { label: "What we made", short: "Made", group: "story", focus: [3] },
  { label: "Task flow", short: "Flow", group: "story", focus: [4] },
  { label: "Wireframes", short: "Wireframes", group: "story", focus: [5] },
  { label: "Screens", short: "Screens", group: "story", focus: [6] },
  { label: "Outcomes", short: "Outcomes", group: "story", focus: [7] },
];

function HaloProgressBar() {
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

function PersonaCard({ person }: { person: Persona }) {
  const BW = {
    card: "#ffffff",
    text: "#000000",
    panel: "#f4f4f4",
    ink: "#000000",
    chip: "#e8e8e8",
    border: "#e5e5e5",
  };

  const Block = ({ label, items }: { label: string; items: string[] }) => (
    <div className="flex flex-col" style={{ gap: 12 }}>
      <span
        className="self-start"
        style={{
          background: BW.chip,
          color: BW.ink,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: "var(--fs-sec, 14px)",
          lineHeight: "var(--lh-sec, 18px)",
          padding: "6px 12px",
          borderRadius: 999,
        }}
      >
        {label}
      </span>
      <ul className="m-0 pl-[18px] list-disc" style={{ ...T.intro, lineHeight: "var(--lh-body, 24px)", color: BW.text }}>
        {items.map((item) => (
          <li key={item} style={{ marginBottom: 8 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div
      className="flex flex-col w-full overflow-hidden"
      style={{
        background: BW.card,
        border: `1px solid ${BW.border}`,
        borderRadius: 15,
        padding: 24,
        gap: 24,
        color: BW.text,
      }}
    >
      <div className="grid w-full items-start max-md:grid-cols-1" style={{ gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)", gap: 24 }}>
        <div className="relative overflow-hidden" style={{ borderRadius: 12, minHeight: 280, background: BW.panel }}>
          <img decoding="async" loading="lazy" src={person.photo} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "50% 18%" }} />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.92) 78%, #ffffff 100%)" }}
          />
          <div className="absolute left-0 right-0 bottom-0 flex flex-col items-start text-left" style={{ padding: 16, gap: 4 }}>
            <p className="m-0" style={{ fontFamily: SANS, fontWeight: 400, fontSize: "var(--fs-sec, 13px)", lineHeight: "var(--lh-sec, 18px)", color: BW.ink }}>
              {person.role}
            </p>
            <p className="m-0" style={{ fontFamily: MONO, fontWeight: 700, fontSize: "var(--fs-h3, 22px)", lineHeight: "var(--lh-h3, 28px)", color: BW.ink }}>
              {person.name}
            </p>
            <p className="m-0" style={{ fontFamily: SANS, fontWeight: 400, fontSize: "var(--fs-sec, 13px)", lineHeight: "var(--lh-sec, 18px)", color: BW.ink }}>
              {person.meta}
            </p>
          </div>
        </div>
        <div className="flex flex-col" style={{ gap: 24 }}>
          <Block label="Goals" items={person.goals} />
          <Block label="Pain Points" items={person.pains} />
        </div>
      </div>
      <p className="m-0" style={{ fontFamily: SANS, fontWeight: 400, fontSize: "var(--fs-sec, 16px)", lineHeight: "var(--lh-sec, 24px)", color: BW.text }}>
        “{person.quote}”
      </p>
      <div className="grid w-full items-start max-md:grid-cols-1" style={{ gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Block label="Responsibilities" items={person.responsibilities} />
        <div className="flex flex-col" style={{ gap: 12 }}>
          <span
            className="self-start"
            style={{
              background: BW.chip,
              color: BW.ink,
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: "var(--fs-sec, 14px)",
              lineHeight: "var(--lh-sec, 18px)",
              padding: "6px 12px",
              borderRadius: 999,
            }}
          >
            Personality Traits
          </span>
          <div className="flex flex-wrap" style={{ gap: 8 }}>
            {person.traits.map((trait) => (
              <span
                key={trait}
                style={{
                  background: BW.chip,
                  color: BW.ink,
                  fontFamily: SANS,
                  fontSize: "var(--fs-sec, 13px)",
                  padding: "6px 10px",
                  borderRadius: 999,
                }}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DesignExecution() {
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col w-full" style={{ gap: 20 }}>
      <div className="flex flex-col" style={{ gap: 20 }}>
        <H1>Design Execution</H1>
        <p className="m-0" style={{ ...T.body, lineHeight: "var(--lh-body, 28px)", maxWidth: 570 }}>
          <LensDrift text="Low & high fidelity wireframes" />
        </p>
        <p className="m-0" style={T.muted}>
          <LensDrift text={isMobile ? "Tap a frame to enlarge it" : "Hover a frame to enlarge it"} />
        </p>
      </div>
      <div className="halo-soft">
        <HaloWireframeHover />
      </div>
    </div>
  );
}

const HERO_DESC = "Reimagining Microsoft Copilot to generate tailor-made presentations that streamline conversations between sales executives and clients";

export function HaloCaseStudy() {
  const tags = PROJECTS.find((p) => p.slug === "halo-conversations")?.tags ?? [];


  return (
    <div className="min-h-screen" style={{ fontFamily: SANS, color: C.ink, background: "var(--page)" }}>
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
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div className="case-gap flex flex-col w-full" style={{ gap: 200 }}>
            <Focus as="header" index={0} className="flex flex-col gap-[40px] items-start w-full">
              <CaseHero bg={herohBg} shot={herohShot} shotAlt="Halo Conversations launch page in Microsoft Copilot" glyph="#bfe3ff" bgRotate={0}>
                <h1
                  className="m-0"
                  style={{
                    fontFamily: "'Newsreader', 'Iowan Old Style', Georgia, serif",
                    fontWeight: 700,
                    fontSize: "var(--fs-display, 64px)",
                    lineHeight: "var(--lh-display, 66px)",
                    letterSpacing: "-0.02em",
                    color: "#fff",
                    maxWidth: 720,
                  }}
                >
                  <TypeIn text="Halo" />
                  <br />
                  <TypeIn text="Conversations" />
                </h1>
                <p className="m-0" style={{ fontFamily: SANS, fontSize: "var(--fs-body, 18px)", lineHeight: "var(--lh-body, 32px)", color: "#fff", maxWidth: 720 }}>
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
                  <p className="m-0" style={{ fontFamily: SANS, fontWeight: 500, fontSize: "var(--fs-h3, 28px)", lineHeight: "var(--lh-h3, 36px)", color: C.ink }}>
                    <TypeIn
                      text="An internal sales tool on Microsoft’s stack, so a client conversation can become a tailored deck."
                    />
                  </p>
                  <p className="m-0" style={T.intro}>
                    <TypeIn
                      text="Halo Conversations is an AI-powered chat application integrated into the Microsoft Showcase platform. By leveraging MS Copilot, it assists in creating presentation decks that cater to a client’s specific needs."
                    />
                  </p>
                </div>

                <div className="halo-soft flex flex-col gap-[20px] min-w-0">
                  <div className="grid w-full items-start" style={{ gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 20 }}>
                    <MetaCell label="Client" labelStyle={T.storyMetaLabel} gap={10}>
                      <p className="m-0" style={T.metaValue}>
                        <TypeIn text="Avanade" />
                      </p>
                      <p className="m-0" style={T.muted}>
                        <TypeIn text="Microsoft Showcase" />
                      </p>
                    </MetaCell>
                    <MetaCell label="Duration" labelStyle={T.storyMetaLabel} gap={10}>
                      <p className="m-0" style={T.metaValue}>
                        <TypeIn text="Completed in 2024" />
                      </p>
                    </MetaCell>
                    <MetaCell label="Role" labelStyle={T.storyMetaLabel} gap={10}>
                      <div className="flex gap-[8px] items-start flex-wrap">
                        {["UI", "UX", "Prototyping"].map((role, i) => (
                          <Tag key={role} color={TAG_COLORS[i % TAG_COLORS.length]}>
                            {role}
                          </Tag>
                        ))}
                      </div>
                    </MetaCell>
                  </div>
                </div>
              </div>
            </Focus>

            <Focus as="section" index={1} className="w-full">
              <ProblemLikeScene
                left={
                  <SceneCopy>
                    <H1>
                      <LensDrift text="What were we trying to achieve?" />
                    </H1>
                    <p className="m-0" style={{ ...T.body, lineHeight: "var(--lh-body, 28px)" }}>
                      <LensDrift
                        text="We intended to create an internal tool for Avanade employees that they could use to generate sales decks specific to a potential client’s needs."
                      />
                    </p>
                    <p className="m-0" style={{ ...T.body, lineHeight: "var(--lh-body, 28px)" }}>
                      <LensDrift text="Avanade required a tool built on Microsoft ecosystems for Microsoft ecosystems." />
                    </p>
                  </SceneCopy>
                }
                count={PROBLEM_STEPS.length}
                renderStep={(i, active) => (
                  <SceneStep n={i + 1} active={active}>
                    <P style={{ fontWeight: active ? 700 : 400, color: "inherit", lineHeight: "var(--lh-body, 28px)" }}>
                      <LensDrift text={PROBLEM_STEPS[i]} />
                    </P>
                  </SceneStep>
                )}
              />
            </Focus>

            <Focus index={2} className="flex flex-col items-center w-full" style={{ gap: 40 }}>
              <H1 style={{ textAlign: "center" }}>Here’s a little more about the people</H1>
              <div className="halo-soft grid w-full max-lg:grid-cols-1" style={{ gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {PERSONAS.map((person) => (
                  <PersonaCard key={person.name} person={person} />
                ))}
              </div>
            </Focus>

            <Focus index={3} className="flex flex-col items-center w-full text-center" style={{ gap: 20 }}>
              <H1>Ideas we developed</H1>
              <p className="m-0" style={{ fontFamily: SANS, fontSize: "var(--fs-body, 18px)", lineHeight: "var(--lh-body, 28px)", color: C.ink, maxWidth: 720 }}>
                <B>
                  <LensDrift text="A Copilot-native sales workspace" />
                </B>
                <br />
                <LensDrift text="Features that turn a client brief into a tailored deck without leaving Microsoft’s stack." />
              </p>
              <div
                className="case-one-col grid w-full text-left"
                style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 20 }}
              >
                {FEATURES.map((feat) => (
                  <div
                    key={feat.title}
                    className="flex flex-col items-start"
                    style={{ gap: 12, background: C.cream, borderRadius: 15, padding: 20, minHeight: 160 }}
                  >
                    <p className="m-0" style={{ fontFamily: SANS, fontWeight: 500, fontSize: "var(--fs-body, 18px)", lineHeight: "var(--lh-body, 24px)", color: C.ink }}>
                      <LensDrift text={feat.title} />
                    </p>
                    <p className="m-0" style={{ ...T.intro, lineHeight: "var(--lh-body, 26px)" }}>
                      <LensDrift text={feat.body} />
                    </p>
                  </div>
                ))}
              </div>
            </Focus>

            <Focus index={4} className="w-full">
              <div className="w-full flex justify-center">
                <div className="w-full flex flex-col" style={{ maxWidth: SCENE_MAX, gap: 20 }}>
                  <SceneCopy>
                    <H1>General task flow</H1>
                    <p className="m-0" style={{ ...T.body, lineHeight: "var(--lh-body, 28px)", maxWidth: 570 }}>
                      <LensDrift text="Presentation of the general task flow created post iteration stages to ensure efficient navigation throughout the experience." />
                    </p>
                  </SceneCopy>
                  <HaloTaskFlow />
                </div>
              </div>
            </Focus>

            <Focus index={5} className="flex flex-col w-full" style={{ gap: 20 }}>
              <DesignExecution />
            </Focus>

            <Focus index={6} className="w-full">
              <HaloHifiStages />
            </Focus>

            <Focus as="section" index={7} className="flex flex-col items-center w-full text-center" style={{ gap: 20 }}>
              <H1>How it helped sales executives</H1>
              <p
                className="m-0"
                style={{
                  fontFamily: T.heading1.fontFamily,
                  fontWeight: 400,
                  fontSize: "clamp(64px, 11vw, 112px)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  color: C.forest,
                }}
              >
                {revealText("4+ → 1–2")}
              </p>
              <p className="m-0" style={{ ...T.metaLabel, textTransform: "none", letterSpacing: "0.2px", fontWeight: 500, fontSize: "var(--fs-sec, 15px)", lineHeight: "var(--lh-sec, 20px)", marginTop: -8 }}>
                {revealText("client meetings per deck, in testing (7 testers)")}
              </p>
              <P style={{ lineHeight: "28px", maxWidth: 570 }}>
                Executives describe the client in plain language and Copilot drafts a deck for that industry. In testing, client back-and-forth dropped from 4+ meetings, each days apart, to 1–2. Client turnaround time dropped by 70% in usability testing.
              </P>
            </Focus>
          </div>
        </motion.main>
        <HaloProgressBar />
      </SectionFocusProvider>
      <SiteFooter />
    </div>
  );
}
