import { memo } from "react";
import microsoft from "@/assets/companies/microsoft.webp";
import accenture from "@/assets/companies/accenture.webp";
import avanade from "@/assets/companies/avanade.svg";
import ibm from "@/assets/companies/ibm.webp";
import ncstate from "@/assets/companies/ncstate.webp";
import las from "@/assets/companies/las.png";

const LOGOS = [
  { name: "Microsoft", src: microsoft },
  { name: "Accenture", src: accenture },
  { name: "Avanade", src: avanade },
  { name: "IBM", src: ibm },
  { name: "NC State University", src: ncstate },
  { name: "Laboratory for Analytic Sciences", src: las },
];

/** Auto-scrolling row of the places I've worked with. All logos share one height and are greyed to monochrome. */
export const CompanyMarquee = memo(function CompanyMarquee({ dark }: { dark: boolean }) {
  const row = (hidden: boolean) =>
    LOGOS.map((l) => (
      <img
        key={l.name + (hidden ? "-b" : "")}
        src={l.src}
        alt={hidden ? "" : l.name}
        aria-hidden={hidden || undefined}
        className={`company-logo${dark ? " company-logo-dark" : ""}`}
        draggable={false}
      />
    ));
  return (
    <div className="company-marquee" aria-label="Companies and teams I have worked with">
      <div className="company-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
});
