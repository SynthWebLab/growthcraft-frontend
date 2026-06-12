export type WorkshopMode = "Online" | "Offline" | "Hybrid";
export type WorkshopStatus = "Open" | "Closed" | "Completed" | "Draft";

export interface Workshop {
  id: string;
  type: "workshop";
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
  mode: WorkshopMode;
  maxSeats: number;
  enrolledCount: number;
  availableSeats: number;
  skillsCovered: string[];
  mentorNames: string[];
  status: WorkshopStatus;
  canRegister: boolean;
  primaryCTA: string;
  secondaryCTA: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkshopPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface WorkshopListResponse {
  items: Workshop[];
  nextCursor: string | null;
  pagination: WorkshopPagination;
}

export interface WorkshopQueryParams {
  limit?: number;
  page?: number;
  status?: WorkshopStatus;
  mode?: WorkshopMode;
}

export interface WorkshopActionData {
  fullName: string;
  email: string;
  phone: string;
}

export interface WorkshopActionResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface WorkshopDetailEvent {
  _id: string;
  slug: string;
  title: string;
  type: "Workshop";
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
  mode: WorkshopMode;
  skillsCovered: string[];
  mentorNames: string[];
  status: WorkshopStatus;
  rating: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkshopDetailResponse {
  success: boolean;
  message: string;
  data: {
    eventDetails: {
      _id: string;
      slug: string;
      type: "Workshop";
      eventId: WorkshopDetailEvent;
      overview: {
        aboutEvent: string;
        whatYouWillLearn: Array<{ text: string }>;
        prerequisites: Array<{ text: string }>;
        whatsIncluded: Array<{ text: string }>;
      };
      venue: {
        type: WorkshopMode;
        mode: string;
        description: string;
        date: string;
        time: string;
      };
      agenda: Array<{
        step: number;
        title: string;
        duration: string;
        topics: string[];
      }>;
      mentors: Array<{
        name?: string;
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
    };
  };
  meta: {
    timestamp: string;
  };
}
