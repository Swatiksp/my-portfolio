import { useCallback, useSyncExternalStore } from "react";

/**
 * Site-wide light / dark setting. One value, shared by every page: it lives on <html data-theme="…"> (so CSS can
 * react to it) and in localStorage (so it survives a reload and carries from page to page). Light is the default.
 * Importing this module applies the saved choice straight away, before React renders, so there is no flash.
 */
export type Theme = "light" | "dark";

const KEY = "swatik-theme";

function read(): Theme {
  try {
    return localStorage.getItem(KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

let current: Theme = read();
const listeners = new Set<() => void>();

function apply() {
  const root = document.documentElement;
  root.dataset.theme = current;
  root.style.colorScheme = current;
}
apply();

export function setTheme(next: Theme) {
  if (next === current) return;
  current = next;
  apply();
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* private mode: the choice still holds for this visit */
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => void listeners.delete(l);
};

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, () => current, () => "light" as Theme);
  const toggle = useCallback(() => setTheme(current === "dark" ? "light" : "dark"), []);
  return { theme, dark: theme === "dark", toggle };
}
