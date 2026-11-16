import type { ComponentType } from "react";
import { createBrowserRouter, redirect } from "react-router";
import { Root } from "./Root";
import { Homepage } from "./components/Homepage";

// Each page is its own chunk, so the homepage doesn't download the code for the case studies and About page.
// If a chunk fails to load (a stale tab after a deploy, a dropped connection), reload once instead of showing the
// router's "Importing a module script failed" error page.
const page = <T extends string>(load: () => Promise<Record<T, ComponentType>>, name: T) => async () => {
  try {
    const mod = await load();
    try { sessionStorage.removeItem("chunk-reload"); } catch { /* storage blocked */ }
    return { Component: mod[name] };
  } catch (err) {
    let retried = true;
    try { retried = sessionStorage.getItem("chunk-reload") === "1"; if (!retried) sessionStorage.setItem("chunk-reload", "1"); } catch { /* storage blocked */ }
    if (retried) throw err;
    window.location.reload();
    return new Promise<never>(() => {});
  }
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    HydrateFallback: () => null,
    children: [
      { index: true, Component: Homepage },
      { path: "about", lazy: page(() => import("./pages/AboutPage"), "AboutPage") },
      { path: "projects/prism", lazy: page(() => import("./pages/PrismCaseStudy"), "PrismCaseStudy") },
      { path: "projects/halo-conversations", lazy: page(() => import("./pages/HaloCaseStudy"), "HaloCaseStudy") },
      { path: "projects/project-s", lazy: page(() => import("./pages/ProductSCaseStudy"), "ProductSCaseStudy") },
      // Case studies still being written: not openable, straight back to the homepage.
      { path: "projects/thesis", loader: () => redirect("/") },
      { path: "projects/microsoft-showcase", loader: () => redirect("/") },
      { path: "projects/:slug", lazy: page(() => import("./pages/ProjectDetail"), "ProjectDetail") },
    ],
  },
]);
