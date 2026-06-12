export type HackathonMode = "Online" | "Offline" | "Hybrid";
export type HackathonStatus = "Open" | "Closed" | "Completed" | "Draft";

export interface Hackathon {
  id: string;
  type: "hackathon";
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  banner?: string;
  rating: number;
  tags: string[];
  startDate: string;
  endDate: string;
  mode: HackathonMode;
  maxSeats: number;
  enrolledCount: number;
  availableSeats: number;
  skillsCovered: string[];
  mentorNames: string[];
  status: HackathonStatus;
  canRegister: boolean;
  primaryCTA: string;
  secondaryCTA: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HackathonPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface HackathonListResponse {
  items: Hackathon[];
  nextCursor: string | null;
  pagination: HackathonPagination;
}

export interface HackathonQueryParams {
  limit?: number;
  page?: number;
  status?: HackathonStatus;
  mode?: HackathonMode;
}

export interface HackathonActionData {
  fullName: string;
  email: string;
  phone: string;
}

export interface HackathonActionResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface HackathonEventDetail {
  _id: string;
  slug: string;
  title: string;
  type: "Hackathon";
  domain: string;
  durationDays: number;
  keyTopics: string[];
  description: string;
  banner?: string;
  category: string;
  startDate: string;
  endDate: string;
  maxSeats: number;
  enrolledCount: number;
  availableSeats: number;
  price: number;
  originalPrice?: number;
  mode: HackathonMode;
  skillsCovered: string[];
  mentorNames: string[];
  status: HackathonStatus;
  rating: number;
  tags: string[];
  canRegister?: boolean;
  primaryCTA?: string;
  secondaryCTA?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HackathonDetailResponse {
  success: boolean;
  message: string;
  data: {
    eventDetails: {
      _id: string;
      slug: string;
      type: "Hackathon";
      eventId: HackathonEventDetail;
      overview: {
        aboutEvent: string;
        whatYouWillLearn: Array<{ text: string }>;
        prerequisites: Array<{ text: string }>;
        whatsIncluded: Array<{ text: string }>;
      };
      venue: {
        type: HackathonMode;
        mode: string;
        description: string;
        date: string;
        time: string;
        name?: string;
        address?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
        googleMapsLink?: string;
      };
      agenda: Array<{
        step: number;
        title: string;
        duration: string;
        topics: string[];
      }>;
      mentors: Array<{
        name?: string;
        designation?: string;
        avatar?: string;
        bio?: string;
        rating?: number;
        studentsCount?: number;
        expertise?: string[];
      }>;
      faqs: Array<{
        question: string;
        answer: string;
      }>;
      createdAt: string;
      updatedAt: string;
      availableSeats?: number;
      canRegister?: boolean;
      primaryCTA?: string;
      secondaryCTA?: string | null;
    };
  };
  meta: {
    timestamp: string;
  };
}
