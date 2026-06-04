import type { ReactNode } from "react";

const TONE_STYLES = {
  purple: {
    borderHover: "hover:border-primary/30",
    banner: "bg-graphite text-white/40",
    badge: "bg-primary/10 text-primary",
    chip: "bg-primary/10 text-primary border-primary/20",
    footerButton: "bg-primary text-primary-foreground hover:bg-primary/90",
    accentText: "text-primary",
  },
  blue: {
    borderHover: "hover:border-primary/30",
    banner: "bg-graphite text-white/40",
    badge: "bg-primary/10 text-primary",
    chip: "bg-primary/10 text-primary border-primary/20",
    footerButton: "bg-primary text-primary-foreground hover:bg-primary/90",
    accentText: "text-primary",
  },
  orange: {
    borderHover: "hover:border-primary/30",
    banner: "bg-graphite text-white/40",
    badge: "bg-primary/10 text-primary",
    chip: "bg-primary/10 text-primary border-primary/20",
    footerButton: "bg-primary text-primary-foreground hover:bg-primary/90",
    accentText: "text-primary",
  },
} as const;

export type EventCardTone = keyof typeof TONE_STYLES;

interface EventCardFrameProps {
  tone: EventCardTone;
  banner: ReactNode;
  badgeRow: ReactNode;
  title: string;
  description: string;
  dateRow?: ReactNode;
  children?: ReactNode;
  footerLeft: ReactNode;
  footerRight: ReactNode;
}

export function EventCardFrame({
  tone,
  banner,
  badgeRow,
  title,
  description,
  dateRow,
  children,
  footerLeft,
  footerRight,
}: EventCardFrameProps) {
  const styles = TONE_STYLES[tone];

  return (
    <div className={`flex flex-col lg:flex-row gap-0 lg:gap-6 rounded-xl border overflow-hidden bg-card shadow-sm transition-all ${styles.borderHover} hover:shadow-lg`}>
      <div className={`lg:w-[40%] h-32 sm:h-48 lg:h-auto flex items-center justify-center ${styles.banner}`}>
        {banner}
      </div>

      <div className="lg:w-[60%] p-4 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">{badgeRow}</div>

          <h2 className="text-lg sm:text-xl font-bold mb-2">{title}</h2>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>

          {dateRow && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mb-4">
              {dateRow}
            </div>
          )}

          {children}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t gap-3 sm:gap-4">
          {footerLeft}
          {footerRight}
        </div>
      </div>
    </div>
  );
}

export function getEventCardToneStyles(tone: EventCardTone) {
  return TONE_STYLES[tone];
}
