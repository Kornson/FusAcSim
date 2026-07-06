-- Le Grand Deal — multiplayer schema
-- Mirrors the pure financing formulas in src/engine.ts (financing(), computeFinancingBreakdown()).
-- If those constants change (facility=400, MAX_STRETCH_DEBT=150, SYN_POINT_COST=5, AUCTION_MIN=80,
-- min bid increment=5, anti-snipe window=15s, auction duration=90s), update the matching literals below.

-- ============================================================================
-- TABLES
-- ============================================================================

create table rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  status text not null default 'lobby' check (status in ('lobby', 'active', 'ended')),
  difficulty text not null default 'normal' check (difficulty in ('easy', 'normal', 'hard')),
  starting_budget numeric not null default 250,
  created_at timestamptz not null default now()
);

create table teams (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms(id) on delete cascade,
  name text not null,
  auth_uid uuid not null,
  treasury numeric not null,
  total_debt numeric not null default 0,
  created_at timestamptz not null default now(),
  unique (room_id, name)
);

-- One row per catalog target (see engine.ts TARGETS ids) per room.
create table room_targets (
  room_id uuid not null references rooms(id) on delete cascade,
  target_id text not null,
  owner_team_id uuid references teams(id),
  status text not null default 'available' check (status in ('available', 'in_auction', 'owned')),
  last_sale_price numeric,
  syn_cost int not null default 0,
  syn_rev int not null default 0,
  syn_tax int not null default 0,
  primary key (room_id, target_id)
);

create table auctions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms(id) on delete cascade,
  target_id text not null,
  kind text not null check (kind in ('primary', 'resale')),
  seller_team_id uuid references teams(id),
  status text not null default 'open' check (status in ('open', 'closed')),
  current_bid numeric not null,
  current_debt_pct numeric not null default 0,
  leader_team_id uuid references teams(id),
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table bids (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms(id) on delete cascade,
  auction_id uuid not null references auctions(id) on delete cascade,
  team_id uuid not null references teams(id),
  amount numeric not null,
  debt_pct numeric not null default 0,
  created_at timestamptz not null default now()
);

create index idx_teams_room on teams(room_id);
create index idx_room_targets_room on room_targets(room_id);
create index idx_auctions_room on auctions(room_id);
create index idx_auctions_status on auctions(room_id, status);
create index idx_bids_room on bids(room_id, created_at);
create index idx_bids_auction on bids(auction_id, created_at);

-- ============================================================================
-- ROW LEVEL SECURITY — read-only for clients; all writes go through RPCs below.
-- ============================================================================

alter table rooms enable row level security;
alter table teams enable row level security;
alter table room_targets enable row level security;
alter table auctions enable row level security;
alter table bids enable row level security;

grant select on rooms, teams, room_targets, auctions, bids to authenticated;

create policy "select own room" on rooms for select to authenticated
  using (exists (select 1 from teams t where t.room_id = rooms.id and t.auth_uid = auth.uid()));

create policy "select teams in my room" on teams for select to authenticated
  using (exists (select 1 from teams mine where mine.room_id = teams.room_id and mine.auth_uid = auth.uid()));

create policy "select targets in my room" on room_targets for select to authenticated
  using (exists (select 1 from teams t where t.room_id = room_targets.room_id and t.auth_uid = auth.uid()));

create policy "select auctions in my room" on auctions for select to authenticated
  using (exists (select 1 from teams t where t.room_id = auctions.room_id and t.auth_uid = auth.uid()));

create policy "select bids in my room" on bids for select to authenticated
  using (exists (select 1 from teams t where t.room_id = bids.room_id and t.auth_uid = auth.uid()));

-- Realtime: broadcast row changes to subscribed clients.
alter publication supabase_realtime add table teams, room_targets, auctions, bids;

-- ============================================================================
-- RPCs — all mutations happen here (SECURITY DEFINER), never via direct table grants.
-- ============================================================================

create or replace function create_room(p_code text, p_difficulty text default 'normal', p_starting_budget numeric default 250)
returns rooms
language plpgsql security definer as $$
declare
  v_room rooms;
begin
  insert into rooms (code, difficulty, starting_budget, status)
  values (upper(p_code), p_difficulty, p_starting_budget, 'lobby')
  returning * into v_room;

  insert into room_targets (room_id, target_id, status)
  select v_room.id, t, 'available'
  from unnest(array['lumina','verdi','nordic','meditech','nova','atlas','loriot','quickfret']) as t;

  return v_room;
exception when unique_violation then
  raise exception 'Ce code de salle est déjà utilisé';
end;
$$;

create or replace function join_room(p_code text, p_team_name text)
returns teams
language plpgsql security definer as $$
declare
  v_room rooms;
  v_team teams;
begin
  select * into v_room from rooms where code = upper(p_code);
  if not found then
    raise exception 'Salle introuvable';
  end if;

  insert into teams (room_id, name, auth_uid, treasury)
  values (v_room.id, p_team_name, auth.uid(), v_room.starting_budget)
  on conflict (room_id, name) do update set auth_uid = excluded.auth_uid
  returning * into v_team;

  return v_team;
end;
$$;

create or replace function start_auction(
  p_room_id uuid, p_target_id text, p_kind text, p_team_id uuid,
  p_opening_bid numeric, p_debt_pct numeric default 0
)
returns auctions
language plpgsql security definer as $$
declare
  v_target room_targets;
  v_team teams;
  v_auction auctions;
  v_capacity numeric;
begin
  select * into v_team from teams where id = p_team_id and room_id = p_room_id and auth_uid = auth.uid();
  if not found then raise exception 'Équipe invalide'; end if;

  select * into v_target from room_targets where room_id = p_room_id and target_id = p_target_id for update;
  if not found then raise exception 'Cible inconnue'; end if;

  if p_kind = 'primary' then
    if v_target.status <> 'available' then raise exception 'Cible non disponible'; end if;
  elsif p_kind = 'resale' then
    if v_target.status <> 'owned' or v_target.owner_team_id <> p_team_id then
      raise exception 'Vous ne possédez pas cette cible';
    end if;
  else
    raise exception 'Type d''enchère invalide';
  end if;

  if p_debt_pct < 0 or p_debt_pct > 70 then raise exception 'Part de dette invalide (0-70%%)'; end if;
  v_capacity := v_team.treasury + (p_debt_pct / 100.0) * 400;
  if p_kind = 'primary' and p_opening_bid < 80 then raise exception 'Offre initiale trop basse (minimum 80 M€)'; end if;
  if p_opening_bid > v_capacity + 150 then raise exception 'Offre hors de portée, même avec une dette de dernière minute'; end if;

  update room_targets set status = 'in_auction' where room_id = p_room_id and target_id = p_target_id;

  insert into auctions (room_id, target_id, kind, seller_team_id, status, current_bid, current_debt_pct, leader_team_id, ends_at)
  values (
    p_room_id, p_target_id, p_kind,
    case when p_kind = 'resale' then p_team_id else null end,
    'open', p_opening_bid, p_debt_pct, p_team_id, now() + interval '90 seconds'
  )
  returning * into v_auction;

  insert into bids (room_id, auction_id, team_id, amount, debt_pct) values (p_room_id, v_auction.id, p_team_id, p_opening_bid, p_debt_pct);

  return v_auction;
end;
$$;

create or replace function place_bid(p_auction_id uuid, p_team_id uuid, p_amount numeric, p_debt_pct numeric)
returns auctions
language plpgsql security definer as $$
declare
  v_auction auctions;
  v_team teams;
  v_capacity numeric;
  v_new_ends timestamptz;
begin
  select * into v_team from teams where id = p_team_id and auth_uid = auth.uid();
  if not found then raise exception 'Équipe invalide'; end if;

  select * into v_auction from auctions where id = p_auction_id for update;
  if not found then raise exception 'Enchère introuvable'; end if;
  if v_auction.status <> 'open' then raise exception 'Enchère clôturée'; end if;
  if now() >= v_auction.ends_at then raise exception 'Temps écoulé'; end if;
  if p_amount < v_auction.current_bid + 5 then raise exception 'Offre trop faible (minimum +5 M€)'; end if;

  if p_debt_pct < 0 or p_debt_pct > 70 then raise exception 'Part de dette invalide (0-70%%)'; end if;
  v_capacity := v_team.treasury + (p_debt_pct / 100.0) * 400;
  if p_amount > v_capacity + 150 then raise exception 'Offre hors de portée, même avec une dette de dernière minute'; end if;

  v_new_ends := v_auction.ends_at;
  if v_auction.ends_at - now() < interval '15 seconds' then
    v_new_ends := now() + interval '15 seconds';
  end if;

  update auctions
  set current_bid = p_amount, leader_team_id = p_team_id, current_debt_pct = p_debt_pct, ends_at = v_new_ends
  where id = p_auction_id
  returning * into v_auction;

  insert into bids (room_id, auction_id, team_id, amount, debt_pct) values (v_auction.room_id, p_auction_id, p_team_id, p_amount, p_debt_pct);

  return v_auction;
end;
$$;

create or replace function close_auction(p_auction_id uuid)
returns auctions
language plpgsql security definer as $$
declare
  v_auction auctions;
  v_winner teams;
  v_normal_debt numeric;
  v_gap numeric;
  v_equity numeric;
  v_stretch numeric;
begin
  select * into v_auction from auctions where id = p_auction_id for update;
  if not found then raise exception 'Enchère introuvable'; end if;

  if v_auction.status <> 'open' then
    return v_auction; -- already closed, idempotent no-op
  end if;
  if now() < v_auction.ends_at then raise exception 'Enchère encore ouverte'; end if;

  update auctions set status = 'closed' where id = p_auction_id;

  if v_auction.leader_team_id is null then
    update room_targets set status = 'available' where room_id = v_auction.room_id and target_id = v_auction.target_id;
    select * into v_auction from auctions where id = p_auction_id;
    return v_auction;
  end if;

  select * into v_winner from teams where id = v_auction.leader_team_id for update;

  v_normal_debt := (coalesce(v_auction.current_debt_pct, 0) / 100.0) * 400;
  v_gap := greatest(0, v_auction.current_bid - v_normal_debt);
  v_equity := least(v_gap, v_winner.treasury);
  v_stretch := greatest(0, v_gap - v_winner.treasury);

  update teams
  set treasury = treasury - v_equity, total_debt = total_debt + v_normal_debt + v_stretch
  where id = v_winner.id;

  if v_auction.kind = 'resale' and v_auction.seller_team_id is not null then
    update teams set treasury = treasury + v_auction.current_bid where id = v_auction.seller_team_id;
  end if;

  update room_targets
  set owner_team_id = v_winner.id, status = 'owned', last_sale_price = v_auction.current_bid,
      syn_cost = 0, syn_rev = 0, syn_tax = 0
  where room_id = v_auction.room_id and target_id = v_auction.target_id;

  select * into v_auction from auctions where id = p_auction_id;
  return v_auction;
end;
$$;

create or replace function update_synergies(p_room_id uuid, p_target_id text, p_team_id uuid, p_lever text, p_delta int)
returns room_targets
language plpgsql security definer as $$
declare
  v_target room_targets;
  v_team teams;
  v_current int;
  v_total int;
begin
  if p_lever not in ('cost', 'rev', 'tax') then raise exception 'Levier invalide'; end if;
  if p_delta not in (1, -1) then raise exception 'Delta invalide'; end if;

  select * into v_team from teams where id = p_team_id and auth_uid = auth.uid();
  if not found then raise exception 'Équipe invalide'; end if;

  select * into v_target from room_targets where room_id = p_room_id and target_id = p_target_id for update;
  if not found or v_target.owner_team_id <> p_team_id then raise exception 'Vous ne possédez pas cette cible'; end if;

  v_current := case p_lever when 'cost' then v_target.syn_cost when 'rev' then v_target.syn_rev else v_target.syn_tax end;
  v_total := v_target.syn_cost + v_target.syn_rev + v_target.syn_tax;

  if p_delta = 1 then
    if v_total >= 12 then raise exception 'Pool de jetons épuisé'; end if;
    if v_team.treasury < 5 then raise exception 'Trésorerie insuffisante'; end if;
  else
    if v_current <= 0 then raise exception 'Rien à retirer'; end if;
  end if;

  update teams set treasury = treasury - (5 * p_delta) where id = p_team_id;

  if p_lever = 'cost' then
    update room_targets set syn_cost = syn_cost + p_delta where room_id = p_room_id and target_id = p_target_id;
  elsif p_lever = 'rev' then
    update room_targets set syn_rev = syn_rev + p_delta where room_id = p_room_id and target_id = p_target_id;
  else
    update room_targets set syn_tax = syn_tax + p_delta where room_id = p_room_id and target_id = p_target_id;
  end if;

  select * into v_target from room_targets where room_id = p_room_id and target_id = p_target_id;
  return v_target;
end;
$$;

grant execute on function create_room(text, text, numeric) to authenticated;
grant execute on function join_room(text, text) to authenticated;
grant execute on function start_auction(uuid, text, text, uuid, numeric, numeric) to authenticated;
grant execute on function place_bid(uuid, uuid, numeric, numeric) to authenticated;
grant execute on function close_auction(uuid) to authenticated;
grant execute on function update_synergies(uuid, text, uuid, text, int) to authenticated;
