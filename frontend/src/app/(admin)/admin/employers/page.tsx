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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Employer {
  id: string;
  company_name: string;
  email: string | null;
  phone: string | null;
  industry: string | null;
  company_size: string | null;
  website: string | null;
  contact_person: string | null;
  hiring_needs: string | null;
  is_active: boolean;
  created_at: string;
}

const industries = [
  "Information Technology",
  "Finance & Banking",
  "Healthcare",
  "E-commerce",
  "Manufacturing",
  "Consulting",
  "Education",
  "Media & Entertainment",
  "Telecommunications",
  "Other",
];

const companySizes = [
  "1-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5000+",
];

const INITIAL_EMPLOYERS: Employer[] = [
  {
    id: "1",
    company_name: "Google India",
    email: "careers-india@google.com",
    phone: "+91 80 6721 8000",
    industry: "Information Technology",
    company_size: "5000+",
    website: "https://google.com",
    contact_person: "Siddharth Sen",
    hiring_needs: "Looking for senior full-stack engineers and backend system architects.",
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 90).toISOString(),
  },
  {
    id: "2",
    company_name: "SYNTHWEB",
    email: "hr@synthweb.io",
    phone: "+91 98765 43210",
    industry: "Information Technology",
    company_size: "51-200",
    website: "https://synthweb.io",
    contact_person: "Sneha Reddy",
    hiring_needs: "Hiring React/Next.js frontend developers and Node.js backend developers for long-term contract roles.",
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
  },
  {
    id: "3",
    company_name: "HDFC Bank",
    email: "recruitment@hdfcbank.com",
    phone: "+91 22 6652 1000",
    industry: "Finance & Banking",
    company_size: "5000+",
    website: "https://hdfcbank.com",
    contact_person: "Rohan Kapoor",
    hiring_needs: "Looking for database administrators and cloud security analysts.",
    is_active: false,
    created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
  },
];

export default function AdminEmployers() {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployer, setEditingEmployer] = useState<Employer | null>(null);
  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    phone: "",
    industry: "",
    company_size: "",
    website: "",
    contact_person: "",
    hiring_needs: "",
    is_active: true,
  });

  const fetchEmployers = async () => {
    setIsLoading(true);
    try {
      // Simulate API fetch delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      setEmployers(INITIAL_EMPLOYERS);
    } catch (error) {
      console.error("Error fetching employers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  const handleAdd = () => {
    setEditingEmployer(null);
    setFormData({
      company_name: "",
      email: "",
      phone: "",
      industry: "",
      company_size: "",
      website: "",
      contact_person: "",
      hiring_needs: "",
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (employer: Employer) => {
    setEditingEmployer(employer);
    setFormData({
      company_name: employer.company_name,
      email: employer.email || "",
      phone: employer.phone || "",
      industry: employer.industry || "",
      company_size: employer.company_size || "",
      website: employer.website || "",
      contact_person: employer.contact_person || "",
      hiring_needs: employer.hiring_needs || "",
      is_active: employer.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (employer: Employer) => {
    if (!confirm("Are you sure you want to delete this employer?")) return;

    try {
      setEmployers((prev) => prev.filter((e) => e.id !== employer.id));
      toast.success("Employer deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Error deleting employer");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const employerData = {
        company_name: formData.company_name,
        email: formData.email || null,
        phone: formData.phone || null,
        industry: formData.industry || null,
        company_size: formData.company_size || null,
        website: formData.website || null,
        contact_person: formData.contact_person || null,
        hiring_needs: formData.hiring_needs || null,
        is_active: formData.is_active,
      };

      if (editingEmployer) {
        setEmployers((prev) =>
          prev.map((e) => (e.id === editingEmployer.id ? { ...e, ...employerData } : e))
        );
        toast.success("Employer updated successfully");
      } else {
        const newEmployer: Employer = {
          id: Math.random().toString(36).substr(2, 9),
          ...employerData,
          created_at: new Date().toISOString(),
        };
        setEmployers((prev) => [newEmployer, ...prev]);
        toast.success("Employer created successfully");
      }

      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Error saving employer");
    }
  };

  const filteredEmployers = employers.filter((employer) =>
    employer.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (employer.industry && employer.industry.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (employer.contact_person && employer.contact_person.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns = [
    { key: "company_name", label: "Company" },
    {
      key: "industry",
      label: "Industry",
      render: (value: string) => value || "-",
    },
    {
      key: "company_size",
      label: "Size",
      render: (value: string) => value || "-",
    },
    {
      key: "contact_person",
      label: "Contact",
      render: (value: string) => value || "-",
    },
    { key: "email", label: "Email", render: (value: string) => value || "-" },
    {
      key: "is_active",
      label: "Status",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Employers</h1>
        <p className="text-muted-foreground mt-1">Manage hiring partners</p>
      </div>

      <DataTable
        columns={columns}
        data={filteredEmployers}
        searchPlaceholder="Search employers..."
        onSearch={setSearchQuery}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonLabel="Add Employer"
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEmployer ? "Edit Employer" : "Add New Employer"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_size">Company Size</Label>
                <Select
                  value={formData.company_size}
                  onValueChange={(value) => setFormData({ ...formData, company_size: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size} employees
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hiring_needs">Hiring Needs</Label>
              <Textarea
                id="hiring_needs"
                value={formData.hiring_needs}
                onChange={(e) => setFormData({ ...formData, hiring_needs: e.target.value })}
                rows={3}
                placeholder="Describe hiring requirements..."
              />
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
              <Button type="submit">{editingEmployer ? "Update" : "Create"} Employer</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
