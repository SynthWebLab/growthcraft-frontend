"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  User,
  Mail,
  ArrowRight,
  Phone,
  Globe,
  MapPin,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  collegeRegisterSchema,
  type CollegeRegisterFormData,
} from "@/lib/validations/auth-forms.schema";
import { useRegister } from "@/hooks/queries/useAuthentication";
import { FormField, FormAlert } from "./FormField";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { MESSAGES, sanitizePhone } from "@/lib/validations/validators";

export function CollegeRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, touchedFields, dirtyFields },
  } = useForm<CollegeRegisterFormData>({
    resolver: zodResolver(collegeRegisterSchema),
    mode: "onChange",
  });

  const passwordValue = watch("password") || "";

  const onSubmit = (data: CollegeRegisterFormData) => {
    registerMutation.mutate({
      fullName: data.contactPerson,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: "college",
      collegeData: {
        institutionName: data.institution,
        contactPerson: data.contactPerson,
        designation: data.designation,
        officialEmail: data.email,
        phone: data.phone,
        city: data.city,
        state: data.state,
        website: data.website || undefined,
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

      {/* Institution Name */}
      <FormField
        id="reg-institution"
        label="Institution Name"
        error={errors.institution?.message}
        touched={!!touchedFields.institution}
        icon={<Building2 className="h-4 w-4" />}
      >
        <Input
          id="reg-institution"
          placeholder="ABC Engineering College"
          className="pl-10"
          autoComplete="organization"
          {...register("institution")}
        />
      </FormField>

      {/* Contact Person & Designation */}
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
            placeholder="Dr. Sharma"
            className="pl-10"
            autoComplete="name"
            {...register("contactPerson")}
          />
        </FormField>

        <FormField
          id="reg-designation"
          label="Designation"
          error={errors.designation?.message}
          touched={!!touchedFields.designation}
        >
          <Input
            id="reg-designation"
            placeholder="HOD / TPO"
            autoComplete="organization-title"
            {...register("designation")}
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
          placeholder="admin@college.edu"
          className="pl-10"
          autoComplete="email"
          {...register("email")}
        />
      </FormField>

      {/* Phone & City */}
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
          id="reg-city"
          label="City"
          error={errors.city?.message}
          touched={!!touchedFields.city}
          icon={<MapPin className="h-4 w-4" />}
        >
          <Input
            id="reg-city"
            placeholder="Guwahati"
            className="pl-10"
            autoComplete="address-level2"
            {...register("city")}
          />
        </FormField>
      </div>

      {/* State */}
      <FormField
        id="reg-state"
        label="State"
        error={errors.state?.message}
        touched={!!touchedFields.state}
      >
        <Input
          id="reg-state"
          placeholder="Assam"
          autoComplete="address-level1"
          {...register("state")}
        />
      </FormField>

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
          placeholder="https://college.edu"
          className="pl-10"
          autoComplete="url"
          {...register("website")}
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
          : "Register Institution"}
        {!isSubmitting && !registerMutation.isPending && (
          <ArrowRight className="ml-2 h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
