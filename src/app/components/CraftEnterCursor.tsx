import { useEffect, useRef, type RefObject } from "react";
import { GearsIcon } from "./GearsIcon";

/**
 * ENTER follows the pointer while a My Craft card is hovered, replacing the system cursor.
 */
export function useCraftEnterCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const enter = enterRef.current;
    if (!root || !enter) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    const host = root.closest(".craft-card-face") ?? root;
    let raf = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      raf = 0;
      enter.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      const box = root.getBoundingClientRect();
      x = e.clientX - box.left;
      y = e.clientY - box.top;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerenter", onMove);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerenter", onMove);
    };
  }, []);

  return { rootRef, enterRef };
}

export function CraftEnterLabel({ labelRef, soon = false }: { labelRef: RefObject<HTMLSpanElement | null>; soon?: boolean }) {
  return (
    <span ref={labelRef} className="prism-craft-enter" aria-hidden>
      <span className={`prism-craft-enter-face${soon ? " prism-craft-enter-soon" : ""}`}>{soon ? <GearsIcon size={26} /> : "ENTER"}</span>
    </span>
  );
}
