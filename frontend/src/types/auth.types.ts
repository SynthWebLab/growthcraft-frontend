export type UserRole = 
  | "student" 
  | "mentor" 
  | "college" 
  | "employer" 
  | "ops" 
  | "super_admin"
  | "ambassador";

export interface AuthUser {
  id: string;
  _id?: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  isAmbassador?: boolean;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
