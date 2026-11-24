import { useEffect, useRef, useState } from "react";
import typed from "@/assets/spectrim/flow-01-spec-map.webp";
import long1 from "@/assets/spectrim/long-01-spec-map.webp";
import long3 from "@/assets/spectrim/long-03-requirements-groups.webp";
import a1 from "@/assets/spectrim/ai-01-reject-menu.webp";
import a2 from "@/assets/spectrim/ai-02-thread.webp";
import a3 from "@/assets/spectrim/ai-03-reply.webp";
import a4 from "@/assets/spectrim/ai-04-rewrite.webp";
import a5 from "@/assets/spectrim/ai-05-approve.webp";
import resolved from "@/assets/spectrim/resolved.webp";

const SANS = "'Roboto', sans-serif";

// All 1920x1080. They always start with the spec map of a typed spec, then the long-document version, then "Talking to
// the AI" (SpecTer comes up as the AI in the thread), and last the state where nothing is left to approve, review or check.
const SCREENS = [
  { src: typed, title: "Spec map, typed spec", note: "After the AI compiles the spec, the map shows its five sections around the spec. Each tile counts what the AI added and what is still open.", w: 1920, h: 1080 },
  { src: long1, title: "Spec map, long document", note: "The spec is a 14-page PDF. The AI found 26 gaps and combined them into 10 rows, so the Review list stays as short as for a typed spec.", w: 1920, h: 1080 },
  { src: long3, title: "Requirements, 3 groups to decide", note: "The 8 gaps in this section are combined into 3 questions. Each group shows the document sections it comes from. Split breaks a group apart.", w: 1920, h: 1080 },
  { src: a1, title: "Open the Reject menu", note: "On an item that blocks export, Reject opens a small menu. Hovering Reject and reply to the AI makes SpecTer peek from the header.", w: 1920, h: 1080 },
  { src: a2, title: "The reply thread opens", note: "SpecTer comes up in the thread as the AI and asks: What would you change?", w: 1920, h: 1080 },
  { src: a3, title: "Say what you would change", note: "The user types the change in their own words and sends it.", w: 1920, h: 1080 },
  { src: a4, title: "The AI rewrites the line", note: "The reply becomes a spec line. Reply again, approve it, or leave the item out on purpose.", w: 1920, h: 1080 },
  { src: a5, title: "Approve the AI’s line", note: "R-02 turns green, Spec activity logs it, and SpecTer is back in the header.", w: 1920, h: 1080 },
  { src: resolved, title: "Everything resolved", note: "Nothing is left to approve, review or check, every tile reads Nothing open, and SpecTer is happy.", w: 1920, h: 1080 },
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
          style={{ fontFamily: "'Newsreader', 'Iowan Old Style', Georgia, serif", fontWeight: 400, fontSize: "var(--fs-h1, 42px)", lineHeight: "var(--lh-h1, 48px)", letterSpacing: "-0.02em", color: "#fff" }}
        >
          The screens in the interface
        </h2>
        <p className="m-0" style={{ fontFamily: SANS, fontSize: "var(--fs-body, 18px)", lineHeight: "var(--lh-body, 28px)", color: "rgba(255,255,255,0.78)", maxWidth: 570 }}>
          A typed spec and a long document, talking to the AI, and the state where everything is resolved.
        </p>
      </div>

      {/* the track bleeds to both page edges; the first card lines up with the page column */}
      <div className="screens-fade" style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}>
        <style>{`
          /* Screens dissolve before they reach the glyph columns at the page edges (50px wide), instead of sliding over them.
             The fade ends where the first card sits at rest, so nothing is dimmed until the row moves. */
          @media (min-width: 900px) {
            .screens-fade {
              --fade-end: clamp(72px, max(24px, calc(50vw - 560px)), 190px);
              -webkit-mask-image: linear-gradient(to right, transparent 0, transparent 46px, #000 var(--fade-end), #000 calc(100% - var(--fade-end)), transparent calc(100% - 46px), transparent 100%);
              mask-image: linear-gradient(to right, transparent 0, transparent 46px, #000 var(--fade-end), #000 calc(100% - var(--fade-end)), transparent calc(100% - 46px), transparent 100%);
            }
          }
        `}</style>
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
              <img decoding="async"
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
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
                  userSelect: "none",
                }}
              />
              <figcaption style={{ fontFamily: SANS, textAlign: "left", display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 500, fontSize: "var(--fs-sec, 16px)", lineHeight: "var(--lh-sec, 24px)", color: "#fff" }}>{s.title}</span>
                <span style={{ fontSize: "var(--fs-sec, 14px)", lineHeight: "var(--lh-sec, 20px)", color: "rgba(255,255,255,0.6)" }}>{s.note}</span>
              </figcaption>
            </figure>
          ))}
          <div aria-hidden className="shrink-0" style={{ width: 1 }} />
        </div>
      </div>

      <div className="flex items-center justify-between w-full">
        <span style={{ fontFamily: SANS, fontSize: "var(--fs-sec, 13px)", color: "rgba(255,255,255,0.5)" }}>
          {active + 1} of {SCREENS.length}<span className="m-hide"> · scroll sideways, drag, or use the arrows</span>
        </span>
        <div className="flex" style={{ gap: 8 }}>
          <Arrow dir="left" disabled={active <= 0} onClick={() => go(active - 1)} />
          <Arrow dir="right" disabled={active >= SCREENS.length - 1} onClick={() => go(active + 1)} />
        </div>
      </div>
    </div>
  );
}
