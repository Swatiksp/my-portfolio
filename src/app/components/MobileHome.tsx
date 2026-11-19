import { useTheme } from "../lib/theme";
import { RESUME_URL } from "../lib/links";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import logoMark from "@/assets/logo/logo.svg";
import { MobileWork } from "./MobileStaircase";
import { GlyphCursorTrail } from "./GlyphCursorTrail";
import { CompanyMarquee } from "./CompanyMarquee";
import { ToolMarks } from "./ToolMarks";
import { AboutCta } from "./AboutCta";
import { TypeIn } from "./TypeIn";

/* The phone layout of the homepage (iPhone width and below). The desktop page is a pinned, scroll-driven staircase of
   tiles; on a phone the same story is one calm column: intro, the work as stacked cards, then the closing and footer.
   Colours, type and card chrome match the desktop page. */

const COLORS = { forest: "#1f3d2b", cream: "#fbf6ec", black: "#000000", ink: "#2a2018", inkMuted: "#7b6a58" };
const FONT_SANS = "'Roboto', sans-serif";
const FONT_COND = "'Roboto Condensed', 'Roboto', sans-serif";
const FONT_DING = "'Yarndings 12', sans-serif";
const SERIF = "'Newsreader', 'Iowan Old Style', Georgia, serif";

export function MobileHomepage() {
  const navigate = useNavigate();
  const { dark, toggle: toggleDark } = useTheme();

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
    fontSize: 15,
    lineHeight: "20px",
    letterSpacing: "1.04px",
    color: copy,
    background: "none",
    border: "none",
    padding: 0,
    minHeight: 44,
    display: "inline-flex",
    alignItems: "center",
    textDecoration: "none",
    cursor: "pointer",
  } as const;
  const button = {
    background: dark ? "#ffffff" : COLORS.forest,
    color: dark ? "#000000" : COLORS.cream,
    fontFamily: FONT_COND,
    fontWeight: 700,
    fontSize: 15,
    lineHeight: "20px",
    letterSpacing: "1.04px",
    borderRadius: 4,
    border: "none",
    minHeight: 44,
    padding: "0 16px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    cursor: "pointer",
    textDecoration: "none",
    whiteSpace: "nowrap",
  } as const;

  // Where the work column is fully in place (set by the pinned stage)
  const workTop = useRef(0);
  const goTo = (id: string) => {
    if (id === "work") window.scrollTo({ top: workTop.current, behavior: "smooth" });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // arriving from another page's WORK link (/#work)
  const { hash } = useLocation();
  useEffect(() => {
    if (hash !== "#work") return;
    const id = requestAnimationFrame(() => window.scrollTo({ top: workTop.current }));
    return () => cancelAnimationFrame(id);
  }, [hash]);

  const hero = (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="flex flex-col" style={{ gap: 12 }}>
          <div className="flex flex-col" style={{ gap: 14 }}>
            <p className="m-0" style={{ fontWeight: 700, fontSize: 17, lineHeight: "26px", color: heading }}>
              <TypeIn text="Glad you’re here!" />
            </p>
            <p
              className="m-0"
              style={{ fontFamily: SERIF, fontOpticalSizing: "auto", fontWeight: 700, fontSize: 40, lineHeight: "44px", letterSpacing: "-0.02em", color: heading }}
            >
              <TypeIn text="I’m Swatik" />
            </p>
          </div>
          <p className="m-0" style={{ fontSize: 17, lineHeight: "26px", color: copy }}>
            <TypeIn text="Designing digital systems and the relationships people have with them, through product and interaction design." />
          </p>
        </div>

        <div className="m-hero-marquee"><CompanyMarquee dark={dark} /></div>

        <div className="flex flex-col" style={{ gap: 20 }}>
          <div className="flex flex-col" style={{ gap: 3 }}>
            <p className="m-0" style={{ fontWeight: 700, fontSize: 15, color: heading }}>
              <TypeIn text="Previously designed at" />
            </p>
            <p className="m-0" style={{ fontSize: 17, lineHeight: "26px", color: copy }}>
              <TypeIn text="Accenture Microsoft Business Group" />
            </p>
          </div>
          <div className="flex flex-col" style={{ gap: 3 }}>
            <p className="m-0" style={{ fontWeight: 700, fontSize: 15, color: heading }}>
              <TypeIn text="Currently Studying at" />
            </p>
            <p className="m-0" style={{ fontSize: 17, lineHeight: "26px", color: copy }}>
              <TypeIn text="North Carolina State University" />
            </p>
            <p className="m-0 flex items-center uppercase" style={{ gap: 6, fontFamily: FONT_COND, fontWeight: 700, fontSize: 17, color: copy }}>
              <span aria-hidden style={{ display: "inline-block", transform: "rotate(45deg)", fontFamily: FONT_DING, fontWeight: 400, fontSize: 17, lineHeight: 1 }}>
                H
              </span>
              <TypeIn text="gowolfpack!" />
            </p>
          </div>
        </div>
    </div>
  );

  return (
    <div className={`w-full${dark ? " home-dark" : ""}`} style={{ fontFamily: FONT_SANS, background: dark ? "#000000" : "#ffffff", color: copy, overflowX: "clip" }}>
      <GlyphCursorTrail />

      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{
          height: 60,
          padding: "0 16px",
          background: dark ? "rgba(0,0,0,0.92)" : "rgba(255,255,255,0.92)",
          borderBottom: `1px solid ${line}`,
        }}
      >
        <button
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="shrink-0 border-none cursor-pointer p-0"
          style={{ width: 36, height: 36, background: `url("${logoMark}") center / cover no-repeat`, borderRadius: 4 }}
        />
        <div className="flex items-center" style={{ gap: 18 }}>
          <button type="button" onClick={toggleDark} aria-pressed={dark} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} style={navLink}>
            {dark ? "LIGHT" : "DARK"}
          </button>
          <button type="button" onClick={() => goTo("work")} style={navLink}>
            WORK
          </button>
          <button type="button" onClick={() => window.open(RESUME_URL, "_blank", "noopener,noreferrer")} style={{ ...button, padding: "0 12px" }}>
            RESUME
          </button>
        </div>
      </nav>

      {/* The pinned stage: the intro over the staircase of tiles, which turn over into the craft cards as you scroll
          (the same behaviour as the desktop page, Figma 1102:2210) */}
      <MobileWork hero={hero} dark={dark} heading={heading} copy={copy} muted={muted} link={navLink} onOpen={(slug) => navigate(`/projects/${slug}`)} workScrollRef={workTop} />

      {/* Footer */}
      <footer style={{ padding: "48px 24px 28px", borderTop: `1px solid ${line}`, display: "flex", flexDirection: "column", gap: 40 }}>
        <div id="about" className="flex flex-col items-start" style={{ gap: 14, paddingBottom: 36, borderBottom: `1px solid ${line}`, scrollMarginTop: 72 }}>
          <p className="m-0" style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 28, lineHeight: "34px", letterSpacing: "-0.02em", color: heading }}>
            Want to know more about me?
          </p>
          <span style={{ marginTop: 6 }}><AboutCta buttonStyle={button} dark={dark} glyphSize={22} onClick={() => navigate("/about")} /></span>
        </div>
        <div className="flex flex-col" style={{ gap: 18 }}>
          <p className="m-0" style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 40, lineHeight: "44px", letterSpacing: "-0.02em", color: heading }}>
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
          <span style={{ fontSize: 13, color: muted, justifySelf: "end", textAlign: "right" }}>© 2026 Swatik SP</span>
        </div>
      </footer>
    </div>
  );
}
