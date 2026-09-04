"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Clock, Search, Briefcase, Loader2, Flame, Calendar } from "lucide-react";
import { formatDisplayDate } from "@/lib/dateUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { DataCard } from "@/components/ui/data-card";
import { Section } from "@/components/ui/section";
import { getPrimaryCta } from "@/lib/ctaPolicy";
import { PartnerLogo } from "@/components/common/PartnerLogo";
import {
  useTrainingPrograms,
  useTrainingProgramConfig,
} from "@/hooks/queries/useTrainingPrograms";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TrainingProgramsPage() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // Debounce search query input to avoid duplicate network calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedDomain, selectedLevel, debouncedSearchQuery, sortBy]);

  // Fetch unique domains and levels from API config
  const { data: configResponse } = useTrainingProgramConfig();
  const domains = useMemo(() => configResponse?.data?.domains || [], [configResponse]);
  const levels = useMemo(() => configResponse?.data?.levels || ["Beginner", "Intermediate", "Advanced"], [configResponse]);

  // Map client sort settings to backend sortBy/sortOrder parameters
  const sortByParam = useMemo(() => {
    switch (sortBy) {
      case "newest":
        return "createdAt";
      case "price-low":
      case "price-high":
        return "price";
      case "rating":
        return "rating";
      case "popular":
      default:
        return "enrollmentCount";
    }
  }, [sortBy]);

  const sortOrderParam = useMemo(() => {
    return sortBy === "price-low" ? "asc" : "desc";
  }, [sortBy]);

  // Query training programs from API
  const { data: apiResponse, isLoading, error } = useTrainingPrograms({
    domain: selectedDomain || undefined,
    level: selectedLevel || undefined,
    search: debouncedSearchQuery.trim() || undefined,
    sortBy: sortByParam as any,
    sortOrder: sortOrderParam,
    page,
    limit: itemsPerPage,
  });

  const rawPrograms = apiResponse?.data || [];
  const programs = [...rawPrograms].sort((a: any, b: any) => {
    const aFeatured = a.isFeatured || a.is_featured ? 1 : 0;
    const bFeatured = b.isFeatured || b.is_featured ? 1 : 0;
    if (bFeatured !== aFeatured) {
      return bFeatured - aFeatured;
    }
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return bTime - aTime;
  });
  const totalPrograms = apiResponse?.meta?.pagination?.total || 0;
  const totalPages = apiResponse?.meta?.pagination?.totalPages || 0;

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-success/10 text-success";
      case "Intermediate":
        return "bg-warning/10 text-warning";
      case "Advanced":
        return "bg-danger/10 text-danger";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleClearFilters = () => {
    setSelectedDomain(null);
    setSelectedLevel(null);
    setSearchQuery("");
    setDebouncedSearchQuery("");
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  return (
    <Section variant="white">
      <PageHeader
        breadcrumb={
          <span>
            <Link href="/" className="hover:text-magenta transition-colors">
              Home
            </Link>{" "}
            / Training Programs
          </span>
        }
        title="Training Programs"
        description="Internship programs ranging from 30 to 60 days with hands-on projects, mentorship, and industry-recognized certification."
      />

      {/* Filter row */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          {domains.map((domain) => (
            <button
              key={domain}
              onClick={() => {
                setSelectedDomain(selectedDomain === domain ? null : domain);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedDomain === domain
                  ? "bg-magenta text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {domain}
            </button>
          ))}

          <span className="w-px h-6 bg-border mx-1 hidden sm:block" />

          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setSelectedLevel(selectedLevel === lvl ? null : lvl);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedLevel === lvl
                  ? "bg-magenta text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {lvl}
            </button>
          ))}

          {(selectedDomain || selectedLevel || searchQuery) && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-danger/10 text-danger hover:bg-danger/20 transition-all"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search training programs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
          </div>

          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low → High</SelectItem>
              <SelectItem value="price-high">Price: High → Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-magenta mb-4" />
          <p className="text-muted-foreground text-sm">Loading training programs...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-danger mb-4">
            Failed to load training programs. Please check if the backend is running.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          {/* Results count */}
          {totalPrograms > 0 && (
            <div className="text-sm text-muted-foreground mb-4">
              Showing {programs.length} of {totalPrograms} programs
            </div>
          )}

          {/* Training Programs grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {programs.map((program) => {
              const ctaConfig = getPrimaryCta({
                type: "course",
                status: program.status.toLowerCase() as "active" | "coming-soon" | "draft",
              });

              return (
                <Link
                  href={`/training-programs/${program.slug}`}
                  key={program._id}
                  className="group"
                >
                  <DataCard className="h-full flex flex-col">
                    {/* Header with domain, level and trending badge */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {(program.isFeatured || program.is_featured) && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-400/30 flex items-center gap-1">
                          <Flame className="h-3 w-3" /> Trending
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-magenta/10 text-magenta">
                        {program.domain}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getLevelColor(
                          program.level
                        )}`}
                      >
                        {program.level}
                      </span>
                    </div>

                    {/* Assigned Mentors (if any) */}
                    {program.mentors && program.mentors.length > 0 && (
                      <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                        <div className="flex -space-x-1.5 overflow-hidden">
                          {program.mentors.slice(0, 3).map((m: any, idx: number) => (
                            <Avatar key={idx} className="inline-block h-5 w-5 rounded-full ring-1 ring-background">
                              <AvatarImage src={m.avatar || undefined} />
                              <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                                {(m.name || m.fullName || "M").charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <span className="truncate font-medium text-foreground/80">
                          {program.mentors.map((m: any) => m.name || m.fullName).filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}

                    {/* Program Title */}
                    <h3 className="text-lg font-bold text-foreground group-hover:text-magenta transition-colors mb-1 line-clamp-1">
                      {program.programName || program.title}
                    </h3>

                    {/* Full Title (Displayed distinctly) */}
                    {program.fullTitle && (
                      <p className="text-xs font-medium text-primary/80 dark:text-lavender mb-2 line-clamp-1">
                        {program.fullTitle}
                      </p>
                    )}

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {program.description}
                    </p>

                    {/* Duration Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                        <Clock className="h-3 w-3" />
                        {program.duration} Days
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-success/10 text-success">
                        <Briefcase className="h-3 w-3" />
                        Internship
                      </span>
                      {program.internshipPartners && program.internshipPartners.length > 0 && (
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          <PartnerLogo companyName={program.internshipPartners[0]?.companyName} size="sm" className="h-3.5 w-3.5 rounded-xs" />
                          <span>{program.internshipPartners.map((p: any) => p.companyName).join(", ")}</span>
                        </div>
                      )}
                    </div>

                    {/* Prerequisites */}
                    {program.prerequisites && program.prerequisites.length > 0 && (
                      <div className="text-[11px] text-muted-foreground/90 line-clamp-1 mb-2.5 flex items-center gap-1">
                        <span className="font-semibold text-foreground/80">Prerequisites:</span>
                        <span className="truncate">{Array.isArray(program.prerequisites) ? program.prerequisites.join("; ") : program.prerequisites}</span>
                      </div>
                    )}

                    {/* Tools chips (max 4) */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {program.tools.slice(0, 4).map((tool, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground"
                        >
                          {tool}
                        </span>
                      ))}
                      {program.tools.length > 4 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                          +{program.tools.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Start & End Date */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <Calendar className="h-3 w-3 text-magenta flex-shrink-0" />
                      <span><strong className="font-semibold text-foreground">{formatDisplayDate(program.startDate, program.endDate, program.isDateTBA, program.durationDays || program.duration)}</strong></span>
                    </div>

                    {/* Footer with price and CTA */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div>
                        <span className="text-lg font-extrabold text-magenta">
                          ₹{program.price.toLocaleString()}
                        </span>
                        {program.originalPrice && program.originalPrice > program.price && (
                          <span className="text-xs text-muted-foreground line-through ml-2">
                            ₹{program.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-magenta font-medium group-hover:underline">
                        {ctaConfig.primary.label} →
                      </span>
                    </div>
                  </DataCard>
                </Link>
              );
            })}
          </div>

          {/* Empty state */}
          {programs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">
                No training programs match your filters.
              </p>
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                {page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(page - 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  </PaginationItem>
                )}

                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={page === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(i + 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {page < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(page + 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </Section>
  );
}
