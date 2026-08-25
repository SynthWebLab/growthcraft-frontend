import { Metadata } from "next";
import { COMPANY, PRIVACY_SECTIONS } from "@/data/legal.data";
import { LegalPageContent, LegalHighlight, LegalFaq } from "@/components/legal/LegalPageContent";

export const metadata: Metadata = {
  title: `Privacy Policy — ${COMPANY.name}`,
  description: `Learn how ${COMPANY.name} collects, uses, and safeguards your personal data across our offline training programs, mentor sessions, and hiring pipeline.`,
  openGraph: {
    title: `Privacy Policy — ${COMPANY.name}`,
    description: `Transparency and data privacy guidelines for students, mentors, and colleges using ${COMPANY.name}.`,
    url: `${COMPANY.url}/privacy`,
    siteName: COMPANY.name,
    type: "website",
  },
};

const privacyHighlights: LegalHighlight[] = [
  {
    iconName: "lock",
    tag: "Security",
    title: "Data Protection & Encryption",
    description: "Strict HTTPS protocols, secure database access controls, and PCI-DSS payment compliance.",
    targetSectionId: "data-security",
  },
  {
    iconName: "eye",
    tag: "No Ads",
    title: "Zero Data Selling",
    description: "We never monetize or sell your personal information or contact details to third-party advertisers.",
    targetSectionId: "data-sharing",
  },
  {
    iconName: "user-check",
    tag: "Academic",
    title: "Offline-First Transparency",
    description: "Records are used strictly to manage campus cohorts, 1-on-1 doubt sessions, and placement pipelines.",
    targetSectionId: "how-we-use",
  },
  {
    iconName: "scale",
    tag: "User Rights",
    title: "Your Privacy Rights",
    description: "You have complete control to access, update, export, or request permanent deletion of your account.",
    targetSectionId: "your-rights",
  },
];

const privacyFaqs: LegalFaq[] = [
  {
    question: "How is my personal data used in offline campus training and bootcamps?",
    answer:
      "Your personal data is used solely to record attendance, deliver offline workshop materials, manage project submissions, and facilitate 1-on-1 mentor doubt clearing sessions.",
  },
  {
    question: "Are my payment details stored on GrowthCraft servers?",
    answer:
      "No. All payments are processed through PCI-DSS certified payment gateways (e.g. Razorpay). We never store your debit/credit card credentials, CVV, or UPI passwords.",
  },
  {
    question: "Who gets access to my portfolio and project submissions?",
    answer:
      "Your code submissions and project repositories are shared with verified hiring partners for job placements with your express consent, and with assigned mentors for code reviews.",
  },
  {
    question: "How do I request complete account and data deletion?",
    answer:
      `You can submit a deletion request anytime by emailing ${COMPANY.supportEmail} from your registered email. We process and fulfill account deletion requests within 30 days.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageContent
      type="privacy"
      title="Privacy Policy"
      subtitle={`Your privacy matters to us. This charter details how ${COMPANY.name} collects, protects, and handles your information across our educational platform and campus operations.`}
      sections={PRIVACY_SECTIONS}
      highlights={privacyHighlights}
      faqs={privacyFaqs}
    />
  );
}
