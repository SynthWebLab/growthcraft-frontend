"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, ArrowRight, Lock, Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  studentRegisterSchema,
  type StudentRegisterFormData,
} from "@/lib/validations/auth-forms.schema";
import { useRegister } from "@/hooks/queries/useAuthentication";
import { FormField, FormAlert } from "./FormField";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { MESSAGES, sanitizePhone } from "@/lib/validations/validators";

export function StudentRegisterForm({ callbackUrl }: { callbackUrl?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref") || "";
  const registerMutation = useRegister(callbackUrl);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, touchedFields, dirtyFields },
  } = useForm<StudentRegisterFormData>({
    resolver: zodResolver(studentRegisterSchema),
    mode: "onChange",
  });

  const passwordValue = watch("password") || "";

  const onSubmit = (data: StudentRegisterFormData) => {
    registerMutation.mutate({
      fullName: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: "student",
      referralCode: referralCode || undefined,
    });
  };

  const onInvalid = () => {
    setSubmitAttempted(true);
    // Focus first invalid field
    if (formRef.current) {
      const firstInvalid = formRef.current.querySelector<HTMLElement>(
        "[aria-invalid='true']",
      );
      firstInvalid?.focus();
    }
  };

  const hasFormErrors = submitAttempted && Object.keys(errors).length > 0;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="space-y-4"
      noValidate
    >
      {/* Form-level error alert */}
      <FormAlert
        show={hasFormErrors}
        message={MESSAGES.FORM_HAS_ERRORS}
      />

      {/* Full Name */}
      <FormField
        id="reg-name"
        label="Full Name"
        error={errors.name?.message}
        touched={!!touchedFields.name}
        icon={<User className="h-4 w-4" />}
      >
        <Input
          id="reg-name"
          placeholder="John Doe"
          className="pl-10"
          autoComplete="name"
          {...register("name")}
        />
      </FormField>

      {/* Email */}
      <FormField
        id="reg-email"
        label="Email"
        error={errors.email?.message}
        touched={!!touchedFields.email}
        icon={<Mail className="h-4 w-4" />}
      >
        <Input
          id="reg-email"
          type="email"
          placeholder="you@example.com"
          className="pl-10"
          autoComplete="email"
          {...register("email")}
        />
      </FormField>

      {/* Phone */}
      <FormField
        id="reg-phone"
        label="Phone"
        error={errors.phone?.message}
        touched={!!touchedFields.phone}
        icon={<Phone className="h-4 w-4" />}
      >
        <Input
          id="reg-phone"
          type="tel"
          placeholder="+91 9876543210"
          className="pl-10"
          autoComplete="tel"
          inputMode="tel"
          {...register("phone", {
            onChange: (e) => {
              e.target.value = sanitizePhone(e.target.value);
              setValue("phone", e.target.value, { shouldValidate: true });
            },
          })}
        />
      </FormField>

      {/* Password */}
      <FormField
        id="reg-password"
        label="Password"
        error={errors.password?.message}
        touched={!!touchedFields.password}
        icon={<Lock className="h-4 w-4" />}
      >
        <Input
          id="reg-password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          className="pl-10 pr-10"
          autoComplete="new-password"
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

      {/* Password Strength Indicator */}
      <PasswordStrengthIndicator
        password={passwordValue}
        touched={!!dirtyFields.password}
      />

      {/* Confirm Password */}
      <FormField
        id="reg-confirm-password"
        label="Confirm Password"
        error={errors.confirmPassword?.message}
        touched={!!touchedFields.confirmPassword}
        icon={<Lock className="h-4 w-4" />}
      >
        <Input
          id="reg-confirm-password"
          type={showConfirm ? "text" : "password"}
          placeholder="••••••••"
          className="pl-10 pr-10"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={showConfirm ? "Hide password" : "Show password"}
        >
          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </FormField>

      {/* Server error */}
      <FormAlert
        show={registerMutation.isError}
        title={MESSAGES.REGISTRATION_FAILED}
        message={
          registerMutation.error?.message ||
          "Please check your information and try again"
        }
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || registerMutation.isPending}
      >
        {isSubmitting || registerMutation.isPending
          ? "Creating account\u2026"
          : "Create Account"}
        {!isSubmitting && !registerMutation.isPending && (
          <ArrowRight className="ml-2 h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
