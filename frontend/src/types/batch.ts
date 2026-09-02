export type BatchType = "Course" | "TrainingProgram" | "Bootcamp";
export type BatchMode = "Online" | "Offline" | "Hybrid";
export type BatchStatus = "Draft" | "Open" | "Filling" | "Full" | "InProgress" | "Completed" | "Cancelled";

export interface Batch {
  _id: string;
  batchType: BatchType;
  courseId?: string;
  trainingProgramId?: string;
  bootcampId?: string;
  code: string;
  startDate: string;
  endDate: string;
  venue?: string;
  mode: BatchMode;
  capacity: number;
  enrolledCount: number;
  status: BatchStatus;
  assignedMentorId?: string;
  assignedMentorIds?: string[];
  fee: number | string | any; // Mongoose Decimal128 serialization varies
  createdAt: string;
  updatedAt: string;
}

export interface BatchesResponse {
  success: boolean;
  message: string;
  data: Batch[];
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
