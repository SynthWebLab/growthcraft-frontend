import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  paymentService,
  CreateOrderPayload,
  VerifyPaymentPayload,
} from "@/services/payment.service";

export function useCreatePaymentOrder() {
  return useMutation({
    mutationFn: (data: CreateOrderPayload) => paymentService.createOrder(data),
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyPaymentPayload) => paymentService.verifyPayment(data),
    onSuccess: () => {
      // Invalidate student enrollments, reservations, and payment history queries
      queryClient.invalidateQueries({ queryKey: ["student-enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["my-payments"] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}

export function useStudentPayments() {
  return useQuery({
    queryKey: ["my-payments"],
    queryFn: () => paymentService.getMyPayments(),
  });
}
