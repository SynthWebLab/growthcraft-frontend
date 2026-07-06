"use client";

import React, { useState } from "react";
import { useAdminAuditLogs } from "@/hooks/queries/useAdmin";
import { DataTable } from "@/components/admin/DataTable";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AdminAuditLogsPage() {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState("");
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  // Queries
  const { data: logsData, isLoading } = useAdminAuditLogs({
    page,
    limit: 15,
    action: actionFilter,
  });

  const logsList = logsData?.data || [];
  const pagination = logsData?.meta?.pagination || { page: 1, totalPages: 1 };

  const handleSearch = (val: string) => {
    setActionFilter(val);
    setPage(1);
  };

  // Columns definition
  const columns = [
    {
      key: "timestamp",
      label: "Timestamp",
      render: (val: any) => new Date(val).toLocaleString(),
    },
    {
      key: "action",
      label: "Action",
      render: (val: any) => (
        <Badge variant="outline" className="font-mono text-xs uppercase">
          {val}
        </Badge>
      ),
    },
    {
      key: "performedBy",
      label: "Performed By",
      render: (val: any) => {
        if (!val) return "System";
        return (
          <div>
            <div className="font-semibold text-xs">{val.fullName}</div>
            <div className="text-[10px] text-muted-foreground">{val.email} ({val.role})</div>
          </div>
        );
      },
    },
    {
      key: "target",
      label: "Target Resource ID",
      render: (val: any) => <span className="font-mono text-xs text-muted-foreground">{val}</span>,
    },
    {
      key: "ip",
      label: "IP Address",
      render: (val: any) => <span className="text-xs text-muted-foreground">{val || "N/A"}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Audit Logs</h1>
        <p className="text-muted-foreground">
          View a secure, chronological ledger of all administrative activities and database modifications.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Activity Trails</CardTitle>
          <CardDescription>
            Search logs by action prefix or target ID. Click "View Details" in actions to review json payload changes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <DataTable
            columns={columns}
            data={logsList}
            isLoading={isLoading}
            onSearch={handleSearch}
            searchPlaceholder="Search audit actions (e.g. course.publish, payout.record)..."
            onView={(row) => setSelectedLog(row)}
          />

          {/* Simple pagination triggers */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {page} of {pagination.totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(pagination.totalPages || 1, p + 1))}
              disabled={page >= (pagination.totalPages || 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detail JSON viewer dialog */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Payload Details</DialogTitle>
            <DialogDescription>
              Review the detailed state delta payload logged for action: <span className="font-mono font-bold">{selectedLog?.action}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted p-4 rounded-lg overflow-x-auto max-h-[450px]">
            <pre className="text-xs font-mono">
              {JSON.stringify(selectedLog?.changes || { message: "No payload modifications logged." }, null, 2)}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
