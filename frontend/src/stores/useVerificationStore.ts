import { create } from "zustand";

interface VerificationState {
  email: string | null;
  expiresAt: number | null;
  callbackUrl?: string;
  setPendingVerification: (email: string, callbackUrl?: string) => void;
  clearPendingVerification: () => void;
}

export const useVerificationStore = create<VerificationState>((set) => ({
  email: null,
  expiresAt: null,
  callbackUrl: undefined,
  setPendingVerification: (email, callbackUrl) =>
    set({
      email,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes expiry matches backend
      callbackUrl,
    }),
  clearPendingVerification: () =>
    set({ email: null, expiresAt: null, callbackUrl: undefined }),
}));
