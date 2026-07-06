<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Career OS — Guía para agentes de código

Web app open source de búsqueda de empleo con agentes IA, para personas que no saben de código. Plan de ejecución completo en `docs/PLAN.md` — leerlo antes de trabajar en features.

## Stack
Next.js 15 (App Router) + TypeScript + Tailwind v4 + shadcn/ui · Supabase (Postgres + RLS + Auth magic link) · Vercel AI SDK con providers intercambiables (Anthropic BYOK / Ollama local) · Web Speech API para dictado · Deploy en Vercel.

## Especialistas
Usar los subagentes de `.claude/agents/` según el área: `frontend-react`, `ux-ui-designer`, `supabase-db`, `backend-ai`, `qa-tester`. Para diseño visual, si la skill `ui-ux-pro-max` está disponible, usarla.

## Reglas no negociables
1. **Seguridad de secretos — tolerancia cero.** Nada de keys, connection strings ni datos reales en código, commits, logs o fixtures. Solo `.env.local` (gitignoreado) y variables de Vercel. Las keys de IA de los usuarios viven solo en su navegador. Este proyecto nació de la lección de un leak real en otro repo.
2. **RLS en toda tabla desde su creación**, migraciones versionadas en `supabase/migrations/`.
3. **UX para no técnicos**: lenguaje humano en español, una acción principal por pantalla, mobile-first, accesibilidad AA.
4. **Honestidad como feature**: los agentes de carrera nunca inventan experiencia del usuario, muestran porcentajes justificados y empujan a aplicar, no a procrastinar.
5. **Tests con cada feature** (Vitest + Playwright), providers de IA siempre mockeados.
6. **TypeScript estricto**, sin `any`. Verificar con `npm run lint` y `npx tsc --noEmit` antes de cerrar tarea.

## Commits
- El autor es Matias (identidad git local); los commits generados por IA llevan `Co-Authored-By`. El historial debe contar una colaboración real: commits chicos, frecuentes y con mensaje descriptivo — nunca ráfagas gigantes.
- Mensajes en español, imperativo: `agrega tracker de aplicaciones`, `corrige streaming en chat`.
- Matias está aprendiendo React con este proyecto: al introducir patrones nuevos, explicárselos brevemente en la conversación.

## Scope
El MVP es: perfil + chat con agentes (voz) + análisis de vacantes con match % + generación CV/carta + tracker de aplicaciones. Toda idea fuera de eso se anota en `docs/IDEAS.md` y NO se implementa hasta post-MVP.
