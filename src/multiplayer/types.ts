export type RoomStatus = 'lobby' | 'active' | 'ended';
export type TargetStatus = 'available' | 'in_auction' | 'owned';
export type AuctionKind = 'primary' | 'resale';
export type AuctionStatus = 'open' | 'closed';
export type SynLever = 'cost' | 'rev' | 'tax';

export interface Room {
  id: string;
  code: string;
  status: RoomStatus;
  difficulty: 'easy' | 'normal' | 'hard';
  starting_budget: number;
  created_at: string;
}

export interface Team {
  id: string;
  room_id: string;
  name: string;
  auth_uid: string;
  treasury: number;
  total_debt: number;
  created_at: string;
}

export interface RoomTarget {
  room_id: string;
  target_id: string;
  owner_team_id: string | null;
  status: TargetStatus;
  last_sale_price: number | null;
  syn_cost: number;
  syn_rev: number;
  syn_tax: number;
}

export interface Auction {
  id: string;
  room_id: string;
  target_id: string;
  kind: AuctionKind;
  seller_team_id: string | null;
  status: AuctionStatus;
  current_bid: number;
  current_debt_pct: number;
  leader_team_id: string | null;
  ends_at: string;
  created_at: string;
}

export interface Bid {
  id: string;
  room_id: string;
  auction_id: string;
  team_id: string;
  amount: number;
  debt_pct: number;
  created_at: string;
}
