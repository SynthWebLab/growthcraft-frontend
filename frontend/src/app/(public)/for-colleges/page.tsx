"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Section from "@/components/ui/section";
import { DataCard } from "@/components/ui/data-card";
import { PopupForm, usePopupForm } from "@/components/common/PopupForm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { School, AlertTriangle, BookOpen, Users, Award, ArrowRight, Check, Minus } from "lucide-react";

const pains = [
  { icon: AlertTriangle, text: "Students graduate without industry-ready skills." },
  { icon: AlertTriangle, text: "Placement rates are dropping every year." },
  { icon: AlertTriangle, text: "Faculty lack exposure to modern tech stacks." },
];

const solutions = [
  { 
    icon: BookOpen, 
    title: "Custom Curriculum", 
    desc: "Industry-aligned courses designed for your campus. We adapt to your semester calendar." 
  },
  { 
    icon: Users, 
    title: "Expert Mentors", 
    desc: "Our engineers conduct live workshops and project sprints with your students." 
  },
  { 
    icon: Award, 
    title: "Placement Pipeline", 
    desc: "Direct access to 100+ hiring partners. We don't just train — we place." 
  },
];

const tiers = [
  { 
    name: "Silver", 
    students: "Up to 50", 
    mentorSessions: "4/month", 
    brandedPortal: false, 
    spoc: false, 
    placement: true, 
    analytics: false 
  },
  { 
    name: "Gold", 
    students: "Up to 150", 
    mentorSessions: "12/month", 
    brandedPortal: true, 
    spoc: true, 
    placement: true, 
    analytics: false 
  },
  { 
    name: "Platinum", 
    students: "Unlimited", 
    mentorSessions: "Unlimited", 
    brandedPortal: true, 
    spoc: true, 
    placement: true, 
    analytics: true 
  },
];

const testimonials = [
  { 
    name: "Dr. Anu Sharma", 
    role: "Dean, CSE", 
    org: "NIT Silchar", 
    quote: "GrowthCraft transformed our campus placement numbers. 40% improvement in first year.", 
    photo: "anu" 
  },
  { 
    name: "Prof. Rajiv Kapoor", 
    role: "HOD, IT", 
    org: "Tezpur University", 
    quote: "The quality of workshops is on par with what top IITs offer.", 
    photo: "rajiv" 
  },
  { 
    name: "Dr. Meena Das", 
    role: "Principal", 
    org: "Assam Engineering College", 
    quote: "Our students now compete for roles at product companies, not just service firms.", 
    photo: "meena" 
  },
];

const faqs = [
  { 
    q: "What's the minimum batch size?", 
    a: "We recommend at least 30 students per cohort for optimal economics, but we're flexible." 
  },
  { 
    q: "Can we customize the curriculum?", 
    a: "Absolutely. Gold and Platinum tiers include full curriculum customization." 
  },
  { 
    q: "How do you handle assessments?", 
    a: "We provide project-based assessments, code reviews, and mock interviews." 
  },
  { 
    q: "What's the partnership duration?", 
    a: "Minimum 6 months. Most partners renew for 2+ years." 
  },
  { 
    q: "Do you provide certificates?", 
    a: "Yes. Co-branded certificates for students and institutional partnership certificates for the college." 
  },
];

const ForColleges = () => {
  const { isOpen, formType, formTitle, openForm, closeForm } = usePopupForm();

  return (
    <>
      <PopupForm isOpen={isOpen} onClose={closeForm} type={formType} title={formTitle} />

      {/* 1. Hero */}
      <Section variant="white">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-afacad text-muted-foreground uppercase tracking-wide mb-4">
              GrowthCraft Campus
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Industry-ready graduates, taught on your{" "}
<span className="font-script text-magenta">campus</span>            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Partner with GrowthCraft to bring live workshops, bootcamps, and placement pipelines 
              directly to your institution.
            </p>
            <Button className="bg-magenta text-white hover:bg-magenta/90" size="lg" asChild>
              <Link href="/register/college">
                Partner With Us <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md p-8 rounded-2xl bg-marble border border-border text-center">
              <School className="h-16 w-16 mx-auto text-lavender mb-4" />
              <p className="text-lg font-bold">50+ colleges trust us</p>
              <p className="text-sm text-muted-foreground">across Northeast India</p>
            </div>
          </div>
        </div>
      </Section>

      {/* 2. Pain */}
      <Section variant="marble">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8">
          The problem your campus faces today
        </h2>
        <div className="space-y-4">
          {pains.map((p, i) => (
            <div key={i} className="flex items-start gap-3">
              <p.icon className="h-5 w-5 text-lavender mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 3. Solutions */}
      <Section variant="white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8">How GrowthCraft solves it</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {solutions.map((s) => (
            <DataCard key={s.title}>
              <s.icon className="h-8 w-8 text-lavender mb-4" />
              <h3 className="font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </DataCard>
          ))}
        </div>
      </Section>

      {/* 4. Partnership Tiers */}
      <Section variant="graphite">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Partnership tiers</h2>
        <p className="text-white/60 mb-8">Choose the plan that fits your institution.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <DataCard key={tier.name} variant="dark" className="border border-white/10">
              <h3 className="text-xl font-extrabold text-white mb-4">{tier.name}</h3>
              <div className="space-y-3 text-sm">
                <Row label="Students per cohort" value={tier.students} />
                <Row label="Mentor sessions" value={tier.mentorSessions} />
                <BoolRow label="Branded portal" val={tier.brandedPortal} />
                <BoolRow label="Dedicated SPOC" val={tier.spoc} />
                <BoolRow label="Placement support" val={tier.placement} />
                <BoolRow label="Analytics dashboard" val={tier.analytics} />
              </div>
              <Button
                className="w-full mt-6 bg-magenta text-white hover:bg-magenta/90"
                onClick={() => openForm("partner", `${tier.name} Partnership`)}
              >
                Get Started
              </Button>
            </DataCard>
          ))}
        </div>
      </Section>

      {/* 5. Testimonials */}
      <Section variant="white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8">What our partners say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <DataCard key={t.name}>
              <p className="text-sm text-muted-foreground mb-4 italic">&quot;{t.quote}&quot;</p>
              <div className="flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.photo}`}
                  alt={t.name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.role}, {t.org}
                  </p>
                </div>
              </div>
            </DataCard>
          ))}
        </div>
      </Section>

      {/* 6. FAQ */}
      <Section variant="marble">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="max-w-2xl space-y-2">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border rounded-lg px-4 bg-card"
            >
              <AccordionTrigger className="text-sm font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      {/* 7. Final CTA */}
      <Section variant="graphite">
        <div className="text-center py-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Ready to transform your campus?
          </h2>
          <p className="text-white/60 mb-6">
            Schedule a call with our partnerships team today.
          </p>
          <Button className="bg-magenta text-white hover:bg-magenta/90" size="lg" asChild>
            <Link href="/register/college">
              Apply Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>
    </>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-white/80">
    <span>{label}</span>
    <span className="font-semibold text-white">{value}</span>
  </div>
);

const BoolRow = ({ label, val }: { label: string; val: boolean }) => (
  <div className="flex justify-between text-white/80">
    <span>{label}</span>
    {val ? (
      <Check className="h-4 w-4 text-magenta" />
    ) : (
      <Minus className="h-4 w-4 text-white/30" />
    )}
  </div>
);

export default ForColleges;
