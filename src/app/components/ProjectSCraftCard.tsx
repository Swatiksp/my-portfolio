import bg from "@/assets/craft-poster/s-bg.webp";
import shot from "@/assets/craft-poster/s-shot.webp";
import ibm from "@/assets/craft-poster/ibm.png";
import { CraftPosterCard } from "./CraftPosterCard";

export function ProjectSCraftCard() {
  return (
    <CraftPosterCard
      variant="s"
      bg={bg}
      shot={shot}
      shotAlt="SpecTrim spec map with the review list"
      brand={
        <div className="poster-brand poster-brand-ibm">
          <img src={ibm} alt="IBM" />
        </div>
      }
      headline={
        <>
          Catch <em>missing context</em> before the code is written
        </>
      }
      tags={["Agentic AI", "Developer tools"]}
    />
  );
}
