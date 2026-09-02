import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import Link from "next/link";

const HeroCodeMockup = dynamic(() => import("./HeroCodeMockup"), {
  ssr: true,
  loading: () => (
    <div className="relative max-w-[440px] sm:max-w-[540px] lg:max-w-[620px] w-full h-[320px] sm:h-[400px] mx-auto lg:ml-auto rounded-xl bg-graphite/40 border border-white/10 animate-pulse" />
  ),
});

export const HeroSection = () => {
  return (
    <Section variant="white" className="!py-8 sm:!py-12 md:!py-16 lg:!py-20 relative overflow-hidden">
      {/* Soft Gradient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
        <div className="absolute top-0 -left-4 w-48 h-48 sm:w-72 sm:h-72 bg-primary/15 rounded-full mix-blend-multiply filter blur-2xl opacity-70" />
        <div className="absolute top-0 -right-4 w-48 h-48 sm:w-72 sm:h-72 bg-secondary/15 rounded-full mix-blend-multiply filter blur-2xl opacity-70" />
        <div className="absolute -bottom-8 left-20 w-48 h-48 sm:w-72 sm:h-72 bg-accent/15 rounded-full mix-blend-multiply filter blur-2xl opacity-70" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
        {/* Left Column - Critical LCP Content */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            India&apos;s outcome-driven MERN academy
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] mb-3 sm:mb-6 tracking-tight">
            <span className="font-script text-primary">Craft</span> the career.{" "}
            <br className="hidden sm:block" />
            We&apos;ll teach the code.
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed">
            Escape tutorial hell. Learn from engineers who ship in production,
            build real projects, and get hired — not just certified.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 max-w-md mx-auto lg:mx-0">
            <Button size="lg" className="w-full sm:w-auto shadow-md" asChild>
              <Link href="/courses">Explore Courses</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-white"
              asChild
            >
              <Link href="/partnerships">Talk to a Mentor</Link>
            </Button>
          </div>
        </div>

        {/* Right Column - Lazy Loaded Code Window Preview */}
        <HeroCodeMockup />
      </div>
    </Section>
  );
};
