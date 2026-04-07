"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCourse } from "@/hooks/useCourses";
import { PopupForm, usePopupForm } from "@/components/common/PopupForm";
import { 
  Clock, 
  Users, 
  BookOpen, 
  ArrowRight, 
  CheckCircle, 
  ArrowLeft, 
  GraduationCap, 
  Target, 
  Award, 
  Monitor
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import courseWebDev from "@/assets/course-web-dev.jpg";
import courseDataScience from "@/assets/course-data-science.jpg";
import courseCloud from "@/assets/course-cloud.jpg";
import courseMobile from "@/assets/course-mobile.jpg";
import courseSecurity from "@/assets/course-security.jpg";

const categoryImages: Record<string, any> = {
  "Web Development": courseWebDev,
  "Programming Languages": courseWebDev,
  "Programming": courseWebDev,
  "Data Science & AI": courseDataScience,
  "Data Science & Analytics": courseDataScience,
  "Data Science": courseDataScience,
  "Cloud & DevOps": courseCloud,
  "DevOps & Cloud": courseCloud,
  "Cloud Computing": courseCloud,
  "DevOps": courseCloud,
  "Mobile Development": courseMobile,
  "Cybersecurity": courseSecurity,
};

const getLevelColor = (level: string) => {
  const lowerLevel = level.toLowerCase();
  if (lowerLevel.includes("beginner")) return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  if (lowerLevel.includes("intermediate")) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
  if (lowerLevel.includes("advanced")) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  return "bg-secondary text-secondary-foreground";
};

export default function CourseDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { course, isLoading, error } = useCourse(slug);
  const { isOpen, formType, formTitle, openForm, closeForm } = usePopupForm();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Skeleton className="h-96 w-full rounded-2xl mb-8" />
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The course you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>
    );
  }

  const courseImage = categoryImages[course.category] || courseWebDev;

  return (
    <>
      <PopupForm isOpen={isOpen} onClose={closeForm} type={formType} title={formTitle} />

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <Link 
            href="/courses" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge className={getLevelColor(course.level || "Beginner")}>
                  {course.level}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
                {course.title}
              </h1>

              <p className="text-lg text-muted-foreground mb-6">
                {course.description || "Master the skills you need to succeed in today's tech industry."}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8">
                {course.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{course.duration}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-primary" />
                  <span>{course.format || "Online"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <span>Certificate Included</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {course.price ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">
                      ₹{course.discount_price || course.price}
                    </span>
                    {course.discount_price && (
                      <span className="text-lg text-muted-foreground line-through">
                        ₹{course.price}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-primary">Free</span>
                )}
                <Button 
                  size="lg" 
                  onClick={() => openForm("enrollment", `Enroll in ${course.title}`)}
                >
                  Enroll Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <Image 
                src={courseImage}
                alt={course.title}
                width={600}
                height={400}
                className="w-full h-80 lg:h-96 object-cover rounded-2xl shadow-lg"
              />
              {course.is_featured && (
                <Badge className="absolute top-4 right-4 bg-primary">Featured</Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* What You'll Learn */}
              {course.learning_outcomes && course.learning_outcomes.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Target className="h-6 w-6 text-primary" />
                    What You'll Learn
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {course.learning_outcomes.map((outcome, index) => (
                      <div 
                        key={index} 
                        className="flex items-start gap-3 p-4 rounded-lg bg-muted/50"
                      >
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Topics Covered */}
              {course.topics && course.topics.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    Topics Covered
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {course.topics.map((topic, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Curriculum */}
              {Array.isArray(course.curriculum) && course.curriculum.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    Curriculum
                  </h2>
                  <div className="space-y-4">
                    {(course.curriculum as any[]).map((module: any, index: number) => (
                      <div 
                        key={index} 
                        className="rounded-xl border border-border bg-card p-4"
                      >
                        <h3 className="font-semibold text-foreground mb-2">
                          Module {index + 1}: {module.title || module}
                        </h3>
                        {module.topics && (
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {module.topics.map((topic: string, i: number) => (
                              <li key={i} className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-primary" />
                                {topic}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prerequisites */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Prerequisites</h2>
                  <ul className="space-y-2">
                    {course.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start gap-3 text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Enrollment Card */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-foreground mb-4">Enroll Now</h3>
                  
                  {course.price ? (
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-primary">
                        ₹{course.discount_price || course.price}
                      </span>
                      {course.discount_price && (
                        <span className="text-lg text-muted-foreground line-through ml-2">
                          ₹{course.price}
                        </span>
                      )}
                      {course.discount_label && (
                        <Badge variant="destructive" className="ml-2">
                          {course.discount_label}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-primary mb-4">Free</div>
                  )}

                  <Button 
                    className="w-full mb-4" 
                    size="lg" 
                    onClick={() => openForm("enrollment", `Enroll in ${course.title}`)}
                  >
                    Enroll Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => openForm("callback")}
                  >
                    Request Callback
                  </Button>
                </div>

                {/* Course Highlights */}
                {course.highlights && course.highlights.length > 0 && (
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">Course Highlights</h3>
                    <ul className="space-y-3">
                      {course.highlights.map((highlight, index) => (
                        <li 
                          key={index} 
                          className="flex items-start gap-3 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Instructor */}
                {course.instructor_name && (
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">Your Instructor</h3>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{course.instructor_name}</p>
                        {course.instructor_bio && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {course.instructor_bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-primary-foreground">
            Ready to Start Learning?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers with our courses.
          </p>
          <Button 
            size="lg" 
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" 
            onClick={() => openForm("enrollment", `Enroll in ${course.title}`)}
          >
            Enroll Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </>
  );
}
