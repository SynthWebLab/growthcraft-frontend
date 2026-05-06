import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const FinalCTA = () => {
  return (
    <Section variant="graphite" >
      <div className="text-center max-w-2xl mx-auto animate-fade-up px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-display text-white mb-3 sm:mb-4">
          Your craft starts here.
        </h2>
        <p className="text-base sm:text-lg text-white/60 mb-6 sm:mb-8">
          Join 4,200+ learners building real careers in tech.
        </p>
        <Button size="lg" asChild>
          <Link href="/courses">Start Learning</Link>
        </Button>
      </div>
    </Section>
  );
};
