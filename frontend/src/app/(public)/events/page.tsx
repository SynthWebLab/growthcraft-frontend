"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PopupForm, usePopupForm } from "@/components/common/PopupForm";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkshopEvents } from "@/components/events/WorkshopEvents";
import { HackathonEvents } from "@/components/events/HackathonEvents";
import { BootcampEvents } from "@/components/events/BootcampEvents";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type EventTab = "bootcamps" | "workshops" | "hackathons";

function EventsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab") as EventTab | null;

  const { isOpen, formType, formTitle, courseId, courseTitle, itemType, price, openForm, closeForm } = usePopupForm();
  const [activeTab, setActiveTab] = useState<EventTab>(
    tabParam && (tabParam === "workshops" || tabParam === "bootcamps" || tabParam === "hackathons")
      ? tabParam
      : "bootcamps"
  );

  useEffect(() => {
    if (tabParam && (tabParam === "workshops" || tabParam === "bootcamps" || tabParam === "hackathons")) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (value: EventTab) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`/events?${params.toString()}`, { scroll: false });
  };

  const { data: user } = useCurrentUser();
  const isMentor = user?.role === "mentor";
  const isEmployer = user?.role === "employer";
  const isRestrictedRole = isMentor || isEmployer;

  return (
    <>
      <PopupForm
        isOpen={isOpen}
        onClose={closeForm}
        type={formType}
        title={formTitle}
        courseId={courseId}
        courseTitle={courseTitle}
        itemType={itemType}
        price={price}
      />

      <Section variant="white" className="!pb-0">
        <PageHeader
          breadcrumb={
            <span>
              <Link href="/" className="hover:text-magenta transition-colors">
                Home
              </Link>{" "}
              / Events
            </span>
          }
          title="Events & Bootcamps"
          description="Live interactive workshops, intensive offline bootcamps, and hackathons led by senior tech mentors."
        />

        <div className="mt-6 mb-2">
          <Tabs
            defaultValue="bootcamps"
            value={activeTab}
            onValueChange={(value) => handleTabChange(value as EventTab)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 gap-1 rounded-xl bg-muted p-1 sm:inline-flex sm:w-auto sm:gap-2 sm:p-1.5 shadow-xs">
              <TabsTrigger
                value="bootcamps"
                className="flex h-full items-center justify-center px-3 py-2 text-center text-xs sm:min-w-[140px] sm:px-5 sm:text-sm font-semibold rounded-lg transition-all"
              >
                Bootcamps
              </TabsTrigger>
              <TabsTrigger
                value="workshops"
                className="flex h-full items-center justify-center px-3 py-2 text-center text-xs sm:min-w-[140px] sm:px-5 sm:text-sm font-semibold rounded-lg transition-all"
              >
                Workshops
              </TabsTrigger>
              <TabsTrigger
                value="hackathons"
                className="flex h-full items-center justify-center px-3 py-2 text-center text-xs sm:min-w-[140px] sm:px-5 sm:text-sm font-semibold rounded-lg transition-all"
              >
                Hackathons
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Section>

      {activeTab === "bootcamps" && <BootcampEvents onOpenForm={openForm} enabled={activeTab === "bootcamps"} />}
      {activeTab === "workshops" && <WorkshopEvents onOpenForm={openForm} />}
      {activeTab === "hackathons" && <HackathonEvents onOpenForm={openForm} />}

      <Section variant="graphite" className="!py-12 sm:!py-16">
        <div className="text-center py-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Want us to notify you about new events?
          </h2>
          <p className="text-white/60 mb-6 max-w-lg mx-auto text-sm sm:text-base">
            Register your interest and we&apos;ll keep you updated on upcoming workshops, bootcamps, and hackathons.
          </p>
          <Button
            className="bg-magenta text-white hover:bg-magenta/90"
            size="lg"
            disabled={isRestrictedRole}
            onClick={() => {
              if (!isRestrictedRole) {
                openForm("register-interest", "Notify Me About Events");
              }
            }}
          >
            {isRestrictedRole ? "Students Only" : "Register Interest"}
          </Button>
        </div>
      </Section>
    </>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div>Loading events...</div>}>
      <EventsContent />
    </Suspense>
  );
}
