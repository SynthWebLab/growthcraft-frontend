"use client";

import { useState, useEffect } from "react";
import { LAUNCH_CONFIG } from "@/config/launch.config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  ArrowRight,
  Code2,
  Store,
  MessageSquare,
  Zap,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

export function SyncComingSoonPage() {
  const { event, whatsSync, happeningCards, timeline, audienceCards } =
    LAUNCH_CONFIG;

  // Live Countdown State
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 8, hours: 17, minutes: 14, seconds: 56 });

  useEffect(() => {
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
    return () => clearInterval(interval);
  }, [event.targetDateIso]);

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.origin + "/coming-soon" : "";
    navigator.clipboard.writeText(url);
    toast.success("Event link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-[#f4f8fc] text-slate-900 font-sans selection:bg-[#0070f3] selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="pt-10 sm:pt-14 md:pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center relative">
        {/* BIG COMING SOON HEADER TITLE */}
        <div className="mb-4">
          <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-widest text-[#0070f3] drop-shadow-sm font-display block">
            COMING SOON
          </span>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-500 mt-1">
            GrowthCraft Official Launch Event &amp; Expo
          </p>
        </div>

        {/* Founding Year Badge */}
        <div className="mt-4 mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0070f3]/40 bg-[#0070f3]/5 text-[#0070f3] text-xs font-extrabold tracking-wide uppercase">
            <Sparkles className="h-3.5 w-3.5 text-[#0070f3]" />
            {event.badge}
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 font-display leading-[1.1] mb-6">
          Northeast India&apos;s{" "}
          <span className="text-[#0070f3]">Product &amp;</span>
          <br className="hidden sm:block" /> Community Meet
        </h1>

        {/* Hero Subtitle */}
        <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-8">
          {event.subtitle}
        </p>

        {/* Event Meta Line */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-slate-700 mb-10">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-[#0070f3]" /> {event.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[#0070f3]" /> {event.time}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-[#0070f3]" /> {event.venue}
          </span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <Phone className="h-4 w-4 text-[#0070f3]" /> RSVP: {event.rsvpContacts.join(" | ")}
          </span>
        </div>

        {/* Dark Digit Countdown Timer (synthweb style) */}
        <div className="flex justify-center items-center gap-2 sm:gap-4 mb-10">
          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Days
            </span>
            <div className="bg-[#1c1c1c] text-white font-mono font-bold text-2xl sm:text-4xl md:text-5xl px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-lg border border-slate-800 min-w-[55px] sm:min-w-[75px] text-center">
              {String(timeLeft.days).padStart(2, "0")}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Hours
            </span>
            <div className="bg-[#1c1c1c] text-white font-mono font-bold text-2xl sm:text-4xl md:text-5xl px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-lg border border-slate-800 min-w-[55px] sm:min-w-[75px] text-center">
              {String(timeLeft.hours).padStart(2, "0")}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Minutes
            </span>
            <div className="bg-[#1c1c1c] text-white font-mono font-bold text-2xl sm:text-4xl md:text-5xl px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-lg border border-slate-800 min-w-[55px] sm:min-w-[75px] text-center">
              {String(timeLeft.minutes).padStart(2, "0")}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Seconds
            </span>
            <div className="bg-[#1c1c1c] text-white font-mono font-bold text-2xl sm:text-4xl md:text-5xl px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-lg border border-slate-800 min-w-[55px] sm:min-w-[75px] text-center text-[#0070f3] animate-pulse">
              {String(timeLeft.seconds).padStart(2, "0")}
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT'S SYNC? SECTION */}
      <section className="py-16 bg-white border-y border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0070f3]">
              {whatsSync.title}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-display mt-1">
              {whatsSync.heading}
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Visual Photo Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-[16/10] bg-slate-900 group">
              <img
                src={whatsSync.imageUrl}
                alt="Guwahati Builders Meet"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <Badge className="bg-[#0070f3] text-white border-none text-xs font-bold mb-2">
                    SYNC 2026
                  </Badge>
                  <p className="text-sm font-semibold">
                    Live Demo &amp; Builder Gathering • Guwahati
                  </p>
                </div>
              </div>
            </div>

            {/* Description Text */}
            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>{whatsSync.description1}</p>
              <p>{whatsSync.description2}</p>

              <div className="pt-4 flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2 text-xs font-bold border-slate-300 text-slate-700"
                >
                  <Share2 className="h-4 w-4 text-[#0070f3]" /> Share Event Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT'S HAPPENING? SECTION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0070f3]">
            WHAT&apos;S HAPPENING?
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-display mt-1">
            A full day, six ways to be part of it
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto mt-2">
            Product launches, panels, a pitch session, a tech talk, stalls, and enough networking to actually meet people — not just watch a stage.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {happeningCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Icon & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-[#0070f3]/10 text-[#0070f3] flex items-center justify-center font-bold text-lg">
                    {card.id === "growthcraft" && (
                      <span className="font-extrabold font-display">gC</span>
                    )}
                    {card.id === "amuthi" && (
                      <span className="font-extrabold font-display">am</span>
                    )}
                    {card.id === "synthtank" && <Zap className="h-6 w-6" />}
                    {card.id === "panels" && <MessageSquare className="h-6 w-6" />}
                    {card.id === "techtalk" && <Code2 className="h-6 w-6" />}
                    {card.id === "stalls" && <Store className="h-6 w-6" />}
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-700 text-[10px] font-bold"
                  >
                    {card.badge}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-display mb-1">
                  {card.title}
                </h3>
                <p className="text-xs font-semibold text-[#0070f3] mb-3">
                  {card.subtitle}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {card.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TIMELINE SCHEDULE SECTION */}
      <section className="py-16 bg-[#1a1a1a] text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0070f3]">
              EVENT TIMELINE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
              Sunday, Aug 16, 2026 Schedule
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {timeline.map((slot, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center flex flex-col justify-between"
              >
                <span className="text-xs font-extrabold text-[#0070f3] block mb-1 font-mono">
                  {slot.time}
                </span>
                <p className="text-[11px] font-medium text-slate-300 leading-snug">
                  {slot.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHO SHOULD ATTEND, AND WHY? */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0070f3]">
            WHO SHOULD ATTEND, AND WHY
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-display mt-1">
            Six reasons to be in the room
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {audienceCards.map((aud, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm relative overflow-hidden"
            >
              <span className="text-xs font-bold text-[#0070f3] mb-2 block font-mono">
                0{idx + 1}
              </span>
              <h3 className="text-base font-bold text-slate-900 font-display mb-2">
                {aud.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">{aud.text}</p>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-3 shadow-2xl border border-slate-800 relative overflow-hidden">
          {/* Subtle Ambient Radial Blur Accent */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0070f3]/20 rounded-full blur-3xl pointer-events-none" />

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display leading-tight text-white relative z-10">
            Be part of Northeast India&apos;s Founding Tech Meet
          </h3>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed relative z-10">
            One day, in Guwahati — Agora, The Space. Sunday, Aug 16, 2026.
          </p>
        </div>
      </section>
    </div>
  );
}
