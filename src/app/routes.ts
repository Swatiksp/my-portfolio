import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Homepage } from "./components/Homepage";
import { ProjectDetail } from "./pages/ProjectDetail";
import { PrismCaseStudy } from "./pages/PrismCaseStudy";
import { HaloCaseStudy } from "./pages/HaloCaseStudy";
import { ProductSCaseStudy } from "./pages/ProductSCaseStudy";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Homepage },
      { path: "projects/prism", Component: PrismCaseStudy },
      { path: "projects/halo-conversations", Component: HaloCaseStudy },
      { path: "projects/project-s", Component: ProductSCaseStudy },
      { path: "projects/:slug", Component: ProjectDetail },
    ],
  },
]);
