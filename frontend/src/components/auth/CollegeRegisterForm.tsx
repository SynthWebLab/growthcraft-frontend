"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, User, Mail, ArrowRight, Phone, Globe, MapPin, Lock, Eye, EyeOff } from "lucide-react";
import { collegeRegisterSchema, type CollegeRegisterFormData } from "@/lib/validations/auth-forms.schema";
import { useRegister } from "@/hooks/queries/useAuthentication";

export function CollegeRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CollegeRegisterFormData>({
    resolver: zodResolver(collegeRegisterSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: CollegeRegisterFormData) => {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reg-institution">Institution Name</Label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="reg-institution"
            placeholder="ABC Engineering College"
            className="pl-10"
            {...register("institution")}
          />
        </div>
        {errors.institution && <p className="text-sm text-destructive">{errors.institution.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="reg-name">Contact Person</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="reg-name" placeholder="Dr. Sharma" className="pl-10" {...register("contactPerson")} />
          </div>
          {errors.contactPerson && <p className="text-sm text-destructive">{errors.contactPerson.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-designation">Designation</Label>
          <Input id="reg-designation" placeholder="HOD / TPO" {...register("designation")} />
          {errors.designation && <p className="text-sm text-destructive">{errors.designation.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-email">Official Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="reg-email"
            type="email"
            placeholder="admin@college.edu"
            className="pl-10"
            {...register("email")}
          />
        </div>
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="reg-phone">Phone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="reg-phone"
              type="tel"
              placeholder="+91 98765 43210"
              className="pl-10"
              {...register("phone")}
            />
          </div>
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-city">City</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="reg-city" placeholder="Guwahati" className="pl-10" {...register("city")} />
          </div>
          {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-state">State</Label>
        <Input id="reg-state" placeholder="Assam" {...register("state")} />
        {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-website">Website (Optional)</Label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="reg-website" placeholder="https://college.edu" className="pl-10" {...register("website")} />
        </div>
        {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
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
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
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
        {isSubmitting || registerMutation.isPending ? "Creating account…" : "Register Institution"}
        {!isSubmitting && !registerMutation.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    </form>
  );
}
