import { useEffect, useId, useRef, useState } from "react";

/**
 * SpecTer, the SpecTrim mascot, drawn from the Figma states (Neutral, Happy, Peeking). Neutral is his default face and
 * he leans a little toward the cursor (the card publishes the pointer as --bx / --by, each -1 to 1). Hover him and he
 * peeks: one eye squints, the other opens wide and follows the cursor, and he leans harder. Move onto the card and he
 * smiles and hops once.
 */
type Mood = "neutral" | "happy" | "peeking";

const POLY = "M37.0205 67.5994L51.5773 112.401C51.9904 113.672 52.197 114.308 52.5861 114.778C52.9296 115.193 53.3725 115.515 53.8737 115.714C54.4413 115.938 55.1097 115.938 56.4467 115.938H103.553C104.89 115.938 105.559 115.938 106.126 115.714C106.627 115.515 107.07 115.193 107.414 114.778C107.803 114.308 108.01 113.672 108.423 112.401L122.98 67.5994C123.393 66.3279 123.599 65.6922 123.561 65.083C123.527 64.545 123.358 64.0244 123.069 63.5693C122.742 63.0539 122.201 62.6609 121.12 61.8751L83.0095 34.1865C81.9279 33.4007 81.3871 33.0078 80.7958 32.856C80.2737 32.7219 79.7263 32.7219 79.2042 32.856C78.6129 33.0078 78.0721 33.4007 76.9905 34.1865L38.8804 61.8751C37.7988 62.6609 37.258 63.0539 36.931 63.5693C36.6421 64.0244 36.473 64.545 36.4391 65.083C36.4008 65.6922 36.6074 66.3279 37.0205 67.5994Z";
const PEEK_OUTLINE = "M87.8006 33.5445C88.9323 33.2696 89.8913 33.308 90.9974 33.6725L91.6368 33.6981L91.95 33.8707C93.6891 34.4207 94.923 35.5907 95.5432 36.0959L132.638 65.2778C133.258 65.7829 134.658 66.7995 135.553 68.4363L135.86 68.7688L136.001 69.2547C136.602 70.2394 136.883 71.2112 136.998 72.3365L136.972 72.9759L136.959 73.2955C136.889 75.0538 136.179 76.7864 135.994 77.4194L119.656 121.592C119.305 122.379 118.748 124.277 117.406 125.825C116.402 126.905 115.251 127.66 113.787 128.241C112.003 128.81 110.085 128.733 109.126 128.695L62.1329 126.813C61.1739 126.775 59.2558 126.698 57.5232 125.988C56.1102 125.292 55.0233 124.448 54.1091 123.29C52.8944 121.641 52.4917 119.703 52.204 118.891L39.4505 73.5538C39.1629 72.7418 38.5939 70.9579 38.8305 69.0463L38.8561 68.4069C39.0672 67.1346 39.5979 65.8751 40.2757 64.9416L40.6081 64.6347C41.6312 63.0747 43.1081 62.1733 43.7667 61.7194L83.0756 35.5967C83.7342 35.1427 85.3838 33.928 87.1612 33.5189L87.8006 33.5445Z";
const PENT = 1.28;
const PEEK_PENT = 1.14;
const PEEK_A = "M83.2734 89.0925C79.9872 87.1998 76.8672 85.1538 73.7408 83.2675C70.0325 83.9195 66.4776 84.7378 62.7693 85.3898";
const PEEK_B = "M94.5831 98.5105C95.2162 94.6936 95.8493 90.8766 96.6423 87.066C97.2754 83.2491 98.0683 79.4385 98.7015 75.6216";
const PEEK_EYE = "M105.28 93.0764C105.708 92.5047 105.98 91.9045 106.408 91.3328C109.922 86.2878 113.737 84.0579 117.353 84.7145C120.968 85.3711 123.755 88.8 125.271 94.7585C125.471 95.4444 125.514 96.1017 125.715 96.7875C125.129 97.3307 124.729 97.7451 124.172 98.1311C119.7 102.19 116.442 104.034 113.927 103.578C111.412 103.121 109.011 100.249 106.252 94.8767C105.866 94.3195 105.637 93.7908 105.28 93.0764Z";

export function SpecTer() {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [mood, setMood] = useState<Mood>("neutral");
  const [hop, setHop] = useState(0);

  useEffect(() => {
    const card = ref.current?.closest<HTMLElement>(".poster");
    if (!card) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const enter = () => {
      setMood((m) => (m === "peeking" ? m : "happy"));
      setHop((h) => h + 1);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setMood((m) => (m === "happy" ? "neutral" : m)), 1100);
    };
    const leave = () => {
      window.clearTimeout(timer);
      setMood("neutral");
    };
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    return () => {
      window.clearTimeout(timer);
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
    };
  }, []);

  const peeking = mood === "peeking";
  return (
    <div
      ref={ref}
      className={`spec-ter spec-ter-${mood}`}
      data-hop={hop === 0 ? undefined : hop % 2 === 0 ? "a" : "b"}
      onPointerEnter={() => setMood("peeking")}
      onPointerLeave={() => setMood((m) => (m === "peeking" ? "neutral" : m))}
      role="img"
      aria-label="SpecTer, the SpecTrim mascot"
    >
      <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect width="160" height="160" fill="#FF7A6B" />
        {peeking ? (
          <g>
            <path d={PEEK_OUTLINE} stroke="#fff" strokeWidth={11.1978 / PEEK_PENT} transform={`translate(88 82) scale(${PEEK_PENT}) translate(-88 -82)`} />
            <path d={PEEK_A} stroke="#fff" strokeWidth="9.59809" strokeLinecap="round" />
            <path d={PEEK_B} stroke="#fff" strokeWidth="9.59809" strokeLinecap="round" />
            <path className="spec-ter-eye" d={PEEK_EYE} fill="#fff" />
          </g>
        ) : (
          <g>
            {/* the pentagon is drawn larger than in the file, with the ring kept the same width, so the </> has room */}
            <g transform={`translate(80 76) scale(${PENT}) translate(-80 -76)`}>
              <clipPath id={`${id}-c`}>
                <path d={POLY} />
              </clipPath>
              <path d={POLY} stroke="#fff" strokeWidth={22.4 / PENT} clipPath={`url(#${id}-c)`} />
            </g>
            {mood === "happy" ? (
              <g stroke="#fff" strokeWidth="9.6" strokeLinecap="round">
                <path d="M68.8 76.8L58.4 65.6L48 76.8" />
                <path d="M91.2 76.8L101.6 65.6L112 76.8" />
                <path d="M80 60.8V84" />
              </g>
            ) : (
              <g stroke="#fff" strokeWidth="9.6" strokeLinecap="round">
                <path d="M65.6 68.8L54.4 79.2L65.6 89.6" />
                <path d="M94.4 68.8L105.6 79.2L94.4 89.6" />
                <path d="M76.8 89.6L83.2 68.8" />
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}
