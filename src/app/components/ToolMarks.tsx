import type { CSSProperties } from "react";
import cursor from "@/assets/tools/cursor.png";
import claude from "@/assets/tools/claude.png";
import figma from "@/assets/tools/figma.png";

/** "Made using" + the logo marks (no wordmarks) of the tools this site was built with, drawn in one flat colour. */
const MARKS = [
  { name: "Cursor", src: cursor },
  { name: "Claude", src: claude },
  { name: "Figma", src: figma },
];

export function ToolMarks({
  size,
  color,
  gap = 18,
  labelSize = 13,
  fontFamily,
  style,
}: {
  size: number;
  color: string;
  gap?: number;
  labelSize?: number;
  fontFamily?: string;
  style?: CSSProperties;
}) {
  return (
    <div className="flex flex-col items-center justify-center" style={{ gap: 8, color, ...style }} aria-label="Made using Cursor, Claude and Figma">
      <span style={{ fontFamily, fontSize: labelSize, color, whiteSpace: "nowrap", lineHeight: 1 }}>Made using</span>
      <div className="flex items-center justify-center" style={{ gap }}>
        {MARKS.map(({ name, src }) => (
          <span
            key={name}
            title={name}
            role="img"
            aria-label={name}
            className="shrink-0"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              WebkitMaskImage: `url("${src}")`,
              maskImage: `url("${src}")`,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              WebkitMaskSize: "contain",
              maskSize: "contain",
            }}
          />
        ))}
      </div>
    </div>
  );
}
