import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://growthcraft.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/student/",
        "/mentor/",
        "/college/",
        "/employer/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
