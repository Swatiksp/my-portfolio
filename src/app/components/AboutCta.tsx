import type { CSSProperties } from "react";

/**
 * The ABOUT ME button with a pointer glyph (Yarndings 12) that keeps gliding in, pressing it and leaving, as if a cursor
 * were clicking it. While the real pointer is over the button the glyph steps aside.
 */
export function AboutCta({
  buttonStyle,
  dark,
  onHoverChange,
  onClick,
  glyphSize = 24,
}: {
  buttonStyle: CSSProperties;
  dark: boolean;
  onHoverChange?: (hovered: boolean) => void;
  onClick?: () => void;
  glyphSize?: number;
}) {
  return (
    <span className="about-cta" onMouseEnter={() => onHoverChange?.(true)} onMouseLeave={() => onHoverChange?.(false)}>
      <button type="button" onClick={onClick} className="about-cta-btn hover:opacity-85 transition-opacity" style={buttonStyle}>
        ABOUT ME
      </button>
      <span aria-hidden className="about-cta-glyph" style={{ fontSize: glyphSize }}>
        <svg viewBox="0 0 18 22" width="1em" height="1.22em" style={{ display: "block", overflow: "visible" }}>
          <path
            d="M3 2 L3 17 L6.6 13.6 L9.4 19.8 L11.9 18.7 L9.2 12.6 L14 12.6 Z"
            fill={dark ? "#ffffff" : "#000000"}
            stroke={dark ? "#000000" : "#ffffff"}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </span>
  );
}
