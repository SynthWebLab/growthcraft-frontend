"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// ---------------------------------------------------------------------------
// FormField — reusable field wrapper with label, icon, error, validation state
// ---------------------------------------------------------------------------

interface FormFieldProps {
  /** Unique id for the input — also used for label htmlFor and aria links */
  id: string;
  /** Label text */
  label: string;
  /** Validation error message (from react-hook-form errors.field.message) */
  error?: string;
  /** Has the field been touched / dirtied? Used to decide when to show valid state */
  touched?: boolean;
  /** Show a green valid state when touched + no error */
  showValid?: boolean;
  /** Optional icon rendered inside the input (left side) */
  icon?: React.ReactNode;
  /** Extra content rendered below the input (e.g. PasswordStrengthIndicator) */
  children?: React.ReactNode;
  /** Additional class names for the outer wrapper */
  className?: string;
  /** If true the label is marked with (Optional) */
  optional?: boolean;
}

/**
 * Composable FormField.
 *
 * Usage with react-hook-form `register`:
 * ```tsx
 * <FormField id="reg-name" label="Full Name" error={errors.name?.message} icon={<User />}>
 *   <Input {...register("name")} />
 * </FormField>
 * ```
 *
 * For fields that need a custom control (Select, Textarea) just pass them as children.
 */
export function FormField({
  id,
  label,
  error,
  touched = false,
  showValid = false,
  icon,
  children,
  className,
  optional = false,
}: FormFieldProps) {
  const errorId = `${id}-error`;
  const hasError = !!error;
  const isValid = showValid && touched && !hasError;

  // Inject aria props and error styling into the first Input / input-like child
  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    const extra: Record<string, unknown> = {};

    // aria attributes for accessibility
    if (hasError) {
      extra["aria-invalid"] = true;
      extra["aria-describedby"] = errorId;
    }

    // Merge border color classes
    const existingClassName = (child.props as { className?: string }).className || "";
    if (hasError) {
      extra.className = cn(existingClassName, "border-red-500 focus-visible:ring-red-500");
    } else if (isValid) {
      extra.className = cn(existingClassName, "border-green-500 focus-visible:ring-green-500");
    }

    return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, extra);
  });

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {optional && (
          <span className="text-muted-foreground font-normal ml-1 text-xs">(Optional)</span>
        )}
      </Label>

      {icon ? (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none">
            {icon}
          </span>
          {enhancedChildren}
        </div>
      ) : (
        enhancedChildren
      )}

      {/* Error message */}
      {hasError && (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {/* Valid checkmark — only for fields that opt in */}
      {isValid && (
        <p className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Looks good
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FormAlert — prominent red banner shown at the top of a form on submit error
// ---------------------------------------------------------------------------

interface FormAlertProps {
  /** Main heading (e.g. "Registration failed") */
  title?: string;
  /** Body message */
  message?: string;
  /** Show the alert */
  show: boolean;
}

export function FormAlert({ title, message, show }: FormAlertProps) {
  if (!show) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800/50 dark:bg-red-900/20"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
      <div className="min-w-0">
        {title && (
          <p className="text-sm font-medium text-red-900 dark:text-red-100">{title}</p>
        )}
        {message && (
          <p className="text-xs text-red-700 dark:text-red-300 mt-0.5 leading-relaxed">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
