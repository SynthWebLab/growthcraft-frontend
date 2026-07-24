"use client";

import { useState } from "react";
import {
  useAdminCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
  usePublishCourse,
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
import { Globe, EyeOff } from "lucide-react";

interface Course {
  id: string;
  title: string;
  category: string;
  description: string | null;
  duration: number | null;
  lessonsCount: number | null;
  level: string | null;
  price: number | null;
  originalPrice: number | null;
  instructorName: string | null;
  tags: string;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
}

const CATEGORIES = [
  "Web Development",
  "Data Science",
  "Programming",
  "Mobile Development",
  "Cloud Computing",
  "Cybersecurity",
  "AI/ML",
  "DevOps",
  "Design",
  "Business",
  "Other",
];

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "Web Development",
  difficultyLevel: "Beginner",
  duration: "20",
  lessonsCount: "10",
  price: "",
  originalPrice: "",
  instructorName: "GrowthCraft Team",
  tags: "",
  is_published: false,
  is_featured: false,
};

export default function AdminCourses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const { data: coursesData, isLoading } = useAdminCourses();
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const deleteMutation = useDeleteCourse();
  const publishMutation = usePublishCourse();

  // Extract raw courses from API response (supports array or wrapper object)
  const rawCourses = Array.isArray(coursesData?.data)
    ? coursesData.data
    : Array.isArray(coursesData)
    ? coursesData
    : [];

  const courses: Course[] = rawCourses.map((c: any) => ({
    id: c._id || c.id,
    title: c.title || "",
    category: c.category || "Other",
    description: c.description || null,
    duration: c.duration || c.totalHours || null,
    lessonsCount: c.lessonsCount || null,
    level: c.difficultyLevel || c.level || null,
    price: c.price ?? null,
    originalPrice: c.originalPrice ?? null,
    instructorName: c.instructor?.name || c.instructorName || null,
    tags: Array.isArray(c.tags) ? c.tags.join(", ") : c.tags || "",
    is_published: !!c.isPublished,
    is_featured: !!c.isFeatured,
    created_at: c.createdAt || new Date().toISOString(),
  }));

  const handleAdd = () => {
    setEditingCourse(null);
    setFormData(EMPTY_FORM);
    setIsDialogOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || "",
      category: course.category || "Web Development",
      difficultyLevel: course.level || "Beginner",
      duration: course.duration?.toString() || "20",
      lessonsCount: course.lessonsCount?.toString() || "10",
      price: course.price?.toString() || "",
      originalPrice: course.originalPrice?.toString() || "",
      instructorName: course.instructorName || "GrowthCraft Team",
      tags: course.tags || "",
      is_published: course.is_published,
      is_featured: course.is_featured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (course: Course) => {
    if (!confirm(`Delete course "${course.title}"? This action soft-deletes the course.`)) return;
    deleteMutation.mutate(course.id);
  };

  const handlePublish = (course: Course) => {
    publishMutation.mutate(course.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      difficultyLevel: formData.difficultyLevel,
      duration: formData.duration ? parseInt(formData.duration) : 20,
      lessonsCount: formData.lessonsCount ? parseInt(formData.lessonsCount) : 10,
      price: formData.price ? parseFloat(formData.price) : 0,
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      instructorName: formData.instructorName.trim() || "GrowthCraft Team",
      tags: formData.tags
        ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      isPublished: formData.is_published,
      isFeatured: formData.is_featured,
    };

    if (editingCourse) {
      updateMutation.mutate(
        { id: editingCourse.id, data: payload },
        { onSuccess: () => setIsDialogOpen(false) }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setIsDialogOpen(false),
      });
    }
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.instructorName && c.instructorName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "level", label: "Level" },
    {
      key: "duration",
      label: "Duration",
      render: (v: number) => (v ? `${v} hrs` : "—"),
    },
    {
      key: "lessonsCount",
      label: "Lessons",
      render: (v: number) => (v ? `${v} lessons` : "—"),
    },
    {
      key: "price",
      label: "Price",
      render: (v: number) => (v ? `₹${v.toLocaleString()}` : "Free"),
    },
    {
      key: "is_published",
      label: "Status",
      render: (v: boolean, row: Course) => (
        <Button
          variant={v ? "default" : "outline"}
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() => handlePublish(row)}
          disabled={publishMutation.isPending}
          title={v ? "Click to unpublish" : "Click to publish"}
        >
          {v ? (
            <>
              <Globe className="h-3 w-3" /> Published
            </>
          ) : (
            <>
              <EyeOff className="h-3 w-3 text-muted-foreground" /> Draft
            </>
          )}
        </Button>
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
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Courses</h1>
        <p className="text-muted-foreground mt-1">
          Manage all courses — create, edit, publish, and delete
        </p>
      </div>

      <DataTable
        columns={columns}
        data={filteredCourses}
        searchPlaceholder="Search courses by title, category, or instructor..."
        onSearch={setSearchQuery}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonLabel="+ Add Course"
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? "Edit Course" : "Add New Course"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Full-Stack MERN Development"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the course content and outcomes..."
                rows={3}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Category */}
              <div className="space-y-2">
                <Label>
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData({ ...formData, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Level */}
              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <Select
                  value={formData.difficultyLevel}
                  onValueChange={(v) => setFormData({ ...formData, difficultyLevel: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g. 40"
                />
              </div>

              {/* Lessons Count */}
              <div className="space-y-2">
                <Label htmlFor="lessonsCount">Total Lessons</Label>
                <Input
                  id="lessonsCount"
                  type="number"
                  min={1}
                  value={formData.lessonsCount}
                  onChange={(e) => setFormData({ ...formData, lessonsCount: e.target.value })}
                  placeholder="e.g. 20"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price (₹) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 4999"
                  required
                />
              </div>

              {/* Original Price */}
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price (₹)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  min={0}
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="e.g. 8999 (for strikethrough)"
                />
              </div>

              {/* Instructor Name */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="instructorName">Instructor Name</Label>
                <Input
                  id="instructorName"
                  value={formData.instructorName}
                  onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                  placeholder="e.g. Arjun Mehta"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g. React, Node.js, MongoDB"
              />
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(v) => setFormData({ ...formData, is_published: v })}
                />
                <Label htmlFor="is_published">Published</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(v) => setFormData({ ...formData, is_featured: v })}
                />
                <Label htmlFor="is_featured">Featured on homepage</Label>
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
                {isPending ? "Saving..." : editingCourse ? "Update Course" : "Create Course"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
