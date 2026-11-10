import bg from "@/assets/craft-poster/p-bg.webp";
import shot from "@/assets/craft-poster/p-shot.webp";
import logo from "@/assets/craft-poster/prism-logo.png";
import { CraftPosterCard } from "./CraftPosterCard";

export function PrismCraftCard() {
  return (
    <CraftPosterCard
      variant="p"
      bg={bg}
      shot={shot}
      shotAlt="Prism workspace for intelligence editors"
      brand={
        <div className="poster-brand poster-brand-prism">
          <img src={logo} alt="Prism" />
        </div>
      }
      headline={
        <>
          Sanitize sensitive reports with AI, and <em>stay in control</em>
        </>
      }
      tags={["Agentic AI", "Non-Standard Utility Tool"]}
    />
  );
}
