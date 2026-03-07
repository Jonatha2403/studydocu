-- Habilita comentarios + reacciones (likes) con RLS seguro.
-- Ejecutar en Supabase SQL Editor.

begin;

-- =========================
-- COMMENTS
-- =========================
alter table public.comments enable row level security;

drop policy if exists "comments_select_all" on public.comments;
drop policy if exists "comments_insert_own_user" on public.comments;
drop policy if exists "comments_update_own_user" on public.comments;
drop policy if exists "comments_delete_own_user" on public.comments;

create policy "comments_select_all"
on public.comments
for select
to authenticated
using (true);

create policy "comments_insert_own_user"
on public.comments
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.documents d
    where d.id = document_id
      and coalesce(d.approved, false) = true
  )
);

create policy "comments_update_own_user"
on public.comments
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "comments_delete_own_user"
on public.comments
for delete
to authenticated
using (user_id = auth.uid());

-- =========================
-- REACTIONS
-- =========================
alter table public.reactions enable row level security;

drop policy if exists "reactions_select_all" on public.reactions;
drop policy if exists "reactions_insert_own_user" on public.reactions;
drop policy if exists "reactions_update_own_user" on public.reactions;
drop policy if exists "reactions_delete_own_user" on public.reactions;

create policy "reactions_select_all"
on public.reactions
for select
to authenticated
using (true);

create policy "reactions_insert_own_user"
on public.reactions
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.documents d
    where d.id = document_id
      and coalesce(d.approved, false) = true
  )
);

create policy "reactions_update_own_user"
on public.reactions
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "reactions_delete_own_user"
on public.reactions
for delete
to authenticated
using (user_id = auth.uid());

-- Evita reacciones duplicadas por usuario/documento
create unique index if not exists reactions_user_document_unique
on public.reactions (user_id, document_id);

-- =========================
-- TRIGGER: sincronizar likes en documents.likes
-- =========================
create or replace function public.sync_document_likes_from_reactions()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_doc_id uuid;
begin
  v_doc_id := coalesce(new.document_id, old.document_id);

  update public.documents d
  set likes = (
    select count(*)
    from public.reactions r
    where r.document_id = v_doc_id
      and r.type = 'like'
  )
  where d.id = v_doc_id;

  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_sync_document_likes_on_reactions on public.reactions;
create trigger trg_sync_document_likes_on_reactions
after insert or update or delete
on public.reactions
for each row
execute function public.sync_document_likes_from_reactions();

commit;

