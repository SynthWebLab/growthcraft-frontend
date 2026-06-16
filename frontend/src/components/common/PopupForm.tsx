"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, Phone, GraduationCap, Briefcase, School, UserCheck } from "lucide-react";
import { z } from "zod";
import { FormType } from "@/lib/ctaPolicy";
import { useEnrollCourse, useRequestCallback } from "@/hooks/queries/useCourses";
import { useRegisterBootcamp, useRequestBootcampCallback } from "@/hooks/queries/useBootcamps";
import { useRegisterWorkshop, useRequestWorkshopCallback } from "@/hooks/queries/useWorkshops";
import { useRegisterHackathon, useRequestHackathonCallback } from "@/hooks/queries/useHackathons";
import { useEnrollInTrainingProgram, useRequestTrainingProgramCallback } from "@/hooks/queries/useTrainingPrograms";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

// Validation schemas
const enrollmentSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(15),
});

const callbackSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(15),
});

const enquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(15),
  message: z.string().trim().min(1, "Message is required").max(1000),
  organization: z.string().optional(),
});

type EnrollmentFormData = z.infer<typeof enrollmentSchema>;
type CallbackFormData = z.infer<typeof callbackSchema>;
type EnquiryFormData = z.infer<typeof enquirySchema>;

interface PopupFormProps {
  isOpen: boolean;
  onClose: () => void;
  type: FormType | "enquiry" | "mentor" | "partner";
  title?: string;
  courseId?: string; // Optional: pre-select a course
  courseTitle?: string; // Optional: course title for enrollment
  itemType?: "course" | "workshop" | "bootcamp" | "hackathon" | "training-program";
}

export const PopupForm = ({ isOpen, onClose, type, title, courseId, courseTitle, itemType = "course" }: PopupFormProps) => {
  // Mutations for enroll and callback
  const enrollMutation = useEnrollCourse();
  const bootcampRegisterMutation = useRegisterBootcamp();
  const bootcampCallbackMutation = useRequestBootcampCallback();
  const workshopRegisterMutation = useRegisterWorkshop();
  const workshopCallbackMutation = useRequestWorkshopCallback();
  const hackathonRegisterMutation = useRegisterHackathon();
  const hackathonCallbackMutation = useRequestHackathonCallback();
  const trainingProgramEnrollMutation = useEnrollInTrainingProgram();
  const trainingProgramCallbackMutation = useRequestTrainingProgramCallback();
  
  // Determine context for callback mutation based on form type
  const callbackContext = 
    type === "register-interest" ? "register-interest" : "callback";
  
  const callbackMutation = useRequestCallback(callbackContext);

  // Determine which schema to use
  const getSchema = () => {
    if (type === "enrollment" || type === "reserve-seat") {
      return enrollmentSchema;
    } else if (type === "callback" || type === "register-interest") {
      return callbackSchema;
    } else {
      return enquirySchema;
    }
  };

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EnrollmentFormData | CallbackFormData | EnquiryFormData>({
    resolver: zodResolver(getSchema()),
    mode: "onChange",
  });

  const getIcon = () => {
    switch (type) {
      case "enrollment": 
      case "reserve-seat":
        return <GraduationCap className="h-6 w-6" />;
      case "mentor": return <UserCheck className="h-6 w-6" />;
      case "partner": return <School className="h-6 w-6" />;
      case "callback": 
      case "register-interest":
        return <Phone className="h-6 w-6" />;
      default: return <Briefcase className="h-6 w-6" />;
    }
  };

  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case "enrollment": return "Enroll Now";
      case "enquiry": return "Quick Enquiry";
      case "callback": return "Request Callback";
      case "register-interest": return "Register Interest";
      case "reserve-seat": return "Reserve Your Seat";
      case "mentor": return "Apply as Mentor";
      case "partner": return "Partner With Us";
      default: return "Get in Touch";
    }
  };

  const getDescription = () => {
    switch (type) {
      case "enrollment": return "Fill in your details to enroll in your preferred course or bootcamp.";
      case "enquiry": return "Have questions? Send us a quick message and we'll get back to you.";
      case "callback": return "Leave your number and we'll call you back within 24 hours.";
      case "register-interest": return "Register your interest and we'll notify you when this becomes available.";
      case "reserve-seat": return "Reserve your seat now. Limited spots available!";
      case "mentor": return "Join our team of mentors and inspire the next generation.";
      case "partner": return "Let's discuss how we can collaborate with your institution.";
      default: return "";
    }
  };

  const onSubmit = async (data: EnrollmentFormData | CallbackFormData | EnquiryFormData) => {
    try {
      // Validate based on form type
      if (type === "enrollment" || type === "reserve-seat") {
        // courseId must be provided for enrollment (pre-selected from course page)
        if (!courseId) {
          toast.error(`${itemType === "workshop" ? "Workshop" : itemType === "bootcamp" ? "Bootcamp" : itemType === "hackathon" ? "Hackathon" : itemType === "training-program" ? "Training Program" : "Course"} not selected. Please try again.`);
          return;
        }

        if (itemType === "training-program") {
          await trainingProgramEnrollMutation.mutateAsync({
            programId: courseId,
            data: {
              fullName: data.name,
              email: data.email,
              phone: data.phone,
            },
          });

          reset();
          onClose();
          return;
        }

        if (itemType === "bootcamp") {
          await bootcampRegisterMutation.mutateAsync({
            bootcampId: courseId,
            data: {
              fullName: data.name,
              email: data.email,
              phone: data.phone,
            },
          });

          reset();
          onClose();
          return;
        }

        if (itemType === "workshop") {
          await workshopRegisterMutation.mutateAsync({
            workshopId: courseId,
            data: {
              fullName: data.name,
              email: data.email,
              phone: data.phone,
            },
          });

          reset();
          onClose();
          return;
        }

        if (itemType === "hackathon") {
          await hackathonRegisterMutation.mutateAsync({
            hackathonId: courseId,
            data: {
              fullName: data.name,
              email: data.email,
              phone: data.phone,
            },
          });

          reset();
          onClose();
          return;
        }
        
        // Use the provided courseTitle (it's always passed from course page)
        const courseTitleToSend = courseTitle || "";
        
        // Call enroll API - use collegeName field to store course title
        await enrollMutation.mutateAsync({
          courseId: courseId,
          data: {
            fullName: data.name,
            email: data.email,
            phone: data.phone,
            collegeName: courseTitleToSend, // Store course title in collegeName field
          },
        });

        reset();
        onClose();
      } else if (type === "callback" || type === "register-interest") {
        // courseId must be provided for callback (pre-selected from course page)
        if (!courseId) {
          toast.error(`${itemType === "workshop" ? "Workshop" : itemType === "bootcamp" ? "Bootcamp" : itemType === "hackathon" ? "Hackathon" : itemType === "training-program" ? "Training Program" : "Course"} not selected. Please try again.`);
          return;
        }

        if (itemType === "training-program") {
          await trainingProgramCallbackMutation.mutateAsync({
            programId: courseId,
            data: {
              fullName: data.name,
              email: data.email,
              phone: data.phone,
            },
          });

          reset();
          onClose();
          return;
        }

        if (itemType === "bootcamp") {
          await bootcampCallbackMutation.mutateAsync({
            bootcampId: courseId,
            data: {
              fullName: data.name,
              email: data.email,
              phone: data.phone,
            },
          });

          reset();
          onClose();
          return;
        }

        if (itemType === "workshop") {
          await workshopCallbackMutation.mutateAsync({
            workshopId: courseId,
            data: {
              fullName: data.name,
              email: data.email,
              phone: data.phone,
            },
          });

          reset();
          onClose();
          return;
        }

        if (itemType === "hackathon") {
          await hackathonCallbackMutation.mutateAsync({
            hackathonId: courseId,
            data: {
              fullName: data.name,
              email: data.email,
              phone: data.phone,
            },
          });

          reset();
          onClose();
          return;
        }

        // Call callback API
        await callbackMutation.mutateAsync({
          courseId: courseId,
          data: {
            fullName: data.name,
            email: data.email,
            phone: data.phone,
          },
        });

        reset();
        onClose();
      } else {
        // Prepare payload for leads
        const payload: Record<string, any> = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: (data as EnquiryFormData).message,
        };

        if (type === "mentor") {
          payload.source = "about_mentor";
          payload.role = "Mentor";
          payload.organization = (data as EnquiryFormData).organization;
        } else if (type === "partner") {
          payload.source = "about_partner";
          payload.role = "HiringPartner";
          payload.organization = (data as EnquiryFormData).organization;
        } else {
          payload.source = "about_enquiry";
        }

        // Post to Leads API
        await apiClient.post(API_ENDPOINTS.leads.create, payload);

        const successMessage = type === "mentor"
          ? "Application submitted! We'll review and get back to you."
          : type === "partner"
          ? "Partnership request received! We'll contact you soon."
          : "Thank you! We'll get back to you soon.";

        toast.success(successMessage);
        reset();
        onClose();
      }
    } catch {
      // API errors are handled by the mutation hooks (toast notifications)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary text-primary-foreground">
              {getIcon()}
            </div>
            <div>
              <DialogTitle className="text-xl">{getTitle()}</DialogTitle>
              <DialogDescription className="mt-1">
                {getDescription()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Input
              placeholder="Your Name *"
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Input
              type="email"
              placeholder="Email Address *"
              {...register("email")}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Input
              type="tel"
              placeholder="Phone Number *"
              {...register("phone")}
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
          </div>

          {(type === "enquiry" || type === "mentor" || type === "partner") && (
            <>
              {(type === "partner" || type === "mentor") && (
                <div>
                  <Input
                    placeholder={type === "partner" ? "Organization Name" : "Current Role/Company"}
                    {...register("organization")}
                  />
                </div>
              )}
              
              <div>
                <Textarea
                  placeholder={type === "enquiry" ? "Your Message *" : "Tell us about yourself and your expertise"}
                  {...register("message")}
                  rows={4}
                  className={"message" in errors && errors.message ? "border-destructive" : ""}
                />
                {"message" in errors && errors.message && (
                  <p className="text-xs text-destructive mt-1">{errors.message.message}</p>
                )}
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="flex-1"
              disabled={
                isSubmitting ||
                enrollMutation.isPending ||
                callbackMutation.isPending ||
                bootcampRegisterMutation.isPending ||
                bootcampCallbackMutation.isPending ||
                workshopRegisterMutation.isPending ||
                workshopCallbackMutation.isPending ||
                hackathonRegisterMutation.isPending ||
                hackathonCallbackMutation.isPending ||
                trainingProgramEnrollMutation.isPending ||
                trainingProgramCallbackMutation.isPending
              }
            >
              {isSubmitting ||
              enrollMutation.isPending ||
              callbackMutation.isPending ||
              bootcampRegisterMutation.isPending ||
              bootcampCallbackMutation.isPending ||
              workshopRegisterMutation.isPending ||
              workshopCallbackMutation.isPending ||
              hackathonRegisterMutation.isPending ||
              hackathonCallbackMutation.isPending ||
              trainingProgramEnrollMutation.isPending ||
              trainingProgramCallbackMutation.isPending ? "Submitting..." : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Export hook for managing popup state
export const usePopupForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formType, setFormType] = useState<FormType | "enquiry" | "mentor" | "partner">("enquiry");
  const [formTitle, setFormTitle] = useState<string | undefined>();
  const [courseId, setCourseId] = useState<string | undefined>();
  const [courseTitle, setCourseTitle] = useState<string | undefined>();
  const [itemType, setItemType] = useState<"course" | "workshop" | "bootcamp" | "hackathon" | "training-program">("course");

  const openForm = (
    type: typeof formType,
    title?: string,
    courseIdParam?: string,
    courseTitleParam?: string,
    itemTypeParam: "course" | "workshop" | "bootcamp" | "hackathon" | "training-program" = "course"
  ) => {
    setFormType(type);
    setFormTitle(title);
    setCourseId(courseIdParam);
    setCourseTitle(courseTitleParam);
    setItemType(itemTypeParam);
    setIsOpen(true);
  };

  const closeForm = () => setIsOpen(false);

  return { isOpen, formType, formTitle, courseId, courseTitle, itemType, openForm, closeForm };
};
