"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSubmitCollegeSupport } from "@/hooks/queries/useCollege";

const SupportQueryForm = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { mutate, isPending } = useSubmitCollegeSupport();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      toast.error("Missing details", {
        description: "Please add a subject and a message before sending.",
      });
      return;
    }

    mutate(
      { subject, message },
      {
        onSuccess: () => {
          setSubject("");
          setMessage("");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
      <Input
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="text-xs sm:text-sm h-10 focus-visible:ring-magenta rounded-xl"
      />
      <Textarea
        placeholder="Describe your issue or question..."
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="text-xs sm:text-sm focus-visible:ring-magenta rounded-xl p-3 sm:p-4"
      />
      <Button
        type="submit"
        disabled={isPending}
        className="bg-magenta hover:bg-magenta/90 text-white w-full sm:w-auto h-10 rounded-xl font-semibold px-5"
      >
        {isPending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
};

export default SupportQueryForm;
