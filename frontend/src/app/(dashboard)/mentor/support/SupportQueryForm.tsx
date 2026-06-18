"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const SupportQueryForm = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      toast.error("Missing details", {
        description: "Please add a subject and a message before sending.",
      });
      return;
    }

    setSubmitting(true);
    // No support endpoint yet — acknowledge the submission.
    toast.success("Message sent", {
      description: "Our mentor team will get back to you shortly.",
    });
    setSubject("");
    setMessage("");
    setSubmitting(false);
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
