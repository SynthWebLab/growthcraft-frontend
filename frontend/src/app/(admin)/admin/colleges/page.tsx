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

const partnershipTypes = [
  "Curriculum Partner",
  "Training Partner",
  "Placement Partner",
  "Academic Alliance",
  "Corporate Tie-up",
];

const INITIAL_COLLEGES: College[] = [
  {
    id: "1",
    name: "Vellore Institute of Technology",
    email: "contact@vit.ac.in",
    phone: "+91 416 224 3091",
    address: "Katpadi, Vellore",
    city: "Vellore",
    state: "Tamil Nadu",
    website: "https://vit.ac.in",
    contact_person: "Dr. Sandeep Nair",
    partnership_type: "Curriculum Partner",
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 60).toISOString(),
  },
  {
    id: "2",
    name: "RV College of Engineering",
    email: "principal@rvce.edu.in",
    phone: "+91 80 6717 8000",
    address: "Mysore Road, Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    website: "https://rvce.edu.in",
    contact_person: "Prof. K. N. Subramanya",
    partnership_type: "Academic Alliance",
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 45).toISOString(),
  },
  {
    id: "3",
    name: "SRM Institute of Science and Technology",
    email: "admissions@srmist.edu.in",
    phone: "+91 44 2741 7000",
    address: "Kattankulathur, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    website: "https://srmist.edu.in",
    contact_person: "Dr. Ananya Ray",
    partnership_type: "Placement Partner",
    is_active: false,
    created_at: new Date(Date.now() - 3600000 * 24 * 15).toISOString(),
  },
];

export default function AdminColleges() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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
    partnership_type: "",
    is_active: true,
  });

  const fetchColleges = async () => {
    setIsLoading(true);
    try {
      // Simulate API fetch delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      setColleges(INITIAL_COLLEGES);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleAdd = () => {
    setEditingCollege(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      website: "",
      contact_person: "",
      partnership_type: "",
      is_active: true,
    });
    setIsDialogOpen(true);
  };

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
      partnership_type: college.partnership_type || "",
      is_active: college.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (college: College) => {
    if (!confirm("Are you sure you want to delete this college?")) return;

    try {
      setColleges((prev) => prev.filter((c) => c.id !== college.id));
      toast.success("College deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Error deleting college");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const collegeData = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        city: formData.city || null,
        state: formData.state || null,
        website: formData.website || null,
        contact_person: formData.contact_person || null,
        partnership_type: formData.partnership_type || null,
        is_active: formData.is_active,
      };

      if (editingCollege) {
        setColleges((prev) =>
          prev.map((c) => (c.id === editingCollege.id ? { ...c, ...collegeData } : c))
        );
        toast.success("College updated successfully");
      } else {
        const newCollege: College = {
          id: Math.random().toString(36).substr(2, 9),
          ...collegeData,
          created_at: new Date().toISOString(),
        };
        setColleges((prev) => [newCollege, ...prev]);
        toast.success("College created successfully");
      }

      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Error saving college");
    }
  };

  const filteredColleges = colleges.filter((college) =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (college.city && college.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (college.contact_person && college.contact_person.toLowerCase().includes(searchQuery.toLowerCase()))
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
      label: "Partnership",
      render: (value: string) => (value ? <Badge variant="outline">{value}</Badge> : "-"),
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
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Colleges</h1>
        <p className="text-muted-foreground mt-1">Manage partner colleges</p>
      </div>

      <DataTable
        columns={columns}
        data={filteredColleges}
        searchPlaceholder="Search colleges..."
        onSearch={setSearchQuery}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonLabel="Add College"
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCollege ? "Edit College" : "Add New College"}</DialogTitle>
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
                <Label htmlFor="partnership_type">Partnership Type</Label>
                <Select
                  value={formData.partnership_type}
                  onValueChange={(value) => setFormData({ ...formData, partnership_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
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
              <Button type="submit">{editingCollege ? "Update" : "Create"} College</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
