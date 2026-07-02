"use client";

import { Suspense } from "react";
export const dynamic = "force-dynamic";
import { usePathname, useSearchParams } from "next/navigation";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2 } from "lucide-react";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { CollegeRegisterForm } from "@/components/auth/CollegeRegisterForm";

function CollegeAuthContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const isLoginPage = pathname.includes("/login") || searchParams.get("tab") === "login";
  const defaultTab = isLoginPage ? "login" : "register";

  return (
    <AuthPageLayout
      icon={Building2}
      title="College Portal"
      subtitle="Manage your campus partnership"
      expectedRole="college"
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
              <LoginForm role="college" redirectPath="/college" />
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <CollegeRegisterForm />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <p className="text-center text-xs text-muted-foreground mt-6">
        Not a college?{" "}
        <Link href="/register/student" className="text-primary hover:underline">
          Student Login
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

export default function CollegeAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CollegeAuthContent />
    </Suspense>
  );
}
