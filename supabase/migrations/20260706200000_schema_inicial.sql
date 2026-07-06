-- Schema inicial de Career OS
-- Todas las tablas tienen RLS habilitado y políticas por usuario.

-- ── Tipos ────────────────────────────────────────────────────────────────

create type public.estado_aplicacion as enum (
  'guardada',     -- vacante detectada, todavía no aplicada
  'aplicada',
  'respuesta',
  'entrevista',
  'oferta',
  'rechazada',
  'cerrada'       -- descartada / sin respuesta definitiva
);

create type public.tipo_documento as enum ('cv', 'carta', 'mensaje', 'otro');

create type public.tipo_entrevista as enum (
  'hr', 'tecnica', 'behavioral', 'hiring_manager', 'otra'
);

create type public.decision_vacante as enum ('aplicar', 'despues', 'ignorar');

-- ── updated_at automático ────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Tablas ───────────────────────────────────────────────────────────────

-- Perfil: 1 fila por usuario, creada automáticamente al registrarse.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text,
  ubicacion text,
  email_contacto text,
  telefono text,
  linkedin_url text,
  resumen text,                -- "sobre mí" en crudo, alimentado por el chat
  objetivo text,               -- qué rol busca y en qué plazo
  idiomas jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  titulo text not null,
  organizacion text,
  desde date,
  hasta date,                  -- null = actual
  descripcion text,
  orden int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nombre text not null,
  nivel text check (nivel in ('basico', 'intermedio', 'avanzado')),
  categoria text,              -- técnica, blanda, idioma, herramienta
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nombre text not null,
  descripcion text,
  url text,
  tecnologias text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  empresa text not null,
  rol text not null,
  url text,
  fuente text,                 -- linkedin, referido, web de la empresa...
  descripcion text,            -- texto de la vacante pegado por el usuario
  estado public.estado_aplicacion not null default 'guardada',
  decision public.decision_vacante,
  match_pct int check (match_pct between 0 and 100),
  match_justificacion text,    -- el "por qué" honesto del porcentaje
  fecha_aplicacion date,
  fecha_ultimo_contacto date,
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  application_id uuid references public.applications (id) on delete set null,
  tipo public.tipo_documento not null,
  titulo text not null,
  contenido text not null,
  version int not null default 1,
  created_at timestamptz not null default now()
);

create table public.interviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  application_id uuid references public.applications (id) on delete set null,
  tipo public.tipo_entrevista not null default 'otra',
  fecha timestamptz,
  preguntas text,
  resultado text,
  lecciones text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  contenido text not null,
  etiquetas text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  agente text not null,        -- career-strategist, application-writer, ...
  titulo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  rol text not null check (rol in ('user', 'assistant', 'system')),
  contenido text not null,
  created_at timestamptz not null default now()
);

-- ── Índices (FKs consultadas con frecuencia) ─────────────────────────────

create index experiences_user_id_idx on public.experiences (user_id);
create index skills_user_id_idx on public.skills (user_id);
create index projects_user_id_idx on public.projects (user_id);
create index applications_user_id_idx on public.applications (user_id);
create index documents_user_id_idx on public.documents (user_id);
create index documents_application_id_idx on public.documents (application_id);
create index interviews_user_id_idx on public.interviews (user_id);
create index interviews_application_id_idx on public.interviews (application_id);
create index journal_entries_user_id_idx on public.journal_entries (user_id);
create index chat_sessions_user_id_idx on public.chat_sessions (user_id);
create index chat_messages_session_id_idx on public.chat_messages (session_id);
create index chat_messages_user_id_idx on public.chat_messages (user_id);

-- ── Triggers updated_at ──────────────────────────────────────────────────

create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.experiences
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.projects
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.applications
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.interviews
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.chat_sessions
  for each row execute function public.set_updated_at();

-- ── Perfil automático al registrarse ─────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── RLS ──────────────────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.experiences enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.applications enable row level security;
alter table public.documents enable row level security;
alter table public.interviews enable row level security;
alter table public.journal_entries enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- profiles: la PK es el user id.
create policy "propietario lee su perfil" on public.profiles
  for select using ((select auth.uid()) = id);
create policy "propietario actualiza su perfil" on public.profiles
  for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Resto de tablas: patrón user_id.
create policy "propietario lee" on public.experiences
  for select using ((select auth.uid()) = user_id);
create policy "propietario inserta" on public.experiences
  for insert with check ((select auth.uid()) = user_id);
create policy "propietario actualiza" on public.experiences
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "propietario borra" on public.experiences
  for delete using ((select auth.uid()) = user_id);

create policy "propietario lee" on public.skills
  for select using ((select auth.uid()) = user_id);
create policy "propietario inserta" on public.skills
  for insert with check ((select auth.uid()) = user_id);
create policy "propietario actualiza" on public.skills
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "propietario borra" on public.skills
  for delete using ((select auth.uid()) = user_id);

create policy "propietario lee" on public.projects
  for select using ((select auth.uid()) = user_id);
create policy "propietario inserta" on public.projects
  for insert with check ((select auth.uid()) = user_id);
create policy "propietario actualiza" on public.projects
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "propietario borra" on public.projects
  for delete using ((select auth.uid()) = user_id);

create policy "propietario lee" on public.applications
  for select using ((select auth.uid()) = user_id);
create policy "propietario inserta" on public.applications
  for insert with check ((select auth.uid()) = user_id);
create policy "propietario actualiza" on public.applications
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "propietario borra" on public.applications
  for delete using ((select auth.uid()) = user_id);

create policy "propietario lee" on public.documents
  for select using ((select auth.uid()) = user_id);
create policy "propietario inserta" on public.documents
  for insert with check ((select auth.uid()) = user_id);
create policy "propietario actualiza" on public.documents
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "propietario borra" on public.documents
  for delete using ((select auth.uid()) = user_id);

create policy "propietario lee" on public.interviews
  for select using ((select auth.uid()) = user_id);
create policy "propietario inserta" on public.interviews
  for insert with check ((select auth.uid()) = user_id);
create policy "propietario actualiza" on public.interviews
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "propietario borra" on public.interviews
  for delete using ((select auth.uid()) = user_id);

create policy "propietario lee" on public.journal_entries
  for select using ((select auth.uid()) = user_id);
create policy "propietario inserta" on public.journal_entries
  for insert with check ((select auth.uid()) = user_id);
create policy "propietario actualiza" on public.journal_entries
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "propietario borra" on public.journal_entries
  for delete using ((select auth.uid()) = user_id);

create policy "propietario lee" on public.chat_sessions
  for select using ((select auth.uid()) = user_id);
create policy "propietario inserta" on public.chat_sessions
  for insert with check ((select auth.uid()) = user_id);
create policy "propietario actualiza" on public.chat_sessions
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "propietario borra" on public.chat_sessions
  for delete using ((select auth.uid()) = user_id);

create policy "propietario lee" on public.chat_messages
  for select using ((select auth.uid()) = user_id);
create policy "propietario inserta" on public.chat_messages
  for insert with check ((select auth.uid()) = user_id);
create policy "propietario borra" on public.chat_messages
  for delete using ((select auth.uid()) = user_id);
