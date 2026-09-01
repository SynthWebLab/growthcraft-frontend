/**
 * React Query hooks for the admin panel.
 * Wraps the backend /admin/* endpoints.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";

function extractApiError(error: any, fallback: string): string {
  const errorData = error?.response?.data?.error;
  const fieldErrors: Array<{ message: string }> =
    errorData?.details?.error?.errors || errorData?.details?.errors || [];
  if (fieldErrors.length) return fieldErrors.map((e) => e.message).join(", ");
  return errorData?.message || error?.message || fallback;
}

export const adminKeys = {
  all: ["admin"] as const,
  mentors: (search?: string, page?: number) =>
    search !== undefined || page !== undefined
      ? ([...adminKeys.all, "mentors", { search, page }] as const)
      : ([...adminKeys.all, "mentors"] as const),
  mentorDetails: (id: string) => [...adminKeys.all, "mentor-details", id] as const,
  mentorCheckIns: (id: string, filters?: any) =>
    filters !== undefined
      ? ([...adminKeys.all, "mentor-check-ins", id, filters] as const)
      : ([...adminKeys.all, "mentor-check-ins", id] as const),
  mentorPayouts: (id: string) => [...adminKeys.all, "mentor-payouts", id] as const,
  globalPayouts: (month?: string) =>
    month !== undefined
      ? ([...adminKeys.all, "global-payouts", month] as const)
      : ([...adminKeys.all, "global-payouts"] as const),
  mentorAvailability: (id: string) => [...adminKeys.all, "mentor-availability", id] as const,
  availableMentors: (filters?: any) =>
    filters !== undefined
      ? ([...adminKeys.all, "available-mentors", filters] as const)
      : ([...adminKeys.all, "available-mentors"] as const),
  attendanceList: (filters?: any) =>
    filters !== undefined
      ? ([...adminKeys.all, "attendance-list", filters] as const)
      : ([...adminKeys.all, "attendance-list"] as const),
  attendanceSummary: (batchId: string) => [...adminKeys.all, "attendance-summary", batchId] as const,
  revenue: (filters?: any) =>
    filters !== undefined
      ? ([...adminKeys.all, "revenue", filters] as const)
      : ([...adminKeys.all, "revenue"] as const),
  analytics: () => [...adminKeys.all, "analytics"] as const,
  auditLogs: (filters?: any) =>
    filters !== undefined
      ? ([...adminKeys.all, "audit-logs", filters] as const)
      : ([...adminKeys.all, "audit-logs"] as const),
  courses: () => [...adminKeys.all, "courses"] as const,
  trainingPrograms: () => [...adminKeys.all, "training-programs"] as const,
  events: () => [...adminKeys.all, "events"] as const,
  batches: (filters?: any) =>
    filters !== undefined
      ? ([...adminKeys.all, "batches", filters] as const)
      : ([...adminKeys.all, "batches"] as const),
  users: (filters?: any) =>
    filters !== undefined
      ? ([...adminKeys.all, "users", filters] as const)
      : ([...adminKeys.all, "users"] as const),
  userById: (id: string) => [...adminKeys.all, "user", id] as const,
  colleges: () => [...adminKeys.all, "colleges"] as const,
  employers: () => [...adminKeys.all, "employers"] as const,
  enquiries: () => [...adminKeys.all, "enquiries"] as const,
  registrations: () => [...adminKeys.all, "registrations"] as const,
};

const STALE = 2 * 60 * 1000; // 2 minutes

// --- Mentor Payouts & Availability Hooks ---

export function useAdminMentors(params?: { search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: adminKeys.mentors(params?.search, params?.page),
    queryFn: () => adminService.getMentors(params),
    staleTime: STALE,
    retry: 1,
  });
}

export function useAdminBatches(params?: {
  page?: number;
  limit?: number;
  status?: string;
  batchType?: string;
  courseId?: string;
  trainingProgramId?: string;
  bootcampId?: string;
  mentorId?: string;
}) {
  return useQuery({
    queryKey: adminKeys.batches(params),
    queryFn: () => adminService.getBatches(params),
    staleTime: STALE,
  });
}

export function useAssignMentorToBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ batchId, mentorId }: { batchId: string; mentorId: string }) =>
      adminService.assignMentorToBatch(batchId, mentorId),
    onSuccess: (_, variables) => {
      toast.success("Mentor assigned to batch successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.batches() });
      queryClient.invalidateQueries({ queryKey: adminKeys.mentors() });
      queryClient.invalidateQueries({ queryKey: adminKeys.mentorDetails(variables.mentorId) });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to assign mentor to batch"));
    },
  });
}

export function useCreateBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminService.createBatch(data),
    onSuccess: () => {
      toast.success("Batch created successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.batches() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to create batch"));
    },
  });
}

export function useUpdateBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminService.updateBatch(id, data),
    onSuccess: () => {
      toast.success("Batch updated successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.batches() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to update batch"));
    },
  });
}

export function useAdminMentorDetails(mentorId: string) {
  return useQuery({
    queryKey: adminKeys.mentorDetails(mentorId),
    queryFn: () => adminService.getMentorDetails(mentorId),
    enabled: !!mentorId,
    staleTime: STALE,
  });
}

export function useAdminMentorCheckIns(
  mentorId: string,
  params?: { batchId?: string; startDate?: string; endDate?: string; verified?: string; page?: number; limit?: number }
) {
  return useQuery({
    queryKey: adminKeys.mentorCheckIns(mentorId, params),
    queryFn: () => adminService.getMentorCheckIns(mentorId, params),
    enabled: !!mentorId,
    staleTime: STALE,
  });
}

export function useVerifyCheckIn(mentorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (checkInId: string) => adminService.verifyCheckIn(mentorId, checkInId),
    onSuccess: () => {
      toast.success("Check-in verified successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.mentorDetails(mentorId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.mentorCheckIns(mentorId) });
      queryClient.invalidateQueries({ queryKey: ["admin", "mentors"] });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to verify check-in"));
    },
  });
}

export function useRecordPayout(mentorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { amount: number; period: string; notes?: string }) =>
      adminService.recordPayout(mentorId, data),
    onSuccess: () => {
      toast.success("Payout processed and recorded successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.mentorDetails(mentorId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.mentorPayouts(mentorId) });
      queryClient.invalidateQueries({ queryKey: ["admin", "mentors"] });
      queryClient.invalidateQueries({ queryKey: adminKeys.globalPayouts() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to record payout"));
    },
  });
}

export function useApprovePayout(mentorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payoutId: string) => adminService.approvePayout(payoutId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.mentorDetails(mentorId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.mentorPayouts(mentorId) });
      queryClient.invalidateQueries({ queryKey: ["admin", "mentors"] });
      queryClient.invalidateQueries({ queryKey: adminKeys.globalPayouts() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to generate Razorpay payment link"));
    },
  });
}

export function useConfirmPayout(mentorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payoutId, razorpayPaymentId }: { payoutId: string; razorpayPaymentId: string }) =>
      adminService.confirmPayout(payoutId, razorpayPaymentId),
    onSuccess: () => {
      toast.success("Payout confirmed and marked as Paid");
      queryClient.invalidateQueries({ queryKey: adminKeys.mentorDetails(mentorId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.mentorPayouts(mentorId) });
      queryClient.invalidateQueries({ queryKey: ["admin", "mentors"] });
      queryClient.invalidateQueries({ queryKey: adminKeys.globalPayouts() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to confirm payout"));
    },
  });
}

export function useAdminPayoutHistory(mentorId: string) {
  return useQuery({
    queryKey: adminKeys.mentorPayouts(mentorId),
    queryFn: () => adminService.getMentorPayouts(mentorId),
    enabled: !!mentorId,
  });
}

export function useAdminPayoutOverview(month?: string) {
  return useQuery({
    queryKey: adminKeys.globalPayouts(month),
    queryFn: () => adminService.getGlobalPayouts(month),
  });
}

export function useAdminMentorAvailability(mentorId: string) {
  return useQuery({
    queryKey: adminKeys.mentorAvailability(mentorId),
    queryFn: () => adminService.getMentorAvailability(mentorId),
    enabled: !!mentorId,
  });
}

export function useAdminAvailableMentors(params: { date: string; batchType?: string; specialization?: string }) {
  return useQuery({
    queryKey: adminKeys.availableMentors(params),
    queryFn: () => adminService.getAvailableMentors(params),
    enabled: !!params.date,
  });
}

// --- Student Attendance Hooks ---

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      batchId: string;
      sessionDate: string | Date;
      records: { studentUserId: string; status: "Present" | "Absent" | "Late" | "Excused"; remarks?: string }[];
    }) => adminService.markAttendance(data),
    onSuccess: (_, variables) => {
      toast.success("Attendance marked successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.attendanceSummary(variables.batchId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.attendanceList() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to mark attendance"));
    },
  });
}

export function useAdminAttendanceList(params?: {
  batchId?: string;
  studentId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: adminKeys.attendanceList(params),
    queryFn: () => adminService.getAttendance(params),
  });
}

export function useAdminAttendanceSummary(batchId: string) {
  return useQuery({
    queryKey: adminKeys.attendanceSummary(batchId),
    queryFn: () => adminService.getAttendanceSummary(batchId),
    enabled: !!batchId,
  });
}

// --- Revenue & Analytics Hooks ---

export function useAdminRevenue(params?: { month?: string; batchType?: string }) {
  return useQuery({
    queryKey: adminKeys.revenue(params),
    queryFn: () => adminService.getRevenue(params),
  });
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: adminKeys.analytics(),
    queryFn: () => adminService.getAnalytics(),
  });
}

export function useAdminAuditLogs(params?: {
  performedBy?: string;
  action?: string;
  target?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: adminKeys.auditLogs(params),
    queryFn: () => adminService.getAuditLogs(params),
  });
}

// --- Users List Hook ---

export function useAdminUsers(params?: {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => adminService.getUsers(params),
    staleTime: STALE,
  });
}

export function useAdminUserById(id: string) {
  return useQuery({
    queryKey: adminKeys.userById(id),
    queryFn: () => adminService.getUserById(id),
    enabled: !!id,
    staleTime: STALE,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminService.updateUserStatus(id, isActive),
    onSuccess: (_, variables) => {
      toast.success(variables.isActive ? "User account activated" : "User account suspended");
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to update user status"));
    },
  });
}

// --- Colleges Admin CRUD Hooks ---

export function useAdminColleges() {
  return useQuery({
    queryKey: adminKeys.colleges(),
    queryFn: () => adminService.getColleges(),
    staleTime: STALE,
  });
}

export function useUpdateAdminCollege() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminService.updateCollege(id, data),
    onSuccess: () => {
      toast.success("College updated successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.colleges() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to update college"));
    },
  });
}

export function useDeleteAdminCollege() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteCollege(id),
    onSuccess: () => {
      toast.success("College deleted successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.colleges() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to delete college"));
    },
  });
}

// --- Employers Admin CRUD Hooks ---

export function useAdminEmployers() {
  return useQuery({
    queryKey: adminKeys.employers(),
    queryFn: () => adminService.getEmployers(),
    staleTime: STALE,
  });
}

export function useUpdateAdminEmployer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminService.updateEmployer(id, data),
    onSuccess: () => {
      toast.success("Employer updated successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.employers() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to update employer"));
    },
  });
}

export function useDeleteAdminEmployer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteEmployer(id),
    onSuccess: () => {
      toast.success("Employer deleted successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.employers() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to delete employer"));
    },
  });
}

// --- Course Admin CRUD Hooks ---

export function useAdminCourses() {
  return useQuery({
    queryKey: adminKeys.courses(),
    queryFn: () => adminService.getCourses(),
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminService.createCourse(data),
    onSuccess: () => {
      toast.success("Course created successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.courses() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to create course"));
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminService.updateCourse(id, data),
    onSuccess: () => {
      toast.success("Course updated successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.courses() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to update course"));
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteCourse(id),
    onSuccess: () => {
      toast.success("Course deleted successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.courses() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to delete course"));
    },
  });
}

export function usePublishCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.publishCourse(id),
    onSuccess: (res: any) => {
      const message = res?.message || "Course status updated successfully";
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: adminKeys.courses() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to update course publish status"));
    },
  });
}

// --- Training Program Admin CRUD Hooks ---

export function useAdminTrainingPrograms(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: [...adminKeys.trainingPrograms(), params],
    queryFn: () => adminService.getAdminTrainingPrograms(params),
  });
}

export function usePublishTrainingProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.publishTrainingProgram(id),
    onSuccess: (res: any) => {
      toast.success(res?.message || "Training program status updated");
      queryClient.invalidateQueries({ queryKey: adminKeys.trainingPrograms() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to update training program status"));
    },
  });
}

export function useCreateTrainingProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminService.createTrainingProgram(data),
    onSuccess: () => {
      toast.success("Training program created successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.trainingPrograms() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to create training program"));
    },
  });
}

export function useUpdateTrainingProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminService.updateTrainingProgram(id, data),
    onSuccess: () => {
      toast.success("Training program updated successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.trainingPrograms() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to update training program"));
    },
  });
}

export function useDeleteTrainingProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteTrainingProgram(id),
    onSuccess: () => {
      toast.success("Training program deleted successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.trainingPrograms() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to delete training program"));
    },
  });
}

// --- Event Admin CRUD Hooks ---

export function useAdminEvents(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: [...adminKeys.events(), params],
    queryFn: () => adminService.getAdminEvents(params),
  });
}

export function usePublishEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.publishEvent(id),
    onSuccess: (res: any) => {
      toast.success(res?.message || "Event publish status updated");
      queryClient.invalidateQueries({ queryKey: adminKeys.events() });
      queryClient.invalidateQueries({ queryKey: ["bootcamps"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["workshops"] });
      queryClient.invalidateQueries({ queryKey: ["hackathons"] });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to update event status"));
    },
  });
}

export function useToggleEventStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status?: string }) =>
      adminService.toggleEventStatus(id, status),
    onSuccess: (res: any) => {
      toast.success(res?.message || "Event registration status updated");
      queryClient.invalidateQueries({ queryKey: adminKeys.events() });
      queryClient.invalidateQueries({ queryKey: ["bootcamps"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["workshops"] });
      queryClient.invalidateQueries({ queryKey: ["hackathons"] });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to toggle event registration status"));
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminService.createEvent(data),
    onSuccess: () => {
      toast.success("Event created successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.events() });
      queryClient.invalidateQueries({ queryKey: ["bootcamps"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["workshops"] });
      queryClient.invalidateQueries({ queryKey: ["hackathons"] });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to create event"));
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminService.updateEvent(id, data),
    onSuccess: () => {
      toast.success("Event updated successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.events() });
      queryClient.invalidateQueries({ queryKey: ["bootcamps"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["workshops"] });
      queryClient.invalidateQueries({ queryKey: ["hackathons"] });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to update event"));
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteEvent(id),
    onSuccess: () => {
      toast.success("Event deleted successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.events() });
      queryClient.invalidateQueries({ queryKey: ["bootcamps"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["workshops"] });
      queryClient.invalidateQueries({ queryKey: ["hackathons"] });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to delete event"));
    },
  });
}

// --- Enquiry & Lead Callback Hooks ---

export function useAdminEnquiries() {
  return useQuery({
    queryKey: adminKeys.enquiries(),
    queryFn: () => adminService.getEnquiries(),
    staleTime: STALE,
  });
}

export function useUpdateAdminEnquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: string; notes?: string; enquiry_type: string } }) =>
      adminService.updateEnquiry(id, data),
    onSuccess: () => {
      toast.success("Enquiry updated successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.enquiries() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to update enquiry"));
    },
  });
}

export function useDeleteAdminEnquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, enquiryType }: { id: string; enquiryType: string }) =>
      adminService.deleteEnquiry(id, enquiryType),
    onSuccess: () => {
      toast.success("Enquiry deleted successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.enquiries() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to delete enquiry"));
    },
  });
}

// --- Registration Hooks ---

export function useAdminRegistrations() {
  return useQuery({
    queryKey: adminKeys.registrations(),
    queryFn: () => adminService.getRegistrations(),
    staleTime: STALE,
  });
}

export function useUpdateAdminRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { status: string; payment_status: string; notes?: string; item_type: string };
    }) => adminService.updateRegistration(id, data),
    onSuccess: () => {
      toast.success("Registration updated successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.registrations() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to update registration"));
    },
  });
}

export function useDeleteAdminRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, itemType }: { id: string; itemType: string }) =>
      adminService.deleteRegistration(id, itemType),
    onSuccess: () => {
      toast.success("Registration deleted successfully");
      queryClient.invalidateQueries({ queryKey: adminKeys.registrations() });
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to delete registration"));
    },
  });
}
