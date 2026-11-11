import { SiteNav } from "../components/SiteNav";
import type { CSSProperties } from "react";
import { useEffect } from "react";
import { motion } from "motion/react";
import accenture from "@/assets/companies/accenture.webp";
import microsoft from "@/assets/companies/microsoft.webp";
import avanade from "@/assets/companies/avanade.svg";
import ibm from "@/assets/companies/ibm.webp";
import las from "@/assets/companies/las.png";
import museum from "@/assets/companies/museum-of-life-and-science.png";
import bathAndBodyWorks from "@/assets/companies/bath-and-body-works.png";
import usSteel from "@/assets/companies/us-steel.png";
import { CoverFlow } from "../components/CoverFlow";
import { TypeInView } from "../components/TypeInView";
import { typeDuration } from "../components/TypeIn";
import type { FlowItem } from "../components/CoverFlow";

const FOREST = "#1f3d2b";
const CREAM = "#fbf6ec";
const INK = "#000000";
const MUTED = "rgba(0,0,0,0.55)";
const LINE = "rgba(0,0,0,0.14)";
const SERIF = "'Newsreader', 'Iowan Old Style', Georgia, serif";
const SANS = "'Roboto', sans-serif";
const COND = "'Roboto Condensed', 'Roboto', sans-serif";

// TODO: replace with the real links once they exist
const LINKEDIN_URL = "https://www.linkedin.com/in/swatik-s-p-909bb9233/";
const RESUME_URL = "#";

/* ------------------------------ content ------------------------------ */

const GLYPHS = ["q", "k", "r", "s"];

// The photos, in the order they fan out (01.webp, 02.webp, …). The carousel opens on the middle one, so the one of me
// standing on the cobbles in Savannah, with my hands in my pockets, is 06 of 11.
const PHOTO_FILES = import.meta.glob("@/assets/about/*.webp", { eager: true, import: "default", query: "?url" }) as Record<string, string>;
// where each one is cropped from (the cards are almost square, so the portrait ones lose some top and bottom)
const PHOTO_FOCUS = ["50% 50%", "50% 30%", "50% 40%", "50% 40%", "50% 50%", "50% 35%", "50% 55%", "50% 75%", "50% 60%", "50% 35%", "50% 60%"];
const GREY_FILES = import.meta.glob("@/assets/about/grey/*.webp", { eager: true, import: "default", query: "?url" }) as Record<string, string>;
const GREY = Object.keys(GREY_FILES).sort();
const PHOTOS: FlowItem[] = Object.keys(PHOTO_FILES)
  .sort()
  .map((k, i) => ({ src: PHOTO_FILES[k], greySrc: GREY_FILES[GREY[i]], label: `Photo ${i + 1} of Swatik`, focus: PHOTO_FOCUS[i] }));

const BIO =
  "I’m a UX designer who likes making complicated things feel obvious. For two years at Accenture I designed for Microsoft’s business group at XD Studio, and I’m now doing my Master of Graphic and Experience Design at NC State, where my work leans into AI tools and health data. I care most about the moment someone stops reading the interface and starts getting on with their task.";

type Job = { id: string; tab: string; role: string; where: string; also?: string; when: string; text?: string };

const INDUSTRY: Job[] = [
  { id: "pin365", tab: "Pin 365", role: "Designer", where: "Pin 365", when: "Dates to come" },
  { id: "creative-guns", tab: "Creative Guns", role: "Designer", where: "Creative Guns", when: "Dates to come" },
  { id: "kuwaka", tab: "Kuwaka Tech", role: "Designer", where: "Kuwaka Tech", when: "Dates to come" },
  {
    id: "accenture",
    tab: "Accenture",
    role: "UX Designer",
    where: "Accenture, XD Studio",
    also: "Microsoft Business Group",
    when: "2023 – 2025",
    text: "Designed enterprise product and sales-enablement experiences for Microsoft’s business group, working in a studio of designers, researchers and engineers.",
  },
];
const JOBS = INDUSTRY;
// highlighted, not selectable: the two places I have worked the longest
const ACCENTURE = INDUSTRY.find((j) => j.id === "accenture")!;
const LONGEST = ["Accenture", "NC State"];

type Brand = { name: string; src?: string; h?: number };
const BRANDS: Brand[] = [
  { name: "Accenture", src: accenture },
  { name: "Microsoft", src: microsoft },
  { name: "Avanade", src: avanade },
  { name: "Museum of Life and Science", src: museum, h: 52 }, // stacked, so it needs more height to read
  { name: "IBM", src: ibm },
  { name: "Laboratory for Analytic Sciences", src: las },
  { name: "Bath & Body Works", src: bathAndBodyWorks, h: 15 }, // a long, thin wordmark, so it is set smaller
  { name: "U.S. Steel", src: usSteel, h: 38 },
];

/* ------------------------------ styles ------------------------------ */

const heading: CSSProperties = { fontFamily: SERIF, fontWeight: 400, fontSize: 36, lineHeight: "42px", letterSpacing: "-0.02em", color: INK, textAlign: "center", margin: 0 };
const body: CSSProperties = { fontFamily: SANS, fontSize: 17, lineHeight: "30px", color: INK, margin: 0 };
const button: CSSProperties = {
  display: "inline-block",
  fontFamily: COND,
  fontWeight: 700,
  fontSize: 14,
  lineHeight: "24px",
  letterSpacing: "1.12px",
  borderRadius: 4,
  padding: "10px 20px",
  cursor: "pointer",
  textDecoration: "none",
  border: `1px solid ${FOREST}`,
};

/* ------------------------------ pieces ------------------------------ */

const rand = (i: number, j: number) => {
  const n = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return n - Math.floor(n);
};

/** The left corner, scattered the way the case-study cards scatter their glyphs: dense at the corner, thinning out as
 *  it spreads, with gaps, mixed characters and uneven strength. Positions are in glyph sizes (--g), so it scales. */
const scatter = (seed: number) => {
  const CELL = 1.1;
  const REACH_X = 13.5;
  const REACH_Y = 7.5;
  const cols = Math.ceil(REACH_X / CELL);
  const rows = Math.ceil(REACH_Y / CELL);
  const out: { x: number; y: number; glyph: string; alpha: number; far: boolean }[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = i * CELL;
      const y = j * CELL;
      // thins out mostly with depth: the top rows run nearly the full width, each row below holds fewer
      const down = Math.min(1, (y + 0.5) / REACH_Y);
      const across = Math.min(1, (x + 0.5) / REACH_X);
      const density = Math.pow(1 - down, 1.8) * (1 - 0.35 * across ** 1.4);
      if (density <= 0.02 || across > 1 - 0.7 * down) continue; // lower rows also stop short, clear of the photos
      if (rand(i * 3 + 1 + seed, j * 7 + 2 + seed) > Math.min(1, density * 1.6)) continue;
      out.push({
        x,
        y,
        glyph: GLYPHS[Math.floor(rand(j + 5 + seed, i + 9 + seed) * GLYPHS.length)],
        alpha: 0.45 + 0.55 * density * (0.7 + 0.3 * rand(i + 2 + seed, j + 4 + seed)),
        far: x > 5.5,
      });
    }
  }
  return out;
};
const LEFT_CELLS = scatter(0);
const RIGHT_CELLS = scatter(37); // same recipe, its own arrangement

function CornerGlyphs() {
  return (
    <div className="about-glyphs" aria-hidden>
      {(["left", "right"] as const).map((side) =>
        (side === "left" ? LEFT_CELLS : RIGHT_CELLS).map((c, k) => (
          <span
            key={side + k}
            className={`about-glyph about-glyph-scatter${c.far ? " about-glyph-far" : ""}`}
            style={{ [side]: `calc(var(--g) * ${c.x + 0.42})`, top: `calc(var(--g) * ${c.y})`, opacity: c.alpha }}
          >
            {c.glyph}
          </span>
        )),
      )}
    </div>
  );
}

function WorkExperience() {
  // the tabs are labels, not controls: the panel under them always tells the Accenture story
  const job = ACCENTURE;
  return (
    <section className="flex flex-col items-center w-full" style={{ gap: 20 }} aria-labelledby="work-exp">
      <h2 id="work-exp" style={heading}>
        <TypeInView text="Work Experience" />
      </h2>
      <div className="flex flex-col w-full" style={{ gap: 7.338, maxWidth: 687 }}>
        <div className="flex flex-wrap items-start justify-start" style={{ gap: 7.338 }}>
          {INDUSTRY.filter((j) => !LONGEST.includes(j.tab)).map((j) => (
            <span key={j.id} className="about-tab about-tab-small">
              {j.tab}
            </span>
          ))}
          <span className="about-pill">Accenture</span>
        </div>
        <div className="flex flex-wrap items-start justify-end" style={{ gap: 7.338 }}>
          <span className="about-pill">NC State</span>
        </div>
      </div>
      <div className="w-full" style={{ padding: "19px 0" }}>
        <div className="flex flex-col items-center text-center" style={{ gap: 6 }}>
          <p className="m-0" style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 19, lineHeight: "26px", color: INK }}>
            <TypeInView text={job.role} />
          </p>
          <p className="m-0" style={{ fontFamily: SANS, fontSize: 14, lineHeight: "21px", color: MUTED }}>
            <strong style={{ fontWeight: 700 }}>
              <TypeInView text={job.where} start={120} />
            </strong>
            <TypeInView text={`${job.also ? ` · ${job.also}` : ""} · ${job.when}`} start={120 + typeDuration(job.where) - 340} />
          </p>
          <p className="m-0" style={{ ...body, color: job.text ? INK : MUTED }}>
            <TypeInView text={job.text ?? "A few lines on what I worked on here will go in this space."} start={420} />
          </p>
        </div>
      </div>
    </section>
  );
}

function Brands() {
  return (
    <section className="flex flex-col items-center" style={{ gap: 20 }} aria-labelledby="brands">
      <h2 id="brands" style={heading}>
        <TypeInView text="Companies I’ve worked for in the past 3 years" />
      </h2>
      <ul className="flex flex-wrap justify-center m-0 p-0 list-none" style={{ gap: "22px 36px", maxWidth: 600 }}>
        {BRANDS.map((b) => (
          <li key={b.name} className="flex items-center justify-center" style={{ minHeight: 40, minWidth: 96 }}>
            {b.src ? (
              <img src={b.src} alt={b.name} draggable={false} className="company-logo" style={{ height: b.h ?? 34 }} />
            ) : (
              <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 15, color: MUTED, whiteSpace: "nowrap" }}>{b.name}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------ page ------------------------------ */

export function AboutPage() {

  // the photo flow takes sideways swipes without cancelling them (so page scrolling stays smooth); this keeps a sideways
  // swipe from also going back a page
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.overscrollBehaviorX;
    root.style.overscrollBehaviorX = "none";
    return () => {
      root.style.overscrollBehaviorX = prev;
    };
  }, []);

  return (
    <div className="w-full" style={{ background: "#fff", color: INK, minHeight: "100vh", fontFamily: SANS }}>
      <SiteNav current="about" />

      {/* no card: the glyph rows sit on the page itself, in the top corners, and the photos fan out between them */}
      <div className="about-top">
        <CornerGlyphs />
        <h1 className="about-title" style={{ ...heading, fontWeight: 700 }}>
          <TypeInView text="Hey there!" />
        </h1>
        <div className="about-top-flow">
          <CoverFlow items={PHOTOS} axis="x" tone="dark" dots={false} greyBehind glass intro label="Photos of Swatik" style={{ width: "100%", height: "100%" }} />
        </div>
      </div>

      <motion.main
        className="about-main mx-auto w-full flex flex-col"
        style={{ maxWidth: 1440, padding: "96px 80px 160px", boxSizing: "border-box", gap: 96, position: "relative", zIndex: 1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="about-column mx-auto w-full flex flex-col" style={{ maxWidth: 702, gap: 80 }}>
          <p className="about-bio" style={{ ...body, fontSize: 20, lineHeight: "32px", textAlign: "center" }}><TypeInView text={BIO} start={typeDuration("Hey there!") - 100} />
          </p>
          <WorkExperience />
          <Brands />
          <section className="flex flex-col items-center" style={{ gap: 20 }} aria-labelledby="connect">
            <h2 id="connect" style={heading}>
              <TypeInView text="Let’s Connect!" />
            </h2>
            <div className="flex flex-wrap justify-center" style={{ gap: 12 }}>
              <a href={RESUME_URL} className="hover:opacity-85 transition-opacity" style={{ ...button, background: FOREST, color: CREAM }}>
                RESUME
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" style={{ ...button, background: "transparent", color: FOREST }}>
                LINKEDIN ↗
              </a>
            </div>
          </section>
        </div>
      </motion.main>
    </div>
  );
}
