"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Building2, UserCheck, Briefcase } from "lucide-react";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { StudentRegisterForm } from "@/components/auth/StudentRegisterForm";
import { CollegeRegisterForm } from "@/components/auth/CollegeRegisterForm";
import { MentorRegisterForm } from "@/components/auth/MentorRegisterForm";
import { EmployerRegisterForm } from "@/components/auth/EmployerRegisterForm";

const roleConfig = {
  student: {
    icon: GraduationCap,
    title: "Student Portal",
    subtitle: "Access your learning dashboard",
    redirectPath: "/student",
    RegisterForm: StudentRegisterForm,
  },
  college: {
    icon: Building2,
    title: "College Portal",
    subtitle: "Manage your campus partnership",
    redirectPath: "/college",
    RegisterForm: CollegeRegisterForm,
  },
  mentor: {
    icon: UserCheck,
    title: "Mentor Portal",
    subtitle: "Share your expertise & mentor students",
    redirectPath: "/mentor",
    RegisterForm: MentorRegisterForm,
  },
  employer: {
    icon: Briefcase,
    title: "Employer Portal",
    subtitle: "Hire job-ready tech talent",
    redirectPath: "/employer",
    RegisterForm: EmployerRegisterForm,
  },
} as const;

const otherRoles = {
  student: ["college", "mentor", "employer"],
  college: ["student", "mentor", "employer"],
  mentor: ["student", "college", "employer"],
  employer: ["student", "college", "mentor"],
} as const;

const roleLabels = {
  student: "Student",
  college: "College",
  mentor: "Mentor",
  employer: "Employer",
} as const;

export default function LoginPage({ params }: { params: Promise<{ role: string }> }) {
  const { role: roleParam } = use(params);
  const role = roleParam as keyof typeof roleConfig;
  const config = roleConfig[role];

  if (!config) {
    notFound();
  }

  const { icon: Icon, title, subtitle, redirectPath, RegisterForm } = config;

  return (
    <AuthPageLayout icon={Icon} title={title} subtitle={subtitle}>
      <Card className="border-border/50 shadow-lg">
        <Tabs defaultValue="login">
          <CardHeader className="pb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">
                {role === "mentor" ? "Apply" : "Register"}
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value="login" className="mt-0">
              <LoginForm role={role} redirectPath={redirectPath} />
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <RegisterForm />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <p className="text-center text-xs text-muted-foreground mt-6">
        Not a {roleLabels[role].toLowerCase()}?{" "}
        {otherRoles[role].map((otherRole, index) => (
          <span key={otherRole}>
            {index > 0 && " · "}
            <Link
              href={`/login/${otherRole}`}
              className="text-primary hover:underline"
            >
              {roleLabels[otherRole as keyof typeof roleLabels]} Login
            </Link>
          </span>
        ))}
      </p>
    </AuthPageLayout>
  );
}
