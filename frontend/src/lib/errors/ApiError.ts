/**
 * Standardized API Error class for frontend requests
 * Matches backend error response schema:
 * {
 *   success: false,
 *   error: {
 *     message: string,
 *     code: string,
 *     statusCode?: number,
 *     details?: unknown
 *   }
 * }
 */

export interface ApiErrorResponseData {
  success?: boolean;
  message?: string;
  code?: string;
  statusCode?: number;
  error?: {
    message?: string;
    code?: string;
    statusCode?: number;
    details?: unknown;
  };
  details?: unknown;
}

export interface ApiErrorOptions {
  statusCode?: number;
  code?: string;
  details?: unknown;
  originalError?: unknown;
  response?: {
    status: number;
    statusText?: string;
    data?: unknown;
  };
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly isOperational: boolean;
  public readonly response?: {
    status: number;
    statusText?: string;
    data?: unknown;
  };
  public readonly originalError?: unknown;

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message);
    this.name = "ApiError";
    this.statusCode = options.statusCode || options.response?.status || 500;
    this.code = options.code || "INTERNAL_ERROR";
    this.details = options.details;
    this.response = options.response;
    this.originalError = options.originalError;
    this.isOperational = true;

    // Maintains proper stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Helper to check if an unknown error is an instance of ApiError
   */
  public static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }
}

export default ApiError;
