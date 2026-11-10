import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useReducedMotion } from "motion/react";

const SANS = "'Roboto', sans-serif";
const FOREST = "#2d4a36";
const CARD_W = 525; // card width in the design
const OFFSET = 166; // how far the user story peeks out from behind the HMW card, in the design
const DELAY = 650; // ms the viewer sees the first state before the second card slides out
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const B = ({ children }: { children: ReactNode }) => (
  <b style={{ fontWeight: 700, color: FOREST }}>{children}</b>
);

function Card({
  pill,
  children,
  style,
  nowrap = true,
}: {
  pill: ReactNode;
  children: ReactNode;
  style?: React.CSSProperties;
  nowrap?: boolean;
}) {
  return (
    <div
      style={{
        boxSizing: "border-box",
        width: "100%",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        background: "#fff",
        borderRadius: 10,
        filter: "drop-shadow(0px 2px 5px rgba(0,0,0,0.08))",
        ...style,
      }}
    >
      <div
        style={{
          padding: "10px 20px",
          borderRadius: 10,
          background: FOREST,
          color: "#fff",
          fontFamily: SANS,
          fontSize: 18,
          lineHeight: "28px",
          textAlign: "center",
          whiteSpace: nowrap ? "nowrap" : "normal",
        }}
      >
        {pill}
      </div>
      <p
        style={{
          margin: 0,
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 18,
          lineHeight: "28.8px",
          letterSpacing: "0.26px",
          color: "#000",
          textAlign: "center",
        }}
      >
        {children}
      </p>
    </div>
  );
}

const DESIGN_W = CARD_W * 2 + 20; // the two cards and the gap between them, at design size (1070)
const MARGIN = 24; // room left at the screen edges when the screen is too narrow for 1028

/**
 * The HMW and the user story as two cards, drawn at the size they have in the design (504 wide each)
 * and scaled to fit the column, so the type and spacing keep the proportions of the Figma frames.
 * First the HMW card sits in front with the user story tucked behind it, blurred and faded. After a
 * short pause, once the section is on screen, the cards slide apart and the user story comes into focus.
 */
export function ProblemDeck() {
  const reduced = useReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [apart, setApart] = useState(false);
  const [w, setW] = useState(DESIGN_W);
  const [vw, setVw] = useState(() => (typeof document === "undefined" ? DESIGN_W : document.documentElement.clientWidth));
  const [innerH, setInnerH] = useState(300);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const measure = () => {
      setVw(document.documentElement.clientWidth);
      setW(outer.clientWidth);
      setInnerH(inner.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    ro.observe(inner);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    if (reduced) {
      setApart(true);
      return;
    }
    let timer: number | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.55)) {
          timer = window.setTimeout(() => setApart(true), DELAY);
          io.disconnect();
        }
      },
      { threshold: [0.55] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, [reduced]);

  // very narrow screens: the cards stack at full width instead of sliding
  const stacked = w < 560;
  // The deck is allowed to break out of the text column to the full window, so on a normal desktop
  // it is drawn at exactly the size in the design (504px cards, 24px type, the same shadow). It only
  // shrinks when the window is narrower than the design.
  const scale = stacked ? 1 : Math.min(1, (w - MARGIN * 2) / DESIGN_W);
  const open = apart || stacked;
  const move = `transform 900ms ${EASE}, opacity 700ms ease, filter 700ms ease`;
  // Final layout is two equal columns. Before that, both cards sit closer together: the gap between
  // their centres shrinks to OFFSET (percentages are of the card's own width).
  const first: React.CSSProperties = {
    position: "relative",
    zIndex: 2,
    display: "flex",
    transform: open ? "translateX(0)" : `translateX(calc(50% + 10px - ${OFFSET / 2}px))`,
    transition: move,
  };
  const second: React.CSSProperties = {
    position: "relative",
    zIndex: 1,
    display: "flex",
    transform: open ? "translateX(0)" : `translateX(calc(-50% - 10px + ${OFFSET / 2}px))`,
    opacity: open ? 1 : 0.4,
    filter: open ? "blur(0px)" : "blur(1.5px)",
    transition: move,
  };

  return (
    <div
      ref={outerRef}
      style={{
        position: "relative",
        // as wide as the visible window, centred on the column, so the deck can use the full width
        width: vw,
        alignSelf: "center",
        flexShrink: 0,
        height: stacked ? undefined : innerH * scale,
        padding: stacked ? `0 ${MARGIN}px` : 0,
        boxSizing: "border-box",
      }}
    >
      <div
        ref={innerRef}
        style={{
          display: "grid",
          gridTemplateColumns: stacked ? "minmax(0, 1fr)" : `repeat(2, ${CARD_W}px)`,
          gap: 20,
          alignItems: "stretch",
          isolation: "isolate",
          width: stacked ? "100%" : DESIGN_W,
          position: stacked ? "static" : "absolute",
          left: stacked ? undefined : (w - DESIGN_W * scale) / 2,
          top: 0,
          transform: stacked ? undefined : `scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
        <div style={first}>
          <Card nowrap={!stacked} pill={<>The problem became one <b style={{ fontWeight: 700 }}>How Might We</b>.</>}>
            How might we <B>automatically detect</B> and{" "}
            <B>surface architectural and query missing context gaps before code is generated</B> to{" "}
            <B>prevent unauthorized agent inferences?</B>
          </Card>
        </div>
        <div style={second}>
          <Card
            nowrap={!stacked}
            pill={
              <>
                <b style={{ fontWeight: 700 }}>Added</b> the <b style={{ fontWeight: 700 }}>persona</b> and it became a{" "}
                <b style={{ fontWeight: 700 }}>user story</b>.
              </>
            }
          >
            As a <B>Senior Software Engineer</B>, I{" "}
            <B>want the system to detect and surface missing context gaps before code generation</B>, so that I can{" "}
            <B>prevent unauthorized agent inferences</B>.
          </Card>
        </div>
      </div>
    </div>
  );
}
