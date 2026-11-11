import accenture from "@/assets/companies/accenture.webp";
import microsoft from "@/assets/companies/microsoft.webp";
import avanade from "@/assets/companies/avanade.svg";
import { CraftPosterCard } from "./CraftPosterCard";
import { PROJECTS } from "../data/projects";

// A blank gradient stands in for the interface until the screens are ready.
const screen = `data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='1440' height='900' viewBox='0 0 1440 900'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#d9a257'/><stop offset='0.55' stop-color='#cf6a35'/><stop offset='1' stop-color='#7a3b2a'/></linearGradient></defs><rect width='1440' height='900' fill='url(#g)'/></svg>",
)}`;

export function ShowcaseCraftCard() {
  const tags = PROJECTS.find((p) => p.slug === "microsoft-showcase")?.tags ?? [];
  return (
    <CraftPosterCard
      variant="m"
      soon
      screenNote={"Under construction\ncoming soon"}
      shot={screen}
      shotAlt=""
      brand={
        <div className="poster-brand poster-brand-trio">
          <img src={accenture} alt="Accenture" />
          <img src={microsoft} alt="Microsoft" />
          <img src={avanade} alt="Avanade" />
        </div>
      }
      headline={
        <>
          One place for sellers to find <em>tools and content</em>
        </>
      }
      tags={tags}
    />
  );
}
