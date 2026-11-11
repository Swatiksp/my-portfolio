import { motion, useReducedMotion } from "motion/react";

const SANS = "'Roboto', sans-serif";
const INK = "#000";
const MUTED = "rgba(0,0,0,0.5)";

/* The four clusters from the research mind map. Two of them became the two ideas. */
const CLUSTERS = [
  {
    name: "Context and dependency gaps",
    evidence: "6 of 6 engineers",
    pains: [
      "Specs written by non-engineers leave out edge cases and rules",
      "Agents hallucinate and make unauthorized inferences",
      "Context sits in other repos the agent cannot see",
    ],
    idea: "This became the context compiler.",
    glow: "glow-red",
  },
  {
    name: "Architectural guardrails",
    evidence: "5 of 6 engineers",
    pains: [
      "Agents introduce unapproved libraries and frameworks",
      "Generated code ignores the team’s style and file structure",
      "Code that does not scale piles up technical debt",
    ],
  },
  {
    name: "Cross-functional handoff",
    evidence: "5 of 6 engineers",
    pains: [
      "Static mockups miss interactive states",
      "Acceptance criteria lack technical depth",
      "Design intent and implementation drift apart",
    ],
  },
  {
    name: "Intent and traceability",
    evidence: "5 of 6 engineers",
    pains: [
      "Context and decisions are trapped in private chats",
      "Code reviews turn into skimming because of the volume",
      "Agents give no “why” for architectural choices",
    ],
    idea: "This became assumption gating.",
    glow: "glow-violet",
  },
];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
}

/** Four clusters of pain. The two that the ideas were built on are drawn heavier; the rest sit back. */
export function PainClusters() {
  return (
    <div
      className="w-full"
      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, textAlign: "left" }}
    >
      {CLUSTERS.map((c, i) => {
        const built = Boolean(c.idea);
        return (
          <Reveal key={c.name} delay={(i % 2) * 0.08}>
            <div
              className={built ? `glow-card ${c.glow}` : undefined}
              style={{
                ["--glow-delay" as string]: built ? (c.glow === "glow-violet" ? "-3.5s" : "0s") : undefined,
                height: "100%",
                boxSizing: "border-box",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                borderRadius: 15,
                border: built ? "1px solid var(--g-edge)" : "1px solid rgba(0,0,0,0.14)",
                background: "#fff",
                fontFamily: SANS,
                opacity: built ? 1 : 0.62,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 700, fontSize: 20, lineHeight: "28px", color: INK }}>{c.name}</span>
                <span style={{ fontSize: 14, lineHeight: "20px", color: MUTED }}>{c.evidence}</span>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {c.pains.map((p) => (
                  <li key={p} style={{ fontSize: 16, lineHeight: "24px", color: INK }}>
                    {p}
                  </li>
                ))}
              </ul>
              {built && (
                <p style={{ margin: "auto 0 0", paddingTop: 4, fontWeight: 700, fontSize: 16, lineHeight: "24px", color: INK }}>
                  {c.idea}
                </p>
              )}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
