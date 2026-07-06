import { revealedNet } from '../engine';
import { NavFooter } from '../components/NavFooter';
import type { Target } from '../types';

interface DueDiligenceProps {
  target: Target;
  revealed: string[];
  onReveal: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function DueDiligence({ target, revealed, onReveal, onBack, onNext }: DueDiligenceProps) {
  const net = revealedNet(target, revealed);
  const netColor = net > 0 ? '#4E7A4E' : net < 0 ? '#B23A2E' : '#241812';

  return (
    <div style={{ animation: 'floatIn .45s ease both' }}>
      <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '.2em', color: '#93341A' }}>
          PHASE 02 · DUE DILIGENCE — {target.name}
        </div>
        <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 34, letterSpacing: '-.02em', margin: '8px 0 6px' }}>
          Ouvrez la data room
        </h2>
        <p style={{ fontSize: 15, color: '#5B4B3E', margin: 0 }}>
          Cliquez chaque dossier pour révéler ce qu'il cache. Certains détruisent de la valeur, d'autres en créent.
          Repérer les risques matériels rapporte des points.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, margin: '20px 0 4px', fontFamily: "'Space Mono'", fontSize: 12 }}>
        <span style={{ color: '#A0907A' }}>
          Dossiers ouverts <b style={{ color: '#241812' }}>{revealed.length}/{target.risks.length}</b>
        </span>
        <span style={{ color: '#A0907A' }}>
          Impact net révélé{' '}
          <b style={{ color: netColor }}>
            {net > 0 ? '+' : ''}
            {Math.round(net)} M€
          </b>
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginTop: 16 }}>
        {target.risks.map((r) => {
          const shown = revealed.includes(r.id);
          const pos = r.impact > 0;
          const neg = r.impact < 0;
          const bg = shown ? (pos ? '#F0F4EC' : neg ? '#F9EDEA' : '#FBF4E8') : '#FFFDF7';
          const border = shown ? (pos ? '#CFE0C2' : neg ? '#E7C3BB' : '#E8DBC6') : '#EADCC4';
          const impactColor = shown ? (pos ? '#4E7A4E' : neg ? '#B23A2E' : '#A0907A') : '#C1A57A';
          const impactStr = shown ? (r.impact === 0 ? 'neutre' : `${pos ? '+' : ''}${r.impact} M€`) : '?';

          return (
            <div
              key={r.id}
              className="dossier-card"
              onClick={() => onReveal(r.id)}
              style={{
                cursor: 'pointer',
                minHeight: 150,
                background: bg,
                border: `2px solid ${border}`,
                borderRadius: 18,
                padding: 20,
                transition: 'all .2s',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: shown ? '#FFFFFF' : '#F4EAD8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 19,
                  }}
                >
                  {shown ? r.icon : '🔒'}
                </div>
                <div style={{ fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 15, color: impactColor }}>
                  {impactStr}
                </div>
              </div>
              <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 16, margin: '14px 0 6px', color: '#241812' }}>
                {shown ? r.title : 'Dossier scellé'}
              </div>
              <div style={{ fontSize: 12.5, lineHeight: 1.45, color: '#6B5A4B' }}>
                {shown ? r.note : 'Cliquez pour ouvrir ce dossier.'}
              </div>
            </div>
          );
        })}
      </div>

      <NavFooter
        onBack={onBack}
        marginTop={24}
        right={
          <button className="btn-primary" onClick={onNext}>
            Rédiger le rapport DD →
          </button>
        }
      />
    </div>
  );
}
