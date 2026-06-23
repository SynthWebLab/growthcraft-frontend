/**
 * College Dashboard Type Definitions
 * Mirrors the GC-232 backend /colleges/* responses.
 */

import type { ApiResponse } from "./api";

export type PartnershipTier = "Silver" | "Gold" | "Platinum";
export type CollegeStudentStatus = "active" | "completed" | "pending";

export interface CohortStatus {
  subscribed: boolean;
  tier: PartnershipTier;
  limit: number | null;
  used: number;
  remaining: number | null;
  unlimited: boolean;
}

export interface CollegeDashboardData {
  kpis: {
    totalStudentsEnrolled: number;
    activeCourses: number;
    partnershipTier: PartnershipTier;
    cohortLimit: number | null;
    cohortRemaining: number | null;
  };
  enrollmentTrend: {
    weekly: { label: string; students: number }[];
    monthly: { label: string; students: number }[];
    yearly: { label: string; students: number }[];
  };
  topPerformers: { name: string; course: string; progress: number }[];
  recentActivity: { text: string; date: string }[];
}

export interface CollegeStudentRow {
  userId: string;
  name: string;
  email: string;
  courses: number;
  avgProgress: number;
  status: CollegeStudentStatus;
  lastActive: string;
}

export interface CollegeProfile {
  _id: string;
  userId: string;
  collegeName: string;
  collegeCode?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
  contactPerson?: {
    name?: string;
    designation?: string;
    email?: string;
    phone?: string;
  };
  website?: string;
  partnershipTier: PartnershipTier;
  partnershipActive: boolean;
  partnershipStartDate?: string;
  spoc?: { name?: string; email?: string; phone?: string; designation?: string };
  notificationPreferences: CollegeNotificationPreferences;
  isVerified: boolean;
}

export interface CollegeNotificationPreferences {
  studentEnrollments: boolean;
  programUpdates: boolean;
  reportsReady: boolean;
  marketingEmails: boolean;
}

export interface CollegePartnership {
  active: boolean;
  currentTier: PartnershipTier;
  nextTier: PartnershipTier | null;
  startDate?: string;
  spoc?: { name?: string; email?: string; phone?: string; designation?: string };
  benefits: string[];
  tiers: PartnershipTier[];
  comparison: { label: string; values: (string | boolean)[] }[];
}

export interface CollegeMonthlyReport {
  month: string;
  enrollments: number;
  completionRate: string;
}

export interface CollegeSettings {
  institutionName: string;
  email: string;
  phone: string;
  notificationPreferences: CollegeNotificationPreferences;
}

export interface CollegeSupportTicket {
  _id: string;
  userId: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
}

export interface ImportStudentInput {
  fullName: string;
  email: string;
  phone: string;
  enrollmentNumber?: string;
  degree?: string;
  branch?: string;
  yearOfStudy?: number;
}

export interface ImportStudentsPayload {
  students?: ImportStudentInput[];
  csv?: string;
  eventIds?: string[];
  defaultPassword?: string;
}

export interface ImportStudentsResult {
  created: number;
  linkedExisting: number;
  alreadyInCohort: number;
  eventsEnrolled: number;
  skipped: { email: string; reason: string }[];
  cohort: CohortStatus;
}

export interface UpdateCollegeProfileData {
  collegeName?: string;
  website?: string;
  address?: CollegeProfile["address"];
  contactPerson?: CollegeProfile["contactPerson"];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Response envelopes
export type CollegeDashboardResponse = ApiResponse<CollegeDashboardData>;
export type CohortResponse = ApiResponse<CohortStatus>;
export type CollegeStudentsResponse = ApiResponse<CollegeStudentRow[]> & {
  meta?: { pagination?: PaginationMeta };
};
export type ImportStudentsResponse = ApiResponse<ImportStudentsResult>;
export type CollegeProfileResponse = ApiResponse<{ profile: CollegeProfile }>;
export type CollegePartnershipResponse = ApiResponse<CollegePartnership>;
export type CollegeReportsResponse = ApiResponse<{ reports: CollegeMonthlyReport[] }>;
export type CollegeSettingsResponse = ApiResponse<CollegeSettings>;
export type CollegeSupportTicketResponse = ApiResponse<{ ticket: CollegeSupportTicket }>;
export type CollegeSupportTicketsResponse = ApiResponse<{ tickets: CollegeSupportTicket[] }>;
