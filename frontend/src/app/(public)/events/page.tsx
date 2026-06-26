"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PopupForm, usePopupForm } from "@/components/common/PopupForm";
import { Section } from "@/components/ui/section";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkshopEvents } from "@/components/events/WorkshopEvents";
import { HackathonEvents } from "@/components/events/HackathonEvents";
import { BootcampEvents } from "@/components/events/BootcampEvents";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type EventTab = "workshops" | "bootcamps" | "hackathons";

export default function EventsPage() {
  const { isOpen, formType, formTitle, courseId, courseTitle, itemType, openForm, closeForm } = usePopupForm();
  const [activeTab, setActiveTab] = useState<EventTab>("workshops");
  const { data: user } = useCurrentUser();
  const isMentor = user?.role === "mentor";

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
      />

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Tabs
          defaultValue="workshops"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as EventTab)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 gap-1 rounded-md bg-muted p-1 sm:inline-flex sm:w-auto sm:gap-2 sm:p-2">
            <TabsTrigger
              value="workshops"
              className="flex h-full items-center justify-center px-2 py-2 text-center text-xs leading-none sm:min-w-[9.375rem] sm:px-4 sm:text-sm"
            >
              Workshops
            </TabsTrigger>
            <TabsTrigger
              value="bootcamps"
              className="flex h-full items-center justify-center px-2 py-2 text-center text-xs leading-none sm:min-w-[9.375rem] sm:px-4 sm:text-sm"
            >
              Bootcamps
            </TabsTrigger>
            <TabsTrigger
              value="hackathons"
              className="flex h-full items-center justify-center px-2 py-2 text-center text-xs leading-none sm:min-w-[9.375rem] sm:px-4 sm:text-sm"
            >
              Hackathons
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === "workshops" && <WorkshopEvents onOpenForm={openForm} />}
      {activeTab === "bootcamps" && <BootcampEvents onOpenForm={openForm} enabled={activeTab === "bootcamps"} />}
      {activeTab === "hackathons" && <HackathonEvents onOpenForm={openForm} />}

      <Section variant="graphite">
        <div className="text-center py-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Want us to notify you about new events?
          </h2>
          <p className="text-white/60 mb-6">
            Register your interest and we&apos;ll keep you updated on upcoming workshops, bootcamps, and hackathons.
          </p>
          <Button
            className="bg-magenta text-white hover:bg-magenta/90"
            size="lg"
            disabled={isMentor}
            onClick={() => {
              if (!isMentor) {
                openForm("register-interest", "Notify Me About Events");
              }
            }}
          >
            {isMentor ? "Students Only" : "Register Interest"}
          </Button>
        </div>
      </Section>
    </>
  );
}
