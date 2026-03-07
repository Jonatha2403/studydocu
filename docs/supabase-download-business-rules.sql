-- Reglas de negocio para descargas:
-- 1) Usuario no autenticado: no descarga (se controla en API)
-- 2) Usuario registrado: 1 descarga gratis inicial (free_downloads_used)
-- 3) Luego: costo por descarga en puntos (ej. 15) o Premium ilimitado
-- 4) El propietario del documento siempre puede descargar su propio archivo

begin;

-- Campo para control de descargas gratis por usuario
alter table public.profiles
add column if not exists free_downloads_used integer not null default 0;

-- Restricción defensiva para evitar valores negativos
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_free_downloads_used_nonnegative'
  ) then
    alter table public.profiles
    add constraint profiles_free_downloads_used_nonnegative
    check (free_downloads_used >= 0);
  end if;
end $$;

-- Índice opcional para lecturas de perfil por id
create index if not exists idx_profiles_id_free_downloads_used
on public.profiles (id, free_downloads_used);

commit;

