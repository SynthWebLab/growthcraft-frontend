"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, BookOpen, Star, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { DataCard } from "@/components/ui/data-card";
import { Section } from "@/components/ui/section";
import { useCourses, useCourseConfig } from "@/hooks/queries/useCourses";
import { useDebounce } from "@/hooks/useDebounce";
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

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);

  // Debounce search query to avoid too many API calls
  const debouncedSearch = useDebounce(searchQuery, 1000);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedLevel, debouncedSearch, sortBy]);

  // Fetch course configuration
  const { data: configData } = useCourseConfig();
  const categories = configData?.data?.categories || [];
  const levels = configData?.data?.difficultyLevels || [];

  // Map sort options to API parameters
  const getSortParams = (sortValue: string): { sortBy?: "title" | "price" | "rating" | "enrollmentCount" | "createdAt" | "duration"; sortOrder?: "asc" | "desc" } => {
    switch (sortValue) {
      case "newest":
        return { sortBy: "createdAt", sortOrder: "desc" };
      case "price-low":
        return { sortBy: "price", sortOrder: "asc" };
      case "price-high":
        return { sortBy: "price", sortOrder: "desc" };
      case "rating":
        return { sortBy: "rating", sortOrder: "desc" };
      case "popular":
      default:
        // Don't send sort params for default/popular - let backend use its default
        return {};
    }
  };

  const sortParams = getSortParams(sortBy);

  // Fetch courses from API with all filters
  const { data: coursesData, isLoading, error } = useCourses({
    category: selectedCategory || undefined,
    difficultyLevel: selectedLevel || undefined,
    search: debouncedSearch || undefined,
    sortBy: sortParams.sortBy,
    sortOrder: sortParams.sortOrder,
    page,
    limit: 6,
  });

  const rawCourses = coursesData?.data || [];
  const courses = [...rawCourses].sort((a: any, b: any) => {
    const aFeatured = a.isFeatured || a.is_featured ? 1 : 0;
    const bFeatured = b.isFeatured || b.is_featured ? 1 : 0;
    return bFeatured - aFeatured;
  });
  const totalPages = coursesData?.meta?.pagination?.totalPages || 1;
  const totalCourses = coursesData?.meta?.pagination?.total || 0;

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
    setSelectedCategory(null);
    setSelectedLevel(null);
    setSearchQuery("");
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  // Loading state
  if (isLoading) {
    return (
      <Section variant="white">
        <PageHeader
          breadcrumb={
            <span>
              <Link href="/" className="hover:text-magenta transition-colors">
                Home
              </Link>{" "}
              / Courses
            </span>
          }
          title="All Courses"
          description="Master in-demand skills with industry-vetted curriculum taught by engineers who ship."
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
              <Link href="/" className="hover:text-magenta transition-colors">
                Home
              </Link>{" "}
              / Courses
            </span>
          }
          title="All Courses"
          description="Master in-demand skills with industry-vetted curriculum taught by engineers who ship."
        />
        <div className="text-center py-16">
          <p className="text-danger mb-4">Failed to load courses. Please try again.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </Section>
    );
  }

  return (
    <Section variant="white">
      <PageHeader
        breadcrumb={
          <span>
            <Link href="/" className="hover:text-magenta transition-colors">
              Home
            </Link>{" "}
            / Courses
          </span>
        }
        title="All Courses"
        description="Master in-demand skills with industry-vetted curriculum taught by engineers who ship."
      />

      {/* Filter row */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(selectedCategory === cat ? null : cat);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-magenta text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
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

          {(selectedCategory || selectedLevel || searchQuery) && (
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
              placeholder="Search courses..."
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
      {totalCourses > 0 && (
        <div className="text-sm text-muted-foreground mb-4">
          Showing {courses.length} of {totalCourses} courses
        </div>
      )}

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {courses.map((course) => (
          <Link
            href={`/courses/${course.slug}`}
            key={course._id}
            className="group"
          >
            <DataCard className="h-full flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-magenta/10 text-magenta">
                  {course.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getLevelColor(
                    course.difficultyLevel
                  )}`}
                >
                  {course.difficultyLevel}
                </span>
                {(course.isFeatured || (course as any).is_featured) && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    🔥 Trending Now
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-foreground group-hover:text-magenta transition-colors mb-2 line-clamp-2">
                {course.title}
              </h3>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                {course.description}
              </p>

              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {course.duration}h
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {course.lessonsCount} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-warning" />
                  {course.rating}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <img
                  src={course.instructor?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(course.instructorName || 'Instructor')}`}
                  alt={course.instructorName}
                  className="h-6 w-6 rounded-full"
                />
                <span className="text-xs text-muted-foreground">
                  {course.instructorName}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <span className="text-lg font-extrabold text-magenta">
                    ₹{course.price.toLocaleString()}
                  </span>
                  {course.originalPrice && course.originalPrice > course.price && (
                    <span className="text-xs text-muted-foreground line-through ml-2">
                      ₹{course.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <span className="text-xs text-magenta font-medium group-hover:underline">
                  View Curriculum →
                </span>
              </div>
            </DataCard>
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {!isLoading && courses.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">
            No courses match your filters.
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
