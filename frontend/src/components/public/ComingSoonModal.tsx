"use client";

import { useState, useEffect } from "react";
import { LAUNCH_CONFIG } from "@/config/launch.config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Share2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export function ComingSoonModal() {
  const { event } = LAUNCH_CONFIG;

  // Live Countdown State
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Lock scroll on mount
    document.body.style.overflow = "hidden";

    const calculateTimeLeft = () => {
      const difference =
        new Date(event.targetDateIso).getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => {
      // Re-enable scroll on unmount
      document.body.style.overflow = "";
      clearInterval(interval);
    };
  }, [event.targetDateIso]);

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    navigator.clipboard.writeText(url);
    toast.success("Launch link copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Heavy glassmorphism blurred backdrop overlay */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-[12px] bg-slate-950/20" />

      {/* Premium Glassmorphism Card */}
      <div className="relative w-full max-w-xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border border-white/20 dark:border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center text-center animate-in fade-in-0 zoom-in-95 duration-300">
        
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#0070f3]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Launch Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] sm:text-xs font-bold tracking-wide uppercase">
            <Sparkles className="h-3.5 w-3.5 animate-spin-slow text-primary" />
            Launching Soon
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display mb-3">
          GrowthCraft is coming to life!
        </h2>

        {/* Description */}
        <p className="text-muted-foreground text-xs sm:text-sm max-w-md mb-6 leading-relaxed">
          Northeast India&apos;s first offline-first EdTech platform is undergoing final verification checks before launch at SYNC 2026.
        </p>

        {/* Live Countdown Timer */}
        <div className="flex justify-center items-center gap-2.5 sm:gap-4 mb-6">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              Days
            </span>
            <div className="bg-slate-900 dark:bg-slate-900/90 text-white font-mono font-bold text-xl sm:text-3xl px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-md border border-slate-800 min-w-[50px] sm:min-w-[65px] text-center">
              {String(timeLeft.days).padStart(2, "0")}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              Hours
            </span>
            <div className="bg-slate-900 dark:bg-slate-900/90 text-white font-mono font-bold text-xl sm:text-3xl px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-md border border-slate-800 min-w-[50px] sm:min-w-[65px] text-center">
              {String(timeLeft.hours).padStart(2, "0")}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              Mins
            </span>
            <div className="bg-slate-900 dark:bg-slate-900/90 text-white font-mono font-bold text-xl sm:text-3xl px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-md border border-slate-800 min-w-[50px] sm:min-w-[65px] text-center">
              {String(timeLeft.minutes).padStart(2, "0")}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              Secs
            </span>
            <div className="bg-slate-900 dark:bg-slate-900/90 text-white font-mono font-bold text-xl sm:text-3xl px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-md border border-slate-800 min-w-[50px] sm:min-w-[65px] text-center text-primary animate-pulse">
              {String(timeLeft.seconds).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-border/80 my-4" />

        {/* Event Launch Details */}
        <div className="text-left w-full space-y-3 px-1.5 sm:px-4 mb-6">
          <p className="text-[11px] font-extrabold tracking-wider text-primary uppercase text-center mb-1">
            Official Launch Event Details
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 bg-muted/40 p-2.5 rounded-lg">
              <Calendar className="h-4 w-4 text-primary shrink-0" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/40 p-2.5 rounded-lg">
              <Clock className="h-4 w-4 text-primary shrink-0" />
              <span>{event.time}</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-muted/40 p-2.5 rounded-lg text-xs text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <span>{event.venue}</span>
          </div>
        </div>
        {/* RSVP Phone list */}
        <p className="text-[10px] text-muted-foreground/80 mt-1">
          For inquiries contact: {event.rsvpContacts.join(" or ")}
        </p>

      </div>
    </div>
  );
}
