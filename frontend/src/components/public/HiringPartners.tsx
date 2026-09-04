import { Section } from "@/components/ui/section";

interface Partner {
  name: string;
  logo?: string;
  scale?: number;
}

const companies: Partner[] = [
  {
    name: "Digital Panda",
    logo: "/logos/digital panda axom.webp",
    scale: 1,
  },
  {
    name: "VisualVerse",
    logo: "/logos/visualverse.webp",
    scale: 1,
  },
  {
    name: "Cairn",
    logo: "/logos/cairn2.webp",
    scale: 1,
  },
  {
    name: "TORUS",
    logo: "/logos/TORUS.webp",
    scale: 1,
  },
  {
    name: "Qurios",
    logo: "/logos/quorios.webp",
    scale: 1,
  },
  {
    name: "SynthWeb",
    logo: "/logos/synthweb.webp",
    scale: 1,
  },
  {
    name: "Social Stories",
    logo: "/logos/socialstories.webp",
    scale: 1,
  },
];

export const HiringPartners = () => {
  return (
    <Section variant="white" className="!py-8 sm:!py-12 md:!py-16 lg:!py-20">
      <div className="text-center mb-8 sm:mb-12 md:mb-14 animate-fade-up">
        <p className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground mb-2 sm:mb-3 font-semibold">
          Hiring partners
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display">
          Where our students get hired.
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
        {companies.map((company) => (
          <div
            key={company.name}
            className="flex items-center justify-center h-20 sm:h-24 md:h-28 rounded-xl bg-card border border-border/60 hover:border-magenta/30 p-4 transition-all hover:shadow-xs overflow-hidden"
          >
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                style={{ transform: `scale(${company.scale || 1})` }}
                className="w-full h-full object-contain hover:grayscale-0 transition-all"
              />
            ) : (
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                {company.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
};
