"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface StatCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  duration?: number;
  className?: string;
}

export const StatCounter = ({
  value,
  prefix = "",
  suffix = "",
  label,
  duration = 2,
  className,
}: StatCounterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const step = value / (duration * 60);
    const id = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(id);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(id);
  }, [isVisible, value, duration]);

  return (
    <div
      ref={ref}
      className={cn(
        "text-center opacity-0 translate-y-5 transition-all duration-500",
        isVisible && "opacity-100 translate-y-0",
        className
      )}
    >
      <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary font-display">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-muted-foreground tracking-wide uppercase">
        {label}
      </p>
    </div>
  );
};
