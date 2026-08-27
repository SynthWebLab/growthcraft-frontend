/**
 * Centralized Validation Utilities
 *
 * Reusable validation patterns, helpers, and constants aligned with
 * backend express-validator rules in:
 *   backend/src/modules/auth/validators/auth.validator.ts
 *   backend/src/common/validators/password.validator.ts
 *
 * Every form schema should import from here instead of
 * duplicating regex patterns.
 */

// ---------------------------------------------------------------------------
// Regex Patterns
// ---------------------------------------------------------------------------

/** Allows letters (including accented), spaces, hyphens, and apostrophes */
export const NAME_PATTERN =
  /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]+(?:[ '\-][A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]+)*$/;

/** Standard email – kept simple; Zod's .email() does the heavy lifting */
export const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

/**
 * Phone: optional leading +, then 7–15 digits only. No letters, no symbols.
 */
export const PHONE_PATTERN = /^\+?\d{7,15}$/;

/** Password: uppercase + lowercase + digit (mirrors backend passwordRules) */
export const PASSWORD_STRENGTH_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

/** Special character detection for stronger passwords */
export const SPECIAL_CHAR_PATTERN = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

/** URL pattern – relaxed, frontend-friendly */
export const URL_PATTERN = /^https?:\/\/.+\..+/;

/**
 * "Valid text" – rejects strings that are only digits, only symbols,
 * or contain HTML/script tags. Must have at least one letter.
 */
export const VALID_TEXT_PATTERN = /^(?!.*<[^>]+>)(?=.*[A-Za-z\u00C0-\u00FF]).+$/;

// ---------------------------------------------------------------------------
// Length Constants (aligned with backend)
// ---------------------------------------------------------------------------

export const LENGTHS = {
  NAME_MIN: 2,
  NAME_MAX: 100,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
  PHONE_MIN: 7,
  PHONE_MAX: 20,
  BIO_MIN: 10,
  BIO_MAX: 1000,
  INSTITUTION_MIN: 2,
  INSTITUTION_MAX: 200,
  COMPANY_MIN: 2,
  COMPANY_MAX: 200,
  CITY_MIN: 2,
  CITY_MAX: 100,
  STATE_MIN: 2,
  STATE_MAX: 100,
  DESIGNATION_MIN: 2,
  DESIGNATION_MAX: 100,
  HIRING_NEEDS_MAX: 1000,
  EXPERIENCE_MIN: 0,
  EXPERIENCE_MAX: 50,
} as const;

// ---------------------------------------------------------------------------
// Common Password Blacklist
// Mirrors backend PasswordValidator.COMMON_PASSWORDS and extends it
// ---------------------------------------------------------------------------

export const COMMON_PASSWORDS: ReadonlySet<string> = new Set([
  "password",
  "password1",
  "password123",
  "12345678",
  "123456789",
  "qwerty",
  "qwerty123",
  "abc123",
  "monkey",
  "1234567",
  "letmein",
  "trustno1",
  "dragon",
  "baseball",
  "iloveyou",
  "master",
  "sunshine",
  "ashley",
  "bailey",
  "passw0rd",
  "shadow",
  "123123",
  "654321",
  "superman",
  "qazwsx",
  "michael",
  "football",
  "admin123",
  "welcome123",
  "welcome1",
]);

// ---------------------------------------------------------------------------
// Validation Helpers
// ---------------------------------------------------------------------------

/** Returns true when the string is a common / weak password */
export function isCommonPassword(value: string): boolean {
  return COMMON_PASSWORDS.has(value.toLowerCase());
}

/** Count how many actual digits are in a phone string */
export function countDigits(value: string): number {
  return (value.match(/\d/g) || []).length;
}

/** Strips HTML/script tags from a string (sanitisation fallback) */
export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "");
}

/** Returns true when the value contains only digits / symbols (no letters) */
export function isGibberish(value: string): boolean {
  // Must have at least one letter
  return !/[A-Za-z\u00C0-\u00FF]/.test(value);
}

/**
 * Strips everything except digits and a leading + from a phone input value.
 * Use as an onChange filter so the user can only type numbers.
 */
export function sanitizePhone(value: string): string {
  // Preserve leading + if present, then keep only digits
  const hasPlus = value.startsWith("+");
  const digits = value.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

// ---------------------------------------------------------------------------
// Password Strength Calculator
// ---------------------------------------------------------------------------

export type PasswordStrengthLevel = "weak" | "fair" | "strong";

export interface PasswordStrength {
  level: PasswordStrengthLevel;
  score: number; // 0-100 for the progress bar
  label: string;
}

export interface PasswordRequirements {
  minLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  specialChar: boolean;
  notCommon: boolean;
}

export function getPasswordRequirements(password: string): PasswordRequirements {
  return {
    minLength: password.length >= LENGTHS.PASSWORD_MIN,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    specialChar: SPECIAL_CHAR_PATTERN.test(password),
    notCommon: password.length > 0 ? !isCommonPassword(password) : true,
  };
}

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { level: "weak", score: 0, label: "Weak" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (SPECIAL_CHAR_PATTERN.test(password)) score++;

  // Penalise common passwords
  if (isCommonPassword(password)) score = Math.min(score, 1);

  if (score <= 3) return { level: "weak", score: 33, label: "Weak" };
  if (score <= 5) return { level: "fair", score: 66, label: "Fair" };
  return { level: "strong", score: 100, label: "Strong" };
}

// ---------------------------------------------------------------------------
// Validation Error Messages (centralised & user-friendly)
// ---------------------------------------------------------------------------

export const MESSAGES = {
  // Name
  NAME_REQUIRED: "Full name is required",
  NAME_INVALID: "Name can contain letters, spaces, hyphens, and apostrophes only",
  NAME_TOO_SHORT: `Name must be at least ${LENGTHS.NAME_MIN} characters`,
  NAME_TOO_LONG: `Name must be at most ${LENGTHS.NAME_MAX} characters`,

  // Email
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Please enter a valid email address",

  // Phone
  PHONE_REQUIRED: "Phone number is required",
  PHONE_INVALID: "Please enter a valid phone number",
  PHONE_TOO_SHORT: `Phone number must have at least ${LENGTHS.PHONE_MIN} digits`,

  // Password
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_TOO_SHORT: `Password must be at least ${LENGTHS.PASSWORD_MIN} characters`,
  PASSWORD_TOO_LONG: `Password must be at most ${LENGTHS.PASSWORD_MAX} characters`,
  PASSWORD_WEAK:
    "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  PASSWORD_COMMON: "This password is too common. Please choose a more unique password",
  PASSWORDS_MISMATCH: "Passwords do not match",
  PASSWORDS_MATCH: "Passwords match",

  // Text fields
  TEXT_REQUIRED: (field: string) => `${field} is required`,
  TEXT_INVALID: (field: string) =>
    `Please enter a valid ${field.toLowerCase()} using letters and common characters`,
  TEXT_TOO_SHORT: (field: string, min: number) =>
    `${field} must be at least ${min} characters`,
  TEXT_TOO_LONG: (field: string, max: number) =>
    `${field} must be at most ${max} characters`,

  // URL
  URL_INVALID: "Please enter a valid URL (e.g. https://example.com)",

  // Number
  NUMBER_REQUIRED: (field: string) => `${field} is required`,
  NUMBER_INVALID: (field: string) => `${field} must be a valid number`,
  NUMBER_MIN: (field: string, min: number) => `${field} must be at least ${min}`,
  NUMBER_MAX: (field: string, max: number) => `${field} must be at most ${max}`,

  // Select
  SELECT_REQUIRED: (field: string) => `Please select ${field.toLowerCase()}`,

  // Form-level
  FORM_HAS_ERRORS: "Please correct the highlighted fields before continuing",
  REGISTRATION_FAILED: "Registration failed",
  LOGIN_FAILED: "Sign in failed",
} as const;
