import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { TypeIn } from "./TypeIn";

const GLYPHS = ["q", "k", "r", "s"];

function rand(i: number, j: number) {
  const n = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * Yarndings 12 field for the hero, drawn on one canvas (hundreds of DOM glyphs meant hundreds of GPU layers).
 * Characters start at the top right and thin out as they spread (fewer characters, not fainter ones). A bright head
 * runs down each column so it looks like they rain, but none move. The characters nearest the pointer grow a little.
 */
type GlyphCell = { x: number; y: number; col: number; row: number; base: number; glyph: string };

export function GlyphField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !hero || !ctx) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const TAIL = 5;

    let visible = true;
    let cells: GlyphCell[] = [];
    let cols = new Map<number, { pos: number; speed: number }>();
    let opacity: number[] = []; // current opacity per cell
    let hit: boolean[] = [];
    let W = 0;
    let H = 0;
    let cell = 24;
    let size = 24;
    let dpr = 1;
    let color = "#fff";
    let alive = true;

    // pointer, eased so characters grow and settle smoothly
    let mx = 0;
    let my = 0;
    let strength = 0; // 0..1, eases toward 1 while the pointer is inside
    let wantStrength = 0;
    let raf = 0;

    const draw = () => {
      raf = 0;
      if (!alive) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const reach = Math.max(60, W * 0.07);
      let lastFont = "";
      for (let n = 0; n < cells.length; n++) {
        const c = cells[n];
        let sc = 1;
        if (strength > 0.01) {
          const d = Math.hypot(c.x - mx, c.y - my);
          if (d < reach) sc = 1 + 0.4 * Math.pow(1 - d / reach, 1.5) * strength;
        }
        const font = `${(size * sc).toFixed(1)}px "Yarndings 12", sans-serif`;
        if (font !== lastFont) {
          ctx.font = font;
          lastFont = font;
        }
        ctx.globalAlpha = opacity[n];
        ctx.fillText(c.glyph, c.x, c.y);
      }
      ctx.globalAlpha = 1;
      // keep easing the pointer strength until it settles
      const diff = wantStrength - strength;
      if (Math.abs(diff) > 0.01) {
        strength += diff * 0.25;
        queue();
      } else if (strength !== wantStrength) {
        strength = wantStrength;
        queue();
      }
    };
    const queue = () => {
      if (!raf && alive) raf = requestAnimationFrame(draw);
    };

    const build = () => {
      W = hero.clientWidth;
      H = hero.clientHeight;
      if (!W || !H) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      color = getComputedStyle(hero).getPropertyValue("--glyph").trim() || "#fff";
      const narrow = W <= 700;
      cell = narrow ? 24 : W * 0.0235;
      size = cell * 1.05;
      const reachX = narrow ? W : W * 0.7;
      const reachY = narrow ? H * 0.9 : H * 1.5;
      const nCols = Math.ceil(W / cell) + 1;
      const nRows = Math.ceil(H / cell) + 1;
      cells = [];
      for (let j = 0; j < nRows; j++) {
        for (let i = 0; i < nCols; i++) {
          const cx = i * cell + cell / 2;
          const cy = j * cell + cell / 2;
          const d = Math.sqrt((cx / reachX) ** 2 + (cy / reachY) ** 2);
          if (d > 1) continue;
          const density = Math.pow(1 - d, 1.6);
          if (rand(i * 3 + 1, j * 7 + 2) > Math.min(1, density * 1.15)) continue;
          cells.push({
            x: W - i * cell - cell / 2,
            y: j * cell + cell / 2,
            col: i,
            row: j,
            base: 0.55 + 0.45 * density,
            glyph: GLYPHS[Math.floor(rand(j + 5, i + 9) * 4)],
          });
        }
      }
      opacity = cells.map((c) => c.base);
      hit = cells.map(() => false);
      cols = new Map();
      cells.forEach((c) => {
        if (!cols.has(c.col)) cols.set(c.col, { pos: -Math.random() * 30, speed: 0.12 + Math.random() * 0.3 });
      });
      queue();
    };

    build();
    let roFrame = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(roFrame);
      roFrame = requestAnimationFrame(build);
    });
    ro.observe(hero);
    // the glyph font has to be ready before the canvas can draw with it
    document.fonts?.load('16px "Yarndings 12"').then(queue).catch(() => {});
    document.fonts?.ready.then(queue);

    const io = new IntersectionObserver((e) => {
      visible = e[0].isIntersecting;
    });
    io.observe(hero);

    let timer: number | undefined;
    if (!calm) {
      timer = window.setInterval(() => {
        if (!visible || document.hidden) return;
        cols.forEach((col) => {
          col.pos += col.speed;
          if (col.pos > 60) {
            col.pos = -Math.random() * 25;
            col.speed = 0.12 + Math.random() * 0.3;
          }
        });
        for (let n = 0; n < cells.length; n++) {
          const c = cells[n];
          const col = cols.get(c.col)!;
          const d = col.pos - c.row;
          if (d >= 0 && d < TAIL) {
            if (d < col.speed + 0.01 || (d < 1 && !hit[n])) {
              c.glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
              hit[n] = true;
            }
            opacity[n] = c.base + (1 - c.base) * (1 - d / TAIL);
          } else if (hit[n]) {
            hit[n] = false;
            opacity[n] = c.base;
          }
        }
        queue();
      }, 90);
    }

    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
      wantStrength = 1;
      queue();
    };
    const onLeave = () => {
      wantStrength = 0;
      queue();
    };
    if (fine && !calm) {
      hero.addEventListener("pointermove", onMove, { passive: true });
      hero.addEventListener("pointerleave", onLeave);
    }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(roFrame);
      ro.disconnect();
      io.disconnect();
      if (timer) window.clearInterval(timer);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="case-hero-glyphs" aria-hidden />;
}

export function HeroPill({ children, start }: { children: string; start?: number }) {
  return (
    <span className="case-hero-pill">
      <TypeIn text={children} start={start} />
    </span>
  );
}

/** Case study hero: art, glyph field, dark gradient with white text at the bottom left, interface in front. */
export function CaseHero({
  bg,
  shot,
  shotAlt,
  glyph,
  bgRotate = 0,
  children,
}: {
  bg: string;
  shot: string;
  shotAlt: string;
  glyph: string;
  bgRotate?: number;
  children: ReactNode;
}) {
  return (
    <div className="case-hero" style={{ ["--glyph" as string]: glyph, ["--bg-rot" as string]: `${bgRotate}deg` }}>
      <img className="case-hero-bg" src={bg} alt="" />
      <GlyphField />
      <div className="case-hero-shade" aria-hidden />
      <div className="case-hero-copy">{children}</div>
      <div className="case-hero-shot">
        <img src={shot} alt={shotAlt} />
      </div>
    </div>
  );
}
