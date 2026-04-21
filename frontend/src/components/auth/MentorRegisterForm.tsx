"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, ArrowRight, Phone, Briefcase, Award, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { mentorRegisterSchema, type MentorRegisterFormData } from "@/lib/validations/auth";

export function MentorRegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MentorRegisterFormData>({
    resolver: zodResolver(mentorRegisterSchema),
  });

  const onSubmit = async (data: MentorRegisterFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    toast.success("Application submitted!", {
      description: "Welcome to GrowthCraft Mentors.",
    });
    router.push("/mentor");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reg-name">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="reg-name" placeholder="John Doe" className="pl-10" {...register("name")} />
        </div>
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
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
          <Label htmlFor="reg-experience">Experience (Years)</Label>
          <div className="relative">
            <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="reg-experience"
              type="number"
              placeholder="5"
              className="pl-10"
              {...register("experience")}
            />
          </div>
          {errors.experience && <p className="text-sm text-destructive">{errors.experience.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-expertise">Area of Expertise</Label>
        <Controller
          name="expertise"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web-dev">Web Development</SelectItem>
                <SelectItem value="data-science">Data Science & AI</SelectItem>
                <SelectItem value="mobile">Mobile Development</SelectItem>
                <SelectItem value="devops">DevOps & Cloud</SelectItem>
                <SelectItem value="design">UI/UX Design</SelectItem>
                <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.expertise && <p className="text-sm text-destructive">{errors.expertise.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-company">Current Organization</Label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="reg-company"
            placeholder="Company / Freelancer"
            className="pl-10"
            {...register("company")}
          />
        </div>
        {errors.company && <p className="text-sm text-destructive">{errors.company.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-bio">Short Bio</Label>
        <Textarea
          id="reg-bio"
          placeholder="Tell us about your experience..."
          rows={3}
          {...register("bio")}
        />
        {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
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

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Apply as Mentor"}
        {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    </form>
  );
}
