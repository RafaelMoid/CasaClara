create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  currency text not null default 'BRL',
  language text not null default 'pt',
  created_at timestamptz not null default now()
);

create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  unique (family_id, user_id)
);

create table if not exists public.family_invitations (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  invited_by uuid not null references public.profiles(id) on delete cascade,
  accepted_user_id uuid references public.profiles(id) on delete set null,
  name text,
  email text not null,
  token text not null unique,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

create table if not exists public.app_snapshots (
  family_id uuid primary key references public.families(id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.family_invitations enable row level security;
alter table public.app_snapshots enable row level security;

create or replace function public.is_family_member(target_family_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.family_members
    where family_id = target_family_id
      and user_id = auth.uid()
  );
$$;

create or replace function public.is_family_owner(target_family_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.family_members
    where family_id = target_family_id
      and user_id = auth.uid()
      and role = 'owner'
  );
$$;

create or replace function public.create_family_with_owner(
  owner_name text,
  owner_email text,
  family_name text,
  family_currency text default 'BRL',
  family_language text default 'pt'
)
returns public.families
language plpgsql
security definer
set search_path = public
as $$
declare
  created_family public.families%rowtype;
begin
  if auth.uid() is null then
    raise exception 'User must be authenticated.';
  end if;

  insert into public.profiles (id, name, email)
  values (auth.uid(), owner_name, owner_email)
  on conflict (id) do update
  set name = excluded.name,
      email = excluded.email;

  insert into public.families (name, owner_id, currency, language)
  values (family_name, auth.uid(), family_currency, family_language)
  returning * into created_family;

  insert into public.family_members (family_id, user_id, role)
  values (created_family.id, auth.uid(), 'owner')
  on conflict (family_id, user_id) do nothing;

  return created_family;
end;
$$;

create or replace function public.accept_family_invitation(invitation_token text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  invitation_record public.family_invitations%rowtype;
  current_email text;
begin
  select email into current_email
  from public.profiles
  where id = auth.uid();

  if current_email is null then
    raise exception 'Profile not found.';
  end if;

  select *
  into invitation_record
  from public.family_invitations
  where token = invitation_token
    and status = 'pending'
    and lower(email) = lower(current_email)
  limit 1;

  if invitation_record.id is null then
    raise exception 'Invitation not found or already used.';
  end if;

  insert into public.family_members (family_id, user_id, role)
  values (invitation_record.family_id, auth.uid(), 'member')
  on conflict (family_id, user_id) do nothing;

  update public.family_invitations
  set status = 'accepted',
      accepted_user_id = auth.uid(),
      accepted_at = now()
  where id = invitation_record.id;

  return invitation_record.family_id;
end;
$$;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "Users can create own profile" on public.profiles;
create policy "Users can create own profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Members can view families" on public.families;
create policy "Members can view families"
on public.families for select
to authenticated
using (public.is_family_member(id) or owner_id = auth.uid());

drop policy if exists "Users can create owned families" on public.families;
create policy "Users can create owned families"
on public.families for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "Owners can update families" on public.families;
create policy "Owners can update families"
on public.families for update
to authenticated
using (public.is_family_owner(id))
with check (public.is_family_owner(id));

drop policy if exists "Members can view memberships" on public.family_members;
create policy "Members can view memberships"
on public.family_members for select
to authenticated
using (public.is_family_member(family_id));

drop policy if exists "Users can create owner membership for own family" on public.family_members;
create policy "Users can create owner membership for own family"
on public.family_members for insert
to authenticated
with check (
  user_id = auth.uid()
  and role = 'owner'
  and exists (
    select 1 from public.families
    where id = family_id
      and owner_id = auth.uid()
  )
);

drop policy if exists "Owners can invite members" on public.family_invitations;
create policy "Owners can invite members"
on public.family_invitations for insert
to authenticated
with check (public.is_family_owner(family_id) and invited_by = auth.uid());

drop policy if exists "Owners can view invitations" on public.family_invitations;
create policy "Owners can view invitations"
on public.family_invitations for select
to authenticated
using (public.is_family_owner(family_id) or lower(email) = lower((select email from public.profiles where id = auth.uid())));

drop policy if exists "Invited users can update own invitations" on public.family_invitations;
create policy "Invited users can update own invitations"
on public.family_invitations for update
to authenticated
using (lower(email) = lower((select email from public.profiles where id = auth.uid())))
with check (lower(email) = lower((select email from public.profiles where id = auth.uid())));

drop policy if exists "Members can view snapshots" on public.app_snapshots;
create policy "Members can view snapshots"
on public.app_snapshots for select
to authenticated
using (public.is_family_member(family_id));

drop policy if exists "Members can create snapshots" on public.app_snapshots;
create policy "Members can create snapshots"
on public.app_snapshots for insert
to authenticated
with check (public.is_family_member(family_id));

drop policy if exists "Members can update snapshots" on public.app_snapshots;
create policy "Members can update snapshots"
on public.app_snapshots for update
to authenticated
using (public.is_family_member(family_id))
with check (public.is_family_member(family_id));
