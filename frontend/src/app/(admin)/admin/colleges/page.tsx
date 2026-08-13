"use client";

import { useState } from "react";
import {
  useAdminColleges,
  useUpdateAdminCollege,
  useDeleteAdminCollege,
} from "@/hooks/queries/useAdmin";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
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

interface College {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  website: string | null;
  contact_person: string | null;
  partnership_type: string | null;
  is_active: boolean;
  created_at: string;
}

const partnershipTypes = ["Silver", "Gold", "Platinum"];

export default function AdminColleges() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    website: "",
    contact_person: "",
    partnership_type: "Silver",
    is_active: true,
  });

  // Query & Mutations
  const { data: collegesRes, isLoading } = useAdminColleges();
  const updateMutation = useUpdateAdminCollege();
  const deleteMutation = useDeleteAdminCollege();

  const rawColleges = (collegesRes as any)?.data || (collegesRes as any)?.items || [];

  // Map backend nested response fields to clean local College interface fields
  const colleges: College[] = rawColleges.map((c: any) => ({
    id: c.id || c._id,
    name: c.name || c.collegeName || "",
    email: c.email || null,
    phone: c.phone || null,
    address: c.address || null,
    city: c.city || null,
    state: c.state || null,
    website: c.website || null,
    contact_person: c.contact_person || null,
    partnership_type: c.partnership_type || c.partnershipTier || "Silver",
    is_active: c.is_active !== undefined ? !!c.is_active : !!c.partnershipActive,
    created_at: c.created_at || c.createdAt || new Date().toISOString(),
  }));

  const handleEdit = (college: College) => {
    setEditingCollege(college);
    setFormData({
      name: college.name,
      email: college.email || "",
      phone: college.phone || "",
      address: college.address || "",
      city: college.city || "",
      state: college.state || "",
      website: college.website || "",
      contact_person: college.contact_person || "",
      partnership_type: college.partnership_type || "Silver",
      is_active: college.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (college: College) => {
    if (!confirm(`Are you sure you want to delete "${college.name}"? This cannot be undone.`)) return;
    deleteMutation.mutate(college.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingCollege) return; // Note: Creating new College profiles is handled via Registration flow (Multi-role registration setup).

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim() || null,
      phone: formData.phone.trim() || null,
      address: formData.address.trim() || null,
      city: formData.city.trim() || null,
      state: formData.state.trim() || null,
      website: formData.website.trim() || null,
      contact_person: formData.contact_person.trim() || null,
      partnership_type: formData.partnership_type,
      is_active: formData.is_active,
    };

    updateMutation.mutate(
      { id: editingCollege.id, data: payload },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      }
    );
  };

  const filteredColleges = colleges.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.city && c.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.contact_person && c.contact_person.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns = [
    { key: "name", label: "Name" },
    { key: "city", label: "City", render: (value: string) => value || "-" },
    { key: "state", label: "State", render: (value: string) => value || "-" },
    {
      key: "contact_person",
      label: "Contact",
      render: (value: string) => value || "-",
    },
    {
      key: "partnership_type",
      label: "Partnership Tier",
      render: (value: string) => (value ? <Badge variant="outline">{value}</Badge> : "-"),
    },
    {
      key: "is_active",
      label: "Partnership Active",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Colleges</h1>
        <p className="text-muted-foreground mt-1">Manage partner colleges and partnership tiers</p>
      </div>

      <DataTable
        columns={columns}
        data={filteredColleges}
        searchPlaceholder="Search colleges..."
        onSearch={setSearchQuery}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit College Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">College Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
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
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partnership_type">Partnership Tier</Label>
                <Select
                  value={formData.partnership_type}
                  onValueChange={(value) => setFormData({ ...formData, partnership_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {partnershipTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Partnership Active</Label>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Updating..." : "Update College"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
