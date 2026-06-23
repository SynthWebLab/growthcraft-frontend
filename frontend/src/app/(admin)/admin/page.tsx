"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/admin/StatsCard";
import {
  BookOpen,
  GraduationCap,
  Calendar,
  Users,
  MessageSquare,
  ClipboardList,
  TrendingUp,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  courses: number;
  trainingPrograms: number;
  events: number;
  users: number;
  enquiries: number;
  registrations: number;
  colleges: number;
  employers: number;
}

interface RecentEnquiry {
  id: string;
  name: string;
  email: string;
  enquiry_type: string;
  status: string;
  created_at: string;
}

interface RecentRegistration {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
}

// Mock Data
const MOCK_STATS: DashboardStats = {
  courses: 24,
  trainingPrograms: 12,
  events: 18,
  users: 1250,
  enquiries: 84,
  registrations: 312,
  colleges: 15,
  employers: 42,
};

const MOCK_ENQUIRIES: RecentEnquiry[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    enquiry_type: "Course Inquiry",
    status: "new",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "2",
    name: "Sarah Smith",
    email: "sarah.s@example.com",
    enquiry_type: "Admission",
    status: "pending",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "m.brown@example.com",
    enquiry_type: "Corporate Training",
    status: "contacted",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.d@example.com",
    enquiry_type: "Partnership",
    status: "approved",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

const MOCK_REGISTRATIONS: RecentRegistration[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    status: "approved",
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 hour ago
  },
  {
    id: "2",
    name: "Jessica Taylor",
    email: "jessica.t@example.com",
    status: "pending",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "3",
    name: "David Wilson",
    email: "david.w@example.com",
    status: "approved",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "4",
    name: "Rachel Green",
    email: "rachel.g@example.com",
    status: "rejected",
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    courses: 0,
    trainingPrograms: 0,
    events: 0,
    users: 0,
    enquiries: 0,
    registrations: 0,
    colleges: 0,
    employers: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState<RecentEnquiry[]>([]);
  const [recentRegistrations, setRecentRegistrations] = useState<RecentRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulate API fetch delay
        await new Promise((resolve) => setTimeout(resolve, 600));

        setStats(MOCK_STATS);
        setRecentEnquiries(MOCK_ENQUIRIES);
        setRecentRegistrations(MOCK_REGISTRATIONS);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      new: "default",
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
      contacted: "outline",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to GrowthCraft Admin Panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Courses"
          value={stats.courses}
          icon={BookOpen}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Training Programs"
          value={stats.trainingPrograms}
          icon={GraduationCap}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Events"
          value={stats.events}
          icon={Calendar}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Total Users"
          value={stats.users}
          icon={Users}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Enquiries"
          value={stats.enquiries}
          icon={MessageSquare}
          trend={{ value: 23, isPositive: true }}
        />
        <StatsCard
          title="Registrations"
          value={stats.registrations}
          icon={ClipboardList}
          trend={{ value: 18, isPositive: true }}
        />
        <StatsCard
          title="Partner Colleges"
          value={stats.colleges}
          icon={Building2}
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Employers"
          value={stats.employers}
          icon={TrendingUp}
          trend={{ value: 7, isPositive: true }}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Enquiries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            {recentEnquiries.length === 0 ? (
              <p className="text-muted-foreground text-sm">No recent enquiries</p>
            ) : (
              <div className="space-y-4">
                {recentEnquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{enquiry.name}</p>
                      <p className="text-xs text-muted-foreground">{enquiry.email}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(enquiry.status)}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(enquiry.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Registrations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            {recentRegistrations.length === 0 ? (
              <p className="text-muted-foreground text-sm">No recent registrations</p>
            ) : (
              <div className="space-y-4">
                {recentRegistrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{registration.name}</p>
                      <p className="text-xs text-muted-foreground">{registration.email}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(registration.status)}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(registration.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

