import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import journeyBg from "@/assets/prism/journey-bg.png";
import journeyMapFull from "@/assets/prism/journey-map-full.png";

/* ───────────── User journey map: scroll-driven scene ─────────────
   Figma: "The idea for journey map" (node 783:42034), five states.

   State 1  Card 1280×480 with the map (1100 wide) tucked inside, 60.7px from the card's top, cut off at its bottom.
   State 2–5  As you scroll, the map slides UP and out past the top of the card (the card only cuts it at the bottom).
            The card behind it shrinks to 1126×422 (scale 0.88, radius 15 → 13.2) and darkens.
            The map keeps its 1100px width, so next to the smaller card it reads larger.
            The last state shows the whole map, its bottom edge 13px above the card's bottom edge.

   The scene pins the card in the viewport (position: sticky) for exactly as long as the map needs to travel, then
   releases it so the page carries on down to "Five pain points drove the work". */

const NAV_H = 66;

// Figma geometry (px, at the 1280px content width).
const HEADING_H = 110; // H1 (56) + gap (20) + paragraph (34) at the Figma width; measured live because the text can wrap
const HEADING_GAP = 20;
const CARD_H = 480;
const CARD_RADIUS = 15;
const MAP_W_RATIO = 1100 / 1280;
const MAP_ASPECT = 2082.3 / 1100; // full map height / width
const MAP_START_TOP = 60.7; // map top inside the card in state 1
const MAP_END_GAP = 13.1; // map bottom → card bottom in the last state
const CARD_SCALE_END = 1126 / 1280; // 0.8797
const SHRINK_DISTANCE = 615; // scroll distance over which the card shrinks (Figma state 1 → 3)

// Not drawn in Figma (described in words): how far the backdrop darkens.
const BG_DARK_MAX = 0.6;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (x: number) => x * x * (3 - 2 * x);

const stickyTopFor = (vh: number, stageH: number) => Math.max(NAV_H + 24, (vh - stageH + NAV_H) / 2);

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export function JourneyScrollScene({ heading, mapAlt }: { heading: ReactNode; mapAlt: string }) {
  const reduced = useReducedMotion();
  return reduced ? <StaticJourney heading={heading} mapAlt={mapAlt} /> : <ScrubbedJourney heading={heading} mapAlt={mapAlt} />;
}

/** Reduced motion: no pinning, just the full map on its backdrop. */
function StaticJourney({ heading, mapAlt }: { heading: ReactNode; mapAlt: string }) {
  return (
    <div className="flex flex-col gap-[20px] w-full">
      {heading}
      <div
        className="w-full"
        style={{
          borderRadius: CARD_RADIUS,
          backgroundImage: `url(${journeyBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: `${MAP_START_TOP}px 0 ${MAP_END_GAP}px`,
        }}
      >
        <img
          src={journeyMapFull}
          alt={mapAlt}
          className="block mx-auto"
          style={{ width: `${MAP_W_RATIO * 100}%`, height: "auto", borderRadius: 26, boxShadow: "0 2.14px 7.5px rgba(0,0,0,0.1)" }}
        />
      </div>
    </div>
  );
}

function ScrubbedJourney({ heading, mapAlt }: { heading: ReactNode; mapAlt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLImageElement>(null);

  const [vh, setVh] = useState(() => (typeof window === "undefined" ? 900 : window.innerHeight));
  const [width, setWidth] = useState(1280);
  const [headH, setHeadH] = useState(HEADING_H);

  // Distance the map travels = (map height) − (card geometry at the end). From Figma: 2082.3 − 377.3 ≈ 1705.
  const mapW = width * MAP_W_RATIO;
  const mapH = mapW * MAP_ASPECT;
  const cardBottomEnd = CARD_H / 2 + (CARD_H / 2) * CARD_SCALE_END;
  const total = Math.max(0, MAP_START_TOP + mapH - (cardBottomEnd - MAP_END_GAP));
  const cardTop = headH + HEADING_GAP;
  const stageH = cardTop + CARD_H;
  const stickyTop = stickyTopFor(vh, stageH);

  const totalRef = useRef(total);
  const stickyRef = useRef(stickyTop);
  totalRef.current = total;
  stickyRef.current = stickyTop;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const head = headingRef.current;
    const measure = () => {
      setWidth(el.clientWidth);
      if (head) setHeadH(head.offsetHeight);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (head) ro.observe(head);
    measure();
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      const container = containerRef.current;
      if (!container) return;
      const t = clamp(stickyRef.current - container.getBoundingClientRect().top, 0, totalRef.current);
      const q = smooth(clamp(t / SHRINK_DISTANCE, 0, 1));
      const scale = 1 - (1 - CARD_SCALE_END) * q;

      if (cardRef.current) cardRef.current.style.transform = `scale(${scale})`;
      if (darkRef.current) darkRef.current.style.opacity = String((BG_DARK_MAX * q).toFixed(3));
      // The map is only cut off at the card's (shrinking) bottom edge, never at the top.
      if (clipRef.current) clipRef.current.style.clipPath = `inset(-6000px -40px ${((CARD_H / 2) * (1 - scale)).toFixed(2)}px -40px)`;
      if (mapRef.current) mapRef.current.style.transform = `translate3d(-50%, ${(MAP_START_TOP - t).toFixed(2)}px, 0)`;
      if (headingRef.current) {
        headingRef.current.style.transform = `translate3d(0, ${(-t).toFixed(2)}px, 0)`;
        headingRef.current.style.opacity = String(clamp(1 - t / 90, 0, 1));
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [total, stickyTop]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: stageH + total }}>
      <div className="sticky w-full" style={{ top: stickyTop, height: stageH }}>
        <div ref={headingRef} className="absolute left-0 right-0 top-0 flex flex-col gap-[20px]" style={{ willChange: "transform, opacity" }}>
          {heading}
        </div>

        {/* Backdrop card: shrinks and darkens as the map scrolls out. */}
        <div
          ref={cardRef}
          className="absolute left-0 right-0 overflow-hidden"
          style={{ top: cardTop, height: CARD_H, borderRadius: CARD_RADIUS, willChange: "transform", background: "#10382f" }}
        >
          <img
            ref={bgRef}
            src={journeyBg}
            alt=""
            aria-hidden
            className="absolute block"
            style={{ left: "-6%", top: "-6%", width: "112%", height: "112%", maxWidth: "none", objectFit: "cover" }}
          />
          <div ref={darkRef} className="absolute inset-0" style={{ background: "#000", opacity: 0 }} />
          <div className="absolute inset-0 pointer-events-none" style={{ borderRadius: CARD_RADIUS, boxShadow: "inset 0 0 10px rgba(0,0,0,0.15)" }} />
        </div>

        {/* The map: same box as the card, but clipped only at the bottom so it can rise out of the top. */}
        <div
          ref={clipRef}
          className="absolute left-0 right-0 pointer-events-none"
          style={{ top: cardTop, height: CARD_H, zIndex: 10, clipPath: `inset(-6000px -40px 0px -40px)` }}
        >
          <img
            ref={mapRef}
            src={journeyMapFull}
            alt={mapAlt}
            className="absolute block"
            style={{
              left: "50%",
              top: 0,
              width: `${MAP_W_RATIO * 100}%`,
              maxWidth: "none",
              height: "auto",
              borderRadius: 26,
              boxShadow: "0 2.14px 7.5px rgba(0,0,0,0.1)",
              transform: `translate3d(-50%, ${MAP_START_TOP}px, 0)`,
              willChange: "transform",
            }}
          />
        </div>
      </div>
    </div>
  );
}
