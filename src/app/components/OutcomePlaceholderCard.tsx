import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import cardBg from "@/assets/final-outcomes/bg.jpg";

const INK = "var(--ink)";
const SANS = "'Roboto', sans-serif";

// The recordings were slow enough to read as stills, so they play faster.
const PLAYBACK_RATE = 1.8;

const MEDIA_W = 1280;
const MEDIA_H = 757;

const VIDEOS = [
  {
    title: "Report Queue",
    src: "/videos/final-outcomes/report-queue.mov",
    copy: "High-priority and recent reports, sorted and filterable by status, so the next edit is the one that is actually due.",
  },
  {
    title: "Infinite Canvas",
    src: "/videos/final-outcomes/infinite-canvas.mov",
    copy: "Sources on the left, the report in the middle, edits and flags on the right. Tiers sit in space so matching passages stay on screen.",
  },
  {
    title: "Multi-Tier Analysis",
    src: "/videos/final-outcomes/multi-tier-analysis.mov",
    copy: "The same finding, rewritten for each clearance. A change on one tier flags the others before a source leaks.",
  },
  {
    title: "Mind Map View",
    src: "/videos/final-outcomes/mind-map-view.mov",
    copy: "Sources, policies, and annotations as a map, so Marcus can see how a sentence is grounded before he signs off.",
  },
  {
    title: "Policy Search Engine",
    src: "/videos/final-outcomes/policy-search-engine.mov",
    copy: "Search that returns the policy and the reason, not just a keyword hit, with a path back from the flag.",
  },
  {
    title: "Timeline",
    src: "/videos/final-outcomes/timeline-1.mov",
    copy: "How the report moved: who touched it, what changed, and when the deadline actually is.",
  },
] as const;

/**
 * Six high-fidelity walkthroughs, laid out as in the Figma "OutcomeVideoCard":
 * title + copy on the left, then the glass frame holding the walkthrough.
 * Only the card in view plays; the others pause.
 */
export function OutcomeVideoCards() {
  const reduceMotion = useReducedMotion();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const cards = cardRefs.current;
    const ratios = new Map<Element, number>();

    const apply = () => {
      let best = -1;
      let bestRatio = 0.4;
      cards.forEach((el, i) => {
        if (!el) return;
        const r = ratios.get(el) ?? 0;
        if (r > bestRatio) {
          bestRatio = r;
          best = i;
        }
      });
      setActive(best === -1 ? null : best);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.set(e.target, e.intersectionRatio));
        apply();
      },
      { threshold: [0, 0.25, 0.4, 0.5, 0.6, 0.75, 1], rootMargin: "-12% 0px -12% 0px" },
    );

    cards.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (!reduceMotion && i === active) {
        video.currentTime = 0;
        video.playbackRate = PLAYBACK_RATE;
        const play = video.play();
        if (play) play.catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active, reduceMotion]);

  return (
    <div className="flex flex-col w-full items-center" style={{ gap: 40 }}>
      {VIDEOS.map((v, i) => (
        <OutcomeVideoCard
          key={v.src}
          title={v.title}
          copy={v.copy}
          src={v.src}
          cardRef={(el) => {
            cardRefs.current[i] = el;
          }}
          videoRef={(el) => {
            videoRefs.current[i] = el;
          }}
        />
      ))}
    </div>
  );
}

function OutcomeVideoCard({
  title,
  copy,
  src,
  cardRef,
  videoRef,
}: {
  title: string;
  copy: string;
  src: string;
  cardRef: (el: HTMLDivElement | null) => void;
  videoRef: (el: HTMLVideoElement | null) => void;
}) {
  return (
    <div ref={cardRef} className="flex flex-col items-center w-full" style={{ gap: 20 }}>
      <div className="flex flex-col items-center text-center" style={{ gap: 10, maxWidth: 573 }}>
        <p
          className="m-0"
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 20,
            lineHeight: "26px",
            color: INK,
          }}
        >
          {title}
        </p>
        <p
          className="m-0"
          style={{ fontFamily: SANS, fontWeight: 400, fontSize: 16, lineHeight: "24px", color: "rgba(var(--ink-rgb),0.72)" }}
        >
          {copy}
        </p>
      </div>

      {/* Container — 1280 × 757, radius 20, clipped */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: `${MEDIA_W} / ${MEDIA_H}`, borderRadius: 20 }}
      >
        <img
          src={cardBg}
          alt=""
          draggable={false}
          className="absolute select-none"
          style={{
            left: "50%",
            top: "50%",
            width: "150%",
            maxWidth: "none",
            height: `${(1095 / MEDIA_H) * 100}%`,
            transform: "translate(-50%, -50%)",
            objectFit: "cover",
          }}
        />

        {/* Glass frame — inset 12 / 10, white @ 50%, blur 24 (Figma) */}
        <div
          className="absolute"
          style={{
            left: 12,
            right: 12,
            top: 10,
            bottom: 10,
            padding: 10,
            borderRadius: 20,
            background: "var(--glass)",
            boxShadow: "0 16px 40px rgba(89,51,13,0.24)",
          }}
        >
          <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: 10 }}>
            <video
              ref={videoRef}
              src={src}
              muted
              loop
              playsInline
              preload="metadata"
              onLoadedMetadata={(e) => { e.currentTarget.playbackRate = PLAYBACK_RATE; }}
              disablePictureInPicture
              aria-label={title}
              className="absolute inset-0 block"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
