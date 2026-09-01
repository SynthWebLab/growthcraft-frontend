"use client";

import React from "react";

export default function ContentComingSoon() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      {/* Wave animation style block */}
      <style>{`
        @keyframes wave {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-8px);
          }
        }
        .wave-dot {
          animation: wave 1.2s infinite ease-in-out;
        }
        .wave-dot-1 {
          animation-delay: 0s;
        }
        .wave-dot-2 {
          animation-delay: 0.15s;
        }
        .wave-dot-3 {
          animation-delay: 0.3s;
        }
      `}</style>

      <div className="flex items-center gap-3 text-3xl font-medium text-muted-foreground font-sans">
        <span>Coming Soon</span>
        <div className="flex gap-1.5 items-center pt-2">
          <div className="wave-dot wave-dot-1 w-2.5 h-2.5 rounded-full bg-primary" />
          <div className="wave-dot wave-dot-2 w-2.5 h-2.5 rounded-full bg-primary" />
          <div className="wave-dot wave-dot-3 w-2.5 h-2.5 rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}
