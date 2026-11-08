import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PROJECTS } from "../data/projects";

const SCALE = 2;
const cache = new Map<string, ImageBitmap>();
const inflight = new Map<string, Promise<ImageBitmap>>();

function yieldThread() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}

function sizedSvgMarkup(svgText: string, scale: number) {
  const open = svgText.match(/<svg\b[^>]*>/);
  if (!open) return { markup: svgText, width: 1224 * scale, height: 816 * scale };

  let tag = open[0];
  const wMatch = tag.match(/\bwidth="([\d.]+)"/);
  const hMatch = tag.match(/\bheight="([\d.]+)"/);
  const vb = tag.match(/\bviewBox="([^"]+)"/);
  const vbParts = vb ? vb[1].trim().split(/[\s,]+/).map(Number) : null;
  const baseW = wMatch ? parseFloat(wMatch[1]) : vbParts ? vbParts[2] : 1224;
  const baseH = hMatch ? parseFloat(hMatch[1]) : vbParts ? vbParts[3] : 816;
  const width = Math.round(baseW * scale);
  const height = Math.round(baseH * scale);

  tag = wMatch ? tag.replace(/\bwidth="[\d.]+"/, `width="${width}"`) : tag.replace("<svg", `<svg width="${width}"`);
  tag = hMatch ? tag.replace(/\bheight="[\d.]+"/, `height="${height}"`) : tag.replace("<svg", `<svg height="${height}"`);

  return { markup: svgText.replace(open[0], tag), width, height };
}

async function rasterizeSvg(url: string): Promise<ImageBitmap> {
  const svgText = await fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    return res.text();
  });
  const { markup, width, height } = sizedSvgMarkup(svgText, SCALE);
  const blob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
  const blobUrl = URL.createObjectURL(blob);

  try {
    const img = new Image();
    img.width = width;
    img.height = height;
    img.src = blobUrl;
    await img.decode();
    return await createImageBitmap(img);
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

function snapshotFrost(url: string) {
  const cached = cache.get(url);
  if (cached) return Promise.resolve(cached);
  const pending = inflight.get(url);
  if (pending) return pending;

  const job = rasterizeSvg(url)
    .then((bitmap) => {
      cache.set(url, bitmap);
      return bitmap;
    })
    .finally(() => {
      inflight.delete(url);
    });
  inflight.set(url, job);
  return job;
}

async function fillCache(urls: string[], onUpdate: (next: Record<string, ImageBitmap>) => void) {
  for (const url of urls) {
    try {
      await snapshotFrost(url);
    } catch (err) {
      console.warn("Could not cache frost tile", url, err);
    }
    onUpdate(Object.fromEntries(cache));
    await yieldThread();
  }
}

/** Snapshot frost SVGs to bitmaps so dark-mode motion can run on cheap images. */
export function useFrostBitmaps(enabled = false) {
  const [, setVersion] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const urls = PROJECTS.map((project) => project.frost);
    void fillCache(urls, () => setVersion((n) => n + 1));
  }, [enabled]);

  return Object.fromEntries(cache);
}

/** Paints a cached frost snapshot. CSS-scaled like the live SVG tile. */
export function FrostBitmap({
  bitmap,
  radius,
}: {
  bitmap: ImageBitmap;
  radius: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (canvas.width !== bitmap.width) canvas.width = bitmap.width;
    if (canvas.height !== bitmap.height) canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0);
  }, [bitmap]);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      style={{ borderRadius: radius }}
    />
  );
}
