"use client";

import { useState } from "react";
import { useAdminUsers, useUpdateUserStatus } from "@/hooks/queries/useAdmin";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: "student" | "mentor" | "college" | "ambassador" | "employer" | "admin";
  isActive: boolean;
  isEmailVerified: boolean;
  avatar: string | null;
  createdAt: string;
}

const roles = [
  { value: "admin", label: "Admin" },
  { value: "college", label: "College" },
  { value: "mentor", label: "Mentor" },
  { value: "employer", label: "Employer" },
  { value: "student", label: "Student" },
  { value: "ambassador", label: "Ambassador" },
];

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewUser, setViewUser] = useState<UserProfile | null>(null);
  const [roleFilter, setRoleFilter] = useState("all");

  // Fetch real users from backend via Admin Query Hook
  const { data: usersRes, isLoading } = useAdminUsers({
    role: roleFilter === "all" ? undefined : roleFilter,
    search: searchQuery || undefined,
    limit: 100, // Fetch up to 100 for display
  });

  const statusMutation = useUpdateUserStatus();

  const rawUsers = (usersRes as any)?.data || (usersRes as any)?.items || [];

  // Map to local clean UserProfile interface
  const users: UserProfile[] = rawUsers.map((u: any) => ({
    id: u._id || u.id,
    email: u.email,
    fullName: u.fullName || "",
    phone: u.phone || null,
    role: u.isAmbassador
      ? "ambassador"
      : ["super_admin", "ops", "admin"].includes(String(u.role).toLowerCase())
      ? "admin"
      : (u.role || "student").toLowerCase() as UserProfile["role"],
    isActive: !!u.isActive,
    isEmailVerified: !!u.isEmailVerified,
    avatar: u.avatar || null,
    createdAt: u.createdAt || new Date().toISOString(),
  }));

  const handleView = (user: UserProfile) => {
    setViewUser(user);
  };

  const getRoleBadgeVariant = (role: UserProfile["role"]) => {
    switch (role) {
      case "admin":
        return "destructive" as const;
      case "college":
        return "default" as const;
      case "mentor":
        return "secondary" as const;
      case "employer":
        return "outline" as const;
      case "ambassador":
        return "outline" as const;
      default:
        return "secondary" as const;
    }
  };

  const columns = [
    {
      key: "fullName",
      label: "User",
      render: (value: string, row: UserProfile) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleView(row)}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.avatar || ""} />
            <AvatarFallback className="text-xs">
              {(row.fullName || row.email)?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium hover:text-primary transition-colors">
              {row.fullName || "No name"}
            </p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", label: "Phone", render: (value: string) => value || "-" },
    {
      key: "role",
      label: "Role",
      render: (value: UserProfile["role"]) => (
        <Badge variant={getRoleBadgeVariant(value)}>
          {roles.find((r) => r.value === value)?.label || value}
        </Badge>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "isEmailVerified",
      label: "Email Verified",
      render: (value: boolean) => (
        <Badge variant={value ? "outline" : "secondary"}>
          {value ? "Verified" : "Unverified"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground mt-1">Manage all registered users and roles</p>
      </div>

      {/* Role Filter Tabs */}
      <Tabs value={roleFilter} onValueChange={setRoleFilter}>
        <div className="w-full overflow-x-auto pb-1 mb-2">
          <TabsList className="inline-flex w-max md:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="student">Students</TabsTrigger>
            <TabsTrigger value="college">Colleges</TabsTrigger>
            <TabsTrigger value="mentor">Mentors</TabsTrigger>
            <TabsTrigger value="employer">Employers</TabsTrigger>
            <TabsTrigger value="ambassador">Ambassadors</TabsTrigger>
            <TabsTrigger value="admin">Admins</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="Search users by name or email..."
        onSearch={setSearchQuery}
        onView={handleView}
        isLoading={isLoading}
      />

      {/* View User Details Dialog */}
      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {viewUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={viewUser.avatar || ""} />
                  <AvatarFallback className="text-xl">
                    {(viewUser.fullName || viewUser.email)?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {viewUser.fullName || "No name"}
                  </p>
                  <p className="text-sm text-muted-foreground">{viewUser.email}</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <Badge variant={getRoleBadgeVariant(viewUser.role)}>
                      {roles.find((r) => r.value === viewUser.role)?.label || viewUser.role}
                    </Badge>
                    <Badge variant={viewUser.isActive ? "default" : "destructive"}>
                      {viewUser.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant={viewUser.isEmailVerified ? "outline" : "secondary"}>
                      {viewUser.isEmailVerified ? "Email Verified" : "Email Unverified"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-border">
                <div>
                  <span className="text-muted-foreground">Phone</span>
                  <p className="font-medium text-foreground">{viewUser.phone || "Not provided"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Joined</span>
                  <p className="font-medium text-foreground">
                    {new Date(viewUser.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">User ID</span>
                  <p className="font-mono text-xs text-foreground truncate">{viewUser.id}</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-border mt-4">
                <Button
                  size="sm"
                  variant={viewUser.isActive ? "destructive" : "default"}
                  onClick={() => {
                    statusMutation.mutate({ id: viewUser.id, isActive: !viewUser.isActive });
                    setViewUser(null);
                  }}
                  disabled={statusMutation.isPending}
                >
                  {viewUser.isActive ? "Suspend Account" : "Activate Account"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setViewUser(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
