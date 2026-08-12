"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  BookOpen,
  Award,
  User,
  HelpCircle,
  Settings,
  GraduationCap,
  Users,
  Calendar,
  BarChart3,
  Building2,
  Briefcase,
  FileText,
  Megaphone,
  DollarSign,
  Wrench,
  Trophy,
  Target,
  Layers,
  ShieldAlert,
  Clock,
  Bell,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SearchPageItem {
  title: string;
  href: string;
  keywords: string[];
  description: string;
  icon: React.ElementType;
  badge?: string;
}

export interface DynamicSearchBarProps {
  basePath?: string;
  roleOverride?: string;
  className?: string;
  placeholderText?: string;
}

const PORTAL_PAGES: Record<string, SearchPageItem[]> = {
  student: [
    {
      title: "Dashboard",
      href: "/student/dashboard",
      keywords: ["dashboard", "home", "overview", "main"],
      description: "Overview of learning progress & batch activity",
      icon: LayoutDashboard,
    },
    {
      title: "My Batches",
      href: "/student/batches",
      keywords: ["batches", "batch", "cohort", "my batches", "schedules"],
      description: "View enrolled offline campus batches",
      icon: Layers,
    },
    {
      title: "My Courses",
      href: "/student/courses",
      keywords: ["courses", "course", "my courses", "learning", "classes"],
      description: "Explore and track enrolled offline courses",
      icon: BookOpen,
    },
    {
      title: "Bootcamps",
      href: "/student/bootcamps",
      keywords: ["bootcamps", "bootcamp", "intensive"],
      description: "Intensive campus bootcamps",
      icon: GraduationCap,
    },
    {
      title: "Workshops",
      href: "/student/workshops",
      keywords: ["workshops", "workshop", "hands-on"],
      description: "Technical campus workshops",
      icon: Wrench,
    },
    {
      title: "Hackathons",
      href: "/student/hackathons",
      keywords: ["hackathons", "hackathon", "competition", "coding"],
      description: "Campus coding hackathons",
      icon: Trophy,
    },
    {
      title: "Training Programs",
      href: "/student/training-programs",
      keywords: ["training", "training programs", "programs"],
      description: "Specialized campus training modules",
      icon: Target,
    },
    {
      title: "Mentors",
      href: "/student/mentors",
      keywords: ["mentors", "mentor", "mentorship", "instructors"],
      description: "Connect with campus mentors",
      icon: Users,
    },
    {
      title: "Certificates",
      href: "/student/certificates",
      keywords: ["certificates", "certificate", "cert", "degrees"],
      description: "View & download course certificates",
      icon: Award,
    },
    {
      title: "Jobs & Placements",
      href: "/student/jobs",
      keywords: ["jobs", "job", "careers", "hiring", "internships", "placements"],
      description: "Explore campus placement jobs",
      icon: Briefcase,
    },
    {
      title: "Profile",
      href: "/student/profile",
      keywords: ["profile", "my profile", "account"],
      description: "Personal student profile",
      icon: User,
    },
    {
      title: "Settings",
      href: "/student/settings",
      keywords: ["settings", "account settings", "security"],
      description: "Account & notification settings",
      icon: Settings,
    },
    {
      title: "Support",
      href: "/student/support",
      keywords: ["support", "help", "faq", "contact"],
      description: "Get support & submit queries",
      icon: HelpCircle,
    },
    {
      title: "Ambassador Portal",
      href: "/student/ambassador",
      keywords: ["ambassador", "referral", "referrals", "invite"],
      description: "Ambassador referral portal",
      icon: Megaphone,
    },
  ],
  college: [
    {
      title: "College Dashboard",
      href: "/college/dashboard",
      keywords: ["dashboard", "home", "overview", "campus"],
      description: "Campus partnership metrics",
      icon: LayoutDashboard,
    },
    {
      title: "Students",
      href: "/college/students",
      keywords: ["students", "student", "roster", "import", "csv"],
      description: "Registered campus students & CSV import",
      icon: GraduationCap,
    },
    {
      title: "Workshops",
      href: "/college/workshops",
      keywords: ["workshops", "workshop", "events"],
      description: "Campus workshops & enrollments",
      icon: Wrench,
    },
    {
      title: "Hackathons",
      href: "/college/hackathons",
      keywords: ["hackathons", "hackathon", "contests"],
      description: "Campus hackathons & teams",
      icon: Trophy,
    },
    {
      title: "Bootcamps",
      href: "/college/bootcamps",
      keywords: ["bootcamps", "bootcamp"],
      description: "Campus bootcamp cohorts",
      icon: GraduationCap,
    },
    {
      title: "Reports & Analytics",
      href: "/college/reports",
      keywords: ["reports", "report", "analytics", "metrics", "performance"],
      description: "Campus attendance & completion reports",
      icon: BarChart3,
    },
    {
      title: "Partnership Tier",
      href: "/college/partnership",
      keywords: ["partnership", "tier", "silver", "gold", "platinum"],
      description: "Subscription tier & cohort limits",
      icon: Award,
    },
    {
      title: "College Profile",
      href: "/college/profile",
      keywords: ["profile", "college profile", "campus info"],
      description: "Institution details & contact",
      icon: Building2,
    },
    {
      title: "Settings",
      href: "/college/settings",
      keywords: ["settings", "account settings"],
      description: "College account settings",
      icon: Settings,
    },
    {
      title: "Support",
      href: "/college/support",
      keywords: ["support", "help", "contact"],
      description: "Campus support desk",
      icon: HelpCircle,
    },
  ],
  mentor: [
    {
      title: "Mentor Dashboard",
      href: "/mentor/dashboard",
      keywords: ["dashboard", "home", "overview"],
      description: "Session stats & schedule",
      icon: LayoutDashboard,
    },
    {
      title: "Batches",
      href: "/mentor/batches",
      keywords: ["batches", "batch", "cohorts"],
      description: "Assigned offline campus batches",
      icon: Layers,
    },
    {
      title: "Sessions & Check-ins",
      href: "/mentor/sessions",
      keywords: ["sessions", "session", "calendar", "classes", "checkin"],
      description: "Offline sessions & check-ins",
      icon: Calendar,
    },
    {
      title: "Availability & Rates",
      href: "/mentor/availability",
      keywords: ["availability", "schedule", "slots", "rate", "hourly"],
      description: "Set slot availability & rates",
      icon: Calendar,
    },
    {
      title: "Mentees & Students",
      href: "/mentor/students",
      keywords: ["students", "student", "mentees", "mentee"],
      description: "Student progress tracking",
      icon: Users,
    },
    {
      title: "Earnings & Payouts",
      href: "/mentor/earnings",
      keywords: ["earnings", "earning", "payout", "payouts", "wallet"],
      description: "Earnings, logged hours & payouts",
      icon: DollarSign,
    },
    {
      title: "Mentor Profile",
      href: "/mentor/profile",
      keywords: ["profile", "bio", "cv", "expertise"],
      description: "Public bio & expertise",
      icon: User,
    },
    {
      title: "Settings",
      href: "/mentor/settings",
      keywords: ["settings", "account settings"],
      description: "Account preferences",
      icon: Settings,
    },
    {
      title: "Support",
      href: "/mentor/support",
      keywords: ["support", "help", "contact"],
      description: "Mentor support desk",
      icon: HelpCircle,
    },
  ],
  employer: [
    {
      title: "Employer Dashboard",
      href: "/employer/dashboard",
      keywords: ["dashboard", "home", "overview"],
      description: "Recruitment metrics",
      icon: LayoutDashboard,
    },
    {
      title: "Talent Pool",
      href: "/employer/talent",
      keywords: ["talent", "talent pool", "candidates", "students", "resume"],
      description: "Search certified graduates",
      icon: Search,
    },
    {
      title: "Job Postings",
      href: "/employer/jobs",
      keywords: ["jobs", "job postings", "post job", "openings"],
      description: "Manage job postings",
      icon: Briefcase,
    },
    {
      title: "Applications",
      href: "/employer/applications",
      keywords: ["applications", "applicants", "submissions"],
      description: "Review student applications",
      icon: FileText,
    },
    {
      title: "Company Profile",
      href: "/employer/profile",
      keywords: ["profile", "company profile"],
      description: "Company details & branding",
      icon: Building2,
    },
    {
      title: "Settings",
      href: "/employer/settings",
      keywords: ["settings", "account settings"],
      description: "Recruiter settings",
      icon: Settings,
    },
    {
      title: "Support",
      href: "/employer/support",
      keywords: ["support", "help", "contact"],
      description: "Hiring partner support",
      icon: HelpCircle,
    },
  ],
  admin: [
    {
      title: "Admin Dashboard",
      href: "/admin",
      keywords: ["dashboard", "home", "overview", "admin"],
      description: "System stats & health",
      icon: LayoutDashboard,
    },
    {
      title: "User Management",
      href: "/admin/users",
      keywords: ["users", "user", "accounts", "all users"],
      description: "Manage all user accounts",
      icon: Users,
    },
    {
      title: "Colleges Management",
      href: "/admin/colleges",
      keywords: ["colleges", "college", "campus", "partners"],
      description: "Manage college profiles & tiers",
      icon: Building2,
    },
    {
      title: "Courses Catalog",
      href: "/admin/courses",
      keywords: ["courses", "course", "curriculum"],
      description: "Manage offline course catalog",
      icon: BookOpen,
    },
    {
      title: "Bootcamps",
      href: "/admin/bootcamps",
      keywords: ["bootcamps", "bootcamp"],
      description: "Bootcamp programs & cohorts",
      icon: GraduationCap,
    },
    {
      title: "Batches & Cohorts",
      href: "/admin/batches",
      keywords: ["batches", "batch", "cohorts"],
      description: "Offline campus batches",
      icon: Layers,
    },
    {
      title: "Attendance",
      href: "/admin/attendance",
      keywords: ["attendance", "checkin", "logs"],
      description: "Verify mentor check-ins",
      icon: Clock,
    },
    {
      title: "Registrations",
      href: "/admin/registrations",
      keywords: ["registrations", "enrollments"],
      description: "Track course enrollments",
      icon: FileText,
    },
    {
      title: "Enquiries & Leads",
      href: "/admin/enquiries",
      keywords: ["enquiries", "leads", "queries"],
      description: "Manage student & college leads",
      icon: HelpCircle,
    },
    {
      title: "Events",
      href: "/admin/events",
      keywords: ["events", "workshops", "hackathons"],
      description: "Manage campus events",
      icon: Trophy,
    },
    {
      title: "Training Programs",
      href: "/admin/training-programs",
      keywords: ["training", "training programs"],
      description: "Manage training track definitions",
      icon: Target,
    },
    {
      title: "Mentors Directory",
      href: "/admin/mentors",
      keywords: ["mentors", "mentor"],
      description: "Review mentor profiles & rates",
      icon: Users,
    },
    {
      title: "Employers & Jobs",
      href: "/admin/employers",
      keywords: ["employers", "hiring", "jobs"],
      description: "Employer partners & jobs",
      icon: Briefcase,
    },
    {
      title: "Audit Logs",
      href: "/admin/audit-logs",
      keywords: ["audit", "audit logs", "security"],
      description: "Security & admin action logs",
      icon: ShieldAlert,
    },
    {
      title: "Notifications",
      href: "/admin/notifications",
      keywords: ["notifications", "alerts"],
      description: "System notifications center",
      icon: Bell,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      keywords: ["settings", "system settings"],
      description: "Platform wide settings",
      icon: Settings,
    },
  ],
};

function getPortalKey(pathname: string, basePath?: string, roleOverride?: string): string {
  if (roleOverride) {
    const ro = roleOverride.toLowerCase();
    if (ro.includes("admin")) return "admin";
    if (ro.includes("college")) return "college";
    if (ro.includes("mentor")) return "mentor";
    if (ro.includes("hiring") || ro.includes("employer")) return "employer";
    if (ro.includes("student")) return "student";
  }
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/college") || basePath === "/college") return "college";
  if (pathname.startsWith("/mentor") || basePath === "/mentor") return "mentor";
  if (pathname.startsWith("/employer") || basePath === "/employer") return "employer";
  return "student";
}

export const DynamicSearchBar: React.FC<DynamicSearchBarProps> = ({
  basePath,
  roleOverride,
  className,
  placeholderText,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const portalKey = useMemo(
    () => getPortalKey(pathname, basePath, roleOverride),
    [pathname, basePath, roleOverride]
  );

  const pagesForRole = useMemo(() => {
    return PORTAL_PAGES[portalKey] || PORTAL_PAGES.student;
  }, [portalKey]);

  // Compute placeholder dynamically based on current page / portal
  const defaultPlaceholder = useMemo(() => {
    if (placeholderText) return placeholderText;

    if (portalKey === "college") {
      if (pathname.includes("/students")) return "Search students...";
      if (pathname.includes("/workshops")) return "Search workshops...";
      if (pathname.includes("/hackathons")) return "Search hackathons...";
      if (pathname.includes("/bootcamps")) return "Search bootcamps...";
      if (pathname.includes("/reports")) return "Search reports & analytics...";
      return "Search students, reports, workshops, bootcamps...";
    }

    if (portalKey === "mentor") {
      if (pathname.includes("/sessions")) return "Search sessions & check-ins...";
      if (pathname.includes("/students")) return "Search mentees & students...";
      if (pathname.includes("/batches")) return "Search assigned batches...";
      if (pathname.includes("/earnings")) return "Search earnings & payouts...";
      return "Search sessions, mentees, batches, earnings...";
    }

    if (portalKey === "employer") {
      if (pathname.includes("/talent")) return "Search talent pool & candidates...";
      if (pathname.includes("/jobs")) return "Search job postings...";
      if (pathname.includes("/applications")) return "Search candidate applications...";
      return "Search talent pool, job postings...";
    }

    if (portalKey === "admin") {
      if (pathname.includes("/users")) return "Search users...";
      if (pathname.includes("/colleges")) return "Search college partners...";
      if (pathname.includes("/courses")) return "Search course catalog...";
      if (pathname.includes("/bootcamps")) return "Search bootcamps...";
      if (pathname.includes("/batches")) return "Search campus batches...";
      if (pathname.includes("/audit-logs")) return "Search audit logs...";
      return "Search users, colleges, courses, logs...";
    }

    // Student portal
    if (pathname.includes("/courses")) return "Search courses...";
    if (pathname.includes("/bootcamps")) return "Search bootcamps...";
    if (pathname.includes("/workshops")) return "Search workshops...";
    if (pathname.includes("/hackathons")) return "Search hackathons...";
    if (pathname.includes("/training-programs")) return "Search training programs...";
    if (pathname.includes("/jobs")) return "Search jobs & placements...";
    if (pathname.includes("/mentors")) return "Search mentors...";
    if (pathname.includes("/certificates")) return "Search certificates...";
    return "Search courses, bootcamps, workshops, jobs...";
  }, [portalKey, pathname, placeholderText]);

  // Filter page suggestions ONLY when user actually types text
  const suggestions = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return []; // Empty when no search text!

    return pagesForRole.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(term);
      const matchDesc = item.description.toLowerCase().includes(term);
      const matchKeywords = item.keywords.some((kw) => kw.toLowerCase().includes(term));
      return matchTitle || matchDesc || matchKeywords;
    }).slice(0, 4); // Show top 4 matching suggestions
  }, [searchQuery, pagesForRole]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle direct page navigation
  const navigateToPage = (href: string) => {
    setIsOpen(false);
    setSearchQuery("");
    setSelectedIndex(-1);
    router.push(href);
  };

  // Perform dynamic search on submit
  const handleQuerySubmit = (term: string) => {
    const query = term.trim();
    if (!query) return;

    setIsOpen(false);
    setSearchQuery("");
    setSelectedIndex(-1);

    const lowerQuery = query.toLowerCase();

    // Check exact keyword match in available pages
    const matchedPage = pagesForRole.find((page) =>
      page.keywords.some((kw) => kw.toLowerCase() === lowerQuery)
    );

    if (matchedPage) {
      router.push(matchedPage.href);
      return;
    }

    // Dynamic routing fallback based on current section & portal
    const encoded = encodeURIComponent(query);
    const prefix = basePath || (portalKey === "admin" ? "/admin" : `/${portalKey}`);

    if (portalKey === "college") {
      if (pathname.includes("/workshops")) {
        router.push(`${prefix}/workshops?q=${encoded}`);
      } else if (pathname.includes("/bootcamps")) {
        router.push(`${prefix}/bootcamps?q=${encoded}`);
      } else if (pathname.includes("/hackathons")) {
        router.push(`${prefix}/hackathons?q=${encoded}`);
      } else {
        router.push(`${prefix}/students?search=${encoded}`);
      }
    } else if (portalKey === "mentor") {
      if (pathname.includes("/sessions")) {
        router.push(`${prefix}/sessions?search=${encoded}`);
      } else if (pathname.includes("/batches")) {
        router.push(`${prefix}/batches?search=${encoded}`);
      } else {
        router.push(`${prefix}/students?search=${encoded}`);
      }
    } else if (portalKey === "employer") {
      if (pathname.includes("/jobs")) {
        router.push(`${prefix}/jobs?q=${encoded}`);
      } else if (pathname.includes("/applications")) {
        router.push(`${prefix}/applications?q=${encoded}`);
      } else {
        router.push(`${prefix}/talent?q=${encoded}`);
      }
    } else if (portalKey === "admin") {
      if (pathname.includes("/colleges")) {
        router.push("/admin/colleges?search=" + encoded);
      } else if (pathname.includes("/courses")) {
        router.push("/admin/courses?q=" + encoded);
      } else if (pathname.includes("/bootcamps")) {
        router.push("/admin/bootcamps?q=" + encoded);
      } else if (pathname.includes("/batches")) {
        router.push("/admin/batches?search=" + encoded);
      } else if (pathname.includes("/attendance")) {
        router.push("/admin/attendance?search=" + encoded);
      } else if (pathname.includes("/registrations")) {
        router.push("/admin/registrations?search=" + encoded);
      } else if (pathname.includes("/enquiries")) {
        router.push("/admin/enquiries?search=" + encoded);
      } else if (pathname.includes("/events")) {
        router.push("/admin/events?q=" + encoded);
      } else if (pathname.includes("/training-programs")) {
        router.push("/admin/training-programs?q=" + encoded);
      } else if (pathname.includes("/mentors")) {
        router.push("/admin/mentors?search=" + encoded);
      } else if (pathname.includes("/employers")) {
        router.push("/admin/employers?search=" + encoded);
      } else if (pathname.includes("/audit-logs")) {
        router.push("/admin/audit-logs?search=" + encoded);
      } else {
        router.push("/admin/users?search=" + encoded);
      }
    } else {
      // Student
      if (pathname.includes("/bootcamps")) {
        router.push(`${prefix}/bootcamps?q=${encoded}`);
      } else if (pathname.includes("/workshops")) {
        router.push(`${prefix}/workshops?q=${encoded}`);
      } else if (pathname.includes("/hackathons")) {
        router.push(`${prefix}/hackathons?q=${encoded}`);
      } else if (pathname.includes("/training-programs")) {
        router.push(`${prefix}/training-programs?q=${encoded}`);
      } else if (pathname.includes("/jobs")) {
        router.push(`${prefix}/jobs?q=${encoded}`);
      } else if (pathname.includes("/mentors")) {
        router.push(`${prefix}/mentors?q=${encoded}`);
      } else if (pathname.includes("/batches")) {
        router.push(`${prefix}/batches?search=${encoded}`);
      } else {
        router.push(`${prefix}/courses?q=${encoded}`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        navigateToPage(suggestions[selectedIndex].href);
      } else {
        handleQuerySubmit(searchQuery);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-[130px] min-[380px]:max-w-[180px] min-[450px]:max-w-[240px] sm:max-w-sm md:max-w-md", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            navigateToPage(suggestions[selectedIndex].href);
          } else {
            handleQuerySubmit(searchQuery);
          }
        }}
        className="relative flex items-center"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-magenta" />
        <Input
          ref={inputRef}
          value={searchQuery}
          onChange={(e) => {
            const val = e.target.value;
            setSearchQuery(val);
            setIsOpen(val.trim().length > 0);
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            if (searchQuery.trim().length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={defaultPlaceholder}
          className="pl-9 pr-10 h-9 bg-marble border-none hover:bg-marble/90 focus:bg-white focus:ring-1 focus:ring-magenta/30 transition-all text-xs font-medium placeholder:text-muted-foreground/70 rounded-full"
          aria-label="Search dashboard"
        />
        <button
          type="submit"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-magenta p-1 transition-colors"
        >
          <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono bg-white border border-border rounded px-1.5 py-0.5 text-muted-foreground">
            ↵
          </kbd>
        </button>
      </form>

      {/* Show small dropdown ONLY when user is actively typing and matching pages exist */}
      {isOpen && searchQuery.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-border/80 rounded-xl shadow-xl overflow-hidden animate-in fade-in-50 slide-in-from-top-1 duration-100">
          <div
            onClick={() => handleQuerySubmit(searchQuery)}
            className="p-2.5 px-3 bg-magenta/5 hover:bg-magenta/10 cursor-pointer border-b border-border/40 flex items-center justify-between group transition-colors"
          >
            <div className="flex items-center gap-2 text-xs font-medium text-foreground truncate">
              <Search className="h-3.5 w-3.5 text-magenta shrink-0" />
              <span>Search &quot;<strong className="text-magenta">{searchQuery}</strong>&quot;</span>
            </div>
            <span className="text-[10px] text-magenta font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Press Enter <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          {suggestions.length > 0 && (
            <div className="py-1 divide-y divide-border/20">
              {suggestions.map((item, idx) => {
                const IconComponent = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.href}
                    onClick={() => navigateToPage(item.href)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      "flex items-center justify-between p-2 px-3 cursor-pointer transition-all text-left",
                      isSelected ? "bg-lavender/15 text-magenta" : "hover:bg-muted/40 text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          "h-6 w-6 rounded flex items-center justify-center shrink-0 transition-colors",
                          isSelected ? "bg-magenta text-white" : "bg-muted/60 text-muted-foreground"
                        )}
                      >
                        <IconComponent className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-semibold truncate">{item.title}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">Go to page →</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DynamicSearchBar;
