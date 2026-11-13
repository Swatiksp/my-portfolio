import canvasLine from "@/assets/prism-ideas/canvas-line.svg";
import flagLine from "@/assets/prism-ideas/flag-line.svg";
import queueLine from "@/assets/prism-ideas/queue-line.svg";
import sortArrow from "@/assets/prism-ideas/sort-arrow.svg";

const SANS = "'Roboto', sans-serif";
const LABEL = { fontFamily: SANS, fontWeight: 500, fontSize: 7, lineHeight: "normal", color: "#000000" } as const;
const LABEL_W = { ...LABEL, fontWeight: 700, color: "#ffffff" } as const;
const CHIP = { fontFamily: SANS, fontWeight: 500, fontSize: 8, lineHeight: "normal" } as const;
const CHIP_SM = { ...CHIP, fontSize: 7.5 } as const;

const COLS = [
  {
    title: "Canvas",
    note: "Pan in any direction. Matching passages stay on screen.",
    art: (
      <div className="relative overflow-hidden bg-white" style={{ width: 300, height: 210, border: "1px solid #000", borderRadius: 16 }}>
        <img src={canvasLine} alt="" />
        <span className="absolute whitespace-nowrap" style={{ ...LABEL, left: 46, top: 35 }}>
          SOURCE
        </span>
        <span className="absolute whitespace-nowrap" style={{ ...LABEL, left: 122, top: 49 }}>
          REPORT
        </span>
        <span className="absolute whitespace-nowrap" style={{ ...LABEL, left: 202, top: 35 }}>
          EDITS
        </span>
      </div>
    ),
  },
  {
    title: "Flag to source",
    note: "The sentence, the source, and the policy behind the flag.",
    art: (
      <div className="relative overflow-hidden bg-white" style={{ width: 300, height: 210, border: "1px solid #000", borderRadius: 16 }}>
        <img src={flagLine} alt="" />
        <span className="absolute whitespace-nowrap" style={{ ...LABEL_W, left: 200.5, top: 28.5 }}>
          SOURCE
        </span>
        <span className="absolute whitespace-nowrap" style={{ ...LABEL_W, left: 200.5, top: 118.5 }}>
          POLICY
        </span>
      </div>
    ),
  },
  {
    title: "Queue",
    note: "What’s due, sorted and filterable by status.",
    art: (
      <div className="relative overflow-hidden bg-white" style={{ width: 300, height: 210, border: "1px solid #000", borderRadius: 16 }}>
        <img src={queueLine} alt="" />
        <span className="absolute whitespace-nowrap" style={{ ...CHIP, left: 33, top: 42.5, color: "#ffffff" }}>
          All
        </span>
        <span className="absolute whitespace-nowrap" style={{ ...CHIP, left: 66, top: 42.5, color: "#000000" }}>
          Due today
        </span>
        <span className="absolute whitespace-nowrap" style={{ ...CHIP, left: 127, top: 42.5, color: "#000000" }}>
          In review
        </span>
        <span className="absolute whitespace-nowrap" style={{ ...CHIP, left: 239, top: 42.5, fontWeight: 700, color: "#000000" }}>
          Due
        </span>
        <span className="absolute whitespace-nowrap" style={{ ...CHIP, left: 175, top: 74, color: "#000000" }}>
          12:00 pm
        </span>
        <span className="absolute whitespace-nowrap" style={{ ...CHIP_SM, left: 238, top: 74.5, color: "#ffffff" }}>
          Urgent
        </span>
        <span className="absolute whitespace-nowrap" style={{ ...CHIP, left: 175, top: 105, color: "#000000" }}>
          1:00 pm
        </span>
        <span className="absolute whitespace-nowrap" style={{ ...CHIP_SM, left: 233, top: 105.5, color: "#000000" }}>
          In review
        </span>
        <span className="absolute whitespace-nowrap" style={{ ...CHIP, left: 175, top: 136, color: "#000000" }}>
          3:30 pm
        </span>
        <span className="absolute whitespace-nowrap" style={{ ...CHIP_SM, left: 242, top: 136.5, color: "#000000" }}>
          New
        </span>
        <span className="absolute whitespace-nowrap" style={{ ...CHIP, left: 175, top: 167, color: "#000000" }}>
          5:00 pm
        </span>
        <span className="absolute whitespace-nowrap" style={{ ...CHIP_SM, left: 242, top: 167.5, color: "#000000" }}>
          Draft
        </span>
        <img src={sortArrow} alt="" className="absolute" style={{ left: 256, top: 43 }} />
      </div>
    ),
  },
] as const;

export function IdeasDevelopedCards() {
  return (
    <div className="flex flex-wrap justify-center w-full" style={{ gap: 40 }}>
      {COLS.map((col) => (
        <div key={col.title} className="flex flex-col items-center" style={{ width: 300, gap: 16 }}>
          {col.art}
          <p
            className="m-0 w-full text-center"
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 18,
              lineHeight: "16px",
              textTransform: "uppercase",
              color: "rgba(var(--ink-rgb),0.42)",
            }}
          >
            {col.title}
          </p>
          <p
            className="m-0 w-full text-center"
            style={{ fontFamily: SANS, fontWeight: 400, fontSize: 16, lineHeight: "22px", color: "var(--ink)" }}
          >
            {col.note}
          </p>
        </div>
      ))}
    </div>
  );
}
