"use client";

import { useState } from "react";
import { useTrainingPrograms } from "@/hooks/queries/useTrainingPrograms";
import {
  useCreateTrainingProgram,
  useUpdateTrainingProgram,
  useDeleteTrainingProgram,
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TrainingProgram {
  id: string;
  title: string;
  domain: string | null;
  description: string | null;
  duration: number | null;
  price: number | null;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
}

const DOMAINS = [
  "Full Stack Development",
  "Data Science & AI",
  "UI/UX Design",
  "Cloud & DevOps",
  "Cybersecurity",
  "Digital Marketing",
  "Business Analytics",
  "Other",
];

const EMPTY_FORM = {
  title: "",
  description: "",
  domain: "Full Stack Development",
  durationDays: "",
  price: "",
  originalPrice: "",
  tools: "",
  batchSize: "",
  is_published: false,
  is_featured: false,
};

export default function AdminTrainingPrograms() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<TrainingProgram | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const { data: programsData, isLoading } = useTrainingPrograms();
  const createMutation = useCreateTrainingProgram();
  const updateMutation = useUpdateTrainingProgram();
  const deleteMutation = useDeleteTrainingProgram();

  const rawPrograms = programsData?.data || [];
  const programs: TrainingProgram[] = rawPrograms.map((p: any) => ({
    id: p._id || p.id,
    title: p.title,
    domain: p.domain || null,
    description: p.description || null,
    duration: p.durationDays || p.duration || null,
    price: p.price ?? null,
    is_published: !!p.isPublished,
    is_featured: !!p.isFeatured,
    created_at: p.createdAt || new Date().toISOString(),
  }));

  const handleAdd = () => {
    setEditingProgram(null);
    setFormData(EMPTY_FORM);
    setIsDialogOpen(true);
  };

  const handleEdit = (program: TrainingProgram) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      description: program.description || "",
      domain: program.domain || "Full Stack Development",
      durationDays: program.duration?.toString() || "",
      price: program.price?.toString() || "",
      originalPrice: "",
      tools: "",
      batchSize: "",
      is_published: program.is_published,
      is_featured: program.is_featured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (program: TrainingProgram) => {
    if (!confirm(`Delete "${program.title}"? This cannot be undone.`)) return;
    deleteMutation.mutate(program.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const toolsArray = formData.tools
      ? formData.tools.split(",").map((t) => t.trim()).filter(Boolean)
      : ["General"];

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      domain: formData.domain,
      durationDays: formData.durationDays ? parseInt(formData.durationDays) : 30,
      tools: toolsArray,
      price: formData.price ? parseFloat(formData.price) : 0,
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      batchSize: formData.batchSize ? parseInt(formData.batchSize) : undefined,
      isPublished: formData.is_published,
      isFeatured: formData.is_featured,
    };

    if (editingProgram) {
      updateMutation.mutate(
        { id: editingProgram.id, data: payload },
        { onSuccess: () => setIsDialogOpen(false) }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setIsDialogOpen(false),
      });
    }
  };

  const filteredPrograms = programs.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.domain && p.domain.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns = [
    { key: "title", label: "Title" },
    { key: "domain", label: "Domain" },
    {
      key: "duration",
      label: "Duration",
      render: (v: number) => (v ? `${v} days` : "—"),
    },
    {
      key: "price",
      label: "Price",
      render: (v: number) => (v ? `₹${v.toLocaleString()}` : "Free"),
    },
    {
      key: "is_published",
      label: "Status",
      render: (v: boolean) => (
        <Badge variant={v ? "default" : "secondary"}>
          {v ? "Published" : "Draft"}
        </Badge>
      ),
    },
    {
      key: "is_featured",
      label: "Featured",
      render: (v: boolean) =>
        v ? <Badge variant="outline">⭐ Featured</Badge> : null,
    },
  ];

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Training Programs
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage campus training programs — create, edit, publish, and delete
        </p>
      </div>

      <DataTable
        columns={columns}
        data={filteredPrograms}
        searchPlaceholder="Search programs by title or domain..."
        onSearch={setSearchQuery}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonLabel="+ Add Program"
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProgram ? "Edit Training Program" : "Add New Training Program"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="tp-title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tp-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Full-Stack Web Development Bootcamp"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="tp-description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="tp-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What this training program covers, outcomes, and target audience..."
                rows={3}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Domain */}
              <div className="space-y-2">
                <Label>
                  Domain <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.domain}
                  onValueChange={(v) => setFormData({ ...formData, domain: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOMAINS.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="tp-duration">
                  Duration (Days) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tp-duration"
                  type="number"
                  min={1}
                  value={formData.durationDays}
                  onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                  placeholder="e.g. 90"
                  required
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="tp-price">
                  Price (₹) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tp-price"
                  type="number"
                  min={0}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 29999"
                  required
                />
              </div>

              {/* Original Price */}
              <div className="space-y-2">
                <Label htmlFor="tp-originalPrice">Original Price (₹)</Label>
                <Input
                  id="tp-originalPrice"
                  type="number"
                  min={0}
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="e.g. 49999 (for strikethrough)"
                />
              </div>

              {/* Batch Size */}
              <div className="space-y-2">
                <Label htmlFor="tp-batchSize">Batch Size</Label>
                <Input
                  id="tp-batchSize"
                  type="number"
                  min={1}
                  value={formData.batchSize}
                  onChange={(e) => setFormData({ ...formData, batchSize: e.target.value })}
                  placeholder="e.g. 30"
                />
              </div>
            </div>

            {/* Tools */}
            <div className="space-y-2">
              <Label htmlFor="tp-tools">
                Tools / Technologies (comma-separated) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tp-tools"
                value={formData.tools}
                onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                placeholder="e.g. React, Node.js, MongoDB, Docker"
                required
              />
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="tp-is_published"
                  checked={formData.is_published}
                  onCheckedChange={(v) => setFormData({ ...formData, is_published: v })}
                />
                <Label htmlFor="tp-is_published">Published</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="tp-is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(v) => setFormData({ ...formData, is_featured: v })}
                />
                <Label htmlFor="tp-is_featured">Featured on homepage</Label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? "Saving..."
                  : editingProgram
                  ? "Update Program"
                  : "Create Program"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
