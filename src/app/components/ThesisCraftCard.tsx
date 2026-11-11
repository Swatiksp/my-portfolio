import { CraftPosterCard } from "./CraftPosterCard";
import { PROJECTS } from "../data/projects";

// A blank gradient stands in for the interface until the screens are ready.
const screen = `data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='1440' height='900' viewBox='0 0 1440 900'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#7ea58a'/><stop offset='0.55' stop-color='#3f7a58'/><stop offset='1' stop-color='#17382a'/></linearGradient></defs><rect width='1440' height='900' fill='url(#g)'/></svg>",
)}`;

export function ThesisCraftCard() {
  const tags = PROJECTS.find((p) => p.slug === "thesis")?.tags ?? [];
  return (
    <CraftPosterCard
      variant="t"
      soon
      screenNote={"Under construction\ncoming soon"}
      shot={screen}
      shotAlt=""
      brand={null}
      headline={
        <>
          Turn wearable health data into <em>actionable insights</em>
        </>
      }
      tags={tags}
    />
  );
}
