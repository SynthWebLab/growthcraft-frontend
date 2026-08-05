"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  useStudentBootcamps,
  useStudentWorkshops,
  useStudentHackathons,
  useStudentCourses,
} from "@/hooks/queries/useStudent";

export function useUserEnrollments() {
  const { data: user } = useCurrentUser();
  const isStudent = user?.role === "student";

  const { data: bootcampsData } = useStudentBootcamps();
  const { data: workshopsData } = useStudentWorkshops();
  const { data: hackathonsData } = useStudentHackathons();
  const { data: coursesData } = useStudentCourses();

  const isEventEnrolled = (idOrSlug?: string): boolean => {
    if (!isStudent || !idOrSlug) return false;
    const target = idOrSlug.toString().toLowerCase().trim().replace(/_/g, "-");

    const matches = (item: any) => {
      if (!item) return false;

      // Unpaid pending checkouts are NOT active enrollments
      const isConfirmed = item.status === "confirmed" || item.paymentStatus === "completed" || item.status === "Completed" || item.status === "Active";
      if (!isConfirmed) return false;

      const id = (
        item._id ||
        item.id ||
        item.eventId?._id ||
        item.eventId?.id ||
        (typeof item.eventId === "string" ? item.eventId : "") ||
        item.bootcampId?._id ||
        item.bootcampId ||
        item.workshopId?._id ||
        item.workshopId ||
        item.hackathonId?._id ||
        item.hackathonId ||
        ""
      )
        .toString()
        .toLowerCase()
        .trim();

      const slug = (
        item.slug ||
        item.eventId?.slug ||
        item.bootcampId?.slug ||
        item.workshopId?.slug ||
        item.hackathonId?.slug ||
        ""
      )
        .toString()
        .toLowerCase()
        .trim()
        .replace(/_/g, "-");

      return (Boolean(id) && id === target) || (Boolean(slug) && slug === target);
    };

    const extractItems = (res: any) => {
      if (!res) return [];
      if (Array.isArray(res)) return res;
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.bootcamps)) return res.data.bootcamps;
      if (Array.isArray(res.data?.workshops)) return res.data.workshops;
      if (Array.isArray(res.data?.hackathons)) return res.data.hackathons;
      if (Array.isArray(res.data?.courses)) return res.data.courses;
      if (Array.isArray(res.bootcamps)) return res.bootcamps;
      if (Array.isArray(res.workshops)) return res.workshops;
      if (Array.isArray(res.hackathons)) return res.hackathons;
      if (Array.isArray(res.courses)) return res.courses;
      if (Array.isArray(res.items)) return res.items;
      return [];
    };

    const bootcamps = extractItems(bootcampsData);
    if (bootcamps.some(matches)) return true;

    const workshops = extractItems(workshopsData);
    if (workshops.some(matches)) return true;

    const hackathons = extractItems(hackathonsData);
    if (hackathons.some(matches)) return true;

    return false;
  };

  const isCourseEnrolled = (idOrSlug?: string): boolean => {
    if (!isStudent || !idOrSlug) return false;
    const target = idOrSlug.toString().toLowerCase().trim().replace(/_/g, "-");

    const matches = (item: any) => {
      if (!item) return false;

      const isConfirmed = item.status === "confirmed" || item.paymentStatus === "completed" || item.status === "Completed" || item.status === "Active";
      if (!isConfirmed) return false;

      const id = (
        item._id ||
        item.id ||
        item.courseId?._id ||
        item.courseId?.id ||
        (typeof item.courseId === "string" ? item.courseId : "") ||
        ""
      )
        .toString()
        .toLowerCase()
        .trim();

      const slug = (item.slug || item.courseId?.slug || "").toString().toLowerCase().trim().replace(/_/g, "-");
      return (Boolean(id) && id === target) || (Boolean(slug) && slug === target);
    };

    const extractItems = (res: any) => {
      if (!res) return [];
      if (Array.isArray(res)) return res;
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.courses)) return res.data.courses;
      if (Array.isArray(res.courses)) return res.courses;
      if (Array.isArray(res.items)) return res.items;
      return [];
    };

    const courses = extractItems(coursesData);
    if (courses.some(matches)) return true;

    return false;
  };

  return {
    isStudent,
    isEventEnrolled,
    isCourseEnrolled,
  };
}
