/**
 * Payment Gateway Configuration & Maintenance Mode
 *
 * Use this to pause or re-enable direct online payments.
 * When paused, clicking any payment button displays a friendly maintenance
 * popup modal without referencing internal gateway or KYC requirements.
 *
 * To re-enable payments once KYC is completed:
 * 1. Set NEXT_PUBLIC_PAYMENTS_PAUSED=false in your .env or hosting environment (Vercel), OR
 * 2. Change IS_PAYMENT_PAUSED_DEFAULT to false below.
 */
export const IS_PAYMENT_PAUSED_DEFAULT = true;

export const isPaymentPaused = (): boolean => {
  // If explicitly set via environment variables
  if (
    process.env.NEXT_PUBLIC_PAYMENTS_PAUSED === "false" ||
    process.env.NEXT_PUBLIC_DISABLE_PAYMENTS === "false"
  ) {
    return false;
  }

  if (
    process.env.NEXT_PUBLIC_PAYMENTS_PAUSED === "true" ||
    process.env.NEXT_PUBLIC_DISABLE_PAYMENTS === "true"
  ) {
    return true;
  }

  // Default setting
  return IS_PAYMENT_PAUSED_DEFAULT;
};
