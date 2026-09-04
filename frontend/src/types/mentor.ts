/**
 * Mentor Dashboard Type Definitions
 * Mirrors the backend /mentor/* responses.
 */

import type { ApiResponse } from "./api";

export interface MentorDashboardCounts {
  sessionsDelivered: number;
  totalEarnings: number;
  avgRating: number;
  todaySessionsCount: number;
}

export interface MentorTodaySession {
  id: string;
  student: string;
  time: string;
  course: string;
  duration: string;
  meetingLink?: string;
}

export interface MentorEarningsTrendItem {
  month: string;
  amount: number;
}

export interface MentorRecentReview {
  student: string;
  rating: number;
  text: string;
  date: string;
}

export interface MentorDashboardSummary {
  counts: MentorDashboardCounts;
  todaySessions: MentorTodaySession[];
  earningsTrend: MentorEarningsTrendItem[];
  recentReviews: MentorRecentReview[];
}

export type MentorDashboardResponse = ApiResponse<MentorDashboardSummary>;

export type MentorSessionStatus = "upcoming" | "completed" | "cancelled";

export interface MentorSession {
  id: string;
  student: string;
  course: string;
  date: string;
  time: string;
  duration: string;
  status: MentorSessionStatus;
  meetingLink?: string;
}

export type MentorSessionsResponse = ApiResponse<{ sessions: MentorSession[] }>;
export type MentorSessionResponse = ApiResponse<{ session: MentorSession }>;

export interface MentorAvailabilitySlot {
  startTime: string;
  endTime: string;
}

export interface MentorAvailabilityDay {
  day: string;
  slots: MentorAvailabilitySlot[];
}

export interface MentorAvailabilityData {
  availability: MentorAvailabilityDay[];
  hourlyRate: number;
}

export type MentorAvailabilityResponse = ApiResponse<MentorAvailabilityData>;

export interface MentorStudent {
  name: string;
  course: string;
  sessionsCompleted: number;
  lastSession: string;
  nextSession: string;
}

export type MentorStudentsResponse = ApiResponse<{ students: MentorStudent[] }>;

export interface MentorEarningsSummary {
  thisMonth: number;
  pendingPayout: number;
  withdrawablePayout: number;
  lifetime: number;
}

export interface MentorMonthlyEarningsData {
  month: string;
  sessions: number;
  amount: number;
  bonus: number;
  total: number;
}

export interface MentorPayoutHistoryItem {
  date: string;
  amount: number;
  status: "completed" | "pending" | "failed" | "processing";
  txnId: string;
  razorpayLinkUrl?: string;
}

export interface MentorEarningsData {
  summary: MentorEarningsSummary;
  monthlyData: MentorMonthlyEarningsData[];
  payouts: MentorPayoutHistoryItem[];
}

export type MentorEarningsResponse = ApiResponse<MentorEarningsData>;

export interface MentorProfileData {
  userId?: {
    fullName?: string;
    email?: string;
    phone?: string;
    avatar?: string;
  };
  fullName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  bio: string;
  experienceYears: number;
  areaOfExpertise: string;
  currentOrganization: string;
  linkedIn: string;
  website: string;
  hourlyRate: number;
  isVerified: boolean;
}

export type MentorProfileResponse = ApiResponse<{ profile: MentorProfileData }>;

export interface PublicMentor {
  _id: string;
  userId?: string;
  name: string;
  photo: string;
  company: string;
  areaOfExpertise?: string;
  expertiseTags: string[];
  sessionsDelivered: number;
  rating: number;
  bio?: string;
  experienceYears?: number;
  isVerified?: boolean;
  linkedinUrl?: string;
}

export type PublicMentorsResponse = ApiResponse<{
  mentors: PublicMentor[];
  total: number;
}>;
