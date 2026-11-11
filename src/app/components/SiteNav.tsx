import type { CSSProperties } from "react";
import { useNavigate } from "react-router";
import logoMark from "@/assets/logo/logo.svg";

const FOREST = "#1f3d2b";
const CREAM = "#fbf6ec";
const COND = "'Roboto Condensed', 'Roboto', sans-serif";

export const NAV_HEIGHT = 66;

/**
 * The navigation bar from the homepage (logo, WORK, ABOUT, VIEW RESUME), for every other page. The dark-mode switch
 * stays on the homepage, which is the only page that has a dark side. `current` underlines the section you are in.
 */
export function SiteNav({ current }: { current?: "work" | "about" }) {
  const navigate = useNavigate();

  const link = (active: boolean): CSSProperties => ({
    fontFamily: COND,
    fontWeight: 700,
    fontSize: 14,
    lineHeight: "24px",
    letterSpacing: "1.12px",
    color: active ? FOREST : "#000",
    textDecoration: active ? "underline" : "none",
    textDecorationThickness: 2,
    textUnderlineOffset: 8,
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
  });

  return (
    <nav
      className="case-nav site-nav fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{
        height: NAV_HEIGHT,
        paddingLeft: 71,
        paddingRight: 80,
        paddingBottom: 1,
        background: "rgba(255,255,255,0.92)",
        borderBottom: "1px solid rgba(42,32,24,0.1)",
      }}
    >
      <button
        aria-label="Back to the homepage"
        onClick={() => navigate("/")}
        className="shrink-0 border-none cursor-pointer p-0"
        style={{ width: 44, height: 44, background: `url("${logoMark}") center / cover no-repeat`, borderRadius: 4 }}
      />
      <div className="site-nav-links flex items-center" style={{ gap: 40 }}>
        <button type="button" onClick={() => navigate("/#work")} className="site-nav-link hover:opacity-60 transition-opacity" style={link(current === "work")} aria-current={current === "work" ? "page" : undefined}>
          WORK
        </button>
        <button type="button" onClick={() => navigate("/about")} className="site-nav-link hover:opacity-60 transition-opacity" style={link(current === "about")} aria-current={current === "about" ? "page" : undefined}>
          ABOUT
        </button>
        <button
          type="button"
          className="site-nav-btn hover:opacity-85 transition-opacity"
          style={{ background: FOREST, color: CREAM, fontFamily: COND, fontWeight: 700, fontSize: 14, lineHeight: "24px", letterSpacing: "1.12px", borderRadius: 4, border: "none", padding: "10px 20px", cursor: "pointer", whiteSpace: "nowrap" }}
        >
          <span className="site-nav-long">VIEW </span>RESUME
        </button>
      </div>
    </nav>
  );
}
