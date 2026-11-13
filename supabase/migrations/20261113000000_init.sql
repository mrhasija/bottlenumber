-- BottleNumber · esquema inicial v1
-- Diario privado por usuario: cada fila solo es visible para su dueño (RLS).

create extension if not exists "pgcrypto";

-- Perfil ----------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  locale text not null default 'es',
  created_at timestamptz not null default now()
);

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Catas y eventos ---------------------------------------------------------------
create table public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  held_at timestamptz not null default now(),
  place text,
  organizer text,
  notes text,
  rating numeric(3,1) check (rating between 0 and 10),
  created_at timestamptz not null default now()
);
create index events_user_idx on public.events (user_id, held_at desc);

-- Entradas del diario (bebida + momento) -------------------------------------------
create table public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  category text not null check (category in ('vino','whisky','ginebra','ron','cerveza','otro')),
  name text not null,
  details jsonb not null default '{}'::jsonb,       -- campos propios de cada apartado
  rating numeric(3,1) check (rating between 0 and 10),
  notes text,
  -- el momento
  tasted_at timestamptz not null default now(),
  place text,
  companions text,
  occasion text,
  event_id uuid references public.events (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index entries_user_idx on public.entries (user_id, tasted_at desc);
create index entries_user_cat_idx on public.entries (user_id, category);

create function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger entries_touch before update on public.entries
  for each row execute function public.touch_updated_at();

-- Fotos ---------------------------------------------------------------------------
create table public.entry_photos (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  storage_path text not null,   -- <user_id>/<entry_id>/<archivo>
  created_at timestamptz not null default now()
);

-- Seguridad: cada usuario solo ve y toca lo suyo ---------------------------------------
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.entries enable row level security;
alter table public.entry_photos enable row level security;

create policy "own profile" on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());
create policy "own events" on public.events
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own entries" on public.entries
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own photos" on public.entry_photos
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Almacenamiento de fotos (bucket privado, carpeta por usuario) ------------------------
insert into storage.buckets (id, name, public) values ('photos', 'photos', false)
  on conflict (id) do nothing;

create policy "own photo files" on storage.objects
  for all using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
