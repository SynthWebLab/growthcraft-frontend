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
import { Building2 } from "lucide-react";
import {
  useAdminRegistrations,
  useUpdateAdminRegistration,
  useDeleteAdminRegistration,
} from "@/hooks/queries/useAdmin";

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  payment_status: string | null;
  amount: number | null;
  notes: string | null;
  course_id: string | null;
  training_program_id: string | null;
  event_id: string | null;
  item_type: string;
  item_title: string;
  selected_company?: {
    companyName: string;
    role?: string;
    duration?: string;
    stipend?: string;
    mode?: string;
  } | null;
  created_at: string;
}

const statuses = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

const paymentStatuses = [
  { value: "unpaid", label: "Unpaid" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "refunded", label: "Refunded" },
];

export default function AdminRegistrations() {
  const { data: regsRes, isLoading } = useAdminRegistrations();
  const updateMutation = useUpdateAdminRegistration();
  const deleteMutation = useDeleteAdminRegistration();

  const registrations: Registration[] = regsRes?.data || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [formData, setFormData] = useState({
    status: "pending",
    payment_status: "unpaid",
    notes: "",
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleView = (registration: Registration) => {
    setSelectedRegistration(registration);
    setFormData({
      status: registration.status,
      payment_status: registration.payment_status || "unpaid",
      notes: registration.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (registration: Registration) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;

    try {
      await deleteMutation.mutateAsync({
        id: registration.id,
        itemType: registration.item_type,
      });
      if (paginatedRegistrations.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error) {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRegistration) return;

    try {
      await updateMutation.mutateAsync({
        id: selectedRegistration.id,
        data: {
          status: formData.status,
          payment_status: formData.payment_status,
          notes: formData.notes,
          item_type: selectedRegistration.item_type,
        },
      });
      setIsDialogOpen(false);
    } catch (error) {
      // ignore
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default" as const;
      case "pending":
        return "secondary" as const;
      case "rejected":
        return "destructive" as const;
      case "cancelled":
        return "outline" as const;
      default:
        return "secondary" as const;
    }
  };

  const getPaymentBadgeVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default" as const;
      case "pending":
        return "secondary" as const;
      case "unpaid":
        return "destructive" as const;
      case "refunded":
        return "outline" as const;
      default:
        return "secondary" as const;
    }
  };

  const getRegistrationType = (reg: Registration) => {
    if (reg.item_type === "course") return "Course";
    if (reg.item_type === "training-program") return "Training";
    if (reg.item_type === "event") return "Event";
    return "Unknown";
  };

  const filteredRegistrations = registrations.filter((reg) =>
    reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.item_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getRegistrationType(reg).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageSize = 15;
  const totalPages = Math.ceil(filteredRegistrations.length / pageSize);
  const paginatedRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone", render: (value: string) => value || "-" },
    {
      key: "item_title",
      label: "Program/Course",
      render: (value: string, row: Registration) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-xs text-foreground line-clamp-1">{value}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {getRegistrationType(row)}
          </span>
        </div>
      ),
    },
    {
      key: "selected_company",
      label: "Internship Partner",
      render: (value: any, row: Registration) => {
        if (row.item_type !== "training-program") return <span className="text-muted-foreground text-xs">—</span>;
        if (!value || !value.companyName) {
          return (
            <span className="text-muted-foreground text-[11px] italic">
              Not chosen
            </span>
          );
        }
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-xs text-foreground flex items-center gap-1">
              <Building2 className="h-3 w-3 text-emerald-600 shrink-0" />
              {value.companyName}
            </span>
            {value.role && (
              <span className="text-[10px] text-muted-foreground line-clamp-1">
                {value.role}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge variant={getStatusBadgeVariant(value)} className="capitalize text-[10px] font-semibold py-0.5 px-2">
          {value}
        </Badge>
      ),
    },
    {
      key: "payment_status",
      label: "Payment",
      render: (value: string) => (
        <Badge variant={getPaymentBadgeVariant(value || "unpaid")} className="capitalize text-[10px] font-semibold py-0.5 px-2">
          {value || "Unpaid"}
        </Badge>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (value: number) => (value ? `₹${value}` : "-"),
    },
    {
      key: "created_at",
      label: "Date",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Registrations</h1>
        <p className="text-muted-foreground mt-1">Manage course, training & event registrations</p>
      </div>

      <DataTable
        columns={columns}
        data={paginatedRegistrations}
        searchPlaceholder="Search registrations..."
        onSearch={handleSearch}
        onView={handleView}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredRegistrations.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredRegistrations.length)} of {filteredRegistrations.length} registrations
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-4">
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{selectedRegistration.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{selectedRegistration.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{selectedRegistration.phone || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="outline">{getRegistrationType(selectedRegistration)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Title:</span>
                  <span className="font-medium text-right max-w-[260px] line-clamp-2">
                    {selectedRegistration.item_title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">
                    {selectedRegistration.amount ? `₹${selectedRegistration.amount}` : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {new Date(selectedRegistration.created_at).toLocaleString()}
                  </span>
                </div>

                {selectedRegistration.item_type === "training-program" && selectedRegistration.selected_company && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" /> Selected Internship Partner
                      </span>
                      <Badge variant="outline" className="bg-emerald-500/20 text-emerald-800 border-emerald-500/30 text-[10px]">
                        Chosen at Enrollment
                      </Badge>
                    </div>
                    <p className="font-bold text-sm text-emerald-950">
                      {selectedRegistration.selected_company.companyName}
                    </p>
                    {selectedRegistration.selected_company.role && (
                      <p className="text-xs text-emerald-800">
                        Role: {selectedRegistration.selected_company.role}
                      </p>
                    )}
                    {selectedRegistration.selected_company.stipend && (
                      <p className="text-[11px] text-emerald-700">
                        Perks: {selectedRegistration.selected_company.stipend}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t">
                <div className="grid gap-4 md:grid-cols-2">
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
                    <Label htmlFor="payment_status">Payment Status</Label>
                    <Select
                      value={formData.payment_status}
                      onValueChange={(value) => setFormData({ ...formData, payment_status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
