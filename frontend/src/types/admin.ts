import { BatchMode, BatchStatus, BatchType } from "./batch";

// --- Batch Requests ---
export interface CreateBatchRequest {
  batchType: BatchType;
  parentId: string;
  startDate: string | Date;
  endDate: string | Date;
  capacity: number;
  fee: number;
  venue?: string;
  mode: BatchMode;
  code?: string;
}

export interface UpdateBatchRequest {
  venue?: string;
  capacity?: number;
  status?: BatchStatus;
  fee?: number;
}

// --- Course Requests ---
export interface CreateCourseRequest {
  title: string;
  description: string;
  category: string;
  price: number;
  duration?: number | string;
  lessonsCount?: number | string;
  instructorName?: string;
  instructor?: any;
  difficultyLevel?: string;
  level?: string;
  originalPrice?: number | string;
  tags?: string[] | string;
  isPublished?: boolean;
  isFeatured?: boolean;
  slug?: string;
  mentorIds?: string[];
  mentors?: any[];
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  isDateTBA?: boolean;
  [key: string]: any;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {}

// --- Training Program Requests ---
export interface CreateTrainingProgramRequest {
  title: string;
  description: string;
  domain: string;
  price: number;
  durationDays?: number | string;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  isDateTBA?: boolean;
  [key: string]: any;
}

export interface UpdateTrainingProgramRequest extends Partial<CreateTrainingProgramRequest> {}

// --- Event Requests ---
export interface CreateEventRequest {
  title: string;
  domain: string;
  type?: string;
  durationDays?: number | string;
  price?: number | string;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  isDateTBA?: boolean;
  maxSeats?: number | string;
  mentorIds?: string[];
  mentors?: any[];
  isPublished?: boolean;
  isFeatured?: boolean;
  slug?: string;
  [key: string]: any;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  status?: string;
}

// --- Mentor Requests ---
export interface RecordPayoutRequest {
  amount: number;
  period: string;
  notes?: string;
}

export interface ApprovePayoutRequest {
  notes?: string;
}

export interface ConfirmPayoutRequest {
  razorpayPaymentId: string;
}

// --- Attendance Requests ---
export interface MarkAttendanceRecord {
  studentUserId: string;
  status: "Present" | "Absent" | "Late" | "Excused";
  remarks?: string;
}

export interface MarkAttendanceRequest {
  batchId: string;
  sessionDate: string | Date;
  records: MarkAttendanceRecord[];
}

// --- User Requests ---
export interface UpdateUserStatusRequest {
  isActive: boolean;
}

// --- Enquiry Requests ---
export interface UpdateEnquiryRequest {
  status: string;
  enquiry_type: string;
  notes?: string;
}

// --- Registration Requests ---
export interface UpdateRegistrationRequest {
  status: string;
  payment_status: string;
  item_type: string;
  notes?: string;
}
