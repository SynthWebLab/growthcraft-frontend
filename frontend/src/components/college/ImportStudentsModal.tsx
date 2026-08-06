"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Upload, FileText, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useImportStudents, collegeKeys } from "@/hooks/queries/useCollege";
import { toast } from "sonner";

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ParsedPreviewRow {
  fullName: string;
  email: string;
  phone: string;
  enrollmentNumber: string;
  degree: string;
  branch: string;
  yearOfStudy: string;
  isValid: boolean;
  validationError?: string;
}

const SAMPLE_CSV_CONTENT = `fullName,email,phone,enrollmentNumber,degree,branch,yearOfStudy
Aarav Sharma,aarav.sharma@example.edu,+919876543210,EN2024001,B.Tech,Computer Science,3
Priya Patel,priya.patel@example.edu,+919876543211,EN2024002,B.Tech,Information Technology,2
Rohan Verma,rohan.verma@example.edu,+919876543212,EN2024003,B.Sc,Data Science,1`;

export function downloadSampleCsv() {
  const blob = new Blob([`\uFEFF${SAMPLE_CSV_CONTENT}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "growthcraft_students_sample.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function ImportStudentsModal({ isOpen, onClose }: ImportStudentsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [rawCsv, setRawCsv] = useState<string>("");
  const [previewRows, setPreviewRows] = useState<ParsedPreviewRow[]>([]);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const importMutation = useImportStudents();

  const handleReset = () => {
    setFile(null);
    setRawCsv("");
    setPreviewRows([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const parseCsvPreview = (text: string) => {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      setPreviewRows([]);
      return;
    }

    const rawHeaders = parseCsvLine(lines[0]);
    const headers = rawHeaders.map((h) =>
      h.toLowerCase().replace(/^["']|["']$/g, "").replace(/[\s_-]+/g, "").trim()
    );
    
    const findIndex = (aliases: string[]) => {
      return headers.findIndex((h) => aliases.includes(h));
    };

    const nameIdx = findIndex(["fullname", "name", "studentname"]);
    const emailIdx = findIndex(["email", "emailaddress", "mail"]);
    const phoneIdx = findIndex(["phone", "mobile", "mobilenumber", "phonenumber", "phoneno", "contact", "contactnumber"]);
    const rollIdx = findIndex(["enrollmentnumber", "enrollment", "roll", "rollnumber", "rollno", "regno", "registrationnumber", "studentid"]);
    const degreeIdx = findIndex(["degree"]);
    const branchIdx = findIndex(["branch", "stream", "department"]);
    const yearIdx = findIndex(["yearofstudy", "year", "classyear"]);

    const rows: ParsedPreviewRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCsvLine(lines[i]);
      const getVal = (idx: number) => {
        if (idx === -1 || !cols[idx]) return "";
        return cols[idx].replace(/^["']|["']$/g, "").trim();
      };

      const fullName = nameIdx !== -1 ? getVal(nameIdx) : (cols[0] || "");
      const email = emailIdx !== -1 ? getVal(emailIdx) : (cols[1] || "");
      const phone = phoneIdx !== -1 ? getVal(phoneIdx) : (cols[2] || "");
      const enrollmentNumber = rollIdx !== -1 ? getVal(rollIdx) : (cols[3] || "");
      const degree = degreeIdx !== -1 ? getVal(degreeIdx) : (cols[4] || "");
      const branch = branchIdx !== -1 ? getVal(branchIdx) : (cols[5] || "");
      const yearOfStudy = yearIdx !== -1 ? getVal(yearIdx) : (cols[6] || "");

      let isValid = true;
      let validationError = "";

      if (!fullName) {
        isValid = false;
        validationError = "Missing full name";
      } else if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        isValid = false;
        validationError = "Invalid or missing email";
      }

      rows.push({
        fullName,
        email,
        phone,
        enrollmentNumber,
        degree,
        branch,
        yearOfStudy,
        isValid,
        validationError,
      });
    }

    setPreviewRows(rows);
  };

  const handleFileSelect = async (selectedFile: File) => {
    if (!selectedFile.name.endsWith(".csv")) {
      toast.error("Invalid file format", {
        description: "Please upload a valid .csv file",
      });
      return;
    }
    setFile(selectedFile);
    const text = await selectedFile.text();
    setRawCsv(text);
    parseCsvPreview(text);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleImport = () => {
    if (!rawCsv) return;
    importMutation.mutate(
      { csv: rawCsv },
      {
        onSuccess: (res: any) => {
          const data = res?.data;
          const created = data?.created ?? 0;
          const linked = data?.linkedExisting ?? 0;
          const skipped = data?.skipped?.length ?? 0;

          toast.success("Student cohort imported successfully", {
            description: `Imported: ${created} new, ${linked} linked. Skipped: ${skipped}`,
          });
          queryClient.invalidateQueries({ queryKey: collegeKeys.all });
          handleReset();
          onClose();
        },
        onError: (err: any) => {
          const errorMsg = err?.response?.data?.error?.message || err?.message || "Failed to import CSV";
          toast.error("Import failed", { description: errorMsg });
        },
      }
    );
  };

  const validCount = previewRows.filter((r) => r.isValid).length;
  const invalidCount = previewRows.length - validCount;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && (handleReset(), onClose())}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Upload className="h-5 w-5 text-magenta" /> Import Student Cohort
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Upload your college student list CSV file to add students to your cohort.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
          {/* Top Banner / Guidance */}
          <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Required & Supported CSV Headers
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadSampleCsv}
                className="h-8 text-xs gap-1.5 text-magenta border-magenta/30 hover:bg-magenta/10"
              >
                <Download className="h-3.5 w-3.5" /> Download Sample CSV
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-background border border-border">
                <span className="font-semibold text-emerald-600 block mb-0.5">Required Fields:</span>
                <code className="text-[11px] text-muted-foreground">fullName, email</code>
              </div>
              <div className="p-2 rounded bg-background border border-border">
                <span className="font-semibold text-lavender block mb-0.5">Optional Fields:</span>
                <code className="text-[11px] text-muted-foreground">phone, enrollmentNumber, degree, branch, yearOfStudy</code>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          {!file ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-3 ${
                isDragOver ? "border-magenta bg-magenta/5" : "border-border hover:border-magenta/50 hover:bg-muted/30"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />
              <div className="h-12 w-12 rounded-full bg-lavender/10 flex items-center justify-center text-magenta">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium">Click to upload or drag & drop CSV file</p>
                <p className="text-xs text-muted-foreground mt-0.5">Supports .csv format (max 5MB)</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selected File Card */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-magenta/10 text-magenta flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB • {previewRows.length} total rows detected
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleReset} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Status Summary Pill */}
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <CheckCircle2 className="h-4 w-4" /> {validCount} valid rows
                </span>
                {invalidCount > 0 && (
                  <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                    <AlertCircle className="h-4 w-4" /> {invalidCount} rows missing mandatory data
                  </span>
                )}
              </div>

              {/* Preview Table */}
              {previewRows.length > 0 && (
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground border-b border-border">
                    CSV Data Preview (First {Math.min(5, previewRows.length)} rows)
                  </div>
                  <div className="overflow-x-auto max-h-48">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-muted/50 border-b border-border font-medium text-muted-foreground">
                        <tr>
                          <th className="px-3 py-2">Full Name</th>
                          <th className="px-3 py-2">Email</th>
                          <th className="px-3 py-2">Phone</th>
                          <th className="px-3 py-2">Roll No</th>
                          <th className="px-3 py-2">Degree/Branch</th>
                          <th className="px-3 py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {previewRows.slice(0, 5).map((row, idx) => (
                          <tr key={idx} className={row.isValid ? "hover:bg-muted/20" : "bg-amber-500/10"}>
                            <td className="px-3 py-2 font-medium">{row.fullName || "—"}</td>
                            <td className="px-3 py-2 text-muted-foreground">{row.email || "—"}</td>
                            <td className="px-3 py-2 text-muted-foreground">{row.phone || "—"}</td>
                            <td className="px-3 py-2 text-muted-foreground">{row.enrollmentNumber || "—"}</td>
                            <td className="px-3 py-2 text-muted-foreground">
                              {row.degree || row.branch ? `${row.degree} ${row.branch}` : "—"}
                            </td>
                            <td className="px-3 py-2">
                              {row.isValid ? (
                                <span className="text-emerald-600 font-medium">Valid</span>
                              ) : (
                                <span className="text-amber-600 font-medium">{row.validationError}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 border-t border-border flex items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={() => (handleReset(), onClose())}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleImport}
            disabled={!file || validCount === 0 || importMutation.isPending}
            className="bg-magenta text-white hover:bg-magenta/90"
          >
            {importMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Importing…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" /> Confirm & Import {validCount > 0 ? `(${validCount} Rows)` : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
