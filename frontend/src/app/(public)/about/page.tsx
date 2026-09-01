"use client";

import { Button } from "@/components/ui/button";
import { DataCard } from "@/components/ui/data-card";
import Section from "@/components/ui/section";
import Link from "next/link";
import { Target, Users, Heart, Lightbulb, ArrowRight, Linkedin, Twitter } from "lucide-react";
import { PopupForm, usePopupForm } from "@/components/common/PopupForm";
import { useEffect, useState } from "react";
import { PartnerLogo } from "@/components/common/PartnerLogo";

// Static data
const milestones = [
  { year: "2021", title: "Founded", desc: "GrowthCraft started as a weekend bootcamp in Guwahati." },
  { year: "2022", title: "First 100 students", desc: "Launched the MERN Full-Stack program. 100 students enrolled in month one." },
  { year: "2023", title: "College partnerships", desc: "Signed 20+ colleges across Northeast India for campus programs." },
  { year: "2024", title: "1000+ placements", desc: "Crossed 1000 successful placements at top tech companies." },
  { year: "2025", title: "100 hiring partners", desc: "Expanded to 100+ hiring partners nationwide." },
  { year: "2026", title: "5000+ alumni", desc: "Growing community of 5000+ trained professionals." },
];

const beliefs = [
  { icon: Target, title: "Outcomes over theory", desc: "Every program is designed with a clear career outcome. No fluff." },
  { icon: Users, title: "Community over isolation", desc: "Learning is better together. Our community is your unfair advantage." },
  { icon: Heart, title: "Access over exclusivity", desc: "Great tech education shouldn't require an IIT admission letter." },
  { icon: Lightbulb, title: "Craft over credentials", desc: "What you can build matters more than where you studied." },
];

// Type definitions
interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  linkedin: string;
  twitter: string;
}

interface Advisor {
  name: string;
  company: string;
}

interface TeamData {
  team: TeamMember[];
  advisors: Advisor[];
}

const AboutPage = () => {
  const { isOpen, formType, formTitle, openForm, closeForm } = usePopupForm();
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch team data from JSON
    fetch('/content/team.json')
      .then(res => res.json())
      .then(data => {
        setTeamData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load team data:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <PopupForm isOpen={isOpen} onClose={closeForm} type={formType} title={formTitle} />

      {/* Hero */}
      <Section variant="white">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              ABOUT GROWTHCRAFT
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              We bridge the gap between education and{" "}
              <span className="text-magenta">employment</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              GrowthCraft creates industry-ready tech professionals by combining live mentorship, 
              real projects, and a direct hiring pipeline.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <StatCard value={5000} suffix="+" label="Students Trained" />
            <StatCard value={50} suffix="+" label="College Partners" />
            <StatCard value={100} suffix="+" label="Hiring Partners" />
            <StatCard value={95} suffix="%" label="Placement Rate" />
          </div>
        </div>
      </Section>

      {/* Timeline */}
       <Section variant="marble">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8">Our story</h2>
        <div className="relative pl-8">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-magenta" />
          <div className="space-y-8">
            {milestones.map((m) => (
              <div key={m.year} className="relative">
                <div className="absolute -left-5 top-1 w-4 h-4 rounded-full bg-magenta border-2 border-background" />
                <p className="text-sm font-afacad text-muted-foreground mb-1">{m.year}</p>
                <h3 className="font-bold text-lg">{m.title}</h3>
                <p className="text-sm text-muted-foreground">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Beliefs */}
      <Section variant="white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8">What we believe</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {beliefs.map((b) => (
            <DataCard key={b.title}>
              <b.icon className="h-8 w-8 text-lavender mb-4" />
              <h3 className="font-bold mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
            </DataCard>
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section variant="marble">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8">Meet the team</h2>
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading team...</div>
        ) : teamData && teamData.team.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamData.team.map((t) => (
              <DataCard key={t.id} className="text-center">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.photo}`} 
                  alt={t.name} 
                  className="h-20 w-20 rounded-full mx-auto mb-4" 
                />
                <h3 className="font-bold">{t.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{t.role}</p>
                <div className="flex items-center justify-center gap-2">
                  <a 
                    href={t.linkedin} 
                    className="p-1.5 rounded hover:bg-muted transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-4 w-4 text-lavender" />
                  </a>
                  <a 
                    href={t.twitter} 
                    className="p-1.5 rounded hover:bg-muted transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="h-4 w-4 text-lavender" />
                  </a>
                </div>
              </DataCard>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">No team data available</div>
        )}
      </Section>

      {/* Backers */}
      <Section variant="white">
        <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-2xl mx-auto">
          <PartnerLogo companyName="SynthWeb" size="xl" className="shadow-md p-3 rounded-2xl bg-white border-2 border-border" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
            Built & Powered by SYNTHWEB
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            GrowthCraft is built, operated, and maintained by SYNTHWEB, a product engineering organization passionate about creating impactful offline & industrial tech education solutions. Based in Guwahati, Assam.
          </p>
        </div>
      </Section>

      {/* Final CTA */}
      <Section variant="graphite">
        <div className="text-center py-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Join the GrowthCraft community
          </h2>
          <p className="text-white/60 mb-6">
            Whether you&apos;re a student, mentor, college, or employer — there&apos;s a place for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              className="bg-magenta text-white hover:bg-magenta/90" 
              size="lg" 
              onClick={() => openForm("enquiry")}
            >
              Get in Touch <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-white/20 text-black hover:bg-white/10 hover:text-white"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
};

// StatCard component - clean design like Lovable
interface StatCardProps {
  value: number;
  suffix?: string;
  label: string;
}

const StatCard = ({ value, suffix = "", label }: StatCardProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="text-center p-8 rounded-2xl bg-card">
      <p className="text-5xl md:text-6xl font-bold text-magenta mb-2">
        {count}{suffix}
      </p>
      <p className="text-sm uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </p>
    </div>
  );
};

export default AboutPage;
