import type { Metadata } from "next";
import { SyncComingSoonPage } from "@/components/public/SyncComingSoonPage";

export const metadata: Metadata = {
  title: "COMING SOON — GrowthCraft & SYNC 2026 Launch",
  description:
    "GrowthCraft is launching soon at SYNC 2026 — Northeast India's Product & Community Meet. Live in Guwahati on Aug 16, 2026.",
};

export default function ComingSoonPage() {
  return <SyncComingSoonPage />;
}
