-- =============================================================
-- 002: Diseño de categorías (ícono, color y presupuesto mensual)
-- =============================================================

-- Todo o nada: si una parte falla, no se aplica ningún cambio.
begin;

-- 1. COLUMNAS NUEVAS ------------------------------------------
alter table public.categories
  add column icon text not null default 'circle',
  add column color text not null default '#8da9c4'
    check (color ~ '^#[0-9a-fA-F]{6}$'),
  add column monthly_budget numeric(12, 2)
    check (monthly_budget is null or monthly_budget > 0);

-- 2. ÍCONO Y COLOR PARA LAS CATEGORÍAS QUE YA EXISTEN ---------
update public.categories as c
set icon = d.icon, color = d.color
from (values
  ('Salario',        'wallet',     '#2ec4b6'),
  ('Otros ingresos', 'piggy-bank', '#7fd8be'),
  ('Comida',         'utensils',   '#a5b4fc'),
  ('Servicios',      'receipt',    '#94a3b8'),
  ('Ocio',           'gamepad-2',  '#6366f1'),
  ('Transporte',     'car',        '#5b8db8')
) as d (name, icon, color)
where c.name = d.name;

-- 3. CATEGORÍAS NUEVAS PARA LOS USUARIOS QUE YA EXISTEN -------
insert into public.categories (user_id, name, type, icon, color)
select
  p.id,
  d.name,
  'expense'::public.transaction_type,
  d.icon,
  d.color
from public.profiles as p
cross join (values
  ('Salud',     'heart-pulse', '#5eead4'),
  ('Regalos',   'gift',        '#22d3ee'),
  ('Educación', 'book-open',   '#2563eb'),
  ('Casa',      'house',       '#4f6d8f'),
  ('Familia',   'users',       '#93c5fd'),
  ('Salidas',   'wine',        '#8b7fd6')
) as d (name, icon, color)
on conflict (user_id, name, type) do nothing;

-- 4. TRIGGER ACTUALIZADO: los usuarios nuevos reciben las 12 ---
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);

  insert into public.categories (user_id, name, type, icon, color) values
    (new.id, 'Salario',        'income',  'wallet',      '#2ec4b6'),
    (new.id, 'Otros ingresos', 'income',  'piggy-bank',  '#7fd8be'),
    (new.id, 'Comida',         'expense', 'utensils',    '#a5b4fc'),
    (new.id, 'Servicios',      'expense', 'receipt',     '#94a3b8'),
    (new.id, 'Salud',          'expense', 'heart-pulse', '#5eead4'),
    (new.id, 'Ocio',           'expense', 'gamepad-2',   '#6366f1'),
    (new.id, 'Regalos',        'expense', 'gift',        '#22d3ee'),
    (new.id, 'Educación',      'expense', 'book-open',   '#2563eb'),
    (new.id, 'Casa',           'expense', 'house',       '#4f6d8f'),
    (new.id, 'Transporte',     'expense', 'car',         '#5b8db8'),
    (new.id, 'Familia',        'expense', 'users',       '#93c5fd'),
    (new.id, 'Salidas',        'expense', 'wine',        '#8b7fd6');

  return new;
end;
$$;

commit;