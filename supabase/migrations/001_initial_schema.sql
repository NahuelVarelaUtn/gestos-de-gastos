-- =============================================================
-- Gestos de Gastos - Esquema de base de datos
-- =============================================================

-- 1. TIPO ENUMERADO: solo permite estos dos valores
create type public.transaction_type as enum ('income', 'expense');

-- 2. TABLAS ---------------------------------------------------

-- Perfil público, 1:1 con auth.users
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- Categorías propias de cada usuario
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references public.profiles (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 50),
  type public.transaction_type not null,
  created_at timestamptz not null default now(),
  -- Un usuario no puede repetir nombre dentro del mismo tipo
  unique (user_id, name, type)
);

-- Transacciones (ingresos y gastos)
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references public.profiles (id) on delete cascade,
  -- restrict: no se puede borrar una categoría que tiene transacciones
  category_id uuid not null
    references public.categories (id) on delete restrict,
  amount numeric(12, 2) not null check (amount > 0),
  description text check (char_length(description) <= 200),
  date date not null default current_date,
  created_at timestamptz not null default now()
);

-- 3. ÍNDICES: aceleran los filtros más usados -----------------
create index transactions_user_date_idx
  on public.transactions (user_id, date desc);
create index transactions_category_idx
  on public.transactions (category_id);

-- 4. ROW LEVEL SECURITY ---------------------------------------
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

-- Cada usuario solo ve y edita SU perfil
create policy "Users can view own profile"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Cada usuario gestiona solo SUS categorías (CRUD completo)
create policy "Users can manage own categories"
  on public.categories for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Cada usuario gestiona solo SUS transacciones (CRUD completo)
create policy "Users can manage own transactions"
  on public.transactions for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- 5. TRIGGER: al registrarse un usuario, crea su perfil
--    y sus categorías por defecto --------------------------------
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);

  insert into public.categories (user_id, name, type) values
    (new.id, 'Salario', 'income'),
    (new.id, 'Otros ingresos', 'income'),
    (new.id, 'Comida', 'expense'),
    (new.id, 'Transporte', 'expense'),
    (new.id, 'Servicios', 'expense'),
    (new.id, 'Ocio', 'expense');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();