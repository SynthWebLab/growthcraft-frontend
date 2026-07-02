"use client";

import { Suspense } from "react";
export const dynamic = "force-dynamic";
import { usePathname, useSearchParams } from "next/navigation";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap } from "lucide-react";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { StudentRegisterForm } from "@/components/auth/StudentRegisterForm";

function StudentAuthContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Check if URL contains "login" or has tab=login parameter
  const isLoginPage = pathname.includes("/login") || searchParams.get("tab") === "login";
  const defaultTab = isLoginPage ? "login" : "register";
  
  // Get callbackUrl from search params
  const callbackUrl = searchParams.get("callbackUrl") || undefined;

  return (
    <AuthPageLayout
      icon={GraduationCap}
      title="Student Portal"
      subtitle="Access your learning dashboard"
      expectedRole="student"
    >
      <Card className="border-border/50 shadow-lg">
        <Tabs defaultValue={defaultTab}>
          <CardHeader className="pb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value="login" className="mt-0">
              <LoginForm role="student" redirectPath="/student" callbackUrl={callbackUrl} />
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <StudentRegisterForm callbackUrl={callbackUrl} />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <p className="text-center text-xs text-muted-foreground mt-6">
        Not a student?{" "}
        <Link href="/register/college" className="text-primary hover:underline">
          College Login
        </Link>{" "}
        ·{" "}
        <Link href="/register/mentor" className="text-primary hover:underline">
          Mentor Login
        </Link>{" "}
        ·{" "}
        <Link href="/register/employer" className="text-primary hover:underline">
          Employer Login
        </Link>
      </p>
    </AuthPageLayout>
  );
}

export default function StudentAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudentAuthContent />
    </Suspense>
  );
}
