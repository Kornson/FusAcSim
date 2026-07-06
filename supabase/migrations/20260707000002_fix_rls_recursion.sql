-- Fix: RLS policies that queried `teams` from within a policy defined on `teams`
-- itself caused "infinite recursion detected in policy for relation teams".
-- Standard fix: a SECURITY DEFINER helper function bypasses RLS for its internal
-- query, so it can safely check room membership without re-triggering the policy.

create or replace function is_member_of_room(p_room_id uuid)
returns boolean
language sql security definer stable
as $$
  select exists (select 1 from teams where room_id = p_room_id and auth_uid = auth.uid());
$$;

grant execute on function is_member_of_room(uuid) to authenticated;

drop policy "select own room" on rooms;
create policy "select own room" on rooms for select to authenticated
  using (is_member_of_room(rooms.id));

drop policy "select teams in my room" on teams;
create policy "select teams in my room" on teams for select to authenticated
  using (is_member_of_room(teams.room_id));

drop policy "select targets in my room" on room_targets;
create policy "select targets in my room" on room_targets for select to authenticated
  using (is_member_of_room(room_targets.room_id));

drop policy "select auctions in my room" on auctions;
create policy "select auctions in my room" on auctions for select to authenticated
  using (is_member_of_room(auctions.room_id));

drop policy "select bids in my room" on bids;
create policy "select bids in my room" on bids for select to authenticated
  using (is_member_of_room(bids.room_id));
