"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";

interface ContactFormData {
  name: string;
  email: string;
  role: string;
  subject: string;
  message: string;
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    role: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.role || !formData.subject || !formData.message) {
      toast.error("Missing fields", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email", {
        description: "Please enter a valid email address.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare payload
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        subject: formData.subject,
        message: formData.message,
        source: "contact",
      };

      // Post to API
      await apiClient.post("/leads", payload);

      // Success
      setIsSuccess(true);
      toast.success("Message sent!", {
        description: "We'll get back to you within 24 hours.",
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          role: "",
          subject: "",
          message: "",
        });
        setIsSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error("Contact form error:", error);
      toast.error("Something went wrong", {
        description: error.response?.data?.error?.message || error.message || "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          placeholder="Your Name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={isSubmitting || isSuccess}
          required
        />
        <Input
          type="email"
          placeholder="Email Address *"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={isSubmitting || isSuccess}
          required
        />
      </div>

      <Select
        value={formData.role}
        onValueChange={(v) => setFormData({ ...formData, role: v })}
        disabled={isSubmitting || isSuccess}
      >
        <SelectTrigger>
          <SelectValue placeholder="I am a... *" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Student">Student</SelectItem>
          <SelectItem value="College">College</SelectItem>
          <SelectItem value="Mentor">Mentor</SelectItem>
          <SelectItem value="HiringPartner">Hiring Partner</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Subject *"
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        disabled={isSubmitting || isSuccess}
        required
      />

      <Textarea
        placeholder="Your Message *"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        rows={6}
        disabled={isSubmitting || isSuccess}
        required
      />

      <Button
        type="submit"
        className="bg-magenta text-white hover:bg-magenta/90"
        size="lg"
        disabled={isSubmitting || isSuccess}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Sent Successfully!
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}
