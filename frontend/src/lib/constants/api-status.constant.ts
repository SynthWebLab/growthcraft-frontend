/**
 * API Status Constants
 * Error codes and status messages from backend API
 */

// Authentication Error Codes
export const AUTH_ERROR_CODES = {
  // Registration
  USER_EXISTS: "USER_EXISTS",
  INVALID_ROLE: "INVALID_ROLE",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  
  // Login
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  ACCOUNT_LOCKED: "ACCOUNT_LOCKED",
  
  // Email Verification
  INVALID_OTP_FORMAT: "INVALID_OTP_FORMAT",
  VERIFICATION_FAILED: "VERIFICATION_FAILED",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  
  // Resend OTP
  MISSING_EMAIL: "MISSING_EMAIL",
  RESEND_FAILED: "RESEND_FAILED",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  
  // Password Reset
  MISSING_FIELDS: "MISSING_FIELDS",
  INVALID_PASSWORD: "INVALID_PASSWORD",
  INVALID_TOKEN: "INVALID_TOKEN",
  
  // General
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  SERVER_ERROR: "SERVER_ERROR",
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
} as const;

// User-friendly error messages
export const ERROR_MESSAGES = {
  [AUTH_ERROR_CODES.USER_EXISTS]: "An account with this email already exists",
  [AUTH_ERROR_CODES.INVALID_CREDENTIALS]: "Invalid email or password",
  [AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED]: "Please verify your email before logging in",
  [AUTH_ERROR_CODES.INVALID_OTP_FORMAT]: "OTP must be 6 digits",
  [AUTH_ERROR_CODES.VERIFICATION_FAILED]: "Invalid or expired OTP",
  [AUTH_ERROR_CODES.RATE_LIMIT_EXCEEDED]: "Too many attempts. Please try again later",
  [AUTH_ERROR_CODES.INVALID_TOKEN]: "Invalid or expired reset token",
  [AUTH_ERROR_CODES.INVALID_PASSWORD]: "Password must be at least 8 characters",
  [AUTH_ERROR_CODES.USER_NOT_FOUND]: "User not found",
  [AUTH_ERROR_CODES.SERVER_ERROR]: "Something went wrong. Please try again",
} as const;

export type AuthErrorCode = keyof typeof AUTH_ERROR_CODES;
