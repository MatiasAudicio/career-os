# Plan de ejecución — Career OS App (producto visual open source)

> Fecha: 2026-07-06. Decisiones tomadas: web app en Vercel, ~10 h/semana en paralelo a la búsqueda, IA con providers intercambiables (Anthropic BYOK + Ollama local).

## 1. Qué es

Asistente open source de búsqueda de empleo con agentes IA, para personas que buscan trabajo y **no saben de código**. Convierte el Career OS actual (markdown + Claude Code) en una web app con chat, dictado por voz, botones de acciones, perfil estructurado, análisis de vacantes con porcentajes honestos, generación de CV/cartas, y tracker de aplicaciones.

**Diferencial de producto:** honestidad sobre adulación. Todos los CV builders con IA te dicen que sos genial; este te dice tu match real, cuándo NO aplicar, y te empuja a aplicar en vez de procrastinar "preparándote". Las reglas anti-trampa de PROFILE.md se vuelven features.

## 2. Stack (con ROI justificado)

| Capa | Elección | Por qué |
|---|---|---|
| Frontend | **Next.js 15 (App Router) + TypeScript + React** | React es tu skill objetivo #1; Next.js es lo que pide el mercado; aprendés construyendo (tu estilo). |
| UI | **Tailwind + shadcn/ui** | UI profesional y accesible sin diseñar desde cero. Estándar de facto 2026. |
| IA | **Vercel AI SDK (`ai`)** | Abstrae providers y resuelve streaming de chat. Cambiar Anthropic↔Ollama↔OpenAI es cambiar una línea. |
| Providers | `@ai-sdk/anthropic` (BYOK) + `ollama-ai-provider` (local) | Ver sección 3. |
| Backend/DB | **Supabase** (Postgres + Auth + Storage + RLS) | Ya lo dominás. Free tier generoso. RLS = multi-tenant desde el día 1. |
| Auth | Supabase Auth con **magic link** | Público no técnico: sin contraseñas. |
| Voz | **Web Speech API** (SpeechRecognition) | Nativa del navegador, gratis, cero dependencias. Whisper como upgrade post-MVP. |
| PDF | `@react-pdf/renderer` o print CSS | Export de CV/carta. |
| Deploy | **Vercel** | Ya lo usás. Deploy desde el día 1. |
| i18n | `next-intl` — español primero | Inglés post-MVP para alcance open source. |

Costo para vos: $0 de infraestructura (free tiers). La IA la paga cada usuario (su key o su Ollama).

## 3. Arquitectura de IA — providers intercambiables

Interfaz única de provider; el usuario elige en Ajustes:

1. **Anthropic BYOK (default):** el usuario pega su API key. Se guarda **solo en su navegador** (localStorage cifrado), nunca en nuestra DB. Las llamadas van directo del navegador a Anthropic (header `anthropic-dangerous-direct-browser-access`) o por un route handler stateless que no persiste la key. Onboarding con guía paso a paso para crear la key (con capturas).
2. **Ollama local (privacidad/gratis):** el navegador llama a `http://localhost:11434` en la máquina del usuario. Chrome permite HTTPS→localhost (exento de mixed content). Requiere que el usuario configure `OLLAMA_ORIGINS` — la app muestra el comando exacto para copiar/pegar por sistema operativo y un botón "probar conexión". **Advertencia honesta en la UI:** modelos locales chicos (8B) dan coaching de calidad notablemente menor que Claude — se ofrece por privacidad y costo cero, con expectativas claras.
3. **Endpoint OpenAI-compatible (post-MVP):** cubre OpenAI, Groq, LM Studio, etc. gratis en esfuerzo porque el AI SDK ya lo soporta.

Escalabilidad futura: si el proyecto crece, se agrega un tier "hosted" (vos ponés la key con rate limiting y billing) **sin re-arquitectura** — es un provider más del lado servidor.

## 4. Mapeo del sistema actual → producto

| Hoy (markdown) | En la app |
|---|---|
| `PROFILE.md` | **Onboarding conversacional**: el agente entrevista al usuario ("contame tu experiencia" — hablado o escrito) y llena un perfil estructurado editable. |
| 5 agentes en `.claude/agents/` | System prompts versionados en el repo; el chat elige el agente según la acción. |
| Comandos `/job`, `/resume`, etc. | **Botones de acción** (cards): Analizar vacante, Generar CV, Carta, Simulacro, Reality check, Focus. Cada uno un flujo guiado. |
| `data/APPLICATIONS.md` | Tabla `applications` + **dashboard**: contador de aplicaciones, pipeline (aplicado → respuesta → entrevista → oferta), tasa de respuesta. |
| `data/STATE.md` | Vista "Hoy": prioridad única, próxima acción, métricas de la semana. |
| `data/JOURNAL.md` | Timeline de aprendizajes/decisiones, con entrada por voz. |
| `output/` | Tabla `documents` con versiones por vacante, copy-paste y export PDF. Nunca se pisa una versión (igual que hoy). |
| `/job` match % | Análisis de vacante: pegar texto/URL → **match % honesto** + decisión APLICAR / DESPUÉS / IGNORAR + qué falta y cuánto tarda en cerrarse ese gap. |
| Reviews semanales/mensuales | Generados automáticamente desde los datos del tracker (no requieren disciplina del usuario). |

## 5. Secciones de la UI

1. **Hoy (dashboard):** contador de aplicaciones, pipeline, prioridad única, próxima acción, nudge anti-trampa ("llevás 3 días sin aplicar").
2. **Chat:** conversación con el agente activo, dictado por voz (botón de micrófono), botones de acciones rápidas, streaming.
3. **Mi Perfil:** experiencia, skills, proyectos, objetivos — editable a mano o conversando.
4. **Vacantes:** alta por texto pegado, análisis con match %, decisión, y generación de materiales a un click.
5. **Documentos:** CVs y cartas versionados por vacante, export PDF / copiar.
6. **Entrevistas:** simulacros puntuados (post-MVP), registro de entrevistas reales y lecciones.
7. **Ajustes:** provider de IA (Anthropic key / Ollama), idioma, export de todos mis datos (JSON) — importante para confianza open source.

## 6. Modelo de datos (Postgres + RLS por `user_id`)

- `profiles` (datos base, objetivos, idiomas) · `experiences` · `skills` · `projects`
- `applications` (empresa, rol, url, fuente, estado, match_pct, fechas, notas)
- `documents` (tipo cv/carta/mensaje, contenido, versión, application_id)
- `interviews` (application_id, tipo, preguntas, resultado, lecciones)
- `journal_entries`
- `chat_sessions` / `chat_messages` (agente, rol, contenido)

## 7. Fases de ejecución (~10 h/semana)

**Fase 0 — esta semana, 0 horas de código (bloqueante):**
Rotar las credenciales expuestas del ERP y enviar las 10 aplicaciones que ya están listas en `output/`. El proyecto no arranca hasta que esto esté hecho — regla anti-trampa.

**Fase 1 — Fundaciones (sem 1, ~10 h):**
Repo + scaffold (`create-next-app`, Tailwind, shadcn), Supabase (schema + RLS + magic link), layout con navegación de secciones, deploy a Vercel el día 1. *Hito: app vacía online con login.*

**Fase 2 — Chat + agentes + voz (sem 2, ~10 h):**
Chat con streaming (AI SDK), provider Anthropic BYOK con pantalla de configuración, migración de los 5 agentes a system prompts, dictado por voz con Web Speech API. *Hito: conversar con el career-strategist por voz desde el navegador.*

**Fase 3 — Perfil + vacantes + tracker (sem 3, ~10 h):**
Onboarding conversacional → perfil estructurado, alta y análisis de vacantes (match % + decisión), tracker de aplicaciones con contador y pipeline. *Hito: cargar una vacante real y obtener análisis honesto.*

**Fase 4 — Documentos + dashboard = MVP (sem 4, ~10 h):**
Generación de CV y carta desde perfil + vacante, versionado, export PDF, dashboard "Hoy" con métricas y nudges. *Hito: **dogfooding** — usás la app para TU propia búsqueda activa.*

**Fase 5 — Post-MVP / open source:**
Provider Ollama + endpoint OpenAI-compatible, simulacros de entrevista puntuados, reviews automáticos, i18n inglés, y lanzamiento open source: README con GIF de demo, licencia MIT, CONTRIBUTING.md, issues templates, deploy con un click (botón "Deploy to Vercel" + `supabase db push`).

## 8. Reformas y mejoras sobre el diseño actual

1. **Honestidad como branding**, no solo regla interna: match % con justificación visible, botón "decime la verdad" (reality check).
2. **Anti-trampa gamificado al revés:** streaks y celebraciones por *aplicar*, no por estudiar. Métrica central del dashboard = aplicaciones enviadas.
3. **Reviews automáticos:** el weekly/monthly review se genera desde los datos del tracker en vez de depender de que el usuario lo pida.
4. **Scope cut deliberado:** mock-day, quarterly planning y roadmap a 3 años quedan post-MVP. MVP = perfil + chat + vacantes + CV + tracker.
5. **Exportabilidad total:** botón "descargar todos mis datos" — confianza clave para un producto open source que guarda datos de carrera.

## 9. Riesgos

| Riesgo | Mitigación |
|---|---|
| Canibalizar la búsqueda de trabajo | Fase 0 bloqueante; si hay entrevistas en la semana, el proyecto se pausa sin culpa. Tope 10 h/sem. |
| Scope creep (tu patrón conocido) | El MVP está definido arriba; toda idea nueva va a `docs/IDEAS.md` para post-MVP. |
| Web Speech API no funciona en Firefox/Safari viejo | Detectar soporte y degradar a texto; Whisper post-MVP. |
| Calidad pobre con Ollama decepciona usuarios | Advertencia explícita en la UI + benchmark de agentes con modelos chicos antes de promocionarlo. |
| Usuarios no técnicos trabados creando la API key | Onboarding con capturas paso a paso + video de 60 s. Es EL punto de fricción del modelo BYOK. |

## 10. Repo

- Nombre: **`career-os`** — público desde el día 1 (decisión 2026-07-06).
- Licencia MIT. Monorepo simple (una sola app Next.js; Supabase migrations en `/supabase`).
- Historial de commits: colaboración real Matias + IA, commits chicos y descriptivos, mensajes en español.
