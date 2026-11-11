import { useSyncExternalStore } from "react";

const QUERY = "(max-width: 767px)";

/** True on phone-sized windows (iPhone width and below). Desktop and tablet layouts never see this. */
export function useIsMobile() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(QUERY);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
