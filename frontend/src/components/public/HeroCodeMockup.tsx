"use client";

import { CodeWindow } from "@/components/ui/code-window";

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

export const HeroCodeMockup = () => {
  return (
    <div className="relative max-w-[440px] sm:max-w-[540px] lg:max-w-[620px] w-full mx-auto lg:ml-auto mt-2 lg:mt-0">
      {/* First Slide (Back) */}
      <div className="relative z-10 w-[94%] sm:w-[94%]">
        <CodeWindow
          code={expressCode}
          language="server.js"
          className="rounded-xl border border-white/10 shadow-lg text-[11px] sm:text-xs"
        />
      </div>

      {/* Second Slide (Front) */}
      <div className="relative z-20 -mt-36 sm:-mt-48 md:-mt-56 lg:-mt-64 ml-auto w-[94%] sm:w-[94%]">
        <CodeWindow
          code={reactCode}
          language="CourseCard.jsx"
          className="rounded-xl border border-white/15 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/10 text-[11px] sm:text-xs"
        />
      </div>
    </div>
  );
};

export default HeroCodeMockup;
