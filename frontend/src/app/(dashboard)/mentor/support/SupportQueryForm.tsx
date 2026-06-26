"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSubmitMentorSupport } from "@/hooks/queries/useMentor";

const SupportQueryForm = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { mutate: submitSupport, isPending: submitting } = useSubmitMentorSupport();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      toast.error("Missing details", {
        description: "Please add a subject and a message before sending.",
      });
      return;
    }

    submitSupport(
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <Textarea
        placeholder="Describe your issue..."
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button type="submit" disabled={submitting}>
        Send Message
      </Button>
    </form>
  );
};

export default SupportQueryForm;
