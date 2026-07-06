import type { DealRecord, Difficulty, GameState, Rival, Target } from './types';

export const TARGETS: Target[] = [
  {
    id: 'lumina',
    name: 'Lumina Robotics',
    sector: 'ROBOTIQUE',
    icon: '🤖',
    iconBg: '#EFE0F4',
    blurb:
      "Bras robotisés pour l'industrie automobile. Marges solides, mais dépendante de quelques grands comptes.",
    rev: 145,
    ebitda: 29,
    growth: 14,
    mult: 10,
    baseEV: 300,
    netDebt: 45,
    history: [
      { label: 'N-2', rev: 118, ebitda: 22 },
      { label: 'N-1', rev: 131, ebitda: 26 },
      { label: 'N', rev: 145, ebitda: 29 },
    ],
    comparables: [
      { name: 'AutoBras Systems', multiple: 9.8 },
      { name: 'MecaTronix', multiple: 10.5 },
      { name: 'Roblex Industries', multiple: 9.2 },
    ],
    analystNote: {
      position: "Fournisseur clé de la chaîne automobile, forte spécialisation technologique.",
      strengths: ['Backlog sécurisé sur 18 mois', 'Expertise technique reconnue'],
      watchouts: ['Forte concentration client', 'Coûts de R&D exposés au turnover'],
    },
    risks: [
      { id: 'r1', icon: '🎯', title: 'Concentration client', impact: -35, note: '40 % du CA repose sur un seul constructeur.' },
      { id: 'r2', icon: '⚖️', title: 'Litige de brevet', impact: -20, note: 'Contentieux en cours sur un actionneur clé.' },
      { id: 'r3', icon: '📈', title: 'Carnet de commandes record', impact: 25, note: "Backlog signé couvrant 18 mois d'activité." },
      { id: 'r4', icon: '🔧', title: 'Turnover R&D élevé', impact: -12, note: 'Départ de plusieurs ingénieurs séniors.' },
      { id: 'r5', icon: '👔', title: 'Nouveau directeur financier', impact: 0, note: 'Arrivée récente, sans impact sur la valeur.' },
    ],
  },
  {
    id: 'verdi',
    name: 'Verdi Foods',
    sector: 'AGRO BIO',
    icon: '🌿',
    iconBg: '#E4F0DC',
    blurb:
      "Marque d'alimentation bio bien installée en grande distribution. Croissance modérée, marque forte.",
    rev: 210,
    ebitda: 25,
    growth: 6,
    mult: 8,
    baseEV: 210,
    netDebt: 35,
    history: [
      { label: 'N-2', rev: 195, ebitda: 24 },
      { label: 'N-1', rev: 202, ebitda: 23 },
      { label: 'N', rev: 210, ebitda: 25 },
    ],
    comparables: [
      { name: 'BioNature Distribution', multiple: 7.6 },
      { name: 'Champs & Co', multiple: 8.4 },
      { name: 'Verte Vallée', multiple: 7.9 },
    ],
    analystNote: {
      position: 'Marque bio installée en GMS, croissance modérée mais rentable.',
      strengths: ['Notoriété de marque forte', 'Réseau de distribution mature'],
      watchouts: ['Dépendance à deux grands distributeurs', 'Image affectée par un rappel produit récent'],
    },
    risks: [
      { id: 'r1', icon: '🚚', title: 'Dépendance distributeurs', impact: -15, note: 'Deux enseignes pèsent 55 % des ventes.' },
      { id: 'r2', icon: '⭐', title: 'Notoriété de marque', impact: 22, note: 'Marque n°2 du bio, forte fidélité client.' },
      { id: 'r3', icon: '⚠️', title: 'Rappel produit récent', impact: -18, note: 'Contamination sur un lot, image écornée.' },
      { id: 'r4', icon: '🏭', title: 'Usine vétuste', impact: -20, note: 'Capex de modernisation à prévoir sous 2 ans.' },
      { id: 'r5', icon: '📜', title: 'Certification bio renouvelée', impact: 0, note: 'Label reconduit, situation normale.' },
    ],
  },
  {
    id: 'nordic',
    name: 'Nordic Cloud',
    sector: 'SAAS',
    icon: '☁️',
    iconBg: '#DCEAF4',
    blurb: 'Infrastructure cloud en forte croissance. Revenus récurrents, mais quelques signaux à surveiller.',
    rev: 90,
    ebitda: 18,
    growth: 28,
    mult: 14,
    baseEV: 330,
    netDebt: -10,
    history: [
      { label: 'N-2', rev: 48, ebitda: 6 },
      { label: 'N-1', rev: 68, ebitda: 11 },
      { label: 'N', rev: 90, ebitda: 18 },
    ],
    comparables: [
      { name: 'CloudNorth', multiple: 15.8 },
      { name: 'DataFjord', multiple: 13.2 },
      { name: 'Skyline SaaS', multiple: 14.6 },
    ],
    analystNote: {
      position: 'Infrastructure cloud en forte croissance sur le marché nordique.',
      strengths: ['Revenus récurrents (ARR)', 'Croissance du marché sous-jacent élevée'],
      watchouts: ['Churn en hausse récente', 'Dépendance à un fondateur clé'],
    },
    risks: [
      { id: 'r1', icon: '📉', title: 'Hausse du churn', impact: -30, note: "Taux d'attrition passé de 4 % à 9 % en un an." },
      { id: 'r2', icon: '📃', title: 'Contrats pluriannuels', impact: 28, note: 'ARR sécurisé par des engagements 3 ans.' },
      { id: 'r3', icon: '🧱', title: 'Dette technique', impact: -16, note: 'Migration cloud inachevée, coûts à venir.' },
      { id: 'r4', icon: '🔑', title: 'Homme clé', impact: -14, note: 'Architecture reposant sur un fondateur unique.' },
      { id: 'r5', icon: '🏢', title: 'Bureaux relocalisés', impact: 0, note: 'Déménagement récent, sans effet financier.' },
    ],
  },
  {
    id: 'meditech',
    name: 'MedITech Diagnostics',
    sector: 'MEDTECH',
    icon: '🩺',
    iconBg: '#E0EEF4',
    blurb: 'Fabricant de dispositifs de diagnostic médical. Clientèle hospitalière fidèle, cycle de vente long.',
    rev: 120,
    ebitda: 22,
    growth: 11,
    mult: 11,
    baseEV: 250,
    netDebt: 15,
    history: [
      { label: 'N-2', rev: 95, ebitda: 15 },
      { label: 'N-1', rev: 108, ebitda: 18 },
      { label: 'N', rev: 120, ebitda: 22 },
    ],
    comparables: [
      { name: 'MedScan Group', multiple: 12.5 },
      { name: 'BioSensis', multiple: 10.8 },
      { name: 'Cardia Devices', multiple: 11.6 },
    ],
    analystNote: {
      position: "Acteur de niche sur le diagnostic in-vitro, protégé par des barrières réglementaires fortes.",
      strengths: ['Portefeuille de brevets solide', 'Relations hospitalières historiques'],
      watchouts: ['Cycles de vente longs et rigides', "Sensible aux politiques d'achat public"],
    },
    risks: [
      { id: 'r1', icon: '🏥', title: 'Dépendance aux appels d’offres publics', impact: -18, note: "60 % du CA via des marchés hospitaliers renouvelés tous les 3 ans." },
      { id: 'r2', icon: '🧪', title: 'Nouveau brevet en instance', impact: 20, note: "Homologation d'un capteur nouvelle génération attendue sous 6 mois." },
      { id: 'r3', icon: '⚖️', title: 'Rappel réglementaire UE', impact: -22, note: 'Alerte de conformité sur un lot de capteurs, contrôle renforcé en cours.' },
      { id: 'r4', icon: '🌍', title: "Expansion à l'export", impact: 14, note: 'Premiers contrats signés en Allemagne et en Espagne.' },
      { id: 'r5', icon: '📋', title: 'Audit qualité ISO renouvelé', impact: 0, note: 'Certification reconduite sans réserve, situation normale.' },
    ],
  },
  {
    id: 'nova',
    name: 'Nova Charge',
    sector: 'MOBILITÉ ÉLECTRIQUE',
    icon: '⚡',
    iconBg: '#FCEFD6',
    blurb: 'Opérateur de bornes de recharge électrique. Croissance fulgurante, rentabilité encore fragile.',
    rev: 60,
    ebitda: 9,
    growth: 35,
    mult: 16,
    baseEV: 165,
    netDebt: 40,
    history: [
      { label: 'N-2', rev: 22, ebitda: 1 },
      { label: 'N-1', rev: 38, ebitda: 4 },
      { label: 'N', rev: 60, ebitda: 9 },
    ],
    comparables: [
      { name: 'ChargePoint Europe', multiple: 18.2 },
      { name: 'VoltWay', multiple: 15.4 },
      { name: 'PlugNet', multiple: 14.1 },
    ],
    analystNote: {
      position: 'Pure player de la recharge électrique sur un marché en forte expansion réglementaire.',
      strengths: ['Croissance du marché sous-jacent très forte', 'Contrats pluriannuels sécurisant les revenus'],
      watchouts: ['Rentabilité encore faible', 'Forte dépendance aux politiques publiques de subvention'],
    },
    risks: [
      { id: 'r1', icon: '🔌', title: "Retards d'installation", impact: -10, note: 'Délais d’obtention des raccordements réseau allongés.' },
      { id: 'r2', icon: '🤝', title: 'Partenariat exclusif grande distribution', impact: 18, note: 'Accord signé pour équiper 200 parkings sur 3 ans.' },
      { id: 'r3', icon: '💸', title: 'Subventions publiques incertaines', impact: -15, note: "Le dispositif d'aide à l'installation pourrait être révisé en baisse." },
      { id: 'r4', icon: '📶', title: 'Technologie propriétaire de supervision', impact: 12, note: 'Plateforme logicielle différenciante, revenus de service récurrents.' },
      { id: 'r5', icon: '🚗', title: 'Flotte de maintenance renouvelée', impact: 0, note: 'Renouvellement standard, sans effet sur la valeur.' },
    ],
  },
  {
    id: 'atlas',
    name: 'Atlas Infra',
    sector: 'BTP & INFRASTRUCTURES',
    icon: '🏗️',
    iconBg: '#EDE6DA',
    blurb: 'Groupe de travaux publics spécialisé dans les infrastructures routières. Carnet solide, secteur mature.',
    rev: 260,
    ebitda: 31,
    growth: 4,
    mult: 7,
    baseEV: 200,
    netDebt: 55,
    history: [
      { label: 'N-2', rev: 235, ebitda: 26 },
      { label: 'N-1', rev: 248, ebitda: 29 },
      { label: 'N', rev: 260, ebitda: 31 },
    ],
    comparables: [
      { name: 'Voreo Construction', multiple: 6.8 },
      { name: 'Terra Publics', multiple: 7.4 },
      { name: 'RoutExpert', multiple: 7.1 },
    ],
    analystNote: {
      position: 'Acteur régional solide sur les infrastructures publiques, activité cyclique mais carnet sécurisé.',
      strengths: ['Carnet de commandes pluriannuel', 'Diversification vers les infrastructures vertes'],
      watchouts: ['Marges sensibles au prix des matières premières', 'Secteur à faible croissance structurelle'],
    },
    risks: [
      { id: 'r1', icon: '🧱', title: 'Hausse du coût des matériaux', impact: -20, note: 'Prix du bitume et de l’acier en forte hausse depuis un an.' },
      { id: 'r2', icon: '🏛️', title: 'Contrats publics pluriannuels', impact: 24, note: 'Trois marchés publics signés jusqu’en 2028.' },
      { id: 'r3', icon: '⚠️', title: 'Contentieux prud’homal', impact: -10, note: 'Procédure en cours avec d’anciens sous-traitants.' },
      { id: 'r4', icon: '🌱', title: 'Virage vers les infrastructures vertes', impact: 16, note: 'Nouveau pôle mobilité douce en forte demande.' },
      { id: 'r5', icon: '👷', title: 'Renouvellement du parc d’engins', impact: 0, note: 'Investissement courant de maintenance, sans impact valorisation.' },
    ],
  },
  {
    id: 'loriot',
    name: 'Maison Loriot',
    sector: 'LUXE & SPIRITUEUX',
    icon: '🥂',
    iconBg: '#F4E6E9',
    blurb: 'Maison de spiritueux haut de gamme, forte notoriété à l’export. Marges élevées, actif de marque précieux.',
    rev: 130,
    ebitda: 33,
    growth: 9,
    mult: 13,
    baseEV: 380,
    netDebt: -25,
    history: [
      { label: 'N-2', rev: 108, ebitda: 25 },
      { label: 'N-1', rev: 119, ebitda: 29 },
      { label: 'N', rev: 130, ebitda: 33 },
    ],
    comparables: [
      { name: 'Château Vermont', multiple: 14.5 },
      { name: 'Grande Distillerie du Sud', multiple: 12.2 },
      { name: 'Maison Ferrand-Lys', multiple: 13.8 },
    ],
    analystNote: {
      position: 'Marque patrimoniale sur le segment luxe, forte capacité de pricing et marges élevées.',
      strengths: ['Image de marque et pricing power', 'Génération de cash élevée, faible besoin en capex'],
      watchouts: ['Concentration géographique des ventes', 'Exposition aux aléas agricoles'],
    },
    risks: [
      { id: 'r1', icon: '🌏', title: 'Concentration sur le marché asiatique', impact: -25, note: "45 % des ventes réalisées en Chine, exposée aux taxes à l'import." },
      { id: 'r2', icon: '🏆', title: 'Distinction internationale récente', impact: 20, note: 'Médaille d’or à un concours international, effet halo sur les ventes.' },
      { id: 'r3', icon: '🍇', title: "Aléas climatiques sur l'approvisionnement", impact: -14, note: 'Vendanges 2025 affectées par la sécheresse.' },
      { id: 'r4', icon: '📦', title: 'Extension de gamme premium', impact: 18, note: 'Lancement d’une cuvée limitée à forte marge.' },
      { id: 'r5', icon: '🖋️', title: 'Changement de maître de chai', impact: 0, note: 'Transition planifiée de longue date, sans rupture de savoir-faire.' },
    ],
  },
  {
    id: 'quickfret',
    name: 'QuickFret',
    sector: 'LOGISTIQUE',
    icon: '📦',
    iconBg: '#E7EEF7',
    blurb: 'Plateforme de livraison du dernier kilomètre pour le e-commerce. Volumes en hausse, marges sous pression.',
    rev: 175,
    ebitda: 14,
    growth: 12,
    mult: 8,
    baseEV: 130,
    netDebt: 30,
    history: [
      { label: 'N-2', rev: 140, ebitda: 8 },
      { label: 'N-1', rev: 158, ebitda: 11 },
      { label: 'N', rev: 175, ebitda: 14 },
    ],
    comparables: [
      { name: 'Colisia', multiple: 8.9 },
      { name: 'FastDrop', multiple: 7.6 },
      { name: 'UrbanFleet', multiple: 8.3 },
    ],
    analystNote: {
      position: 'Acteur de la livraison du dernier kilomètre, volumes portés par l’e-commerce mais marges structurellement faibles.',
      strengths: ["Croissance des volumes soutenue par l'e-commerce", "Nouveaux contrats d'exclusivité"],
      watchouts: ['Marges très sensibles aux coûts variables (carburant, main d’œuvre)', 'Risque juridique sur le statut des livreurs'],
    },
    risks: [
      { id: 'r1', icon: '⛽', title: 'Sensibilité au coût du carburant', impact: -16, note: 'Marge opérationnelle très sensible au prix du gazole.' },
      { id: 'r2', icon: '📲', title: 'Nouveau contrat avec un grand e-commerçant', impact: 22, note: 'Accord de livraison exclusif signé pour 2 ans.' },
      { id: 'r3', icon: '🧍', title: 'Requalification de livreurs indépendants', impact: -20, note: 'Risque prud’homal sur le statut de plusieurs centaines de livreurs.' },
      { id: 'r4', icon: '🤖', title: 'Automatisation du tri en entrepôt', impact: 13, note: 'Nouveau centre robotisé réduisant les coûts de traitement.' },
      { id: 'r5', icon: '📍', title: 'Ouverture de deux nouveaux dépôts', impact: 0, note: 'Expansion planifiée de longue date, déjà intégrée au plan d’affaires.' },
    ],
  },
];

export const RIVAL_NAMES = ['Meridian Partners', 'Blackford Equity'];

export const SCREEN_ORDER: GameState['screen'][] = [
  'cible',
  'valo',
  'dd',
  'rapport',
  'financement',
  'enchere',
  'synergies',
  'resultats',
];

export const STEP_LABELS = [
  'Cible',
  'Valorisation',
  'Due Dil.',
  'Rapport DD',
  'Financement',
  'Enchère',
  'Synergies',
  'Résultats',
];

export const AUCTION_MIN = 80;
export const AUCTION_MAX = 450;
export const MIN_TREASURY_TO_CONTINUE = 30;
export const GROUP_INTEREST_RATE = 0.05;
export const STRETCH_DEBT_RATE = 0.11;
export const MAX_STRETCH_DEBT = 150;

export function fmt(n: number): string {
  return Math.round(n) + ' M€';
}

export function findTarget(id: string | null): Target {
  return TARGETS.find((t) => t.id === id) ?? TARGETS[0];
}

export function valuation(target: Target, wacc: number, growth: number, exit: number) {
  const w = wacc / 100;
  const g = growth / 100;
  const tg = 0.025;
  const fcf0 = target.ebitda * 0.6;
  let pv = 0;
  let fcf = fcf0;
  for (let i = 1; i <= 5; i++) {
    fcf *= 1 + g;
    pv += fcf / Math.pow(1 + w, i);
  }
  const term = (fcf * (1 + tg)) / (w - tg);
  const evDcf = pv + term / Math.pow(1 + w, 5);
  const evMult = target.ebitda * exit;
  const evEst = (evDcf + evMult) / 2;
  return { evDcf, evMult, evEst };
}

export function trueFair(target: Target): number {
  return target.baseEV + target.risks.reduce((a, r) => a + r.impact, 0);
}

export function revealedNet(target: Target, revealed: string[]): number {
  return target.risks
    .filter((r) => revealed.includes(r.id))
    .reduce((a, r) => a + r.impact, 0);
}

export function financing(target: Target, debt: number, treasuryAvailable: number) {
  const d = debt / 100;
  const facility = 400;
  const equity = treasuryAvailable;
  const debtRaised = d * facility;
  const capacity = equity + debtRaised;
  const waccDeal = (1 - d) * 12 + d * 5 * 0.75;
  const leverage = debtRaised / target.ebitda;
  return { equity, debtRaised, capacity, waccDeal, leverage };
}

export interface FinancingBreakdown {
  equitySpent: number;
  stretchDebt: number;
}

export function computeFinancingBreakdown(bid: number, normalDebtRaised: number, treasury: number): FinancingBreakdown {
  const gapAfterDebt = Math.max(0, bid - normalDebtRaised);
  const equitySpent = Math.min(gapAfterDebt, treasury);
  const stretchDebt = Math.max(0, gapAfterDebt - treasury);
  return { equitySpent, stretchDebt };
}

export function totalGroupDebt(deals: DealRecord[]): number {
  return deals.reduce((a, d) => a + d.debtRaised + d.stretchDebt, 0);
}

export function groupInterest(deals: DealRecord[]): number {
  const normal = deals.reduce((a, d) => a + d.debtRaised, 0);
  const stretch = deals.reduce((a, d) => a + d.stretchDebt, 0);
  return Math.round(normal * GROUP_INTEREST_RATE + stretch * STRETCH_DEBT_RATE);
}

export function synValue(key: 'cost' | 'rev' | 'tax', p: number): number {
  if (key === 'cost') return Math.max(0, 8 * p - 0.25 * p * p);
  if (key === 'rev') return Math.max(0, 10 * p - 0.5 * p * p);
  return Math.max(0, 6 * p - 0.2 * p * p);
}

export const SYN_POOL_TOTAL = 12;
export const SYN_POINT_COST = 5;

export function synUsed(syn: GameState['syn']): number {
  return syn.cost + syn.rev + syn.tax;
}

export function synTotal(syn: GameState['syn']): number {
  return synValue('cost', syn.cost) + synValue('rev', syn.rev) + synValue('tax', syn.tax);
}

const AUCTION_RANGES: Record<Difficulty, [number, number]> = {
  easy: [0.8, 0.98],
  normal: [0.9, 1.06],
  hard: [0.98, 1.15],
};

export function runAuction(target: Target, difficulty: Difficulty): Rival[] {
  const fair = trueFair(target);
  const [lo, hi] = AUCTION_RANGES[difficulty] ?? AUCTION_RANGES.normal;
  return RIVAL_NAMES.map((name) => ({
    name,
    bid: Math.round((fair * (lo + Math.random() * (hi - lo))) / 5) * 5,
  }));
}

export interface ScoreResult {
  ddScore: number;
  dealScore: number;
  finScore: number;
  synScore: number;
  total: number;
}

export function computeScore(state: GameState, target: Target, treasuryAvailable: number): ScoreResult {
  const fair = trueFair(target);
  const material = target.risks.filter((r) => Math.abs(r.impact) >= 15);
  const totMat = material.reduce((a, r) => a + Math.abs(r.impact), 0);
  const gotMat = material
    .filter((r) => state.revealed.includes(r.id))
    .reduce((a, r) => a + Math.abs(r.impact), 0);
  const detection = (totMat ? gotMat / totMat : 0) * 180;

  const opened = target.risks.filter((r) => state.revealed.includes(r.id));
  const filled = opened.filter((r) => {
    const c = state.reports[r.id] || ({} as Partial<GameState['reports'][string]>);
    return c.gravite && c.mesure && String(c.mesure).trim();
  });
  const filledFrac = opened.length ? filled.length / opened.length : 0;
  const reportQuality = (state.reco ? 25 : 0) + filledFrac * 45;
  const ddScore = Math.round(detection + reportQuality);

  const bid = state.bid;
  const won = state.won;
  let dealScore: number;
  if (won) {
    const over = (bid - fair) / fair;
    dealScore = over <= 0 ? 350 : Math.max(60, Math.round(350 - over * 900));
  } else {
    dealScore = bid <= fair ? 120 : 40;
  }

  const fin = financing(target, state.debt, treasuryAvailable);
  const lev = (fin.debtRaised + (won ? state.stretchDebt : 0)) / target.ebitda;
  let finScore: number;
  if (lev >= 2.5 && lev <= 4.5) {
    finScore = 200;
  } else {
    const dist = lev < 2.5 ? 2.5 - lev : lev - 4.5;
    finScore = Math.max(0, Math.round(200 - dist * 55));
  }

  const synScore = won ? Math.min(200, Math.round((synTotal(state.syn) / 120) * 200)) : 0;
  const total = Math.min(1000, ddScore + dealScore + finScore + synScore);

  return { ddScore, dealScore, finScore, synScore, total };
}

export function buildDealRecord(state: GameState, target: Target, treasuryAvailable: number): DealRecord {
  const sc = computeScore(state, target, treasuryAvailable);
  const fin = financing(target, state.debt, treasuryAvailable);
  const won = !!state.won;
  const stretchDebt = won ? state.stretchDebt : 0;
  const equitySpent = won ? Math.max(0, state.bid - fin.debtRaised - stretchDebt) : 0;
  const synergies = won ? synTotal(state.syn) : 0;
  return {
    targetId: target.id,
    targetName: target.name,
    won,
    bid: state.bid,
    fairValue: trueFair(target),
    equitySpent,
    debtRaised: won ? fin.debtRaised : 0,
    stretchDebt,
    synergies,
    reco: state.reco,
    ddScore: sc.ddScore,
    dealScore: sc.dealScore,
    finScore: sc.finScore,
    synScore: sc.synScore,
    totalScore: sc.total,
  };
}

export function dealAlpha(deal: DealRecord): number {
  return deal.fairValue + deal.synergies - deal.bid;
}

export function canContinue(deals: DealRecord[], treasury: number): boolean {
  return treasury >= MIN_TREASURY_TO_CONTINUE && deals.length < TARGETS.length;
}

const RIVAL_SCORES: Record<Difficulty, [number, number]> = {
  easy: [540, 470],
  normal: [690, 610],
  hard: [780, 720],
};

export function rivalScores(difficulty: Difficulty): [number, number] {
  return RIVAL_SCORES[difficulty] ?? RIVAL_SCORES.normal;
}

export interface RivalPortfolio {
  name: string;
  deals: number;
  totalValue: number;
  avgScore: number;
}

const RIVAL_PORTFOLIOS: Record<Difficulty, RivalPortfolio[]> = {
  easy: [
    { name: 'Meridian Partners', deals: 3, totalValue: 140, avgScore: 540 },
    { name: 'Blackford Equity', deals: 2, totalValue: 85, avgScore: 470 },
    { name: 'Havre Industries', deals: 2, totalValue: 55, avgScore: 400 },
  ],
  normal: [
    { name: 'Meridian Partners', deals: 3, totalValue: 210, avgScore: 690 },
    { name: 'Blackford Equity', deals: 3, totalValue: 150, avgScore: 610 },
    { name: 'Havre Industries', deals: 2, totalValue: 80, avgScore: 430 },
  ],
  hard: [
    { name: 'Meridian Partners', deals: 4, totalValue: 300, avgScore: 780 },
    { name: 'Blackford Equity', deals: 3, totalValue: 220, avgScore: 720 },
    { name: 'Havre Industries', deals: 3, totalValue: 120, avgScore: 500 },
  ],
};

export function rivalPortfolios(difficulty: Difficulty): RivalPortfolio[] {
  return RIVAL_PORTFOLIOS[difficulty] ?? RIVAL_PORTFOLIOS.normal;
}

export const GRAVITY_LEVELS: [string, string][] = [
  ['Faible', '#4E7A4E'],
  ['Moyen', '#B8892A'],
  ['Élevé', '#C1502E'],
  ['Rédhibitoire', '#93341A'],
];

export const RECO_OPTIONS: [string, string, string][] = [
  ["Poursuivre l'acquisition", '#4E7A4E', '✅'],
  ['Renégocier le prix', '#B8892A', '🤝'],
  ['Se retirer du deal', '#B23A2E', '🚫'],
];

export const SYN_META: { key: 'cost' | 'rev' | 'tax'; icon: string; label: string; desc: string }[] = [
  { key: 'cost', icon: '✂️', label: 'Coûts', desc: 'Rationalisation des achats, sites et fonctions support.' },
  { key: 'rev', icon: '🔗', label: 'Revenus', desc: 'Ventes croisées et accès à de nouveaux marchés.' },
  { key: 'tax', icon: '🏛️', label: 'Fiscal & financier', desc: 'Optimisation fiscale et refinancement de la dette.' },
];

export const DEAL_DEFAULTS = {
  target: null as string | null,
  wacc: 10,
  growth: 8,
  exit: 9,
  revealed: [] as string[],
  debt: 40,
  bid: 200,
  rivals: null as Rival[] | null,
  won: null as boolean | null,
  auctionDone: false,
  stretchDebt: 0,
  syn: { cost: 0, rev: 0, tax: 0 },
  reports: {} as GameState['reports'],
  reco: '',
  recoNote: '',
};

export function createInitialState(startingBudget: number): GameState {
  return {
    screen: 'lobby',
    teamName: '',
    started: false,
    seconds: 0,
    treasury: startingBudget,
    lastInterest: 0,
    deals: [],
    ...DEAL_DEFAULTS,
  };
}
