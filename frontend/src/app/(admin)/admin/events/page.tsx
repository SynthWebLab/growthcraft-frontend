"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEvents } from "@/hooks/queries/useEvents";
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

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_type: string | null;
  event_date: string | null;
  event_time: string | null;
  location: string | null;
  is_online: boolean;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
}

const eventTypes = ["Workshop", "Bootcamp", "Hackathon"];

function AdminEventsContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type"); // Workshop, Bootcamp, Hackathon

  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_type: "",
    event_date: "",
    event_time: "",
    location: "",
    is_online: false,
    is_published: false,
    is_featured: false,
  });

  // Queries & Mutations
  // We pass the type parameter to filter in backend public events API
  const { data: eventsData, isLoading } = useEvents({
    type: (typeParam as any) || undefined,
  });
  
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();

  const rawEvents = (eventsData as any)?.items || (eventsData as any)?.data || [];
  const events: Event[] = rawEvents.map((e: any) => ({
    id: e._id || e.id,
    title: e.title,
    description: e.description || null,
    event_type: e.type || "Workshop",
    event_date: e.startDate ? new Date(e.startDate).toISOString().split('T')[0] : null,
    event_time: e.startDate ? new Date(e.startDate).toTimeString().split(' ')[0].substring(0, 5) : "",
    location: e.venue?.name || e.zoomLink || "Virtual",
    is_online: e.mode === "Online",
    is_published: e.isPublished,
    is_featured: e.isFeatured,
    created_at: e.createdAt || new Date().toISOString(),
  }));

  const handleAdd = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      event_type: typeParam || "Workshop",
      event_date: "",
      event_time: "",
      location: "",
      is_online: true,
      is_published: false,
      is_featured: false,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || "",
      event_type: event.event_type || "Workshop",
      event_date: event.event_date || "",
      event_time: event.event_time || "",
      location: event.location || "",
      is_online: event.is_online,
      is_published: event.is_published,
      is_featured: event.is_featured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (event: Event) => {
    if (!confirm(`Are you sure you want to delete "${event.title}"?`)) return;

    deleteMutation.mutate(event.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const startDateTime = formData.event_date
      ? new Date(`${formData.event_date}T${formData.event_time || "00:00"}:00`).toISOString()
      : new Date().toISOString();
      
    const endDateStr = new Date(new Date(startDateTime).getTime() + 24 * 60 * 60 * 1000).toISOString();

    const eventData = {
      title: formData.title,
      type: formData.event_type || typeParam || "Workshop",
      domain: "Technology", // default domain
      durationDays: 1,
      price: 0,
      startDate: startDateTime,
      endDate: endDateStr,
      maxSeats: 50,
      description: formData.description || null,
      mode: formData.is_online ? "Online" : "Offline",
      venue: formData.is_online ? undefined : { name: formData.location || "On Campus", address: "Campus Venue", city: "Campus", state: "Campus" },
      zoomLink: formData.is_online ? (formData.location || "http://zoom.us") : undefined,
      isPublished: formData.is_published,
      isFeatured: formData.is_featured,
    };

    if (editingEvent) {
      updateMutation.mutate(
        { id: editingEvent.id, data: eventData },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
          },
        }
      );
    } else {
      createMutation.mutate(eventData, {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      });
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: "title", label: "Title" },
    { key: "event_type", label: "Type" },
    {
      key: "event_date",
      label: "Date",
      render: (value: string) =>
        value ? new Date(value).toLocaleDateString() : "-",
    },
    { key: "location", label: "Location" },
    {
      key: "is_online",
      label: "Mode",
      render: (value: boolean) => (
        <Badge variant="outline">{value ? "Online" : "Offline"}</Badge>
      ),
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

  const pageTitle = typeParam ? `${typeParam}s` : "Events";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{pageTitle}</h1>
        <p className="text-muted-foreground mt-1">Manage scheduled {pageTitle.toLowerCase()}</p>
      </div>

      <DataTable
        columns={columns}
        data={filteredEvents}
        searchPlaceholder={`Search ${pageTitle.toLowerCase()}...`}
        onSearch={setSearchQuery}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonLabel={`Add ${typeParam || "Event"}`}
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? `Edit ${typeParam || "Event"}` : `Add New ${typeParam || "Event"}`}
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
                <Label htmlFor="event_type">Event Type</Label>
                <Select
                  value={formData.event_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, event_type: value })
                  }
                  disabled={!!typeParam} // Disable if preset by sidebar submenu
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event_date">Event Date</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={(e) =>
                    setFormData({ ...formData, event_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event_time">Event Time</Label>
                <Input
                  id="event_time"
                  type="time"
                  value={formData.event_time}
                  onChange={(e) =>
                    setFormData({ ...formData, event_time: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location / URL</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder={formData.is_online ? "Zoom/Meet URL" : "e.g., Room 101, City Campus"}
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
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_online"
                  checked={formData.is_online}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_online: checked })
                  }
                />
                <Label htmlFor="is_online">Online Event</Label>
              </div>
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
                {editingEvent ? "Update" : "Create"} {typeParam || "Event"}
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
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    }>
      <AdminEventsContent />
    </Suspense>
  );
}
