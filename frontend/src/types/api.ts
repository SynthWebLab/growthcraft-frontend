/**
 * API Type Definitions
 * All types for API requests and responses
 */

export interface RegisterStudentData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: "student";
  referralCode?: string;
}

export interface RegisterMentorData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: "mentor";
  mentorData: {
    experienceYears: number;
    areaOfExpertise: string;
    currentOrganization: string;
    bio: string;
  };
}

export interface RegisterCollegeData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: "college";
  collegeData: {
    institutionName: string;
    contactPerson: string;
    designation: string;
    officialEmail: string;
    phone: string;
    city: string;
    state: string;
    website?: string;
  };
}

export interface RegisterEmployerData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: "employer";
  employerData: {
    companyName: string;
    contactPerson: string;
    industry: string;
    officialEmail: string;
    phone: string;
    companySize: string;
    website?: string;
    hiringNeeds?: string;
  };
}

export type RegisterData = 
  | RegisterStudentData 
  | RegisterMentorData 
  | RegisterCollegeData 
  | RegisterEmployerData;

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any[];
  };
}
