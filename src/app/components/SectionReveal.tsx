import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { CSSProperties, ElementType, ReactNode } from "react";
import { PROGRESS_BAR_HEIGHT } from "./SectionProgressBar";

const NAV_H = 66;

type FocusCtxValue = {
  focused: number;
  register: (index: number, el: HTMLElement | null) => void;
  focusOn: (index: number) => void;
};

export const FocusCtx = createContext<FocusCtxValue>({ focused: -1, register: () => {}, focusOn: () => {} });

export function SectionFocusProvider({ children }: { children: ReactNode }) {
  const els = useRef(new Map<number, HTMLElement>());
  const focusedRef = useRef(0);
  const [focused, setFocused] = useState(0);

  const register = useCallback((index: number, el: HTMLElement | null) => {
    if (el) els.current.set(index, el);
    else els.current.delete(index);
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = NAV_H + PROGRESS_BAR_HEIGHT + (window.innerHeight - NAV_H - PROGRESS_BAR_HEIGHT) / 2;
      let best = -1;
      let bestDist = Infinity;
      els.current.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const dist = line < r.top ? r.top - line : line > r.bottom ? line - r.bottom : 0;
        if (dist < bestDist || (dist === bestDist && i < best)) {
          best = i;
          bestDist = dist;
        }
      });
      if (best >= 0 && best !== focusedRef.current) {
        focusedRef.current = best;
        setFocused(best);
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const focusOn = useCallback((index: number) => {
    focusedRef.current = index;
    setFocused(index);
  }, []);

  return <FocusCtx.Provider value={{ focused, register, focusOn }}>{children}</FocusCtx.Provider>;
}

export function Focus({
  index,
  as: Comp = "div",
  className,
  style,
  children,
}: {
  index: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const { register } = useContext(FocusCtx);
  // Everything below the opening section mounts a moment after the page is up, one section at a time, so
  // opening a case study paints the hero straight away instead of building the whole page in one frame.
  const [ready, setReady] = useState(() => index <= 0 || (typeof window !== "undefined" && window.scrollY > 200));
  useEffect(() => {
    if (ready) return;
    const id = window.setTimeout(() => setReady(true), 500 + index * 120);
    return () => window.clearTimeout(id);
  }, [ready, index]);
  const ref = useCallback(
    (el: HTMLElement | null) => {
      register(index, el);
    },
    [register, index],
  );
  return (
    <Comp
      ref={ref}
      className={className}
      data-focus-section={index}
      style={ready ? style : { ...style, minHeight: 480 }}
    >
      {ready ? children : null}
    </Comp>
  );
}

/** Plain text. The scroll-linked letter fade has been removed. */
export function LensDrift({ text }: { text: string }) {
  return <>{text}</>;
}

export function revealText(children: ReactNode) {
  return children;
}
