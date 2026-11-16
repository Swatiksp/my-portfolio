import type { CSSProperties } from "react";
import { useNavigate } from "react-router";
import logoMark from "@/assets/logo/logo.svg";
import { useTheme } from "../lib/theme";

const COND = "'Roboto Condensed', 'Roboto', sans-serif";

export const NAV_HEIGHT = 66;

// the dark bar's tokens, for a page that goes dark on its own while the site theme is light
const DARK_TOKENS = {
  "--ink": "#ffffff",
  "--forest": "#9ad4b1",
  "--btn-bg": "#ffffff",
  "--btn-fg": "#000000",
  "--nav-bg": "rgba(11,12,14,0.92)",
  "--nav-line": "rgba(255,255,255,0.12)",
} as CSSProperties;

/**
 * The navigation bar from the homepage (logo, DARK MODE, WORK, ABOUT, VIEW RESUME), for every other page. DARK MODE
 * flips the site-wide theme (see lib/theme). `current` underlines the section you are in. Colours come from the theme
 * tokens in index.css, so the bar follows light / dark by itself. `dark` shows the bar dark whatever the site theme is
 * (Project S dissolves its page to dark for the high-fidelity section and the bar goes with it).
 */
export function SiteNav({ current, dark: darkOverride = false }: { current?: "work" | "about"; dark?: boolean }) {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();

  const link = (active: boolean): CSSProperties => ({
    fontFamily: COND,
    fontWeight: 700,
    fontSize: 14,
    lineHeight: "24px",
    letterSpacing: "1.12px",
    color: active ? "var(--forest)" : "var(--ink)",
    textDecoration: active ? "underline" : "none",
    textDecorationThickness: 2,
    textUnderlineOffset: 8,
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    transition: "color 500ms ease, opacity 150ms ease",
  });

  return (
    <nav
      className="case-nav site-nav fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{
        height: NAV_HEIGHT,
        paddingLeft: 71,
        paddingRight: 80,
        paddingBottom: 1,
        background: "var(--nav-bg)",
        borderBottom: "1px solid var(--nav-line)",
        transition: "background 500ms ease, border-color 500ms ease",
        ...(darkOverride ? DARK_TOKENS : null),
      }}
    >
      <button
        aria-label="Back to the homepage"
        onClick={() => navigate("/")}
        className="shrink-0 border-none cursor-pointer p-0"
        style={{ width: 44, height: 44, background: `url("${logoMark}") center / cover no-repeat`, borderRadius: 4 }}
      />
      <div className="site-nav-links flex items-center" style={{ gap: 40 }}>
        <button type="button" onClick={toggle} aria-pressed={dark} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} className="site-nav-link hover:opacity-60 transition-opacity" style={link(false)}>
          {dark ? "LIGHT" : "DARK"}
          <span className="site-nav-long"> MODE</span>
        </button>
        <button type="button" onClick={() => navigate("/#work")} className="site-nav-link hover:opacity-60 transition-opacity" style={link(current === "work")} aria-current={current === "work" ? "page" : undefined}>
          WORK
        </button>
        <button type="button" onClick={() => navigate("/about")} className="site-nav-link hover:opacity-60 transition-opacity" style={link(current === "about")} aria-current={current === "about" ? "page" : undefined}>
          ABOUT
        </button>
        <button
          type="button"
          className="site-nav-btn hover:opacity-85 transition-opacity"
          style={{ background: "var(--btn-bg)", color: "var(--btn-fg)", fontFamily: COND, fontWeight: 700, fontSize: 14, lineHeight: "24px", letterSpacing: "1.12px", borderRadius: 4, border: "none", padding: "10px 20px", cursor: "pointer", whiteSpace: "nowrap" }}
        >
          <span className="site-nav-long">VIEW </span>RESUME
        </button>
      </div>
    </nav>
  );
}
