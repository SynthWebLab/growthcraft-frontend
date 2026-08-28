import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ambassadorService } from "@/services/ambassador.service";
import { toast } from "sonner";
import { extractApiError } from "@/lib/errors/error-handler";

export const ambassadorKeys = {
  all: ["ambassador"] as const,
  dashboard: () => [...ambassadorKeys.all, "dashboard"] as const,
  referrals: (params?: any) => [...ambassadorKeys.all, "referrals", params] as const,
  earnings: () => [...ambassadorKeys.all, "earnings"] as const,
};

export function useAmbassadorDashboard() {
  return useQuery({
    queryKey: ambassadorKeys.dashboard(),
    queryFn: () => ambassadorService.getDashboard(),
  });
}

export function useAmbassadorReferrals(params?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ambassadorKeys.referrals(params),
    queryFn: () => ambassadorService.getReferrals(params),
  });
}

export function useAmbassadorEarnings() {
  return useQuery({
    queryKey: ambassadorKeys.earnings(),
    queryFn: () => ambassadorService.getEarnings(),
  });
}

export function useActivateAmbassador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ambassadorService.activateAmbassador(),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Ambassador Activated!", {
          description: "You can now access Ambassador Mode.",
        });
        queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
      } else {
        toast.error("Activation Failed", {
          description: response.message || "Please try again.",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Activation Failed", {
        description: extractApiError(error, "Please try again."),
      });
    },
  });
}

export function useInviteFriends() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { emails: string[]; programType?: string; programId?: string }) =>
      ambassadorService.invite(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Invites sent successfully!", {
          description: `${response.data?.referrals?.length || 0} friends invited.`,
        });
        queryClient.invalidateQueries({ queryKey: ambassadorKeys.referrals() });
        queryClient.invalidateQueries({ queryKey: ambassadorKeys.dashboard() });
      } else {
        toast.error("Failed to send invites", {
          description: response.message || "Please try again.",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Failed to send invites", {
        description: extractApiError(error, "Please try again."),
      });
    },
  });
}
