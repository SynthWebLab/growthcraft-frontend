"use client";

import { use, useMemo, useSyncExternalStore } from "react";
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
} from "lucide-react";
import { PopupForm, usePopupForm } from "@/components/common/PopupForm";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useWorkshopDetails } from "@/hooks/queries/useWorkshops";
import { toast } from "sonner";
import { format } from "date-fns";
import { getEventDetailBySlug } from "@/data/events-detail.mock";
import type { WorkshopDetailResponse } from "@/types/workshop";

const subscribeToClientSnapshot = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function getWorkshopDurationHours(startDate: string, endDate: string) {
  const durationMs = new Date(endDate).getTime() - new Date(startDate).getTime();
  return Math.max(1, Math.round(durationMs / (1000 * 60 * 60)));
}

function mapWorkshopDetailToEventData(response: WorkshopDetailResponse) {
  const details = response.data.eventDetails;
  const workshop = details.eventId;
  const primaryCTA = workshop.status === "Open" && workshop.availableSeats > 0
    ? "Reserve Seat"
    : "Request Callback";

  return {
    success: response.success,
    message: response.message,
    data: {
      event: {
        _id: workshop._id,
        title: workshop.title,
        slug: workshop.slug,
        description: workshop.description,
        type: "Workshop" as const,
        category: workshop.category,
        level: "Beginner" as const,
        duration: getWorkshopDurationHours(workshop.startDate, workshop.endDate),
        price: workshop.price,
        originalPrice: workshop.originalPrice,
        mode: workshop.mode,
        venue: undefined,
        zoomLink: undefined,
        startDate: workshop.startDate,
        endDate: workshop.endDate,
        maxSeats: workshop.maxSeats,
        enrolledCount: workshop.enrolledCount,
        status: workshop.status,
        rating: workshop.rating,
        tools: workshop.skillsCovered,
        mentorName: workshop.mentorNames.join(", "),
        thumbnail: workshop.banner,
        primaryCTA,
        secondaryCTA: primaryCTA === "Reserve Seat" ? "Request Callback" : null,
        createdAt: workshop.createdAt,
        updatedAt: workshop.updatedAt,
      },
      overview: {
        aboutEvent: details.overview.aboutEvent,
        whatYouWillLearn: details.overview.whatYouWillLearn.map((item, index) => ({
          ...item,
          _id: `learn-${index}`,
        })),
        prerequisites: details.overview.prerequisites.map((item, index) => ({
          ...item,
          _id: `prerequisite-${index}`,
        })),
        whatsIncluded: details.overview.whatsIncluded.map((item, index) => ({
          ...item,
          icon: "Check",
          _id: `included-${index}`,
        })),
      },
      agenda: details.agenda.map((session, index) => ({
        sessionNumber: session.step,
        title: session.title,
        topics: session.topics.map((topic, topicIndex) => ({
          text: topic,
          _id: `agenda-${index}-topic-${topicIndex}`,
        })),
        duration: Number.parseInt(session.duration, 10) || 0,
        _id: `agenda-${index}`,
      })),
      mentorDetails: {
        name: details.mentors[0]?.name || workshop.mentorNames[0] || "GrowthCraft Mentor",
        avatar: details.mentors[0]?.avatar || "",
        bio: details.mentors[0]?.bio || "Industry expert with extensive experience in training and mentorship.",
        rating: details.mentors[0]?.rating || workshop.rating,
        studentsCount: details.mentors[0]?.studentsCount || workshop.enrolledCount,
        expertise: details.mentors[0]?.expertise || workshop.skillsCovered,
      },
      faqs: details.faqs.map((faq, index) => ({
        ...faq,
        _id: `faq-${index}`,
      })),
    },
    meta: response.meta,
  };
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { isOpen, formType, formTitle, courseId, courseTitle, openForm, closeForm } =
    usePopupForm();
  const { data: user } = useCurrentUser();
  const hasMounted = useSyncExternalStore(
    subscribeToClientSnapshot,
    getClientSnapshot,
    getServerSnapshot
  );

  const { slug } = use(params);
  const { data: workshopDetailData } = useWorkshopDetails(slug, hasMounted);

  const eventData = useMemo(
    () => workshopDetailData ? mapWorkshopDetailToEventData(workshopDetailData) : getEventDetailBySlug(slug),
    [slug, workshopDetailData]
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

  const showMentorSection = event.type === "Bootcamp";
  const isWorkshopEvent = event.type === "Workshop";

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  // Check if user is logged in and verified
  const isAuthenticated = user && user.isEmailVerified;
  const isStudent = user?.role === "student";

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
      "workshop"
    );
  };

  // Handle primary CTA click
  const handlePrimaryCTAClick = () => {
    // For "Request Callback" - no login required
    if (isPrimaryCallback) {
      if (isWorkshopEvent) {
        openWorkshopForm("callback");
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
      if (isWorkshopEvent) {
        openWorkshopForm("register-interest");
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

    if (isWorkshopEvent) {
      openWorkshopForm("reserve-seat");
      return;
    }

    toast.success("Registration successful! Check your email for details.");
  };

  // Handle secondary CTA click
  const handleSecondaryCTAClick = () => {
    if (isWorkshopEvent) {
      openWorkshopForm("callback");
      return;
    }

    if (!isAuthenticated) {
      if (secondaryCTA) {
        openForm(
          "callback",
          `${secondaryCTA} - ${event.title}`,
          event._id,
          event.title,
          isWorkshopEvent ? "workshop" : "course"
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
  const isRegistrationAction = primaryCTA.toLowerCase().includes("register") || primaryCTA.toLowerCase().includes("reserve");
  const isPrimaryButtonDisabled = isFinalizedStatus || (isRegistrationAction && (isSeatsFull || event.status === "Completed"));
  const isSecondaryButtonDisabled = false;
  const primaryButtonLabel = isFinalizedStatus ? eventStatus : primaryCTA;
  const primaryButtonClasses = isFinalizedStatus || isPrimaryCallback
    ? ""
    : "bg-magenta text-white hover:bg-magenta/90 disabled:bg-magenta disabled:text-white disabled:opacity-50";

  const secondaryButtonLabel = secondaryCTA || "Request Callback";

  return (
    <>
      <PopupForm
        isOpen={isOpen}
        onClose={closeForm}
        type={formType}
        title={formTitle}
        courseId={courseId}
        courseTitle={courseTitle}
        itemType={isWorkshopEvent ? "workshop" : "course"}
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
              <div className="flex items-center gap-2 mb-3">
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

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-warning" />
                  {displayRating}
                </span>
                <span>
                  {event.enrolledCount} / {event.maxSeats} registered
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
                    {overview?.whatYouWillLearn?.map((item) => (
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
                    {event.tools.map((tool, idx) => (
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
                    {overview?.prerequisites?.map((item) => (
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
                  {agenda.map((session) => (
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
                            {session.duration} min
                          </p>
                          <ul className="space-y-1">
                            {session.topics.map((topic) => (
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
                        {format(new Date(event.startDate), "MMMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-magenta" />
                      <span>
                        {format(new Date(event.startDate), "h:mm a")} -{" "}
                        {format(new Date(event.endDate), "h:mm a")}
                      </span>
                    </div>
                  </div>
                </DataCard>
              </TabsContent>

              {showMentorSection && (
                <TabsContent value="mentor" className="pt-6">
                  <DataCard>
                    <div className="flex items-start gap-4">
                      <img
                        src={mentorDetails?.avatar}
                        alt={mentorDetails?.name}
                        className="h-16 w-16 rounded-full"
                      />
                      <div>
                        <h3 className="text-lg font-bold">
                          {mentorDetails?.name || event.mentorName}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {mentorDetails?.bio ||
                            "Industry expert with extensive experience in training and mentorship."}
                        </p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-warning" />
                            {displayRating} rating
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {mentorDetails?.studentsCount} students
                          </span>
                        </div>
                        {mentorDetails?.expertise && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {mentorDetails.expertise.map((exp, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 rounded text-xs bg-muted"
                              >
                                {exp}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </DataCard>
                </TabsContent>
              )}

              <TabsContent value="faq" className="pt-6">
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs.map((item) => (
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
                  {overview?.whatsIncluded?.map((item) => (
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
