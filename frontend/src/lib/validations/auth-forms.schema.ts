import { z } from "zod";
import {
  NAME_PATTERN,
  PHONE_PATTERN,
  URL_PATTERN,
  VALID_TEXT_PATTERN,
  LENGTHS,
  MESSAGES,
  isCommonPassword,
} from "./validators";

// ---------------------------------------------------------------------------
// Reusable Sub-Schemas
// ---------------------------------------------------------------------------

const nameSchema = z
  .string()
  .trim()
  .min(LENGTHS.NAME_MIN, MESSAGES.NAME_TOO_SHORT)
  .max(LENGTHS.NAME_MAX, MESSAGES.NAME_TOO_LONG)
  .regex(NAME_PATTERN, MESSAGES.NAME_INVALID);

const emailSchema = z
  .string()
  .trim()
  .min(1, MESSAGES.EMAIL_REQUIRED)
  .email(MESSAGES.EMAIL_INVALID);

const phoneSchema = z
  .string()
  .trim()
  .min(1, MESSAGES.PHONE_REQUIRED)
  .regex(PHONE_PATTERN, MESSAGES.PHONE_INVALID);

const passwordSchema = z
  .string()
  .min(LENGTHS.PASSWORD_MIN, MESSAGES.PASSWORD_TOO_SHORT)
  .max(LENGTHS.PASSWORD_MAX, MESSAGES.PASSWORD_TOO_LONG)
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/\d/, "Must contain at least one number")
  .refine((val) => !isCommonPassword(val), {
    message: MESSAGES.PASSWORD_COMMON,
  });

const confirmPasswordSchema = z.string().min(1, "Please confirm your password");

const validTextSchema = (field: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, MESSAGES.TEXT_TOO_SHORT(field, min))
    .max(max, MESSAGES.TEXT_TOO_LONG(field, max))
    .regex(VALID_TEXT_PATTERN, MESSAGES.TEXT_INVALID(field));

const optionalUrlSchema = z
  .string()
  .optional()
  .refine((val) => !val || val === "" || URL_PATTERN.test(val), {
    message: MESSAGES.URL_INVALID,
  });

// ---------------------------------------------------------------------------
// Login Schema (same for all roles)
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, MESSAGES.PASSWORD_REQUIRED),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// Student Registration
// ---------------------------------------------------------------------------

export const studentRegisterSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: MESSAGES.PASSWORDS_MISMATCH,
    path: ["confirmPassword"],
  });

export type StudentRegisterFormData = z.infer<typeof studentRegisterSchema>;

// ---------------------------------------------------------------------------
// Mentor Registration
// ---------------------------------------------------------------------------

export const mentorRegisterSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    experience: z
      .string()
      .min(1, MESSAGES.NUMBER_REQUIRED("Experience"))
      .refine((val) => /^\d+$/.test(val), {
        message: MESSAGES.NUMBER_INVALID("Experience"),
      })
      .refine((val) => {
        const num = parseInt(val, 10);
        return num >= LENGTHS.EXPERIENCE_MIN && num <= LENGTHS.EXPERIENCE_MAX;
      }, {
        message: `Experience must be between ${LENGTHS.EXPERIENCE_MIN} and ${LENGTHS.EXPERIENCE_MAX} years`,
      }),
    expertise: z.string().min(1, MESSAGES.SELECT_REQUIRED("area of expertise")),
    company: validTextSchema(
      "Organization",
      LENGTHS.COMPANY_MIN,
      LENGTHS.COMPANY_MAX,
    ),
    bio: z
      .string()
      .trim()
      .min(LENGTHS.BIO_MIN, MESSAGES.TEXT_TOO_SHORT("Bio", LENGTHS.BIO_MIN))
      .max(LENGTHS.BIO_MAX, MESSAGES.TEXT_TOO_LONG("Bio", LENGTHS.BIO_MAX))
      .regex(/[A-Za-z]/, "Bio must contain letters, not just numbers or symbols"),
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: MESSAGES.PASSWORDS_MISMATCH,
    path: ["confirmPassword"],
  });

export type MentorRegisterFormData = z.infer<typeof mentorRegisterSchema>;

// ---------------------------------------------------------------------------
// College Registration
// ---------------------------------------------------------------------------

export const collegeRegisterSchema = z
  .object({
    institution: validTextSchema(
      "Institution name",
      LENGTHS.INSTITUTION_MIN,
      LENGTHS.INSTITUTION_MAX,
    ),
    contactPerson: nameSchema,
    designation: validTextSchema(
      "Designation",
      LENGTHS.DESIGNATION_MIN,
      LENGTHS.DESIGNATION_MAX,
    ),
    email: emailSchema,
    phone: phoneSchema,
    city: validTextSchema("City", LENGTHS.CITY_MIN, LENGTHS.CITY_MAX),
    state: validTextSchema("State", LENGTHS.STATE_MIN, LENGTHS.STATE_MAX),
    website: optionalUrlSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: MESSAGES.PASSWORDS_MISMATCH,
    path: ["confirmPassword"],
  });

export type CollegeRegisterFormData = z.infer<typeof collegeRegisterSchema>;

// ---------------------------------------------------------------------------
// Employer Registration
// ---------------------------------------------------------------------------

export const employerRegisterSchema = z
  .object({
    company: validTextSchema(
      "Company name",
      LENGTHS.COMPANY_MIN,
      LENGTHS.COMPANY_MAX,
    ),
    contactPerson: nameSchema,
    industry: z.string().min(1, MESSAGES.SELECT_REQUIRED("an industry")),
    email: emailSchema,
    phone: phoneSchema,
    companySize: z.string().min(1, MESSAGES.SELECT_REQUIRED("company size")),
    website: optionalUrlSchema,
    hiringNeeds: z
      .string()
      .max(LENGTHS.HIRING_NEEDS_MAX, MESSAGES.TEXT_TOO_LONG("Hiring needs", LENGTHS.HIRING_NEEDS_MAX))
      .refine((val) => !val || val === "" || /[A-Za-z]/.test(val), {
        message: "Hiring needs must contain letters, not just numbers or symbols",
      })
      .optional()
      .or(z.literal("")),
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: MESSAGES.PASSWORDS_MISMATCH,
    path: ["confirmPassword"],
  });

export type EmployerRegisterFormData = z.infer<typeof employerRegisterSchema>;
