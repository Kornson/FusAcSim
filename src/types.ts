export type Screen =
  | 'lobby'
  | 'cible'
  | 'valo'
  | 'dd'
  | 'rapport'
  | 'financement'
  | 'enchere'
  | 'synergies'
  | 'resultats'
  | 'portfolio';

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface Risk {
  id: string;
  icon: string;
  title: string;
  impact: number;
  note: string;
}

export interface FinancialYear {
  label: string;
  rev: number;
  ebitda: number;
}

export interface Comparable {
  name: string;
  multiple: number;
}

export interface AnalystNote {
  position: string;
  strengths: string[];
  watchouts: string[];
}

export interface Target {
  id: string;
  name: string;
  sector: string;
  icon: string;
  iconBg: string;
  blurb: string;
  rev: number;
  ebitda: number;
  growth: number;
  mult: number;
  baseEV: number;
  netDebt: number;
  history: FinancialYear[];
  comparables: Comparable[];
  analystNote: AnalystNote;
  risks: Risk[];
}

export interface ReportEntry {
  constat: string;
  mesure: string;
  impact: number | string;
  gravite: string;
}

export interface Rival {
  name: string;
  bid: number;
}

export interface SynState {
  cost: number;
  rev: number;
  tax: number;
}

export interface DealRecord {
  targetId: string;
  targetName: string;
  won: boolean;
  bid: number;
  fairValue: number;
  equitySpent: number;
  debtRaised: number;
  stretchDebt: number;
  synergies: number;
  reco: string;
  ddScore: number;
  dealScore: number;
  finScore: number;
  synScore: number;
  totalScore: number;
}

export interface GameState {
  screen: Screen;
  teamName: string;
  started: boolean;
  seconds: number;
  treasury: number;
  lastInterest: number;
  deals: DealRecord[];
  target: string | null;
  wacc: number;
  growth: number;
  exit: number;
  revealed: string[];
  debt: number;
  bid: number;
  rivals: Rival[] | null;
  won: boolean | null;
  auctionDone: boolean;
  stretchDebt: number;
  syn: SynState;
  reports: Record<string, ReportEntry>;
  reco: string;
  recoNote: string;
}

export interface GameProps {
  difficulty: Difficulty;
  showTimer: boolean;
  startingBudget: number;
}
