export type UserRole = 
  | "student" 
  | "mentor" 
  | "college" 
  | "employer" 
  | "ops" 
  | "super_admin";

export interface AuthUser {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
