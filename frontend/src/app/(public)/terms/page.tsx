import { Metadata } from "next";
import { COMPANY, TERMS_SECTIONS } from "@/data/legal.data";
import { LegalPageContent, LegalHighlight, LegalFaq } from "@/components/legal/LegalPageContent";

export const metadata: Metadata = {
  title: `Terms of Service — ${COMPANY.name}`,
  description: `Read the terms and conditions that govern your use of the ${COMPANY.name} platform, offline campus bootcamps, and 1-on-1 mentorship.`,
  openGraph: {
    title: `Terms of Service — ${COMPANY.name}`,
    description: `Terms and conditions for students, mentors, college partners, and employers at ${COMPANY.name}.`,
    url: `${COMPANY.url}/terms`,
    siteName: COMPANY.name,
    type: "website",
  },
};

const termsHighlights: LegalHighlight[] = [
  {
    iconName: "file-text",
    tag: "Clarity",
    title: "Clear & Transparent Terms",
    description: "Defined rights and obligations for students, mentors, college partners, and hiring employers.",
    targetSectionId: "acceptance",
  },
  {
    iconName: "user-check",
    tag: "Mentorship",
    title: "Mentorship Standards",
    description: "Professional conduct guidelines for 1-on-1 doubt sessions, code reviews, and offline workshop interactions.",
    targetSectionId: "doubt-sessions",
  },
  {
    iconName: "scale",
    tag: "Verifiable",
    title: "Verifiable Certification",
    description: "Industry credentials issued upon meeting attendance, live project submission, and assessment criteria.",
    targetSectionId: "certificates",
  },
  {
    iconName: "lock",
    tag: "Ownership",
    title: "Student IP Ownership",
    description: "You maintain 100% intellectual property ownership of your original assignments, codebases, and portfolios.",
    targetSectionId: "intellectual-property",
  },
];

const termsFaqs: LegalFaq[] = [
  {
    question: "Do I own the code and projects I build during a GrowthCraft program?",
    answer:
      "Yes! You retain full intellectual property ownership of all source code, capstone projects, and portfolio artifacts you create during any GrowthCraft program.",
  },
  {
    question: "What are the rules and expectations for 1-on-1 mentor doubt sessions?",
    answer:
      "Doubt sessions are structured for technical code reviews and career support. Sessions are scheduled via our platform and mutual professional respect is strictly enforced for all participants.",
  },
  {
    question: "How do hiring partners verify my certificate of completion?",
    answer:
      "Every certificate issued by GrowthCraft includes a verifiable tamper-proof certificate ID and online credential URL that employers can confirm on our platform.",
  },
  {
    question: "What is the policy on course payments and refunds?",
    answer:
      "Enrollment fees cover full program training, offline infrastructure, project review, and placement facilitation. Specific refund conditions are detailed in each program's enrollment terms.",
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalPageContent
      type="terms"
      title="Terms of Service"
      subtitle={`Please read these terms carefully before accessing ${COMPANY.name}. They outline your rights, responsibilities, and our commitments across all training programs and services.`}
      sections={TERMS_SECTIONS}
      highlights={termsHighlights}
      faqs={termsFaqs}
    />
  );
}
