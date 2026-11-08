import bg from "@/assets/prism-card/bg.png";
import screenshot from "@/assets/prism-card/screenshot.png";
import logo from "@/assets/prism-card/logo.png";
import { CraftEnterLabel, useCraftEnterCursor } from "./CraftEnterCursor";

const TAGS = [
  { label: "Agentic AI", color: "#16291d" },
  { label: "Non-Standard Utility Tool", color: "#1f3d2b" },
];

const FONT_SANS = "'Roboto', sans-serif";
const FONT_COND = "'Roboto Condensed', 'Roboto', sans-serif";

/**
 * My Craft face for Prism — Figma "Card Component Experiment" (912:57011).
 * Rest: product shot. Hover: teal veil, mark, HMW; ENTER follows the pointer.
 */
export function PrismCraftCard() {
  const { rootRef, enterRef } = useCraftEnterCursor();
  return (
    <div ref={rootRef} className="prism-craft">
      <img src={bg} alt="" className="prism-craft-bg" />

      <div className="prism-craft-tags">
        {TAGS.map((tag) => (
          <span
            key={tag.label}
            className="prism-craft-pill"
            style={{ fontFamily: FONT_SANS, fontWeight: 700, color: tag.color }}
          >
            {tag.label}
          </span>
        ))}
      </div>

      <span
        className="prism-craft-title-pill"
        style={{ fontFamily: FONT_COND, fontWeight: 700 }}
      >
        PRISM
      </span>

      <div className="prism-craft-panel">
        <div className="prism-craft-shot-wrap">
          <img src={screenshot} alt="" className="prism-craft-shot prism-craft-shot-fit" />
          <div className="prism-craft-veil" />
          <div className="prism-craft-copy">
            <div className="prism-craft-logo" aria-hidden>
              <img src={logo} alt="" />
            </div>
            <p
              className="prism-craft-hmw"
              style={{ fontFamily: FONT_SANS, fontWeight: 400 }}
            >
              How might an interface let reporters team with AI to sanitize and
              deliver sensitive information across tiers, while keeping the analyst
              in control?
            </p>
          </div>
        </div>
      </div>
      <CraftEnterLabel labelRef={enterRef} />
    </div>
  );
}
