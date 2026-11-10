import { memo } from "react";
import { useReducedMotion } from "motion/react";

const MAX_STEP = 9; // ms between letters
const MAX_LINE = 600; // a long line never takes more than this to type

const stepFor = (text: string) => Math.min(MAX_STEP, MAX_LINE / Math.max(1, text.length));

/** How long a line takes to finish typing, so the next line can start right after it. */
export function typeDuration(text: string) {
  return text.length * stepFor(text) + 340;
}

/**
 * Text that types in left to right. Each letter grows from a small, clipped shape on its baseline
 * (see `type-char` in index.css). `start` is the delay in ms before the first letter.
 */
export const TypeIn = memo(function TypeIn({ text, start = 0 }: { text: string; start?: number }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{text}</>;
  const step = stepFor(text);
  let i = 0;
  return (
    <span aria-label={text}>
      {text.split(" ").map((word, w, all) => (
        <span key={w} aria-hidden style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {Array.from(word).map((ch, c) => (
            <span key={c} className="type-char" style={{ animationDelay: `${start + i++ * step}ms` }}>
              {ch}
            </span>
          ))}
          {w < all.length - 1 ? (i++, " ") : null}
        </span>
      ))}
    </span>
  );
});
