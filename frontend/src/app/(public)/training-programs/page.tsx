"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Clock, Search, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/ui/page-header";
import { DataCard } from "@/components/ui/data-card";
import { Section } from "@/components/ui/section";
import { trainingProgramsMock } from "@/data/training-programs.mock";
import { getPrimaryCta } from "@/lib/ctaPolicy";
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
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedDomain, selectedLevel, searchQuery, sortBy]);

  // Extract unique domains and levels from mock data
  const domains = useMemo(() => {
    const uniqueDomains = [...new Set(trainingProgramsMock.map((p) => p.domain))];
    return uniqueDomains.sort();
  }, []);

  const levels = useMemo(() => {
    const uniqueLevels = [...new Set(trainingProgramsMock.map((p) => p.level))];
    return uniqueLevels.sort();
  }, []);

  // Filter and sort programs
  const filteredPrograms = useMemo(() => {
    let filtered = [...trainingProgramsMock];

    // Apply domain filter
    if (selectedDomain) {
      filtered = filtered.filter((p) => p.domain === selectedDomain);
    }

    // Apply level filter
    if (selectedLevel) {
      filtered = filtered.filter((p) => p.level === selectedLevel);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.domain.toLowerCase().includes(query) ||
          p.tools.some((tool) => tool.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b._id.localeCompare(a._id));
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
      default:
        filtered.sort((a, b) => b.enrollmentCount - a.enrollmentCount);
        break;
    }

    return filtered;
  }, [selectedDomain, selectedLevel, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const programs = filteredPrograms.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPrograms = filteredPrograms.length;

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

      {/* Results count */}
      {totalPrograms > 0 && (
        <div className="text-sm text-muted-foreground mb-4">
          Showing {programs.length} of {totalPrograms} programs
        </div>
      )}

      {/* Training Programs grid - 3 columns on desktop, 1 on mobile */}
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
                {/* Header with domain and level */}
                <div className="flex items-center gap-2 mb-3">
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

                {/* Program Title */}
                <h3 className="text-base font-bold text-foreground group-hover:text-magenta transition-colors mb-2 line-clamp-2">
                  {program.title}
                </h3>

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
                </div>

                {/* Tools chips (max 4) */}
                <div className="flex flex-wrap gap-1.5 mb-4">
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
    </Section>
  );
}
