import { GROUP_INTEREST_RATE, fmt, financing } from '../engine';
import { NavFooter } from '../components/NavFooter';
import type { Target } from '../types';

interface FinancementProps {
  target: Target;
  debt: number;
  treasury: number;
  totalDebt: number;
  onDebt: (v: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Financement({ target, debt, treasury, totalDebt, onDebt, onBack, onNext }: FinancementProps) {
  const fin = financing(target, debt, treasury);
  const projectedDebt = totalDebt + fin.debtRaised;
  const projectedInterest = Math.round(projectedDebt * GROUP_INTEREST_RATE);

  let zone;
  if (fin.leverage > 5) {
    zone = {
      icon: '🔥',
      title: 'Levier agressif',
      note: "Vous maximisez la capacité d'enchère, mais un levier supérieur à 5× fragilise la cible en cas de choc. Le jury pénalise le risque excessif.",
      bg: '#F9EDEA',
      border: '#E7C3BB',
      tc: '#93341A',
      nc: '#7A4A3E',
    };
  } else if (fin.leverage >= 2.5) {
    zone = {
      icon: '✅',
      title: 'Structure équilibrée',
      note: 'Bon compromis : le coût du capital baisse grâce à la dette, sans mettre en danger la solvabilité. Le levier reste dans la zone saine (2,5–4,5×).',
      bg: '#F0F4EC',
      border: '#CFE0C2',
      tc: '#3E6B3E',
      nc: '#4C6B47',
    };
  } else {
    zone = {
      icon: '🛡️',
      title: 'Structure prudente',
      note: 'Peu de dette : deal très sûr, mais coût du capital élevé et capacité d’enchère limitée. Vous risquez de vous faire coiffer par un rival plus audacieux.',
      bg: '#FBF4E8',
      border: '#E8DBC6',
      tc: '#8A6A2A',
      nc: '#6B5A4B',
    };
  }

  return (
    <div style={{ animation: 'floatIn .45s ease both' }}>
      <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '.2em', color: '#93341A' }}>
          PHASE 04 · STRUCTURATION DU FINANCEMENT
        </div>
        <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 34, letterSpacing: '-.02em', margin: '8px 0 6px' }}>
          Dette ou capitaux propres&nbsp;?
        </h2>
        <p style={{ fontSize: 15, color: '#5B4B3E', margin: 0 }}>
          Plus de dette abaisse le coût du capital… mais gonfle le levier et le risque. Trouvez l'équilibre qui
          maximise votre capacité d'enchère sans fragiliser le deal.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginTop: 24 }}>
        <div style={{ background: '#FFFDF7', border: '1px solid #E8DBC6', borderRadius: 20, padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Part de dette</span>
            <span style={{ fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 20, color: '#C1502E' }}>{debt} %</span>
          </div>
          <input
            type="range"
            min={0}
            max={70}
            step={5}
            value={debt}
            onChange={(e) => onDebt(parseFloat(e.target.value))}
            style={{ width: '100%', margin: '8px 0 14px' }}
          />
          <div style={{ display: 'flex', height: 40, borderRadius: 10, overflow: 'hidden', border: '1px solid #E8DBC6' }}>
            <div
              style={{
                width: `${debt}%`,
                background: '#C1502E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FBF4E8',
                fontFamily: "'Space Mono'",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              DETTE
            </div>
            <div
              style={{
                flex: 1,
                background: '#E0973A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#241812',
                fontFamily: "'Space Mono'",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              CAPITAUX PROPRES
            </div>
          </div>
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <KpiRow label="Coût du capital du deal" value={`${fin.waccDeal.toFixed(1)} %`} />
            <KpiRow label="Levier (dette / EBITDA)" value={`${fin.leverage.toFixed(1)}×`} />
            <KpiRow label="Capacité d'enchère max." value={fmt(fin.capacity)} color="#4E7A4E" />
            {totalDebt > 0 && <KpiRow label="Dette du groupe (avant ce deal)" value={fmt(totalDebt)} color="#B23A2E" />}
            <KpiRow label="Dette du groupe après ce deal" value={fmt(projectedDebt)} color="#B23A2E" />
          </div>
          {projectedDebt > 0 && (
            <div style={{ marginTop: 14, padding: '12px 14px', background: '#F4EAD8', borderRadius: 11, fontSize: 12, lineHeight: 1.5, color: '#6B5A4B' }}>
              💳 La dette du groupe accumulée sur l'ensemble du portefeuille coûte des intérêts (
              {Math.round(GROUP_INTEREST_RATE * 100)}&nbsp;%/an), prélevés sur votre trésorerie avant chaque nouvelle
              acquisition. Avec ce niveau de dette, comptez environ {fmt(projectedInterest)} d'intérêts au prochain
              tour.
            </div>
          )}
        </div>

        <div
          style={{
            background: zone.bg,
            border: `2px solid ${zone.border}`,
            borderRadius: 20,
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: 44, lineHeight: 1 }}>{zone.icon}</div>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 24, margin: '14px 0 8px', color: zone.tc }}>
            {zone.title}
          </div>
          <p style={{ fontSize: 14.5, lineHeight: 1.55, color: zone.nc, margin: 0 }}>{zone.note}</p>
        </div>
      </div>

      <NavFooter
        onBack={onBack}
        right={
          <button className="btn-primary" onClick={onNext}>
            Entrer dans l'enchère →
          </button>
        }
      />
    </div>
  );
}

function KpiRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 15px', background: '#FBF4E8', borderRadius: 11 }}>
      <span style={{ fontSize: 13.5, color: '#6B5A4B' }}>{label}</span>
      <span style={{ fontFamily: "'Space Mono'", fontWeight: 700, color: color ?? '#241812' }}>{value}</span>
    </div>
  );
}
