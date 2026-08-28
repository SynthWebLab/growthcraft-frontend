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
  User,
  Mail,
  ArrowRight,
  Phone,
  Briefcase,
  Award,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  mentorRegisterSchema,
  type MentorRegisterFormData,
} from "@/lib/validations/auth-forms.schema";
import { useRegister } from "@/hooks/queries/useAuthentication";
import { MENTOR_EXPERTISE_OPTIONS } from "@/lib/constants/registration.constant";
import { FormField, FormAlert } from "./FormField";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { MESSAGES, sanitizePhone } from "@/lib/validations/validators";

export function MentorRegisterForm() {
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
  } = useForm<MentorRegisterFormData>({
    resolver: zodResolver(mentorRegisterSchema),
    mode: "onChange",
  });

  const passwordValue = watch("password") || "";

  const onSubmit = (data: MentorRegisterFormData) => {
    registerMutation.mutate({
      fullName: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: "mentor",
      mentorData: {
        experienceYears: parseInt(data.experience, 10),
        areaOfExpertise: data.expertise,
        currentOrganization: data.company,
        bio: data.bio,
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

      {/* Phone & Experience */}
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
          id="reg-experience"
          label="Experience (Years)"
          error={errors.experience?.message}
          touched={!!touchedFields.experience}
          icon={<Award className="h-4 w-4" />}
        >
          <Input
            id="reg-experience"
            type="text"
            inputMode="numeric"
            placeholder="5"
            className="pl-10"
            {...register("experience", {
              onChange: (e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
                setValue("experience", e.target.value, { shouldValidate: true });
              },
            })}
          />
        </FormField>
      </div>

      {/* Area of Expertise */}
      <FormField
        id="reg-expertise"
        label="Area of Expertise"
        error={errors.expertise?.message}
        touched={!!touchedFields.expertise}
      >
        <Controller
          name="expertise"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="reg-expertise">
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                {MENTOR_EXPERTISE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      {/* Current Organization */}
      <FormField
        id="reg-company"
        label="Current Organization"
        error={errors.company?.message}
        touched={!!touchedFields.company}
        icon={<Briefcase className="h-4 w-4" />}
      >
        <Input
          id="reg-company"
          placeholder="Company / Freelancer"
          className="pl-10"
          autoComplete="organization"
          {...register("company")}
        />
      </FormField>

      {/* Short Bio */}
      <FormField
        id="reg-bio"
        label="Short Bio"
        error={errors.bio?.message}
        touched={!!touchedFields.bio}
      >
        <Textarea
          id="reg-bio"
          placeholder="Tell us about your experience..."
          rows={3}
          {...register("bio")}
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
          ? "Submitting\u2026"
          : "Apply as Mentor"}
        {!isSubmitting && !registerMutation.isPending && (
          <ArrowRight className="ml-2 h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
