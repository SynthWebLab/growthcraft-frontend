"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Target, Users, Award, Building, Heart, Lightbulb, ArrowRight } from "lucide-react";
import { PopupForm, usePopupForm } from "@/components/common/PopupForm";
import teamCollaboration from "@/assets/team-collaboration.jpg";
import techPattern from "@/assets/tech-pattern.jpg";

const stats = [
  { value: "5000+", label: "Students Trained" },
  { value: "50+", label: "College Partners" },
  { value: "100+", label: "Hiring Partners" },
  { value: "95%", label: "Placement Rate" },
];

const values = [
  { 
    icon: Target, 
    title: "Outcome-Focused", 
    description: "Every course, bootcamp, and program is designed with clear career outcomes in mind." 
  },
  { 
    icon: Users, 
    title: "Community-Driven", 
    description: "Learn alongside peers, get support from mentors, and grow together as a community." 
  },
  { 
    icon: Award, 
    title: "Quality First", 
    description: "Industry-vetted curriculum designed by experts with real-world experience." 
  },
  { 
    icon: Heart, 
    title: "Student-Centric", 
    description: "Your success is our priority. We're here to support you at every step." 
  },
  { 
    icon: Lightbulb, 
    title: "Innovation", 
    description: "Constantly evolving our programs to match industry trends and demands." 
  },
  { 
    icon: Building, 
    title: "Industry Aligned", 
    description: "Strong partnerships with leading tech companies for placements and hiring." 
  },
];

const AboutPage = () => {
  const { isOpen, formType, formTitle, openForm, closeForm } = usePopupForm();

  return (
    <>
      <PopupForm isOpen={isOpen} onClose={closeForm} type={formType} title={formTitle} />

      {/* Hero */}
      <section className="py-20 lg:py-28 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={techPattern} 
            alt="" 
            fill
            className="object-cover opacity-10" 
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              About <span className="text-primary">GrowthCraft</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              We're on a mission to bridge the gap between education and employment by creating industry-ready tech professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary font-semibold mb-4 block text-sm uppercase tracking-wide">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                More Than Courses. <span className="text-primary">A Complete Ecosystem.</span>
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg">
                <p>
                  GrowthCraft was born from a simple observation: traditional education wasn't preparing students for the real demands of the tech industry.
                </p>
                <p>
                  We set out to create something different — a platform where learning leads to transformation. Where every course is designed with job outcomes in mind.
                </p>
                <p>
                  Today, we work closely with students, colleges, mentors, and hiring companies to build a holistic ecosystem that creates job-ready talent.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <Image 
                src={teamCollaboration} 
                alt="Team collaboration" 
                fill
                className="rounded-2xl shadow-lg object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-semibold mb-4 block text-sm uppercase tracking-wide">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              What Drives Us Every Day
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <div 
                key={value.title} 
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-card transition-all duration-300 group"
              >
                <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-foreground">
            Built by SYNTHWEB
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
            GrowthCraft is built and maintained by SYNTHWEB, a team passionate about creating impactful tech education solutions. We're based in Guwahati, Assam.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              onClick={() => openForm("enquiry")}
            >
              Get in Touch <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              asChild 
              // variant="outline" 
              size="lg" 
              className="border border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
