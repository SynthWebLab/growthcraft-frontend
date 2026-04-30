"use client";

import { useLogout } from "@/hooks/queries/useAuthentication";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const { mutate: logout, isPending } = useLogout();

  return (
    <Button
      onClick={() => logout()}
      disabled={isPending}
      variant="outline"
      className="gap-2"
    >
      <LogOut className="h-4 w-4" />
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
