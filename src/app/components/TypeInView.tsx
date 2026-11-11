import { useEffect, useRef, useState } from "react";
import { TypeIn } from "./TypeIn";

/**
 * `TypeIn` that waits until the line is on screen before it starts typing, so text further down a page types in as you
 * reach it instead of finishing before anyone sees it. `start` is the delay in ms once it is in view.
 */
export function TypeInView({ text, start = 0 }: { text: string; start?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className={seen ? undefined : "type-hold"}>
      <TypeIn text={text} start={start} />
    </span>
  );
}
