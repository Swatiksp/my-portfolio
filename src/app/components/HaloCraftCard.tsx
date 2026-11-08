import bg from "@/assets/halo-card/bg.png";
import logo from "@/assets/halo-card/logo.svg";
import screenshot from "@/assets/halo/screens/v201.png";
import { CraftEnterLabel, useCraftEnterCursor } from "./CraftEnterCursor";

const TAGS = [
  { label: "Generative AI", color: "#1a243d" },
  { label: "AI presentation tool", color: "#1f2a47" },
];

const FONT_SANS = "'Roboto', sans-serif";
const FONT_COND = "'Roboto Condensed', 'Roboto', sans-serif";

/**
 * My Craft face for Halo Conversations — same layout as Prism's card.
 * Rest: launch-page shot on the blue-purple flow. Hover: navy veil, Halo lockup, HMW; ENTER follows the pointer.
 */
export function HaloCraftCard() {
  const { rootRef, enterRef } = useCraftEnterCursor();
  return (
    <div ref={rootRef} className="prism-craft halo-craft">
      <img src={bg} alt="" className="prism-craft-bg halo-craft-bg" />

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

      <span className="prism-craft-title-pill" style={{ fontFamily: FONT_COND, fontWeight: 700 }}>
        HALO CONVERSATIONS
      </span>

      <div className="prism-craft-panel">
        <div className="prism-craft-shot-wrap">
          <img src={screenshot} alt="" className="prism-craft-shot" />
          <div className="prism-craft-veil" />
          <div className="prism-craft-copy">
            <div className="halo-craft-logo" aria-hidden>
              <img src={logo} alt="" />
            </div>
            <p className="prism-craft-hmw" style={{ fontFamily: FONT_SANS, fontWeight: 400 }}>
              How might Copilot turn a client conversation into a tailored deck without leaving
              Microsoft’s stack?
            </p>
          </div>
        </div>
      </div>
      <CraftEnterLabel labelRef={enterRef} />
    </div>
  );
}
