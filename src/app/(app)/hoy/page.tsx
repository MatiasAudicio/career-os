import type { Metadata } from "next";
import { Briefcase, MessageSquareHeart, Send } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Hoy",
};

export default async function HoyPage() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .not("fecha_aplicacion", "is", null);

  const aplicaciones = count ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hoy</h1>
        <p className="text-base text-muted-foreground">
          Un paso a la vez. Esto es lo que importa ahora.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2 text-base">
              <Send className="size-4" aria-hidden="true" />
              Aplicaciones enviadas
            </CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              {aplicaciones}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {aplicaciones === 0
              ? "Todavía ninguna registrada acá. La primera es la más difícil — y la única métrica que de verdad mueve tu búsqueda."
              : "Cada una cuenta. Seguí sumando."}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2 text-base">
              <MessageSquareHeart className="size-4" aria-hidden="true" />
              Tu próximo paso
            </CardDescription>
            <CardTitle className="text-lg">
              Contanos quién sos y qué buscás
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Muy pronto vas a poder contarlo hablando en la sección Chat, como
            se lo contarías a un amigo. Con eso armamos tu perfil y tu CV.
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardDescription className="flex items-center gap-2 text-base">
            <Briefcase className="size-4" aria-hidden="true" />
            Qué es Career OS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Un equipo de agentes que te acompaña a conseguir trabajo:
            analizamos vacantes con porcentajes honestos, armamos tu CV y tus
            cartas, y llevamos la cuenta de tus aplicaciones.
          </p>
          <p>
            Sin humo: si una vacante no te conviene, te lo decimos. Y si pasás
            muchos días sin aplicar, también.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
