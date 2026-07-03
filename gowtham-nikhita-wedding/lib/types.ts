export interface PhotoGroup {
  index: number;
  name: string;
  description: string;
  members?: string[];
}

export interface PhotoOrderState {
  id: string;
  current_index: number;
  updated_at: string;
}

export interface Bet {
  id: string;
  category: 'over_under' | 'prop';
  question: string;
  option_a: string;
  option_b: string;
  option_a_line: number;
  option_b_line: number;
  result: 'a' | 'b' | null;
  active: boolean;
  sort_order: number;
}

export interface BetPick {
  id: string;
  bet_id: string;
  guest_name: string;
  pick: 'a' | 'b';
  created_at: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  photo_url?: string | null;
  visible: boolean;
  created_at: string;
}

export interface BetWithPicks extends Bet {
  picks_a: number;
  picks_b: number;
  user_pick?: 'a' | 'b';
}

export interface LeaderboardEntry {
  guest_name: string;
  correct: number;
  total: number;
  title: string;
}

export interface RsvpPartyMember {
  firstName: string;
  lastName: string;
}

export interface RsvpEntry {
  id: string;
  guest_name: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  party_size: number;
  party_members: RsvpPartyMember[];
  sangeet: boolean;
  wedding: boolean;
  reception: boolean;
  dietary_restrictions: string | null;
  needs_hotel: boolean;
  notes: string | null;
  created_at: string;
}
