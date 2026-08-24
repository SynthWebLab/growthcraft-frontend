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
    <Section variant="white" className="!py-8 sm:!py-12 md:!py-16 lg:!py-20 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-gradient" />
        <div className="absolute top-0 -left-4 w-48 h-48 sm:w-72 sm:h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-48 h-48 sm:w-72 sm:h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-48 h-48 sm:w-72 sm:h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
        {/* Left Column - Content */}
        <div className="animate-fade-up text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            India&apos;s outcome-driven MERN academy
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] mb-3 sm:mb-6 tracking-tight">
            <span className="font-script text-primary">Craft</span> the career.{" "}
            <br className="hidden sm:block" />
            We&apos;ll teach the code.
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed">
            Escape tutorial hell. Learn from engineers who ship in production,
            build real projects, and get hired — not just certified.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 max-w-md mx-auto lg:mx-0">
            <Button size="lg" className="w-full sm:w-auto shadow-md" asChild>
              <Link href="/courses">Explore Courses</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-white"
              asChild
            >
              <Link href="/partnerships">Talk to a Mentor</Link>
            </Button>
          </div>
        </div>

        {/* Right Column - Layered Code Windows */}
        <div
          className="relative max-w-[440px] sm:max-w-[540px] lg:max-w-[620px] w-full mx-auto lg:ml-auto animate-fade-up mt-2 lg:mt-0"
          style={{ animationDelay: "0.2s" }}
        >
          {/* First Slide (Back - top header and lines peeking out) */}
          <div className="relative z-10 w-[94%] sm:w-[94%]">
            <CodeWindow
              code={expressCode}
              language="server.js"
              className="rounded-xl border border-white/10 shadow-lg text-[11px] sm:text-xs"
            />
          </div>

          {/* Second Slide (Front - starts slightly lower to reveal back panel text) */}
          <div className="relative z-20 -mt-36 sm:-mt-48 md:-mt-56 lg:-mt-64 ml-auto w-[94%] sm:w-[94%]">
            <CodeWindow
              code={reactCode}
              language="CourseCard.jsx"
              className="rounded-xl border border-white/15 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/10 text-[11px] sm:text-xs"
            />
          </div>
        </div>
      </div>
    </Section>
  );
};
