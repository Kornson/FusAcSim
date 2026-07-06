import { supabase } from './supabaseClient';
import type { Auction, Room, RoomTarget, SynLever, Team } from '../types';

function requireClient() {
  if (!supabase) throw new Error('Supabase non configuré.');
  return supabase;
}

export async function createRoom(code: string, difficulty: 'easy' | 'normal' | 'hard', startingBudget: number): Promise<Room> {
  const { data, error } = await requireClient().rpc('create_room', {
    p_code: code,
    p_difficulty: difficulty,
    p_starting_budget: startingBudget,
  });
  if (error) throw error;
  return data as Room;
}

export async function joinRoom(code: string, teamName: string): Promise<Team> {
  const { data, error } = await requireClient().rpc('join_room', { p_code: code, p_team_name: teamName });
  if (error) throw error;
  return data as Team;
}

export async function fetchRoomByCode(code: string): Promise<Room | null> {
  const { data, error } = await requireClient().from('rooms').select('*').eq('code', code.toUpperCase()).maybeSingle();
  if (error) throw error;
  return data as Room | null;
}

export async function startAuction(params: {
  roomId: string;
  targetId: string;
  kind: 'primary' | 'resale';
  teamId: string;
  openingBid: number;
  debtPct: number;
}): Promise<Auction> {
  const { data, error } = await requireClient().rpc('start_auction', {
    p_room_id: params.roomId,
    p_target_id: params.targetId,
    p_kind: params.kind,
    p_team_id: params.teamId,
    p_opening_bid: params.openingBid,
    p_debt_pct: params.debtPct,
  });
  if (error) throw error;
  return data as Auction;
}

export async function placeBid(params: { auctionId: string; teamId: string; amount: number; debtPct: number }): Promise<Auction> {
  const { data, error } = await requireClient().rpc('place_bid', {
    p_auction_id: params.auctionId,
    p_team_id: params.teamId,
    p_amount: params.amount,
    p_debt_pct: params.debtPct,
  });
  if (error) throw error;
  return data as Auction;
}

export async function closeAuction(auctionId: string): Promise<Auction> {
  const { data, error } = await requireClient().rpc('close_auction', { p_auction_id: auctionId });
  if (error) throw error;
  return data as Auction;
}

export async function updateSynergies(params: {
  roomId: string;
  targetId: string;
  teamId: string;
  lever: SynLever;
  delta: 1 | -1;
}): Promise<RoomTarget> {
  const { data, error } = await requireClient().rpc('update_synergies', {
    p_room_id: params.roomId,
    p_target_id: params.targetId,
    p_team_id: params.teamId,
    p_lever: params.lever,
    p_delta: params.delta,
  });
  if (error) throw error;
  return data as RoomTarget;
}
