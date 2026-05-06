"use client";

import { Button } from "@/components/ui/button";
import { CodeWindow } from "@/components/ui/code-window";
import { Section } from "@/components/ui/section";
import Link from "next/link";

const expressCode = `const app = express();

app.post('/api/enroll', auth, async (req, res) => {
  const { courseId, userId } = req.body;
  
  const enrollment = await Enrollment.create({
    course: courseId,
    student: userId,
    status: 'active',
    startedAt: new Date()
  });
  
  await sendWelcomeEmail(userId, courseId);
  res.json({ success: true, enrollment });
});`;

const reactCode = `function CourseCard({ course }) {
  const [enrolled, setEnrolled] = useState(false);
  
  return (
    <div className="card">
      <h3>{course.title}</h3>
      <p>{course.instructor}</p>
      <span>{course.duration}h</span>
      <button onClick={() => setEnrolled(true)}>
        {enrolled ? 'Enrolled' : 'Enroll Now'}
      </button>
    </div>
  );
}`;

export const HeroSection = () => {
  return (
    <Section variant="white" className="!py-6 sm:!py-12 md:!py-16 lg:!py-20 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-gradient" />
        <div className="absolute top-0 -left-4 w-48 h-48 sm:w-72 sm:h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-48 h-48 sm:w-72 sm:h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-48 h-48 sm:w-72 sm:h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 md:gap-12 lg:gap-16 items-center">
        {/* Left Column - Content */}
        <div className="animate-fade-up">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground mb-2 sm:mb-4 font-semibold">
            India&apos;s outcome-driven MERN academy
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-3 sm:mb-6">
            <span className="font-script text-primary">Craft</span> the career.{" "}
            <br className="hidden sm:block" />
            We&apos;ll teach the code.
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-lg mb-5 sm:mb-8 leading-relaxed">
            Escape tutorial hell. Learn from engineers who ship in production,
            build real projects, and get hired — not just certified.
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Button size="lg" asChild>
              <Link href="/courses">Explore Courses</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
              asChild
            >
              <Link href="/partnerships">Talk to a Mentor</Link>
            </Button>
          </div>
        </div>

        {/* Right Column - Code Windows */}
        <div
          className="space-y-3 sm:space-y-4 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <CodeWindow code={expressCode} language="server.js" />
          <CodeWindow code={reactCode} language="CourseCard.jsx" />
        </div>
      </div>
    </Section>
  );
};
