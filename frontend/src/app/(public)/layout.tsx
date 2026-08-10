import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { RoleConflictListener } from "@/components/auth/RoleConflictListener";
import { LAUNCH_CONFIG } from "@/config/launch.config";
import { ComingSoonModal } from "@/components/public/ComingSoonModal";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isComingSoon = LAUNCH_CONFIG.IS_COMING_SOON_MODE;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-20">{children}</main>
      <Footer />
      <RoleConflictListener />
      {isComingSoon && <ComingSoonModal />}
    </div>
  );
}
