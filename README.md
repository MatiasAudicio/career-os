# Career OS

**Tu equipo de agentes IA para conseguir trabajo — honesto, gratis y open source.**

> 🇬🇧 *Career OS is an open source, AI-powered job search assistant for non-technical people. Spanish-first; English coming after MVP.*

Career OS te acompaña en toda la búsqueda laboral con un equipo de agentes especializados que **te dicen la verdad**: qué tan compatible sos realmente con cada vacante, cuándo aplicar (y cuándo no), y te empujan a mandar aplicaciones en vez de quedarte "preparándote" para siempre.

## ✨ Qué hace

- 💬 **Chat con agentes de carrera** — estratega, redactor de CV, coach de entrevistas, coach de aprendizaje — con **dictado por voz**: contá tu experiencia hablando, como se la contarías a un amigo.
- 🎯 **Análisis de vacantes con porcentaje de match honesto** y decisión clara: APLICAR / DESPUÉS / IGNORAR.
- 📄 **CV y cartas de presentación a medida** de cada vacante, versionados, exportables a PDF. Nunca inventa experiencia que no tenés.
- 📊 **Tracker de aplicaciones** — contador, pipeline (aplicado → respuesta → entrevista → oferta) y rachas que celebran *aplicar*, no procrastinar.
- 🧭 **Panel "Hoy"** — tu única prioridad y próxima acción concreta, para no abrumarte.
- 🔒 **Tu IA, tus datos** — usá tu propia API key de Claude (se guarda solo en tu navegador) o un modelo **100% local con Ollama**. Tus datos se exportan completos cuando quieras.

## 🧱 Stack

Next.js 16 · TypeScript · Tailwind v4 + shadcn/ui · Supabase (Postgres + RLS) · Vercel AI SDK (Anthropic / Ollama) · Web Speech API

## 🚧 Estado

En desarrollo activo — MVP en construcción. Plan completo en [`docs/PLAN.md`](docs/PLAN.md).

## 🏁 Desarrollo local

```bash
npm install
cp .env.example .env.local   # completar con tu proyecto de Supabase
npm run dev
```

## 📄 Licencia

[MIT](LICENSE)
