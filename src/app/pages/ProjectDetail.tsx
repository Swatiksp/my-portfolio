import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { PROJECTS } from "../data/projects";
import { EdgeGlyphs } from "../components/EdgeGlyphs";

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "16px" }}>Project not found.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-5 py-2.5 cursor-pointer border-none"
          style={{ fontFamily: "'Archivo', sans-serif", fontSize: "14px" }}
        >
          Back to portfolio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Archivo', sans-serif" }}>
      <EdgeGlyphs />

      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-[66px] flex items-center justify-between px-[80px]"
        style={{
          background: "rgba(251,246,236,0.92)",
          borderBottom: "1px solid rgba(42,32,24,0.1)",
        }}
      >
        <div className="bg-black rounded-[2px] w-[16px] h-[16px] shrink-0" />
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-[8px] text-black bg-transparent border-none cursor-pointer hover:opacity-60 transition-opacity"
          style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 400, fontSize: "16px" }}
        >
          <ArrowLeft />
          Portfolio
        </button>
      </nav>

      {/* Hero image */}
      <motion.div
        className="w-full bg-[#d9d9d9]"
        style={{ marginTop: 66, height: "55vh" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Content */}
      <motion.div
        className="mx-auto px-[80px] py-[80px]"
        style={{ maxWidth: 1120 }}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
      >
        {/* Tags */}
        <div className="flex gap-[10px] flex-wrap mb-[24px]">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-black rounded-[2px]"
              style={{
                background: "#F2F2F2",
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 400,
                fontSize: "12px",
                padding: "8px 12px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1
          className="m-0 mb-[24px]"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: "64px",
            lineHeight: 1.1,
            color: "#000",
          }}
        >
          {project.title}
        </h1>

        {/* Lead */}
        <p
          className="m-0 mb-[80px]"
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 400,
            fontSize: "20px",
            lineHeight: 1.6,
            color: "#000",
            maxWidth: 680,
          }}
        >
          {project.desc}
        </p>

        {/* Divider */}
        <div className="w-full mb-[80px]" style={{ borderTop: "0.4px solid #c4c4c4" }} />

        {/* Overview */}
        <Section title="Overview">
          <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#000" }}>
            This is a placeholder for the project overview. Describe the problem space, the
            users you were designing for, and the business context that made this work matter.
          </p>
        </Section>

        {/* Process */}
        <Section title="My Approach">
          <div className="grid gap-[40px]" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {["Research & Discovery", "Ideation", "Prototyping", "Testing & Iteration"].map((phase) => (
              <div key={phase}>
                <h3
                  className="m-0 mb-[12px]"
                  style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "14px", letterSpacing: "0.08em", textTransform: "uppercase" }}
                >
                  {phase}
                </h3>
                <p className="m-0" style={{ fontSize: "15px", lineHeight: 1.7, color: "#444" }}>
                  Placeholder content for the {phase.toLowerCase()} phase of this project.
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Image placeholder */}
        <div className="w-full bg-[#d9d9d9] mb-[80px]" style={{ height: 480, borderRadius: 8 }} />

        {/* Outcomes */}
        <Section title="Outcomes">
          <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#000" }}>
            Placeholder for project outcomes, metrics, and impact. What changed for the
            users and the business as a result of this work?
          </p>
        </Section>

        {/* Back link */}
        <div className="mt-[80px] pt-[40px]" style={{ borderTop: "0.4px solid #c4c4c4" }}>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-[10px] bg-transparent border-none cursor-pointer text-black hover:opacity-60 transition-opacity p-0"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400, fontSize: "20px" }}
          >
            <ArrowLeft />
            Back to portfolio
          </button>
        </div>
      </motion.div>

    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-[80px]">
      <h2
        className="m-0 mb-[32px]"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: "32px",
          color: "#000",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
