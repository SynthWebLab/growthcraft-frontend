export default async function HiringPartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add middleware.ts for role-based protection
  return <>{children}</>;
}
