import type { CSSProperties } from "react";
import { useNavigate } from "react-router";
import logoMark from "@/assets/logo/logo.svg";
import { AboutCta } from "./AboutCta";
import { ToolMarks } from "./ToolMarks";
import { useIsMobile } from "../lib/useIsMobile";
import { EMAIL, LINKEDIN_URL } from "../lib/links";
import { useTheme } from "../lib/theme";

// Theme tokens (index.css): they hold the original light colours and flip in dark mode.
const FOREST = "var(--btn-bg)";
const CREAM = "var(--btn-fg)";
const BLACK = "var(--ink)";
const INK = "var(--ink-2)";
const MUTED = "var(--muted)";
const LINE = "var(--nav-line)";
const SERIF = "'Newsreader', 'Iowan Old Style', Georgia, serif";
const SANS = "'Roboto', sans-serif";
const COND = "'Roboto Condensed', 'Roboto', sans-serif";

/**
 * The footer from the homepage, for every other page: the ABOUT ME prompt, "Let's work together" with the email, the
 * explore links and the credits. Colours come from the theme tokens, so it follows light / dark. `showAbout={false}`
 * drops the ABOUT ME prompt, for the About page itself.
 */
export function SiteFooter({ showAbout = true }: { showAbout?: boolean }) {
  const navigate = useNavigate();
  const mobile = useIsMobile();
  const { dark } = useTheme();

  const navLink: CSSProperties = {
    fontFamily: COND,
    fontWeight: 700,
    fontSize: mobile ? 13 : 14,
    lineHeight: mobile ? "20px" : "24px",
    letterSpacing: mobile ? "1.04px" : "1.12px",
    color: INK,
    textDecoration: "none",
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
  };
  const button: CSSProperties = {
    background: FOREST,
    color: CREAM,
    fontFamily: COND,
    fontWeight: 700,
    fontSize: mobile ? 13 : 14,
    lineHeight: mobile ? "20px" : "24px",
    letterSpacing: mobile ? "1.04px" : "1.12px",
    borderRadius: 4,
    border: "none",
    padding: mobile ? "10px 16px" : "10px 20px",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
    whiteSpace: "nowrap",
  };
  const bigHeading = (size: number, line: string): CSSProperties => ({ fontFamily: SERIF, fontWeight: 400, fontSize: size, lineHeight: line, letterSpacing: "-0.02em", color: BLACK, margin: 0 });

  const goWork = () => navigate("/#work");
  const goAbout = () => navigate("/about");
  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      className="relative w-full flex flex-col overflow-hidden"
      style={{ padding: mobile ? "48px 24px 28px" : "72px 80px 32px", gap: mobile ? 40 : 64, borderTop: `1px solid ${LINE}`, background: "var(--page)", boxSizing: "border-box", zIndex: 2 }} // above the fixed edge glyphs on the case studies
    >
      {showAbout && (
        <div className="flex items-center justify-between w-full" style={{ gap: 32, flexWrap: "wrap", paddingBottom: mobile ? 36 : 56, borderBottom: `1px solid ${LINE}`, flexDirection: mobile ? "column" : "row", alignItems: mobile ? "flex-start" : "center" }}>
          <p style={{ ...bigHeading(mobile ? 36 : 44, mobile ? "42px" : "50px"), maxWidth: 640 }}>Want to know more about me?</p>
          <AboutCta buttonStyle={button} dark={dark} glyphSize={mobile ? 22 : 24} onClick={goAbout} />
        </div>
      )}

      <div className="flex w-full" style={{ gap: mobile ? 40 : 48, flexWrap: "wrap", flexDirection: mobile ? "column" : "row", justifyContent: "space-between", alignItems: mobile ? "stretch" : "flex-end" }}>
        <div className="flex flex-col" style={{ gap: mobile ? 18 : 20, maxWidth: 640 }}>
          <p style={bigHeading(mobile ? 48 : 52, mobile ? "52px" : "57.6px")}>Let’s work together.</p>
          <div className="flex items-start">
            <a href={`mailto:${EMAIL}`} className="hover:opacity-85 transition-opacity" style={button}>
              {EMAIL.toUpperCase()}
            </a>
          </div>
        </div>

        <div className="flex flex-col" style={{ gap: 14, alignItems: "flex-start", minWidth: mobile ? 0 : 160 }}>
          <span style={{ ...navLink, color: MUTED, cursor: "default" }}>EXPLORE</span>
          <div className="flex" style={{ gap: mobile ? "14px 24px" : 14, flexDirection: mobile ? "row" : "column", flexWrap: "wrap", alignItems: "flex-start" }}>
            <button type="button" onClick={goWork} className="hover:opacity-60 transition-opacity" style={navLink}>
              WORK
            </button>
            <button type="button" onClick={goAbout} className="hover:opacity-60 transition-opacity" style={navLink}>
              ABOUT
            </button>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity" style={navLink}>
              LINKEDIN ↗
            </a>
            <button type="button" onClick={toTop} className="hover:opacity-60 transition-opacity" style={navLink}>
              BACK TO TOP ↑
            </button>
          </div>
        </div>
      </div>

      <div
        className="w-full"
        style={{ display: "grid", gridTemplateColumns: mobile ? "1fr auto" : "1fr auto 1fr", alignItems: "center", gap: mobile ? "18px 10px" : 24, paddingTop: mobile ? 18 : 20, borderTop: `1px solid ${LINE}` }}
      >
        <div className="flex items-center" style={{ gap: 10 }}>
          <div className="shrink-0" style={{ width: mobile ? 26 : 28, height: mobile ? 26 : 28, background: `url("${logoMark}") center / cover no-repeat`, borderRadius: 4 }} />
          <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 15, color: BLACK }}>Swatik SP</span>
        </div>
        <ToolMarks size={mobile ? 24 : 28} gap={mobile ? 16 : 18} color={MUTED} fontFamily={SANS} labelSize={mobile ? 13 : 14} style={mobile ? { gridRow: 2, gridColumn: "1 / -1" } : undefined} />
        <span style={{ fontFamily: SANS, fontSize: mobile ? 12 : 14, color: MUTED, justifySelf: "end", textAlign: "right" }}>
          {mobile ? "© 2026 Swatik SP" : "© 2026 Swatik SP. All rights reserved."}
        </span>
      </div>
    </footer>
  );
}
