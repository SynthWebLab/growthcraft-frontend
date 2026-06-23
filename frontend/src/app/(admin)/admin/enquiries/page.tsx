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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  enquiry_type: string;
  source_page: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

const statuses = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: "1",
    name: "Aman Gupta",
    email: "aman.g@gmail.com",
    phone: "+91 99887 76655",
    message: "I want to know if there's any job placement support after the Full-Stack Web Development Bootcamp.",
    enquiry_type: "bootcamp_inquiry",
    source_page: "/bootcamps/full-stack-web-dev",
    status: "new",
    notes: null,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "2",
    name: "Karan Johar",
    email: "karan.johar@dharmaprod.com",
    phone: "+91 98989 89898",
    message: "We would like to hire 15+ React/Node developers through your placement drives.",
    enquiry_type: "hiring_inquiry",
    source_page: "/employers",
    status: "contacted",
    notes: "Emailed them details of our talent pool and scheduled a call for tomorrow.",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "3",
    name: "Sheela Dixit",
    email: "sheela.dixit@vit.ac.in",
    phone: "+91 88776 65544",
    message: "Requesting details on establishing a student training program tie-up with our university.",
    enquiry_type: "partnership_inquiry",
    source_page: "/colleges",
    status: "in_progress",
    notes: "Sent proposal draft, waiting for response from the Dean.",
    created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
  },
];

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [formData, setFormData] = useState({
    status: "new",
    notes: "",
  });

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      // Simulate API fetch delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      setEnquiries(INITIAL_ENQUIRIES);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleView = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setFormData({
      status: enquiry.status,
      notes: enquiry.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (enquiry: Enquiry) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;

    try {
      setEnquiries((prev) => prev.filter((e) => e.id !== enquiry.id));
      toast.success("Enquiry deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Error deleting enquiry");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEnquiry) return;

    try {
      setEnquiries((prev) =>
        prev.map((e) =>
          e.id === selectedEnquiry.id
            ? {
                ...e,
                status: formData.status,
                notes: formData.notes || null,
              }
            : e
        )
      );

      toast.success("Enquiry updated successfully");
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Error updating enquiry");
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "new":
        return "default" as const;
      case "contacted":
        return "secondary" as const;
      case "in_progress":
        return "outline" as const;
      case "resolved":
        return "default" as const;
      case "closed":
        return "secondary" as const;
      default:
        return "secondary" as const;
    }
  };

  const filteredEnquiries = enquiries.filter((enquiry) =>
    enquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (enquiry.message && enquiry.message.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone", render: (value: string) => value || "-" },
    {
      key: "enquiry_type",
      label: "Type",
      render: (value: string) => (
        <Badge variant="outline" className="capitalize">
          {value.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge variant={getStatusBadgeVariant(value)} className="capitalize">
          {value.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Enquiries</h1>
        <p className="text-muted-foreground mt-1">Manage enquiries from website forms</p>
      </div>

      <DataTable
        columns={columns}
        data={filteredEnquiries}
        searchPlaceholder="Search enquiries..."
        onSearch={setSearchQuery}
        onView={handleView}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
          </DialogHeader>
          {selectedEnquiry && (
            <div className="space-y-4">
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{selectedEnquiry.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{selectedEnquiry.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{selectedEnquiry.phone || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="outline" className="capitalize">
                    {selectedEnquiry.enquiry_type.replace(/_/g, " ")}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Source:</span>
                  <span className="font-medium">{selectedEnquiry.source_page || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {new Date(selectedEnquiry.created_at).toLocaleString()}
                  </span>
                </div>
                {selectedEnquiry.message && (
                  <div className="pt-2 border-t">
                    <p className="text-muted-foreground mb-1">Message:</p>
                    <p className="bg-muted p-3 rounded-lg">{selectedEnquiry.message}</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Internal Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    placeholder="Add internal notes..."
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Close
                  </Button>
                  <Button type="submit">Update</Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
