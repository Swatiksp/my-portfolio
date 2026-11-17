import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useIsMobile } from "../lib/useIsMobile";
import logoMark from "@/assets/logo/logo.svg";
import { GearsIcon } from "./GearsIcon";

/** Shown on phone-sized screens: the mobile version is still being built, so a desktop browser is best. */
export function MobileNotice() {
  const isMobile = useIsMobile();
  const open = isMobile;
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Nothing behind the notice can be reached with the keyboard either.
    const root = document.getElementById("root");
    root?.setAttribute("inert", "");
    return () => {
      document.body.style.overflow = prev;
      root?.removeAttribute("inert");
    };
  }, [open]);

  // The system cursor is replaced by the under-construction icon (the one on the last two My Craft cards).
  useEffect(() => {
    if (!open) return;
    const cursor = cursorRef.current;
    if (!cursor) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      cursor.style.opacity = "1";
    };
    const onLeave = () => {
      cursor.style.opacity = "0";
    };
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [open]);

  if (!open) return null;

  // Rendered on <body>, outside #root, so #root can be made inert while the notice shows.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-notice-title"
      className="mobile-notice fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 9999,
        background: "var(--page)",
        paddingInline: "max(24px, env(safe-area-inset-left, 0px))",
        paddingBlock: "max(24px, env(safe-area-inset-top, 0px))",
      }}
    >
      <div className="flex flex-col items-center text-center" style={{ maxWidth: 340, gap: 20 }}>
        <img src={logoMark} alt="" width={56} height={56} style={{ borderRadius: 8, display: "block" }} />
        <h2
          id="mobile-notice-title"
          className="m-0"
          style={{
            fontFamily: "'Newsreader', 'Iowan Old Style', Georgia, serif",
            fontWeight: 400,
            fontSize: 30,
            lineHeight: "36px",
            letterSpacing: "-0.02em",
            color: "var(--ink)",
          }}
        >
          The mobile version is still being built
        </h2>
        <p className="m-0" style={{ fontFamily: "'Roboto', sans-serif", fontSize: 17, lineHeight: "26px", color: "var(--ink)" }}>
          For the best viewing experience, open this site in a desktop browser.
        </p>
      </div>
      <span
        ref={cursorRef}
        aria-hidden
        style={{ position: "fixed", top: 0, left: 0, zIndex: 1, pointerEvents: "none", opacity: 0, transition: "opacity 0.12s ease" }}
      >
        <span
          className="prism-craft-enter-face prism-craft-enter-soon"
          style={{ background: "var(--btn-bg)", color: "var(--btn-fg)", border: "1px solid var(--btn-bg)", textShadow: "none" }}
        >
          <GearsIcon size={26} />
        </span>
      </span>
    </div>,
    document.body,
  );
}
