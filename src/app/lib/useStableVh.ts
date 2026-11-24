import { useEffect, useState } from "react";

const read = () => (typeof window === "undefined" ? 900 : window.innerHeight);
const isTouch = () => typeof window !== "undefined" && !!window.matchMedia?.("(hover: none)").matches;

/**
 * window.innerHeight for sizing scroll-pinned scenes. On a phone the browser toolbar slides in and out while
 * you scroll, which changes innerHeight; scenes that size their scroll length from it then grow and shrink
 * under the reader and the page jumps. On touch devices this keeps the tallest height seen, and only resets
 * when the width changes (a rotation).
 */
export function useStableVh() {
  const [vh, setVh] = useState(read);
  useEffect(() => {
    let w = window.innerWidth;
    const on = () => {
      if (!isTouch()) return setVh(read());
      if (window.innerWidth !== w) {
        w = window.innerWidth;
        setVh(read());
      } else {
        setVh((prev) => Math.max(prev, read()));
      }
    };
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return vh;
}
