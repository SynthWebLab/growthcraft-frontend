"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Loader2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEventAccessStudents, useUpdateEventAccess } from "@/hooks/queries/useCollege";
import { toast } from "sonner";

interface ManageAccessDialogProps {
  eventId: string;
  eventTitle: string;
  eventType: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ManageAccessDialog({
  eventId,
  eventTitle,
  eventType,
  isOpen,
  onClose,
}: ManageAccessDialogProps) {
  const { data: response, isLoading } = useEventAccessStudents(eventId);
  const updateAccess = useUpdateEventAccess();

  const students = useMemo(() => response?.data ?? [], [response]);
  
  // Local state for selected student IDs
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);

  // Initialize selected IDs from fetched access status
  useEffect(() => {
    if (students.length > 0) {
      const initialSelected = students
        .filter((student) => student.hasAccess)
        .map((student) => student.userId);
      setSelectedIds(initialSelected);
    } else {
      setSelectedIds([]);
    }
  }, [students]);

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return students;
    return students.filter(
      (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    );
  }, [students, searchQuery]);

  // Determine if all filtered students are selected
  const allFilteredSelected = useMemo(() => {
    if (filteredStudents.length === 0) return false;
    return filteredStudents.every((s) => selectedIds.includes(s.userId));
  }, [filteredStudents, selectedIds]);

  // Toggle selection for a single student
  const handleToggleStudent = (studentId: string) => {
    setSelectedIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Toggle all filtered students
  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      // Deselect all filtered students
      const filteredIds = filteredStudents.map((s) => s.userId);
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      // Select all filtered students
      const newIds = filteredStudents
        .map((s) => s.userId)
        .filter((id) => !selectedIds.includes(id));
      setSelectedIds((prev) => [...prev, ...newIds]);
    }
  };

  // Save changes by comparing current selectedIds with initial state
  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const initialAccessIds = students
        .filter((s) => s.hasAccess)
        .map((s) => s.userId);

      const toGrant = selectedIds.filter((id) => !initialAccessIds.includes(id));
      const toRevoke = initialAccessIds.filter((id) => !selectedIds.includes(id));

      if (toGrant.length === 0 && toRevoke.length === 0) {
        toast.info("No changes made.");
        setSaving(false);
        onClose();
        return;
      }

      let grantSuccess = true;
      let revokeSuccess = true;

      if (toGrant.length > 0) {
        const res = await updateAccess.mutateAsync({
          eventId,
          data: { studentIds: toGrant, action: "grant" },
        });
        grantSuccess = res.success;
      }

      if (toRevoke.length > 0) {
        const res = await updateAccess.mutateAsync({
          eventId,
          data: { studentIds: toRevoke, action: "revoke" },
        });
        revokeSuccess = res.success;
      }

      if (grantSuccess && revokeSuccess) {
        toast.success("Access updated successfully!");
        onClose();
      } else {
        toast.error("Some updates failed. Please try again.");
      }
    } catch (error) {
      // Error is handled by query mutation, but we catch to stop loader
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-white border border-border shadow-xl rounded-xl p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-bold font-display">Manage Access</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Choose which cohort students have access to the {eventType.toLowerCase()}:{" "}
            <span className="font-semibold text-foreground">{eventTitle}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 border-border bg-marble/50 focus:bg-white text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds(students.map((s) => s.userId))}
              className="text-xs h-9"
            >
              Grant All
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds([])}
              className="text-xs h-9 text-destructive hover:bg-destructive/5 hover:text-destructive border-destructive/20"
            >
              Revoke All
            </Button>
          </div>
        </div>

        {/* Students List Table */}
        <div className="relative border border-border rounded-lg overflow-hidden bg-marble/25 max-h-[300px] overflow-y-auto mt-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-6 w-6 animate-spin text-magenta" />
              Loading cohort students…
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No students found matching your search.
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-marble border-b border-border text-xs text-muted-foreground font-semibold uppercase">
                  <th className="py-3 px-4 w-12 text-center">
                    <Checkbox
                      checked={allFilteredSelected}
                      onCheckedChange={handleToggleSelectAll}
                      aria-label="Select all matching students"
                    />
                  </th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4 text-center w-24">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStudents.map((student) => {
                  const isChecked = selectedIds.includes(student.userId);
                  return (
                    <tr
                      key={student.userId}
                      onClick={() => handleToggleStudent(student.userId)}
                      className="hover:bg-marble/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => handleToggleStudent(student.userId)}
                          aria-label={`Select ${student.name}`}
                        />
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground">
                        {student.name}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {student.email}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold select-none ${
                            isChecked
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-muted text-muted-foreground border border-border"
                          }`}
                        >
                          {isChecked ? (
                            <>
                              <Check className="h-3 w-3" /> Enrolled
                            </>
                          ) : (
                            "No Access"
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2 border-t border-border pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
            className="w-full sm:w-auto h-9 text-sm"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSaveChanges}
            disabled={saving || isLoading}
            className="w-full sm:w-auto bg-magenta hover:bg-magenta/90 text-white font-medium h-9 text-sm"
          >
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Access
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
