import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const FinalCTA = () => {
  return (
    <Section variant="graphite" className="!py-12 sm:!py-16 md:!py-20">
      <div className="text-center max-w-2xl mx-auto animate-fade-up px-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-display text-white mb-3 sm:mb-4 tracking-tight">
          Your craft starts here.
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-white/60 mb-6 sm:mb-8 leading-relaxed max-w-lg mx-auto">
          Join 4,200+ learners building real careers in tech with hands-on campus training.
        </p>
        <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-magenta/25 text-sm sm:text-base px-8 py-3.5" asChild>
          <Link href="/courses">Start Learning</Link>
        </Button>
      </div>
    </Section>
  );
};
