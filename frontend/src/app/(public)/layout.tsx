import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { RoleConflictListener } from "@/components/auth/RoleConflictListener";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-20">{children}</main>
      <Footer />
      <RoleConflictListener />
    </div>
  );
}
