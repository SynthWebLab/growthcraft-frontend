export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add middleware.ts for route protection
  return <>{children}</>;
}
