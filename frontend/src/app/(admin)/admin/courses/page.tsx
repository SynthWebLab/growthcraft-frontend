"use client";

import { useState } from "react";
import {
  useAdminCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
  usePublishCourse,
  useAdminMentors,
} from "@/hooks/queries/useAdmin";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { formatDisplayDate, getBatchDateDetails } from "@/lib/dateUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Plus, Trash2, Edit, Globe, EyeOff, Check, User as UserIcon } from "lucide-react";

interface Course {
  id: string;
  title: string;
  category: string;
  description?: string | null;
  duration?: number | null;
  lessonsCount?: number | null;
  level?: string | null;
  price?: number | null;
  originalPrice?: number | null;
  instructorName?: string | null;
  mentors?: any[];
  tags?: string | null;
  isDateTBA?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
}

const CATEGORIES = [
  "Programming",
  "Data Science",
  "Web Development",
  "Mobile Development",
  "Cloud Computing",
  "Cybersecurity",
  "AI/ML",
  "DevOps",
  "Design",
  "Business",
  "Other",
];

const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"];

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
  selectedMentorIds: [] as string[],
  tags: "",
  isDateTBA: false,
  startDate: "",
  endDate: "",
  is_published: false,
  is_featured: false,
};

export default function AdminCourses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const { data: coursesData, isLoading } = useAdminCourses();
  const { data: mentorsData } = useAdminMentors({ limit: 100 });
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const deleteMutation = useDeleteCourse();
  const publishMutation = usePublishCourse();

  const rawMentors =
    (mentorsData as any)?.data?.items ||
    (mentorsData as any)?.data?.mentors ||
    (mentorsData as any)?.items ||
    (mentorsData as any)?.mentors ||
    (Array.isArray((mentorsData as any)?.data) ? (mentorsData as any).data : []);
  const registeredMentors = Array.isArray(rawMentors) ? rawMentors : [];

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
    mentors: c.mentors || [],
    tags: Array.isArray(c.tags) ? c.tags.join(", ") : c.tags || "",
    startDate: c.startDate ? new Date(c.startDate).toISOString().split("T")[0] : null,
    isDateTBA: c.isDateTBA !== undefined ? Boolean(c.isDateTBA) : true,
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
    const existingMentorIds = course.mentors?.map((m: any) => m.userId || m.id).filter(Boolean) || [];
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
      selectedMentorIds: existingMentorIds,
      tags: course.tags || "",
      isDateTBA: course.isDateTBA !== undefined ? course.isDateTBA : true,
      startDate: course.startDate || "",
      endDate: course.endDate || "",
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
      mentorIds: formData.selectedMentorIds,
      tags: formData.tags
        ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      isDateTBA: formData.isDateTBA,
      startDate: !formData.isDateTBA && formData.startDate ? formData.startDate : null,
      endDate: !formData.isDateTBA && formData.endDate ? formData.endDate : null,
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
      key: "startDate",
      label: "Next Batch",
      render: (v: string, row: Course) => {
        const details = getBatchDateDetails(v, row.endDate, row.isDateTBA);
        return (
          <Badge
            variant="outline"
            className={`text-xs font-medium ${
              details.isTBA
                ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                : details.status === "in-progress"
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                : "bg-primary/10 text-primary border-primary/20"
            }`}
          >
            {details.displayWithStatus}
          </Badge>
        );
      },
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
      render: (v: boolean, row: Course) => (
        <Button
          variant={v ? "secondary" : "outline"}
          size="sm"
          className={`h-7 text-xs gap-1 font-semibold ${
            v
              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/25"
              : "text-muted-foreground"
          }`}
          onClick={() =>
            updateMutation.mutate({
              id: row.id,
              data: { isFeatured: !v },
            })
          }
          disabled={updateMutation.isPending}
          title={v ? "Click to un-feature" : "Click to feature as Trending"}
        >
          {v ? "🔥 Trending" : "+ Feature"}
        </Button>
      ),
    },
  ];

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4 md:space-y-6">
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
                    {DIFFICULTY_LEVELS.map((l) => (
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

              {/* Batch Date & TBA Setting */}
              <div className="space-y-3 md:col-span-2 p-3.5 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">Next Batch Date</Label>
                    <p className="text-xs text-muted-foreground">
                      Set upcoming batch date or mark as "To be announced"
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="course-tba-switch" className="text-xs font-medium cursor-pointer">
                      To be announced
                    </Label>
                    <Switch
                      id="course-tba-switch"
                      checked={formData.isDateTBA}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          isDateTBA: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="course-start-date" className="text-xs font-medium">Scheduled Start Date</Label>
                    <Input
                      id="course-start-date"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => {
                        const newStart = e.target.value;
                        let newEnd = formData.endDate;
                        if (newStart && formData.duration && !newEnd) {
                          const days = parseInt(formData.duration, 10) || 30;
                          const d = new Date(newStart);
                          d.setDate(d.getDate() + days);
                          newEnd = d.toISOString().split("T")[0];
                        }
                        setFormData({
                          ...formData,
                          startDate: newStart,
                          endDate: newEnd,
                          isDateTBA: newStart ? false : formData.isDateTBA,
                        });
                      }}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="course-end-date" className="text-xs font-medium">Scheduled End Date</Label>
                    <Input
                      id="course-end-date"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          endDate: e.target.value,
                          isDateTBA: e.target.value ? false : formData.isDateTBA,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
                {formData.isDateTBA && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    ℹ️ Marked as "To be announced". The date inputs above are saved, but "To be announced" will be shown on public cards.
                  </p>
                )}
              </div>

              {/* Assigned Mentors & Instructor */}
              <div className="space-y-3 md:col-span-2">
                <Label>Assign Real Mentors (Select one or multiple)</Label>
                {registeredMentors.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-2 border rounded-md bg-muted/20">
                    {registeredMentors.map((mentor: any) => {
                      const mentorId = mentor._id || mentor.id;
                      const mentorName = mentor.name || mentor.fullName || mentor.email;
                      const isSelected = formData.selectedMentorIds.includes(mentorId);
                      return (
                        <div
                          key={mentorId}
                          onClick={() => {
                            const newIds = isSelected
                              ? formData.selectedMentorIds.filter((id) => id !== mentorId)
                              : [...formData.selectedMentorIds, mentorId];
                            const selectedNames = registeredMentors
                              .filter((m: any) => newIds.includes(m._id || m.id))
                              .map((m: any) => m.name || m.fullName || m.email);
                            setFormData({
                              ...formData,
                              selectedMentorIds: newIds,
                              instructorName: selectedNames.join(", ") || formData.instructorName,
                            });
                          }}
                          className={`flex items-center gap-2.5 p-2 rounded-md cursor-pointer border transition-all text-xs ${
                            isSelected
                              ? "bg-primary/10 border-primary text-primary font-semibold"
                              : "bg-background border-border hover:bg-accent"
                          }`}
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={mentor.avatar || undefined} />
                            <AvatarFallback className="text-[10px]">
                              {(mentorName || "M").charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-medium">{mentorName}</p>
                            <p className="text-[10px] text-muted-foreground truncate">
                              {mentor.areaOfExpertise || mentor.currentOrganization || mentor.email}
                            </p>
                          </div>
                          {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No registered mentors found in database.</p>
                )}

                <div className="pt-1">
                  <Label htmlFor="instructorName" className="text-xs text-muted-foreground">
                    Display Name / Custom Fallback
                  </Label>
                  <Input
                    id="instructorName"
                    value={formData.instructorName}
                    onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                    placeholder="e.g. Arjun Mehta, Sneha Patel"
                    className="h-8 text-xs mt-1"
                  />
                </div>
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
