import { useState } from 'react';
import { SYN_META, SYN_POINT_COST, SYN_POOL_TOTAL, fmt, findTarget, synTotal, synValue, trueFair } from '../../engine';
import { updateSynergies } from '../lib/api';
import type { RoomTarget, SynLever, Team } from '../types';

interface MyPortfolioProps {
  targets: RoomTarget[];
  roomId: string;
  myTeam: Team;
  onResell: (targetId: string) => void;
}

function pointsFor(rt: RoomTarget, key: SynLever): number {
  if (key === 'cost') return rt.syn_cost;
  if (key === 'rev') return rt.syn_rev;
  return rt.syn_tax;
}

export function MyPortfolio({ targets, roomId, myTeam, onResell }: MyPortfolioProps) {
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const owned = targets.filter((t) => t.owner_team_id === myTeam.id);

  async function adjust(rt: RoomTarget, lever: SynLever, delta: 1 | -1) {
    const key = `${rt.target_id}:${lever}`;
    setBusyKey(key);
    try {
      await updateSynergies({ roomId, targetId: rt.target_id, teamId: myTeam.id, lever, delta });
    } catch {
      // ignore — RPC already enforces the rules, a rejected click is a no-op
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '30px 34px' }}>
      <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 8px' }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '.2em', color: '#93341A' }}>
          MON PORTEFEUILLE
        </div>
        <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 34, letterSpacing: '-.02em', margin: '8px 0 6px' }}>
          Entreprises acquises
        </h2>
        <p style={{ fontSize: 15, color: '#5B4B3E', margin: 0 }}>
          Investissez vos jetons de synergie pour valoriser vos entreprises — chaque jeton coûte{' '}
          {fmt(SYN_POINT_COST)} de trésorerie.
        </p>
      </div>

      {owned.length === 0 ? (
        <div
          style={{
            maxWidth: 480,
            margin: '30px auto 0',
            textAlign: 'center',
            background: '#FFFDF7',
            border: '1px solid #E8DBC6',
            borderRadius: 16,
            padding: 26,
            color: '#6B5A4B',
          }}
        >
          Vous ne détenez encore aucune entreprise. Retournez au marché pour lancer votre première enchère.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 26 }}>
          {owned.map((rt) => {
            const target = findTarget(rt.target_id);
            const fair = trueFair(target);
            const syn = { cost: rt.syn_cost, rev: rt.syn_rev, tax: rt.syn_tax };
            const synCreated = synTotal(syn);
            const used = rt.syn_cost + rt.syn_rev + rt.syn_tax;
            const remain = SYN_POOL_TOTAL - used;
            const canAfford = myTeam.treasury >= SYN_POINT_COST;

            return (
              <div key={rt.target_id} style={{ background: '#FFFDF7', border: '1px solid #E8DBC6', borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: target.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                      }}
                    >
                      {target.icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 18 }}>{target.name}</div>
                      <div style={{ fontFamily: "'Space Mono'", fontSize: 11, color: '#A0907A' }}>
                        Valeur réelle {fmt(fair)} + synergies {fmt(synCreated)} ={' '}
                        <b style={{ color: '#4E7A4E' }}>{fmt(fair + synCreated)}</b>
                      </div>
                    </div>
                  </div>
                  <button className="btn-amber-outline" onClick={() => onResell(rt.target_id)}>
                    Mettre aux enchères
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontFamily: "'Space Mono'", fontSize: 11, color: '#A0907A' }}>JETONS RESTANTS</span>
                  <span style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 15, color: remain === 0 ? '#4E7A4E' : '#C1502E' }}>
                    {remain}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                  {SYN_META.map((m) => {
                    const pts = pointsFor(rt, m.key);
                    const key = `${rt.target_id}:${m.key}`;
                    return (
                      <div key={m.key} style={{ background: '#FBF4E8', borderRadius: 14, padding: 14, textAlign: 'center' }}>
                        <div style={{ fontSize: 22 }}>{m.icon}</div>
                        <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 13, margin: '6px 0 2px' }}>{m.label}</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '8px 0' }}>
                          <button
                            className="round-btn"
                            style={{ width: 30, height: 30, fontSize: 16 }}
                            disabled={pts <= 0 || busyKey === key}
                            onClick={() => adjust(rt, m.key, -1)}
                          >
                            −
                          </button>
                          <span style={{ fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 18, minWidth: 20 }}>{pts}</span>
                          <button
                            className="round-btn"
                            style={{ width: 30, height: 30, fontSize: 16 }}
                            disabled={remain <= 0 || !canAfford || busyKey === key}
                            onClick={() => adjust(rt, m.key, 1)}
                          >
                            +
                          </button>
                        </div>
                        <div style={{ fontFamily: "'Space Mono'", fontSize: 11, color: '#4E7A4E', fontWeight: 700 }}>
                          {fmt(synValue(m.key, pts))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
