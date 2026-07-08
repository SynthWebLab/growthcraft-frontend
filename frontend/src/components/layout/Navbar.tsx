"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, ChevronDown, LayoutDashboard, Search, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAV_ROUTES, LOGIN_ROUTES, REGISTER_ROUTES, DASHBOARD_ROUTES } from "@/lib/constants/routes.constant";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDebounce } from "@/hooks/useDebounce";
import { useCourses } from "@/hooks/queries/useCourses";
import logoMain from "@/assets/logo-main.png";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch search results
  const { data: searchResults, isLoading: isSearching } = useCourses({
    q: debouncedSearch || undefined,
    limit: 5,
  });

  const courses = searchResults?.data || [];

  // Rendered directly in the Navbar from NAV_ROUTES

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show results when there's a search query
  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length > 0) {
      setShowSearchResults(true);
    }
  }, [debouncedSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={logoMain}
              alt="GrowthCraft"
              className="h-8 lg:h-10 w-auto object-contain"
              height={40}
              width={120}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-0.5 2xl:gap-1.5">
            {NAV_ROUTES.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-1.5 2xl:px-2.5 py-2 rounded-lg text-xs 2xl:text-sm font-medium transition-colors whitespace-nowrap ${
                  pathname === link.path
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden xl:flex items-center gap-2">
            {user && user.isEmailVerified ? (
              // Logged in and verified - Show Dashboard button
              <Button asChild size="sm">
                <Link href={DASHBOARD_ROUTES[user.role as keyof typeof DASHBOARD_ROUTES] || '/student'}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              // Not logged in or not verified - Show Login/Register
              <>
                {/* Login Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Login <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {LOGIN_ROUTES.map((opt) => (
                      <DropdownMenuItem key={opt.path} asChild>
                        <Link href={opt.path}>{opt.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Get Started Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm">
                      Sign Up <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {REGISTER_ROUTES.map((opt) => (
                      <DropdownMenuItem key={opt.path} asChild>
                        <Link href={opt.path}>{opt.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="xl:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="xl:hidden py-4 border-t border-border animate-fade-in max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="flex flex-col gap-2">
              {NAV_ROUTES.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.path
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 px-4 space-y-2 border-t border-border mt-2">
                {user && user.isEmailVerified ? (
                  // Logged in and verified - Show Dashboard button
                  <Button asChild size="default" className="w-full">
                    <Link href={DASHBOARD_ROUTES[user.role as keyof typeof DASHBOARD_ROUTES] || '/student'} onClick={() => setIsOpen(false)}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Go to Dashboard
                    </Link>
                  </Button>
                ) : (
                  // Not logged in or not verified - Show Login/Register options
                  <>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
                      Login As
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {LOGIN_ROUTES.map((opt) => (
                        <Button key={opt.path} asChild variant="outline" size="sm" className="w-full text-xs">
                          <Link href={opt.path} onClick={() => setIsOpen(false)}>
                            {opt.label}
                          </Link>
                        </Button>
                      ))}
                    </div>

                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2 mt-4">
                      Register As
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {REGISTER_ROUTES.map((opt) => (
                        <Button key={opt.path} asChild size="sm" className="w-full text-xs">
                          <Link href={opt.path} onClick={() => setIsOpen(false)}>
                            {opt.label}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
