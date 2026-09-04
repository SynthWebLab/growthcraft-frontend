"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  useAdminEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  usePublishEvent,
  useToggleEventStatus,
  useAdminMentors,
} from "@/hooks/queries/useAdmin";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { getBatchDateDetails } from "@/lib/dateUtils";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Flame, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";

/* ─── Constants ─────────────────────────────────────────────── */

const EVENT_TYPES = ["Workshop", "Bootcamp", "Hackathon"];

const STATUS_OPTIONS = ["Open", "Closed", "Completed", "Draft"];

const DOMAINS = [
  "Full Stack Development",
  "Data Science & AI",
  "UI/UX Design",
  "Cloud & DevOps",
  "Cybersecurity",
  "Digital Marketing",
  "Business Analytics",
  "General",
];

const MODES = ["Online", "Offline", "Hybrid"];

const EMPTY_FORM = {
  title: "",
  description: "",
  type: "Bootcamp",
  domain: "Full Stack Development",
  mode: "Online",
  status: "Open",
  durationDays: "30",
  price: "0",
  maxSeats: "50",
  startDate: "",
  endDate: "",
  isDateTBA: false,
  is_published: false,
  is_featured: false,
  selectedMentorIds: [] as string[],
  mentorNames: "",
};

/* ─── Main Content ───────────────────────────────────────────── */

function AdminEventsContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  /* Queries */
  const { data: eventsData, isLoading } = useAdminEvents({ limit: 100 });
  const { data: mentorsData } = useAdminMentors({ limit: 100 });
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();
  const publishMutation = usePublishEvent();
  const toggleStatusMutation = useToggleEventStatus();

  /* Derive data */
  const rawEvents =
    (eventsData as any)?.data?.items ||
    (eventsData as any)?.items ||
    (Array.isArray((eventsData as any)?.data) ? (eventsData as any).data : []);
  const events: any[] = Array.isArray(rawEvents)
    ? [...rawEvents].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    : [];

  const rawMentors =
    (mentorsData as any)?.data?.items ||
    (mentorsData as any)?.data?.mentors ||
    (mentorsData as any)?.items ||
    (mentorsData as any)?.mentors ||
    (Array.isArray((mentorsData as any)?.data) ? (mentorsData as any).data : []);
  const registeredMentors: any[] = Array.isArray(rawMentors) ? rawMentors : [];

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.type?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeParam ? e.type?.toLowerCase() === typeParam.toLowerCase() : true;
    return matchesSearch && matchesType;
  });

  /* ─── Handlers ─────────────────────────────────────────────── */

  const handleAdd = () => {
    setEditingEvent(null);
    setFormData({
      ...EMPTY_FORM,
      type: typeParam ? (typeParam.charAt(0).toUpperCase() + typeParam.slice(1)) : "Bootcamp",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    const existingMentorIds = (event.mentors || []).map((m: any) => m.userId || m._id || "").filter(Boolean);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      type: event.type || "Bootcamp",
      domain: event.domain || "Full Stack Development",
      mode: event.mode || "Online",
      status: event.status || (event.isPublished ? "Open" : "Draft"),
      durationDays: (event.durationDays || event.duration || "30").toString(),
      price: (event.price ?? "0").toString(),
      maxSeats: (event.maxSeats ?? "50").toString(),
      startDate: event.startDate ? new Date(event.startDate).toISOString().split("T")[0] : "",
      endDate: event.endDate ? new Date(event.endDate).toISOString().split("T")[0] : "",
      isDateTBA: event.isDateTBA !== undefined ? Boolean(event.isDateTBA) : (!event.startDate && !event.endDate),
      is_published: !!event.isPublished,
      is_featured: !!event.isFeatured,
      selectedMentorIds: existingMentorIds,
      mentorNames: (event.mentors || []).map((m: any) => m.name || m.fullName || "").filter(Boolean).join(", "),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (event: any) => {
    const id = event._id || event.id;
    if (!confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    deleteMutation.mutate(id);
  };

  const handlePublishToggle = (event: any) => {
    const id = event._id || event.id;
    publishMutation.mutate(id);
  };

  const handleStatusToggle = (event: any) => {
    const id = event._id || event.id;
    const currentStatus = event.status || (event.isPublished ? "Open" : "Closed");
    const nextStatus = currentStatus === "Open" ? "Closed" : "Open";
    toggleStatusMutation.mutate({ id, status: nextStatus });
  };

  const handleFeatureToggle = (event: any) => {
    const id = event._id || event.id;
    updateMutation.mutate({
      id,
      data: { isFeatured: !event.isFeatured },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      domain: formData.domain,
      mode: formData.mode,
      status: formData.status,
      durationDays: formData.durationDays ? parseInt(formData.durationDays, 10) : 30,
      price: formData.price ? parseFloat(formData.price) : 0,
      maxSeats: formData.maxSeats ? parseInt(formData.maxSeats, 10) : 50,
      isDateTBA: formData.isDateTBA,
      startDate: !formData.isDateTBA && formData.startDate ? formData.startDate : null,
      endDate: !formData.isDateTBA && formData.endDate ? formData.endDate : null,
      isPublished: formData.is_published,
      isFeatured: formData.is_featured,
      mentorIds: formData.selectedMentorIds,
    };

    if (formData.startDate) payload.startDate = formData.startDate;
    if (formData.endDate) payload.endDate = formData.endDate;

    if (editingEvent) {
      const id = editingEvent._id || editingEvent.id;
      updateMutation.mutate({ id, data: payload }, { onSuccess: () => setIsDialogOpen(false) });
    } else {
      createMutation.mutate(payload, { onSuccess: () => setIsDialogOpen(false) });
    }
  };

  /* ─── Table Columns ─────────────────────────────────────────── */

  const columns = [
    { key: "title", label: "Title" },
    { key: "type", label: "Type" },
    { key: "domain", label: "Domain" },
    {
      key: "price",
      label: "Price",
      render: (v: number) => (v != null && v > 0 ? `₹${v.toLocaleString()}` : "Free"),
    },
    {
      key: "startDate",
      label: "Event Date",
      render: (v: string, row: any) => {
        const details = getBatchDateDetails(v, row.endDate, row.isDateTBA, row.durationDays || row.duration);
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
      key: "isPublished",
      label: "Visibility",
      render: (v: boolean, row: any) => (
        <button
          onClick={(e) => { e.stopPropagation(); handlePublishToggle(row); }}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
            v
              ? "bg-success/10 text-success border-success/30 hover:bg-success/20"
              : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
          }`}
        >
          {v ? "Published" : "Draft"}
        </button>
      ),
    },
    {
      key: "status",
      label: "Reg Status",
      render: (v: string, row: any) => {
        const statusVal = v || row.status || (row.isPublished ? "Open" : "Closed");
        const id = row._id || row.id;

        const getStatusStyles = (status: string) => {
          switch (status) {
            case "Open":
              return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20";
            case "Closed":
              return "bg-rose-500/10 text-rose-600 border-rose-500/30 hover:bg-rose-500/20";
            case "Completed":
              return "bg-slate-500/10 text-slate-600 border-slate-500/30 hover:bg-slate-500/20";
            case "Draft":
              return "bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/20";
            default:
              return "bg-muted text-muted-foreground border-border hover:bg-muted/80";
          }
        };

        const getStatusDotColor = (status: string) => {
          switch (status) {
            case "Open":
              return "bg-emerald-500";
            case "Closed":
              return "bg-rose-500";
            case "Completed":
              return "bg-slate-500";
            case "Draft":
              return "bg-amber-500";
            default:
              return "bg-muted-foreground";
          }
        };

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Select
              value={statusVal}
              onValueChange={(newStatus) => {
                updateMutation.mutate({ id, data: { status: newStatus } });
              }}
            >
              <SelectTrigger
                className={`h-7 w-[104px] rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center justify-between gap-1.5 px-2.5 py-1 ${getStatusStyles(statusVal)} focus:ring-0 focus:ring-offset-0`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${getStatusDotColor(statusVal)}`} />
                  <span>{statusVal}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt} className="text-xs">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      },
    },
    {
      key: "isFeatured",
      label: "Trending",
      render: (v: boolean, row: any) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleFeatureToggle(row); }}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
            v
              ? "bg-amber-500/10 text-amber-600 border-amber-400/40 hover:bg-amber-500/20"
              : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
          }`}
        >
          {v ? (
            <><Flame className="h-3 w-3" /> Trending</>
          ) : (
            <><Plus className="h-3 w-3" /> Feature</>
          )}
        </button>
      ),
    },
  ];

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {typeParam ? `${typeParam}s` : "Events & Bootcamps"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage workshops, bootcamps, and hackathons — create, edit, assign mentors, feature, and publish
        </p>
      </div>

      <DataTable
        columns={columns}
        data={filteredEvents}
        searchPlaceholder="Search events by title, type, or domain..."
        onSearch={setSearchQuery}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonLabel="+ Add Event"
        isLoading={isLoading}
      />

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Edit Event / Bootcamp" : "Add New Event / Bootcamp"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="ev-title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ev-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. AI & Machine Learning Hackathon 2026"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="ev-description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="ev-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Event overview, agenda highlights, and target audience..."
                rows={3}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Event Type */}
              <div className="space-y-2">
                <Label>Event Type <span className="text-red-500">*</span></Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              {/* Domain */}
              <div className="space-y-2">
                <Label>Domain <span className="text-red-500">*</span></Label>
                <Select value={formData.domain} onValueChange={(v) => setFormData({ ...formData, domain: v })}>
                  <SelectTrigger><SelectValue placeholder="Select domain" /></SelectTrigger>
                  <SelectContent>
                    {DOMAINS.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mode */}
              <div className="space-y-2">
                <Label>Mode <span className="text-red-500">*</span></Label>
                <Select value={formData.mode} onValueChange={(v) => setFormData({ ...formData, mode: v })}>
                  <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
                  <SelectContent>
                    {MODES.map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              {/* Registration Status */}
              <div className="space-y-2">
                <Label>Registration Status <span className="text-red-500">*</span></Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="ev-price">Price (₹) <span className="text-red-500">*</span></Label>
                <Input
                  id="ev-price"
                  type="number"
                  min={0}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0 for Free"
                  required
                />
              </div>

              {/* Duration (Days) */}
              <div className="space-y-2">
                <Label htmlFor="ev-duration">Duration (Days)</Label>
                <Input
                  id="ev-duration"
                  type="number"
                  min={1}
                  value={formData.durationDays}
                  onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                  placeholder="e.g. 30"
                />
              </div>

              {/* Max Seats */}
              <div className="space-y-2">
                <Label htmlFor="ev-maxSeats">Max Seats</Label>
                <Input
                  id="ev-maxSeats"
                  type="number"
                  min={1}
                  value={formData.maxSeats}
                  onChange={(e) => setFormData({ ...formData, maxSeats: e.target.value })}
                  placeholder="e.g. 50"
                />
              </div>

              {/* Event Dates & TBA Setting */}
              <div className="space-y-3 md:col-span-2 p-3.5 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">Event Dates</Label>
                    <p className="text-xs text-muted-foreground">
                      Set scheduled dates or mark as "To be announced"
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="ev-tba-switch" className="text-xs font-medium cursor-pointer">
                      To be announced
                    </Label>
                    <Switch
                      id="ev-tba-switch"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <Label htmlFor="ev-startDate" className="text-xs font-medium">Start Date</Label>
                    <Input
                      id="ev-startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => {
                        const newStart = e.target.value;
                        let newEnd = formData.endDate;
                        if (newStart && formData.durationDays) {
                          const days = parseInt(formData.durationDays, 10) || 1;
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
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ev-endDate" className="text-xs font-medium">End Date</Label>
                    <Input
                      id="ev-endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          endDate: e.target.value,
                          isDateTBA: e.target.value ? false : formData.isDateTBA,
                        })
                      }
                    />
                  </div>
                </div>
                {formData.isDateTBA && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    ℹ️ Marked as "To be announced". The date inputs above are saved, but "To be announced" will be shown on public cards.
                  </p>
                )}
              </div>
            </div>

            {/* Real Mentor Multi-Select */}
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
                            mentorNames: selectedNames.join(", "),
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
                <p className="text-xs text-muted-foreground border rounded-md p-3 bg-muted/20">
                  No registered mentors found. Register a mentor first via the Mentors page.
                </p>
              )}
              {formData.selectedMentorIds.length > 0 && (
                <p className="text-xs text-primary font-medium">
                  Selected: {formData.mentorNames}
                </p>
              )}
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6 pt-2 border-t">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_published: !formData.is_published })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.is_published ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.is_published ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
                <Label className="cursor-pointer" onClick={() => setFormData({ ...formData, is_published: !formData.is_published })}>
                  Published
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.is_featured ? "bg-amber-500" : "bg-muted"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.is_featured ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
                <Label className="cursor-pointer" onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}>
                  Trending / Featured
                </Label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : editingEvent ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminEvents() {
  return (
    <Suspense fallback={<div>Loading events...</div>}>
      <AdminEventsContent />
    </Suspense>
  );
}
