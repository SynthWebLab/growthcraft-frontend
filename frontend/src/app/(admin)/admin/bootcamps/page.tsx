"use client";

import { useState } from "react";
import { useBootcamps } from "@/hooks/queries/useBootcamps";
import {
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
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

const formats = ["Online", "Offline", "Hybrid"];

export default function AdminBootcamps() {
  const [searchQuery, setSearchQuery] = useState("");
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

  // Queries & Mutations
  const { data: bootcampsData, isLoading } = useBootcamps({ limit: 100 });
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();

  const rawBootcamps = bootcampsData?.items || [];
  const bootcamps: Bootcamp[] = rawBootcamps.map((b: any) => ({
    id: b._id || b.id,
    title: b.title,
    description: b.description || null,
    duration: b.durationDays?.toString() || b.duration?.toString() || null,
    format: b.mode || "Online",
    batch_size: b.maxSeats || null,
    price: b.price || null,
    discount_price: b.discountedPrice || null,
    next_batch_date: b.startDate ? new Date(b.startDate).toISOString().split('T')[0] : null,
    category: b.domain || b.category || null,
    is_published: b.isPublished,
    is_featured: b.isFeatured,
    created_at: b.createdAt || new Date().toISOString(),
  }));

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
    if (!confirm(`Are you sure you want to delete "${bootcamp.title}"?`)) return;

    deleteMutation.mutate(bootcamp.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const durationNum = formData.duration ? parseInt(formData.duration) : 30;
    const startDateStr = formData.next_batch_date
      ? new Date(formData.next_batch_date).toISOString()
      : new Date().toISOString();
    const endDateStr = new Date(
      new Date(startDateStr).getTime() + durationNum * 24 * 60 * 60 * 1000
    ).toISOString();

    const bootcampData = {
      title: formData.title,
      type: "Bootcamp",
      domain: formData.category || "Technology",
      durationDays: durationNum,
      price: formData.price ? parseFloat(formData.price) : 0,
      discountedPrice: formData.discount_price ? parseFloat(formData.discount_price) : 0,
      startDate: startDateStr,
      endDate: endDateStr,
      maxSeats: formData.batch_size ? parseInt(formData.batch_size) : 30,
      description: formData.description || null,
      mode: formData.format || "Online",
      isPublished: formData.is_published,
      isFeatured: formData.is_featured,
    };

    if (editingBootcamp) {
      updateMutation.mutate(
        { id: editingBootcamp.id, data: bootcampData },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
          },
        }
      );
    } else {
      createMutation.mutate(bootcampData, {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      });
    }
  };

  const filteredBootcamps = bootcamps.filter((bootcamp) =>
    bootcamp.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "format", label: "Format" },
    {
      key: "duration",
      label: "Duration",
      render: (val: any) => (val ? `${val} Days` : "N/A"),
    },
    {
      key: "price",
      label: "Price",
      render: (value: number) => (value ? `₹${value}` : "Free"),
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
    {
      key: "is_featured",
      label: "Featured",
      render: (value: boolean) =>
        value ? <Badge variant="outline">Featured</Badge> : null,
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Bootcamps</h1>
        <p className="text-muted-foreground mt-1">Manage bootcamps and workshop events</p>
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
              <div className="space-y-2">
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
                <Label htmlFor="category">Category / Domain *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  placeholder="e.g. Web Development, Cloud"
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Select
                  value={formData.format}
                  onValueChange={(value) =>
                    setFormData({ ...formData, format: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {formats.map((fmt) => (
                      <SelectItem key={fmt} value={fmt}>
                        {fmt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Days)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  placeholder="e.g. 90"
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch_size">Max Seats</Label>
                <Input
                  id="batch_size"
                  type="number"
                  value={formData.batch_size}
                  placeholder="e.g. 30"
                  onChange={(e) =>
                    setFormData({ ...formData, batch_size: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="next_batch_date">Start Date</Label>
                <Input
                  id="next_batch_date"
                  type="date"
                  value={formData.next_batch_date}
                  onChange={(e) =>
                    setFormData({ ...formData, next_batch_date: e.target.value })
                  }
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
                  placeholder="Leave empty for free"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount_price">Discounted Price (₹)</Label>
                <Input
                  id="discount_price"
                  type="number"
                  value={formData.discount_price}
                  onChange={(e) =>
                    setFormData({ ...formData, discount_price: e.target.value })
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
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingBootcamp ? "Update" : "Create"} Bootcamp
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
