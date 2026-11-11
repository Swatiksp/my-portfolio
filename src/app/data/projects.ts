import tile1 from "@/assets/tiles/tile-1.png";
import tile2 from "@/assets/tiles/tile-2.png";
import tile3 from "@/assets/tiles/tile-3.png";
import tile4 from "@/assets/tiles/tile-4.png";
import tile5 from "@/assets/tiles/tile-5.png";
import frost1 from "@/assets/tiles/frost/tile-1.svg";
import frost2 from "@/assets/tiles/frost/tile-2.svg";
import frost3 from "@/assets/tiles/frost/tile-3.svg";
import frost4 from "@/assets/tiles/frost/tile-4.svg";
import frost5 from "@/assets/tiles/frost/tile-5.svg";

export interface Project {
  id: number;
  slug: string;
  title: string;
  desc: string;
  tags: string[];
  image: string;
  frost: string;
  /** "soon": the case study is still being written, so the card is shown but can't be opened. */
  status?: "soon";
}

export const PROJECTS: Project[] = [
  {
    id: 0,
    slug: "prism",
    title: "Prism",
    desc: "Designing an AI workspace for intelligence editors",
    tags: ["Agentic AI", "Non-Standard Utility Tool"],
    image: tile1,
    frost: frost1,
  },
  {
    id: 1,
    slug: "halo-conversations",
    title: "Halo Conversations",
    desc: "Reimagining Microsoft Copilot to generate tailor-made presentations for sales conversations",
    tags: ["Microsoft Copilot", "Generative AI", "Conversant AI"],
    image: tile2,
    frost: frost2,
  },
  {
    id: 2,
    slug: "project-s",
    title: "SpecTrim",
    desc: "SpecTrim catches missing context before an AI agent writes code.",
    tags: ["Agentic AI", "Developer tools", "Service design", "Specification-driven development"],
    image: tile3,
    frost: frost3,
  },
  {
    id: 3,
    slug: "microsoft-showcase",
    title: "Microsoft Showcase",
    desc: "Website UI design for Microsoft’s federated sales enablement platform, bringing sellers’ tools and content into one place.",
    tags: ["Website UI Design", "Sales Enablement"],
    image: tile5,
    frost: frost5,
    status: "soon",
  },
  {
    id: 4,
    slug: "thesis",
    title: "Thesis Project",
    desc: "A health wearable interface that helps patients living with both diabetes and thyroid conditions break their data down into actionable insights.",
    tags: ["Health Wearable Interface", "M Health", "Data Visualization", "Agentic AI"],
    image: tile4,
    frost: frost4,
    status: "soon",
  },
];

export const isOpenable = (p: Project) => p.status !== "soon";
