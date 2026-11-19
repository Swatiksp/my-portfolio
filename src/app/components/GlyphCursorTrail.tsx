import { useEffect, useRef } from "react";

/* ───────────── Cursor glyph trail ─────────────
   Reference: "Clip for cursor.mov". A fixed grid of items covers the page. Moving the pointer wakes the cells around
   it: they swell from a pinpoint to full size close to the pointer, and shrink back as the pointer moves away. The
   wake lags behind the pointer and fades over about a second; a resting pointer leaves nothing behind.

   The items are glyphs from Yarndings 12 (Figma "Yarndings 12", node 779:1481): q, k, r and s, in #f2ddcc. Each cell
   always shows the same glyph, picked from the four.

   On a touch screen there is no cursor, so scrolling does the waking: the pattern follows the finger while it drags
   the page (or the middle of the screen when nothing is touching it), swells with how fast the page is moving, and
   fades once it stops. */

const GLYPHS = ["q", "k", "r", "s"] as const;
const COLOR = "#f2ddcc";
const FONT = "'Yarndings 12'";

const FOLLOW = 0.16; // how quickly the wake chases the pointer (per 60fps frame)
const FADE_SECONDS = 0.55; // heat decays with this time constant
const REACH_CELLS = 5.5; // radius of the wake, in cells
const MIN_SIZE = 3; // px, a cell that has only just woken
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (x: number) => x * x * (3 - 2 * x);

type Cell = { x: number; y: number; glyph: string; threshold: number; heat: number };

export function GlyphCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // A mouse or trackpad wakes it by moving; a touch screen wakes it by scrolling. Nothing for people who ask for less motion.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touch = !fine.matches;
    if (reduce.matches) return;

    let cells: Cell[] = [];
    let spacing = 44;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let ready = false;
    let alive = true;

    const pointer = { x: 0, y: 0, seen: false };
    const wake = { x: 0, y: 0 };
    let scrollDrive = 0; // touch screens: how fast the page is moving, 0..1
    let lastScrollY = window.scrollY;
    let lastScrollAt = 0;

    const layout = () => {
      dpr = Math.min(window.devicePixelRatio || 1, touch ? 1.5 : 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      spacing = clamp(w * 0.032, 34, 52);
      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;
      const offX = (w - (cols - 1) * spacing) / 2;
      const offY = (h - (rows - 1) * spacing) / 2;
      cells = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // A stable pseudo-random value per cell, so the pattern doesn't change when the window resizes.
          const n = Math.abs(Math.sin((c + 1) * 127.1 + (r + 1) * 311.7) * 43758.5453);
          const rnd = n - Math.floor(n);
          cells.push({
            x: offX + c * spacing,
            y: offY + r * spacing,
            glyph: GLYPHS[Math.floor(rnd * 4) % 4],
            threshold: ((rnd * 97) % 1) * 0.3, // ragged edge to the wake
            heat: 0,
          });
        }
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (!alive) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;

      // The wake chases the pointer; the faster it travels, the more it wakes.
      const prevX = wake.x;
      const prevY = wake.y;
      const k = 1 - Math.pow(1 - FOLLOW, dt * 60);
      wake.x += (pointer.x - wake.x) * k;
      wake.y += (pointer.y - wake.y) * k;
      const speed = Math.hypot(wake.x - prevX, wake.y - prevY) / (dt * 60);
      scrollDrive *= Math.exp(-dt / 0.25);
      const drive = Math.max(clamp(speed / 5, 0, 1), scrollDrive);

      const reach = spacing * REACH_CELLS;
      const decay = Math.exp(-dt / FADE_SECONDS);
      const maxSize = spacing * 0.98;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = COLOR;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let any = false;
      let lastStep = -1;
      for (const cell of cells) {
        if (drive > 0.01) {
          const d = Math.hypot(cell.x - wake.x, cell.y - wake.y);
          if (d < reach) {
            const gain = Math.pow(1 - d / reach, 1.4) * drive * 1.6;
            if (gain > cell.heat) cell.heat = Math.min(1, cell.heat + (gain - cell.heat) * 0.5);
          }
        }
        cell.heat *= decay;
        if (cell.heat < 0.01) {
          cell.heat = 0;
          continue;
        }
        any = true;

        const t = clamp((cell.heat - cell.threshold) / (1 - cell.threshold), 0, 1);
        const size = MIN_SIZE + (maxSize - MIN_SIZE) * smooth(t);
        ctx.globalAlpha = clamp(0.25 + cell.heat * 1.2, 0, 1);
        // the font string only changes when the size steps by half a pixel, which saves a style parse per glyph
        const step = Math.round(size * 2);
        if (step !== lastStep) {
          lastStep = step;
          ctx.font = `${(step / 2).toFixed(1)}px ${FONT}`;
        }
        ctx.fillText(cell.glyph, cell.x, cell.y);
      }
      ctx.globalAlpha = 1;

      // Keep running while the wake is still moving or fading; otherwise sleep until the next mouse move.
      if (any || drive > 0.01 || scrollDrive > 0.01 || Math.hypot(pointer.x - wake.x, pointer.y - wake.y) > 0.5) {
        raf = requestAnimationFrame(frame);
      }
    };

    const wakeUp = () => {
      if (!raf && ready && alive) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!pointer.seen) {
        pointer.seen = true;
        wake.x = e.clientX;
        wake.y = e.clientY;
      }
      wakeUp();
    };
    const onLeave = () => {
      pointer.seen = false;
    };
    const onResize = () => {
      // Safari's toolbars sliding away resize the window by a few dozen pixels on every scroll: not worth rebuilding the canvas for
      if (touch && window.innerWidth === w && window.innerHeight <= h) return;
      layout();
      wakeUp();
    };

    // Touch screens: the pattern rides on the finger while it drags, and on the page's own speed afterwards.
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      pointer.x = t.clientX;
      pointer.y = t.clientY;
      if (!pointer.seen) {
        pointer.seen = true;
        wake.x = t.clientX;
        wake.y = t.clientY;
      }
      wakeUp();
    };
    const onScroll = () => {
      const now = performance.now();
      const dy = Math.abs(window.scrollY - lastScrollY);
      const dt = Math.max(8, now - lastScrollAt);
      lastScrollY = window.scrollY;
      lastScrollAt = now;
      // px per ms: a slow drag is about 0.3, a flick 2 or more
      scrollDrive = Math.max(scrollDrive, clamp((dy / dt) / 1.2, 0, 1));
      if (!pointer.seen) {
        pointer.x = w / 2;
        pointer.y = h * 0.55;
        wake.x = pointer.x;
        wake.y = pointer.y;
        pointer.seen = true;
      }
      wakeUp();
    };

    layout();
    document.fonts
      .load(`20px ${FONT}`)
      .catch(() => {})
      .finally(() => {
        ready = true;
      });

    if (touch) {
      window.addEventListener("touchstart", onTouch, { passive: true });
      window.addEventListener("touchmove", onTouch, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    window.addEventListener("resize", onResize);
    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed left-0 top-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
