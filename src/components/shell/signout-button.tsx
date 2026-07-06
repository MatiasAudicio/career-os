import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SignoutButton() {
  return (
    <form action="/auth/signout" method="post">
      <Button
        type="submit"
        variant="ghost"
        className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
      >
        <LogOut aria-hidden="true" />
        Cerrar sesión
      </Button>
    </form>
  );
}
