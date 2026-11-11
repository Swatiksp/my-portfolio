import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useIsMobile } from "../lib/useIsMobile";
import { createPortal } from "react-dom";

const SANS = "'Roboto', sans-serif";

export type VersionScreen = { src: string; label: string };

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/* ------------------------------------------------------------------ */
/* The overlay: a vertical cover flow, fixed over the page and anchored */
/* to the thumbnail that was hovered. The screen in front faces you;    */
/* the ones before and after it lean back above and below, close       */
/* together, so you can see what comes next. Scrolling slides the flow  */
/* along. The scroll bar (black thumb, light grey track) sits beside    */
/* the flow, clear of every card.                                       */
/* ------------------------------------------------------------------ */

// one small radius for the thumbnail and every screen in the flow, so no corner cuts into the content
const CARD_RADIUS = 5;
const BAR_W = 7;
const BAR_GAP = 18;
const TILT = 58; // degrees the neighbouring screens lean back
const FIRST = 0.64; // centre of the first neighbour, in screen heights from the front screen
const STEP = 0.12; // each one after that
const REACH = 0.98; // screen heights from the front screen's centre to the outer edge of the flow

function Overlay({
  screens,
  anchor,
  shown,
  onEnter,
  onLeave,
  onClose,
}: {
  screens: VersionScreen[];
  anchor: DOMRect;
  shown: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClose: () => void;
}) {
  const n = screens.length;
  const regionRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0); // which screen is in front, as a float
  const target = useRef(0);
  const pRef = useRef(0);
  const raf = useRef(0);
  const snapTimer = useRef<number | undefined>(undefined);
  const drag = useRef<{ y: number; p: number } | null>(null);
  const [vw, setVw] = useState(window.innerWidth);

  useEffect(() => {
    const on = () => setVw(window.innerWidth);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  /* The screen in front is exactly the thumbnail it sits on: same position, same size, same corners. */
  const Wc = anchor.width;
  const Hc = anchor.height;
  const reach = REACH * Hc;
  const barLeft = anchor.left + Wc / 2 < vw / 2; // the bar goes on the outer side
  const pad = 10;
  const side = BAR_GAP + BAR_W;
  // A phone has no room beside the screen for the bar: it is dropped, and the flow is swiped instead.
  const phone = Math.min(anchor.left, vw - (anchor.left + Wc)) < side + pad;
  const sideW = phone ? 0 : side;
  const regionLeft = anchor.left - pad - (barLeft ? sideW : 0);
  const regionTop = anchor.top + Hc / 2 - reach - pad;
  const regionW = Wc + sideW + pad * 2;
  const regionH = reach * 2 + pad * 2 + 40;
  const flowX = pad + (barLeft ? sideW : 0); // left edge of the front screen inside the region
  const frontTop = pad + reach - Hc / 2; // top edge of the front screen inside the region

  /* ease the flow toward its target */
  const loop = useCallback(() => {
    const diff = target.current - pRef.current;
    if (Math.abs(diff) < 0.0008) {
      pRef.current = target.current;
      setP(pRef.current);
      raf.current = 0;
      return;
    }
    pRef.current += diff * 0.16;
    setP(pRef.current);
    raf.current = requestAnimationFrame(loop);
  }, []);
  const go = useCallback(
    (to: number) => {
      target.current = clamp(to, 0, n - 1);
      if (!raf.current) raf.current = requestAnimationFrame(loop);
    },
    [loop, n],
  );
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const snap = useCallback(() => {
    if (snapTimer.current) window.clearTimeout(snapTimer.current);
    snapTimer.current = window.setTimeout(() => go(Math.round(target.current)), 140);
  }, [go]);

  // the wheel slides the flow; the page stays still while the pointer is on it
  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      go(target.current + clamp(e.deltaY / 600, -0.6, 0.6));
      snap();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [go, snap]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        go(Math.round(target.current) + 1);
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        go(Math.round(target.current) - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  /* scroll bar: the height of the front screen, beside it, a translucent grey thumb */
  const trackH = Hc;
  const thumbH = Math.max(24, trackH * 0.34);
  const thumbTop = n > 1 ? (p / (n - 1)) * (trackH - thumbH) : 0;
  const onThumbDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    drag.current = { y: e.clientY, p: target.current };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onThumbMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    go(drag.current.p + ((e.clientY - drag.current.y) / (trackH - thumbH)) * (n - 1));
  };
  const onThumbUp = () => {
    if (!drag.current) return;
    drag.current = null;
    go(Math.round(target.current));
  };
  // phone: drag anywhere on the flow to move through the screens
  const swipe = useRef<{ y: number; p: number } | null>(null);
  const onSwipeDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!phone || (e.target as HTMLElement).closest(".version-close")) return;
    swipe.current = { y: e.clientY, p: target.current };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onSwipeMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!swipe.current) return;
    go(swipe.current.p - (e.clientY - swipe.current.y) / (Hc * 0.7));
  };
  const onSwipeUp = () => {
    if (!swipe.current) return;
    swipe.current = null;
    go(Math.round(target.current));
  };
  const onTrackDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    go(Math.round(((e.clientY - r.top - thumbH / 2) / (trackH - thumbH)) * (n - 1)));
  };

  /* One screen, placed by its distance d from the front (negative = already passed).
     Every screen is flat and ordered by z-index (nearer the front = higher), so two screens
     can overlap but never cut through each other. Neighbours lean back with the edge nearest
     the front screen farthest away, so they tuck in behind it. */
  const cardStyle = (i: number): React.CSSProperties => {
    const d = i - p;
    const a = Math.abs(d);
    const sign = d < 0 ? -1 : 1;
    const near = Math.min(a, 1);
    const dist = a <= 1 ? a * FIRST : FIRST + (a - 1) * STEP;
    const y = sign * dist * Hc;
    const tilt = sign * TILT * smoothstep(near);
    const back = -near * Hc * 0.35 - Math.max(a - 1, 0) * Hc * 0.1;
    const fade = a <= 2.2 ? 1 : clamp(1 - (a - 2.2) / 0.8, 0, 1);
    return {
      position: "absolute",
      left: 0,
      top: 0,
      width: Wc,
      height: Hc,
      // strictly ordered by distance from the front; a tiny sign term settles ties
      zIndex: 1000 - Math.round(a * 100) - (d < 0 ? 1 : 0),
      opacity: fade,
      transform: `translate3d(0, ${y}px, ${back}px) rotateX(${tilt}deg)`,
      transformOrigin: "50% 50%",
      borderRadius: CARD_RADIUS,
      overflow: "hidden",
      background: "#fff",
      boxShadow: a < 0.5 ? "0 14px 34px rgba(0,0,0,0.28)" : "0 8px 20px rgba(0,0,0,0.22)",
      filter: `brightness(${1 - 0.08 * Math.min(a, 2)})`,
      pointerEvents: "none",
      willChange: "transform",
    };
  };

  const active = clamp(Math.round(p), 0, n - 1);

  return (
    <>
      {/* a light veil and a soft blur, so the focus is on the flow without hiding the page */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 90,
          pointerEvents: "none",
          background: "rgba(0,0,0,0.16)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          opacity: shown ? 1 : 0,
          transition: "opacity 260ms ease",
        }}
      />
      <div
        ref={regionRef}
        role="dialog"
        aria-label="All screens in this version"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onPointerDown={onSwipeDown}
        onPointerMove={onSwipeMove}
        onPointerUp={onSwipeUp}
        onPointerCancel={onSwipeUp}
        style={{
          position: "fixed",
          zIndex: 100,
          left: regionLeft,
          top: regionTop,
          width: regionW,
          height: regionH,
          opacity: shown ? 1 : 0,
          transition: "opacity 260ms ease",
          touchAction: phone ? "none" : undefined,
        }}
      >
        {/* the flow: perspective is centred on the front screen */}
        <div
          style={{
            position: "absolute",
            left: flowX,
            top: frontTop,
            width: Wc,
            height: Hc,
            perspective: Hc * 3.4,
            perspectiveOrigin: "50% 50%",
          }}
        >
          {screens.map((sc, i) => (
            <div key={sc.src} style={cardStyle(i)}>
              <img src={sc.src} alt={sc.label} width={1280} height={1000} draggable={false} style={{ display: "block", width: "100%", height: "100%" }} />
            </div>
          ))}
        </div>

        {/* scroll bar: as tall as the front screen, beside it, never over a screen */}
        <div
          onPointerDown={onTrackDown}
          style={{
            position: "absolute",
            left: barLeft ? pad : flowX + Wc + BAR_GAP,
            top: frontTop,
            width: BAR_W,
            height: trackH,
            borderRadius: 10,
            background: "rgba(255,255,255,0.38)",
            cursor: "pointer",
            display: phone ? "none" : undefined,
          }}
        >
          <div
            onPointerDown={onThumbDown}
            onPointerMove={onThumbMove}
            onPointerUp={onThumbUp}
            onPointerCancel={onThumbUp}
            style={{
              position: "absolute",
              left: 0,
              top: thumbTop,
              width: BAR_W,
              height: thumbH,
              borderRadius: 10,
              background: "rgba(96,96,96,0.72)",
              cursor: "grab",
              touchAction: "none",
            }}
          />
        </div>

        <p
          style={{
            position: "absolute",
            left: flowX,
            top: pad + reach * 2 + 10,
            width: Wc,
            margin: 0,
            fontFamily: SANS,
            fontSize: 13,
            lineHeight: "18px",
            textAlign: "center",
            color: "#fff",
            textShadow: "0 1px 6px rgba(0,0,0,0.5)",
          }}
        >
          {active + 1} of {n} · {screens[active].label}
          {phone ? " · swipe" : ""}
        </p>

        {/* for touch, where there is no hover to leave */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="version-close"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 28,
            height: 28,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.5)",
            background: "rgba(0,0,0,0.45)",
            color: "#fff",
            fontSize: 16,
            lineHeight: "24px",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>
      <style>{`.version-close{display:none}@media (hover:none){.version-close{display:block}}`}</style>
    </>
  );
}

const smoothstep = (x: number) => {
  const t = clamp(x, 0, 1);
  return t * t * (3 - 2 * t);
};

/** A thumbnail of one version. Hovering it deals out all of that version's screens over the page. */
export function VersionPreview({
  title,
  caption,
  screens,
  thumbIndex = 0,
}: {
  title: string;
  caption: string;
  screens: VersionScreen[];
  thumbIndex?: number;
}) {
  const id = useId();
  const verb = useIsMobile() ? "Tap" : "Hover";
  const thumbRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const over = useRef({ thumb: false, deck: false });
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const unmountTimer = useRef<number | undefined>(undefined);
  const openRef = useRef(false);
  const startY = useRef(0);

  const open = useCallback(() => {
    if (openRef.current || !thumbRef.current) return;
    openRef.current = true;
    window.dispatchEvent(new CustomEvent("version-overlay", { detail: id }));
    if (unmountTimer.current) window.clearTimeout(unmountTimer.current);
    startY.current = window.scrollY;
    setAnchor(thumbRef.current.getBoundingClientRect());
    setMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
  }, [id]);

  const close = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setShown(false);
    unmountTimer.current = window.setTimeout(() => setMounted(false), 300);
  }, []);

  const settle = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    if (!over.current.thumb && !over.current.deck) closeTimer.current = window.setTimeout(close, 160);
  }, [close]);

  useEffect(() => {
    const onOther = (e: Event) => {
      if ((e as CustomEvent).detail !== id) close();
    };
    window.addEventListener("version-overlay", onOther);
    return () => window.removeEventListener("version-overlay", onOther);
  }, [close, id]);

  // the deck is fixed to the screen, so scrolling the page away puts it away
  useEffect(() => {
    if (!mounted) return;
    const onScroll = () => Math.abs(window.scrollY - startY.current) > 40 && close();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted, close]);

  return (
    <figure className="m-0 w-full" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <button
        ref={thumbRef}
        type="button"
        onMouseEnter={() => {
          over.current.thumb = true;
          if (closeTimer.current) window.clearTimeout(closeTimer.current);
        }}
        // open on real pointer movement, so a page that scrolls under a resting pointer does not trigger it
        onMouseMove={() => {
          if (openRef.current || openTimer.current) return;
          openTimer.current = window.setTimeout(() => {
            openTimer.current = undefined;
            if (over.current.thumb) open();
          }, 70);
        }}
        onMouseLeave={() => {
          over.current.thumb = false;
          if (openTimer.current) {
            window.clearTimeout(openTimer.current);
            openTimer.current = undefined;
          }
          settle();
        }}
        onFocus={open}
        onBlur={() => {
          over.current.thumb = false;
          settle();
        }}
        onClick={() => (openRef.current ? close() : open())}
        aria-label={`Show all ${screens.length} screens of ${title}`}
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          padding: 0,
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: CARD_RADIUS,
          overflow: "hidden",
          background: "#fff",
          cursor: "default",
        }}
      >
        <img
          src={screens[thumbIndex].src}
          alt={`${title}: ${screens[thumbIndex].label}`}
          width={1280}
          height={1000}
          loading="lazy"
          draggable={false}
          style={{ display: "block", width: "100%", height: "auto" }}
        />
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: 12,
            bottom: 12,
            padding: "6px 12px",
            borderRadius: 999,
            background: "rgba(236,236,236,0.8)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            border: "1px solid rgba(0,0,0,0.06)",
            color: "rgba(0,0,0,0.72)",
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {verb} to see {screens.length} screens
        </span>
      </button>
      <figcaption style={{ fontFamily: SANS, fontSize: 13, lineHeight: "18px", color: "rgba(0,0,0,0.5)", textAlign: "center" }}>
        {caption}
      </figcaption>
      {mounted &&
        anchor &&
        typeof document !== "undefined" &&
        createPortal(
          <Overlay
            screens={screens}
            anchor={anchor}
            shown={shown}
            onClose={close}
            onEnter={() => {
              over.current.deck = true;
              if (closeTimer.current) window.clearTimeout(closeTimer.current);
            }}
            onLeave={() => {
              over.current.deck = false;
              settle();
            }}
          />,
          document.body,
        )}
    </figure>
  );
}
