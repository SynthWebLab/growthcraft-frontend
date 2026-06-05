"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

// SynthWeb Office Location: 43, JB Road, Kanwachal, Silpukhuri, Guwahati 781005
// Coordinates: 26.1857751, 91.7664541
const OFFICE_LAT = 26.1857751;
const OFFICE_LNG = 91.7664541;
const OFFICE_ADDRESS = "SynthWeb, 43, JB Road, Kanwachal, Silpukhuri, Guwahati 781005";

// Google Maps embed URL with exact coordinates
const GOOGLE_MAPS_IFRAME_URL = `https://maps.google.com/maps?q=${OFFICE_LAT},${OFFICE_LNG}&hl=en&z=17&output=embed`;

export function GoogleMap() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Lazy load the map after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="h-64 rounded-xl bg-marble border border-border flex flex-col items-center justify-center">
        <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="h-64 rounded-xl overflow-hidden border border-border shadow-sm">
      <iframe
        title={`${OFFICE_ADDRESS} - Google Maps`}
        src={GOOGLE_MAPS_IFRAME_URL}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full"
      />
    </div>
  );
}
