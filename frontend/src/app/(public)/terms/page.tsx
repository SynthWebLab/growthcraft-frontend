import { Metadata } from "next";
import Section from "@/components/ui/section";
import { COMPANY, LAST_UPDATED, TERMS_SECTIONS } from "@/data/legal.data";
import { FileText, Mail } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Terms of Service — ${COMPANY.name}`,
  description: `Read the terms and conditions that govern your use of the ${COMPANY.name} platform.`,
};

export default function TermsOfServicePage() {
  return (
    <>
      {/* Hero */}
      <Section variant="white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-magenta/10 text-magenta mb-6">
            <FileText className="h-7 w-7" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Please read these terms carefully before using{" "}
            <strong className="text-foreground">{COMPANY.name}</strong>.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Last updated:{" "}
            <time dateTime={LAST_UPDATED}>
              {new Date(`${LAST_UPDATED}T00:00:00`).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </p>
        </div>
      </Section>

      {/* Table of Contents */}
      <Section variant="marble" className="py-8 md:py-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Contents
          </h2>
          <nav aria-label="Terms of service sections">
            <ol className="grid sm:grid-cols-2 gap-x-8 gap-y-2 list-decimal list-inside text-sm">
              {TERMS_SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-foreground hover:text-magenta transition-colors font-medium"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </Section>

      {/* Sections */}
      <Section variant="white">
        <div className="max-w-3xl mx-auto space-y-12">
          {TERMS_SECTIONS.map((section, idx) => (
            <article key={section.id} id={section.id} className="scroll-mt-28">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-start gap-3">
                <span className="text-magenta font-extrabold text-lg leading-7">
                  {String(idx + 1).padStart(2, "0")}.
                </span>
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.content.map((paragraph, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-sm md:text-base text-muted-foreground leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Contact CTA */}
      <Section variant="marble">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Questions about these terms?
          </h2>
          <p className="text-sm text-muted-foreground">
            We&apos;re here to clarify anything — just reach out.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={`mailto:${COMPANY.email}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-magenta hover:underline"
            >
              <Mail className="h-4 w-4" />
              {COMPANY.email}
            </a>
            <span className="text-muted-foreground text-sm">or</span>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-magenta hover:underline"
            >
              Contact Us
            </Link>
          </div>
          <p className="text-xs text-muted-foreground pt-4">
            Also see our{" "}
            <Link href="/privacy" className="text-magenta hover:underline font-medium">
              Privacy Policy
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}
