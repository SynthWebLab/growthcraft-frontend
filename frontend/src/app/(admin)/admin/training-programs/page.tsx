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

interface TrainingProgram {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  batch_size: number | null;
  price: number | null;
  start_date: string | null;
  end_date: string | null;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
}

const INITIAL_PROGRAMS: TrainingProgram[] = [
  {
    id: "1",
    title: "AWS Cloud Practitioner Training",
    description: "Prepare for the AWS Cloud Practitioner certification with hands-on labs and expert-led training.",
    duration: "6 Weeks",
    batch_size: 40,
    price: 1999,
    start_date: new Date(Date.now() + 3600000 * 24 * 10).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 3600000 * 24 * 52).toISOString().split('T')[0],
    is_published: true,
    is_featured: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 15).toISOString(),
  },
  {
    id: "2",
    title: "Certified Ethical Hacker (CEH) Course",
    description: "Learn how to perform penetration testing, analyze traffic, and patch vulnerabilities in systems.",
    duration: "8 Weeks",
    batch_size: 25,
    price: 3499,
    start_date: new Date(Date.now() + 3600000 * 24 * 20).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 3600000 * 24 * 76).toISOString().split('T')[0],
    is_published: true,
    is_featured: false,
    created_at: new Date(Date.now() - 3600000 * 24 * 8).toISOString(),
  },
  {
    id: "3",
    title: "Agile & Scrum Master Training",
    description: "Understand sprint planning, backlog management, and daily scrums. Prepare for the PSM-I exam.",
    duration: "4 Weeks",
    batch_size: 15,
    price: 1500,
    start_date: null,
    end_date: null,
    is_published: false,
    is_featured: false,
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
];

export default function AdminTrainingPrograms() {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<TrainingProgram | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    batch_size: "",
    price: "",
    start_date: "",
    end_date: "",
    is_published: false,
    is_featured: false,
  });

  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      // Simulate API fetch delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      setPrograms(INITIAL_PROGRAMS);
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleAdd = () => {
    setEditingProgram(null);
    setFormData({
      title: "",
      description: "",
      duration: "",
      batch_size: "",
      price: "",
      start_date: "",
      end_date: "",
      is_published: false,
      is_featured: false,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (program: TrainingProgram) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      description: program.description || "",
      duration: program.duration || "",
      batch_size: program.batch_size?.toString() || "",
      price: program.price?.toString() || "",
      start_date: program.start_date || "",
      end_date: program.end_date || "",
      is_published: program.is_published,
      is_featured: program.is_featured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (program: TrainingProgram) => {
    if (!confirm("Are you sure you want to delete this program?")) return;

    try {
      setPrograms((prev) => prev.filter((p) => p.id !== program.id));
      toast.success("Program deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Error deleting program");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const programData = {
        title: formData.title,
        description: formData.description || null,
        duration: formData.duration || null,
        batch_size: formData.batch_size ? parseInt(formData.batch_size) : null,
        price: formData.price ? parseFloat(formData.price) : null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        is_published: formData.is_published,
        is_featured: formData.is_featured,
      };

      if (editingProgram) {
        setPrograms((prev) =>
          prev.map((p) => (p.id === editingProgram.id ? { ...p, ...programData } : p))
        );
        toast.success("Program updated successfully");
      } else {
        const newProgram: TrainingProgram = {
          id: Math.random().toString(36).substr(2, 9),
          ...programData,
          created_at: new Date().toISOString(),
        };
        setPrograms((prev) => [newProgram, ...prev]);
        toast.success("Program created successfully");
      }

      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Error saving program");
    }
  };

  const filteredPrograms = programs.filter((program) =>
    program.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: "title", label: "Title" },
    { key: "duration", label: "Duration" },
    { key: "batch_size", label: "Batch Size" },
    {
      key: "price",
      label: "Price",
      render: (value: number) => (value ? `₹${value}` : "Free"),
    },
    {
      key: "start_date",
      label: "Start Date",
      render: (value: string) =>
        value ? new Date(value).toLocaleDateString() : "-",
    },
    {
      key: "is_published",
      label: "Status",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Published" : "Draft"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Training Programs</h1>
        <p className="text-muted-foreground mt-1">Manage all training programs</p>
      </div>

      <DataTable
        columns={columns}
        data={filteredPrograms}
        searchPlaceholder="Search programs..."
        onSearch={setSearchQuery}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonLabel="Add Program"
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProgram ? "Edit Program" : "Add New Program"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="e.g., 12 Weeks"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch_size">Batch Size</Label>
                <Input
                  id="batch_size"
                  type="number"
                  value={formData.batch_size}
                  onChange={(e) =>
                    setFormData({ ...formData, batch_size: e.target.value })
                  }
                  placeholder="e.g., 30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
              />
            </div>
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_published: checked })
                  }
                />
                <Label htmlFor="is_published">Published</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_featured: checked })
                  }
                />
                <Label htmlFor="is_featured">Featured</Label>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingProgram ? "Update" : "Create"} Program
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
