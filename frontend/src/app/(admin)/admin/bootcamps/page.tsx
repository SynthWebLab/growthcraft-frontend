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

interface Bootcamp {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  format: string | null;
  batch_size: number | null;
  price: number | null;
  discount_price: number | null;
  next_batch_date: string | null;
  category: string | null;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
}

const INITIAL_BOOTCAMPS: Bootcamp[] = [
  {
    id: "1",
    title: "Full-Stack Web Development Bootcamp",
    description: "Go from beginner to ready-to-hire full-stack web developer in 12 weeks. Master React, Node, and SQL.",
    duration: "12 Weeks",
    format: "Online Live",
    batch_size: 30,
    price: 49999,
    discount_price: 39999,
    next_batch_date: new Date(Date.now() + 3600000 * 24 * 15).toISOString().split('T')[0],
    category: "Web Development",
    is_published: true,
    is_featured: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 20).toISOString(),
  },
  {
    id: "2",
    title: "Data Science & Artificial Intelligence",
    description: "Learn Python, Pandas, Machine Learning models, and Deep Learning tools to build neural networks.",
    duration: "16 Weeks",
    format: "Online Live",
    batch_size: 25,
    price: 59999,
    discount_price: 49999,
    next_batch_date: new Date(Date.now() + 3600000 * 24 * 30).toISOString().split('T')[0],
    category: "Data Science & AI",
    is_published: true,
    is_featured: false,
    created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
  },
  {
    id: "3",
    title: "Cloud Computing & DevOps Bootcamp",
    description: "Master AWS, Docker, Kubernetes, CI/CD pipelines, and Terraform to automate modern infrastructure.",
    duration: "10 Weeks",
    format: "Hybrid",
    batch_size: 20,
    price: 39999,
    discount_price: null,
    next_batch_date: null,
    category: "Cloud & DevOps",
    is_published: false,
    is_featured: false,
    created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
  },
];

export default function AdminBootcamps() {
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBootcamp, setEditingBootcamp] = useState<Bootcamp | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    format: "Online",
    batch_size: "",
    price: "",
    discount_price: "",
    next_batch_date: "",
    category: "",
    is_published: false,
    is_featured: false,
  });

  const fetchBootcamps = async () => {
    setIsLoading(true);
    try {
      // Simulate API fetch delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      setBootcamps(INITIAL_BOOTCAMPS);
    } catch (error) {
      console.error("Error fetching bootcamps:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBootcamps();
  }, []);

  const handleAdd = () => {
    setEditingBootcamp(null);
    setFormData({
      title: "",
      description: "",
      duration: "",
      format: "Online",
      batch_size: "",
      price: "",
      discount_price: "",
      next_batch_date: "",
      category: "",
      is_published: false,
      is_featured: false,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (bootcamp: Bootcamp) => {
    setEditingBootcamp(bootcamp);
    setFormData({
      title: bootcamp.title,
      description: bootcamp.description || "",
      duration: bootcamp.duration || "",
      format: bootcamp.format || "Online",
      batch_size: bootcamp.batch_size?.toString() || "",
      price: bootcamp.price?.toString() || "",
      discount_price: bootcamp.discount_price?.toString() || "",
      next_batch_date: bootcamp.next_batch_date || "",
      category: bootcamp.category || "",
      is_published: bootcamp.is_published,
      is_featured: bootcamp.is_featured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (bootcamp: Bootcamp) => {
    if (!confirm("Are you sure you want to delete this bootcamp?")) return;

    try {
      setBootcamps((prev) => prev.filter((b) => b.id !== bootcamp.id));
      toast.success("Bootcamp deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Error deleting bootcamp");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const bootcampData = {
        title: formData.title,
        description: formData.description || null,
        duration: formData.duration || null,
        format: formData.format || null,
        batch_size: formData.batch_size ? parseInt(formData.batch_size) : null,
        price: formData.price ? parseFloat(formData.price) : null,
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        next_batch_date: formData.next_batch_date || null,
        category: formData.category || null,
        is_published: formData.is_published,
        is_featured: formData.is_featured,
      };

      if (editingBootcamp) {
        setBootcamps((prev) =>
          prev.map((b) => (b.id === editingBootcamp.id ? { ...b, ...bootcampData } : b))
        );
        toast.success("Bootcamp updated successfully");
      } else {
        const newBootcamp: Bootcamp = {
          id: Math.random().toString(36).substr(2, 9),
          ...bootcampData,
          created_at: new Date().toISOString(),
        };
        setBootcamps((prev) => [newBootcamp, ...prev]);
        toast.success("Bootcamp created successfully");
      }

      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Error saving bootcamp");
    }
  };

  const filteredBootcamps = bootcamps.filter((bootcamp) =>
    bootcamp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (bootcamp.category && bootcamp.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "duration", label: "Duration" },
    { key: "batch_size", label: "Batch Size" },
    {
      key: "price",
      label: "Price",
      render: (value: number) => (value ? `₹${value}` : "Contact"),
    },
    {
      key: "next_batch_date",
      label: "Next Batch",
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
        <h1 className="text-2xl sm:text-2xl sm:text-3xl font-bold text-foreground">Bootcamps</h1>
        <p className="text-muted-foreground mt-1">Manage all bootcamp programs</p>
      </div>

      <DataTable
        columns={columns}
        data={filteredBootcamps}
        searchPlaceholder="Search bootcamps..."
        onSearch={setSearchQuery}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonLabel="Add Bootcamp"
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBootcamp ? "Edit Bootcamp" : "Add New Bootcamp"}
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
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Web Development"
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
                <Label htmlFor="format">Format</Label>
                <Input
                  id="format"
                  value={formData.format}
                  onChange={(e) =>
                    setFormData({ ...formData, format: e.target.value })
                  }
                  placeholder="e.g., Online Live"
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
                <Label htmlFor="discount_price">Discount Price (₹)</Label>
                <Input
                  id="discount_price"
                  type="number"
                  value={formData.discount_price}
                  onChange={(e) =>
                    setFormData({ ...formData, discount_price: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="next_batch_date">Next Batch Date</Label>
                <Input
                  id="next_batch_date"
                  type="date"
                  value={formData.next_batch_date}
                  onChange={(e) =>
                    setFormData({ ...formData, next_batch_date: e.target.value })
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
                {editingBootcamp ? "Update" : "Create"} Bootcamp
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
