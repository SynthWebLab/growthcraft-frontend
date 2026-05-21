"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck } from "lucide-react";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { MentorRegisterForm } from "@/components/auth/MentorRegisterForm";

function MentorAuthContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const isLoginPage = pathname.includes("/login") || searchParams.get("tab") === "login";
  const defaultTab = isLoginPage ? "login" : "register";

  return (
    <AuthPageLayout
      icon={UserCheck}
      title="Mentor Portal"
      subtitle="Share your expertise & mentor students"
    >
      <Card className="border-border/50 shadow-lg">
        <Tabs defaultValue={defaultTab}>
          <CardHeader className="pb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Apply</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value="login" className="mt-0">
              <LoginForm role="mentor" redirectPath="/mentor" />
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <MentorRegisterForm />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <p className="text-center text-xs text-muted-foreground mt-6">
        Not a mentor?{" "}
        <Link href="/register/student" className="text-primary hover:underline">
          Student Login
        </Link>{" "}
        ·{" "}
        <Link href="/register/college" className="text-primary hover:underline">
          College Login
        </Link>{" "}
        ·{" "}
        <Link href="/register/employer" className="text-primary hover:underline">
          Employer Login
        </Link>
      </p>
    </AuthPageLayout>
  );
}

export default function MentorAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MentorAuthContent />
    </Suspense>
  );
}
