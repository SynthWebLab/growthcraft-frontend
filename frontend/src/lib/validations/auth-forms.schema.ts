import { z } from "zod";

// Common validation rules
const emailSchema = z.string().email("Invalid email address");
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");
const phoneSchema = z.string().min(10, "Phone number must be at least 10 digits");

// Login schema (same for all roles)
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Student registration schema
export const studentRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
});

export type StudentRegisterFormData = z.infer<typeof studentRegisterSchema>;

// Mentor registration schema
export const mentorRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: emailSchema,
  phone: phoneSchema,
  experience: z.string().min(1, "Experience is required"),
  expertise: z.string().min(1, "Please select your area of expertise"),
  company: z.string().min(2, "Organization name is required"),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  password: passwordSchema,
});

export type MentorRegisterFormData = z.infer<typeof mentorRegisterSchema>;

// College registration schema
export const collegeRegisterSchema = z.object({
  institution: z.string().min(2, "Institution name is required"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  designation: z.string().min(2, "Designation is required"),
  email: emailSchema,
  phone: phoneSchema,
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  website: z.string()
    .optional()
    .refine((val) => !val || val === "" || /^https?:\/\/.+\..+/.test(val), {
      message: "Invalid URL format",
    }),
  password: passwordSchema,
});

export type CollegeRegisterFormData = z.infer<typeof collegeRegisterSchema>;

// Employer registration schema
export const employerRegisterSchema = z.object({
  company: z.string().min(2, "Company name is required"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  industry: z.string().min(1, "Please select an industry"),
  email: emailSchema,
  phone: phoneSchema,
  companySize: z.string().min(1, "Please select company size"),
  website: z.string()
    .optional()
    .refine((val) => !val || val === "" || /^https?:\/\/.+\..+/.test(val), {
      message: "Invalid URL format",
    }),
  hiringNeeds: z.string().optional().or(z.literal("")),
  password: passwordSchema,
});

export type EmployerRegisterFormData = z.infer<typeof employerRegisterSchema>;
