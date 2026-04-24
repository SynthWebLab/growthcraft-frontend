/**
 * Registration Form Constants
 * Centralized dropdown options for all registration forms
 */

// Mentor Expertise Areas
export const MENTOR_EXPERTISE_OPTIONS = [
  { value: "Web Development", label: "Web Development" },
  { value: "Data Science & AI", label: "Data Science & AI" },
  { value: "Mobile Development", label: "Mobile Development" },
  { value: "DevOps & Cloud", label: "DevOps & Cloud" },
  { value: "UI/UX Design", label: "UI/UX Design" },
  { value: "Cybersecurity", label: "Cybersecurity" },
  { value: "Other", label: "Other" },
] as const;

// Employer Industry Types
export const EMPLOYER_INDUSTRY_OPTIONS = [
  { value: "IT/Software", label: "IT/Software" },
  { value: "Fintech", label: "Fintech" },
  { value: "E-Commerce", label: "E-Commerce" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "EdTech", label: "EdTech" },
  { value: "Startup", label: "Startup" },
  { value: "Other", label: "Other" },
] as const;

// Company Size Options
export const COMPANY_SIZE_OPTIONS = [
  { value: "1-50", label: "1-50" },
  { value: "51-200", label: "51-200" },
  { value: "201-500", label: "201-500" },
  { value: "500+", label: "500+" },
] as const;

// Helper function to get option labels
export function getOptionLabel(options: readonly { value: string; label: string }[], value: string): string {
  return options.find(opt => opt.value === value)?.label || value;
}

// Type exports for TypeScript
export type MentorExpertise = typeof MENTOR_EXPERTISE_OPTIONS[number]["value"];
export type EmployerIndustry = typeof EMPLOYER_INDUSTRY_OPTIONS[number]["value"];
export type CompanySize = typeof COMPANY_SIZE_OPTIONS[number]["value"];
