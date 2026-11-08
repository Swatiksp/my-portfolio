import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent, ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { PROGRESS_BAR_HEIGHT } from "./SectionProgressBar";
import standardFlow from "@/assets/sdd/standard-sdd-cycle.png";
import compilerFlow from "@/assets/sdd/sdd-compiler-gating.png";

const NAV_H = 66;
const CHROME = NAV_H + PROGRESS_BAR_HEIGHT;
const T_START = 0;
const T_END = 1;

const BLUE = "#3dadff";
const GREEN = "#66d575";
const SANS = "'Roboto', sans-serif";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const stickyTopFor = (vh: number, stageH: number) =>
  CHROME + Math.max(12, (vh - CHROME - stageH) / 2);

function HandleGlyph() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
      <path d="M6 1.5 1.5 6 6 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 1.5 16.5 6 12 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Legend() {
  const items = [
    { color: BLUE, label: "Context compiler" },
    { color: GREEN, label: "Assumption gating" },
  ];
  return (
    <div className="flex items-center justify-center flex-wrap" style={{ gap: 20 }}>
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center" style={{ gap: 8 }}>
          <span
            aria-hidden
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: item.color,
            }}
          />
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: 13,
              lineHeight: "18px",
              color: "#000",
            }}
          >
            {item.label}
          </span>
        </span>
      ))}
    </div>
  );
}

export function SddLifecycleCompare({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const stickyRef = useRef(CHROME);
  const [t, setT] = useState(reduced ? 0.5 : T_START);
  const [frameW, setFrameW] = useState(0);
  const [stageH, setStageH] = useState(0);
  const [vh, setVh] = useState(() => (typeof window === "undefined" ? 900 : window.innerHeight));

  const stickyTop = stickyTopFor(vh, stageH);
  stickyRef.current = stickyTop;
  const travel = Math.max(vh * 1.15, 720);

  useEffect(() => {
    const frame = frameRef.current;
    const stage = stageRef.current;
    const measure = () => {
      if (frame) setFrameW(frame.clientWidth);
      if (stage) setStageH(stage.offsetHeight);
      setVh(window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (frame) ro.observe(frame);
    if (stage) ro.observe(stage);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      if (dragging.current) return;
      const pin = pinRef.current;
      if (!pin) return;
      const progressed = clamp((stickyRef.current - pin.getBoundingClientRect().top) / travel);
      setT(T_START + progressed * (T_END - T_START));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, travel]);

  const setFromClientX = (clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const r = frame.getBoundingClientRect();
    setT(clamp((clientX - r.left) / r.width, T_START, T_END));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    setFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setT((v) => clamp(v - 0.05, T_START, T_END));
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setT((v) => clamp(v + 0.05, T_START, T_END));
    }
  };

  const frame = (
    <div
      ref={frameRef}
      className="relative w-full select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="relative w-full overflow-hidden" style={{ background: "#fff", borderRadius: 15 }}>
        <img src={standardFlow} alt="Standard SDD lifecycle" className="block w-full h-auto" draggable={false} />
        <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${t * 100}%`, zIndex: 1 }}>
          <img
            src={compilerFlow}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute top-0 left-0 max-w-none h-full"
            style={{ width: frameW || undefined }}
          />
        </div>
      </div>
      <div
        role="slider"
        aria-label="Compare standard SDD lifecycle with compiler and gating"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(t * 100)}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="absolute top-0 bottom-0 z-[3] cursor-ew-resize"
        style={{ left: `${t * 100}%`, width: 48, marginLeft: -24, touchAction: "none" }}
      >
        <span className="absolute inset-y-0 left-1/2" style={{ width: 1, background: "#000", transform: "translateX(-50%)" }} />
        <span
          className="absolute top-1/2 left-1/2 flex items-center justify-center"
          style={{
            width: 40,
            height: 40,
            transform: "translate(-50%, -50%)",
            borderRadius: 999,
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.16)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.16)",
            color: "#000",
          }}
        >
          <HandleGlyph />
        </span>
      </div>
    </div>
  );

  const caption = (
    <p
      className="m-0 w-full text-center"
      style={{
        fontFamily: SANS,
        fontWeight: 400,
        fontSize: 13,
        lineHeight: "18px",
        color: "rgba(0,0,0,0.45)",
      }}
    >
      Scroll, or drag the handle, to see where the two ideas sit in the flow.
    </p>
  );

  const stage = (
    <div ref={stageRef} className="flex flex-col items-center w-full text-center" style={{ gap: 20 }}>
      {children}
      {frame}
      <Legend />
      {caption}
    </div>
  );

  if (reduced) {
    return <div className="w-full">{stage}</div>;
  }

  const ready = stageH > 0;

  return (
    <div ref={pinRef} className="relative w-full" style={{ height: ready ? stageH + travel : undefined }}>
      <div className="sticky w-full" style={{ top: stickyTop }}>
        {stage}
      </div>
    </div>
  );
}
