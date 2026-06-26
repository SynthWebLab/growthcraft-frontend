"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Search, Bell, LogOut, User, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/queries/useAuthentication";

interface PanelTopbarProps {
  onMenuClick: () => void;
  basePath: string;
  breadcrumb?: string;
}

const PanelTopbar = ({ onMenuClick, basePath, breadcrumb }: PanelTopbarProps) => {
  const { user: profile } = useAuth();
  const { mutate: signOut } = useLogout();
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = search.trim();
    if (term) {
      if (basePath === "/mentor") {
        const lower = term.toLowerCase();
        if (["dashboard", "home", "overview"].includes(lower)) {
          router.push(`${basePath}/dashboard`);
        } else if (["sessions", "session", "calendar", "meeting"].includes(lower)) {
          router.push(`${basePath}/sessions`);
        } else if (["availability", "schedule", "time", "slots", "rate", "hourly"].includes(lower)) {
          router.push(`${basePath}/availability`);
        } else if (["students", "student", "mentees", "mentee"].includes(lower)) {
          router.push(`${basePath}/students`);
        } else if (["earnings", "earning", "payout", "payouts", "money", "wallet", "withdraw"].includes(lower)) {
          router.push(`${basePath}/earnings`);
        } else if (["profile", "bio", "cv", "expert"].includes(lower)) {
          router.push(`${basePath}/profile`);
        } else if (["settings", "account", "password"].includes(lower)) {
          router.push(`${basePath}/settings`);
        } else if (["support", "help", "query", "faq", "contact", "ticket"].includes(lower)) {
          router.push(`${basePath}/support`);
        } else {
          // Fallback to student search
          router.push(`${basePath}/students?search=${encodeURIComponent(term)}`);
        }
      } else {
        if (pathname.includes("/bootcamps")) {
          router.push(`${basePath}/bootcamps?q=${encodeURIComponent(term)}`);
        } else if (pathname.includes("/workshops")) {
          router.push(`${basePath}/workshops?q=${encodeURIComponent(term)}`);
        } else if (pathname.includes("/hackathons")) {
          router.push(`${basePath}/hackathons?q=${encodeURIComponent(term)}`);
        } else if (pathname.includes("/training-programs")) {
          router.push(`${basePath}/training-programs?q=${encodeURIComponent(term)}`);
        } else {
          router.push(`${basePath}/courses?q=${encodeURIComponent(term)}`);
        }
      }
      setSearch("");
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-white px-4 md:px-8">
      {/* Left */}
      <button
        onClick={onMenuClick}
        className="text-muted-foreground hover:text-magenta transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>
      {breadcrumb && (
        <span className="hidden md:block text-sm font-afacad text-muted-foreground">{breadcrumb}</span>
      )}

      {/* Center — search */}
      <div className="flex-1 flex justify-center">
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={basePath === "/mentor" ? "Search pages, students..." : "Search courses..."}
            className="pl-9 pr-12 h-9 bg-marble border-none"
            aria-label={basePath === "/mentor" ? "Search pages or students" : "Search courses"}
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-white border border-border rounded px-1.5 py-0.5 text-muted-foreground">
            ↵
          </kbd>
        </form>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-magenta" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <div className="p-3 text-sm font-semibold border-b">Notifications</div>
            <div className="p-4 text-sm text-muted-foreground text-center">No new notifications</div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              suppressHydrationWarning
              className="h-8 w-8 rounded-full bg-lavender/20 flex items-center justify-center text-sm font-semibold text-foreground"
            >
              {(profile?.fullName?.[0] || "U").toUpperCase()}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`${basePath}/profile`}><User className="mr-2 h-4 w-4" />Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`${basePath}/settings`}><Settings className="mr-2 h-4 w-4" />Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()} className="text-danger">
              <LogOut className="mr-2 h-4 w-4" />Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default PanelTopbar;
