"use client";

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
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Help & Support
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Get answers to your questions
        </p>
      </div>

      {/* FAQs */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Contact Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input placeholder="What do you need help with?" />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Describe your issue in detail…"
                rows={4}
              />
            </div>
            <Button type="submit">Send Message</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
