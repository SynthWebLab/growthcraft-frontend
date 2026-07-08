"use client";

import { useState } from "react";
import {
  useAdminEmployers,
  useUpdateAdminEmployer,
  useDeleteAdminEmployer,
} from "@/hooks/queries/useAdmin";
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
  "IT/Software",
  "Fintech",
  "E-Commerce",
  "Healthcare",
  "EdTech",
  "Startup",
  "Other",
];

const companySizes = ["1-50", "51-200", "201-500", "500+"];

export default function AdminEmployers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployer, setEditingEmployer] = useState<Employer | null>(null);
  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    phone: "",
    industry: "IT/Software",
    company_size: "1-50",
    website: "",
    contact_person: "",
    hiring_needs: "",
    is_active: true,
  });

  // Query & Mutations
  const { data: employersRes, isLoading } = useAdminEmployers();
  const updateMutation = useUpdateAdminEmployer();
  const deleteMutation = useDeleteAdminEmployer();

  const rawEmployers = (employersRes as any)?.data || (employersRes as any)?.items || [];

  // Map backend response fields to clean local Employer interface fields
  const employers: Employer[] = rawEmployers.map((e: any) => ({
    id: e.id || e._id,
    company_name: e.company_name || e.companyName || "",
    email: e.email || null,
    phone: e.phone || null,
    industry: e.industry || null,
    company_size: e.company_size || e.companySize || null,
    website: e.website || null,
    contact_person: e.contact_person || null,
    hiring_needs: e.hiring_needs || e.hiringNeeds || null,
    is_active: !!e.is_active,
    created_at: e.created_at || e.createdAt || new Date().toISOString(),
  }));

  const handleEdit = (employer: Employer) => {
    setEditingEmployer(employer);
    setFormData({
      company_name: employer.company_name,
      email: employer.email || "",
      phone: employer.phone || "",
      industry: employer.industry || "IT/Software",
      company_size: employer.company_size || "1-50",
      website: employer.website || "",
      contact_person: employer.contact_person || "",
      hiring_needs: employer.hiring_needs || "",
      is_active: employer.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (employer: Employer) => {
    if (!confirm(`Are you sure you want to delete "${employer.company_name}"? This cannot be undone.`)) return;
    deleteMutation.mutate(employer.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingEmployer) return; // Note: Employer profiles are created during Registration flow (Multi-role registration setup).

    const payload = {
      company_name: formData.company_name.trim(),
      email: formData.email.trim() || null,
      phone: formData.phone.trim() || null,
      industry: formData.industry,
      company_size: formData.company_size,
      website: formData.website.trim() || null,
      contact_person: formData.contact_person.trim() || null,
      hiring_needs: formData.hiring_needs.trim() || null,
      is_active: formData.is_active,
    };

    updateMutation.mutate(
      { id: editingEmployer.id, data: payload },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      }
    );
  };

  const filteredEmployers = employers.filter(
    (e) =>
      e.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.industry && e.industry.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.contact_person && e.contact_person.toLowerCase().includes(searchQuery.toLowerCase()))
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
        <p className="text-muted-foreground mt-1">Manage hiring partners and job posting entities</p>
      </div>

      <DataTable
        columns={columns}
        data={filteredEmployers}
        searchPlaceholder="Search employers..."
        onSearch={setSearchQuery}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employer Details</DialogTitle>
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
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active / Verified</Label>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Updating..." : "Update Employer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
