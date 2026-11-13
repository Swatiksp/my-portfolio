import { LINKEDIN_URL } from "../lib/links";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import linkedInIcon from "@/imports/Frame7/b9ce6f119974543779bbcad7563e234be8edd900.png";
import logoMark from "@/assets/logo/logo.svg";
import { PROJECTS, isOpenable } from "../data/projects";
import { useIsMobile } from "../lib/useIsMobile";
import { CompanyMarquee } from "./CompanyMarquee";
import { ToolMarks } from "./ToolMarks";
import { AboutCta } from "./AboutCta";
import { TypeIn } from "./TypeIn";
import { PrismCraftCard } from "./PrismCraftCard";
import { HaloCraftCard } from "./HaloCraftCard";
import { ProjectSCraftCard } from "./ProjectSCraftCard";
import { ThesisCraftCard } from "./ThesisCraftCard";
import { ShowcaseCraftCard } from "./ShowcaseCraftCard";
import { GearsIcon } from "./GearsIcon";

/* The phone layout of the homepage (iPhone width and below). The desktop page is a pinned, scroll-driven staircase of
   tiles; on a phone the same story is one calm column: intro, the work as stacked cards, then the closing and footer.
   Colours, type and card chrome match the desktop page. */

const COLORS = { forest: "#1f3d2b", cream: "#fbf6ec", black: "#000000", ink: "#2a2018", inkMuted: "#7b6a58" };
const FONT_SANS = "'Roboto', sans-serif";
const FONT_COND = "'Roboto Condensed', 'Roboto', sans-serif";
const FONT_DING = "'Yarndings 12', sans-serif";
const SERIF = "'Newsreader', 'Iowan Old Style', Georgia, serif";

const CRAFT = new Set(["prism", "halo-conversations", "project-s", "thesis", "microsoft-showcase"]);

export function MobileHomepage() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  // white page in light mode, black in dark, like the desktop page
  useEffect(() => {
    const els = [document.documentElement, document.body];
    els.forEach((el) => {
      el.style.backgroundColor = dark ? "#000000" : "#ffffff";
      el.style.backgroundImage = "none";
    });
    return () => {
      els.forEach((el) => {
        el.style.backgroundColor = "";
        el.style.backgroundImage = "";
      });
    };
  }, [dark]);

  const heading = dark ? "#ffffff" : COLORS.black;
  const copy = dark ? "#ffffff" : COLORS.ink;
  const muted = dark ? "rgba(255,255,255,0.62)" : COLORS.inkMuted;
  const line = dark ? "rgba(255,255,255,0.12)" : "rgba(42,32,24,0.1)";

  const navLink = {
    fontFamily: FONT_COND,
    fontWeight: 700,
    fontSize: 13,
    lineHeight: "20px",
    letterSpacing: "1.04px",
    color: copy,
    background: "none",
    border: "none",
    padding: 0,
    textDecoration: "none",
    cursor: "pointer",
  } as const;
  const button = {
    background: dark ? "#ffffff" : COLORS.forest,
    color: dark ? "#000000" : COLORS.cream,
    fontFamily: FONT_COND,
    fontWeight: 700,
    fontSize: 13,
    lineHeight: "20px",
    letterSpacing: "1.04px",
    borderRadius: 4,
    border: "none",
    padding: "10px 16px",
    cursor: "pointer",
    textDecoration: "none",
    whiteSpace: "nowrap",
  } as const;

  const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  // arriving from another page's WORK link (/#work)
  const { hash } = useLocation();
  useEffect(() => {
    if (hash !== "#work") return;
    const id = requestAnimationFrame(() => document.getElementById("work")?.scrollIntoView({ block: "start" }));
    return () => cancelAnimationFrame(id);
  }, [hash]);

  return (
    <div className={`w-full${dark ? " home-dark" : ""}`} style={{ fontFamily: FONT_SANS, background: dark ? "#000000" : "#ffffff", color: copy, overflowX: "clip" }}>
      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{
          height: 60,
          padding: "0 16px",
          background: dark ? "rgba(0,0,0,0.92)" : "rgba(255,255,255,0.92)",
          borderBottom: `1px solid ${line}`,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <button
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="shrink-0 border-none cursor-pointer p-0"
          style={{ width: 36, height: 36, background: `url("${logoMark}") center / cover no-repeat`, borderRadius: 4 }}
        />
        <div className="flex items-center" style={{ gap: 18 }}>
          <button type="button" onClick={() => setDark((v) => !v)} aria-pressed={dark} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} style={navLink}>
            {dark ? "LIGHT" : "DARK"}
          </button>
          <button type="button" onClick={() => goTo("work")} style={navLink}>
            WORK
          </button>
          <button type="button" style={{ ...button, padding: "8px 12px", fontSize: 12 }}>
            RESUME
          </button>
        </div>
      </nav>

      {/* Intro */}
      <section style={{ padding: "108px 24px 56px", display: "flex", flexDirection: "column", gap: 28 }}>
        <div className="flex flex-col" style={{ gap: 12 }}>
          <div className="flex flex-col" style={{ gap: 14 }}>
            <p className="m-0" style={{ fontWeight: 700, fontSize: 16, lineHeight: "24px", color: heading }}>
              <TypeIn text="Glad you’re here!" />
            </p>
            <p
              className="m-0"
              style={{ fontFamily: SERIF, fontOpticalSizing: "auto", fontWeight: 700, fontSize: 48, lineHeight: "52px", letterSpacing: "-0.02em", color: heading }}
            >
              <TypeIn text="I’m Swatik" />
            </p>
          </div>
          <p className="m-0" style={{ fontSize: 18, lineHeight: "29px", color: copy }}>
            <TypeIn text="Designing digital systems and the relationships people have with them, through product and interaction design." />
          </p>
        </div>

        <CompanyMarquee dark={dark} />

        <div className="flex flex-col" style={{ gap: 20 }}>
          <div className="flex flex-col" style={{ gap: 3 }}>
            <p className="m-0" style={{ fontWeight: 700, fontSize: 15, color: heading }}>
              <TypeIn text="Previously designed at" />
            </p>
            <p className="m-0" style={{ fontSize: 18, lineHeight: "26px", color: copy }}>
              <TypeIn text="Accenture Microsoft Business Group" />
            </p>
          </div>
          <div className="flex flex-col" style={{ gap: 3 }}>
            <p className="m-0" style={{ fontWeight: 700, fontSize: 15, color: heading }}>
              <TypeIn text="Currently Studying at" />
            </p>
            <p className="m-0" style={{ fontSize: 18, lineHeight: "26px", color: copy }}>
              <TypeIn text="North Carolina State University" />
            </p>
            <p className="m-0 flex items-center uppercase" style={{ gap: 6, fontFamily: FONT_COND, fontWeight: 700, fontSize: 18, color: copy }}>
              <span aria-hidden style={{ display: "inline-block", transform: "rotate(45deg)", fontFamily: FONT_DING, fontWeight: 400, fontSize: 18, lineHeight: 1 }}>
                H
              </span>
              <TypeIn text="gowolfpack!" />
            </p>
          </div>
        </div>
      </section>

      {/* The work */}
      <section id="work" style={{ padding: "8px 24px 72px", scrollMarginTop: 72 }}>
        <h2 className="m-0" style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 48, lineHeight: "52px", letterSpacing: "-0.02em", color: heading }}>
          My Craft
        </h2>
        <p className="m-0" style={{ marginTop: 8, fontFamily: FONT_COND, fontSize: 16, lineHeight: "24px", color: muted }}>
          Each tile represents a body of work.
        </p>
        <div className="flex flex-col" style={{ gap: 28, marginTop: 28 }}>
          {PROJECTS.map((project) => {
            const craft = CRAFT.has(project.slug);
            const open = isOpenable(project);
            const go = () => {
              if (open) navigate(`/projects/${project.slug}`);
            };
            return (
              <div key={project.slug} className="flex flex-col" style={{ gap: 12 }}>
                <div
                  onClick={go}
                  {...(open ? { role: "link", tabIndex: 0, onKeyDown: (e: { key: string }) => (e.key === "Enter" ? go() : undefined), "aria-label": `Open ${project.title}` } : {})}
                  style={{
                    background: "rgba(255,255,255,0.55)",
                    border: "1px solid rgba(255,255,255,0.9)",
                    borderRadius: 20,
                    padding: 20,
                    boxSizing: "border-box",
                    boxShadow: dark ? "none" : "0px 16px 20px rgba(89,51,13,0.24)",
                    cursor: open ? "pointer" : "default",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {craft ? (
                    <div
                      className="poster-mobile"
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "100 / 92",
                        borderRadius: 15,
                        overflow: "hidden",
                        boxShadow: dark ? "none" : "0px 2px 7px 5px rgba(0,0,0,0.1)",
                      }}
                    >
                      {project.slug === "prism" ? (
                        <PrismCraftCard />
                      ) : project.slug === "project-s" ? (
                        <ProjectSCraftCard />
                      ) : project.slug === "thesis" ? (
                        <ThesisCraftCard />
                      ) : project.slug === "microsoft-showcase" ? (
                        <ShowcaseCraftCard />
                      ) : (
                        <HaloCraftCard />
                      )}
                    </div>
                  ) : (
                    <>
                      <img
                        src={dark ? project.frost : project.image}
                        alt=""
                        draggable={false}
                        style={{ display: "block", width: "100%", aspectRatio: "16 / 9", objectFit: "cover", borderRadius: 15, boxShadow: dark ? "none" : "0px 2px 7px 5px rgba(0,0,0,0.1)" }}
                      />
                      <div className="flex flex-col" style={{ gap: 10, paddingTop: 16 }}>
                        <span style={{ fontWeight: 500, fontSize: 24, lineHeight: 1, color: heading }}>{project.title}</span>
                        <p className="m-0" style={{ fontSize: 14, lineHeight: "1.4", color: dark ? "rgba(255,255,255,0.82)" : COLORS.ink }}>
                          {project.desc}
                        </p>
                        <div className="flex flex-wrap" style={{ gap: 8 }}>
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{ padding: "5px 10px", borderRadius: 4, background: dark ? "rgba(255,255,255,0.12)" : "rgba(31,61,43,0.08)", color: dark ? "#fff" : COLORS.forest, fontWeight: 500, fontSize: 12 }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {craft && !open && (
                  <span style={{ ...navLink, alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 10, padding: "4px 2px", color: muted, cursor: "default" }}>
                    <GearsIcon size={20} /> CASE STUDY IN PROGRESS
                  </span>
                )}
                {craft && open && (
                  <button type="button" onClick={go} style={{ ...navLink, alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 2px" }}>
                    VIEW CASE STUDY <span aria-hidden>→</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "48px 24px 28px", borderTop: `1px solid ${line}`, display: "flex", flexDirection: "column", gap: 40 }}>
        <div id="about" className="flex flex-col items-start" style={{ gap: 14, paddingBottom: 36, borderBottom: `1px solid ${line}`, scrollMarginTop: 72 }}>
          <p className="m-0" style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 36, lineHeight: "42px", letterSpacing: "-0.02em", color: heading }}>
            Want to know more about me?
          </p>
          <span style={{ marginTop: 6 }}><AboutCta buttonStyle={button} dark={dark} glyphSize={22} onClick={() => navigate("/about")} /></span>
        </div>
        <div className="flex flex-col" style={{ gap: 18 }}>
          <p className="m-0" style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 48, lineHeight: "52px", letterSpacing: "-0.02em", color: heading }}>
            Let’s work together.
          </p>
          <div className="flex items-start">
            <a href="mailto:spswatik@gmail.com" style={button}>
              SPSWATIK@GMAIL.COM
            </a>
          </div>
        </div>
        <div className="flex flex-col" style={{ gap: 14 }}>
          <span style={{ ...navLink, color: muted, cursor: "default" }}>EXPLORE</span>
          <div className="flex flex-wrap" style={{ gap: "14px 24px" }}>
            <button type="button" onClick={() => goTo("work")} style={navLink}>
              WORK
            </button>
            <button type="button" onClick={() => navigate("/about")} style={navLink}>
              ABOUT
            </button>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" style={navLink}>
              LINKEDIN ↗
            </a>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={navLink}>
              BACK TO TOP ↑
            </button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: "18px 10px", paddingTop: 18, borderTop: `1px solid ${line}` }}>
          <div className="flex items-center" style={{ gap: 10 }}>
            <div className="shrink-0" style={{ width: 26, height: 26, background: `url("${logoMark}") center / cover no-repeat`, borderRadius: 4 }} />
            <span style={{ fontWeight: 500, fontSize: 15, color: heading }}>Swatik SP</span>
          </div>
          <ToolMarks size={24} gap={16} color={muted} labelSize={13} style={{ gridRow: 2, gridColumn: "1 / -1" }} />
          <span style={{ fontSize: 12, color: muted, justifySelf: "end", textAlign: "right" }}>© 2026 Swatik SP</span>
        </div>
      </footer>
    </div>
  );
}
