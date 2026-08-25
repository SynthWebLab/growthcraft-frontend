/**
 * Dynamic legal content for Privacy Policy and Terms of Service pages.
 * Update company details or section content here — pages re-render automatically.
 * When the backend API is ready, replace static exports with fetched data.
 */

export const COMPANY = {
  name: "GrowthCraft",
  legalEntity: "SynthWeb Technologies",
  url: "https://growthcraft.com",
  email: "hello@growthcraft.com",
  supportEmail: "support@growthcraft.com",
  phone: "+91 70029 97997",
  address: "Guwahati, Assam, India",
  foundedYear: 2021,
};

export const LAST_UPDATED = "2026-08-25";

// ─── PRIVACY POLICY ──────────────────────────────────────────────────────────

export interface LegalSection {
  id: string;
  title: string;
  content: string[];
}

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "intro",
    title: "Introduction",
    content: [
      `${COMPANY.name} ("we", "us", or "our"), operated by ${COMPANY.legalEntity}, is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform at ${COMPANY.url} and related services.`,
      "By using our platform, you consent to the practices described in this policy. If you do not agree, please discontinue use of our services.",
    ],
  },
  {
    id: "info-collected",
    title: "Information We Collect",
    content: [
      "We collect information you provide directly, including: full name, email address, phone number, college/university name, course details, profile photo, resume, and payment information.",
      "We automatically collect usage data such as: IP address, browser type, device information, pages visited, time spent on pages, referring URL, and interaction patterns within courses and bootcamps.",
      "If you register as a Mentor or College partner, we additionally collect professional credentials, area of expertise, organizational affiliation, and bank/UPI details for payouts.",
    ],
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    content: [
      "To provide, operate, and maintain our educational platform and services including courses, bootcamps, training programs, mentoring sessions, and job placement features.",
      "To process transactions, manage enrollments, issue certificates, and facilitate payments between students, mentors, and hiring partners.",
      "To personalize your learning experience, recommend courses and mentors, and track your progress through cohort batches.",
      "To communicate with you about your account, sessions, doubt resolutions, event invitations, and promotional offers (with opt-out available).",
      "To improve our platform through analytics, A/B testing, and feedback analysis.",
      "To comply with legal obligations and enforce our terms of service.",
    ],
  },
  {
    id: "data-sharing",
    title: "Data Sharing & Disclosure",
    content: [
      "We share your profile and academic progress with assigned mentors for the purpose of cohort-based mentoring and doubt sessions.",
      "When you apply for jobs through our platform, relevant profile data (resume, skills, course completions, certificates) is shared with hiring partners.",
      "We share data with college partners only to the extent required for tracking students enrolled via their institution.",
      "We use third-party services for payments (Razorpay), video conferencing (Google Meet), email delivery, and cloud hosting. These providers have their own privacy policies.",
      "We may disclose information if required by law, regulation, or legal process, or to protect our rights, safety, or property.",
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    content: [
      "We implement industry-standard security measures including HTTPS encryption, secure server infrastructure, access controls, and regular security audits.",
      "Payment information is processed through PCI-DSS compliant payment gateways and is never stored on our servers.",
      "While we strive to protect your data, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies & Tracking Technologies",
    content: [
      "We use essential cookies for authentication, session management, and platform functionality.",
      "We use analytics cookies (e.g., Google Analytics) to understand usage patterns and improve our services.",
      "You can control cookie preferences through your browser settings, though disabling essential cookies may affect platform functionality.",
    ],
  },
  {
    id: "data-retention",
    title: "Data Retention",
    content: [
      "We retain your account data for as long as your account is active or as needed to provide services.",
      "Course completion records, certificates, and placement data are retained indefinitely for verification purposes.",
      "If you request account deletion, we will remove personal data within 30 days, except where retention is required by law or for legitimate business purposes (e.g., financial records).",
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights",
    content: [
      "You have the right to access, correct, or update your personal information at any time through your account settings.",
      "You may request deletion of your account by contacting us at " + COMPANY.supportEmail + ".",
      "You may opt out of marketing communications at any time using the unsubscribe link in emails or through notification settings.",
      "If you are located in the EU/EEA, you have additional rights under GDPR including data portability and the right to object to processing.",
    ],
  },
  {
    id: "children",
    title: "Children's Privacy",
    content: [
      "Our platform is intended for users aged 16 and above. We do not knowingly collect information from children under 16.",
      "If we learn that we have collected data from a child under 16, we will delete that information promptly. If you believe a child has provided us with personal data, please contact us.",
    ],
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.",
      "For significant changes, we will notify you via email or a prominent notice on our platform.",
      `If you have questions about this policy, contact us at ${COMPANY.email}.`,
    ],
  },
];

// ─── TERMS OF SERVICE ────────────────────────────────────────────────────────

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: [
      `By accessing or using ${COMPANY.name} (${COMPANY.url}), operated by ${COMPANY.legalEntity}, you agree to be bound by these Terms of Service ("Terms"). If you do not agree, please do not use our platform.`,
      "These Terms apply to all users including students, mentors, college partners, hiring partners, and ambassadors.",
    ],
  },
  {
    id: "services",
    title: "Description of Services",
    content: [
      `${COMPANY.name} provides an educational technology platform offering: online and offline courses, bootcamps, training programs with industry internships, 1-on-1 mentor doubt sessions, hackathons, workshops, job placement services, and certificate issuance.`,
      "We facilitate connections between students, mentors, college institutions, and hiring partners. We act as a platform provider and are not directly responsible for the quality of third-party mentor advice or hiring outcomes.",
    ],
  },
  {
    id: "accounts",
    title: "User Accounts",
    content: [
      "You must create an account to access most features. You are responsible for maintaining the confidentiality of your login credentials.",
      "You must provide accurate and complete information during registration. Misrepresentation of identity, qualifications, or institutional affiliation may result in account termination.",
      "You may not share, transfer, or sell your account to another person.",
      "We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.",
    ],
  },
  {
    id: "payments",
    title: "Payments, Fees & Refunds",
    content: [
      "Certain courses, bootcamps, and training programs require payment. All fees are displayed at the time of enrollment and processed through secure payment gateways.",
      "Payments are non-refundable unless explicitly stated in the specific program's refund policy or required by applicable law.",
      "For training programs with internship partners, the enrollment fee covers the full program duration including mentoring, project work, and internship placement facilitation.",
      "Mentor payouts, ambassador commissions, and college referral fees are governed by separate agreements and are processed according to their respective payout schedules.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: [
      `All content on ${COMPANY.name} — including course materials, videos, assessments, branding, UI design, and software — is owned by ${COMPANY.legalEntity} or its licensors and is protected by copyright and intellectual property laws.`,
      "You are granted a limited, non-exclusive, non-transferable license to access course content for personal educational use only.",
      "You may not copy, distribute, modify, publicly display, or create derivative works from our content without prior written permission.",
      "Student-submitted projects, assignments, and portfolio work remain the intellectual property of the student, but we retain a non-exclusive license to display them for promotional purposes (e.g., placement portfolios) with your consent.",
    ],
  },
  {
    id: "conduct",
    title: "User Conduct",
    content: [
      "You agree not to: share paid course content publicly, impersonate others, submit plagiarized work, harass other users, or use the platform for any unlawful purpose.",
      "Mentors agree to maintain professional conduct during doubt sessions and provide honest, constructive feedback.",
      "Any form of discrimination, harassment, or inappropriate behavior in chats, video sessions, or community forums will result in immediate account suspension.",
      "Automated scraping, bot access, or any attempt to circumvent access controls is strictly prohibited.",
    ],
  },
  {
    id: "doubt-sessions",
    title: "Doubt Sessions & Mentoring",
    content: [
      "Doubt sessions are 1-on-1 interactions between students and assigned mentors. Sessions may be conducted via chat or Google Meet as scheduled through the platform.",
      "Mentors are independent professionals and not employees of " + COMPANY.name + ". We do not guarantee specific outcomes from mentoring sessions.",
      "Session scheduling is subject to mentor availability. We facilitate but do not guarantee instant responses or same-day scheduling.",
      "Recording of video sessions is not permitted without mutual consent of both parties.",
    ],
  },
  {
    id: "certificates",
    title: "Certificates & Credentials",
    content: [
      "Certificates of completion are issued upon meeting program-specific requirements (attendance, project submission, assessments).",
      "Certificates represent course completion and are not equivalent to formal academic degrees or professional certifications unless explicitly partnered with an accrediting body.",
      `${COMPANY.name} reserves the right to revoke certificates obtained through fraudulent means.`,
    ],
  },
  {
    id: "limitation",
    title: "Limitation of Liability",
    content: [
      `${COMPANY.name} and ${COMPANY.legalEntity} shall not be liable for any indirect, incidental, special, or consequential damages arising from use of or inability to use our platform.`,
      "We do not guarantee job placement, salary levels, or specific career outcomes. Placement statistics are historical and do not constitute a promise.",
      "Our total liability for any claim shall not exceed the amount you paid to us in the 12 months preceding the claim.",
    ],
  },
  {
    id: "termination",
    title: "Termination",
    content: [
      "We may terminate or suspend your account at any time for violation of these Terms, with or without prior notice.",
      "Upon termination, your right to access paid content ceases. Data deletion follows our Privacy Policy.",
      "You may terminate your account at any time by contacting " + COMPANY.supportEmail + ". Active paid enrollments are subject to the refund policy.",
    ],
  },
  {
    id: "governing-law",
    title: "Governing Law & Disputes",
    content: [
      "These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Guwahati, Assam.",
      "We encourage you to contact us first at " + COMPANY.email + " to resolve any issues amicably before pursuing legal action.",
    ],
  },
  {
    id: "changes",
    title: "Changes to Terms",
    content: [
      "We reserve the right to update these Terms at any time. Continued use of the platform after changes constitutes acceptance of the new Terms.",
      "Material changes will be communicated via email or platform notification at least 7 days before taking effect.",
      `For questions about these Terms, contact us at ${COMPANY.email}.`,
    ],
  },
];
