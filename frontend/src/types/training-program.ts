/**
 * Training Program Type Definitions
 */

export interface CohortDate {
  _id: string;
  cohortNumber: number;
  startDate: string;
  endDate: string;
  maxSeats: number;
  enrolledCount: number;
  status: "Open" | "Closed" | "Completed";
}

export interface TrainingProgram {
  _id: string;
  title: string;
  slug: string;
  description: string;
  domain: string;
  duration: number; // in days
  tools: string[];
  price: number;
  originalPrice?: number;
  status: "Active" | "Coming Soon" | "Draft";
  enrollmentCount: number;
  rating: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  thumbnail?: string;
  cohorts?: CohortDate[]; // Available cohort start dates
  mentorName: string;
  primaryCTA: string;
  secondaryCTA: string | null;
  isFeatured?: boolean;
  is_featured?: boolean;
  mentors?: Array<{
    userId?: string;
    mentorProfileId?: string;
    name?: string;
    fullName?: string;
    avatar?: string;
    designation?: string;
    areaOfExpertise?: string;
    company?: string;
    currentOrganization?: string;
    bio?: string;
    rating?: number;
    studentsCount?: number;
    expertise?: string[];
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingProgramsResponse {
  success: boolean;
  message: string;
  data: TrainingProgram[];
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

export interface TrainingProgramFilters {
  domain?: string;
  level?: string;
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "title" | "price" | "rating" | "enrollmentCount" | "createdAt" | "duration";
  sortOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

export interface TrainingProgramConfig {
  domains: string[];
  levels: string[];
}

export interface TrainingProgramConfigResponse {
  success: boolean;
  message: string;
  data: TrainingProgramConfig;
  meta: {
    timestamp: string;
  };
}

export interface TrainingProgramDetailResponse {
  success: boolean;
  message: string;
  data: {
    program: TrainingProgram;
    overview: {
      aboutProgram: string;
      whatYouWillLearn: Array<{ text: string; _id: string }>;
      prerequisites: Array<{ text: string; _id: string }>;
      whatsIncluded: Array<{ text: string; icon: string; _id: string }>;
    };
    syllabus: Array<{
      weekNumber: number;
      title: string;
      topics: Array<{ text: string; _id: string }>;
      _id: string;
    }>;
    mentors: Array<{
      name: string;
      avatar: string;
      bio: string;
      designation?: string;
      company?: string;
      rating: number;
      studentsCount: number;
      expertise: string[];
    }>;
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
