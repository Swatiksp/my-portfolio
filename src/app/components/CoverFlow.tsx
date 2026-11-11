import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

export type FlowItem = { src?: string; /** a black-and-white copy, for `greyBehind` (a filter on a tilting card costs far more than a cross-fade) */ greySrc?: string; label: string; /** CSS object-position for the crop, e.g. "50% 30%" */ focus?: string };

const photoStyle = (focus?: string): CSSProperties => ({
  position: "absolute",
  inset: 0,
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: focus,
  borderRadius: GLASS_RADIUS - GLASS_PAD,
});
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smoothstep = (x: number) => {
  const t = clamp(x, 0, 1);
  return t * t * (3 - 2 * t);
};

const TILT = 58; // degrees the neighbouring cards lean back
const FIRST = 0.7; // centre of the first neighbour, in card sizes from the front card
const STEP = 0.24; // each one after that
const RADIUS = 5;
const GLASS_PAD = 8; // the frame round each photo
const GLASS_RADIUS = 14; // outer corner; the photo inside is 7, so the two curves run parallel

/**
 * A cover flow, the same one that deals out the screens in the SpecTrim versions: the card in front faces you and the
 * ones before and after it lean back, close together, so you can see what comes next. `axis="y"` stacks them
 * vertically (the default), `axis="x"` lays them side by side. The wheel, a drag, the arrow keys, a click on a
 * neighbour or the dots move it; on its own it drifts on slowly until someone touches it.
 */
export function CoverFlow({
  items,
  axis = "y",
  label = "Photos",
  tone = "light",
  dots = true,
  greyBehind = false,
  glass = false,
  intro = false,
  className,
  style,
}: {
  items: FlowItem[];
  axis?: "x" | "y";
  label?: string;
  /** the colour of the dots: "light" on a dark ground, "dark" on a light one */
  tone?: "light" | "dark";
  /** the row of dots under the cards */
  dots?: boolean;
  /** the cards that are not in front fade to black and white, and take their colour back as they come forward */
  greyBehind?: boolean;
  /** a thin frosted-glass frame round each card, like the tiles on the homepage but lighter */
  glass?: boolean;
  /** the cards deal in when the flow first appears, from the middle outwards, like the letters of the type-in text */
  intro?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const n = items.length;
  const vertical = axis === "y";
  const stageRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const start = Math.floor((n - 1) / 2); // opens on the middle one, so there is something either side
  // the position `p` lives in a ref and is painted straight onto the cards, so a slide is not a React render per frame
  const [active, setActive] = useState(start);
  const activeRef = useRef(start);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const colourEls = useRef<(HTMLImageElement | null)[]>([]);
  const shadeEls = useRef<(HTMLDivElement | null)[]>([]);
  const paintRef = useRef<(pv: number) => void>(() => {});
  const target = useRef(start);
  const pRef = useRef(start);
  const raf = useRef(0);
  const snapTimer = useRef<number | undefined>(undefined);
  const drag = useRef<{ pos: number; p: number; moved: boolean } | null>(null);
  const auto = useRef({ on: true, hover: false, dir: 1 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // card size: about 0.62 of the stage along the flow, never wider than the stage across it
  const along = vertical ? box.h : box.w;
  const across = vertical ? box.w : box.h;
  const cardMain = Math.min(along * 0.62, across * (vertical ? 0.95 : 0.96));
  const Hc = vertical ? cardMain : cardMain;
  const Wc = vertical ? Math.min(cardMain * 1.05, box.w) : cardMain * 1.05;
  const size = vertical ? Hc : Wc; // the card's size along the flow

  const loop = useCallback(() => {
    const diff = target.current - pRef.current;
    if (Math.abs(diff) < 0.0008) {
      pRef.current = target.current;
      paintRef.current(pRef.current);
      raf.current = 0;
      return;
    }
    pRef.current += diff * 0.16;
    paintRef.current(pRef.current);
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

  const touched = useCallback(() => {
    auto.current.on = false;
  }, []);

  // drifts on by itself (back and forth) until someone uses it, and never while the pointer is over it
  useEffect(() => {
    if (n < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      const a = auto.current;
      if (!a.on || a.hover || document.hidden) return;
      const cur = Math.round(target.current);
      if (cur >= n - 1) a.dir = -1;
      if (cur <= 0) a.dir = 1;
      go(cur + a.dir);
    }, 3200);
    return () => window.clearInterval(t);
  }, [go, n]);

  // the wheel moves the flow while there is somewhere to go; at either end the page scrolls on as usual
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const d = vertical ? e.deltaY : Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
      if (!d) return;
      const room = d > 0 ? target.current < n - 1 - 0.01 : target.current > 0.01;
      if (!room) return;
      if (vertical) e.preventDefault();
      touched();
      go(target.current + clamp(d / 600, -0.6, 0.6));
      snap();
    };
    // A listener that can cancel the wheel makes the browser wait for the page before it scrolls, every time the pointer is
    // over the flow. The horizontal flow never needs to cancel it, so it listens passively and page scrolling stays on the
    // compositor.
    el.addEventListener("wheel", onWheel, { passive: !vertical });
    return () => el.removeEventListener("wheel", onWheel);
  }, [go, n, snap, touched, vertical]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const next = e.key === "ArrowDown" || e.key === "ArrowRight";
    const prev = e.key === "ArrowUp" || e.key === "ArrowLeft";
    if (!next && !prev) return;
    e.preventDefault();
    touched();
    go(Math.round(target.current) + (next ? 1 : -1));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-dot]")) return;
    drag.current = { pos: vertical ? e.clientY : e.clientX, p: target.current, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const delta = (vertical ? e.clientY : e.clientX) - d.pos;
    if (Math.abs(delta) > 6) {
      d.moved = true;
      touched();
    }
    if (d.moved) go(d.p - delta / (size * 0.7));
  };
  const onPointerUp = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    if (d.moved) go(Math.round(target.current));
  };

  const smoothDist = (i: number, pv: number) => Math.abs(i - pv);

  /** everything about a card that changes as the flow moves */
  const dyn = (i: number, pv: number): CSSProperties => {
    const d = i - pv;
    const a = Math.abs(d);
    const sign = d < 0 ? -1 : 1;
    const near = Math.min(a, 1);
    const dist = a <= 1 ? a * FIRST : FIRST + (a - 1) * STEP;
    const off = sign * dist * size;
    const tilt = sign * TILT * smoothstep(near);
    const back = -near * size * 0.3 - Math.max(a - 1, 0) * size * 0.08;
    const fade = a <= 3.2 ? 1 : clamp(1 - (a - 3.2) / 0.8, 0, 1);
    return {
      zIndex: 1000 - Math.round(a * 100) - (d < 0 ? 1 : 0),
      opacity: fade,
      transform: vertical
        ? `translate3d(0, ${off}px, ${back}px) rotateX(${tilt}deg)`
        : `translate3d(${off}px, 0, ${back}px) rotateY(${-tilt}deg)`,
      boxShadow: glass
        ? `0 0 0 1px rgba(0,0,0,0.07), ${a < 0.5 ? "0 14px 34px rgba(0,0,0,0.3)" : "0 8px 20px rgba(0,0,0,0.22)"}`
        : a < 0.5
          ? "0 14px 34px rgba(0,0,0,0.38)"
          : "0 8px 20px rgba(0,0,0,0.3)",
      // a card that has faded out is not painted at all
      visibility: fade === 0 ? "hidden" : "visible",
      // the glass cards carry no filter (a filter on a tilting 3D layer is re-done every frame); the others keep theirs
      filter: glass || fade === 0 ? "none" : `${greyBehind ? `grayscale(${smoothstep(a)}) ` : ""}brightness(${1 - 0.08 * Math.min(a, 2)})`,
      cursor: a < 0.5 ? "grab" : "pointer",
      willChange: fade === 0 ? "auto" : "transform",
    };
  };
  const colourOpacity = (i: number, pv: number) => (greyBehind ? 1 - smoothstep(smoothDist(i, pv)) : 1);
  const shadeOpacity = (i: number, pv: number) => 0.08 * Math.min(smoothDist(i, pv), 2);

  // writes a position straight onto the cards
  paintRef.current = (pv: number) => {
    for (let i = 0; i < n; i++) {
      const el = cardEls.current[i];
      if (el) Object.assign(el.style, dyn(i, pv));
      const img = colourEls.current[i];
      if (img) img.style.opacity = String(colourOpacity(i, pv));
      const shade = shadeEls.current[i];
      if (shade) shade.style.opacity = String(shadeOpacity(i, pv));
    }
    const act = clamp(Math.round(pv), 0, n - 1);
    if (act !== activeRef.current) {
      activeRef.current = act;
      setActive(act);
    }
  };

  const cardStyle = (i: number): CSSProperties => ({
    position: "absolute",
    left: "50%",
    top: "50%",
    width: Wc,
    height: Hc,
    marginLeft: -Wc / 2,
    marginTop: -Hc / 2,
    ...(glass
      ? {
          boxSizing: "border-box" as const,
          padding: GLASS_PAD,
          borderRadius: GLASS_RADIUS,
          background: "rgba(255,255,255,0.55)",
          border: "1px solid rgba(255,255,255,0.9)",
        }
      : { borderRadius: RADIUS, background: "#d9d9d9" }),
    // the glass cards clip nothing (each photo rounds its own corners): a clip mask on a tilting 3D layer is re-done every frame
    overflow: glass ? "visible" : "hidden",
    ...dyn(i, pRef.current),
  });

  return (
    <div
      ref={stageRef}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      className={`cover-flow${className ? ` ${className}` : ""}`}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onMouseEnter={() => (auto.current.hover = true)}
      onMouseLeave={() => (auto.current.hover = false)}
      onFocus={() => (auto.current.hover = true)}
      onBlur={() => (auto.current.hover = false)}
      style={{
        perspective: size * 3.4 || undefined,
        perspectiveOrigin: "50% 50%",
        touchAction: vertical ? "pan-x" : "pan-y",
        outline: "none",
        ...style,
      }}
    >
      {box.w > 0 &&
        items.map((it, i) => (
          <div
            key={it.label + i}
            ref={(el) => {
              cardEls.current[i] = el;
            }}
            className={intro ? "flow-card-in" : undefined}
            style={intro ? ({ ...cardStyle(i), ["--in-delay" as string]: `${200 + Math.abs(i - start) * 80}ms` } as CSSProperties) : cardStyle(i)}
            aria-hidden={i !== active}
            onClick={() => {
              if (drag.current?.moved || i === active) return;
              touched();
              go(i);
            }}
          >
            {glass ? (
              <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: GLASS_RADIUS - GLASS_PAD, background: "#d9d9d9" }}>
                {it.src && (
                  <>
                    {greyBehind && it.greySrc && <img src={it.greySrc} alt="" draggable={false} decoding="async" style={photoStyle(it.focus)} />}
                    <img
                      ref={(el) => {
                        colourEls.current[i] = el;
                      }}
                      src={it.src}
                      alt={it.label}
                      draggable={false}
                      decoding="async"
                      style={{ ...photoStyle(it.focus), opacity: greyBehind && it.greySrc ? colourOpacity(i, pRef.current) : 1 }}
                    />
                  </>
                )}
                {/* the cards behind sit a little darker: an overlay, which is cheap, instead of a brightness filter */}
                <div
                  ref={(el) => {
                    shadeEls.current[i] = el;
                  }}
                  style={{ position: "absolute", inset: 0, borderRadius: GLASS_RADIUS - GLASS_PAD, background: "#000", opacity: shadeOpacity(i, pRef.current), pointerEvents: "none" }}
                />
              </div>
            ) : (
              <div style={{ width: "100%", height: "100%", overflow: "hidden", background: "#d9d9d9" }}>
                {it.src ? (
                  <img src={it.src} alt={it.label} draggable={false} decoding="async" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: it.focus }} />
                ) : (
                  <div
                    className="flex items-center justify-center"
                    style={{ width: "100%", height: "100%", fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "rgba(0,0,0,0.38)", letterSpacing: "0.04em" }}
                  >
                    {it.label}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

      {/* where you are, and a way to jump */}
      {dots && (
      <div
        className="flex"
        style={{
          position: "absolute",
          zIndex: 2000,
          ...(vertical
            ? { right: 0, top: "50%", transform: "translateY(-50%)", flexDirection: "column", gap: 8 }
            : { bottom: -26, left: "50%", transform: "translateX(-50%)", flexDirection: "row", gap: 8 }),
        }}
      >
        {items.map((it, i) => (
          <button
            key={it.label + i}
            type="button"
            data-dot
            aria-label={`Show ${it.label}`}
            aria-current={i === active}
            onClick={() => {
              touched();
              go(i);
            }}
            style={{
              width: 7,
              height: 7,
              padding: 0,
              border: "none",
              borderRadius: 999,
              background: tone === "dark" ? (i === active ? "#000" : "rgba(0,0,0,0.22)") : i === active ? "#fff" : "rgba(255,255,255,0.38)",
              cursor: "pointer",
              transition: "background 200ms ease",
            }}
          />
        ))}
      </div>
      )}
    </div>
  );
}
