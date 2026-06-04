"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  duration?: number;
  className?: string;
}

const StatCounter = ({ 
  value, 
  prefix = "", 
  suffix = "", 
  label, 
  duration = 2, 
  className 
}: StatCounterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

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
  }, [isInView, value, duration]);

  return (
    <motion.div
      ref={ref}
      className={cn("text-center", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <p className="text-4xl md:text-5xl font-extrabold text-magenta font-display">
        {prefix}{count.toLocaleString()}{suffix}
      </p>
      <p className="mt-2 text-sm font-medium text-muted-foreground font-afacad tracking-wide uppercase">
        {label}
      </p>
    </motion.div>
  );
};

export { StatCounter };
export default StatCounter;
