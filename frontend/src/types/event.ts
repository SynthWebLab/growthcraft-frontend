/**
 * Event Type Definitions
 * Covers Workshops, Bootcamps, and Hackathons
 */

export type EventType = "Workshop" | "Bootcamp" | "Hackathon";
export type EventMode = "Online" | "Offline" | "Hybrid";
export type EventStatus = "Active" | "Coming Soon" | "Draft" | "Completed";

export interface EventVenue {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  googleMapsLink?: string;
}

export interface Event {
  _id: string;
  title: string;
  slug: string;
  description: string;
  type: EventType;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: number; // in hours
  price: number;
  originalPrice?: number;
  mode: EventMode;
  venue?: EventVenue; // Only for Offline/Hybrid events
  zoomLink?: string; // Only for Online events
  startDate?: string | null;
  endDate?: string | null;
  isDateTBA?: boolean;
  maxSeats: number;
  enrolledCount: number;
  status: EventStatus;
  rating: number;
  tools: string[];
  mentorName: string;
  thumbnail?: string;
  primaryCTA: string;
  secondaryCTA: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventsResponse {
  success: boolean;
  message: string;
  data: Event[];
  meta: {
    timestamp: string;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface EventFilters {
  type?: EventType;
  category?: string;
  level?: string;
  mode?: EventMode;
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "title" | "price" | "rating" | "enrolledCount" | "startDate" | "createdAt";
  sortOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

export interface EventConfig {
  types: EventType[];
  categories: string[];
  levels: string[];
  modes: EventMode[];
}

export interface EventConfigResponse {
  success: boolean;
  message: string;
  data: EventConfig;
  meta: {
    timestamp: string;
  };
}

export interface EventDetailResponse {
  success: boolean;
  message: string;
  data: {
    event: Event;
    overview: {
      aboutEvent: string;
      whatYouWillLearn: Array<{ text: string; _id: string }>;
      prerequisites: Array<{ text: string; _id: string }>;
      whatsIncluded: Array<{ text: string; icon: string; _id: string }>;
    };
    agenda: Array<{
      sessionNumber: number;
      title: string;
      topics: Array<{ text: string; _id: string }>;
      duration: number;
      _id: string;
    }>;
    mentorDetails: {
      name: string;
      avatar: string;
      bio: string;
      rating: number;
      studentsCount: number;
      expertise: string[];
    };
    faqs: Array<{
      question: string;
      answer: string;
      _id: string;
    }>;
  };
  meta: {
    timestamp: string;
  };
}
