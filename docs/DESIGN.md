# Sistema de diseño — Career OS

> Decisiones de UX/UI. Toda pantalla nueva se valida contra este documento.

## Personalidad (revisado 2026-07-06)

**Dark premium SaaS** — referencia Linear / Vercel / Raycast / Attio. El objetivo es doble: que un dev que mire el frontend quiera contratar a quien lo hizo, y que alguien no técnico lo sienta profesional y confiable (no frío). Se logra con calidez en el *copy* y la honestidad del producto, no con colores pasteles. Anti-referencia: la versión anterior "stone + teal cálido" quedó descartada por sentirse genérica/"HTML 2005".

- **Tema por defecto: oscuro.** Casi negro con un solo acento vibrante (violeta). Light mode existe y está mantenido (toggle en sidebar/ajustes vía `next-themes`), pero dark es la identidad visual primaria — es la que se muestra en el login y en cualquier material de portfolio.
- Glassmorphism puntual (`.glass` en `globals.css`) para cards sobre fondos con textura, no en toda la UI.
- Fondo de puntos (`.bg-dot-grid`) reservado a paneles de marca/hero — nunca en pantallas de trabajo (dashboard, formularios), para no restar legibilidad.

## Color (tokens shadcn en `globals.css`)

| Token | Dark (default) | Light | Uso |
|---|---|---|---|
| `background` | casi negro `oklch(0.135 0.012 285)` | blanco frío | Fondo general |
| `foreground` | blanco cálido | casi negro | Texto (contraste > 4.5:1 en ambos) |
| `primary` | violeta eléctrico `oklch(0.635 0.225 293)` (~`#8b5cf6`) | mismo tono, ajustado a `oklch(0.541...)` para contraste en blanco | Acciones principales, nav activa, `glow-primary` |
| `accent` | violeta oscuro tenue | violeta claro tenue | Chips de ícono, resaltados — siempre con ícono + texto |
| `destructive` | rojo/rosa vívido | rosa | Errores, acciones destructivas |

- Números tabulares/mono (`font-mono`) en contadores y métricas grandes — detalle "data" premium (estilo Linear/Vercel).
- Los porcentajes de match usan escala honesta: sin verde engañoso arriba de números bajos.
- Utilidades nuevas: `.text-gradient-brand` (headline hero), `.glow-primary` (halo en CTA principal), `.glass`, `.bg-dot-grid`.

## Tipografía

- Geist Sans (variable, ya incluida en el scaffold). Body ≥16px, `line-height` 1.5–1.75.
- Jerarquía por peso: 600–700 títulos, 500 labels, 400 body.
- Números tabulares (`tabular-nums`) en métricas y contadores.

## Layout y navegación

- **Mobile-first.** Breakpoints 375 / 768 / 1024.
- **≥1024px:** sidebar fija con las 7 secciones + logout separado abajo (destructivo separado de la nav).
- **<1024px:** bottom nav con máximo 5 ítems: Hoy, Chat, Vacantes, Documentos y "Más" (sheet con Perfil, Entrevistas, Ajustes). Íconos + label siempre, nunca ícono solo.
- Sección activa resaltada con color + peso (no solo color).
- Targets táctiles ≥44px, spacing en escala de 4/8px, `min-h-dvh` (no `100vh`).

## Lenguaje

- Español rioplatense humano: "Contanos tu experiencia", no "Completar perfil". Cero jerga técnica.
- Una acción principal por pantalla; estados vacíos con explicación + UN botón.

## Interacción y animación (GSAP)

- Animaciones con **GSAP + @gsap/react** (`src/lib/gsap.ts`). Registrar SOLO los plugins que se usan — cada plugin es bundle que el usuario descarga.
- Toda animación va dentro de `gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", ...)` — sin excepción.
- Dónde sí: entradas de página (fade+y con stagger ≤0.12s), contadores de métricas, el hero del login, feedback de acciones. Dónde no: no animar layout (width/height), no bloquear input, no loops llamativos en vistas de trabajo (el usuario viene estresado; los loops solo en decoración de fondo, lentos y sutiles).
- Duraciones: micro 150–300ms, entradas ≤600ms, easing `power3.out` al entrar.
- Íconos: Lucide (viene con shadcn), un solo estilo, nunca emojis como íconos estructurales.
- Feedback en <100ms al tocar; botones con spinner durante operaciones async.
- Formularios: label visible siempre, error debajo del campo con causa + cómo arreglarlo, validación on-blur.
