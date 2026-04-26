create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  access_type text not null default 'usuario',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_access_type_check check (access_type in ('usuario', 'administrador'))
);

alter table public.profiles
  add column if not exists access_type text not null default 'usuario';

update public.profiles
   set access_type = 'usuario'
 where access_type is null;

do $$
begin
  alter table public.profiles
    add constraint profiles_access_type_check
    check (access_type in ('usuario', 'administrador'));
exception
  when duplicate_object then null;
end $$;

create table if not exists public.recipe_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

do $$
begin
  if not exists (
    select 1
      from pg_constraint
     where conname = 'recipe_categories_name_key'
       and conrelid = 'public.recipe_categories'::regclass
  ) then
    alter table public.recipe_categories
      add constraint recipe_categories_name_key unique (name);
  end if;
end $$;

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  category text,
  difficulty text not null default 'Fácil',
  prep_time_minutes integer not null default 0,
  portions integer not null default 0,
  average_rating numeric(2, 1) not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  content text not null,
  sort_order integer not null default 0
);

create table if not exists public.recipe_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  content text not null,
  sort_order integer not null default 0
);

create table if not exists public.recipe_images (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  path text not null,
  public_url text not null,
  is_cover boolean not null default false,
  sort_order integer not null default 0
);

create table if not exists public.favorite_recipes (
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, recipe_id)
);

create index if not exists recipes_author_id_idx on public.recipes (author_id);
create index if not exists recipes_category_idx on public.recipes (category);
create index if not exists recipes_created_at_idx on public.recipes (created_at desc);
create index if not exists recipe_ingredients_recipe_id_idx on public.recipe_ingredients (recipe_id, sort_order);
create index if not exists recipe_steps_recipe_id_idx on public.recipe_steps (recipe_id, sort_order);
create index if not exists recipe_images_recipe_id_idx on public.recipe_images (recipe_id, sort_order);
create index if not exists favorite_recipes_user_id_idx on public.favorite_recipes (user_id);
create index if not exists favorite_recipes_recipe_id_idx on public.favorite_recipes (recipe_id);

alter table public.profiles enable row level security;
alter table public.recipe_categories enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.recipe_steps enable row level security;
alter table public.recipe_images enable row level security;
alter table public.favorite_recipes enable row level security;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
      from public.profiles
     where id = (select auth.uid())
       and access_type = 'administrador'
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

create or replace function public.handle_user_created()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name),
        updated_at = timezone('utc', now());

  return new;
end;
$$;

create or replace function public.handle_user_updated()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
     set email = new.email,
         updated_at = timezone('utc', now())
   where id = new.id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_user_created();

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.handle_user_updated();

insert into public.profiles (id, email, full_name)
select id, email, raw_user_meta_data ->> 'full_name'
from auth.users
on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(excluded.full_name, public.profiles.full_name),
      updated_at = timezone('utc', now());

insert into public.recipe_categories (name)
values
  ('Entradas'),
  ('Pratos principais'),
  ('Sobremesas'),
  ('Saladas'),
  ('Lanches'),
  ('Bebidas')
on conflict (name) do nothing;

update public.recipes
   set category = btrim(category)
 where category is not null
   and category <> btrim(category);

insert into public.recipe_categories (name)
select distinct category
  from public.recipes
 where category is not null
   and btrim(category) <> ''
on conflict (name) do nothing;

update public.recipes
   set difficulty = case
     when difficulty is null or btrim(difficulty) = '' then 'Fácil'
     when lower(btrim(difficulty)) in ('facil', 'fácil') then 'Fácil'
     when lower(btrim(difficulty)) in ('medio', 'médio') then 'Médio'
     when lower(btrim(difficulty)) in ('dificil', 'difícil') then 'Difícil'
     else 'Fácil'
   end;

alter table public.recipes
  alter column difficulty set default 'Fácil';

alter table public.recipes
  alter column difficulty set not null;

do $$
begin
  if not exists (
    select 1
      from pg_constraint
     where conname = 'recipes_difficulty_check'
       and conrelid = 'public.recipes'::regclass
  ) then
    alter table public.recipes
      add constraint recipes_difficulty_check
      check (difficulty in ('Fácil', 'Médio', 'Difícil'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
      from pg_constraint
     where conname = 'recipes_category_fkey'
       and conrelid = 'public.recipes'::regclass
  ) then
    alter table public.recipes
      add constraint recipes_category_fkey
      foreign key (category)
      references public.recipe_categories(name)
      on update cascade;
  end if;
end $$;

grant usage on schema public to anon, authenticated;
revoke select on public.profiles from anon;
revoke insert, update on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant insert (id, email, full_name) on public.profiles to authenticated;
grant update (email, full_name, updated_at) on public.profiles to authenticated;
revoke all on public.recipe_categories from anon, authenticated;
grant select on public.recipe_categories to anon, authenticated;
grant insert, update, delete on public.recipe_categories to authenticated;
grant select on public.recipes, public.recipe_ingredients, public.recipe_steps, public.recipe_images to anon, authenticated;
grant insert, update, delete on public.recipes, public.recipe_ingredients, public.recipe_steps, public.recipe_images to authenticated;
grant select, insert, delete on public.favorite_recipes to authenticated;

drop policy if exists "profiles_select_public" on public.profiles;
drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id or (select private.is_admin()));

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id and access_type = 'usuario');

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "recipe_categories_select_all" on public.recipe_categories;
create policy "recipe_categories_select_all"
on public.recipe_categories
for select
to anon, authenticated
using (true);

drop policy if exists "recipe_categories_insert_admin" on public.recipe_categories;
create policy "recipe_categories_insert_admin"
on public.recipe_categories
for insert
to authenticated
with check ((select private.is_admin()));

drop policy if exists "recipe_categories_update_admin" on public.recipe_categories;
create policy "recipe_categories_update_admin"
on public.recipe_categories
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "recipe_categories_delete_admin" on public.recipe_categories;
create policy "recipe_categories_delete_admin"
on public.recipe_categories
for delete
to authenticated
using ((select private.is_admin()));

drop policy if exists "recipes_select_published_or_owner" on public.recipes;
create policy "recipes_select_published_or_owner"
on public.recipes
for select
using (is_published or (select auth.uid()) = author_id or (select private.is_admin()));

drop policy if exists "recipes_insert_own" on public.recipes;
create policy "recipes_insert_own"
on public.recipes
for insert
to authenticated
with check ((select auth.uid()) = author_id);

drop policy if exists "recipes_update_own" on public.recipes;
create policy "recipes_update_own"
on public.recipes
for update
to authenticated
using ((select auth.uid()) = author_id or (select private.is_admin()))
with check ((select auth.uid()) = author_id or (select private.is_admin()));

drop policy if exists "recipes_delete_own" on public.recipes;
create policy "recipes_delete_own"
on public.recipes
for delete
to authenticated
using ((select auth.uid()) = author_id or (select private.is_admin()));

drop policy if exists "recipe_ingredients_select_visible_recipe" on public.recipe_ingredients;
create policy "recipe_ingredients_select_visible_recipe"
on public.recipe_ingredients
for select
using (
  exists (
    select 1
      from public.recipes
     where public.recipes.id = recipe_id
       and (public.recipes.is_published or public.recipes.author_id = (select auth.uid()) or (select private.is_admin()))
  )
);

drop policy if exists "recipe_ingredients_insert_owner" on public.recipe_ingredients;
create policy "recipe_ingredients_insert_owner"
on public.recipe_ingredients
for insert
to authenticated
with check (
  exists (
    select 1
      from public.recipes
     where public.recipes.id = recipe_id
       and (public.recipes.author_id = (select auth.uid()) or (select private.is_admin()))
  )
);

drop policy if exists "recipe_ingredients_update_owner" on public.recipe_ingredients;
create policy "recipe_ingredients_update_owner"
on public.recipe_ingredients
for update
to authenticated
using (
  exists (
    select 1
      from public.recipes
     where public.recipes.id = recipe_id
       and (public.recipes.author_id = (select auth.uid()) or (select private.is_admin()))
  )
)
with check (
  exists (
    select 1
      from public.recipes
     where public.recipes.id = recipe_id
       and (public.recipes.author_id = (select auth.uid()) or (select private.is_admin()))
  )
);

drop policy if exists "recipe_ingredients_delete_owner" on public.recipe_ingredients;
create policy "recipe_ingredients_delete_owner"
on public.recipe_ingredients
for delete
to authenticated
using (
  exists (
    select 1
      from public.recipes
     where public.recipes.id = recipe_id
       and (public.recipes.author_id = (select auth.uid()) or (select private.is_admin()))
  )
);

drop policy if exists "recipe_steps_select_visible_recipe" on public.recipe_steps;
create policy "recipe_steps_select_visible_recipe"
on public.recipe_steps
for select
using (
  exists (
    select 1
      from public.recipes
     where public.recipes.id = recipe_id
       and (public.recipes.is_published or public.recipes.author_id = (select auth.uid()) or (select private.is_admin()))
  )
);

drop policy if exists "recipe_steps_insert_owner" on public.recipe_steps;
create policy "recipe_steps_insert_owner"
on public.recipe_steps
for insert
to authenticated
with check (
  exists (
    select 1
      from public.recipes
     where public.recipes.id = recipe_id
       and (public.recipes.author_id = (select auth.uid()) or (select private.is_admin()))
  )
);

drop policy if exists "recipe_steps_update_owner" on public.recipe_steps;
create policy "recipe_steps_update_owner"
on public.recipe_steps
for update
to authenticated
using (
  exists (
    select 1
      from public.recipes
     where public.recipes.id = recipe_id
       and (public.recipes.author_id = (select auth.uid()) or (select private.is_admin()))
  )
)
with check (
  exists (
    select 1
      from public.recipes
     where public.recipes.id = recipe_id
       and (public.recipes.author_id = (select auth.uid()) or (select private.is_admin()))
  )
);

drop policy if exists "recipe_steps_delete_owner" on public.recipe_steps;
create policy "recipe_steps_delete_owner"
on public.recipe_steps
for delete
to authenticated
using (
  exists (
    select 1
      from public.recipes
     where public.recipes.id = recipe_id
       and (public.recipes.author_id = (select auth.uid()) or (select private.is_admin()))
  )
);

drop policy if exists "recipe_images_select_visible_recipe" on public.recipe_images;
create policy "recipe_images_select_visible_recipe"
on public.recipe_images
for select
using (
  exists (
    select 1
      from public.recipes
     where public.recipes.id = recipe_id
       and (public.recipes.is_published or public.recipes.author_id = (select auth.uid()) or (select private.is_admin()))
  )
);

drop policy if exists "recipe_images_insert_owner" on public.recipe_images;
create policy "recipe_images_insert_owner"
on public.recipe_images
for insert
to authenticated
with check (
  exists (
    select 1
      from public.recipes
     where public.recipes.id = recipe_id
       and (public.recipes.author_id = (select auth.uid()) or (select private.is_admin()))
  )
);

drop policy if exists "recipe_images_update_owner" on public.recipe_images;
create policy "recipe_images_update_owner"
on public.recipe_images
for update
to authenticated
using (
  exists (
    select 1
      from public.recipes
     where public.recipes.id = recipe_id
       and (public.recipes.author_id = (select auth.uid()) or (select private.is_admin()))
  )
)
with check (
  exists (
    select 1
      from public.recipes
     where public.recipes.id = recipe_id
       and (public.recipes.author_id = (select auth.uid()) or (select private.is_admin()))
  )
);

drop policy if exists "recipe_images_delete_owner" on public.recipe_images;
create policy "recipe_images_delete_owner"
on public.recipe_images
for delete
to authenticated
using (
  exists (
    select 1
      from public.recipes
     where public.recipes.id = recipe_id
       and (public.recipes.author_id = (select auth.uid()) or (select private.is_admin()))
  )
);

drop policy if exists "favorite_recipes_select_own" on public.favorite_recipes;
create policy "favorite_recipes_select_own"
on public.favorite_recipes
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "favorite_recipes_insert_own" on public.favorite_recipes;
create policy "favorite_recipes_insert_own"
on public.favorite_recipes
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "favorite_recipes_delete_own" on public.favorite_recipes;
create policy "favorite_recipes_delete_own"
on public.favorite_recipes
for delete
to authenticated
using ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true)
on conflict (id) do update
  set public = excluded.public;

drop policy if exists "recipe_images_select_own_or_admin_folder" on storage.objects;
create policy "recipe_images_select_own_or_admin_folder"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'recipe-images'
  and (
    (storage.foldername(name))[1] = (select auth.uid()::text)
    or (select private.is_admin())
  )
);

drop policy if exists "recipe_images_insert_own_folder" on storage.objects;
create policy "recipe_images_insert_own_folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'recipe-images'
  and (
    (storage.foldername(name))[1] = (select auth.uid()::text)
    or (select private.is_admin())
  )
);

drop policy if exists "recipe_images_update_own_folder" on storage.objects;
create policy "recipe_images_update_own_folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'recipe-images'
  and (
    (storage.foldername(name))[1] = (select auth.uid()::text)
    or (select private.is_admin())
  )
)
with check (
  bucket_id = 'recipe-images'
  and (
    (storage.foldername(name))[1] = (select auth.uid()::text)
    or (select private.is_admin())
  )
);

drop policy if exists "recipe_images_delete_own_folder" on storage.objects;
create policy "recipe_images_delete_own_folder"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'recipe-images'
  and (
    (storage.foldername(name))[1] = (select auth.uid()::text)
    or (select private.is_admin())
  )
);
