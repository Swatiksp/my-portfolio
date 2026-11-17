import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useIsMobile } from "../lib/useIsMobile";

const SANS = "'Roboto', sans-serif";

/**
 * A figure that opens larger on click. Big diagrams (the mind map, the maps, the flows) are too
 * detailed to read inline, so the page shows them at page width and the viewer can open them.
 * In the viewer, click the image to switch between "fit to screen" and full size.
 */
export function ExpandableImage({
  src,
  alt,
  width,
  height,
  caption,
  radius = 10,
  svgSrc,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  radius?: number;
  /** A vector version of the figure. When given, the viewer opens it with zoom and pan instead of the flat image. */
  svgSrc?: string;
}) {
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);
  const verb = useIsMobile() ? "Tap" : "Click";

  useEffect(() => {
    if (!open || svgSrc) return; // the zoom viewer handles its own keys and scroll lock
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, svgSrc]);

  const close = () => {
    setOpen(false);
    setFull(false);
  };

  return (
    <figure className="m-0 w-full" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open larger: ${alt}`}
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          padding: 0,
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: radius,
          overflow: "hidden",
          background: "#fff",
          cursor: "zoom-in",
        }}
      >
        <img decoding="async"
          src={src}
          alt={alt}
          width={width}
          height={height}
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
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: 999,
            background: "rgba(236,236,236,0.8)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            border: "1px solid rgba(0,0,0,0.06)",
            color: "rgba(0,0,0,0.72)",
            fontFamily: SANS,
            fontSize: "var(--fs-label, 12px)",
            fontWeight: 500,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M7 1h4v4M5 11H1V7M11 1 7.5 4.5M1 11l3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {verb} to enlarge
        </span>
      </button>
      {caption && (
        <figcaption style={{ fontFamily: SANS, fontSize: "var(--fs-sec, 13px)", lineHeight: "var(--lh-sec, 18px)", color: "rgba(0,0,0,0.5)", textAlign: "center" }}>
          {caption}
        </figcaption>
      )}

      {open && typeof document !== "undefined" && svgSrc && (
        <MapViewer src={svgSrc} preview={src} alt={alt} width={width} height={height} onClose={close} />
      )}
      {open &&
        !svgSrc &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onClick={close}
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(8,8,8,0.92)", display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                padding: "14px 20px",
                fontFamily: SANS,
                color: "#fff",
                fontSize: "var(--fs-sec, 13px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <span style={{ color: "rgba(255,255,255,0.65)" }}>{full ? `${verb} the image to fit the screen` : `${verb} the image for full size`}</span>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.3)",
                  background: "transparent",
                  color: "#fff",
                  fontFamily: SANS,
                  fontSize: "var(--fs-sec, 13px)",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
            <div style={{ flex: 1, minHeight: 0, overflow: "auto", display: "flex", justifyContent: "center", alignItems: full ? "flex-start" : "center", padding: "0 20px 20px" }}>
              <img decoding="async"
                src={src}
                alt={alt}
                draggable={false}
                onClick={(e) => {
                  e.stopPropagation();
                  setFull((f) => !f);
                }}
                style={
                  full
                    ? { display: "block", width, height, maxWidth: "none", cursor: "zoom-out", background: "#fff" }
                    : { display: "block", maxWidth: "100%", maxHeight: "100%", objectFit: "contain", cursor: "zoom-in", background: "#fff" }
                }
              />
            </div>
          </div>,
          document.body,
        )}
    </figure>
  );
}

/* ───────────── Zoom and pan viewer for vector maps ─────────────
   Opens the SVG fitted to the screen. Scroll or pinch to zoom toward the pointer, drag to move around,
   double-click to zoom in, and use the buttons or + / - / 0 / Esc on the keyboard. The flat preview shows
   straight away underneath while the (large) SVG loads. */
const MIN_FIT = 1; // multiples of the fit-to-screen scale
const MAX_SCALE = 8; // multiples of the SVG's own size

function MapViewer({
  src,
  preview,
  alt,
  width,
  height,
  onClose,
}: {
  src: string;
  preview: string;
  alt: string;
  width: number;
  height: number;
  onClose: () => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ x: 0, y: 0, s: 1 });
  const [fit, setFit] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const viewRef = useRef(view);
  viewRef.current = view;
  const fitRef = useRef(fit);
  fitRef.current = fit;
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ dist: number; s: number } | null>(null);
  const touch = useIsMobile();

  const clampView = useCallback(
    (x: number, y: number, s: number) => {
      const box = boxRef.current;
      if (!box) return { x, y, s };
      const bw = box.clientWidth;
      const bh = box.clientHeight;
      const w = width * s;
      const h = height * s;
      // keep some of the map on screen; centre it when it is smaller than the screen
      const nx = w <= bw ? (bw - w) / 2 : Math.min(0, Math.max(bw - w, x));
      const ny = h <= bh ? (bh - h) / 2 : Math.min(0, Math.max(bh - h, y));
      return { x: nx, y: ny, s };
    },
    [width, height],
  );

  const fitToScreen = useCallback(() => {
    const box = boxRef.current;
    if (!box) return;
    const f = Math.min(box.clientWidth / width, box.clientHeight / height);
    setFit(f);
    setView(clampView(0, 0, f));
  }, [clampView, width, height]);

  useLayoutEffect(() => {
    fitToScreen();
    const box = boxRef.current;
    if (!box) return;
    const ro = new ResizeObserver(() => {
      const f = Math.min(box.clientWidth / width, box.clientHeight / height);
      const wasFit = Math.abs(viewRef.current.s - fitRef.current) < 1e-6;
      setFit(f);
      setView((v) => (wasFit ? clampView(0, 0, f) : clampView(v.x, v.y, Math.max(f, v.s))));
    });
    ro.observe(box);
    return () => ro.disconnect();
  }, [fitToScreen, clampView, width, height]);

  /** Zoom to scale `next`, keeping the point (cx, cy) in the viewer where it is. */
  const zoomAt = useCallback(
    (next: number, cx: number, cy: number) => {
      const v = viewRef.current;
      const s = Math.min(MAX_SCALE, Math.max(fitRef.current * MIN_FIT, next));
      const k = s / v.s;
      setView(clampView(cx - (cx - v.x) * k, cy - (cy - v.y) * k, s));
    },
    [clampView],
  );

  const zoomCentre = useCallback(
    (factor: number) => {
      const box = boxRef.current;
      if (!box) return;
      zoomAt(viewRef.current.s * factor, box.clientWidth / 2, box.clientHeight / 2);
    },
    [zoomAt],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "+" || e.key === "=") zoomCentre(1.4);
      else if (e.key === "-" || e.key === "_") zoomCentre(1 / 1.4);
      else if (e.key === "0") fitToScreen();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, zoomCentre, fitToScreen]);

  // Wheel needs a non-passive listener so the page behind never scrolls.
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = box.getBoundingClientRect();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
      const dy = e.deltaY * unit;
      // trackpad pinch arrives as ctrl + wheel with small deltas, so it needs a stronger factor
      const factor = Math.exp((-dy * (e.ctrlKey ? 0.012 : 0.0016)));
      zoomAt(viewRef.current.s * factor, e.clientX - r.left, e.clientY - r.top);
    };
    box.addEventListener("wheel", onWheel, { passive: false });
    return () => box.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), s: viewRef.current.s };
    }
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const box = boxRef.current;
    if (!box) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && gesture.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const r = box.getBoundingClientRect();
      zoomAt(gesture.current.s * (dist / gesture.current.dist), (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
      return;
    }
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    const v = viewRef.current;
    setView(clampView(v.x + dx, v.y + dy, v.s));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    gesture.current = null;
    if (pointers.current.size === 0) setDragging(false);
  };

  const onDoubleClick = (e: React.MouseEvent) => {
    const box = boxRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    const atFit = Math.abs(viewRef.current.s - fitRef.current) < 1e-3;
    if (atFit) zoomAt(Math.min(MAX_SCALE, Math.max(fitRef.current * 3, 1)), e.clientX - r.left, e.clientY - r.top);
    else fitToScreen();
  };

  const pct = Math.round((view.s / fit) * 100);
  const ctrl: React.CSSProperties = {
    minWidth: 40,
    height: 40,
    padding: "0 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontFamily: SANS,
    fontSize: 15,
    cursor: "pointer",
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(8,8,8,0.96)", display: "flex", flexDirection: "column" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 16px", fontFamily: SANS, color: "#fff", flexWrap: "wrap" }}>
        <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "var(--fs-sec, 13px)" }}>
          {touch ? "Pinch to zoom, drag to move" : "Scroll to zoom, drag to move, double-click to zoom in"}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button type="button" style={ctrl} onClick={() => zoomCentre(1 / 1.4)} aria-label="Zoom out">
            −
          </button>
          <span aria-live="polite" style={{ minWidth: 48, textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
            {pct}%
          </span>
          <button type="button" style={ctrl} onClick={() => zoomCentre(1.4)} aria-label="Zoom in">
            +
          </button>
          <button type="button" style={ctrl} onClick={fitToScreen}>
            Fit
          </button>
          <button type="button" style={ctrl} onClick={onClose} aria-label="Close">
            Close
          </button>
        </div>
      </div>
      <div
        ref={boxRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
        style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden", touchAction: "none", cursor: dragging ? "grabbing" : "grab", userSelect: "none" }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, width, height, transformOrigin: "0 0", transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})` }}>
          <img src={preview} alt="" draggable={false} width={width} height={height} style={{ position: "absolute", inset: 0, width, height, display: "block" }} />
          <img
            src={src}
            alt={alt}
            draggable={false}
            width={width}
            height={height}
            onLoad={() => setLoaded(true)}
            style={{ position: "absolute", inset: 0, width, height, display: "block", opacity: loaded ? 1 : 0 }}
          />
        </div>
        {!loaded && (
          <span style={{ position: "absolute", left: 16, bottom: 16, padding: "6px 12px", borderRadius: 999, background: "rgba(255,255,255,0.12)", color: "#fff", fontFamily: SANS, fontSize: 13 }}>
            Loading the full-detail map…
          </span>
        )}
      </div>
    </div>,
    document.body,
  );
}
