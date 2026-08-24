"use client";

import { Section } from "@/components/ui/section";
import { testimonialsMock } from "@/data/testimonials.mock";
import { Quote } from "lucide-react";

export const Outcomes = () => {
  return (
    <Section variant="marble" className="!py-10 sm:!py-14 md:!py-18 lg:!py-22">
      <div className="text-center mb-8 sm:mb-12 md:mb-14 animate-fade-up">
        <p className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground mb-2 sm:mb-3 font-semibold">
          Placements
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display">
          Outcomes that talk for themselves.
        </h2>
      </div>

      <div
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide"
      >
        {testimonialsMock.map((t) => (
          <div
            key={t._id}
            className="w-[85vw] max-w-[340px] sm:w-[320px] md:w-[360px] snap-center sm:snap-start flex-shrink-0"
          >
            <div className="rounded-xl border border-border bg-card p-4 sm:p-6 h-full flex flex-col justify-between transition-all hover:-translate-y-1 shadow-xs">
              <div>
                <Quote className="h-4 w-4 sm:h-5 sm:w-5 text-secondary mb-2 sm:mb-3" />
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 sm:mb-5">
                  &quot;{t.quote}&quot;
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-muted object-cover"
                  />
                  <div>
                    <p className="text-xs sm:text-sm font-bold font-display">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Now at{" "}
                      <span className="font-medium text-foreground">
                        {t.hiredAt}
                      </span>
                    </p>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-2 pt-2 border-t border-border/40">
                  {t.courseTaken}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};
