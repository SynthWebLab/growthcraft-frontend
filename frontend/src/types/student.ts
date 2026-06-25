/**
 * Student Dashboard Type Definitions
 * Mirrors the GC-230 backend /students/* responses.
 */

import type { ApiResponse } from "./api";

export type EnrollmentStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "pending" | "completed" | "failed";
export type StudentEventType = "Workshop" | "Bootcamp" | "Hackathon";

/** A populated course reference (courseId is populated by the backend). */
export interface PopulatedCourseRef {
  _id: string;
  title?: string;
  slug?: string;
  category?: string;
  difficultyLevel?: string;
  thumbnail?: string;
  duration?: number;
  lessonsCount?: number;
}

/** A populated event reference (Bootcamp/Workshop/Hackathon share the Bootcamp collection). */
export interface PopulatedEventRef {
  _id: string;
  title?: string;
  slug?: string;
  type?: StudentEventType;
  mode?: string;
  domain?: string;
  banner?: string;
  durationDays?: number;
}

/** A populated training-program reference. */
export interface PopulatedProgramRef {
  _id: string;
  title?: string;
  slug?: string;
  domain?: string;
}

export interface StudentCourseEnrollment {
  _id: string;
  courseId: PopulatedCourseRef | string;
  title: string;
  status: EnrollmentStatus;
  paymentStatus: PaymentStatus;
  enrollmentDate: string;
  createdAt: string;
}

export interface StudentEventEnrollment {
  _id: string;
  eventId: PopulatedEventRef | string;
  eventType: StudentEventType;
  title: string;
  status: EnrollmentStatus;
  paymentStatus: PaymentStatus;
  enrollmentDate: string;
  createdAt: string;
}

export interface StudentProgramEnrollment {
  _id: string;
  programId: PopulatedProgramRef | string;
  title: string;
  status: EnrollmentStatus;
  paymentStatus: PaymentStatus;
  enrollmentDate: string;
  createdAt: string;
}

export interface StudentCertificate {
  name: string;
  issuedBy: string;
  issuedDate: string;
  certificateUrl?: string;
}

export interface StudentProfile {
  _id: string;
  userId: string;
  enrollmentNumber?: string;
  collegeName?: string;
  degree?: string;
  branch?: string;
  yearOfStudy?: number;
  graduationYear?: number;
  skills: string[];
  interests: string[];
  enrolledCourses: (PopulatedCourseRef | string)[];
  completedCourses: (PopulatedCourseRef | string)[];
  certifications: StudentCertificate[];
  resume?: string;
  portfolio?: string;
  linkedIn?: string;
  github?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateStudentProfileData {
  enrollmentNumber?: string;
  collegeName?: string;
  degree?: string;
  branch?: string;
  yearOfStudy?: number;
  graduationYear?: number;
  skills?: string[];
  interests?: string[];
  resume?: string;
  portfolio?: string;
  linkedIn?: string;
  github?: string;
}

export interface StudentDashboardData {
  counts: {
    courses: number;
    bootcamps: number;
    workshops: number;
    hackathons: number;
    trainingPrograms: number;
    certificates: number;
  };
  recent: {
    courses: StudentCourseEnrollment[];
    events: StudentEventEnrollment[];
    trainingPrograms: StudentProgramEnrollment[];
  };
  certificates: StudentCertificate[];
}

export interface SupportTicket {
  _id: string;
  userId: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
  updatedAt: string;
}

/** A populated user ref (mentor's / student's User). May be null if the user was removed. */
export interface PopulatedUserRef {
  _id: string;
  fullName?: string;
  email?: string;
}

export interface MentorAvailabilitySlot {
  startTime: string;
  endTime: string;
}

export interface Mentor {
  _id: string;
  userId: PopulatedUserRef | null;
  experienceYears: number;
  areaOfExpertise: string;
  currentOrganization: string;
  bio: string;
  hourlyRate?: number;
  availability: { day?: string; date?: string; slots: MentorAvailabilitySlot[] }[];
  rating: number;
  totalSessions: number;
  linkedIn?: string;
  website?: string;
  isVerified: boolean;
}

export type MentorSessionType = "1:1" | "Group";
export type MentorSessionStatus = "scheduled" | "completed" | "cancelled";

export interface MentorSession {
  _id: string;
  studentUserId: string;
  mentorUserId: PopulatedUserRef | string;
  topic: string;
  scheduledDate: string;
  timeSlot: string;
  durationMinutes: number;
  sessionType: MentorSessionType;
  status: MentorSessionStatus;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookMentorSessionData {
  mentorUserId: string;
  topic: string;
  scheduledDate: string;
  timeSlot: string;
  sessionType?: MentorSessionType;
}

// Response envelopes
export type StudentDashboardResponse = ApiResponse<StudentDashboardData>;
export type SupportTicketResponse = ApiResponse<{ ticket: SupportTicket }>;
export type SupportTicketsResponse = ApiResponse<{ tickets: SupportTicket[] }>;
export type MentorsResponse = ApiResponse<{ mentors: Mentor[] }>;
export type MentorSessionResponse = ApiResponse<{ session: MentorSession }>;
export type MentorSessionsResponse = ApiResponse<{ sessions: MentorSession[] }>;
export type StudentProfileResponse = ApiResponse<{ profile: StudentProfile | null }>;
export type StudentCoursesResponse = ApiResponse<{ courses: StudentCourseEnrollment[] }>;
export type StudentBootcampsResponse = ApiResponse<{ bootcamps: StudentEventEnrollment[] }>;
export type StudentWorkshopsResponse = ApiResponse<{ workshops: StudentEventEnrollment[] }>;
export type StudentHackathonsResponse = ApiResponse<{ hackathons: StudentEventEnrollment[] }>;
export type StudentEventsResponse = ApiResponse<{ events: StudentEventEnrollment[] }>;
export type StudentTrainingProgramsResponse = ApiResponse<{ trainingPrograms: StudentProgramEnrollment[] }>;
export type StudentCertificatesResponse = ApiResponse<{ certificates: StudentCertificate[] }>;
