"use client";

import { useState } from "react";
import Image from "next/image";

export interface PartnerLogoProps {
  companyName?: string;
  logoUrl?: string;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function getPartnerLogo(companyName?: string, logoUrl?: string): string | null {
  if (logoUrl) return logoUrl;
  if (!companyName) return null;
  const name = companyName.toLowerCase().trim();
  if (name.includes("synthweb")) {
    return "/logos/synthweb.webp";
  }
  return null;
}

export function PartnerLogo({
  companyName = "Partner",
  logoUrl,
  className = "",
  imageClassName = "h-full w-full object-contain p-1",
  fallbackClassName = "",
  size = "md",
}: PartnerLogoProps) {
  const [hasError, setHasError] = useState(false);
  const resolvedLogo = getPartnerLogo(companyName, logoUrl);

  const sizeClasses = {
    sm: "h-8 w-8 rounded-lg text-xs",
    md: "h-10 w-10 sm:h-11 sm:w-11 rounded-xl text-sm sm:text-base",
    lg: "h-12 w-12 sm:h-14 sm:w-14 rounded-2xl text-base sm:text-lg",
    xl: "h-16 w-16 sm:h-20 sm:w-20 rounded-2xl text-xl sm:text-2xl",
  }[size];

  const firstLetter = companyName ? companyName.charAt(0).toUpperCase() : "P";

  if (resolvedLogo && !hasError) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-white dark:bg-slate-900 border border-border shadow-xs shrink-0 ${sizeClasses} ${className}`}
      >
        <img
          src={resolvedLogo}
          alt={companyName}
          onError={() => setHasError(true)}
          className={imageClassName}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center font-extrabold bg-gradient-to-br from-magenta/20 via-lavender/20 to-magenta/10 text-magenta border border-border shrink-0 shadow-xs ${sizeClasses} ${className} ${fallbackClassName}`}
    >
      {firstLetter}
    </div>
  );
}

export default PartnerLogo;
