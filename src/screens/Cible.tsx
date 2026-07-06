import { AUCTION_MIN, GROUP_INTEREST_RATE, TARGETS, fmt } from '../engine';
import type { DealRecord } from '../types';

interface CibleProps {
  selectedId: string | null;
  deals: DealRecord[];
  treasury: number;
  totalDebt: number;
  lastInterest: number;
  onSelect: (id: string, growth: number, mult: number) => void;
}

export function Cible({ selectedId, deals, treasury, totalDebt, lastInterest, onSelect }: CibleProps) {
  const contested = new Map(deals.map((d) => [d.targetId, d.won]));
  const maxCapacity = treasury + 280;

  return (
    <div style={{ animation: 'floatIn .45s ease both' }}>
      <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 8px' }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '.2em', color: '#93341A' }}>
          DEAL ROOM · {deals.length + 1}{deals.length === 0 ? 'ère' : 'ème'} ACQUISITION
        </div>
        <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 38, letterSpacing: '-.02em', margin: '8px 0 6px' }}>
          Choisissez votre cible
        </h2>
        <p style={{ fontSize: 15.5, color: '#5B4B3E', margin: 0 }}>
          {TARGETS.length} dossiers sur la table. Chacun a son profil de croissance, ses marges… et ses secrets.
          Trésorerie disponible&nbsp;: <b style={{ color: '#4E7A4E' }}>{fmt(treasury)}</b> · capacité d'enchère max.
          estimée <b>{fmt(maxCapacity)}</b>
          {totalDebt > 0 && (
            <>
              {' '}
              · dette du groupe&nbsp;: <b style={{ color: '#B23A2E' }}>{fmt(totalDebt)}</b>
            </>
          )}
          .
        </p>
      </div>

      {lastInterest > 0 && (
        <div
          style={{
            maxWidth: 560,
            margin: '14px auto 0',
            textAlign: 'center',
            padding: '10px 16px',
            background: '#F9EDEA',
            border: '1px solid #E7C3BB',
            borderRadius: 11,
            color: '#93341A',
            fontSize: 12.5,
            fontWeight: 600,
          }}
        >
          💳 Intérêts sur la dette du groupe ({fmt(totalDebt)} à {Math.round(GROUP_INTEREST_RATE * 100)}&nbsp;%)
          prélevés sur votre trésorerie&nbsp;: −{fmt(lastInterest)}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginTop: 26 }}>
        {TARGETS.map((t) => {
          const outcome = contested.get(t.id);
          const unavailable = outcome !== undefined;
          const borderColor = selectedId === t.id ? '#C1502E' : '#EADCC4';
          const outOfReach = !unavailable && t.baseEV * 0.85 > maxCapacity;

          return (
            <div
              key={t.id}
              className={unavailable ? undefined : 'card-hover'}
              onClick={() => !unavailable && onSelect(t.id, t.growth, t.mult)}
              style={{
                cursor: unavailable ? 'default' : 'pointer',
                background: unavailable ? '#F4EFE4' : '#FFFDF7',
                border: `2px solid ${unavailable ? '#E3D3B6' : borderColor}`,
                borderRadius: 20,
                padding: 22,
                boxShadow: unavailable ? 'none' : '0 14px 34px -22px rgba(60,30,10,.5)',
                display: 'flex',
                flexDirection: 'column',
                opacity: unavailable ? 0.55 : 1,
                position: 'relative',
              }}
            >
              {unavailable && (
                <div
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    fontFamily: "'Space Mono'",
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: '.05em',
                    padding: '5px 10px',
                    borderRadius: 999,
                    background: outcome ? '#F0F4EC' : '#F9EDEA',
                    color: outcome ? '#4E7A4E' : '#B23A2E',
                    border: `1px solid ${outcome ? '#CFE0C2' : '#E7C3BB'}`,
                  }}
                >
                  {outcome ? '✅ Acquise' : '❌ Remportée par un rival'}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 13,
                    background: t.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                  }}
                >
                  {t.icon}
                </div>
                {!unavailable && (
                  <div
                    style={{
                      fontFamily: "'Space Mono'",
                      fontSize: 10.5,
                      letterSpacing: '.12em',
                      color: '#A0907A',
                      background: '#F4EAD8',
                      padding: '5px 10px',
                      borderRadius: 999,
                    }}
                  >
                    {t.sector}
                  </div>
                )}
              </div>
              <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 22, margin: '16px 0 3px' }}>
                {t.name}
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.5, color: '#6B5A4B', margin: '0 0 16px', minHeight: 60 }}>
                {t.blurb}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 10px', marginTop: 'auto' }}>
                <Stat label="CA" value={fmt(t.rev)} />
                <Stat label="EBITDA" value={fmt(t.ebitda)} />
                <Stat label="CROISSANCE" value={`+${t.growth} %`} color="#4E7A4E" />
                <Stat label="MULT. SECT." value={`${t.mult}×`} />
              </div>
              {!unavailable && (
                <div style={{ marginTop: 16, textAlign: 'center', fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 14, color: outOfReach ? '#A0907A' : '#C1502E' }}>
                  {outOfReach ? '⚠ Hors budget probable' : 'Étudier ce dossier →'}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {maxCapacity < AUCTION_MIN && (
        <div
          style={{
            marginTop: 22,
            padding: '14px 18px',
            background: '#F9EDEA',
            border: '1px solid #E7C3BB',
            borderRadius: 12,
            color: '#93341A',
            fontSize: 13.5,
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          ⚠ Trésorerie quasi épuisée&nbsp;: vous n'avez plus la capacité de financer une nouvelle acquisition.
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ background: '#FBF4E8', borderRadius: 10, padding: '9px 11px' }}>
      <div style={{ fontFamily: "'Space Mono'", fontSize: 9.5, letterSpacing: '.1em', color: '#A0907A' }}>{label}</div>
      <div style={{ fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 15, color: color ?? '#241812' }}>{value}</div>
    </div>
  );
}
