/**
 * SEO Configuration
 * Centralized SEO data for all pages
 * 
 * This structure matches the future backend API response format
 * for easy migration when the backend SEO API is ready.
 */

import type { SeoConfig } from "@/types/seo.types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://growthcraft.com";
const SITE_NAME = "GrowthCraft";

export const SEO_CONFIG: SeoConfig = {
  homepage: {
    meta: {
      title: "GrowthCraft - Where Learning Meets Opportunity",
      description:
        "Your all-in-one platform to learn tech, master industry skills, join hands-on bootcamps, connect with mentors, and land your dream job. Transform your career with GrowthCraft.",
      keywords: [
        "tech education",
        "coding bootcamps",
        "online courses",
        "web development",
        "data science",
        "career training",
        "mentorship",
        "job placement",
        "skill development",
        "tech careers",
      ],
      canonical: SITE_URL,
    },
    openGraph: {
      title: "GrowthCraft - Where Learning Meets Opportunity",
      description:
        "Learn tech, master skills, join bootcamps, connect with mentors, and land your dream job. Transform your career with GrowthCraft.",
      image: `${SITE_URL}/images/og-homepage.jpg`,
      url: SITE_URL,
      type: "website",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: "GrowthCraft - Where Learning Meets Opportunity",
      description:
        "Learn tech, master skills, join bootcamps, and land your dream job with GrowthCraft.",
      image: `${SITE_URL}/images/og-homepage.jpg`,
      site: "@growthcraft",
      creator: "@growthcraft",
    },
    jsonLd: {
      organization: {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo.png`,
        sameAs: [
          "https://twitter.com/growthcraft",
          "https://linkedin.com/company/growthcraft",
          "https://facebook.com/growthcraft",
          "https://instagram.com/growthcraft",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          email: "hello@growthcraft.com",
          contactType: "Customer Service",
        },
      },
      website: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      breadcrumb: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
        ],
      },
    },
  },
};
