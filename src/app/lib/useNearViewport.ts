import { useEffect, useState, type RefObject } from "react";

/**
 * True once the element has come within `margin` of the viewport (and stays true). Used to hold back heavy media until
 * a section is about to be seen: Safari starts downloading everything it is given up front, so each video and carousel
 * image only gets its source when it is near.
 */
export function useNearViewport(ref: RefObject<Element | null>, margin = "1200px 0px") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (near) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near, margin, ref]);
  return near;
}
