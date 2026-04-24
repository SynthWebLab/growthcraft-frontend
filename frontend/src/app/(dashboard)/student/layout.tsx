export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add middleware.ts for role-based protection
  return <>{children}</>;
}
