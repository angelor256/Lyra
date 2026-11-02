-- LYRA · Esquema Supabase. Ejecutar en SQL Editor.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  price numeric(10,2) not null check (price >= 0),
  compare_price numeric(10,2),
  category text not null,
  discipline text[] not null default '{}',
  support text not null default 'Medio',
  active boolean not null default true,
  sold int not null default 0,
  fabric text default '',
  fit text default '',
  care text default '',
  colors jsonb not null default '[]',   -- [{name,hex,images:[url,url],stock:{XS,S,M,L,XL}}]
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.admins (user_id uuid primary key references auth.users(id) on delete cascade);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

alter table public.products enable row level security;
alter table public.settings enable row level security;
alter table public.admins enable row level security;

create policy "products_read" on public.products for select using (active or public.is_admin());
create policy "products_write" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "settings_read" on public.settings for select using (true);
create policy "settings_write" on public.settings for all using (public.is_admin()) with check (public.is_admin());
create policy "admins_self" on public.admins for select using (user_id = auth.uid());

-- Realtime para banner en vivo
alter publication supabase_realtime add table public.settings;

-- Storage de imágenes
insert into storage.buckets (id, name, public) values ('product-images','product-images', true) on conflict do nothing;
create policy "img_read" on storage.objects for select using (bucket_id = 'product-images');
create policy "img_write" on storage.objects for all using (bucket_id = 'product-images' and public.is_admin()) with check (bucket_id = 'product-images' and public.is_admin());

-- Después de crear tu usuario en Authentication > Users:
-- insert into public.admins (user_id) values ('<UUID-DEL-USUARIO>');
