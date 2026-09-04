import { format } from "date-fns";

export interface BatchDateDetails {
  isTBA: boolean;
  status: "tba" | "upcoming" | "in-progress" | "completed";
  statusBadge: string;
  startDate: Date | null;
  endDate: Date | null;
  formattedStartDate: string | null;
  formattedEndDate: string | null;
  formattedRange: string;
  displayWithStatus: string;
  durationDays?: number;
}

/**
 * Detailed batch and date helper for GrowthCraft.
 * Computes started status, end date from duration if needed, and readable status strings.
 */
export function getBatchDateDetails(
  startDate?: string | Date | null,
  endDate?: string | Date | null,
  isDateTBA?: boolean,
  durationDays?: number | string | null
): BatchDateDetails {
  if (isDateTBA || !startDate) {
    return {
      isTBA: true,
      status: "tba",
      statusBadge: "To be announced",
      startDate: null,
      endDate: null,
      formattedStartDate: null,
      formattedEndDate: null,
      formattedRange: "To be announced",
      displayWithStatus: "To be announced",
    };
  }

  if (
    typeof startDate === "string" &&
    (startDate.toLowerCase().includes("announced") ||
      startDate.toLowerCase().includes("tba"))
  ) {
    return {
      isTBA: true,
      status: "tba",
      statusBadge: "To be announced",
      startDate: null,
      endDate: null,
      formattedStartDate: null,
      formattedEndDate: null,
      formattedRange: "To be announced",
      displayWithStatus: "To be announced",
    };
  }

  const start = new Date(startDate);
  if (isNaN(start.getTime())) {
    return {
      isTBA: true,
      status: "tba",
      statusBadge: "To be announced",
      startDate: null,
      endDate: null,
      formattedStartDate: null,
      formattedEndDate: null,
      formattedRange: "To be announced",
      displayWithStatus: "To be announced",
    };
  }

  let end: Date | null = null;
  if (endDate) {
    const parsedEnd = new Date(endDate);
    if (!isNaN(parsedEnd.getTime())) {
      end = parsedEnd;
    }
  }

  // If no endDate provided, calculate from durationDays if available
  let durationInDays: number | null = null;
  if (typeof durationDays === "number") {
    durationInDays = durationDays;
  } else if (typeof durationDays === "string") {
    const parsed = parseInt(durationDays, 10);
    if (!isNaN(parsed)) {
      if (durationDays.toLowerCase().includes("week")) {
        durationInDays = parsed * 7;
      } else if (durationDays.toLowerCase().includes("month")) {
        durationInDays = parsed * 30;
      } else {
        durationInDays = parsed;
      }
    }
  }

  if (!end && durationInDays && durationInDays > 0) {
    end = new Date(start.getTime() + durationInDays * 86400000);
  }

  const now = new Date();
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const endDay = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime() : null;

  const startFmt = start.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const endFmt = end
    ? end.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  const msInDay = 86400000;
  const daysDiff = Math.round((startDay - nowDay) / msInDay);

  let status: "upcoming" | "in-progress" | "completed" = "upcoming";
  let statusBadge = "Upcoming";
  let displayWithStatus = "";

  if (endDay && nowDay > endDay) {
    status = "completed";
    statusBadge = "Completed";
    displayWithStatus = `Completed on ${endFmt}`;
  } else if (nowDay >= startDay) {
    status = "in-progress";
    statusBadge = "In Progress";
    if (endFmt) {
      displayWithStatus = `Started from ${startFmt} • Ends on ${endFmt}`;
    } else {
      displayWithStatus = `Started from ${startFmt}`;
    }
  } else {
    status = "upcoming";
    if (daysDiff === 1) {
      statusBadge = "Starts Tomorrow";
      if (endFmt) {
        displayWithStatus = `Starts Tomorrow (${startFmt}) • Ends on ${endFmt}`;
      } else {
        displayWithStatus = `Starts Tomorrow (${startFmt})`;
      }
    } else if (daysDiff <= 7 && daysDiff > 1) {
      statusBadge = `Starts in ${daysDiff} days`;
      if (endFmt) {
        displayWithStatus = `Starts ${startFmt} • Ends on ${endFmt}`;
      } else {
        displayWithStatus = `Starts ${startFmt}`;
      }
    } else {
      statusBadge = "Upcoming";
      if (endFmt) {
        displayWithStatus = `Starts ${startFmt} • Ends on ${endFmt}`;
      } else {
        displayWithStatus = `Starts ${startFmt}`;
      }
    }
  }

  const formattedRange = endFmt ? `${startFmt} — ${endFmt}` : startFmt;

  return {
    isTBA: false,
    status,
    statusBadge,
    startDate: start,
    endDate: end,
    formattedStartDate: startFmt,
    formattedEndDate: endFmt,
    formattedRange,
    displayWithStatus,
    durationDays: durationInDays || (endDay ? Math.round((endDay - startDay) / msInDay) : undefined),
  };
}

/**
 * Standard date formatting helper for GrowthCraft.
 * Returns "To be announced" when a date is TBA, null, undefined, or invalid.
 * If scheduled, returns the starting date, ending date, and status.
 */
export function formatDisplayDate(
  startDate?: string | Date | null,
  endDate?: string | Date | null,
  isDateTBA?: boolean,
  durationDays?: number | string | null
): string {
  const details = getBatchDateDetails(startDate, endDate, isDateTBA, durationDays);
  if (details.isTBA) {
    return "To be announced";
  }
  return details.displayWithStatus;
}

/**
 * Safe date formatter with a custom pattern and fallback
 */
export function safeFormatDate(
  dateStr?: string | Date | null,
  formatPattern: string = "MMM dd, yyyy",
  fallback: string = "To be announced"
): string {
  if (!dateStr) return fallback;
  if (
    typeof dateStr === "string" &&
    (dateStr.toLowerCase().includes("announced") ||
      dateStr.toLowerCase().includes("tba"))
  ) {
    return fallback;
  }

  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return fallback;

  try {
    return format(dateObj, formatPattern);
  } catch {
    return fallback;
  }
}

/**
 * Check if a valid scheduled date is available
 */
export function isDateScheduled(
  dateStr?: string | Date | null,
  isDateTBA?: boolean
): boolean {
  if (isDateTBA) return false;
  if (!dateStr) return false;
  if (
    typeof dateStr === "string" &&
    (dateStr.toLowerCase().includes("announced") ||
      dateStr.toLowerCase().includes("tba"))
  ) {
    return false;
  }
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}
