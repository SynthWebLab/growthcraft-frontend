import { create } from "zustand";

export interface PaymentMaintenanceDetails {
  itemTitle?: string;
  itemPrice?: number;
  itemType?: string;
}

interface PaymentMaintenanceState {
  isOpen: boolean;
  itemTitle?: string;
  itemPrice?: number;
  itemType?: string;
  openModal: (details?: PaymentMaintenanceDetails) => void;
  closeModal: () => void;
}

export const usePaymentMaintenanceStore = create<PaymentMaintenanceState>((set) => ({
  isOpen: false,
  itemTitle: undefined,
  itemPrice: undefined,
  itemType: undefined,
  openModal: (details) =>
    set({
      isOpen: true,
      itemTitle: details?.itemTitle,
      itemPrice: details?.itemPrice,
      itemType: details?.itemType,
    }),
  closeModal: () =>
    set({
      isOpen: false,
      itemTitle: undefined,
      itemPrice: undefined,
      itemType: undefined,
    }),
}));
