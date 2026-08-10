"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSubmitSupport } from "@/hooks/queries/useStudent";

const faqs = [
  {
    q: "How do I access my course materials?",
    a: "Go to 'My Courses', click on any enrolled course, and you'll find all lessons, videos, and resources.",
  },
  {
    q: "How are certificates issued?",
    a: "Certificates are automatically generated once you complete 100% of a course and pass the final assessment.",
  },
  {
    q: "Can I download videos for offline viewing?",
    a: "Currently offline downloads are not supported. We recommend using a stable internet connection.",
  },
  {
    q: "How do I reset my password?",
    a: "Click on 'Forgot Password' on the login page and follow the email instructions.",
  },
];

export default function StudentSupportPage() {
  const submitSupport = useSubmitSupport();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSupport.mutate(
      { subject, message },
      {
        onSuccess: (res) => {
          if (res.success) {
            setSubject("");
            setMessage("");
          }
        },
      }
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Help & Support
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Get answers to your questions and contact the helpdesk.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 items-start">
        {/* FAQs */}
        <Card className="border-border/60">
          <CardHeader className="p-4 sm:p-6 pb-2">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-magenta" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-xs sm:text-sm text-left font-semibold">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="border-border/60">
          <CardHeader className="p-4 sm:p-6 pb-2">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-magenta" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm font-semibold text-slate-700">Subject</Label>
                <Input
                  placeholder="What do you need help with?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="text-xs sm:text-sm h-10 sm:h-11 focus-visible:ring-magenta rounded-xl"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm font-semibold text-slate-700">Message</Label>
                <Textarea
                  placeholder="Describe your issue in detail…"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="text-xs sm:text-sm p-3 sm:p-4 focus-visible:ring-magenta rounded-xl resize-none"
                  required
                />
              </div>
              <Button type="submit" disabled={submitSupport.isPending} className="bg-magenta hover:bg-magenta/90 text-white font-semibold text-xs sm:text-sm w-full sm:w-auto h-10 rounded-xl px-5">
                {submitSupport.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
