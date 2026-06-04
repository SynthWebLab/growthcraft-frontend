"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Section from "@/components/ui/section";
import { DataCard } from "@/components/ui/data-card";
import { StatCounter } from "@/components/ui/stat-counter";
import { PopupForm, usePopupForm } from "@/components/common/PopupForm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Briefcase, AlertTriangle, Search, Clock, Target, ArrowRight, Star, Code2 } from "lucide-react";

const pains = [
  { icon: AlertTriangle, text: "Screening hundreds of resumes wastes weeks of engineering time." },
  { icon: AlertTriangle, text: "New hires need 3–6 months of upskilling before they're productive." },
  { icon: AlertTriangle, text: "Campus drives rarely surface candidates who can code on day one." },
];

const solutions = [
  { 
    icon: Search, 
    title: "Pre-Vetted Talent", 
    desc: "Every candidate completes project work and code reviews before entering the pool." 
  },
  { 
    icon: Clock, 
    title: "Faster Hiring", 
    desc: "Reduce time-to-hire by 60%. Our candidates are ready for technical rounds from day one." 
  },
  { 
    icon: Target, 
    title: "Skill-Matched", 
    desc: "Filter by tech stack, experience level, and project portfolio. No noise." 
  },
];

const candidates = [
  { id: "anon-1", skills: ["React", "Node.js", "TypeScript"], projects: 4, certifications: 2, rating: 4.8 },
  { id: "anon-2", skills: ["Python", "TensorFlow", "SQL"], projects: 3, certifications: 3, rating: 4.7 },
  { id: "anon-3", skills: ["Docker", "AWS", "CI/CD"], projects: 5, certifications: 2, rating: 4.9 },
];

const testimonials = [
  { 
    name: "Vikash Jain", 
    role: "CTO", 
    org: "TechStart Inc.", 
    quote: "We hired 8 developers from GrowthCraft. All of them were productive from week one.", 
    photo: "vikash" 
  },
  { 
    name: "Prerna Kapoor", 
    role: "HR Head", 
    org: "DataFlow Labs", 
    quote: "The quality of candidates is consistently higher than what we see from campus drives.", 
    photo: "prerna" 
  },
  { 
    name: "Amit Sinha", 
    role: "Engineering Lead", 
    org: "CloudNine Systems", 
    quote: "Their candidates come with real project experience, not just theoretical knowledge.", 
    photo: "amit" 
  },
];

const faqs = [
  { 
    q: "Is there a hiring fee?", 
    a: "We charge a one-time placement fee per successful hire. No upfront costs." 
  },
  { 
    q: "What tech stacks do candidates know?", 
    a: "MERN, Python/Django, DevOps, Data Science, UI/UX — and more." 
  },
  { 
    q: "Can we interview candidates before committing?", 
    a: "Absolutely. You get full access to profiles, portfolios, and can conduct your own interviews." 
  },
  { 
    q: "What's the average time to hire?", 
    a: "Most partners complete their hiring in 2–3 weeks from first profile review." 
  },
  { 
    q: "Do you offer internship candidates?", 
    a: "Yes. We have both full-time and internship-ready candidates." 
  },
];

const ForEmployers = () => {
  const { isOpen, formType, formTitle, openForm, closeForm } = usePopupForm();

  return (
    <>
      <PopupForm isOpen={isOpen} onClose={closeForm} type={formType} title={formTitle} />

      {/* Hero */}
      <Section variant="white">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-afacad text-muted-foreground uppercase tracking-wide mb-4">
              For Hiring Partners
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Hire pre-vetted MERN{" "}
              <span className="font-script text-magenta">talent</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Skip the screening noise. Access candidates who&apos;ve shipped real projects and passed code reviews.
            </p>
            <Button className="bg-magenta text-white hover:bg-magenta/90" size="lg" asChild>
              <Link href="/register/employer">
                Start Hiring <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md p-8 rounded-2xl bg-marble border border-border text-center">
              <Briefcase className="h-16 w-16 mx-auto text-lavender mb-4" />
              <p className="text-lg font-bold">100+ hiring partners</p>
              <p className="text-sm text-muted-foreground">trust our talent pipeline</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Pain */}
      <Section variant="marble">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8">The hiring problem</h2>
        <div className="space-y-4">
          {pains.map((p, i) => (
            <div key={i} className="flex items-start gap-3">
              <p.icon className="h-5 w-5 text-lavender mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Solutions */}
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

      {/* Talent Pool */}
      <Section variant="graphite">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Talent pool snapshot</h2>
        <p className="text-white/60 mb-8">Anonymized candidate profiles from our pipeline.</p>
        <div className="grid grid-cols-3 gap-6 mb-8">
          <StatCounter value={5000} suffix="+" label="Trained Candidates" />
          <StatCounter value={95} suffix="%" label="Placement Rate" />
          <StatCounter value={30} suffix="+" label="Tech Domains" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {candidates.map((c) => (
            <DataCard key={c.id} variant="dark" className="border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Code2 className="h-5 w-5 text-lavender" />
                <span className="text-sm font-bold text-white">Candidate #{c.id.split("-")[1]}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {c.skills.map((s) => (
                  <span 
                    key={s} 
                    className="px-2 py-0.5 rounded text-[10px] bg-lavender/20 text-lavender font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-xs text-white/60">
                <span>{c.projects} projects</span>
                <span>{c.certifications} certs</span>
                <span className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 text-warning" />
                  {c.rating}
                </span>
              </div>
            </DataCard>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
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

      {/* FAQ */}
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

      {/* Final CTA */}
      <Section variant="graphite">
        <div className="text-center py-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Ready to hire top talent?
          </h2>
          <p className="text-white/60 mb-6">
            Connect with our team to access the talent pool.
          </p>
          <Button className="bg-magenta text-white hover:bg-magenta/90" size="lg" asChild>
            <Link href="/register/employer">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>
    </>
  );
};

export default ForEmployers;
