import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const SANS = "'Roboto', sans-serif";

/**
 * A figure that opens larger on click. Big diagrams (the mind map, the maps, the flows) are too
 * detailed to read inline, so the page shows them at page width and the viewer can open them.
 * In the viewer, click the image to switch between "fit to screen" and full size.
 */
export function ExpandableImage({
  src,
  alt,
  width,
  height,
  caption,
  radius = 10,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  radius?: number;
}) {
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setFull(false);
  };

  return (
    <figure className="m-0 w-full" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open larger: ${alt}`}
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          padding: 0,
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: radius,
          overflow: "hidden",
          background: "#fff",
          cursor: "zoom-in",
        }}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          draggable={false}
          style={{ display: "block", width: "100%", height: "auto" }}
        />
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: 12,
            bottom: 12,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: 999,
            background: "rgba(236,236,236,0.8)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            border: "1px solid rgba(0,0,0,0.06)",
            color: "rgba(0,0,0,0.72)",
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M7 1h4v4M5 11H1V7M11 1 7.5 4.5M1 11l3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Click to enlarge
        </span>
      </button>
      {caption && (
        <figcaption style={{ fontFamily: SANS, fontSize: 13, lineHeight: "18px", color: "rgba(0,0,0,0.5)", textAlign: "center" }}>
          {caption}
        </figcaption>
      )}

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onClick={close}
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(8,8,8,0.92)", display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                padding: "14px 20px",
                fontFamily: SANS,
                color: "#fff",
                fontSize: 13,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <span style={{ color: "rgba(255,255,255,0.65)" }}>{full ? "Click the image to fit the screen" : "Click the image for full size"}</span>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.3)",
                  background: "transparent",
                  color: "#fff",
                  fontFamily: SANS,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
            <div style={{ flex: 1, minHeight: 0, overflow: "auto", display: "flex", justifyContent: "center", alignItems: full ? "flex-start" : "center", padding: "0 20px 20px" }}>
              <img
                src={src}
                alt={alt}
                draggable={false}
                onClick={(e) => {
                  e.stopPropagation();
                  setFull((f) => !f);
                }}
                style={
                  full
                    ? { display: "block", width, height, maxWidth: "none", cursor: "zoom-out", background: "#fff" }
                    : { display: "block", maxWidth: "100%", maxHeight: "100%", objectFit: "contain", cursor: "zoom-in", background: "#fff" }
                }
              />
            </div>
          </div>,
          document.body,
        )}
    </figure>
  );
}
