const FONT = "'Roboto', sans-serif";

const C = {
  pillStart: "#5C5C5C",
  process: "#2A2A2A",
  white: "#FFFFFF",
  prepareStroke: "#A3A3A3",
  diamond: "#6A6A6A",
  onDark: "#FFFFFF",
  onLight: "#000000",
  arrow: "#4A4A4A",
  label: "#3A3A3A",
};

const CX = 520;
const TALK = 200;
const TYPE = 840;
const LOOP = 800;
const COL_W = 248;

function Lines({
  x,
  y,
  lines,
  fill,
  size = 14,
  gap = 18,
  weight = 500,
}: {
  x: number;
  y: number;
  lines: string[];
  fill: string;
  size?: number;
  gap?: number;
  weight?: number;
}) {
  const start = y - ((lines.length - 1) * gap) / 2;
  return (
    <text
      x={x}
      y={start}
      textAnchor="middle"
      dominantBaseline="middle"
      fill={fill}
      fontSize={size}
      fontFamily={FONT}
      fontWeight={weight}
    >
      {lines.map((line, i) => (
        <tspan key={`${line}-${i}`} x={x} dy={i === 0 ? 0 : gap}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

function Pill({ x, y, w, h, lines }: { x: number; y: number; w: number; h: number; lines: string[] }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={C.pillStart} />
      <Lines x={x + w / 2} y={y + h / 2} lines={lines} fill={C.onDark} size={15} gap={16} />
    </g>
  );
}

function Process({
  x,
  y,
  w,
  h,
  lines,
  fill = C.process,
  text = C.onDark,
  stroke,
  size = 14,
  gap = 18,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  lines: string[];
  fill?: string;
  text?: string;
  stroke?: string;
  size?: number;
  gap?: number;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill={fill}
        stroke={stroke}
        strokeWidth={stroke ? 2 : 0}
      />
      <Lines x={x + w / 2} y={y + h / 2} lines={lines} fill={text} size={size} gap={gap} />
    </g>
  );
}

function Diamond({
  cx,
  cy,
  rx,
  ry,
  lines,
  size = 15,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  lines: string[];
  size?: number;
}) {
  const points = `${cx},${cy - ry} ${cx + rx},${cy} ${cx},${cy + ry} ${cx - rx},${cy}`;
  return (
    <g>
      <polygon points={points} fill={C.diamond} />
      <Lines x={cx} y={cy} lines={lines} fill={C.onDark} size={size} gap={17} />
    </g>
  );
}

function EdgeLabel({
  x,
  y,
  children,
  anchor = "middle",
}: {
  x: number;
  y: number;
  children: string;
  anchor?: "middle" | "start" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="middle"
      fill={C.label}
      fontSize={14}
      fontFamily={FONT}
      fontWeight={600}
    >
      {children}
    </text>
  );
}

export function HaloTaskFlow() {
  const home = { x: CX - 110, y: 16, w: 220, h: 50 };
  const inRx = 92;
  const inRy = 56;
  const inCy = home.y + home.h + 48 + inRy;
  const inTop = inCy - inRy;
  const inBot = inCy + inRy;
  const inLeft = CX - inRx;
  const inRight = CX + inRx;

  const choose = { x: TALK - COL_W / 2, y: inBot + 44, w: COL_W, h: 92 };
  const speak = { x: TALK - COL_W / 2, y: choose.y + choose.h + 36, w: COL_W, h: 72 };
  const typeBox = { x: TYPE - COL_W / 2, y: choose.y, w: COL_W, h: 72 };

  const mergeY = speak.y + speak.h + 48;
  const prepare = { x: CX - 132, y: mergeY + 40, w: 264, h: 72 };
  const deck = { x: CX - 146, y: prepare.y + prepare.h + 40, w: 292, h: 96 };
  const build = { x: CX - 118, y: deck.y + deck.h + 40, w: 236, h: 56 };
  const view = { x: CX - 138, y: build.y + build.h + 40, w: 276, h: 56 };

  const satRx = 132;
  const satRy = 74;
  const satCy = view.y + view.h + 44 + satRy;
  const satTop = satCy - satRy;
  const satBot = satCy + satRy;
  const satRight = CX + satRx;

  const meeting = { x: CX - 132, y: satBot + 64, w: 264, h: 72 };
  const finder = { x: CX - 146, y: meeting.y + meeting.h + 40, w: 292, h: 76 };
  const found = { x: CX - 132, y: finder.y + finder.h + 40, w: 264, h: 72 };
  const end = { x: CX - 130, y: found.y + found.h + 40, w: 260, h: 50 };

  const buildMid = build.y + build.h / 2;
  const buildRight = build.x + build.w;
  const vbH = end.y + end.h + 28;
  const vbW = 1040;

  const arrow = "url(#halo-flow-arrow)";

  return (
    <div className="w-full" style={{ overflowX: "auto" }}>
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        role="img"
        aria-labelledby="halo-task-flow-title halo-task-flow-desc"
        style={{ display: "block", width: "100%", minWidth: 720, height: "auto" }}
      >
        <title id="halo-task-flow-title">Halo Conversations general task flow</title>
        <desc id="halo-task-flow-desc">
          Vertical task flow. Start on the homepage and enter a client prompt. Input is a decision: Talk or Type.
          Talk continues by choosing a voice — Wave, Grove, Canyon, or Meadow — then speaking the brief. Type
          continues by typing the client needs and description. The paths merge at Prepare, then Deck builder, Build
          deck, and View the generated deck. If the deck is not satisfactory, return to Build deck. If it is, set a
          meeting with the client, use Solution Finder, and pitch the found solutions. The journey ends back at the
          homepage.
        </desc>

        <defs>
          <marker
            id="halo-flow-arrow"
            markerUnits="userSpaceOnUse"
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth="11"
            markerHeight="11"
            orient="auto"
          >
            <path d="M 0 0.4 L 10 5 L 0 9.6 Z" fill={C.arrow} />
          </marker>
        </defs>

        <g fill="none" stroke={C.arrow} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d={`M ${TALK} ${speak.y + speak.h} V ${mergeY - 1}`} markerEnd={arrow} />
          <path d={`M ${TYPE} ${typeBox.y + typeBox.h} V ${mergeY - 1}`} markerEnd={arrow} />
          <path d={`M ${TALK} ${mergeY} H ${TYPE}`} />
        </g>

        <g fill="none" stroke={C.arrow} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d={`M ${CX} ${home.y + home.h} V ${inTop}`} markerEnd={arrow} />
          <path d={`M ${inLeft} ${inCy} H ${TALK} V ${choose.y}`} markerEnd={arrow} />
          <path d={`M ${TALK} ${choose.y + choose.h} V ${speak.y}`} markerEnd={arrow} />
          <path d={`M ${inRight} ${inCy} H ${TYPE} V ${typeBox.y}`} markerEnd={arrow} />
          <path d={`M ${CX} ${mergeY} V ${prepare.y}`} markerEnd={arrow} />
          <path d={`M ${CX} ${prepare.y + prepare.h} V ${deck.y}`} markerEnd={arrow} />
          <path d={`M ${CX} ${deck.y + deck.h} V ${build.y}`} markerEnd={arrow} />
          <path d={`M ${CX} ${build.y + build.h} V ${view.y}`} markerEnd={arrow} />
          <path d={`M ${CX} ${view.y + view.h} V ${satTop}`} markerEnd={arrow} />
          <path d={`M ${CX} ${satBot} V ${meeting.y}`} markerEnd={arrow} />
          <path d={`M ${CX} ${meeting.y + meeting.h} V ${finder.y}`} markerEnd={arrow} />
          <path d={`M ${CX} ${finder.y + finder.h} V ${found.y}`} markerEnd={arrow} />
          <path d={`M ${CX} ${found.y + found.h} V ${end.y}`} markerEnd={arrow} />
          <path d={`M ${satRight} ${satCy} H ${LOOP} V ${buildMid} H ${buildRight}`} markerEnd={arrow} />
        </g>

        <circle cx={CX} cy={mergeY} r={4.5} fill={C.arrow} />

        <EdgeLabel x={(inLeft + TALK) / 2} y={inCy - 18}>
          Talk
        </EdgeLabel>
        <EdgeLabel x={(inRight + TYPE) / 2} y={inCy - 18}>
          Type
        </EdgeLabel>
        <EdgeLabel x={CX + 18} y={(satBot + meeting.y) / 2} anchor="start">
          Yes
        </EdgeLabel>
        <EdgeLabel x={(satRight + LOOP) / 2} y={satCy - 18}>
          No
        </EdgeLabel>

        <Pill x={home.x} y={home.y} w={home.w} h={home.h} lines={["Homepage"]} />
        <Diamond cx={CX} cy={inCy} rx={inRx} ry={inRy} lines={["Input"]} size={16} />

        <Process
          x={choose.x}
          y={choose.y}
          w={choose.w}
          h={choose.h}
          lines={["Choose a voice", "Wave, Grove,", "Canyon, Meadow"]}
          size={14}
          gap={18}
        />
        <Process
          x={speak.x}
          y={speak.y}
          w={speak.w}
          h={speak.h}
          lines={["Speak the brief", "I'm listening"]}
        />
        <Process
          x={typeBox.x}
          y={typeBox.y}
          w={typeBox.w}
          h={typeBox.h}
          lines={["Type client needs", "and description"]}
        />

        <Process
          x={prepare.x}
          y={prepare.y}
          w={prepare.w}
          h={prepare.h}
          lines={["Prepare", "Prerequisite resources"]}
          fill={C.white}
          text={C.onLight}
          stroke={C.prepareStroke}
        />
        <Process
          x={deck.x}
          y={deck.y}
          w={deck.w}
          h={deck.h}
          lines={["Deck builder", "Industry, offerings,", "constraints"]}
          size={14}
          gap={18}
        />
        <Process x={build.x} y={build.y} w={build.w} h={build.h} lines={["Build deck"]} size={15} />
        <Process x={view.x} y={view.y} w={view.w} h={view.h} lines={["View generated deck"]} size={15} />

        <Diamond cx={CX} cy={satCy} rx={satRx} ry={satRy} lines={["Satisfied", "with the deck?"]} size={15} />

        <Process x={meeting.x} y={meeting.y} w={meeting.w} h={meeting.h} lines={["Set meeting", "with client"]} />
        <Process
          x={finder.x}
          y={finder.y}
          w={finder.w}
          h={finder.h}
          lines={["Solution Finder", "From prior choices"]}
        />
        <Process x={found.x} y={found.y} w={found.w} h={found.h} lines={["Found solutions", "to pitch"]} />
        <Pill x={end.x} y={end.y} w={end.w} h={end.h} lines={["Back to homepage"]} />
      </svg>
    </div>
  );
}
