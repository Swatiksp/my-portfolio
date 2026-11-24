import { useEffect, useState } from "react";

const read = () => (typeof window === "undefined" ? 900 : window.innerHeight);
const isTouch = () => typeof window !== "undefined" && !!window.matchMedia?.("(hover: none)").matches;

/** Share of the device's full height that is on screen with the browser toolbars showing (iPhone 15: 659 of 852). */
const SMALL_SHARE = 0.77;

/** The device's full screen height in the current orientation, which never changes while you scroll. */
function deviceHeight() {
  const { width, height } = window.screen;
  const long = Math.max(width, height);
  const short = Math.min(width, height);
  const dev = window.innerWidth <= window.innerHeight ? long : short;
  // a screen size that cannot be this window's (an emulator, a desktop monitor) is ignored
  return dev >= window.innerHeight && dev <= window.innerHeight * 1.5 ? dev : window.innerHeight;
}

/**
 * Viewport heights for scroll-pinned scenes.
 *
 * On a phone the browser toolbar slides in and out while you scroll, which changes window.innerHeight. A scene
 * that sizes itself from it changes the height of the page above what you are reading, and the page jumps
 * (sections skip). So on touch devices both values come from the device's screen, not from innerHeight, and do
 * not change while scrolling: `tall` is the full screen (for lengths such as the scroll distance) and `small`
 * is the share that is visible with the toolbars showing (for centring a pinned stage so it never sits low or
 * runs under the bottom bar). They are recomputed only when the width changes (rotation).
 * On desktop both are the live window height.
 */
export function useViewportRange() {
  const [range, setRange] = useState(() => {
    const h = read();
    return { tall: h, small: h };
  });
  useEffect(() => {
    let w = window.innerWidth;
    const compute = () => {
      if (!isTouch()) {
        const h = read();
        return { tall: h, small: h };
      }
      const tall = deviceHeight();
      return { tall, small: Math.round(tall * SMALL_SHARE) };
    };
    const set = (next: { tall: number; small: number }) => setRange((r) => (r.tall === next.tall && r.small === next.small ? r : next));
    set(compute());
    const on = () => {
      if (isTouch() && window.innerWidth === w) return; // a toolbar moving, not a rotation
      w = window.innerWidth;
      set(compute());
    };
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return range;
}

/** The full-screen height (see useViewportRange). */
export function useStableVh() {
  return useViewportRange().tall;
}
