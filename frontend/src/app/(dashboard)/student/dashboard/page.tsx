import { Play, Video, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { KpiCard } from "@/components/panel";
import DataCard from "@/components/ui/data-card";
import { PageHeader } from "@/components/ui/page-header";
import Link from "next/link";

const continueLearning = [
  { id: 1, title: "Full Stack Web Development", progress: 68, category: "Web Dev", image: "🌐", lastLesson: "REST API Design" },
  { id: 2, title: "Data Science with Python", progress: 35, category: "Data Science", image: "📊", lastLesson: "Pandas DataFrames" },
  { id: 3, title: "React & Next.js Masterclass", progress: 90, category: "Frontend", image: "⚛️", lastLesson: "Server Components" },
];

const upcomingSessions = [
  { id: 1, date: "Apr 14", time: "10:00 AM", title: "MERN Bootcamp — Day 5", mentor: "Rohit Sharma", type: "Live" },
  { id: 2, date: "Apr 16", time: "2:00 PM", title: "Data Science Workshop", mentor: "Priya Patel", type: "Live" },
  { id: 3, date: "Apr 18", time: "11:00 AM", title: "System Design Masterclass", mentor: "Amit Kumar", type: "Recorded" },
];

const recommended = [
  { id: 1, title: "Cloud Computing with AWS", category: "DevOps", level: "Intermediate", rating: 4.7, image: "☁️" },
  { id: 2, title: "Machine Learning Basics", category: "AI/ML", level: "Beginner", rating: 4.8, image: "🤖" },
  { id: 3, title: "Mobile App Development", category: "Mobile", level: "Beginner", rating: 4.6, image: "📱" },
  { id: 4, title: "System Design", category: "Architecture", level: "Advanced", rating: 4.9, image: "🏗️" },
];

const StudentDashboard = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="Welcome back, Student! 👋"
        description="Track your learning progress and upcoming sessions"
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Enrolled Courses" value={3} delta={12} />
        <KpiCard label="Hours Learned" value={47} suffix="h" delta={8} />
        <KpiCard label="Certificates" value={1} delta={0} />
        <KpiCard label="Current Streak" value={7} suffix=" days" delta={40} />
      </div>

      {/* Continue Learning */}
      <DataCard>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-foreground font-display">Continue Learning</h2>
          <Link href="/student/courses">
            <Button variant="ghost" size="sm" className="text-xs">
              View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {continueLearning.map((course) => (
            <div key={course.id} className="rounded-xl border border-border bg-white p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{course.image}</span>
                <Badge variant="secondary" className="text-[10px]">{course.category}</Badge>
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">{course.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">Last: {course.lastLesson}</p>
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span className="font-medium text-magenta">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2 [&>div]:bg-magenta" />
              </div>
              <Button size="sm" className="w-full bg-magenta text-white hover:bg-magenta/90">
                <Play className="h-3.5 w-3.5 mr-1.5" /> Resume
              </Button>
            </div>
          ))}
        </div>
      </DataCard>

      {/* Upcoming Bootcamp Sessions */}
      <DataCard>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-foreground font-display">Upcoming Sessions</h2>
          <Link href="/student/bootcamps">
            <Button variant="ghost" size="sm" className="text-xs">
              View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="flex items-center gap-4 rounded-lg border border-border bg-white p-4 hover:shadow-sm transition-shadow">
              <div className="text-center min-w-[56px]">
                <p className="text-xs font-medium text-muted-foreground">{session.date}</p>
                <p className="text-sm font-bold text-foreground">{session.time}</p>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground truncate">{session.title}</h4>
                <p className="text-xs text-muted-foreground">with {session.mentor}</p>
              </div>
              <Badge variant={session.type === "Live" ? "default" : "secondary"} className={session.type === "Live" ? "bg-magenta text-white" : ""}>
                {session.type === "Live" ? <Video className="h-3 w-3 mr-1" /> : null}
                {session.type}
              </Badge>
              <Button size="sm" variant="outline" className="shrink-0">
                {session.type === "Live" ? "Join" : "Watch"}
              </Button>
            </div>
          ))}
        </div>
      </DataCard>

      {/* Recommended for You */}
      <DataCard>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-foreground font-display">Recommended for You</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommended.map((course) => (
            <div key={course.id} className="rounded-xl border border-border bg-white p-4 hover:shadow-sm transition-shadow">
              <span className="text-3xl block mb-3">{course.image}</span>
              <h3 className="font-semibold text-foreground text-sm mb-1">{course.title}</h3>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-[10px]">{course.category}</Badge>
                <Badge variant="outline" className="text-[10px]">{course.level}</Badge>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{course.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </DataCard>
    </div>
  );
};

export default StudentDashboard;
