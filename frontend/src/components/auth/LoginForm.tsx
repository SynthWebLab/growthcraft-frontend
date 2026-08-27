"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth-forms.schema";
import { useLogin } from "@/hooks/queries/useAuthentication";
import Link from "next/link";
import { FormField, FormAlert } from "./FormField";
import { MESSAGES } from "@/lib/validations/validators";

interface LoginFormProps {
  role: string;
  redirectPath: string;
  callbackUrl?: string;
}

export function LoginForm({ role, redirectPath, callbackUrl }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  // Pass setError as callback so useLogin can show inline error for wrong-portal logins
  const loginMutation = useLogin(role, callbackUrl, (message: string) => {
    setError("root", { message });
  });

  const onSubmit = (data: LoginFormData) => {
    clearErrors("root");
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  const onInvalid = () => {
    setSubmitAttempted(true);
    if (formRef.current) {
      const firstInvalid = formRef.current.querySelector<HTMLElement>(
        "[aria-invalid='true']",
      );
      firstInvalid?.focus();
    }
  };

  // Parse the portal path from the error message (format: "...portal: /login/college")
  const rootErrorMsg = errors.root?.message ?? "";
  const portalPathMatch = rootErrorMsg.match(/portal: (\/login\/\w+)/);
  const correctPortalPath = portalPathMatch?.[1] ?? null;
  const displayError = correctPortalPath
    ? rootErrorMsg.replace(`: ${correctPortalPath}`, "")
    : rootErrorMsg;

  const hasFormErrors = submitAttempted && Object.keys(errors).length > 0 && !errors.root;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="space-y-4"
      noValidate
    >
      {/* Form-level validation alert */}
      <FormAlert show={hasFormErrors} message={MESSAGES.FORM_HAS_ERRORS} />

      {/* Inline wrong-portal error panel */}
      {errors.root && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800/50 dark:bg-amber-900/20">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
              Wrong Portal
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5 leading-relaxed">
              {displayError}
            </p>
            {correctPortalPath && (
              <Link
                href={correctPortalPath}
                className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-900 underline underline-offset-2 dark:text-amber-300 dark:hover:text-amber-200"
              >
                Go to correct portal
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Email */}
      <FormField
        id="login-email"
        label="Email"
        error={errors.email?.message}
        touched={!!touchedFields.email}
        icon={<Mail className="h-4 w-4" />}
      >
        <Input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          className="pl-10"
          autoComplete="email"
          {...register("email")}
        />
      </FormField>

      {/* Password */}
      <FormField
        id="login-password"
        label="Password"
        error={errors.password?.message}
        touched={!!touchedFields.password}
        icon={<Lock className="h-4 w-4" />}
      >
        <Input
          id="login-password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          className="pl-10 pr-10"
          autoComplete="current-password"
          {...register("password")}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </FormField>

      <div className="flex justify-end">
        <a
          href="/forgot-password"
          className="text-xs text-primary hover:underline"
        >
          Forgot password?
        </a>
      </div>

      {/* Server error */}
      <FormAlert
        show={loginMutation.isError && !errors.root}
        title={MESSAGES.LOGIN_FAILED}
        message={
          loginMutation.error?.message ||
          "Please check your credentials and try again"
        }
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || loginMutation.isPending}
      >
        {isSubmitting || loginMutation.isPending
          ? "Signing in\u2026"
          : "Sign In"}
        {!isSubmitting && !loginMutation.isPending && (
          <ArrowRight className="ml-2 h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
