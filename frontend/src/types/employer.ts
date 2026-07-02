import type { ApiResponse } from "./api";

export interface Job {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  requirements: string[];
  skillsRequired: string[];
  location: string;
  locationType: "Onsite" | "Remote" | "Hybrid";
  salaryRange: {
    min?: number;
    max?: number;
  };
  jobType: "Full-time" | "Part-time" | "Internship" | "Contract";
  applicationDeadline?: string;
  status: "Draft" | "Active" | "Closed" | "Filled";
  applicantsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Candidate {
  id: string;
  name: string;
  skills: string[];
  course: string;
  location: string;
  availability: string;
  latestProject: string;
}

export interface EmployerProfile {
  _id: string;
  userId: string;
  companyName: string;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  industry: string;
  companySize: string;
  website?: string;
  hiringNeeds?: string;
  jobsPosted?: string[];
  totalHires?: number;
  isVerified?: boolean;
}

export interface EmployerDashboardData {
  companyName: string;
  kpis: {
    activeJobs: number;
    applicationsReceived: number;
    candidatesShortlisted: number;
    hiresMade: number;
  };
  funnelData: { stage: string; count: number }[];
  recentApplications: {
    name: string;
    role: string;
    date: string;
    status: "pending" | "active" | "cancelled" | "completed";
  }[];
}
