export const BOOTCAMP_MODES = ["Online", "Offline", "Hybrid"] as const;
export const BOOTCAMP_STATUSES = ["Draft", "Open", "Closed", "Completed"] as const;
export const BOOTCAMP_FILTER_STATUSES = ["Open", "Closed", "Completed"] as const;

export interface BootcampCTA {
  status: string;
  condition: string;
  seatsAvailable: boolean;
  primaryCTA: string;
  secondaryCTA: string | null;
  disabled: boolean;
  codeLocation: string;
}

export interface Bootcamp {
  id: string;
  type: "bootcamp";
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number;
  banner: string;
  rating: number;
  tags: string[];
  startDate: string;
  endDate: string;
  mode: (typeof BOOTCAMP_MODES)[number];
  maxSeats: number;
  enrolledCount: number;
  availableSeats: number;
  skillsCovered: string[];
  mentorNames: string[];
  status: (typeof BOOTCAMP_STATUSES)[number];
  canRegister: boolean;
  primaryCTA: string;
  secondaryCTA: string | null;
  cta?: BootcampCTA;
  createdAt: string;
  updatedAt: string;
}

export interface BootcampPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BootcampListResponse {
  items: Bootcamp[];
  nextCursor: string | null;
  pagination: BootcampPagination;
}

export interface BootcampQueryParams {
  limit?: number;
  page?: number;
  category?: string;
  mode?: (typeof BOOTCAMP_MODES)[number];
  status?: (typeof BOOTCAMP_FILTER_STATUSES)[number];
}
