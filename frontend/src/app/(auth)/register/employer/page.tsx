"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase } from "lucide-react";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { EmployerRegisterForm } from "@/components/auth/EmployerRegisterForm";

function EmployerAuthContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const isLoginPage = pathname.includes("/login") || searchParams.get("tab") === "login";
  const defaultTab = isLoginPage ? "login" : "register";

  return (
    <AuthPageLayout
      icon={Briefcase}
      title="Employer Portal"
      subtitle="Hire job-ready tech talent"
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
              <LoginForm role="employer" redirectPath="/employer" />
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <EmployerRegisterForm />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <p className="text-center text-xs text-muted-foreground mt-6">
        Not an employer?{" "}
        <Link href="/register/student" className="text-primary hover:underline">
          Student Login
        </Link>{" "}
        ·{" "}
        <Link href="/register/college" className="text-primary hover:underline">
          College Login
        </Link>{" "}
        ·{" "}
        <Link href="/register/mentor" className="text-primary hover:underline">
          Mentor Login
        </Link>
      </p>
    </AuthPageLayout>
  );
}

export default function EmployerAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmployerAuthContent />
    </Suspense>
  );
}
