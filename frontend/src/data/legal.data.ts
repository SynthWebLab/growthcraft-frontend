/**
 * Dynamic legal content for Privacy Policy and Terms of Service pages.
 * Update company details or section content here — pages re-render automatically.
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

// ─── INTERFACES ─────────────────────────────────────────────────────────────

export interface LegalSection {
  id: string;
  title: string;
  tag?: string;
  summary?: string;
  keyPoints?: string[];
  content: string[];
}

// ─── PRIVACY POLICY ──────────────────────────────────────────────────────────

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "intro",
    title: "Introduction & Scope",
    tag: "Overview",
    summary: "GrowthCraft and SynthWeb Technologies are dedicated to safeguarding your personal data across our offline campus operations and online platforms.",
    keyPoints: [
      "Applies to students, mentors, college partners, and hiring employers.",
      "Governed by India's Digital Personal Data Protection (DPDP) Act and global privacy principles.",
    ],
    content: [
      `${COMPANY.name} ("we", "us", or "our"), operated by ${COMPANY.legalEntity}, is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform at ${COMPANY.url} and related offline training services.`,
      "By using our platform or enrolling in campus programs, you consent to the practices described in this policy. If you do not agree, please discontinue use of our services.",
    ],
  },
  {
    id: "info-collected",
    title: "Information We Collect",
    tag: "Data Collection",
    summary: "We collect personal contact details, academic credentials, and automated device usage data solely to run our educational programs.",
    keyPoints: [
      "Direct: Full name, verified email, phone number, college, branch, resume, profile photo.",
      "Mentors & Partners: Professional credentials, LinkedIn profile, tax ID, and banking/UPI payout info.",
      "Automated: Device type, browser data, login activity, and cohort progress metrics.",
    ],
    content: [
      "We collect information you provide directly, including: full name, email address, phone number, college/university name, course details, profile photo, resume, and payment information.",
      "We automatically collect usage data such as: IP address, browser type, device information, pages visited, time spent on pages, referring URL, and interaction patterns within courses and bootcamps.",
      "If you register as a Mentor or College partner, we additionally collect professional credentials, area of expertise, organizational affiliation, and bank/UPI details for payouts.",
    ],
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    tag: "Purpose",
    summary: "Your data is used to conduct training sessions, issue verifiable certificates, match you with mentors, and coordinate job placements.",
    keyPoints: [
      "Track attendance, physical workshop check-ins, and milestone completions.",
      "Connect you with 1-on-1 industry mentors for live code reviews.",
      "Share your verified resume and project portfolio with matched hiring partners.",
    ],
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
    title: "Data Sharing & Third-Party Disclosure",
    tag: "Sharing",
    summary: "We never sell your contact information to advertisers. Data is shared exclusively with your mentors, college administration, and prospective employers.",
    keyPoints: [
      "Zero third-party advertising data broker sales.",
      "Shared with assigned mentors for cohort doubt clearing.",
      "Shared with hiring partners only when you actively apply or opt-in to placement support.",
    ],
    content: [
      "We share your profile and academic progress with assigned mentors for the purpose of cohort-based mentoring and doubt sessions.",
      "When you apply for jobs through our platform, relevant profile data (resume, skills, course completions, certificates) is shared with hiring partners.",
      "We share data with college partners only to the extent required for tracking students enrolled via their institution.",
      "We use third-party services for payments (Razorpay), video conferencing (Google Meet), email delivery, and cloud hosting. These providers have their own strict privacy standards.",
      "We may disclose information if required by law, regulation, or legal process, or to protect our rights, safety, or property.",
    ],
  },
  {
    id: "data-security",
    title: "Data Security & Infrastructure",
    tag: "Security",
    summary: "We employ industry-grade TLS encryption, secure database access control, and PCI-DSS compliant financial gateways.",
    keyPoints: [
      "End-to-end TLS/HTTPS encryption on all platform traffic.",
      "Financial data is handled directly by PCI-DSS certified payment processors (Razorpay).",
      "Regular vulnerability assessments and role-based access control (RBAC).",
    ],
    content: [
      "We implement industry-standard security measures including HTTPS encryption, secure server infrastructure, access controls, and regular security audits.",
      "Payment information is processed through PCI-DSS compliant payment gateways and is never stored on our servers.",
      "While we strive to protect your data, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies & Session Storage",
    tag: "Tracking",
    summary: "We use essential cookies strictly for secure session logins, token refresh cycles, and basic site analytics.",
    keyPoints: [
      "HttpOnly dual JWT cookies (15-minute access token + 7-day refresh token).",
      "No invasive cross-site ad retargeting trackers.",
    ],
    content: [
      "We use essential cookies for authentication, session management, and platform functionality.",
      "We use analytics cookies (e.g., Google Analytics) to understand usage patterns and improve our services.",
      "You can control cookie preferences through your browser settings, though disabling essential cookies may affect platform functionality.",
    ],
  },
  {
    id: "data-retention",
    title: "Data Retention & Archival",
    tag: "Retention",
    summary: "We retain credentials and verified project history indefinitely so employers can verify your certificates; inactive accounts can be erased upon request.",
    keyPoints: [
      "Certificates and credentials remain publicly verifiable forever.",
      "Account deletion requests are permanently purged within 30 days.",
    ],
    content: [
      "We retain your account data for as long as your account is active or as needed to provide services.",
      "Course completion records, certificates, and placement data are retained indefinitely for verification purposes.",
      "If you request account deletion, we will remove personal data within 30 days, except where retention is required by law or for legitimate business purposes (e.g., financial records).",
    ],
  },
  {
    id: "your-rights",
    title: "Your Privacy Rights & Controls",
    tag: "User Rights",
    summary: "You hold the right to access, rectify, export, or permanently delete your personal information at any moment.",
    keyPoints: [
      "Request full export of your personal academic history.",
      "Opt-out of promotional SMS or email broadcasts in 1-click.",
      "Full GDPR & DPDP compliance for data portability and objection.",
    ],
    content: [
      "You have the right to access, correct, or update your personal information at any time through your account settings.",
      "You may request deletion of your account by contacting us at " + COMPANY.supportEmail + ".",
      "You may opt out of marketing communications at any time using the unsubscribe link in emails or through notification settings.",
      "If you are located in the EU/EEA, you have additional rights under GDPR including data portability and the right to object to processing.",
    ],
  },
  {
    id: "children",
    title: "Age Eligibility & Minor Protection",
    tag: "Eligibility",
    summary: "Our programs are tailored for college students and working professionals aged 16 and older.",
    keyPoints: [
      "Users must be 16 years or older to register independently.",
      "Any inadvertent data from minors under 16 is purged immediately upon discovery.",
    ],
    content: [
      "Our platform is intended for users aged 16 and above. We do not knowingly collect information from children under 16.",
      "If we learn that we have collected data from a child under 16, we will delete that information promptly. If you believe a child has provided us with personal data, please contact us.",
    ],
  },
  {
    id: "changes",
    title: "Policy Revisions & Updates",
    tag: "Amendments",
    summary: "We periodically update this policy as new educational programs launch; material modifications are notified via email.",
    keyPoints: [
      "Notices sent at least 7 days prior to material changes.",
      "Historical revisions available upon request.",
    ],
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
    title: "Acceptance & Eligibility",
    tag: "Agreement",
    summary: "By registering or attending any GrowthCraft program, you agree to these transparent operational terms.",
    keyPoints: [
      "Applies across student learners, college partners, mentors, and corporate recruiters.",
      "Users represent that all submitted registration details are truthful.",
    ],
    content: [
      `By accessing or using ${COMPANY.name} (${COMPANY.url}), operated by ${COMPANY.legalEntity}, you agree to be bound by these Terms of Service ("Terms"). If you do not agree, please do not use our platform.`,
      "These Terms apply to all users including students, mentors, college partners, hiring partners, and ambassadors.",
    ],
  },
  {
    id: "services",
    title: "Educational Services & Offline Programs",
    tag: "Services",
    summary: "GrowthCraft delivers in-person campus bootcamps, capstone mentorship, and placement pipelines.",
    keyPoints: [
      "Offline-first curriculum backed by practical software development.",
      "Platform provides record-keeping, cohort progress tracking, and 1-on-1 scheduling.",
    ],
    content: [
      `${COMPANY.name} provides an educational technology platform offering: online and offline courses, bootcamps, training programs with industry internships, 1-on-1 mentor doubt sessions, hackathons, workshops, job placement services, and certificate issuance.`,
      "We facilitate connections between students, mentors, college institutions, and hiring partners. We act as a platform provider and are not directly responsible for the quality of third-party mentor advice or hiring outcomes.",
    ],
  },
  {
    id: "accounts",
    title: "Account Security & Responsibility",
    tag: "Accounts",
    summary: "You are solely responsible for keeping your login credentials confidential and avoiding account sharing.",
    keyPoints: [
      "Strictly 1 person per account — account sharing is prohibited.",
      "Fraudulent credentials or fake identities lead to immediate suspension.",
    ],
    content: [
      "You must create an account to access most features. You are responsible for maintaining the confidentiality of your login credentials.",
      "You must provide accurate and complete information during registration. Misrepresentation of identity, qualifications, or institutional affiliation may result in account termination.",
      "You may not share, transfer, or sell your account to another person.",
      "We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.",
    ],
  },
  {
    id: "payments",
    title: "Fees, Payments & Refund Terms",
    tag: "Financials",
    summary: "Course fees are clearly stated during enrollment. Programs include offline training resources, mentorship, and placement support.",
    keyPoints: [
      "Transparent fee breakdown with zero hidden charges.",
      "Refund guidelines are governed by the specific program enrollment agreement.",
      "Mentor and ambassador payouts follow scheduled milestone cycles.",
    ],
    content: [
      "Certain courses, bootcamps, and training programs require payment. All fees are displayed at the time of enrollment and processed through secure payment gateways.",
      "Payments are non-refundable unless explicitly stated in the specific program's refund policy or required by applicable law.",
      "For training programs with internship partners, the enrollment fee covers the full program duration including mentoring, project work, and internship placement facilitation.",
      "Mentor payouts, ambassador commissions, and college referral fees are governed by separate agreements and are processed according to their respective payout schedules.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property & Student Code",
    tag: "IP Rights",
    summary: "You own 100% of your code and capstone repositories. GrowthCraft retains ownership over course materials, assessments, and curriculum.",
    keyPoints: [
      "Student projects and portfolio code belong entirely to the student.",
      "GrowthCraft retains copyright over proprietary curriculum, lecture notes, and platform code.",
      "Permission to showcase standout student work in placement showcases.",
    ],
    content: [
      `All content on ${COMPANY.name} — including course materials, videos, assessments, branding, UI design, and software — is owned by ${COMPANY.legalEntity} or its licensors and is protected by copyright and intellectual property laws.`,
      "You are granted a limited, non-exclusive, non-transferable license to access course content for personal educational use only.",
      "You may not copy, distribute, modify, publicly display, or create derivative works from our content without prior written permission.",
      "Student-submitted projects, assignments, and portfolio work remain the intellectual property of the student, but we retain a non-exclusive license to display them for promotional purposes (e.g., placement portfolios) with your consent.",
    ],
  },
  {
    id: "conduct",
    title: "Code of Conduct & Community Ethics",
    tag: "Conduct",
    summary: "We enforce zero tolerance for plagiarism, harassment, abuse, or unauthorized sharing of proprietary content.",
    keyPoints: [
      "Constructive, inclusive environment across in-person labs and online chats.",
      "Strict ban on automated scraping, cheating, or reverse engineering.",
    ],
    content: [
      "You agree not to: share paid course content publicly, impersonate others, submit plagiarized work, harass other users, or use the platform for any unlawful purpose.",
      "Mentors agree to maintain professional conduct during doubt sessions and provide honest, constructive feedback.",
      "Any form of discrimination, harassment, or inappropriate behavior in chats, video sessions, or community forums will result in immediate account suspension.",
      "Automated scraping, bot access, or any attempt to circumvent access controls is strictly prohibited.",
    ],
  },
  {
    id: "doubt-sessions",
    title: "Doubt Sessions & Live Mentorship",
    tag: "Mentorship",
    summary: "Doubt sessions are scheduled 1-on-1 interactions designed for code reviews, architecture guidance, and career direction.",
    keyPoints: [
      "Live 1-on-1 code reviews with working industry engineers.",
      "Recordings or screen captures require mutual consent.",
      "Mentors act as independent technical advisors.",
    ],
    content: [
      "Doubt sessions are 1-on-1 interactions between students and assigned mentors. Sessions may be conducted via chat or Google Meet as scheduled through the platform.",
      "Mentors are independent professionals and not employees of " + COMPANY.name + ". We do not guarantee specific outcomes from mentoring sessions.",
      "Session scheduling is subject to mentor availability. We facilitate but do not guarantee instant responses or same-day scheduling.",
      "Recording of video sessions is not permitted without mutual consent of both parties.",
    ],
  },
  {
    id: "certificates",
    title: "Certificates & Industry Credentials",
    tag: "Credentials",
    summary: "Certificates are awarded upon satisfactory attendance, code reviews, and capstone deployment.",
    keyPoints: [
      "Tamper-proof verifiable credential ID for LinkedIn and resume inclusion.",
      "Verified independently by prospective hiring partners.",
    ],
    content: [
      "Certificates of completion are issued upon meeting program-specific requirements (attendance, project submission, assessments).",
      "Certificates represent course completion and are not equivalent to formal academic degrees or professional certifications unless explicitly partnered with an accrediting body.",
      `${COMPANY.name} reserves the right to revoke certificates obtained through fraudulent means.`,
    ],
  },
  {
    id: "limitation",
    title: "Limitation of Liability",
    tag: "Liability",
    summary: "GrowthCraft provides premier technical instruction and placement pipelines, but cannot guarantee universal job offers or salary figures.",
    keyPoints: [
      "Placement statistics reflect historical batch results.",
      "Liability capped to fees paid in the preceding 12 months.",
    ],
    content: [
      `${COMPANY.name} and ${COMPANY.legalEntity} shall not be liable for any indirect, incidental, special, or consequential damages arising from use of or inability to use our platform.`,
      "We do not guarantee job placement, salary levels, or specific career outcomes. Placement statistics are historical and do not constitute a promise.",
      "Our total liability for any claim shall not exceed the amount you paid to us in the 12 months preceding the claim.",
    ],
  },
  {
    id: "termination",
    title: "Account Suspension & Termination",
    tag: "Termination",
    summary: "We reserve the right to suspend accounts violating code of conduct; students may close their account at any time.",
    keyPoints: [
      "Immediate termination for code piracy or persistent harassment.",
      "Voluntary account closure via student support team.",
    ],
    content: [
      "We may terminate or suspend your account at any time for violation of these Terms, with or without prior notice.",
      "Upon termination, your right to access paid content ceases. Data deletion follows our Privacy Policy.",
      "You may terminate your account at any time by contacting " + COMPANY.supportEmail + ". Active paid enrollments are subject to the refund policy.",
    ],
  },
  {
    id: "governing-law",
    title: "Governing Law & Dispute Resolution",
    tag: "Jurisdiction",
    summary: "These terms are governed by the laws of India, with legal jurisdiction in Guwahati, Assam.",
    keyPoints: [
      "Amicable resolution through customer support prior to arbitration.",
      "Courts of Guwahati, Assam hold exclusive jurisdiction.",
    ],
    content: [
      "These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Guwahati, Assam.",
      "We encourage you to contact us first at " + COMPANY.email + " to resolve any issues amicably before pursuing legal action.",
    ],
  },
  {
    id: "changes",
    title: "Modifications to Terms",
    tag: "Updates",
    summary: "Terms may be revised as platform offerings evolve; 7 days prior notice is provided for significant updates.",
    keyPoints: [
      "Continued usage implies acceptance of revised clauses.",
      "Version history maintained for user reference.",
    ],
    content: [
      "We reserve the right to update these Terms at any time. Continued use of the platform after changes constitutes acceptance of the new Terms.",
      "Material changes will be communicated via email or platform notification at least 7 days before taking effect.",
      `For questions about these Terms, contact us at ${COMPANY.email}.`,
    ],
  },
];

// ─── REFUND & CANCELLATION POLICY ──────────────────────────────────────────

export const REFUND_SECTIONS: LegalSection[] = [
  {
    id: "overview",
    title: "Refund Policy & Guarantees",
    tag: "Overview",
    summary: "GrowthCraft believes in transparent, student-centric financial terms. We provide clear cancellation and batch transfer options.",
    keyPoints: [
      "Refund requests honored prior to program start dates.",
      "Zero-fee batch transfers for semester exams and scheduling conflicts.",
      "All transactions processed through secure, auditable banking channels.",
    ],
    content: [
      `At ${COMPANY.name} (operated by ${COMPANY.legalEntity}), we want you to feel completely confident about your educational investment. We understand that personal schedules, college academic calendars, and career plans can evolve.`,
      "This Refund & Cancellation Policy outlines the exact conditions under which program fee refunds, seat reservation releases, and batch transfers are processed across our offline campus bootcamps, courses, and workshops.",
    ],
  },
  {
    id: "offline-bootcamps",
    title: "Offline Campus Bootcamps & Training Programs",
    tag: "Bootcamps",
    summary: "Full refunds are available up to 7 days before the batch start date; prorated credit applies if cancelled before orientation.",
    keyPoints: [
      "100% Refund (minus standard payment gateway fees) if requested ≥ 7 calendar days before batch kickoff.",
      "50% Refund if requested between 6 days and 24 hours prior to batch commencement.",
      "Once physical classes and classroom asset distribution commence, program fees become non-refundable.",
    ],
    content: [
      "For in-person classroom programs, campus bootcamps, and full-stack training cohorts, classroom capacity and mentor allocations are reserved well in advance.",
      "If you submit a formal cancellation request at least 7 days prior to the announced batch start date, you are eligible for a 100% refund of the tuition fee paid, minus applicable payment gateway processing charges (typically 2%).",
      "Cancellations requested between 6 days and 24 hours prior to the first session are eligible for a 50% refund, or a 100% credit transfer to the next available batch.",
      "Due to restricted cohort seat limits and committed instructor compensation, fees are non-refundable once the physical batch commences or after attendance of the first session.",
    ],
  },
  {
    id: "seat-reservations",
    title: "Seat Holds & Reservation Fees",
    tag: "Reservations",
    summary: "24-hour seat hold tokens are applied directly toward your tuition or released upon request.",
    keyPoints: [
      "Reservation amounts lock your cohort seat for 24 hours.",
      "Full refund or credit roll-over if you decide not to proceed before enrollment expiration.",
      "Automatically converted to active tuition upon final enrollment.",
    ],
    content: [
      "When reserving a seat for high-demand campus cohorts, a temporary reservation fee or token may be placed. This hold guarantees your seat and prevents batch overbooking.",
      "If you choose not to complete your enrollment within the 24-hour reservation window, you may request an immediate refund of the reservation fee by contacting billing support.",
      "Alternatively, reservation fees can be credited toward any subsequent GrowthCraft workshop or program within a 6-month validity period.",
    ],
  },
  {
    id: "mentorship-sessions",
    title: "1-on-1 Mentorship & Doubt Sessions",
    tag: "Mentorship",
    summary: "Flexible rescheduling is available with 4 hours notice; instant credit replacement if a mentor misses a call.",
    keyPoints: [
      "Free session rescheduling up to 4 hours before the scheduled time slot.",
      "Instant replacement session credit if a mentor cancels or experiences technical failure.",
      "Unused mentoring credits within bundled programs carry over throughout your enrollment period.",
    ],
    content: [
      "1-on-1 doubt clearing calls and technical mentorship sessions can be rescheduled free of charge through the student portal if requested at least 4 hours prior to the scheduled slot.",
      "If you miss a session without advance notice (no-show), that session credit is forfeited to compensate the mentor's reserved time.",
      "In the rare event that an assigned mentor is unable to attend or has technical disruptions, your session token is instantly refunded back to your student account, and an urgent priority slot is arranged.",
    ],
  },
  {
    id: "batch-transfers",
    title: "Free Batch Transfers & Medical Postponements",
    tag: "Transfers",
    summary: "We offer 1 free batch postponement to accommodate semester examinations, family emergencies, or health reasons.",
    keyPoints: [
      "1 complimentary batch transfer per enrolled student.",
      "Valid for any future cohort running within 6 months.",
      "Zero administrative penalty or transfer fee.",
    ],
    content: [
      "We strongly believe in supporting students through unpredictable academic schedules. If your university announces sudden examination dates, or if you face medical emergencies, you can request a batch postponement.",
      "Every student is entitled to one (1) free batch transfer to any upcoming cohort of the same program without any administrative surcharge.",
      "Your progress records, course materials, and mentor assignments will seamlessly resume when you rejoin the new batch.",
    ],
  },
  {
    id: "processing-timeline",
    title: "Refund Timeline & Payout Methods",
    tag: "Processing",
    summary: "Approved refunds are processed within 5 to 7 working days directly back to your original payment method via Razorpay.",
    keyPoints: [
      "Automated reversal through Razorpay / original payment instrument.",
      "Net Banking, UPI, Debit/Credit Card, or Wallet source reversal.",
      "Confirmation reference and tracking ID provided via email.",
    ],
    content: [
      "Once your cancellation request is reviewed and approved by our finance desk, the refund will be initiated within two (2) business days.",
      "The funds will reflect in your original payment account (Bank Account, UPI ID, Debit/Credit Card, or Net Banking) within 5 to 7 banking days, depending on your card issuer or banking partner.",
      "You will receive an official Razorpay refund confirmation receipt containing the transaction ARN (Acquirer Reference Number) for transparent tracking.",
    ],
  },
  {
    id: "non-refundable",
    title: "Non-Refundable Circumstances",
    tag: "Exceptions",
    summary: "Completed programs, issued credentials, and violations of our student code of conduct are strictly ineligible for refunds.",
    keyPoints: [
      "Certificates of completion that have already been generated and published.",
      "Accounts suspended due to academic plagiarism, harassment, or code piracy.",
      "Requests submitted after the formal program completion date.",
    ],
    content: [
      "Refunds are not granted under the following circumstances:",
      "1. If a verifiable Certificate of Completion has already been generated or claimed on the platform.",
      "2. If a student is dismissed from a batch due to a documented violation of the Student Code of Conduct (e.g. harassment, software piracy, automated scraping).",
      "3. If custom physical hardware kits, external internship placement fees, or third-party examination voucher codes have already been redeemed.",
    ],
  },
  {
    id: "how-to-request",
    title: "How to Initiate a Refund Request",
    tag: "Support",
    summary: "Submit your request via email or through the Student Help Desk with your Order ID for rapid 24-hour review.",
    keyPoints: [
      "Send an email to support@growthcraft.com with your registered email and Order ID.",
      "Or raise a billing ticket directly inside your Student Portal.",
      "Written acknowledgment provided within 24 business hours.",
    ],
    content: [
      `To request a cancellation or refund, please email our billing department at ${COMPANY.supportEmail} from your registered email address with the subject line: 'Refund Request - [Your Order ID]'.`,
      "Please include: (a) Your Full Name, (b) Registered Phone Number, (c) Program / Course Name, (d) Payment Transaction ID, and (e) Reason for cancellation.",
      "Our student support team will acknowledge receipt within 24 hours and guide you through the fast-track resolution.",
    ],
  },
];

