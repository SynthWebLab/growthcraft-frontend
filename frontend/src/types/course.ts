/**
 * Course Type Definitions
 */

export interface CourseInstructor {
  name: string;
  avatar: string;
}

export interface BootcampDetails {
  totalSeats: number;
  availableSeats: number;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
}

export interface EnrollmentData {
  fullName: string;
  email: string;
  phone: string;
  enrollmentNumber?: string;
  collegeName?: string;
}

export interface CallbackRequestData {
  fullName: string;
  email: string;
  phone: string;
}

export interface EnrollmentResponse {
  success: boolean;
  message: string;
  data: {
    enrollment: {
      _id: string;
      userId: string;
      courseId: string;
      fullName: string;
      email: string;
      phone: string;
      enrollmentNumber?: string;
      collegeName?: string;
      status: string;
      enrolledAt: string;
    };
  };
  meta?: {
    timestamp: string;
  };
}

export interface CallbackResponse {
  success: boolean;
  message: string;
  data: {
    callbackRequest: {
      _id: string;
      userId: string;
      courseId: string;
      fullName: string;
      email: string;
      phone: string;
      status: string;
      requestedAt: string;
    };
  };
  meta?: {
    timestamp: string;
  };
}

export interface EnrollmentStatusResponse {
  success: boolean;
  message: string;
  data: {
    isEnrolled: boolean;
    hasCallbackRequest: boolean;
    enrollment?: {
      _id: string;
      status: string;
      enrolledAt: string;
    };
    callbackRequest?: {
      _id: string;
      status: string;
      requestedAt: string;
    };
  };
  meta?: {
    timestamp: string;
  };
}

export interface CourseMentor {
  userId?: string;
  mentorProfileId?: string;
  name: string;
  avatar?: string;
  designation?: string;
  areaOfExpertise?: string;
  bio?: string;
}

export interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficultyLevel: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
  lessonsCount: number;
  price: number;
  originalPrice: number;
  rating: number;
  tags: string[];
  enrollmentCount: number;
  isActive: boolean;
  isDraft: boolean;
  isFeatured?: boolean;
  publishedAt?: string;
  type: "Course" | "Bootcamp";
  createdAt: string;
  updatedAt: string;
  status: "Active" | "Draft" | "Coming Soon";
  primaryCTA: string;
  secondaryCTA: string | null;
  canEnroll: boolean;
  hasStarted: boolean;
  durationHours: number;
  totalLessons: number;
  avgRating: number;
  discountedPrice: number;
  instructor: CourseInstructor;
  instructorName: string;
  mentors?: CourseMentor[];
  startDate?: string | null;
  endDate?: string | null;
  isDateTBA?: boolean;
  bootcampDetails?: BootcampDetails;
}

export interface CoursesResponse {
  success: boolean;
  message: string;
  data: Course[];
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

export interface CourseFilters {
  category?: string;
  difficultyLevel?: string;
  type?: "Course" | "Bootcamp";
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  q?: string; // Search query (alternative)
  search?: string; // Search query (primary)
  sortBy?: "title" | "price" | "rating" | "enrollmentCount" | "createdAt" | "duration";
  sortOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  tags?: string;
}

export interface CourseConfig {
  categories: string[];
  difficultyLevels: string[];
  courseTypes: string[];
}

export interface CourseLesson {
  title: string;
  duration: number;
  isFree: boolean;
  _id: string;
}

export interface CourseCurriculumSection {
  sectionNumber: number;
  title: string;
  lessons: CourseLesson[];
  _id: string;
}

export interface CourseOverview {
  aboutCourse: string;
  whatYouWillLearn: Array<{ text: string; _id: string }>;
  prerequisites: Array<{ text: string; _id: string }>;
  whatsIncluded: Array<{ text: string; icon: string; _id: string }>;
}

export interface InstructorDetails {
  name: string;
  avatar: string;
  bio: string;
  rating: number;
  studentsCount: number;
  coursesCount: number;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface CourseFAQ {
  question: string;
  answer: string;
  _id: string;
}

export interface CourseDetailResponse {
  success: boolean;
  message: string;
  data: {
    course: Course;
    overview: CourseOverview;
    curriculum: CourseCurriculumSection[];
    instructorDetails: InstructorDetails;
    faqs: CourseFAQ[];
  };
  meta: {
    timestamp: string;
  };
}

export interface CourseConfigResponse {
  success: boolean;
  message: string;
  data: CourseConfig;
  meta: {
    timestamp: string;
  };
}
