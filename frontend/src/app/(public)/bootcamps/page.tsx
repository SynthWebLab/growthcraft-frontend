"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, ArrowRight, MapPin, Loader2 } from "lucide-react";
import { PopupForm, usePopupForm } from "@/components/common/PopupForm";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { useBootcamps } from "@/hooks/queries/useBootcamps";
import {
  BOOTCAMP_FILTER_STATUSES,
  BOOTCAMP_MODES,
  type BootcampQueryParams,
} from "@/types/bootcamp";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10; // Show 10 bootcamps per page

const formatBootcampDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB");

const BootcampsPage = () => {
  const [selectedMode, setSelectedMode] = useState<(typeof BOOTCAMP_MODES)[number] | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<(typeof BOOTCAMP_FILTER_STATUSES)[number] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { isOpen, formType, formTitle, openForm, closeForm } = usePopupForm();

  const queryParams: BootcampQueryParams = {
    limit: ITEMS_PER_PAGE,
    page: currentPage,
    mode: selectedMode ?? undefined,
    status: selectedStatus ?? undefined,
  };

  // Fetch bootcamps from API
  const { data: bootcampsData, isLoading, error } = useBootcamps(queryParams);

  const bootcamps = bootcampsData?.items || [];
  const pagination = bootcampsData?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const totalItems = pagination?.total ?? 0;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFilterChange = () => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-success/10 text-success";
      case "Closed":
        return "bg-danger/10 text-danger";
      case "Completed":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handlePrimaryCTA = (bootcamp: typeof bootcamps[0]) => {
    switch (bootcamp.primaryCTA) {
      case "Reserve Seat":
        openForm("enrollment", `Reserve seat — ${bootcamp.title}`);
        break;
      case "Request Callback":
        openForm("callback", `Request Callback — ${bootcamp.title}`);
        break;
      default:
        openForm("callback", `Enquire — ${bootcamp.title}`);
    }
  };

  const handleSecondaryCTA = (bootcamp: typeof bootcamps[0]) => {
    openForm("callback", `Request Callback — ${bootcamp.title}`);
  };

  // Loading state
  if (isLoading && !bootcamps.length) {
    return (
      <Section variant="white">
        <PageHeader
          breadcrumb={
            <span>
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>{" "}
              / Bootcamps
            </span>
          }
          title="Live Bootcamps"
          description="Intensive, mentor-led programs designed to make you job-ready in weeks"
        />
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-magenta" />
        </div>
      </Section>
    );
  }

  // Error state
  if (error) {
    return (
      <Section variant="white">
        <PageHeader
          breadcrumb={
            <span>
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>{" "}
              / Bootcamps
            </span>
          }
          title="Live Bootcamps"
          description="Intensive, mentor-led programs designed to make you job-ready in weeks."
        />
        <div className="text-center py-16">
          <p className="text-danger mb-4">Failed to load bootcamps. Please try again.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </Section>
    );
  }

  return (
    <>
      <PopupForm
        isOpen={isOpen}
        onClose={closeForm}
        type={formType}
        title={formTitle}
      />

      <Section variant="white">
        <PageHeader
          breadcrumb={
            <span>
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>{" "}
              / Bootcamps
            </span>
          }
          title="Live Bootcamps"
          description="Intensive, mentor-led programs designed to make you job-ready in weeks."
        />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {BOOTCAMP_MODES.map((m) => (
            <button
              key={m}
              onClick={() => {
                setSelectedMode(selectedMode === m ? null : m);
                handleFilterChange();
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedMode === m
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            >
              {m}
            </button>
          ))}

          <span className="w-px h-6 bg-border mx-1" />

          {BOOTCAMP_FILTER_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSelectedStatus(selectedStatus === s ? null : s);
                handleFilterChange();
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedStatus === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            >
              {s}
            </button>
          ))}

          {(selectedMode || selectedStatus) && (
            <button
              onClick={() => {
                setSelectedMode(null);
                setSelectedStatus(null);
                handleFilterChange();
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
            >
              Clear
            </button>
          )}
        </div>

        {/* Results count */}
        {bootcamps.length > 0 && (
          <div className="text-sm text-muted-foreground ">
            Showing {bootcamps.length} of {totalItems} bootcamp{totalItems !== 1 ? "s" : ""}
            {totalPages > 1 && ` — Page ${currentPage} of ${totalPages}`}
          </div>
        )}
      </Section>

      {/* Bootcamp cards — alternating white/marble */}
      {bootcamps.map((bootcamp, i) => {
        const isPrimaryDisabled = bootcamp.cta.disabled || bootcamp.status === "Completed";

        return (
        <Section key={bootcamp.id} variant={i % 2 === 0 ? "white" : "marble"}>
          <div className="flex flex-col lg:flex-row gap-6 rounded-xl border overflow-hidden bg-card hover:border-primary/30 hover:shadow-lg transition-all">
            {/* Banner */}
            <div className="lg:w-[40%] h-48 lg:h-auto bg-graphite flex items-center justify-center">
              <div className="text-center text-white/40">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p className="text-xs">{bootcamp.mode}</p>
              </div>
            </div>

            {/* Content */}
            <div className="lg:w-[60%] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusColor(
                      bootcamp.status
                    )}`}
                  >
                    {bootcamp.status}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary">
                    {bootcamp.mode}
                  </span>
                </div>

                <h2 className="text-xl font-bold mb-2">{bootcamp.title}</h2>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {bootcamp.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatBootcampDate(bootcamp.startDate)} — {formatBootcampDate(bootcamp.endDate)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  {bootcamp.mentorNames.map((name) => (
                    <img
                      key={name}
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
                      alt={name}
                      className="h-7 w-7 rounded-full border-2 border-background -ml-1 first:ml-0"
                      title={name}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">
                    {bootcamp.mentorNames.length} mentor{bootcamp.mentorNames.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {bootcamp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  {bootcamp.availableSeats > 0 && bootcamp.status === "Open" && (
                    <p className="text-sm font-bold text-primary">
                      {bootcamp.availableSeats} seat{bootcamp.availableSeats !== 1 ? "s" : ""} left of {bootcamp.maxSeats}
                    </p>
                  )}
                  {bootcamp.availableSeats === 0 && bootcamp.status === "Open" && (
                    <p className="text-sm font-bold text-danger">
                      Seats Full
                    </p>
                  )}
                  <p className="text-lg font-extrabold text-foreground">
                    ₹{bootcamp.price.toLocaleString()}
                  </p>
                  {bootcamp.originalPrice && bootcamp.originalPrice > bootcamp.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{bootcamp.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {bootcamp.secondaryCTA && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSecondaryCTA(bootcamp)}
                    >
                      {bootcamp.secondaryCTA}
                    </Button>
                  )}
                  <Button
                    className={
                      isPrimaryDisabled
                        ? "cursor-not-allowed opacity-50"
                        : bootcamp.canRegister
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : ""
                    }
                    variant={bootcamp.canRegister ? "default" : "outline"}
                    disabled={isPrimaryDisabled}
                    onClick={() => {
                      if (!isPrimaryDisabled) {
                        handlePrimaryCTA(bootcamp);
                      }
                    }}
                  >
                    {bootcamp.primaryCTA} {bootcamp.canRegister && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Section>
        );
      })}

      {bootcamps.length === 0 && !isLoading && (
        <Section variant="white">
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">
              No bootcamps match your filters.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedMode(null);
                setSelectedStatus(null);
                handleFilterChange();
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Section>
      )}

      {/* Page-based Pagination */}
      {totalPages > 1 && (
        <Section variant="white" className="pt-8 pb-12 md:pt-10 md:pb-16">
          <Pagination>
            <PaginationContent>
              {hasPreviousPage && (
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePreviousPage();
                    }}
                  />
                </PaginationItem>
              )}

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(i + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {hasNextPage && (
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNextPage();
                    }}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </Section>
      )}

      {/* Final CTA */}
      <Section variant="graphite">
        <div className="text-center py-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Not sure which bootcamp?
          </h2>
          <p className="text-white/60 mb-6">
            Talk to our team and we&apos;ll help you pick the right one.
          </p>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
            onClick={() => openForm("callback", "Book Free Counseling")}
          >
            Book Free Counseling
          </Button>
        </div>
      </Section>
    </>
  );
};

export default BootcampsPage;
