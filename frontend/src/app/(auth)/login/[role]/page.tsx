"use client";

import { use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Building2, UserCheck, Briefcase, CheckCircle, Info } from "lucide-react";
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

function LoginPageContent({ role }: { role: keyof typeof roleConfig }) {
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");
  const registered = searchParams.get("registered");
  const callbackUrl = searchParams.get("callbackUrl");
  
  const config = roleConfig[role];
  const { icon: Icon, title, subtitle, redirectPath, RegisterForm } = config;

  return (
    <AuthPageLayout icon={Icon} title={title} subtitle={subtitle}>
      {/* Success message after email verification */}
      {verified && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              Email verified successfully!
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              You can now login to your account.
            </p>
          </div>
        </div>
      )}

      {/* Info message after registration */}
      {registered && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Please verify your email first
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Check your inbox for the verification code.
            </p>
          </div>
        </div>
      )}

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
              <LoginForm role={role} redirectPath={redirectPath} callbackUrl={callbackUrl || undefined} />
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

export default function LoginPage({ params }: { params: Promise<{ role: string }> }) {
  const { role: roleParam } = use(params);
  const role = roleParam as keyof typeof roleConfig;
  const config = roleConfig[role];

  if (!config) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent role={role} />
    </Suspense>
  );
}
