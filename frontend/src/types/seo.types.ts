/**
 * SEO Types
 * Type definitions for SEO configuration
 */

export interface MetaConfig {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
}

export interface OpenGraphConfig {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
  siteName?: string;
}

export interface TwitterConfig {
  card: string;
  title: string;
  description: string;
  image: string;
  site?: string;
  creator?: string;
}

export interface OrganizationSchema {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
  contactPoint?: {
    "@type": string;
    email: string;
    contactType: string;
  };
}

export interface WebSiteSchema {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  potentialAction?: {
    "@type": string;
    target: string;
    "query-input": string;
  };
}

export interface BreadcrumbSchema {
  "@context": string;
  "@type": string;
  itemListElement: Array<{
    "@type": string;
    position: number;
    name: string;
    item?: string;
  }>;
}

export interface JsonLdConfig {
  organization: OrganizationSchema;
  website: WebSiteSchema;
  breadcrumb?: BreadcrumbSchema;
}

export interface PageSeoConfig {
  meta: MetaConfig;
  openGraph: OpenGraphConfig;
  twitter: TwitterConfig;
  jsonLd: JsonLdConfig;
}

export interface SeoConfig {
  homepage: PageSeoConfig;
  // Future pages can be added here
  // courses?: PageSeoConfig;
  // bootcamps?: PageSeoConfig;
}
