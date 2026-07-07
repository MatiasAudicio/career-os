-- Suma las probabilidades de entrevista y oferta al análisis de vacantes,
-- que el prompt del application-writer ya prometía pero nunca se guardaba
-- estructurado (solo match_pct). Mismo patrón que match_pct: nullable,
-- 0-100. No hace falta tocar RLS (las policies de applications son por
-- fila, no por columna).

alter table public.applications
  add column probabilidad_entrevista int check (probabilidad_entrevista between 0 and 100),
  add column probabilidad_oferta int check (probabilidad_oferta between 0 and 100);
