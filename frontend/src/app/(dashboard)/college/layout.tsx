export default async function CollegeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add middleware.ts for role-based protection
  return <>{children}</>;
}
