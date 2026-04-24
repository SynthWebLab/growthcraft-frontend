export default async function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add middleware.ts for role-based protection
  return <>{children}</>;
}
