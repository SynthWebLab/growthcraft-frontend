import { HeroSection } from "@/components/public/HeroSection";
import { TrustStrip } from "@/components/public/TrustStrip";
import { PainPath } from "@/components/public/PainPath";
import { HowItWorks } from "@/components/public/HowItWorks";
import { FeaturedCourses } from "@/components/public/FeaturedCourses";
import { BootcampHighlight } from "@/components/public/BootcampHighlight";
import { FivePaths } from "@/components/public/FivePaths";
import { MentorShowcase } from "@/components/public/MentorShowcase";
import { Outcomes } from "@/components/public/Outcomes";
import { HiringPartners } from "@/components/public/HiringPartners";
import { FAQ } from "@/components/public/FAQ";
import { FinalCTA } from "@/components/public/FinalCTA";
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
      <TrustStrip />
      <PainPath />
      <HowItWorks />
      <FeaturedCourses />
      <BootcampHighlight />
      <FivePaths />
      <MentorShowcase />
      <Outcomes />
      <HiringPartners />
      <FAQ />
      <FinalCTA />
      {/* <AboutSection />
      <CourseCategories />
      <BootcampsSection />
      <AudienceSection />
      <PhilosophySection />
      <NewsletterSection /> */}
    </>
  );
}
