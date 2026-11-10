import bg from "@/assets/craft-poster/h-bg.webp";
import shot from "@/assets/craft-poster/h-shot.webp";
import logo from "@/assets/craft-poster/halo-logo.svg";
import { CraftPosterCard } from "./CraftPosterCard";

export function HaloCraftCard() {
  return (
    <CraftPosterCard
      variant="h"
      bg={bg}
      shot={shot}
      shotAlt="Halo Conversations launch page in Microsoft Copilot"
      brand={
        <div className="poster-brand">
          <img src={logo} alt="Halo Conversations" />
        </div>
      }
      headline={
        <>
          Turn a client conversation into a <em>tailored deck</em>
        </>
      }
      tags={["Generative AI", "AI presentation tool"]}
    />
  );
}
