import { useEffect, useRef, useState } from 'react';
import { AUCTION_MAX, MAX_STRETCH_DEBT, STRETCH_DEBT_RATE, fmt } from '../../engine';
import { closeAuction, placeBid } from '../lib/api';
import type { Auction, Bid, Team } from '../types';
import type { Target } from '../../types';

interface LiveAuctionRoomProps {
  target: Target;
  auction: Auction;
  bids: Bid[];
  teams: Team[];
  myTeam: Team;
  onBack: () => void;
}

function timeLeft(endsAt: string): number {
  return Math.max(0, Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000));
}

export function LiveAuctionRoom({ target, auction, bids, teams, myTeam, onBack }: LiveAuctionRoomProps) {
  const [remaining, setRemaining] = useState(() => timeLeft(auction.ends_at));
  const [debtPct, setDebtPct] = useState(auction.current_debt_pct || 40);
  const [bidAmount, setBidAmount] = useState(auction.current_bid + 5);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const closeAttempted = useRef(false);

  useEffect(() => {
    setBidAmount(auction.current_bid + 5);
  }, [auction.current_bid]);

  useEffect(() => {
    const id = setInterval(() => setRemaining(timeLeft(auction.ends_at)), 250);
    return () => clearInterval(id);
  }, [auction.ends_at]);

  useEffect(() => {
    if (remaining === 0 && auction.status === 'open' && !closeAttempted.current) {
      closeAttempted.current = true;
      closeAuction(auction.id).catch(() => {
        closeAttempted.current = false;
      });
    }
  }, [remaining, auction.status, auction.id]);

  const teamName = (id: string | null) => (id ? teams.find((t) => t.id === id)?.name ?? '—' : '—');
  const capacity = myTeam.treasury + (debtPct / 100) * 400;
  const maxCapacity = capacity + MAX_STRETCH_DEBT;
  const usesStretch = bidAmount > capacity && bidAmount <= maxCapacity;
  const overCap = bidAmount > maxCapacity;
  const canBid = auction.status === 'open' && remaining > 0 && !overCap && bidAmount >= auction.current_bid + 5;
  const isLeader = auction.leader_team_id === myTeam.id;

  const feed = bids
    .filter((b) => b.auction_id === auction.id)
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  async function handleBid() {
    setBusy(true);
    setError(null);
    try {
      await placeBid({ auctionId: auction.id, teamId: myTeam.id, amount: bidAmount, debtPct });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '30px 34px' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '.2em', color: '#93341A' }}>
          {auction.kind === 'resale' ? 'REVENTE EN DIRECT' : 'ENCHÈRE EN DIRECT'} — {target.name}
        </div>
        <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 32, letterSpacing: '-.02em', margin: '8px 0 6px' }}>
          {auction.status === 'open' ? 'Enchérissez maintenant' : 'Enchère clôturée'}
        </h2>
        {auction.kind === 'resale' && (
          <p style={{ fontSize: 14, color: '#5B4B3E', margin: 0 }}>
            Vendeur&nbsp;: <b>{teamName(auction.seller_team_id)}</b>
          </p>
        )}
      </div>

      <div style={{ background: '#241812', borderRadius: 20, padding: 26, color: '#F4E9D8', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '.18em', color: '#E0973A' }}>OFFRE ACTUELLE</div>
        <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 54, lineHeight: 1, margin: '8px 0 4px' }}>
          {fmt(auction.current_bid)}
        </div>
        <div style={{ fontFamily: "'Space Mono'", fontSize: 13, color: '#BCA997' }}>
          menée par {teamName(auction.leader_team_id)}
          {isLeader ? ' (vous)' : ''}
        </div>
        {auction.status === 'open' && (
          <div
            style={{
              marginTop: 16,
              fontFamily: "'Space Mono'",
              fontWeight: 700,
              fontSize: 28,
              color: remaining <= 15 ? '#E0973A' : '#F4E9D8',
            }}
          >
            {mm}:{ss}
          </div>
        )}
      </div>

      {auction.status === 'open' && (
        <div style={{ background: '#FFFDF7', border: '1px solid #E8DBC6', borderRadius: 20, padding: 26, marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Votre offre</span>
            <span style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 26, color: '#C1502E' }}>{fmt(bidAmount)}</span>
          </div>
          <input
            type="range"
            min={auction.current_bid + 5}
            max={AUCTION_MAX}
            step={5}
            value={bidAmount}
            onChange={(e) => setBidAmount(parseFloat(e.target.value))}
            style={{ width: '100%', margin: '10px 0 14px' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Part de dette pour cette offre</span>
            <span style={{ fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 15, color: '#C1502E' }}>{debtPct} %</span>
          </div>
          <input
            type="range"
            min={0}
            max={70}
            step={5}
            value={debtPct}
            onChange={(e) => setDebtPct(parseFloat(e.target.value))}
            style={{ width: '100%', margin: '10px 0 14px' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Space Mono'", fontSize: 11, color: '#A0907A' }}>
            <span>Trésorerie {fmt(myTeam.treasury)}</span>
            <span>capacité normale {fmt(capacity)}</span>
            <span>max avec dette de dernière minute {fmt(maxCapacity)}</span>
          </div>

          {usesStretch && (
            <div style={{ marginTop: 14, padding: '10px 14px', background: '#F4E3C4', border: '1px solid #E0973A', borderRadius: 10, color: '#93341A', fontSize: 12.5, fontWeight: 600 }}>
              🏦 {fmt(bidAmount - capacity)} de cette offre seraient financés en dette de dernière minute (taux{' '}
              {Math.round(STRETCH_DEBT_RATE * 100)}&nbsp;%).
            </div>
          )}
          {overCap && (
            <div style={{ marginTop: 14, padding: '10px 14px', background: '#F7E0DB', border: '1px solid #E0A99F', borderRadius: 10, color: '#93341A', fontSize: 12.5, fontWeight: 600 }}>
              ⚠ Offre hors de portée, même avec une dette de dernière minute.
            </div>
          )}
          {error && (
            <div style={{ marginTop: 14, padding: '10px 14px', background: '#F7E0DB', border: '1px solid #E0A99F', borderRadius: 10, color: '#93341A', fontSize: 12.5, fontWeight: 600 }}>
              {error}
            </div>
          )}

          <button
            className="btn-amber"
            style={{ width: '100%', marginTop: 16, opacity: !canBid || busy ? 0.6 : 1 }}
            disabled={!canBid || busy || isLeader}
            onClick={handleBid}
          >
            {isLeader ? '🏆 Vous menez déjà' : busy ? 'Envoi…' : `🔨 Enchérir à ${fmt(bidAmount)}`}
          </button>
        </div>
      )}

      {auction.status === 'closed' && (
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <div style={{ padding: 20, background: isLeader ? '#F0F4EC' : '#F9EDEA', borderRadius: 16 }}>
            <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 22, color: isLeader ? '#3E6B3E' : '#93341A' }}>
              {auction.leader_team_id
                ? isLeader
                  ? '🎉 Vous avez remporté la cible !'
                  : `${teamName(auction.leader_team_id)} remporte la cible.`
                : "Personne n'a enchéri — la cible retourne sur le marché."}
            </div>
          </div>
          <button className="btn-primary" style={{ marginTop: 16 }} onClick={onBack}>
            ← Retour au marché
          </button>
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 15, marginBottom: 10 }}>
          Historique des offres
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {feed.length === 0 && <p style={{ fontSize: 13, color: '#A0907A' }}>Aucune offre pour l'instant.</p>}
          {feed.map((b) => (
            <div
              key={b.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '9px 14px',
                background: b.team_id === myTeam.id ? '#FDF0E4' : '#FBF4E8',
                border: `1px solid ${b.team_id === myTeam.id ? '#E0973A' : '#EADCC4'}`,
                borderRadius: 10,
                fontSize: 13,
              }}
            >
              <span style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700 }}>
                {teamName(b.team_id)}
                {b.team_id === myTeam.id ? ' (vous)' : ''}
              </span>
              <span style={{ fontFamily: "'Space Mono'", fontWeight: 700 }}>{fmt(b.amount)}</span>
            </div>
          ))}
        </div>
      </div>

      {auction.status === 'open' && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button className="btn-outline" onClick={onBack}>
            ← Revenir au marché (l'enchère continue)
          </button>
        </div>
      )}
    </div>
  );
}
