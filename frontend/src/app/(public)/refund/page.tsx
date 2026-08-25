import { Metadata } from "next";
import { COMPANY, REFUND_SECTIONS } from "@/data/legal.data";
import { LegalPageContent, LegalHighlight, LegalFaq } from "@/components/legal/LegalPageContent";

export const metadata: Metadata = {
  title: `Refund & Cancellation Policy — ${COMPANY.name}`,
  description: `Understand our clear, student-friendly refund, cancellation, seat reservation, and batch transfer policies at ${COMPANY.name}.`,
  openGraph: {
    title: `Refund & Cancellation Policy — ${COMPANY.name}`,
    description: `Transparent refund terms, batch transfer guidelines, and financial guarantees for students and partners at ${COMPANY.name}.`,
    url: `${COMPANY.url}/refund`,
    siteName: COMPANY.name,
    type: "website",
  },
};

const refundHighlights: LegalHighlight[] = [
  {
    iconName: "refresh",
    tag: "Guarantee",
    title: "Pre-Batch Refund Window",
    description: "100% tuition refund (minus payment processing fees) if requested ≥ 7 days before batch commencement.",
    targetSectionId: "offline-bootcamps",
  },
  {
    iconName: "calendar",
    tag: "Flexibility",
    title: "Zero-Penalty Batch Transfers",
    description: "1 complimentary transfer to any upcoming cohort within 6 months for college exams or emergencies.",
    targetSectionId: "batch-transfers",
  },
  {
    iconName: "credit-card",
    tag: "Fast Payout",
    title: "Direct Source Reversals",
    description: "Approved refunds are processed via Razorpay within 5–7 banking days directly to your original account.",
    targetSectionId: "processing-timeline",
  },
  {
    iconName: "user-check",
    tag: "Mentorship",
    title: "Flexible Session Credits",
    description: "Free 1-on-1 mentor rescheduling with 4 hours notice, plus instant credit protection if a mentor cancels.",
    targetSectionId: "mentorship-sessions",
  },
];

const refundFaqs: LegalFaq[] = [
  {
    question: "How do I cancel my enrollment before a campus bootcamp begins?",
    answer:
      `Simply send an email to ${COMPANY.supportEmail} with your Order ID and registered phone number. If received at least 7 days before batch orientation, you'll receive a full refund minus gateway charges.`,
  },
  {
    question: "What happens if my college semester exams clash with my batch schedule?",
    answer:
      "Every GrowthCraft learner is entitled to one (1) free batch postponement. We will freeze your enrollment and transfer you seamlessly to the next cohort with zero administrative fees.",
  },
  {
    question: "How long does it take for refund funds to reflect in my bank account?",
    answer:
      "Once approved by our billing desk, refunds are dispatched via Razorpay within 2 business days and reflect in your bank account, card, or UPI app within 5 to 7 banking days.",
  },
  {
    question: "Are seat reservation hold tokens refundable?",
    answer:
      "Yes. If you decide not to proceed with full enrollment within the 24-hour hold window, you can request an immediate refund or convert the fee into credit for future workshops.",
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalPageContent
      type="refund"
      title="Refund Policy"
      subtitle={`We believe in clear, fair financial transparency. This policy outlines our cancellation windows, free batch transfers, and direct refund guarantees.`}
      sections={REFUND_SECTIONS}
      highlights={refundHighlights}
      faqs={refundFaqs}
    />
  );
}
