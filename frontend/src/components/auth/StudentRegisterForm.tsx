"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, ArrowRight, Lock, Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { studentRegisterSchema, type StudentRegisterFormData } from "@/lib/validations/auth-forms.schema";
import { useRegister } from "@/hooks/queries/useAuthentication";

export function StudentRegisterForm({ callbackUrl }: { callbackUrl?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref") || "";
  const registerMutation = useRegister(callbackUrl);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentRegisterFormData>({
    resolver: zodResolver(studentRegisterSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: StudentRegisterFormData) => {
    registerMutation.mutate({
      fullName: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: "student",
      referralCode: referralCode || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reg-name">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="reg-name"
            placeholder="John Doe"
            className="pl-10"
            {...register("name")}
          />
        </div>
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="reg-email"
            type="email"
            placeholder="you@example.com"
            className="pl-10"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-phone">Phone</Label>
        <Input
          id="reg-phone"
          type="tel"
          placeholder="+91 98765 43210"
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 pr-10"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {registerMutation.isError && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive font-medium">Registration failed</p>
          <p className="text-xs text-destructive/80 mt-1">
            {registerMutation.error?.message || "Please check your information and try again"}
          </p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting || registerMutation.isPending}>
        {isSubmitting || registerMutation.isPending ? "Creating account…" : "Create Account"}
        {!isSubmitting && !registerMutation.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    </form>
  );
}
