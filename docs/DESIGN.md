# Sistema de diseño — Career OS

> Decisiones de UX/UI. Toda pantalla nueva se valida contra este documento.

## Personalidad

Cálido, humano, esperanzador y calmo. El usuario probablemente está estresado o desmoralizado — la app debe bajar la ansiedad, no parecer un tablero corporativo. Anti-referencia: dashboards fríos azul-corporativo saturados de métricas.

## Color (tokens shadcn en `globals.css`)

| Token | Light | Uso |
|---|---|---|
| `background` | stone-50 cálido | Fondo general |
| `foreground` | stone-900 | Texto (contraste > 4.5:1) |
| `primary` | teal-700 `#0f766e` | Acciones principales, nav activa (5.7:1 sobre blanco) |
| `accent` | amber | Rachas, celebraciones (siempre con icono + texto, nunca color solo) |
| `destructive` | rose-600 | Errores, acciones destructivas |

- Éxito: emerald-600. Los estados usan icono + texto además de color.
- Dark mode: variantes desaturadas, contraste verificado por separado.
- Los porcentajes de match usan escala honesta: sin verde engañoso arriba de números bajos.

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

## Interacción

- Íconos: Lucide (viene con shadcn), un solo estilo, nunca emojis como íconos estructurales.
- Micro-interacciones 150–300ms, `ease-out` al entrar; respetar `prefers-reduced-motion`.
- Feedback en <100ms al tocar; botones con spinner durante operaciones async.
- Formularios: label visible siempre, error debajo del campo con causa + cómo arreglarlo, validación on-blur.
