"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import { PanelEmptyState } from "@/components/panel";
import { Calendar, CreditCard } from "lucide-react";
import { formatDate, statusBadge } from "@/lib/student-dashboard.utils";
import type { EnrollmentStatus } from "@/types/student";
import { PaymentCheckoutModal, type PaymentItemDetails } from "@/components/dashboard/payment-checkout-modal";

export interface EnrollmentGridItem {
  id: string;
  title: string;
  subtitle?: string;
  status: EnrollmentStatus;
  paymentStatus?: "pending" | "completed" | "failed" | string;
  enrollmentDate: string;
  href?: string;
  workspaceHref?: string;
  emoji?: string;
  type?: string;
}

interface StudentEnrollmentGridProps {
  pageTitle: string;
  pageDescription: string;
  items: EnrollmentGridItem[];
  isLoading: boolean;
  isError: boolean;
  icon: React.ReactNode;
  emptyTitle: string;
  emptyDescription: string;
  browseHref?: string;
  browseLabel?: string;
}

function StudentEnrollmentGridContent({
  pageTitle,
  pageDescription,
  items,
  isLoading,
  isError,
  icon,
  emptyTitle,
  emptyDescription,
  browseHref,
  browseLabel = "Browse",
}: StudentEnrollmentGridProps) {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") ?? "all";

  // State for Payment Checkout Modal
  const [selectedPaymentItem, setSelectedPaymentItem] = useState<PaymentItemDetails | null>(null);

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    return item.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-6 p-4 sm:p-0">
      <PageHeader title={pageTitle} description={pageDescription} />

      {/* Payment Gateway Modal */}
      <PaymentCheckoutModal
        isOpen={!!selectedPaymentItem}
        onClose={() => setSelectedPaymentItem(null)}
        item={selectedPaymentItem}
      />

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl border border-border bg-white animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
          <p className="text-sm font-medium">Failed to load items. Please try again later.</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <PanelEmptyState
          icon={icon}
          title={emptyTitle}
          description={emptyDescription}
          action={
            browseHref ? (
              <Link href={browseHref}>
                <Button className="bg-magenta text-white hover:bg-magenta/90 text-xs sm:text-sm px-4 py-2">
                  {browseLabel}
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {filteredItems.map((item) => {
            const isUnpaid = item.paymentStatus === "pending" || item.status === "pending";
            const badge = isUnpaid 
              ? { label: "Pending Payment", className: "bg-amber-100 text-amber-800 border-amber-200" }
              : statusBadge(item.status);

            return (
              <DataCard key={item.id} className="p-4 sm:p-6 border-border/60 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <span className="text-3xl sm:text-4xl shrink-0">{item.emoji ?? "🎓"}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-foreground truncate">{item.title}</h3>
                    {item.subtitle && (
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate">
                        {item.subtitle}
                      </p>
                    )}
                    <Badge variant="secondary" className={`mt-2 text-[10px] sm:text-xs ${badge.className}`}>
                      {badge.label}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-marble border border-border">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-magenta shrink-0" />
                    <p className="text-xs sm:text-sm text-foreground">
                      Enrolled {formatDate(item.enrollmentDate)}
                    </p>
                  </div>
                  {(item.workspaceHref || item.href) && (
                    <div className="w-full sm:w-auto shrink-0">
                      {isUnpaid ? (
                        <Button 
                          size="sm" 
                          onClick={() => setSelectedPaymentItem({
                            id: item.id,
                            title: item.title,
                            subtitle: item.subtitle,
                            type: item.type || "bootcamp",
                          })}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 w-full sm:w-auto h-8 px-3"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                          Pending Payment
                        </Button>
                      ) : (
                        <Link href={item.workspaceHref || item.href || "#"} className="w-full sm:w-auto block">
                          <Button size="sm" variant="outline" className="border-magenta/40 text-magenta hover:bg-magenta/10 text-xs rounded-lg w-full sm:w-auto h-8 px-3 flex justify-center items-center">
                            View Workspace
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </DataCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function StudentEnrollmentGrid(props: StudentEnrollmentGridProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 p-4 sm:p-0">
          <PageHeader title={props.pageTitle} description={props.pageDescription} />
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-32 rounded-xl border border-border bg-white animate-pulse"
              />
            ))}
          </div>
        </div>
      }
    >
      <StudentEnrollmentGridContent {...props} />
    </Suspense>
  );
}

export default StudentEnrollmentGrid;
