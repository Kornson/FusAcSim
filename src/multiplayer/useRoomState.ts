import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import type { Auction, Bid, Room, RoomTarget, Team } from './types';

export interface RoomState {
  loading: boolean;
  error: string | null;
  room: Room | null;
  teams: Team[];
  targets: RoomTarget[];
  auctions: Auction[];
  bids: Bid[];
}

const EMPTY_STATE: RoomState = {
  loading: true,
  error: null,
  room: null,
  teams: [],
  targets: [],
  auctions: [],
  bids: [],
};

export function useRoomState(roomId: string | null): RoomState {
  const [state, setState] = useState<RoomState>(EMPTY_STATE);

  useEffect(() => {
    if (!roomId || !supabase) {
      setState(EMPTY_STATE);
      return;
    }
    const client = supabase;
    let cancelled = false;
    // One channel per table: combining multiple postgres_changes bindings (different
    // tables) on a single channel silently drops delivery in this realtime-js
    // version, even though the channel itself reports SUBSCRIBED. Verified empirically
    // — single-table channels deliver reliably, multi-table ones don't.
    const channels: ReturnType<typeof client.channel>[] = [];

    setState((s) => ({ ...s, loading: true, error: null }));

    async function setup() {
      const { data: sessionData } = await client.auth.getSession();
      if (cancelled) return;
      if (sessionData.session) {
        client.realtime.setAuth(sessionData.session.access_token);
      }

      try {
        const [roomRes, teamsRes, targetsRes, auctionsRes, bidsRes] = await Promise.all([
          client.from('rooms').select('*').eq('id', roomId).maybeSingle(),
          client.from('teams').select('*').eq('room_id', roomId),
          client.from('room_targets').select('*').eq('room_id', roomId),
          client.from('auctions').select('*').eq('room_id', roomId),
          client.from('bids').select('*').eq('room_id', roomId).order('created_at', { ascending: true }),
        ]);
        if (cancelled) return;
        const firstError = roomRes.error || teamsRes.error || targetsRes.error || auctionsRes.error || bidsRes.error;
        if (firstError) {
          setState((s) => ({ ...s, loading: false, error: firstError.message }));
        } else {
          setState({
            loading: false,
            error: null,
            room: (roomRes.data as Room) ?? null,
            teams: (teamsRes.data as Team[]) ?? [],
            targets: (targetsRes.data as RoomTarget[]) ?? [],
            auctions: (auctionsRes.data as Auction[]) ?? [],
            bids: (bidsRes.data as Bid[]) ?? [],
          });
        }
      } catch (err) {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: (err as Error).message }));
      }

      if (cancelled) return;

      const suffix = crypto.randomUUID();

      channels.push(
        client
          .channel(`room:${roomId}:rooms:${suffix}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` }, (payload) => {
            setState((s) => ({ ...s, room: payload.new as Room }));
          })
          .subscribe(),
      );

      channels.push(
        client
          .channel(`room:${roomId}:teams:${suffix}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'teams', filter: `room_id=eq.${roomId}` }, (payload) => {
            setState((s) => {
              if (payload.eventType === 'DELETE') return { ...s, teams: s.teams.filter((t) => t.id !== (payload.old as Team).id) };
              const row = payload.new as Team;
              const exists = s.teams.some((t) => t.id === row.id);
              return { ...s, teams: exists ? s.teams.map((t) => (t.id === row.id ? row : t)) : [...s.teams, row] };
            });
          })
          .subscribe(),
      );

      channels.push(
        client
          .channel(`room:${roomId}:room_targets:${suffix}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'room_targets', filter: `room_id=eq.${roomId}` }, (payload) => {
            setState((s) => {
              const row = payload.new as RoomTarget;
              const exists = s.targets.some((t) => t.target_id === row.target_id);
              return { ...s, targets: exists ? s.targets.map((t) => (t.target_id === row.target_id ? row : t)) : [...s.targets, row] };
            });
          })
          .subscribe(),
      );

      channels.push(
        client
          .channel(`room:${roomId}:auctions:${suffix}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'auctions', filter: `room_id=eq.${roomId}` }, (payload) => {
            setState((s) => {
              const row = payload.new as Auction;
              const exists = s.auctions.some((a) => a.id === row.id);
              return { ...s, auctions: exists ? s.auctions.map((a) => (a.id === row.id ? row : a)) : [...s.auctions, row] };
            });
          })
          .subscribe(),
      );

      channels.push(
        client
          .channel(`room:${roomId}:bids:${suffix}`)
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bids', filter: `room_id=eq.${roomId}` }, (payload) => {
            setState((s) => ({ ...s, bids: [...s.bids, payload.new as Bid] }));
          })
          .subscribe(),
      );
    }

    setup();

    return () => {
      cancelled = true;
      channels.forEach((c) => client.removeChannel(c));
    };
  }, [roomId]);

  return state;
}
