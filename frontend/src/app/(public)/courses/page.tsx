"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Clock, BookOpen, Star, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { DataCard } from "@/components/ui/data-card";
import { Section } from "@/components/ui/section";
import { coursesMock } from "@/data/courses.mock";
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

const categories = ["MERN", "UI/UX", "DataScience", "DevOps", "Other"] as const;
const levels = ["Beginner", "Intermediate", "Advanced"] as const;
const ITEMS_PER_PAGE = 6;

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = coursesMock.filter((c) => {
      const matchCat = !selectedCategory || c.category === selectedCategory;
      const matchLvl = !selectedLevel || c.level === selectedLevel;
      const matchSearch =
        !searchQuery ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchLvl && matchSearch;
    });

    switch (sortBy) {
      case "newest":
        result = [...result].reverse();
        break;
      case "price-low":
        result = [...result].sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.avgRating - a.avgRating);
        break;
      default:
        result = [...result].sort((a, b) => b.enrollmentCount - a.enrollmentCount);
    }

    return result;
  }, [selectedCategory, selectedLevel, searchQuery, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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
    setPage(1);
  };

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
                setPage(1);
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
                setPage(1);
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
                setPage(1);
              }}
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low → High</SelectItem>
              <SelectItem value="price-high">Price: High → Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginated.map((course) => (
          <Link
            href={`/courses/${course.slug}`}
            key={course._id}
            className="group"
          >
            <DataCard className="h-full flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-magenta/10 text-magenta">
                  {course.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getLevelColor(
                    course.level
                  )}`}
                >
                  {course.level}
                </span>
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
                  {course.durationHours}h
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {course.totalLessons} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-warning" />
                  {course.avgRating}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructorName}`}
                  alt=""
                  className="h-6 w-6 rounded-full"
                />
                <span className="text-xs text-muted-foreground">
                  {course.instructorName}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <span className="text-lg font-extrabold text-magenta">
                    ₹{course.discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground line-through ml-2">
                    ₹{course.price.toLocaleString()}
                  </span>
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
      {filtered.length === 0 && (
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
