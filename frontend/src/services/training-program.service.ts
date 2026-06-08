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

/**
 * Fetch list of training programs with optional filters
 */
export async function getTrainingPrograms(
  filters?: TrainingProgramFilters
): Promise<TrainingProgramsResponse> {
  // Build query string from filters
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

  return await apiClient.get<TrainingProgramsResponse>(endpoint);
}

/**
 * Fetch a single training program by slug
 */
export async function getTrainingProgramBySlug(
  slug: string
): Promise<TrainingProgramDetailResponse> {
  return await apiClient.get<TrainingProgramDetailResponse>(
    API_ENDPOINTS.trainingPrograms.detailBySlug(slug)
  );
}

/**
 * Fetch training program configuration (domains, levels)
 */
export async function getTrainingProgramConfig(): Promise<TrainingProgramConfigResponse> {
  return await apiClient.get<TrainingProgramConfigResponse>(
    API_ENDPOINTS.trainingPrograms.config
  );
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
