"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Section from "@/components/ui/section";
import { DataCard } from "@/components/ui/data-card";
import { PopupForm, usePopupForm } from "@/components/common/PopupForm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { GraduationCap, AlertTriangle, BookOpen, Users, Briefcase, ArrowRight } from "lucide-react";

const pains = [
  { icon: AlertTriangle, text: "Tutorial hell — you watch videos but can't build anything real." },
  { icon: AlertTriangle, text: "No mentor to review your code or guide your learning path." },
  { icon: AlertTriangle, text: "Job applications go unanswered because your portfolio is empty." },
];

const solutions = [
  { 
    icon: BookOpen, 
    title: "Project-First Learning", 
    desc: "Every course is built around shipping real projects, not watching lectures." 
  },
  { 
    icon: Users, 
    title: "Live Mentorship", 
    desc: "1-on-1 code reviews and career guidance from engineers at top companies." 
  },
  { 
    icon: Briefcase, 
    title: "Placement Pipeline", 
    desc: "Direct access to 100+ hiring partners. We prepare you and connect you." 
  },
];

const referralTiers = [
  { name: "Bronze", referrals: "1–5", commission: "₹500 per referral" },
  { name: "Silver", referrals: "6–15", commission: "₹750 per referral" },
  { name: "Gold", referrals: "16+", commission: "₹1,000 per referral" },
];

const testimonials = [
  { 
    name: "Rahul Nair", 
    role: "Full-Stack Developer", 
    org: "Razorpay", 
    quote: "Went from building todo apps to shipping payment integrations in 6 months.", 
    photo: "rahul" 
  },
  { 
    name: "Meera Krishnan", 
    role: "Frontend Engineer", 
    org: "Swiggy", 
    quote: "The project-based approach made my portfolio stand out. Got 3 offers in 2 weeks.", 
    photo: "meera" 
  },
  { 
    name: "Aditya Bhatt", 
    role: "Backend Engineer", 
    org: "Flipkart", 
    quote: "The mentorship was the game-changer. My mentor reviewed my code like a tech lead.", 
    photo: "aditya" 
  },
];

const faqs = [
  { 
    q: "I'm a complete beginner — is this for me?", 
    a: "Yes! We have beginner-friendly courses and our mentors will guide you step by step." 
  },
  { 
    q: "What if I can't get a job after the program?", 
    a: "We offer extended placement support until you're placed, at no extra cost." 
  },
  { 
    q: "How is this different from free YouTube tutorials?", 
    a: "Structure, accountability, real projects, code reviews, and direct hiring pipeline." 
  },
  { 
    q: "Do I get a certificate?", 
    a: "Yes. Verifiable certificates for every course and bootcamp completed." 
  },
  { 
    q: "Can I earn while learning?", 
    a: "Yes! Our Ambassador program lets you earn by referring friends." 
  },
  { 
    q: "How much time per week do I need?", 
    a: "10–15 hours/week for courses, 20+ hours/week for bootcamps." 
  },
];

const ForStudents = () => {
  const { isOpen, formType, formTitle, openForm, closeForm } = usePopupForm();
  const [referralsPerMonth, setReferralsPerMonth] = useState(5);

  const getRate = (r: number) => r <= 5 ? 500 : r <= 15 ? 750 : 1000;
  const monthlyEarnings = referralsPerMonth * getRate(referralsPerMonth);

  return (
    <>
      <PopupForm isOpen={isOpen} onClose={closeForm} type={formType} title={formTitle} />

      {/* Hero */}
      <Section variant="white">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-afacad text-muted-foreground uppercase tracking-wide mb-4">
              For Students & Ambassadors
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              From zero to hired in{" "}
              <span className="font-script text-magenta">six</span> months
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Learn by building. Get mentored by engineers. Land your first tech job through our hiring pipeline.
            </p>
            <Button className="bg-magenta text-white hover:bg-magenta/90" size="lg" asChild>
              <Link href="/courses">
                Explore Courses <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md p-8 rounded-2xl bg-marble border border-border text-center">
              <GraduationCap className="h-16 w-16 mx-auto text-lavender mb-4" />
              <p className="text-lg font-bold">5,000+ students placed</p>
              <p className="text-sm text-muted-foreground">at top tech companies</p>
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

      {/* Ambassador Program */}
      <Section variant="graphite">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Ambassador Program</h2>
        <p className="text-white/60 mb-8">Earn while your friends learn. Refer and get paid.</p>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Referral commission tiers</h3>
            <div className="space-y-3">
              {referralTiers.map((tier) => (
                <DataCard 
                  key={tier.name} 
                  variant="dark" 
                  className="border border-white/10 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-white">{tier.name}</p>
                    <p className="text-xs text-white/50">{tier.referrals} referrals</p>
                  </div>
                  <p className="font-extrabold text-magenta">{tier.commission}</p>
                </DataCard>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Earnings calculator</h3>
            <div className="mb-6">
              <label className="text-white/80 text-sm mb-3 block">
                Referrals per month:{" "}
                <span className="text-magenta font-extrabold text-lg">{referralsPerMonth}</span>
              </label>
              <Slider
                value={[referralsPerMonth]}
                onValueChange={(v) => setReferralsPerMonth(v[0])}
                min={1}
                max={30}
                step={1}
                className="my-4"
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-white/60 mb-1">Estimated monthly earnings</p>
              <p className="text-4xl font-extrabold text-magenta">
                ₹{monthlyEarnings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section variant="white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8">Success stories</h2>
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
            Your journey starts here
          </h2>
          <p className="text-white/60 mb-6">
            Join 5,000+ students who transformed their careers with GrowthCraft.
          </p>
          <Button className="bg-magenta text-white hover:bg-magenta/90" size="lg" asChild>
            <Link href="/courses">
              Start Learning <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>
    </>
  );
};

export default ForStudents;
