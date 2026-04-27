"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Building2, User, Mail, ArrowRight, Phone, Globe, Lock, Eye, EyeOff } from "lucide-react";
import { employerRegisterSchema, type EmployerRegisterFormData } from "@/lib/validations/auth-forms.schema";
import { useRegister } from "@/hooks/queries/useAuthentication";
import { EMPLOYER_INDUSTRY_OPTIONS, COMPANY_SIZE_OPTIONS } from "@/lib/constants/registration.constant";

export function EmployerRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EmployerRegisterFormData>({
    resolver: zodResolver(employerRegisterSchema),
    mode: "onChange", // Validate on every change
  });

  const onSubmit = async (data: EmployerRegisterFormData) => {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reg-company">Company Name</Label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="reg-company"
            placeholder="Acme Technologies"
            className="pl-10"
            {...register("company")}
          />
        </div>
        {errors.company && <p className="text-sm text-destructive">{errors.company.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="reg-name">Contact Person</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="reg-name" placeholder="Jane Doe" className="pl-10" {...register("contactPerson")} />
          </div>
          {errors.contactPerson && <p className="text-sm text-destructive">{errors.contactPerson.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-industry">Industry</Label>
          <Controller
            name="industry"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
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
          {errors.industry && <p className="text-sm text-destructive">{errors.industry.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-email">Official Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="reg-email"
            type="email"
            placeholder="hr@company.com"
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
          <Label htmlFor="reg-size">Company Size</Label>
          <Controller
            name="companySize"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-50">1-50</SelectItem>
                  <SelectItem value="51-200">51-200</SelectItem>
                  <SelectItem value="201-500">201-500</SelectItem>
                  <SelectItem value="500+">500+</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.companySize && <p className="text-sm text-destructive">{errors.companySize.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-website">Website (Optional)</Label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="reg-website" placeholder="https://company.com" className="pl-10" {...register("website")} />
        </div>
        {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-needs">Hiring Needs (Optional)</Label>
        <Textarea
          id="reg-needs"
          placeholder="What roles are you looking to fill?"
          rows={2}
          {...register("hiringNeeds")}
        />
        {errors.hiringNeeds && <p className="text-sm text-destructive">{errors.hiringNeeds.message}</p>}
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
        {isSubmitting || registerMutation.isPending ? "Creating account…" : "Register Company"}
        {!isSubmitting && !registerMutation.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    </form>
  );
}
