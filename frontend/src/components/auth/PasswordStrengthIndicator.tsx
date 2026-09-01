"use client";

import { useMemo } from "react";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getPasswordRequirements,
  getPasswordStrength,
  type PasswordStrengthLevel,
} from "@/lib/validations/validators";

interface PasswordStrengthIndicatorProps {
  password: string;
  /** Only start showing feedback after the user has typed something */
  touched?: boolean;
}

const STRENGTH_CONFIG: Record<
  PasswordStrengthLevel,
  { color: string; bg: string; text: string }
> = {
  weak: { color: "bg-red-500", bg: "text-red-500", text: "Weak" },
  fair: { color: "bg-yellow-500", bg: "text-yellow-500", text: "Fair" },
  strong: { color: "bg-green-500", bg: "text-green-500", text: "Strong" },
};

interface RequirementItemProps {
  met: boolean;
  label: string;
  evaluated: boolean;
}

function RequirementItem({ met, label, evaluated }: RequirementItemProps) {
  return (
    <li className="flex items-center gap-2 text-xs" role="listitem">
      {!evaluated ? (
        <Minus className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      ) : met ? (
        <Check className="h-3.5 w-3.5 shrink-0 text-green-500" aria-hidden="true" />
      ) : (
        <X className="h-3.5 w-3.5 shrink-0 text-red-500" aria-hidden="true" />
      )}
      <span
        className={cn(
          "transition-colors",
          !evaluated
            ? "text-muted-foreground"
            : met
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400",
        )}
      >
        {label}
      </span>
    </li>
  );
}

export function PasswordStrengthIndicator({
  password,
  touched = false,
}: PasswordStrengthIndicatorProps) {
  const requirements = useMemo(() => getPasswordRequirements(password), [password]);
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const evaluated = touched && password.length > 0;
  const config = STRENGTH_CONFIG[strength.level];

  return (
    <div className="space-y-2" aria-live="polite" aria-label="Password strength feedback">
      {/* Strength bar */}
      {evaluated && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Password strength:</span>
            <span className={cn("font-medium", config.bg)}>{config.text}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn("h-full transition-all duration-300 rounded-full", config.color)}
              style={{ width: `${strength.score}%` }}
              role="progressbar"
              aria-valuenow={strength.score}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Password strength: ${config.text}`}
            />
          </div>
        </div>
      )}

      {/* Requirements checklist */}
      <div className="bg-muted/50 p-3 rounded-md">
        <p className="text-xs font-medium text-muted-foreground mb-1.5">
          Password requirements:
        </p>
        <ul className="space-y-1" role="list">
          <RequirementItem
            evaluated={evaluated}
            met={requirements.minLength}
            label="At least 8 characters"
          />
          <RequirementItem
            evaluated={evaluated}
            met={requirements.uppercase}
            label="One uppercase letter (A-Z)"
          />
          <RequirementItem
            evaluated={evaluated}
            met={requirements.lowercase}
            label="One lowercase letter (a-z)"
          />
          <RequirementItem
            evaluated={evaluated}
            met={requirements.number}
            label="One number (0-9)"
          />
          <RequirementItem
            evaluated={evaluated}
            met={requirements.notCommon}
            label="Not a commonly used password"
          />
        </ul>
      </div>
    </div>
  );
}
