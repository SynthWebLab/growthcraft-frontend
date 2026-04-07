import { HeroSection } from "@/components/public/HeroSection";
import { AboutSection } from "@/components/public/AboutSection";
import { CourseCategories } from "@/components/public/CourseCategories";
import { BootcampsSection } from "@/components/public/BootcampsSection";
import { AudienceSection } from "@/components/public/AudienceSection";
import { PhilosophySection } from "@/components/public/PhilosophySection";
import { NewsletterSection } from "@/components/public/NewsletterSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <CourseCategories />
      <BootcampsSection />
      <AudienceSection />
      <PhilosophySection />
      <NewsletterSection />
    </>
  );
}
