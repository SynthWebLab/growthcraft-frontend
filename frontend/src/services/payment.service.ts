import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export interface CreateOrderPayload {
  amount: number;
  currency?: string;
  itemType: "course" | "bootcamp" | "training-program" | "enrollment" | "reservation";
  itemId: string;
  receipt?: string;
  notes?: Record<string, any>;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  transactionId: string;
}

export interface VerifyPaymentPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  paymentId?: string;
  orderId?: string;
}

export interface PaymentTransactionData {
  _id: string;
  orderId: string;
  paymentId?: string;
  amount: number;
  currency: string;
  status: "created" | "authorized" | "captured" | "failed" | "refunded";
  itemType: string;
  itemId?: string;
  createdAt: string;
}

export const paymentService = {
  createOrder: async (data: CreateOrderPayload): Promise<CreateOrderResponse> => {
    const response = await apiClient.post<{ data: CreateOrderResponse }>(
      API_ENDPOINTS.payments.createOrder,
      data
    );
    return response.data;
  },

  verifyPayment: async (data: VerifyPaymentPayload): Promise<VerifyPaymentResponse> => {
    const response = await apiClient.post<{ data: VerifyPaymentResponse }>(
      API_ENDPOINTS.payments.verify,
      data
    );
    return response.data;
  },

  getMyPayments: async (): Promise<PaymentTransactionData[]> => {
    const response = await apiClient.get<{ data: PaymentTransactionData[] }>(
      API_ENDPOINTS.payments.myPayments
    );
    return response.data || [];
  },
};
