"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Section from "@/components/ui/section";
import { DataCard } from "@/components/ui/data-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { GoogleMap } from "@/components/contact/GoogleMap";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    details: "info@growthcraft.in",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: "+91-9395303089",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: "43, JB Road, Kanwachal, Silpukhuri, Guwahati, Assam 781005",
  },
  {
    icon: Clock,
    title: "Response Time",
    details: "We respond within 24 hours on business days.",
  },
];

const faqs = [
  {
    q: "How quickly will I get a response?",
    a: "We respond to all enquiries within 24 hours on business days.",
  },
  {
    q: "Can I visit your office?",
    a: "Yes! Walk-ins are welcome Mon–Sat, 9 AM – 6 PM.",
  },
  {
    q: "I have a partnership enquiry. Who should I contact?",
    a: 'Use the form and select "College" or "Employer" as your role. Our partnerships team will reach out.',
  },
  {
    q: "Do you offer phone support?",
    a: "Yes. Call us at +91-9395303089 during business hours.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <Section variant="white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Talk to <span className="text-magenta">us</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond within 24 hours.
          </p>
        </div>
      </Section>

      {/* Form + Info */}
      <Section variant="marble">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            <h2 className="text-xl font-bold mb-6">Send us a message</h2>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-bold mb-6">Contact information</h2>
            <div className="space-y-4 mb-8">
              {contactInfo.map((info) => (
                <DataCard key={info.title}>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-lavender/10 text-lavender">
                      <info.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{info.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {info.details}
                      </p>
                    </div>
                  </div>
                </DataCard>
              ))}
            </div>

            {/* Google Map */}
            <GoogleMap />
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section variant="white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8">
          Common questions
        </h2>
        <Accordion type="single" collapsible className="max-w-2xl space-y-2">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border rounded-lg px-4 bg-card"
            >
              <AccordionTrigger className="text-sm font-semibold">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      {/* Final CTA */}
      <Section variant="graphite">
        <div className="text-center py-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Prefer a call?
          </h2>
          <p className="text-white/60 mb-6">
            Ring us at +91-9395303089 during business hours.
          </p>
          <Button
            asChild
            className="bg-magenta text-white hover:bg-magenta/90"
            size="lg"
          >
            <a href="tel:+919395303089">Call Now</a>
          </Button>
        </div>
      </Section>
    </>
  );
}
