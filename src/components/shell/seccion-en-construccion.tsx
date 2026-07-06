import { Hammer } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  titulo: string;
  descripcion: string;
};

// Estado vacío honesto para secciones aún no construidas:
// dice qué va a hacer la sección, sin botones que no llevan a nada.
export function SeccionEnConstruccion({ titulo, descripcion }: Props) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{titulo}</h1>
      <Card>
        <CardHeader className="items-center text-center">
          <Hammer
            className="mx-auto size-10 text-muted-foreground"
            aria-hidden="true"
          />
          <CardTitle className="text-lg">Estamos construyendo esto</CardTitle>
          <CardDescription className="mx-auto max-w-md text-base">
            {descripcion}
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}
