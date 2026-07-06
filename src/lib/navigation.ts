import {
  Briefcase,
  CalendarCheck,
  FileText,
  House,
  MessagesSquare,
  Settings,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  titulo: string;
  href: string;
  icono: LucideIcon;
};

export const secciones: NavItem[] = [
  { titulo: "Hoy", href: "/hoy", icono: House },
  { titulo: "Chat", href: "/chat", icono: MessagesSquare },
  { titulo: "Vacantes", href: "/vacantes", icono: Briefcase },
  { titulo: "Documentos", href: "/documentos", icono: FileText },
  { titulo: "Mi perfil", href: "/perfil", icono: UserRound },
  { titulo: "Entrevistas", href: "/entrevistas", icono: CalendarCheck },
  { titulo: "Ajustes", href: "/ajustes", icono: Settings },
];

// En mobile la bottom nav muestra 4 secciones + "Más" (regla: máximo 5 ítems).
export const seccionesPrincipales = secciones.slice(0, 4);
export const seccionesSecundarias = secciones.slice(4);
