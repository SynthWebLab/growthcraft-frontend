import type { Metadata } from "next";
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
import { JsonLd } from "@/components/seo/JsonLd";
import { SEO_CONFIG } from "@/config/seo.config";

export async function generateMetadata(): Promise<Metadata> {
  const seo = SEO_CONFIG.homepage;

  return {
    title: seo.meta.title,
    description: seo.meta.description,
    keywords: seo.meta.keywords,
    alternates: {
      canonical: seo.meta.canonical,
    },
    openGraph: {
      title: seo.openGraph.title,
      description: seo.openGraph.description,
      url: seo.openGraph.url,
      siteName: seo.openGraph.siteName,
      images: [
        {
          url: seo.openGraph.image,
          width: 1200,
          height: 630,
          alt: seo.openGraph.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitter.title,
      description: seo.twitter.description,
      images: [seo.twitter.image],
      site: seo.twitter.site,
      creator: seo.twitter.creator,
    },
  };
}

export default function Home() {
  const seo = SEO_CONFIG.homepage;

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd data={seo.jsonLd.organization} />
      <JsonLd data={seo.jsonLd.website} />
      {seo.jsonLd.breadcrumb && <JsonLd data={seo.jsonLd.breadcrumb} />}

      {/* Page Content */}
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
    </>
  );
}
