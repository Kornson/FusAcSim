import { dealAlpha, fmt } from '../engine';
import type { DealRecord } from '../types';

interface PortfolioPanelProps {
  deals: DealRecord[];
  treasury: number;
  totalDebt: number;
  teamLabel: string;
  onClose: () => void;
}

export function PortfolioPanel({ deals, treasury, totalDebt, teamLabel, onClose }: PortfolioPanelProps) {
  const wonDeals = deals.filter((d) => d.won);
  const totalValueCreated = wonDeals.reduce((a, d) => a + dealAlpha(d), 0);
  const totalStretchDebt = deals.reduce((a, d) => a + d.stretchDebt, 0);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(36,24,18,.45)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '60px 20px',
        overflowY: 'auto',
        animation: 'floatIn .25s ease both',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFDF7',
          borderRadius: 22,
          padding: 28,
          maxWidth: 620,
          width: '100%',
          boxShadow: '0 30px 60px -20px rgba(40,20,10,.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '.18em', color: '#93341A' }}>
              PORTEFEUILLE EN COURS · {teamLabel}
            </div>
            <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 24, marginTop: 4 }}>
              Mon portefeuille
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            style={{
              appearance: 'none',
              cursor: 'pointer',
              border: 'none',
              background: '#F4EAD8',
              color: '#241812',
              width: 34,
              height: 34,
              borderRadius: '50%',
              fontSize: 16,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: totalDebt > 0 ? '1fr 1fr 1fr' : '1fr 1fr', gap: 12, marginTop: 20 }}>
          <div style={{ background: '#FBF4E8', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '.12em', color: '#A0907A' }}>TRÉSORERIE</div>
            <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 20, color: '#4E7A4E' }}>{fmt(treasury)}</div>
          </div>
          {totalDebt > 0 && (
            <div style={{ background: '#FBF4E8', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '.12em', color: '#A0907A' }}>DETTE DU GROUPE</div>
              <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 20, color: '#B23A2E' }}>{fmt(totalDebt)}</div>
              {totalStretchDebt > 0 && (
                <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: '#A0907A', marginTop: 2 }}>
                  dont {fmt(totalStretchDebt)} à taux majoré
                </div>
              )}
            </div>
          )}
          <div style={{ background: '#FBF4E8', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '.12em', color: '#A0907A' }}>VALEUR CRÉÉE À CE STADE</div>
            <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 20, color: totalValueCreated >= 0 ? '#4E7A4E' : '#B23A2E' }}>
              {totalValueCreated >= 0 ? '+' : ''}
              {fmt(totalValueCreated)}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 15, marginBottom: 10 }}>
            Entreprises acquises ({wonDeals.length})
          </div>
          {wonDeals.length === 0 ? (
            <p style={{ fontSize: 13.5, color: '#6B5A4B', margin: 0 }}>
              Aucune acquisition bouclée pour l'instant. Le tableau se remplira après votre premier deal gagné.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
              {wonDeals.map((d) => {
                const alpha = dealAlpha(d);
                return (
                  <div key={d.targetId} style={{ padding: '11px 14px', background: '#FBF4E8', borderRadius: 11 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 14 }}>{d.targetName}</span>
                      <span
                        style={{
                          fontFamily: "'Space Mono'",
                          fontWeight: 700,
                          fontSize: 13,
                          color: alpha >= 0 ? '#4E7A4E' : '#B23A2E',
                        }}
                      >
                        {alpha >= 0 ? '+' : ''}
                        {fmt(alpha)} créés
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 14, marginTop: 3, fontSize: 11.5, color: '#6B5A4B', fontFamily: "'Space Mono'" }}>
                      <span>Payé {fmt(d.bid)}</span>
                      <span>Réel {fmt(d.fairValue)}</span>
                      <span>Synergies {fmt(d.synergies)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {deals.length > wonDeals.length && (
          <p style={{ fontSize: 12, color: '#A0907A', marginTop: 14, marginBottom: 0 }}>
            {deals.length - wonDeals.length} enchère(s) perdue(s) au profit de fonds rivaux cette session.
          </p>
        )}
      </div>
    </div>
  );
}
