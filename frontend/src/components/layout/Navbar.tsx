"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAV_ROUTES, LOGIN_ROUTES, REGISTER_ROUTES, DASHBOARD_ROUTES } from "@/lib/constants/routes.constant";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import logoMain from "@/assets/logo-main.png";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: user, isLoading } = useCurrentUser();

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
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ROUTES.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              // Logged in - Show Dashboard button
              <Link href={DASHBOARD_ROUTES[user.role as keyof typeof DASHBOARD_ROUTES] || '/student'}>
                <Button size="default">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              // Not logged in - Show Login/Register
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
                    <Button size="default">
                      Get Started <ChevronDown className="ml-1 h-3 w-3" />
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
            className="lg:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
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

              <div className="pt-4 px-4 space-y-2">
                {user ? (
                  // Logged in - Show Dashboard button
                  <Link href={DASHBOARD_ROUTES[user.role as keyof typeof DASHBOARD_ROUTES] || '/student'}>
                    <Button size="default" className="w-full">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  // Not logged in - Show Login/Register options
                  <>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
                      Login As
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {LOGIN_ROUTES.map((opt) => (
                        <Link
                          key={opt.path}
                          href={opt.path}
                          onClick={() => setIsOpen(false)}
                        >
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            {opt.label}
                          </Button>
                        </Link>
                      ))}
                    </div>

                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2 mt-4">
                      Register As
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {REGISTER_ROUTES.map((opt) => (
                        <Link
                          key={opt.path}
                          href={opt.path}
                          onClick={() => setIsOpen(false)}
                        >
                          <Button size="sm" className="w-full text-xs">
                            {opt.label}
                          </Button>
                        </Link>
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
