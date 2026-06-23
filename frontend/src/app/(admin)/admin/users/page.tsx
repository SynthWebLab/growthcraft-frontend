"use client";

import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Profile {
  id: string;
  user_id: string | null;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: "platform_admin" | "college_admin" | "mentor" | "employer" | "student";
  organization: string | null;
  is_active: boolean;
  avatar_url: string | null;
  created_at: string;
}

const roles = [
  { value: "platform_admin", label: "Platform Admin" },
  { value: "college_admin", label: "College Admin" },
  { value: "mentor", label: "Mentor" },
  { value: "employer", label: "Employer" },
  { value: "student", label: "Student" },
];

const INITIAL_USERS: Profile[] = [
  {
    id: "1",
    user_id: "auth-1",
    email: "john.admin@growthcraft.com",
    full_name: "John Admin",
    phone: "+91 98765 43210",
    role: "platform_admin",
    organization: "GrowthCraft HQ",
    is_active: true,
    avatar_url: null,
    created_at: new Date(Date.now() - 3600000 * 24 * 100).toISOString(),
  },
  {
    id: "2",
    user_id: "auth-2",
    email: "amit.sharma@college.edu",
    full_name: "Amit Sharma",
    phone: "+91 98765 43211",
    role: "college_admin",
    organization: "IIT Bangalore",
    is_active: true,
    avatar_url: null,
    created_at: new Date(Date.now() - 3600000 * 24 * 50).toISOString(),
  },
  {
    id: "3",
    user_id: "auth-3",
    email: "priya.mentor@gmail.com",
    full_name: "Priya Nair",
    phone: "+91 98765 43212",
    role: "mentor",
    organization: "Google India",
    is_active: true,
    avatar_url: null,
    created_at: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
  },
  {
    id: "4",
    user_id: "auth-4",
    email: "hr@synthweb.io",
    full_name: "Rajesh Kumar",
    phone: "+91 98765 43213",
    role: "employer",
    organization: "SYNTHWEB",
    is_active: false,
    avatar_url: null,
    created_at: new Date(Date.now() - 3600000 * 24 * 20).toISOString(),
  },
  {
    id: "5",
    user_id: "auth-5",
    email: "rohit.student@yahoo.com",
    full_name: "Rohit Verma",
    phone: "+91 98765 43214",
    role: "student",
    organization: "Vellore Institute of Technology",
    is_active: true,
    avatar_url: null,
    created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
  },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [viewUser, setViewUser] = useState<Profile | null>(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    phone: "",
    role: "student" as Profile["role"],
    organization: "",
    is_active: true,
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Simulate API fetch delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      setUsers(INITIAL_USERS);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: Profile) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      full_name: user.full_name || "",
      phone: user.phone || "",
      role: user.role,
      organization: user.organization || "",
      is_active: user.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleView = (user: Profile) => {
    setViewUser(user);
  };

  const handleDelete = async (user: Profile) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success("User deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Error deleting user");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingUser) return;

    try {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                full_name: formData.full_name || null,
                phone: formData.phone || null,
                role: formData.role,
                organization: formData.organization || null,
                is_active: formData.is_active,
              }
            : u
        )
      );

      toast.success("User updated successfully");
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Error updating user");
    }
  };

  const getRoleBadgeVariant = (role: Profile["role"]) => {
    switch (role) {
      case "platform_admin":
        return "destructive" as const;
      case "college_admin":
        return "default" as const;
      case "mentor":
        return "secondary" as const;
      case "employer":
        return "outline" as const;
      default:
        return "secondary" as const;
    }
  };

  // Filter users based on tabs AND search query
  const searchedUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.full_name && u.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.organization && u.organization.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredUsers = roleFilter === "all" ? searchedUsers : searchedUsers.filter((u) => u.role === roleFilter);

  const columns = [
    {
      key: "full_name",
      label: "User",
      render: (value: string, row: Profile) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleView(row)}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.avatar_url || ""} />
            <AvatarFallback className="text-xs">
              {(value || row.email)?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium hover:text-primary transition-colors">{value || "No name"}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", label: "Phone", render: (value: string) => value || "-" },
    {
      key: "role",
      label: "Role",
      render: (value: Profile["role"]) => (
        <Badge variant={getRoleBadgeVariant(value)}>
          {roles.find((r) => r.value === value)?.label || value}
        </Badge>
      ),
    },
    {
      key: "organization",
      label: "Organization",
      render: (value: string) => value || "-",
    },
    {
      key: "is_active",
      label: "Status",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "created_at",
      label: "Joined",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground mt-1">Manage all platform users</p>
      </div>

      {/* Role Filter Tabs */}
      <Tabs value={roleFilter} onValueChange={setRoleFilter}>
        <div className="w-full overflow-x-auto pb-1 mb-2">
          <TabsList className="inline-flex w-max md:w-auto">
            <TabsTrigger value="all">All ({users.length})</TabsTrigger>
            <TabsTrigger value="student">Students ({users.filter((u) => u.role === "student").length})</TabsTrigger>
            <TabsTrigger value="college_admin">Colleges ({users.filter((u) => u.role === "college_admin").length})</TabsTrigger>
            <TabsTrigger value="mentor">Mentors ({users.filter((u) => u.role === "mentor").length})</TabsTrigger>
            <TabsTrigger value="employer">Employers ({users.filter((u) => u.role === "employer").length})</TabsTrigger>
            <TabsTrigger value="platform_admin">Admins ({users.filter((u) => u.role === "platform_admin").length})</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      <DataTable
        columns={columns}
        data={filteredUsers}
        searchPlaceholder="Search users..."
        onSearch={setSearchQuery}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {/* View User Dialog */}
      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {viewUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={viewUser.avatar_url || ""} />
                  <AvatarFallback className="text-xl">
                    {(viewUser.full_name || viewUser.email)?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold text-foreground">{viewUser.full_name || "No name"}</p>
                  <p className="text-sm text-muted-foreground">{viewUser.email}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={getRoleBadgeVariant(viewUser.role)}>
                      {roles.find((r) => r.value === viewUser.role)?.label}
                    </Badge>
                    <Badge variant={viewUser.is_active ? "default" : "secondary"}>
                      {viewUser.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Phone</span>
                  <p className="font-medium text-foreground">{viewUser.phone || "Not provided"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Organization</span>
                  <p className="font-medium text-foreground">{viewUser.organization || "Not provided"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Joined</span>
                  <p className="font-medium text-foreground">
                    {new Date(viewUser.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">User ID</span>
                  <p className="font-mono text-xs text-foreground truncate">{viewUser.id}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t border-border">
                <Button
                  size="sm"
                  onClick={() => {
                    setViewUser(null);
                    handleEdit(viewUser);
                  }}
                >
                  Edit Profile
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setViewUser(null);
                    handleDelete(viewUser);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={formData.email} disabled />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as Profile["role"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update User</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
