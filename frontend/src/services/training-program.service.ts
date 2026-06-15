/**
 * Training Program Service
 * Handles API calls for training programs
 */

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  TrainingProgramsResponse,
  TrainingProgramFilters,
  TrainingProgramDetailResponse,
  TrainingProgramConfigResponse,
} from "@/types/training-program";

const statusMap: Record<string, string> = {
  active: "Active",
  "coming-soon": "Coming Soon",
  draft: "Draft",
};

/**
 * Fetch list of training programs with optional filters
 */
export async function getTrainingPrograms(
  filters?: TrainingProgramFilters
): Promise<TrainingProgramsResponse> {
  let endpoint: string = API_ENDPOINTS.trainingPrograms.list;
  if (filters) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    const queryString = queryParams.toString();
    if (queryString) {
      endpoint = `${endpoint}?${queryString}`;
    }
  }

  const response = await apiClient.get<any>(endpoint);

  const programs = (response.data?.programs || []).map((p: any) => ({
    ...p,
    duration: p.durationDays,
    status: statusMap[p.status] || p.status,
    primaryCTA: p.primaryCTA || "Enroll Now",
    secondaryCTA: p.secondaryCTA || "Request Callback",
    mentorName: p.mentorName || "Industry Expert",
  }));

  return {
    success: response.success,
    message: response.message,
    data: programs,
    meta: {
      timestamp: new Date().toISOString(),
      pagination: {
        page: response.data?.page || 1,
        limit: filters?.limit || 12,
        total: response.data?.total || programs.length,
        totalPages: response.data?.totalPages || 1,
      },
    },
  };
}

/**
 * Fetch a single training program by slug and combine with detail endpoints
 */
export async function getTrainingProgramBySlug(
  slug: string
): Promise<TrainingProgramDetailResponse> {
  const [programRes, detailsRes] = await Promise.all([
    apiClient.get<any>(API_ENDPOINTS.trainingPrograms.basicBySlug(slug)),
    apiClient.get<any>(API_ENDPOINTS.trainingPrograms.detailsBySlug(slug)),
  ]);

  const program = programRes.data?.program;
  const details = detailsRes.data?.programDetails;

  if (!program) {
    throw new Error("Training program not found");
  }

  const mappedProgram = {
    ...program,
    duration: program.durationDays,
    status: statusMap[program.status] || program.status,
    cohorts: program.startDate ? [
      {
        _id: "c_default",
        cohortNumber: 1,
        startDate: program.startDate,
        endDate: new Date(new Date(program.startDate).getTime() + (program.durationDays || 30) * 24 * 60 * 60 * 1000).toISOString(),
        maxSeats: program.maxSeats || 50,
        enrolledCount: program.enrolledCount || 0,
        status: (program.enrolledCount || 0) >= (program.maxSeats || 50) ? "Closed" : "Open",
      }
    ] : [],
    mentorName: details?.mentors?.[0]?.name || "Industry Expert",
    primaryCTA: program.primaryCTA || "Enroll Now",
    secondaryCTA: program.secondaryCTA || "Request Callback",
  };

  return {
    success: true,
    message: "Training program details retrieved successfully",
    data: {
      program: mappedProgram,
      overview: {
        aboutProgram: details?.overview?.aboutProgram || program.description,
        whatYouWillLearn: (details?.overview?.whatYouWillLearn || []).map((item: any, idx: number) => ({
          _id: `learn-${idx}`,
          text: item.text,
        })),
        prerequisites: (details?.overview?.prerequisites || []).map((item: any, idx: number) => ({
          _id: `prereq-${idx}`,
          text: item.text,
        })),
        whatsIncluded: (details?.overview?.whatsIncluded || []).map((item: any, idx: number) => ({
          _id: `included-${idx}`,
          text: item.text,
          icon: item.icon || "check",
        })),
      },
      syllabus: (details?.syllabus || []).map((item: any, idx: number) => ({
        _id: `week-${item.week || idx + 1}`,
        weekNumber: item.week || idx + 1,
        title: item.title,
        topics: (item.topics || []).map((topic: string, tIdx: number) => ({
          _id: `topic-${item.week || idx + 1}-${tIdx}`,
          text: topic,
        })),
      })),
      mentors: (details?.mentors || []).map((m: any) => ({
        name: m.name,
        avatar: m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(m.name)}`,
        bio: m.bio,
        designation: m.designation,
        company: m.company,
        rating: program.rating || 4.8,
        studentsCount: program.enrollmentCount || 100,
        expertise: m.expertise || [],
      })),
      faqs: (details?.faqs || []).map((item: any, idx: number) => ({
        _id: `faq-${idx}`,
        question: item.question,
        answer: item.answer,
      })),
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Fetch training program configuration (domains, levels)
 */
export async function getTrainingProgramConfig(): Promise<TrainingProgramConfigResponse> {
  const response = await apiClient.get<any>(API_ENDPOINTS.trainingPrograms.domains);
  return {
    success: true,
    message: "Config retrieved successfully",
    data: {
      domains: response.data?.domains || [],
      levels: ["Beginner", "Intermediate", "Advanced"],
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Enroll in a training program
 */
export async function enrollInTrainingProgram(
  programId: string,
  data: {
    fullName: string;
    email: string;
    phone: string;
    cohortId?: string;
  }
): Promise<any> {
  return await apiClient.post(
    API_ENDPOINTS.trainingPrograms.enroll(programId),
    data
  );
}

/**
 * Request callback for a training program
 */
export async function requestTrainingProgramCallback(
  programId: string,
  data: {
    fullName: string;
    email: string;
    phone: string;
  }
): Promise<any> {
  return await apiClient.post(
    API_ENDPOINTS.trainingPrograms.requestCallback(programId),
    data
  );
}

/**
 * Check enrollment status for a training program
 */
export async function getTrainingProgramEnrollmentStatus(
  programId: string
): Promise<{ success: boolean; data: { isEnrolled: boolean; hasCallbackRequest: boolean } }> {
  return await apiClient.get<{ success: boolean; data: { isEnrolled: boolean; hasCallbackRequest: boolean } }>(
    API_ENDPOINTS.trainingPrograms.enrollmentStatus(programId)
  );
}
