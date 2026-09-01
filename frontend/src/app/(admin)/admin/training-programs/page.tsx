"use client";

import { useState } from "react";
import {
  useAdminTrainingPrograms,
  useCreateTrainingProgram,
  useUpdateTrainingProgram,
  useDeleteTrainingProgram,
  usePublishTrainingProgram,
  useAdminMentors,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Flame, Plus, Building2, Trash2, Briefcase } from "lucide-react";
import { PartnerLogo } from "@/components/common/PartnerLogo";

/* ─── Constants ─────────────────────────────────────────────── */

const DOMAINS = [
  "Full Stack Development",
  "Data Science & AI",
  "UI/UX Design",
  "Cloud & DevOps",
  "Cybersecurity",
  "Digital Marketing",
  "Business Analytics",
  "Other",
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const INTERNSHIP_MODES = ["Hybrid", "Remote", "On-site", "Campus Hub", "Offline"];

export interface FormPartner {
  companyName: string;
  role: string;
  duration?: string;
  mode?: string;
  description?: string;
}

const DEFAULT_FORM_PARTNERS: FormPartner[] = [
  {
    companyName: "SynthWeb",
    role: "Full Stack & Enterprise Software Intern",
    duration: "60 Days",
    mode: "Hybrid",
    description: "Work on live enterprise client software and microservices systems.",
  },
  {
    companyName: "Social Stories",
    role: "Product Engineering & Growth Intern",
    duration: "60 Days",
    mode: "Hybrid",
    description: "Build modern user-facing web applications and growth tooling.",
  },
];

const EMPTY_FORM = {
  title: "",
  description: "",
  domain: "Full Stack Development",
  level: "Beginner",
  durationDays: "",
  price: "",
  originalPrice: "",
  tools: "",
  batchSize: "",
  is_published: false,
  is_featured: false,
  selectedMentorIds: [] as string[],
  mentorNames: "",
  prerequisites: "",
  internshipPartners: DEFAULT_FORM_PARTNERS as FormPartner[],
};

/* ─── Component ─────────────────────────────────────────────── */

export default function AdminTrainingPrograms() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  /* Queries */
  const { data: programsData, isLoading } = useAdminTrainingPrograms({ limit: 100 });
  const { data: mentorsData } = useAdminMentors({ limit: 100 });
  const createMutation = useCreateTrainingProgram();
  const updateMutation = useUpdateTrainingProgram();
  const deleteMutation = useDeleteTrainingProgram();
  const publishMutation = usePublishTrainingProgram();

  /* Derive data */
  const rawPrograms =
    (programsData as any)?.data?.items ||
    (programsData as any)?.items ||
    (Array.isArray((programsData as any)?.data) ? (programsData as any).data : []);
  const programs: any[] = Array.isArray(rawPrograms)
    ? [...rawPrograms].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    : [];

  const rawMentors =
    (mentorsData as any)?.data?.items ||
    (mentorsData as any)?.data?.mentors ||
    (mentorsData as any)?.items ||
    (mentorsData as any)?.mentors ||
    (Array.isArray((mentorsData as any)?.data) ? (mentorsData as any).data : []);
  const registeredMentors: any[] = Array.isArray(rawMentors) ? rawMentors : [];

  const filteredPrograms = programs.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.domain?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ─── Handlers ─────────────────────────────────────────────── */

  const handleAdd = () => {
    setEditingProgram(null);
    setFormData(EMPTY_FORM);
    setIsDialogOpen(true);
  };

  const handleEdit = (program: any) => {
    setEditingProgram(program);
    const existingMentorIds = (program.mentors || []).map((m: any) => m.userId || m._id || "").filter(Boolean);
    const existingPartners =
      Array.isArray(program.internshipPartners) && program.internshipPartners.length > 0
        ? program.internshipPartners.map((p: any) => ({
            companyName: p.companyName || "",
            role: p.role || "Industrial Intern",
            duration: p.duration || `${program.durationDays || 60} Days`,
            mode: p.mode || "Hybrid",
            description: p.description || "",
          }))
        : DEFAULT_FORM_PARTNERS;

    const existingPrereqs = Array.isArray(program.prerequisites)
      ? program.prerequisites.map((p: any) => typeof p === 'string' ? p : p.text || String(p)).join(", ")
      : (program.prerequisites || "");

    setFormData({
      title: program.title || "",
      description: program.description || "",
      domain: program.domain || "Full Stack Development",
      level: program.level || "Beginner",
      durationDays: (program.durationDays || program.duration || "").toString(),
      price: (program.price ?? "").toString(),
      originalPrice: (program.originalPrice ?? "").toString(),
      tools: Array.isArray(program.tools) ? program.tools.join(", ") : (program.tools || ""),
      batchSize: (program.maxSeats || program.batchSize || "").toString(),
      is_published: !!program.isPublished,
      is_featured: !!program.isFeatured,
      selectedMentorIds: existingMentorIds,
      mentorNames: (program.mentors || []).map((m: any) => m.name || m.fullName || "").filter(Boolean).join(", "),
      prerequisites: existingPrereqs,
      internshipPartners: existingPartners,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (program: any) => {
    const id = program._id || program.id;
    if (!confirm(`Delete "${program.title}"? This cannot be undone.`)) return;
    deleteMutation.mutate(id);
  };

  const handlePublishToggle = (program: any) => {
    const id = program._id || program.id;
    publishMutation.mutate(id);
  };

  const handleFeatureToggle = (program: any) => {
    const id = program._id || program.id;
    updateMutation.mutate({
      id,
      data: { isFeatured: !program.isFeatured },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const toolsArray = formData.tools
      ? formData.tools.split(",").map((t) => t.trim()).filter(Boolean)
      : ["General"];

    const prereqArray = formData.prerequisites
      ? formData.prerequisites
          .split(/,|\n/)
          .map((p) => p.trim())
          .filter(Boolean)
      : [];

    const payload: any = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      domain: formData.domain,
      level: formData.level,
      durationDays: formData.durationDays ? parseInt(formData.durationDays) : 30,
      tools: toolsArray,
      prerequisites: prereqArray,
      price: formData.price ? parseFloat(formData.price) : 0,
      isPublished: formData.is_published,
      isFeatured: formData.is_featured,
      mentorIds: formData.selectedMentorIds,
      internshipPartners: (formData.internshipPartners || []).filter(
        (p: any) => p.companyName && p.companyName.trim() !== ""
      ),
    };

    if (formData.originalPrice) payload.originalPrice = parseFloat(formData.originalPrice);
    if (formData.batchSize) payload.maxSeats = parseInt(formData.batchSize);

    if (editingProgram) {
      const id = editingProgram._id || editingProgram.id;
      updateMutation.mutate({ id, data: payload }, { onSuccess: () => setIsDialogOpen(false) });
    } else {
      createMutation.mutate(payload, { onSuccess: () => setIsDialogOpen(false) });
    }
  };

  /* ─── Table Columns ─────────────────────────────────────────── */

  const columns = [
    { key: "title", label: "Title" },
    { key: "domain", label: "Domain" },
    {
      key: "durationDays",
      label: "Duration",
      render: (v: any, row: any) => {
        const days = v || row.duration;
        return days ? `${days} days` : "—";
      },
    },
    {
      key: "price",
      label: "Price",
      render: (v: number) => (v != null ? `₹${v.toLocaleString()}` : "Free"),
    },
    {
      key: "internshipPartners",
      label: "Internship Partners",
      render: (v: any) => {
        const partners = Array.isArray(v) && v.length > 0 ? v : [
          { companyName: "SynthWeb" },
          { companyName: "Social Stories" },
        ];
        return (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {partners.map((p: any, idx: number) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 flex items-center gap-1"
              >
                <Building2 className="h-2.5 w-2.5" />
                {p.companyName}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: "isPublished",
      label: "Status",
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

  /* ─── Render ─────────────────────────────────────────────────── */

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Training Programs</h1>
        <p className="text-muted-foreground mt-1">
          Manage campus training programs — create, edit, publish, feature, and delete
        </p>
      </div>

      <DataTable
        columns={columns}
        data={filteredPrograms}
        searchPlaceholder="Search programs by title or domain..."
        onSearch={setSearchQuery}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonLabel="+ Add Program"
        isLoading={isLoading}
      />

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-2xl lg:max-w-3xl max-h-[92vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>
              {editingProgram ? "Edit Training Program" : "Add New Training Program"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="tp-title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tp-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Full-Stack Web Development Bootcamp"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="tp-description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="tp-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What this training program covers, outcomes, and target audience..."
                rows={3}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
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

              {/* Level */}
              <div className="space-y-2">
                <Label>Level <span className="text-red-500">*</span></Label>
                <Select value={formData.level} onValueChange={(v) => setFormData({ ...formData, level: v })}>
                  <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((l) => (<SelectItem key={l} value={l}>{l}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="tp-duration">
                  Duration (Days) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tp-duration"
                  type="number"
                  min={1}
                  value={formData.durationDays}
                  onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                  placeholder="e.g. 90"
                  required
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="tp-price">
                  Price (₹) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tp-price"
                  type="number"
                  min={0}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 29999"
                  required
                />
              </div>

              {/* Original Price */}
              <div className="space-y-2">
                <Label htmlFor="tp-originalPrice">Original Price (₹)</Label>
                <Input
                  id="tp-originalPrice"
                  type="number"
                  min={0}
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="e.g. 49999 (strikethrough)"
                />
              </div>

              {/* Batch Size */}
              <div className="space-y-2">
                <Label htmlFor="tp-batchSize">Max Seats / Batch Size</Label>
                <Input
                  id="tp-batchSize"
                  type="number"
                  min={1}
                  value={formData.batchSize}
                  onChange={(e) => setFormData({ ...formData, batchSize: e.target.value })}
                  placeholder="e.g. 30"
                />
              </div>
            </div>

            {/* Tools */}
            <div className="space-y-2">
              <Label htmlFor="tp-tools">Tools / Technologies (comma-separated)</Label>
              <Input
                id="tp-tools"
                value={formData.tools}
                onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                placeholder="e.g. React, Node.js, MongoDB, Docker"
              />
            </div>

            {/* Prerequisites */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tp-prerequisites">Prerequisites (comma or line separated)</Label>
              <Input
                id="tp-prerequisites"
                value={formData.prerequisites}
                onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                placeholder="e.g. Basic JavaScript + React knowledge, Git proficiency"
              />
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

            {/* Internship Partner Companies Management */}
            <div className="space-y-3 md:col-span-2 border rounded-xl p-4 bg-muted/10 border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <Label className="text-sm font-bold">Internship Partner Companies</Label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Partner companies offering student internships for this program (e.g., SynthWeb, Social Stories). Students choose their preferred company during enrollment.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      internshipPartners: [
                        ...formData.internshipPartners,
                        {
                          companyName: "",
                          role: "Industrial Intern",
                          duration: `${formData.durationDays || 60} Days`,
                          mode: "Hybrid",
                          description: "",
                        },
                      ],
                    });
                  }}
                  className="h-8 text-xs font-semibold gap-1 self-start sm:self-auto"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Partner
                </Button>
              </div>

              <div className="space-y-3">
                {formData.internshipPartners.map((partner, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3 rounded-lg border bg-background space-y-2.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2 pb-1 border-b">
                      <span className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <PartnerLogo companyName={partner.companyName} size="sm" className="h-5 w-5 rounded-md" />
                        Partner #{pIdx + 1}: <strong className="text-foreground">{partner.companyName || "New Company"}</strong>
                      </span>
                      {formData.internshipPartners.length > 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const updated = formData.internshipPartners.filter((_, i) => i !== pIdx);
                            setFormData({ ...formData, internshipPartners: updated });
                          }}
                          className="h-6 px-2 text-destructive hover:bg-destructive/10 text-xs"
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">Company Name *</Label>
                        <Input
                          value={partner.companyName}
                          onChange={(e) => {
                            const updated = [...formData.internshipPartners];
                            updated[pIdx].companyName = e.target.value;
                            setFormData({ ...formData, internshipPartners: updated });
                          }}
                          placeholder="e.g. SynthWeb, Social Stories"
                          className="h-8 text-xs"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">Internship Role *</Label>
                        <Input
                          value={partner.role}
                          onChange={(e) => {
                            const updated = [...formData.internshipPartners];
                            updated[pIdx].role = e.target.value;
                            setFormData({ ...formData, internshipPartners: updated });
                          }}
                          placeholder="e.g. Full Stack Developer Intern"
                          className="h-8 text-xs"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Duration</Label>
                        <Input
                          value={partner.duration || ""}
                          onChange={(e) => {
                            const updated = [...formData.internshipPartners];
                            updated[pIdx].duration = e.target.value;
                            setFormData({ ...formData, internshipPartners: updated });
                          }}
                          placeholder="e.g. 60 Days / 2 Months"
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Mode</Label>
                        <Select
                          value={partner.mode || "Hybrid"}
                          onValueChange={(val) => {
                            const updated = [...formData.internshipPartners];
                            updated[pIdx].mode = val;
                            setFormData({ ...formData, internshipPartners: updated });
                          }}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select mode" />
                          </SelectTrigger>
                          <SelectContent>
                            {INTERNSHIP_MODES.map((m) => (
                              <SelectItem key={m} value={m} className="text-xs">
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <Label className="text-[11px]">Description / Project Scope</Label>
                        <Input
                          value={partner.description || ""}
                          onChange={(e) => {
                            const updated = [...formData.internshipPartners];
                            updated[pIdx].description = e.target.value;
                            setFormData({ ...formData, internshipPartners: updated });
                          }}
                          placeholder="e.g. Build live enterprise software systems and microservices."
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                {isPending ? "Saving..." : editingProgram ? "Update Program" : "Create Program"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
