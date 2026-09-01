/**
 * Shared Common Types and Interfaces
 * Stable generic utilities used across multiple modules
 */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  meta?: {
    pagination?: PaginationMeta;
  };
}

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export type SortOrder = "asc" | "desc";

export type StatusVariant = "default" | "success" | "warning" | "destructive" | "secondary" | "outline";
