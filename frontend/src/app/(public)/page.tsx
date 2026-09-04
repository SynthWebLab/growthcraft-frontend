import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/public/HeroSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { SEO_CONFIG } from "@/config/seo.config";

const TrustStrip = dynamic(() => import("@/components/public/TrustStrip").then((m) => m.TrustStrip));
const PainPath = dynamic(() => import("@/components/public/PainPath").then((m) => m.PainPath));
const HowItWorks = dynamic(() => import("@/components/public/HowItWorks").then((m) => m.HowItWorks));
const FeaturedCourses = dynamic(() => import("@/components/public/FeaturedCourses").then((m) => m.FeaturedCourses));
const BootcampHighlight = dynamic(() => import("@/components/public/BootcampHighlight").then((m) => m.BootcampHighlight));
const MentorShowcase = dynamic(() => import("@/components/public/MentorShowcase").then((m) => m.MentorShowcase));
const Outcomes = dynamic(() => import("@/components/public/Outcomes").then((m) => m.Outcomes));
const HiringPartners = dynamic(() => import("@/components/public/HiringPartners").then((m) => m.HiringPartners));
const PlatformAndFaqHub = dynamic(() => import("@/components/public/PlatformAndFaqHub").then((m) => m.PlatformAndFaqHub));

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
      <PlatformAndFaqHub />
      <HowItWorks />
      <FeaturedCourses />
      <BootcampHighlight />
      <MentorShowcase />
      <Outcomes />
      <HiringPartners />
    </>
  );
}
