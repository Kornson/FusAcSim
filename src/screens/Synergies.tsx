import { SYN_META, SYN_POINT_COST, SYN_POOL_TOTAL, fmt, synTotal, synUsed, synValue } from '../engine';
import { NavFooter } from '../components/NavFooter';
import type { SynState } from '../types';

interface SynergiesProps {
  syn: SynState;
  treasury: number;
  onInc: (key: keyof SynState) => void;
  onDec: (key: keyof SynState) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Synergies({ syn, treasury, onInc, onDec, onBack, onNext }: SynergiesProps) {
  const used = synUsed(syn);
  const remain = SYN_POOL_TOTAL - used;
  const poolColor = remain === 0 ? '#4E7A4E' : '#C1502E';
  const canAfford = treasury >= SYN_POINT_COST;
  const totalCost = used * SYN_POINT_COST;
  const totalValue = synTotal(syn);
  const netGain = totalValue - totalCost;

  return (
    <div style={{ animation: 'floatIn .45s ease both' }}>
      <div style={{ textAlign: 'center', maxWidth: 660, margin: '0 auto' }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '.2em', color: '#93341A' }}>
          PHASE 06 · SYNERGIES POST-FUSION
        </div>
        <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 34, letterSpacing: '-.02em', margin: '8px 0 6px' }}>
          Créez de la valeur
        </h2>
        <p style={{ fontSize: 15, color: '#5B4B3E', margin: 0 }}>
          Répartissez vos <b>{SYN_POOL_TOTAL}</b> jetons d'intégration. Chaque jeton coûte{' '}
          <b>{fmt(SYN_POINT_COST)}</b> de trésorerie et valorise l'entreprise. Attention aux rendements
          décroissants&nbsp;: au-delà d'un certain seuil, un jeton coûte plus qu'il ne rapporte.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 28, margin: '18px 0 4px' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontFamily: "'Space Mono'", fontSize: 12, color: '#A0907A' }}>JETONS RESTANTS</span>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 30, color: poolColor }}>{remain}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontFamily: "'Space Mono'", fontSize: 12, color: '#A0907A' }}>TRÉSORERIE DISPONIBLE</span>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 30, color: canAfford ? '#4E7A4E' : '#B23A2E' }}>
            {fmt(treasury)}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginTop: 14 }}>
        {SYN_META.map((m) => {
          const pts = syn[m.key];
          const value = synValue(m.key, pts);
          const cost = pts * SYN_POINT_COST;
          const gain = value - cost;
          return (
            <div key={m.key} style={{ background: '#FFFDF7', border: '1px solid #E8DBC6', borderRadius: 18, padding: 22, textAlign: 'center' }}>
              <div style={{ fontSize: 34, lineHeight: 1 }}>{m.icon}</div>
              <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 18, margin: '12px 0 4px' }}>{m.label}</div>
              <div style={{ fontSize: 12.5, color: '#6B5A4B', minHeight: 52, lineHeight: 1.45 }}>{m.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, margin: '14px 0 12px' }}>
                <button className="round-btn" disabled={pts <= 0} onClick={() => onDec(m.key)}>
                  −
                </button>
                <span style={{ fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 26, minWidth: 34 }}>{pts}</span>
                <button className="round-btn" disabled={remain <= 0 || !canAfford} onClick={() => onInc(m.key)}>
                  +
                </button>
              </div>
              <div style={{ padding: 10, background: '#F0F4EC', borderRadius: 11 }}>
                <span style={{ fontFamily: "'Space Mono'", fontSize: 11, color: '#5C7C57' }}>VALEUR CRÉÉE</span>
                <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 20, color: '#4E7A4E' }}>{fmt(value)}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11.5, fontFamily: "'Space Mono'", color: '#A0907A' }}>
                <span>Coût investi {fmt(cost)}</span>
                <span style={{ color: gain >= 0 ? '#4E7A4E' : '#B23A2E', fontWeight: 700 }}>
                  {gain >= 0 ? '+' : ''}
                  {fmt(gain)} net
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: 18, fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 16 }}>
        Valeur totale de synergies&nbsp;: <span style={{ color: '#4E7A4E', fontWeight: 800 }}>{fmt(totalValue)}</span>
        <span style={{ margin: '0 10px', color: '#DCC9AA' }}>·</span>
        Gain net après coût d'intégration&nbsp;:{' '}
        <span style={{ color: netGain >= 0 ? '#4E7A4E' : '#B23A2E', fontWeight: 800 }}>
          {netGain >= 0 ? '+' : ''}
          {fmt(netGain)}
        </span>
      </div>

      <NavFooter
        onBack={onBack}
        marginTop={22}
        right={
          <button className="btn-dark" onClick={onNext}>
            Voir le verdict du jury →
          </button>
        }
      />
    </div>
  );
}
