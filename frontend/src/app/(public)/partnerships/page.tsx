"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GraduationCap, Rocket, Users, Briefcase, Award, BookOpen, Code2, Trophy, ArrowRight, Phone, Clock } from "lucide-react";
import { PopupForm, usePopupForm } from "@/components/common/PopupForm";
import collegeStudents from "@/assets/college-students.jpg";
import careerSuccess from "@/assets/career-success.jpg";
import { TechLogos } from "@/components/common/TechLogos";
import { useCourses } from "@/hooks/useCourses";
import { useTrainingPrograms } from "@/hooks/useTrainingPrograms";
import { Skeleton } from "@/components/ui/skeleton";

const benefits = [
  { icon: BookOpen, title: "Industry-Ready Courses", description: "Learn skills that employers actually want, with curriculum designed by tech professionals." },
  { icon: Code2, title: "Hands-On Projects", description: "Build real-world projects that you can showcase in your portfolio and interviews." },
  { icon: Users, title: "Mentor Support", description: "Get guidance from experienced developers, designers, and data scientists." },
  { icon: Briefcase, title: "Placement Assistance", description: "We connect you with our network of 100+ hiring partners for job opportunities." },
  { icon: Award, title: "Certifications", description: "Earn industry-recognized certificates that add value to your resume." },
  { icon: Trophy, title: "Community & Networking", description: "Join a community of learners and professionals for collaboration and growth." },
];

const steps = [
  { step: 1, title: "Sign Up", description: "Create your GrowthCraft Seeker account for free" },
  { step: 2, title: "Explore", description: "Browse courses and bootcamps that match your goals" },
  { step: 3, title: "Enroll", description: "Join a program and start your learning journey" },
  { step: 4, title: "Learn & Build", description: "Complete projects and build your portfolio" },
  { step: 5, title: "Get Placed", description: "Apply for jobs with our placement support" },
];

const ForStudents = () => {
  const { isOpen, formType, formTitle, openForm, closeForm } = usePopupForm();
  const { courses, isLoading: coursesLoading } = useCourses();
  const { programs } = useTrainingPrograms();

  const beginnerCourses = courses.filter(c => c.level?.toLowerCase().includes("beginner")).slice(0, 4);

  return (
    <>
      <PopupForm isOpen={isOpen} onClose={closeForm} type={formType} title={formTitle} />

      {/* Hero */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={collegeStudents.src} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-foreground text-sm font-medium mb-6">
              <GraduationCap className="h-4 w-4" />
              GrowthCraft Seeker
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Launch Your Tech Career with{" "}
              <span className="text-primary">GrowthCraft</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Learn in-demand tech skills, build real projects, and land your dream job with our comprehensive learning platform and placement support.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" onClick={() => openForm("enrollment", "Student Registration")}>
                Start Learning
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button asChild variant="hero-outline" size="xl">
                <Link href="/bootcamps">View Bootcamps</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Logos */}
      <section className="py-12 border-b border-border bg-muted/20">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-6">Technologies you'll master:</p>
          <TechLogos count={12} size="sm" showNames />
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-semibold mb-4 block text-sm uppercase tracking-wide">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Everything You Need to <span className="text-primary">Succeed</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-card transition-all duration-300 group">
                <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary font-semibold mb-4 block text-sm uppercase tracking-wide">Your Journey</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">How It Works</h2>
              <div className="space-y-6">
                {steps.map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src={careerSuccess.src} alt="Career success" className="rounded-2xl shadow-lg" />
              <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-xl p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">95%</p>
                    <p className="text-xs text-muted-foreground">Placement Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-foreground">Ready to Start Your Journey?</h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers with GrowthCraft.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="xl" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" 
              onClick={() => openForm("enrollment")}
            >
              <Rocket className="mr-2 h-5 w-5" />
              Register Now
            </Button>
            <Button 
              size="xl" 
              variant="hero-outline" 
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" 
              onClick={() => openForm("callback")}
            >
              <Phone className="mr-2 h-5 w-5" />
              Request Callback
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-2">Popular Courses for Students</h2>
            <p className="text-muted-foreground">Start with these beginner-friendly courses</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {coursesLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="p-4 rounded-xl bg-card border border-border">
                  <Skeleton className="h-3 w-1/3 mb-2" />
                  <Skeleton className="h-5 w-full mb-3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))
            ) : beginnerCourses.length > 0 ? (
              beginnerCourses.map(course => (
                <Link 
                  href={`/courses/${course.slug}`}
                  key={course.id} 
                  className="p-4 rounded-xl bg-card border border-border hover:border-primary/40 transition-all"
                >
                  <span className="text-xs text-primary font-medium">{course.category}</span>
                  <h4 className="font-bold text-foreground mt-1 mb-2 text-sm line-clamp-2">{course.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{course.duration || "Self-paced"}</span>
                    <span className="ml-auto px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                      {course.level}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="col-span-4 text-center text-muted-foreground">No beginner courses available yet.</p>
            )}
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <Link href="/courses" className="p-6 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-card transition-all group">
              <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">Explore All Courses</h3>
              <p className="text-sm text-muted-foreground mt-1">Browse our catalog of {courses.length}+ courses</p>
            </Link>
            <Link href="/bootcamps" className="p-6 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-card transition-all group">
              <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">Join Bootcamps</h3>
              <p className="text-sm text-muted-foreground mt-1">{programs.length} intensive programs available</p>
            </Link>
            <Link href="/for-mentors" className="p-6 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-card transition-all group">
              <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">Become a Mentor</h3>
              <p className="text-sm text-muted-foreground mt-1">Already experienced? Give back!</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForStudents;
