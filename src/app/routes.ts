import { createBrowserRouter, redirect } from "react-router";
import { Root } from "./Root";
import { Homepage } from "./components/Homepage";
import { ProjectDetail } from "./pages/ProjectDetail";
import { PrismCaseStudy } from "./pages/PrismCaseStudy";
import { HaloCaseStudy } from "./pages/HaloCaseStudy";
import { ProductSCaseStudy } from "./pages/ProductSCaseStudy";
import { AboutPage } from "./pages/AboutPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Homepage },
      { path: "about", Component: AboutPage },
      { path: "projects/prism", Component: PrismCaseStudy },
      { path: "projects/halo-conversations", Component: HaloCaseStudy },
      { path: "projects/project-s", Component: ProductSCaseStudy },
      // Case studies still being written: not openable, straight back to the homepage.
      { path: "projects/thesis", loader: () => redirect("/") },
      { path: "projects/microsoft-showcase", loader: () => redirect("/") },
      { path: "projects/:slug", Component: ProjectDetail },
    ],
  },
]);
