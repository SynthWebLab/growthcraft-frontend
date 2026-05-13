/**
 * CTA Policy - Determines which Call-to-Action buttons to show for catalogue items
 * Based on item type, status, and availability
 */

export type CTAType = "enroll-now" | "request-callback" | "register-interest" | "reserve-seat" | "join-waitlist" | "notify-next-batch";

export type FormType = "enrollment" | "callback" | "register-interest" | "reserve-seat" | "join-waitlist" | "notify-next-batch";

export interface CTAConfig {
  type: CTAType;
  label: string;
  variant?: "default" | "outline";
}

export interface CTAResult {
  primary: CTAConfig;
  secondary?: CTAConfig;
}

export type CourseStatus = "active" | "coming-soon" | "draft";
export type BootcampStatus = "Open" | "Closed" | "Completed" | "Draft";

interface CourseItem {
  type: "course";
  status: CourseStatus;
}

interface BootcampItem {
  type: "bootcamp";
  status: BootcampStatus;
  maxSeats: number;
  enrolledCount: number;
  startDate: string;
}

export type CatalogueItem = CourseItem | BootcampItem;

/**
 * Map CTA type to form type for popup forms
 */
export function ctaTypeToFormType(ctaType: CTAType): FormType {
  switch (ctaType) {
    case "enroll-now":
      return "enrollment";
    case "request-callback":
      return "callback";
    case "register-interest":
      return "register-interest";
    case "reserve-seat":
      return "reserve-seat";
    case "join-waitlist":
      return "join-waitlist";
    case "notify-next-batch":
      return "notify-next-batch";
    default:
      return "callback";
  }
}

/**
 * Get primary and secondary CTAs for a catalogue item
 */
export function getPrimaryCta(item: CatalogueItem): CTAResult {
  if (item.type === "course") {
    return getCourseCta(item);
  }
  
  if (item.type === "bootcamp") {
    return getBootcampCta(item);
  }

  return {
    primary: { type: "request-callback", label: "Request Callback", variant: "default" },
  };
}

/**
 * Course CTA Logic
 */
function getCourseCta(course: CourseItem): CTAResult {
  switch (course.status) {
    case "active":
      return {
        primary: { type: "enroll-now", label: "Enroll Now", variant: "default" },
        secondary: { type: "request-callback", label: "Request Callback", variant: "outline" },
      };

    case "coming-soon":
      return {
        primary: { type: "register-interest", label: "Register Interest", variant: "default" },
      };

    case "draft":
    default:
      return {
        primary: { type: "request-callback", label: "Request Callback", variant: "default" },
      };
  }
}

/**
 * Bootcamp CTA Logic
 */
function getBootcampCta(bootcamp: BootcampItem): CTAResult {
  const seatsAvailable = bootcamp.maxSeats - bootcamp.enrolledCount > 0;
  const hasStarted = new Date(bootcamp.startDate) < new Date();

  switch (bootcamp.status) {
    case "Open":
      if (hasStarted) {
        // Bootcamp already started
        return {
          primary: { type: "request-callback", label: "Request Callback", variant: "default" },
        };
      }
      
      if (seatsAvailable) {
        // Seats available
        return {
          primary: { type: "reserve-seat", label: "Reserve Seat", variant: "default" },
          secondary: { type: "request-callback", label: "Request Callback", variant: "outline" },
        };
      }
      
      // Seats full
      return {
        primary: { type: "join-waitlist", label: "Join Waitlist", variant: "default" },
        secondary: { type: "request-callback", label: "Request Callback", variant: "outline" },
      };

    case "Closed":
      return {
        primary: { type: "request-callback", label: "Request Callback", variant: "default" },
      };

    case "Completed":
      return {
        primary: { type: "notify-next-batch", label: "Notify for Next Batch", variant: "default" },
      };

    case "Draft":
      return {
        primary: { type: "register-interest", label: "Register Interest", variant: "default" },
      };

    default:
      return {
        primary: { type: "request-callback", label: "Request Callback", variant: "default" },
      };
  }
}
