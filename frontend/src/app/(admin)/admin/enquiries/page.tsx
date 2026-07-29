"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
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
import {
  useAdminEnquiries,
  useUpdateAdminEnquiry,
  useDeleteAdminEnquiry,
} from "@/hooks/queries/useAdmin";

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

export default function AdminEnquiries() {
  const { data: enquiriesRes, isLoading } = useAdminEnquiries();
  const updateMutation = useUpdateAdminEnquiry();
  const deleteMutation = useDeleteAdminEnquiry();

  const enquiries: Enquiry[] = enquiriesRes?.data || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [formData, setFormData] = useState({
    status: "new",
    notes: "",
  });

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
      await deleteMutation.mutateAsync({
        id: enquiry.id,
        enquiryType: enquiry.enquiry_type,
      });
    } catch (error) {
      console.error("Error deleting enquiry:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEnquiry) return;

    try {
      await updateMutation.mutateAsync({
        id: selectedEnquiry.id,
        data: {
          status: formData.status,
          notes: formData.notes,
          enquiry_type: selectedEnquiry.enquiry_type,
        },
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating enquiry:", error);
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
        <Badge variant="outline" className="capitalize text-[10px] font-semibold py-0.5 px-2">
          {value.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge variant={getStatusBadgeVariant(value)} className="capitalize text-[10px] font-semibold py-0.5 px-2">
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
                    <p className="bg-muted p-3 rounded-lg whitespace-pre-wrap">{selectedEnquiry.message}</p>
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
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? "Updating..." : "Update"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
