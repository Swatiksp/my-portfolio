import { useEffect, useRef, useState } from "react";
import enterSpec from "@/assets/screens/enter-spec.png";
import mapMinimized from "@/assets/screens/spec-map-minimized.png";
import mapReviewList from "@/assets/screens/spec-map-review-list.png";
import mapHover from "@/assets/screens/spec-map-hover.png";
import requirements from "@/assets/screens/requirements.png";

const SANS = "'Roboto', sans-serif";
const MONO = "'Roboto Condensed', 'Roboto', sans-serif";

// 1440x960 frames, except Requirements which is 1280x800 (same 3:2 shape)
const SCREENS = [
  { src: enterSpec, title: "Enter the spec", note: "Paste a spec, then map it.", w: 1440, h: 960 },
  { src: mapMinimized, title: "The spec map", note: "Review list minimised, the whole map in view.", w: 1440, h: 960 },
  { src: mapReviewList, title: "The spec map with the review list", note: "Export is blocked until the must-approve items are done.", w: 1440, h: 960 },
  { src: mapHover, title: "The spec card", note: "Hover the card to open the spec or export it.", w: 1440, h: 960 },
  { src: requirements, title: "Requirements, opened up", note: "Lines grouped by priority, with the ones that need you first.", w: 1280, h: 800 },
];

const CARD_W = 880;
const GAP = 24;

function Arrow({ dir, disabled, onClick }: { dir: "left" | "right"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={dir === "left" ? "Previous screen" : "Next screen"}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 44,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.28)",
        background: "transparent",
        color: "#fff",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.3 : 1,
        transition: "opacity 200ms ease, background 200ms ease",
      }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d={dir === "left" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/** A sideways row of the high-fidelity screens. Scroll, drag, use the arrows or the arrow keys. */
export function ScreensGallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const cardStep = () => {
    const track = trackRef.current;
    const first = track?.querySelector<HTMLElement>("[data-screen]");
    return first ? first.offsetWidth + GAP : CARD_W + GAP;
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => setActive(Math.round(track.scrollLeft / cardStep()));
    onScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const go = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const n = Math.max(0, Math.min(SCREENS.length - 1, i));
    track.scrollTo({ left: n * cardStep(), behavior: "smooth" });
  };

  // drag with the mouse to move sideways
  const drag = useRef<{ x: number; left: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    drag.current = { x: e.clientX, left: trackRef.current?.scrollLeft ?? 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    if (trackRef.current) trackRef.current.style.scrollSnapType = "none";
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !trackRef.current) return;
    trackRef.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    const track = trackRef.current;
    if (track) {
      track.style.scrollSnapType = "";
      go(Math.round(track.scrollLeft / cardStep()));
    }
  };

  return (
    <div id="screens-in-the-interface" className="flex flex-col w-full" style={{ gap: 32 }}>
      <div className="flex flex-col items-center text-center" style={{ gap: 12 }}>
        <h2
          className="m-0"
          style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, lineHeight: "40px", textTransform: "uppercase", color: "#fff" }}
        >
          The screens in the interface
        </h2>
        <p className="m-0" style={{ fontFamily: SANS, fontSize: 18, lineHeight: "28px", color: "rgba(255,255,255,0.78)", maxWidth: 570 }}>
          Here is how the high fidelity screens look inside the product.
        </p>
      </div>

      {/* the track bleeds to both page edges; the first card lines up with the page column */}
      <div style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}>
        <div
          ref={trackRef}
          role="region"
          aria-label="High fidelity screens"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              go(active + 1);
            }
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              go(active - 1);
            }
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="noscrollbar"
          style={{
            display: "flex",
            gap: GAP,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingInline: "max(24px, calc(50vw - 560px))",
            scrollPaddingInline: "max(24px, calc(50vw - 560px))",
            paddingBottom: 8,
            scrollbarWidth: "none",
            cursor: "grab",
            outline: "none",
          }}
        >
          <style>{`.noscrollbar::-webkit-scrollbar{display:none}`}</style>
          {SCREENS.map((s, i) => (
            <figure
              key={s.title}
              data-screen
              className="m-0 shrink-0"
              style={{
                width: `min(${CARD_W}px, calc(100vw - 72px))`,
                scrollSnapAlign: "start",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                opacity: i === active ? 1 : 0.55,
                transition: "opacity 300ms ease",
              }}
            >
              <img
                src={s.src}
                alt={`${s.title}: ${s.note}`}
                width={s.w}
                height={s.h}
                draggable={false}
                loading="lazy"
                style={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
                  userSelect: "none",
                }}
              />
              <figcaption style={{ fontFamily: SANS, textAlign: "left", display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 500, fontSize: 16, lineHeight: "24px", color: "#fff" }}>{s.title}</span>
                <span style={{ fontSize: 14, lineHeight: "20px", color: "rgba(255,255,255,0.6)" }}>{s.note}</span>
              </figcaption>
            </figure>
          ))}
          <div aria-hidden className="shrink-0" style={{ width: 1 }} />
        </div>
      </div>

      <div className="flex items-center justify-between w-full">
        <span style={{ fontFamily: SANS, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
          {active + 1} of {SCREENS.length} · scroll sideways, drag, or use the arrows
        </span>
        <div className="flex" style={{ gap: 8 }}>
          <Arrow dir="left" disabled={active <= 0} onClick={() => go(active - 1)} />
          <Arrow dir="right" disabled={active >= SCREENS.length - 1} onClick={() => go(active + 1)} />
        </div>
      </div>
    </div>
  );
}
