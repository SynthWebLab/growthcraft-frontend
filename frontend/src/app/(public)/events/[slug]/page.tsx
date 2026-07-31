"use client";

import { use, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { DataCard } from "@/components/ui/data-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Check,
  Star,
  ArrowLeft,
  Users,
  Share2,
  Copy,
  PlayCircle,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Flame,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PopupForm, usePopupForm } from "@/components/common/PopupForm";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useWorkshopDetails } from "@/hooks/queries/useWorkshops";
import { useHackathonDetails } from "@/hooks/queries/useHackathons";
import { useEventBySlug } from "@/hooks/queries/useEvents";
import { useBootcampBySlug } from "@/hooks/queries/useBootcamps";
import { toast } from "sonner";
import { format } from "date-fns";
import { getEventDetailBySlug } from "@/data/events-detail.mock";
import type { WorkshopDetailResponse } from "@/types/workshop";
import type { HackathonDetailResponse } from "@/types/hackathon";

type EventDetailResponse = WorkshopDetailResponse | HackathonDetailResponse;

function safeFormatDate(dateStr?: string | Date, formatPattern: string = "MMMM dd, yyyy"): string {
  if (!dateStr) return "";
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return "";
  try {
    return format(dateObj, formatPattern);
  } catch (err) {
    return "";
  }
}

function getEventDuration(startDate?: string, endDate?: string, durationDays?: number) {
  if (durationDays && durationDays > 1) return durationDays * 24;
  if (!startDate || !endDate) return 1;

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (isNaN(start) || isNaN(end)) return 1;

  const durationMs = end - start;
  return Math.max(1, Math.round(durationMs / (1000 * 60 * 60)));
}

function mapEventDetailToEventData(response: any) {
  if (!response) return null;
  
  const rawData = response?.data || response;
  const details = rawData?.eventDetails || rawData;
  const event = 
    (typeof details?.eventId === "object" && details?.eventId !== null ? details.eventId : null) ||
    (typeof rawData?.event === "object" && rawData?.event !== null ? rawData.event : null) ||
    (typeof details?.event === "object" && details?.event !== null ? details.event : null) ||
    details ||
    {};

  const title = event?.title || details?.title || rawData?.title || "Event Details";
  const type = event?.type || details?.type || rawData?.type || "Bootcamp";
  const price = event?.price ?? details?.price ?? rawData?.price ?? 0;
  const originalPrice = event?.originalPrice ?? details?.originalPrice ?? rawData?.originalPrice ?? 0;
  const maxSeats = event?.maxSeats ?? details?.maxSeats ?? rawData?.maxSeats ?? 50;
  const enrolledCount = event?.enrolledCount ?? details?.enrolledCount ?? rawData?.enrolledCount ?? 0;
  const status = event?.status || details?.status || rawData?.status || "Open";
  const mode = event?.mode || details?.venue?.mode || details?.mode || rawData?.mode || "Online";
  const startDate = event?.startDate || details?.startDate || rawData?.startDate;
  const endDate = event?.endDate || details?.endDate || rawData?.endDate;
  const rating = event?.rating || details?.rating || rawData?.rating || 4.9;
  const tools = event?.skillsCovered || event?.keyTools || details?.tools || details?.overview?.whatYouWillLearn?.map((w: any) => typeof w === "string" ? w : w.text) || [];
  const mentors = 
    (Array.isArray(event?.mentors) && event.mentors.length > 0) ? event.mentors :
    (Array.isArray(details?.mentors) && details.mentors.length > 0) ? details.mentors :
    (Array.isArray(rawData?.mentors) && rawData.mentors.length > 0) ? rawData.mentors :
    [];
  
  const mentorName = 
    Array.isArray(event?.mentorNames) ? event.mentorNames.join(", ") :
    mentors.map((m: any) => m.name || m.fullName).filter(Boolean).join(", ") ||
    event?.mentorName || details?.mentorName || "";

  const availableSeats = event?.availableSeats ?? (maxSeats - enrolledCount);
  const primaryCTA = event?.primaryCTA || details?.primaryCTA || (
    status === "Open" && availableSeats > 0 ? "Reserve Seat" : "Request Callback"
  );
  const secondaryCTA = event?.secondaryCTA ?? details?.secondaryCTA ?? (
    primaryCTA === "Reserve Seat" ? "Request Callback" : null
  );

  const venue = details?.venue || event?.venue
    ? {
        name: details?.venue?.name || event?.venue?.name || mode,
        address: details?.venue?.description || details?.venue?.address || event?.venue?.address || "",
        city: details?.venue?.city || event?.venue?.city || "",
        state: details?.venue?.state || event?.venue?.state || "",
        zipCode: details?.venue?.zipCode || event?.venue?.zipCode,
        googleMapsLink: details?.venue?.googleMapsLink || event?.venue?.googleMapsLink,
      }
    : undefined;

  return {
    success: response?.success ?? true,
    message: response?.message ?? "",
    data: {
      event: {
        _id: event?._id || event?.id || details?._id || "",
        title,
        slug: event?.slug || details?.slug || "",
        description: event?.description || details?.overview?.aboutEvent || details?.description || "",
        type,
        category: event?.category || event?.domain || details?.category || "Web Development",
        level: "Beginner" as const,
        duration: getEventDuration(startDate || new Date().toISOString(), endDate || new Date().toISOString(), event?.durationDays),
        price,
        originalPrice,
        mode,
        venue,
        zoomLink: undefined,
        startDate,
        endDate,
        maxSeats,
        enrolledCount,
        availableSeats,
        status,
        rating,
        tools,
        mentorName,
        thumbnail: event?.banner || event?.thumbnail || details?.banner || "",
        primaryCTA,
        secondaryCTA,
        isFeatured: Boolean(event?.isFeatured || event?.is_featured || details?.isFeatured),
        mentors,
        createdAt: event?.createdAt || new Date().toISOString(),
        updatedAt: event?.updatedAt || new Date().toISOString(),
      },
      overview: {
        aboutEvent: details?.overview?.aboutEvent || event?.description || details?.description || "",
        whatYouWillLearn: details?.overview?.whatYouWillLearn && Array.isArray(details.overview.whatYouWillLearn)
          ? details.overview.whatYouWillLearn.map((item: any, index: number) => ({
              text: typeof item === "string" ? item : item.text,
              _id: `learn-${index}`,
            }))
          : tools.map((tool: string, index: number) => ({
              text: `Build practical skills with ${tool}`,
              _id: `learn-${index}`,
            })),
        prerequisites: details?.overview?.prerequisites && Array.isArray(details.overview.prerequisites)
          ? details.overview.prerequisites.map((item: any, index: number) => ({
              text: typeof item === "string" ? item : item.text,
              _id: `prerequisite-${index}`,
            }))
          : [
              { text: "Basic programming knowledge", _id: "prereq-1" },
              { text: "A laptop with the required software installed", _id: "prereq-2" },
            ],
        whatsIncluded: details?.overview?.whatsIncluded && Array.isArray(details.overview.whatsIncluded)
          ? details.overview.whatsIncluded.map((item: any, index: number) => ({
              text: typeof item === "string" ? item : item.text || "Key module feature",
              icon: "Check",
              _id: `included-${index}`,
            }))
          : [
              { text: "Focused practical learning", icon: "Check", _id: "inc-1" },
              { text: "Hands-on practice sessions", icon: "Check", _id: "inc-2" },
              { text: "Certificate of participation", icon: "Check", _id: "inc-3" },
            ],
      },
      agenda: details?.agenda || [],
      mentorDetails: mentors.map((m: any, index: number) => ({
        name: m.name || m.fullName || "GrowthCraft Mentor",
        avatar: m.avatar || "",
        bio: m.bio || "Industry expert with extensive experience in training and mentorship.",
        designation: m.designation || "Event Mentor",
        rating: m.rating || rating || 5,
        studentsCount: m.studentsCount || enrolledCount || 0,
        expertise: m.expertise || tools || [],
      })),
      faqs: details?.faqs || [],
    },
    meta: response?.meta,
  };
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { isOpen, formType, formTitle, courseId, courseTitle, price, openForm, closeForm } =
    usePopupForm();
  const { data: user } = useCurrentUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { slug } = use(params);
  const normalizedSlug = useMemo(() => slug?.replace(/_/g, "-") || "", [slug]);
  
  // 1. Fetch from unified event detail endpoint
  const { data: unifiedEventData } = useEventBySlug(normalizedSlug);

  // 2. Mock fallback for determining type or rendering mock details
  const mockEventData = useMemo(() => getEventDetailBySlug(normalizedSlug) || getEventDetailBySlug(slug), [normalizedSlug, slug]);
  const eventType = (unifiedEventData as any)?.data?.type || (unifiedEventData as any)?.data?.event?.type || (unifiedEventData as any)?.event?.type || mockEventData?.data?.event?.type;
  
  // 3. Fetch from specific type endpoints if needed
  const { data: workshopDetailData } = useWorkshopDetails(
    normalizedSlug, 
    isMounted && (eventType === "Workshop" || !eventType)
  );
  const { data: hackathonDetailData } = useHackathonDetails(
    normalizedSlug, 
    isMounted && (eventType === "Hackathon" || !eventType)
  );
  const { data: bootcampDetailData } = useBootcampBySlug(normalizedSlug);

  const eventData = useMemo(
    () => {
      // Prioritize API data over mock data
      if (unifiedEventData && (unifiedEventData as any).data) return mapEventDetailToEventData(unifiedEventData as any);
      if (workshopDetailData) return mapEventDetailToEventData(workshopDetailData);
      if (hackathonDetailData) return mapEventDetailToEventData(hackathonDetailData);
      if (bootcampDetailData) {
        const bootcampObj = (bootcampDetailData as any).data || bootcampDetailData;
        if (bootcampObj && bootcampObj.title) {
          return mapEventDetailToEventData({
            success: true,
            message: "Bootcamp fetched",
            data: { event: bootcampObj, eventDetails: bootcampObj }
          } as any);
        }
      }
      return mapEventDetailToEventData(mockEventData);
    },
    [normalizedSlug, unifiedEventData, workshopDetailData, hackathonDetailData, bootcampDetailData, mockEventData]
  );
  const event = eventData?.data?.event;
  const overview = eventData?.data?.overview;
  const agenda = eventData?.data?.agenda || [];
  const mentorDetails = eventData?.data?.mentorDetails;
  const faqs = eventData?.data?.faqs || [];

  // Not found
  if (!event) {
    notFound();
  }

  const showMentorSection = event.type === "Bootcamp" || event.type === "Hackathon";
  const isWorkshopEvent = event.type === "Workshop";
  const isBootcampEvent = event.type === "Bootcamp";
  const isHackathonEvent = event.type === "Hackathon";

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  // Check if user is logged in and verified
  const isAuthenticated = isMounted && Boolean(user && user.isEmailVerified);
  const isStudent = isMounted && user?.role === "student";
  const isRestrictedRole = isMounted && (user?.role === "mentor" || user?.role === "employer");

  // Use backend-provided CTAs
  const primaryCTA = event.primaryCTA || "Register Now";
  const secondaryCTA = event.secondaryCTA;
  const displayRating = useMemo(() => event.rating.toFixed(1), [event.rating]);

  // Determine CTA behavior
  const isPrimaryCallback = primaryCTA.toLowerCase().includes("callback");
  const isPrimaryRegisterInterest =
    primaryCTA.toLowerCase().includes("interest");
  const eventStatus = event.status as string;
  const isFinalizedStatus = eventStatus === "Closed" || eventStatus === "Completed";

  const openWorkshopForm = (formType: "callback" | "register-interest" | "reserve-seat") => {
    const label =
      formType === "callback"
        ? secondaryCTA || primaryCTA || "Request Callback"
        : primaryCTA;

    openForm(
      formType,
      `${label} - ${event.title}`,
      event._id,
      event.title,
      "workshop",
      event.price || 0
    );
  };

  const openEventActionForm = (formType: "callback" | "register-interest" | "reserve-seat") => {
    if (isWorkshopEvent) {
      openWorkshopForm(formType);
      return;
    }

    if (isBootcampEvent) {
      const label =
        formType === "callback"
          ? secondaryCTA || primaryCTA || "Request Callback"
          : primaryCTA;

      openForm(
        formType,
        `${label} - ${event.title}`,
        event._id,
        event.title,
        "bootcamp",
        event.price || 0
      );
      return;
    }

    if (isHackathonEvent) {
      const label =
        formType === "callback"
          ? secondaryCTA || primaryCTA || "Request Callback"
          : primaryCTA;

      openForm(
        formType,
        `${label} - ${event.title}`,
        event._id,
        event.title,
        "hackathon",
        event.price || 0
      );
    }
  };

  // Handle primary CTA click
  const handlePrimaryCTAClick = () => {
    if (isRestrictedRole) {
      toast.error("Students Only");
      return;
    }
    // For "Request Callback" - no login required
    if (isPrimaryCallback) {
      if (isWorkshopEvent || isBootcampEvent || isHackathonEvent) {
        openEventActionForm("callback");
        return;
      }

      if (!isAuthenticated) {
        openForm("callback", `${primaryCTA} - ${event.title}`, event._id, event.title);
        return;
      }

      toast.success("Callback request submitted! We'll contact you soon.");
      return;
    }

    // For "Register Interest" - no login required
    if (isPrimaryRegisterInterest) {
      if (isWorkshopEvent || isBootcampEvent || isHackathonEvent) {
        openEventActionForm("register-interest");
        return;
      }

      if (!isAuthenticated) {
        openForm("register-interest", `${primaryCTA} - ${event.title}`, event._id, event.title);
        return;
      }

      // Logged in - show success message
      toast.success("Interest registered successfully! We'll contact you soon.");
      return;
    }

    // For "Register Now" - require login
    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        const currentUrl = window.location.pathname;
        toast.info("Please register to join this event");
        window.location.href = `/register/student?callbackUrl=${encodeURIComponent(
          currentUrl
        )}`;
      }
      return;
    }

    if (!isStudent) {
      toast.error("Please login as a student to register");
      return;
    }

    if (isWorkshopEvent || isBootcampEvent || isHackathonEvent) {
      openEventActionForm("reserve-seat");
      return;
    }

    toast.success("Registration successful! Check your email for details.");
  };

  // Handle secondary CTA click
  const handleSecondaryCTAClick = () => {
    if (isRestrictedRole) {
      toast.error("Students Only");
      return;
    }
    if (isWorkshopEvent || isBootcampEvent || isHackathonEvent) {
      openEventActionForm("callback");
      return;
    }

    if (!isAuthenticated) {
      if (secondaryCTA) {
        openForm(
          "callback",
          `${secondaryCTA} - ${event.title}`,
          event._id,
          event.title,
          isWorkshopEvent ? "workshop" : isHackathonEvent ? "hackathon" : "course"
        );
      }
      return;
    }

    toast.success("Callback request submitted! We'll contact you soon.");
  };

  // Button states - disable registration buttons if seats are full or completed
  // "Request Callback" buttons should always be enabled
  const seatsRemaining = event.maxSeats - event.enrolledCount;
  const isSeatsFull = seatsRemaining <= 0;
  const isRegistrationAction = 
    primaryCTA.toLowerCase().includes("register") || 
    primaryCTA.toLowerCase().includes("reserve") || 
    primaryCTA.toLowerCase().includes("enroll");
  const isPrimaryButtonDisabled = 
    isFinalizedStatus || 
    (isAuthenticated && isRestrictedRole) ||
    (isRegistrationAction && isAuthenticated && !isStudent) ||
    (isRegistrationAction && (isSeatsFull || event.status === "Completed"));
  const isSecondaryButtonDisabled = isAuthenticated && isRestrictedRole;
  const primaryButtonLabel = isFinalizedStatus 
    ? eventStatus 
    : (isAuthenticated && isRestrictedRole)
    ? "Students Only"
    : (isRegistrationAction && isAuthenticated && !isStudent)
    ? "Students Only"
    : primaryCTA;
  const primaryButtonClasses = isFinalizedStatus || isPrimaryCallback
    ? ""
    : "bg-magenta text-white hover:bg-magenta/90 disabled:bg-magenta disabled:text-white disabled:opacity-50";

  const secondaryButtonLabel = (isAuthenticated && isRestrictedRole)
    ? "Students Only"
    : secondaryCTA || "Request Callback";

  return (
    <>
      <PopupForm
        isOpen={isOpen}
        onClose={closeForm}
        type={formType}
        title={formTitle}
        courseId={courseId}
        courseTitle={courseTitle}
        itemType={isWorkshopEvent ? "workshop" : isBootcampEvent ? "bootcamp" : isHackathonEvent ? "hackathon" : "course"}
        price={price}
      />

      <Section variant="white" className="overflow-hidden">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-magenta mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </Link>

        <div className="grid lg:grid-cols-12 gap-8 overflow-hidden">
          {/* Main content */}
          <div className="lg:col-span-8 space-y-8 min-w-0">
            {/* Banner */}
            <div className="aspect-video bg-graphite rounded-xl flex items-center justify-center overflow-hidden">
              <div className="text-center text-white/50">
                <PlayCircle className="h-16 w-16 mx-auto mb-2" />
                <p className="text-sm">Event Preview</p>
              </div>
            </div>

            {/* Title area */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {((event as any).isFeatured || (event as any).is_featured) && (
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-400/30 flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5" /> Trending Now
                  </span>
                )}
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-magenta/10 text-magenta">
                  {event.type}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-lavender/10 text-lavender">
                  {event.level}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-graphite/10 text-graphite">
                  {event.duration}h
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    event.mode === "Online"
                      ? "bg-blue-500/10 text-blue-500"
                      : event.mode === "Offline"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-purple-500/10 text-purple-500"
                  }`}
                >
                  {event.mode}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 break-words">
                {event.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {(event as any).mentors && (event as any).mentors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2 overflow-hidden">
                      {(event as any).mentors.map((mentor: any, index: number) => (
                        <Avatar key={index} className="h-8 w-8 border-2 border-background">
                          <AvatarImage src={mentor.avatar} alt={mentor.name} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {(mentor.name || mentor.fullName || "M").charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="font-medium text-foreground">
                      {(event as any).mentors.map((m: any) => m.name || m.fullName).filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
                <span className="flex items-center gap-1 font-medium" suppressHydrationWarning>
                  <Star className="h-4 w-4 text-warning fill-warning" />
                  {event.rating && event.rating > 0 ? event.rating.toFixed(1) : "New"}
                </span>
                <span className="font-medium">
                  {(event.enrolledCount || 0).toLocaleString()} / {(event.maxSeats || 50).toLocaleString()} registered
                </span>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start bg-muted overflow-x-auto">
                <TabsTrigger value="overview" className="flex-shrink-0">Overview</TabsTrigger>
                <TabsTrigger value="agenda" className="flex-shrink-0">Agenda</TabsTrigger>
                <TabsTrigger value="venue" className="flex-shrink-0">Venue</TabsTrigger>
                {showMentorSection && <TabsTrigger value="mentor" className="flex-shrink-0">Mentor</TabsTrigger>}
                <TabsTrigger value="faq" className="flex-shrink-0">FAQ</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8 pt-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">About this event</h2>
                  <p className="text-muted-foreground">
                    {overview?.aboutEvent || event.description}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">What you&apos;ll learn</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {overview?.whatYouWillLearn?.map((item: any) => (
                      <div key={item._id} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-magenta mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">Tools & Technologies</h2>
                  <div className="flex flex-wrap gap-2">
                    {event.tools.map((tool: any, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-lavender/10 text-lavender"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">Prerequisites</h2>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {overview?.prerequisites?.map((item: any) => (
                      <li key={item._id} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-lavender mt-0.5" />
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="agenda" className="pt-6">
                <h2 className="text-xl font-bold mb-4">Event Agenda</h2>
                <div className="space-y-3">
                  {agenda.map((session: any) => (
                    <DataCard key={session._id}>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-magenta/10 flex items-center justify-center">
                          <span className="text-lg font-bold text-magenta">
                            {session.sessionNumber}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{session.title}</h3>
                          <p className="text-xs text-muted-foreground mb-2">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {session.duration}
                          </p>
                          <ul className="space-y-1">
                            {session.topics.map((topic: { _id: string; text: string }) => (
                              <li
                                key={topic._id}
                                className="flex items-start gap-2 text-sm"
                              >
                                <Check className="h-3 w-3 text-magenta mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{topic.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </DataCard>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="venue" className="pt-6">
                <h2 className="text-xl font-bold mb-4">Venue</h2>
                <DataCard>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold">Venue Details</h3>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-muted text-foreground">
                        {event.mode}
                      </span>
                    </div>

                    {event.mode === "Online" ? (
                      <div className="space-y-2">
                        <h4 className="font-medium">Online — Zoom</h4>
                        <p className="text-sm text-muted-foreground">
                          Online event. Meeting link will be shared after registration.
                        </p>
                      </div>
                    ) : event.venue ? (
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-magenta flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="font-medium">{event.venue.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {event.venue.address}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {event.venue.city}, {event.venue.state}{" "}
                              {event.venue.zipCode && `- ${event.venue.zipCode}`}
                            </p>
                          </div>
                        </div>
                        {event.venue.googleMapsLink && (
                          <a
                            href={event.venue.googleMapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-magenta hover:underline"
                          >
                            <MapPin className="h-4 w-4" />
                            View on Google Maps
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Venue TBA</p>
                        <p className="text-sm text-muted-foreground">
                          Venue details will be announced soon.
                        </p>
                      </div>
                    )}
                  </div>
                </DataCard>

                {/* Date & Time */}
                <DataCard className="mt-4">
                  <h3 className="font-semibold mb-3">Date & Time</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-magenta" />
                      <span>
                        {safeFormatDate(event.startDate, "MMMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-magenta" />
                      <span>
                        {safeFormatDate(event.startDate, "h:mm a")} -{" "}
                        {safeFormatDate(event.endDate, "h:mm a")}
                      </span>
                    </div>
                  </div>
                </DataCard>
              </TabsContent>

              {showMentorSection && (
                <TabsContent value="mentor" className="pt-6">
                  <h2 className="text-xl font-bold mb-4">Meet Your Mentors</h2>
                  <div className="space-y-4">
                    {mentorDetails && Array.isArray(mentorDetails) && mentorDetails.length > 0 ? (
                      mentorDetails.map((mentor: any, index: number) => {
                        const mentorName = mentor.name || mentor.fullName || "Event Mentor";
                        const designation = mentor.designation || mentor.areaOfExpertise || "Industry Mentor";
                        const company = mentor.company || mentor.currentOrganization;
                        const expertiseList = Array.isArray(mentor.expertise)
                          ? mentor.expertise
                          : typeof mentor.areaOfExpertise === "string"
                          ? [mentor.areaOfExpertise]
                          : [];

                        return (
                          <DataCard key={index}>
                            <div className="flex items-start gap-4">
                              <Avatar className="h-16 w-16 border flex-shrink-0">
                                <AvatarImage src={mentor.avatar} alt={mentorName} />
                                <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                                  {mentorName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold">{mentorName}</h3>
                                <p className="text-sm font-medium text-magenta mb-1">
                                  {designation} {company ? `at ${company}` : ""}
                                </p>
                                {mentor.bio && (
                                  <p className="text-sm text-muted-foreground mb-3">
                                    {mentor.bio}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
                                  {mentor.rating != null && (
                                    <span className="flex items-center gap-1">
                                      <Star className="h-3 w-3 text-warning fill-warning" />
                                      {Number(mentor.rating).toFixed(1)} rating
                                    </span>
                                  )}
                                  {mentor.studentsCount != null && (
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {Number(mentor.studentsCount).toLocaleString()} students mentored
                                    </span>
                                  )}
                                </div>
                                {expertiseList.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {expertiseList.map((exp: string, idx: number) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-1 rounded text-xs bg-muted font-medium text-muted-foreground"
                                      >
                                        {exp}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </DataCard>
                        );
                      })
                    ) : (
                      <DataCard>
                        <div className="text-center py-8 text-muted-foreground">
                          <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No mentors assigned yet for this event.</p>
                        </div>
                      </DataCard>
                    )}
                  </div>
                </TabsContent>
              )}

              <TabsContent value="faq" className="pt-6">
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs.map((item: any) => (
                    <AccordionItem
                      key={item._id}
                      value={`faq-${item._id}`}
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="text-sm font-semibold">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sticky sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <DataCard>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-magenta">
                    ₹{event.price.toLocaleString()}
                  </span>
                  {event.originalPrice && event.originalPrice > event.price && (
                    <span className="text-base text-muted-foreground line-through ml-2">
                      ₹{event.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Primary CTA */}
                <Button
                  className={`${primaryButtonClasses} mb-3`}
                  size="lg"
                  variant={isFinalizedStatus || isPrimaryCallback ? "outline" : "default"}
                  onClick={handlePrimaryCTAClick}
                  disabled={isPrimaryButtonDisabled}
                >
                  {primaryButtonLabel}
                </Button>

                {/* Secondary CTA */}
                {secondaryCTA && (
                  <Button
                    variant="outline"
                    onClick={handleSecondaryCTAClick}
                    disabled={isSecondaryButtonDisabled}
                  >
                    {secondaryButtonLabel}
                  </Button>
                )}

                <div className="mt-6 space-y-3 text-sm">
                  <h4 className="font-semibold">What&apos;s included</h4>
                  {overview?.whatsIncluded?.map((item: any) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <Check className="h-4 w-4 text-magenta flex-shrink-0" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </DataCard>

              {/* Share */}
              <div className="flex items-center gap-2 justify-center">
                <span className="text-xs text-muted-foreground">Share:</span>
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      const shareUrl = `https://wa.me/?text=${encodeURIComponent(
                        event.title + " " + window.location.href
                      )}`;
                      window.open(shareUrl, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Share2 className="h-4 w-4 text-lavender" />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Copy className="h-4 w-4 text-lavender" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section variant="graphite">
        <div className="text-center py-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Don&apos;t miss this event!
          </h2>
          <p className="text-white/60 mb-6">
            {event.maxSeats - event.enrolledCount} seats remaining
          </p>
          <div className="flex justify-center">
            <Button
              className={primaryButtonClasses}
              size="lg"
              variant={isFinalizedStatus || isPrimaryCallback ? "outline" : "default"}
              onClick={handlePrimaryCTAClick}
              disabled={isPrimaryButtonDisabled}
            >
              {primaryButtonLabel}{" "}
              {!isPrimaryButtonDisabled && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
