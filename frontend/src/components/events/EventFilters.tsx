interface FilterOption {
  value: string;
  label: string;
}

interface FilterGroup {
  selected: string | null;
  options: FilterOption[];
  onChange: (value: string | null) => void;
}

interface EventFiltersProps {
  groups: FilterGroup[];
  onClearAll: () => void;
}

export function EventFilters({ groups, onClearAll }: EventFiltersProps) {
  const hasActiveFilters = groups.some((group) => group.selected);

  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="flex flex-wrap items-center gap-2">
          {group.options.map((option) => {
            const isActive = group.selected === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => group.onChange(isActive ? null : option.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {option.label}
              </button>
            );
          })}

          {groupIndex < groups.length - 1 && (
            <span className="w-px h-6 bg-border mx-1" />
          )}
        </div>
      ))}

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearAll}
          className="px-3 py-1.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
        >
          Clear
        </button>
      )}
    </div>
  );
}
