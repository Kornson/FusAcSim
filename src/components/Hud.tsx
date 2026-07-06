import { fmt } from '../engine';

interface HudProps {
  started: boolean;
  teamLabel: string;
  equity: number;
  totalDebt: number;
  showTimer: boolean;
  seconds: number;
  dealsCount: number;
  showPortfolioButton: boolean;
  onTogglePortfolio: () => void;
}

function timeStr(seconds: number): string {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function Hud({ started, teamLabel, equity, totalDebt, showTimer, seconds, dealsCount, showPortfolioButton, onTogglePortfolio }: HudProps) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 34px',
        background: 'rgba(251,244,232,.82)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid #E3D3B6',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: '#241812',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 0 #93341A',
          }}
        >
          <span style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, color: '#E0973A', fontSize: 22, lineHeight: 1 }}>
            D
          </span>
        </div>
        <div>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 20, letterSpacing: '-.01em', lineHeight: 1 }}>
            LE GRAND DEAL
          </div>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 10.5, letterSpacing: '.22em', color: '#A0907A' }}>
            BUSINESS&nbsp;GAME&nbsp;·&nbsp;FUSIONS-ACQUISITIONS
          </div>
        </div>
      </div>
      {started && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          {showPortfolioButton && (
            <button
              onClick={onTogglePortfolio}
              style={{
                appearance: 'none',
                cursor: 'pointer',
                fontFamily: "'Bricolage Grotesque'",
                fontWeight: 700,
                fontSize: 13,
                color: '#93341A',
                background: '#F4E3C4',
                border: '1.5px solid #E0973A',
                borderRadius: 999,
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
              }}
            >
              📁 Mon portefeuille{dealsCount > 0 ? ` (${dealsCount})` : ''}
            </button>
          )}
          <div style={{ width: 1, height: 34, background: '#E3D3B6' }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '.18em', color: '#A0907A' }}>ÉQUIPE</div>
            <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 16 }}>{teamLabel}</div>
          </div>
          <div style={{ width: 1, height: 34, background: '#E3D3B6' }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '.18em', color: '#A0907A' }}>TRÉSORERIE</div>
            <div style={{ fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 16, color: '#4E7A4E' }}>{fmt(equity)}</div>
          </div>
          {totalDebt > 0 && (
            <>
              <div style={{ width: 1, height: 34, background: '#E3D3B6' }} />
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '.18em', color: '#A0907A' }}>DETTE GROUPE</div>
                <div style={{ fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 16, color: '#B23A2E' }}>{fmt(totalDebt)}</div>
              </div>
            </>
          )}
          {showTimer && (
            <>
              <div style={{ width: 1, height: 34, background: '#E3D3B6' }} />
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '.18em', color: '#A0907A' }}>TEMPS</div>
                <div style={{ fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 16 }}>{timeStr(seconds)}</div>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
