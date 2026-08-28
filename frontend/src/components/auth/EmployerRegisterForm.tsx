"use client";

import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  User,
  Mail,
  ArrowRight,
  Phone,
  Globe,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  employerRegisterSchema,
  type EmployerRegisterFormData,
} from "@/lib/validations/auth-forms.schema";
import { useRegister } from "@/hooks/queries/useAuthentication";
import {
  EMPLOYER_INDUSTRY_OPTIONS,
  COMPANY_SIZE_OPTIONS,
} from "@/lib/constants/registration.constant";
import { FormField, FormAlert } from "./FormField";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { MESSAGES, sanitizePhone } from "@/lib/validations/validators";

export function EmployerRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting, touchedFields, dirtyFields },
  } = useForm<EmployerRegisterFormData>({
    resolver: zodResolver(employerRegisterSchema),
    mode: "onChange",
  });

  const passwordValue = watch("password") || "";

  const onSubmit = (data: EmployerRegisterFormData) => {
    registerMutation.mutate({
      fullName: data.contactPerson,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: "employer",
      employerData: {
        companyName: data.company,
        contactPerson: data.contactPerson,
        industry: data.industry,
        officialEmail: data.email,
        phone: data.phone,
        companySize: data.companySize,
        website: data.website || undefined,
        hiringNeeds: data.hiringNeeds || undefined,
      },
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

  const hasFormErrors = submitAttempted && Object.keys(errors).length > 0;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="space-y-4"
      noValidate
    >
      <FormAlert show={hasFormErrors} message={MESSAGES.FORM_HAS_ERRORS} />

      {/* Company Name */}
      <FormField
        id="reg-company"
        label="Company Name"
        error={errors.company?.message}
        touched={!!touchedFields.company}
        icon={<Building2 className="h-4 w-4" />}
      >
        <Input
          id="reg-company"
          placeholder="Acme Technologies"
          className="pl-10"
          autoComplete="organization"
          {...register("company")}
        />
      </FormField>

      {/* Contact Person & Industry */}
      <div className="grid grid-cols-2 gap-3">
        <FormField
          id="reg-name"
          label="Contact Person"
          error={errors.contactPerson?.message}
          touched={!!touchedFields.contactPerson}
          icon={<User className="h-4 w-4" />}
        >
          <Input
            id="reg-name"
            placeholder="Jane Doe"
            className="pl-10"
            autoComplete="name"
            {...register("contactPerson")}
          />
        </FormField>

        <FormField
          id="reg-industry"
          label="Industry"
          error={errors.industry?.message}
          touched={!!touchedFields.industry}
        >
          <Controller
            name="industry"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="reg-industry">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYER_INDUSTRY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      </div>

      {/* Official Email */}
      <FormField
        id="reg-email"
        label="Official Email"
        error={errors.email?.message}
        touched={!!touchedFields.email}
        icon={<Mail className="h-4 w-4" />}
      >
        <Input
          id="reg-email"
          type="email"
          placeholder="hr@company.com"
          className="pl-10"
          autoComplete="email"
          {...register("email")}
        />
      </FormField>

      {/* Phone & Company Size */}
      <div className="grid grid-cols-2 gap-3">
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

        <FormField
          id="reg-size"
          label="Company Size"
          error={errors.companySize?.message}
          touched={!!touchedFields.companySize}
        >
          <Controller
            name="companySize"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="reg-size">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_SIZE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      </div>

      {/* Website (Optional) */}
      <FormField
        id="reg-website"
        label="Website"
        optional
        error={errors.website?.message}
        touched={!!touchedFields.website}
        icon={<Globe className="h-4 w-4" />}
      >
        <Input
          id="reg-website"
          placeholder="https://company.com"
          className="pl-10"
          autoComplete="url"
          {...register("website")}
        />
      </FormField>

      {/* Hiring Needs (Optional) */}
      <FormField
        id="reg-needs"
        label="Hiring Needs"
        optional
        error={errors.hiringNeeds?.message}
        touched={!!touchedFields.hiringNeeds}
      >
        <Textarea
          id="reg-needs"
          placeholder="What roles are you looking to fill?"
          rows={2}
          {...register("hiringNeeds")}
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
          : "Register Company"}
        {!isSubmitting && !registerMutation.isPending && (
          <ArrowRight className="ml-2 h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
