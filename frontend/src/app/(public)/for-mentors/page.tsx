"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Section from "@/components/ui/section";
import { DataCard } from "@/components/ui/data-card";
import { PopupForm, usePopupForm } from "@/components/common/PopupForm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { UserCheck, AlertTriangle, Heart, DollarSign, Globe, ArrowRight } from "lucide-react";

const pains = [
  { icon: AlertTriangle, text: "You've mastered your craft but have no platform to teach." },
  { icon: AlertTriangle, text: "Freelance mentoring is unpredictable and hard to scale." },
  { icon: AlertTriangle, text: "Finding the right students who value your time is difficult." },
];

const solutions = [
  { 
    icon: Heart, 
    title: "Make Impact", 
    desc: "Guide aspiring engineers through real projects, not textbook exercises." 
  },
  { 
    icon: DollarSign, 
    title: "Earn Predictably", 
    desc: "Fixed rates per session. No chasing invoices. Monthly payouts." 
  },
  { 
    icon: Globe, 
    title: "Teach Anywhere", 
    desc: "All sessions are remote. Mentor from wherever you ship code." 
  },
];

const sessionRates = [
  { type: "1-on-1 Mentoring", rate: 1500 },
  { type: "Group Workshop (10+)", rate: 3000 },
  { type: "Code Review Session", rate: 1000 },
  { type: "Mock Interview", rate: 2000 },
];

const testimonials = [
  { 
    name: "Arjun Mehta", 
    role: "Senior Engineer", 
    org: "Razorpay", 
    quote: "I mentor 8 hours a week and earn more than my side projects ever paid.", 
    photo: "arjun" 
  },
  { 
    name: "Priya Sharma", 
    role: "Tech Lead", 
    org: "Swiggy", 
    quote: "Seeing my students get hired at companies I admire is incredibly rewarding.", 
    photo: "priya" 
  },
  { 
    name: "Karan Gupta", 
    role: "DevOps Engineer", 
    org: "Flipkart", 
    quote: "GrowthCraft handles everything. I just show up and teach.", 
    photo: "karan" 
  },
];

const faqs = [
  { 
    q: "How many hours per week do I need to commit?", 
    a: "Minimum 5 hours/week. Most mentors do 5–15 hours." 
  },
  { 
    q: "When and how do I get paid?", 
    a: "Monthly bank transfers. Rates are fixed per session type." 
  },
  { 
    q: "Can I choose which students I mentor?", 
    a: "Yes. You set your expertise areas and we match accordingly." 
  },
  { 
    q: "Do I need teaching experience?", 
    a: "No. Industry experience and communication skills matter most." 
  },
  { 
    q: "What tools do you provide?", 
    a: "Scheduling, video calls, code review platform — all built in." 
  },
];

const ForMentors = () => {
  const { isOpen, formType, formTitle, openForm, closeForm } = usePopupForm();
  const [sessionsPerWeek, setSessionsPerWeek] = useState(5);

  const avgRate = 1500;
  const monthlyEarnings = sessionsPerWeek * avgRate * 4;

  return (
    <>
      <PopupForm isOpen={isOpen} onClose={closeForm} type={formType} title={formTitle} />

      {/* Hero */}
      <Section variant="white">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-afacad text-muted-foreground uppercase tracking-wide mb-4">
              Become a Mentor
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Teach what you&apos;ve{" "}
              <span className="font-script text-magenta">mastered</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Share your production experience. Get paid. Build your brand as a mentor.
            </p>
            <Button className="bg-magenta text-white hover:bg-magenta/90" size="lg" asChild>
              <Link href="/register/mentor">
                Apply to Mentor <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md p-8 rounded-2xl bg-marble border border-border text-center">
              <UserCheck className="h-16 w-16 mx-auto text-lavender mb-4" />
              <p className="text-lg font-bold">100+ active mentors</p>
              <p className="text-sm text-muted-foreground">earning ₹30k–₹1.5L/month</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Pain */}
      <Section variant="marble">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8">The problem you face today</h2>
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

      {/* Earnings Calculator */}
      <Section variant="graphite">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Earnings calculator</h2>
        <p className="text-white/60 mb-8">See how much you could earn as a GrowthCraft Mentor.</p>
        <div className="max-w-lg mx-auto">
          <div className="mb-8">
            <label className="text-white/80 text-sm mb-3 block">
              Sessions per week:{" "}
              <span className="text-magenta font-extrabold text-lg">{sessionsPerWeek}</span>
            </label>
            <Slider
              value={[sessionsPerWeek]}
              onValueChange={(v) => setSessionsPerWeek(v[0])}
              min={1}
              max={20}
              step={1}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-white/40">
              <span>1 session</span>
              <span>20 sessions</span>
            </div>
          </div>
          <div className="text-center mb-8">
            <p className="text-sm text-white/60 mb-1">Estimated monthly earnings</p>
            <p className="text-5xl font-extrabold text-magenta">
              ₹{monthlyEarnings.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3 text-white/60">Session Type</th>
                  <th className="text-right p-3 text-white/60">Rate</th>
                </tr>
              </thead>
              <tbody>
                {sessionRates.map((r) => (
                  <tr key={r.type} className="border-b border-white/5">
                    <td className="p-3 text-white/80">{r.type}</td>
                    <td className="p-3 text-right text-white font-semibold">
                      ₹{r.rate.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section variant="white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8">What our mentors say</h2>
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
            Ready to start mentoring?
          </h2>
          <p className="text-white/60 mb-6">
            Apply now. We&apos;ll review your profile within 48 hours.
          </p>
          <Button className="bg-magenta text-white hover:bg-magenta/90" size="lg" asChild>
            <Link href="/register/mentor">
              Apply Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>
    </>
  );
};

export default ForMentors;
