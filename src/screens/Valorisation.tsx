import type { CSSProperties } from 'react';
import { fmt, valuation } from '../engine';
import { NavFooter } from '../components/NavFooter';
import type { Target } from '../types';

interface ValorisationProps {
  target: Target;
  wacc: number;
  growth: number;
  exit: number;
  onWacc: (v: number) => void;
  onGrowth: (v: number) => void;
  onExit: (v: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Valorisation({ target, wacc, growth, exit, onWacc, onGrowth, onExit, onBack, onNext }: ValorisationProps) {
  const v = valuation(target, wacc, growth, exit);
  const evRangeStr = `${fmt(Math.min(v.evDcf, v.evMult))} – ${fmt(Math.max(v.evDcf, v.evMult))}`;
  const equityValue = v.evEst - target.netDebt;
  const compMultiples = target.comparables.map((c) => c.multiple);
  const compAvg = compMultiples.reduce((a, b) => a + b, 0) / compMultiples.length;

  return (
    <div style={{ animation: 'floatIn .45s ease both' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '.2em', color: '#93341A' }}>
            VALORISATION — {target.name}
          </div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 34, letterSpacing: '-.02em', margin: '8px 0 0' }}>
            Combien vaut l'entreprise&nbsp;?
          </h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginTop: 22 }}>
        <div style={{ background: '#FFFDF7', border: '1px solid #E8DBC6', borderRadius: 20, padding: 26 }}>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 17, marginBottom: 4 }}>
            Vos hypothèses
          </div>
          <p style={{ fontSize: 13, color: '#6B5A4B', margin: '0 0 22px' }}>
            Ajustez les curseurs. La valeur se recalcule en direct.
          </p>

          <Slider
            label="Coût du capital (WACC)"
            value={wacc}
            display={`${wacc.toFixed(1)} %`}
            min={6}
            max={16}
            step={0.5}
            onChange={onWacc}
          />
          <Slider
            label="Croissance des flux (5 ans)"
            value={growth}
            display={`+${growth} %`}
            min={0}
            max={25}
            step={1}
            onChange={onGrowth}
          />
          <Slider
            label="Multiple de sortie (EV/EBITDA)"
            value={exit}
            display={`${exit}×`}
            min={5}
            max={18}
            step={0.5}
            onChange={onExit}
            noMargin
          />

          <div style={{ marginTop: 16 }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '.12em', color: '#A0907A', marginBottom: 6 }}>
              COMPARABLES SECTORIELS (EV/EBITDA)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {target.comparables.map((c) => (
                <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '6px 10px', background: '#FBF4E8', borderRadius: 8 }}>
                  <span style={{ color: '#6B5A4B' }}>{c.name}</span>
                  <span style={{ fontFamily: "'Space Mono'", fontWeight: 700 }}>{c.multiple.toFixed(1)}×</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '6px 10px', background: '#F4E3C4', borderRadius: 8 }}>
                <span style={{ color: '#93341A', fontWeight: 700 }}>Votre multiple retenu (moy. comp. {compAvg.toFixed(1)}×)</span>
                <span style={{ fontFamily: "'Space Mono'", fontWeight: 700, color: '#93341A' }}>{exit}×</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, padding: '14px 16px', background: '#F4EAD8', borderRadius: 12, fontSize: 12.5, lineHeight: 1.5, color: '#6B5A4B' }}>
            💡 Un WACC plus élevé ou une croissance plus faible réduisent la valeur actuelle des flux futurs.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#241812', borderRadius: 20, padding: 26, color: '#F4E9D8', boxShadow: '0 20px 44px -26px rgba(40,20,10,.7)' }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '.18em', color: '#E0973A' }}>
              VALEUR D'ENTREPRISE ESTIMÉE
            </div>
            <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 54, lineHeight: 1, margin: '8px 0 4px' }}>
              {fmt(v.evEst)}
            </div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 13, color: '#BCA997' }}>fourchette {evRangeStr}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <MethodCard label="MÉTHODE DCF" value={fmt(v.evDcf)} note="Flux actualisés 5 ans + valeur terminale" />
            <MethodCard label="MULTIPLES" value={fmt(v.evMult)} note="EBITDA × multiple de sortie" />
          </div>
          <div style={{ background: '#FFFDF7', border: '1px solid #E8DBC6', borderRadius: 16, padding: 18 }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '.14em', color: '#A0907A' }}>
              PONT VERS LA VALEUR DES CAPITAUX PROPRES
            </div>
            <BridgeRow label="Valeur d'entreprise estimée" value={fmt(v.evEst)} />
            <BridgeRow
              label={target.netDebt >= 0 ? '− Dette nette au bilan' : '+ Trésorerie nette au bilan'}
              value={fmt(Math.abs(target.netDebt))}
              color={target.netDebt >= 0 ? '#B23A2E' : '#4E7A4E'}
            />
            <div style={{ height: 1, background: '#E8DBC6', margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5 }}>
              <span style={{ fontWeight: 700 }}>Valeur des capitaux propres</span>
              <span style={{ fontFamily: "'Space Mono'", fontWeight: 800, color: '#C1502E' }}>{fmt(equityValue)}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginTop: 22 }}>
        <div style={{ background: '#FFFDF7', border: '1px solid #E8DBC6', borderRadius: 20, padding: 24 }}>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 16, marginBottom: 4 }}>
            Historique financier (3 ans)
          </div>
          <p style={{ fontSize: 12.5, color: '#6B5A4B', margin: '0 0 14px' }}>
            Regardez la tendance, pas seulement le dernier exercice.
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={cellStyle()} />
                {target.history.map((h) => (
                  <th key={h.label} style={{ ...cellStyle(), fontFamily: "'Space Mono'", color: '#A0907A', fontWeight: 700 }}>
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...cellStyle(), color: '#6B5A4B' }}>CA</td>
                {target.history.map((h) => (
                  <td key={h.label} style={{ ...cellStyle(), fontFamily: "'Space Mono'", fontWeight: 700 }}>
                    {fmt(h.rev)}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ ...cellStyle(), color: '#6B5A4B' }}>EBITDA</td>
                {target.history.map((h) => (
                  <td key={h.label} style={{ ...cellStyle(), fontFamily: "'Space Mono'", fontWeight: 700 }}>
                    {fmt(h.ebitda)}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ ...cellStyle(true), color: '#6B5A4B' }}>Marge EBITDA</td>
                {target.history.map((h) => (
                  <td key={h.label} style={{ ...cellStyle(true), fontFamily: "'Space Mono'", fontWeight: 700, color: '#4E7A4E' }}>
                    {Math.round((h.ebitda / h.rev) * 100)} %
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ background: '#FFFDF7', border: '1px solid #E8DBC6', borderRadius: 20, padding: 24 }}>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 16, marginBottom: 8 }}>
            Position &amp; risques
          </div>
          <p style={{ fontSize: 13, color: '#5B4B3E', lineHeight: 1.5, margin: '0 0 14px' }}>{target.analystNote.position}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '.12em', color: '#4E7A4E', marginBottom: 6 }}>
                FORCES
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#3E6B3E', lineHeight: 1.6 }}>
                {target.analystNote.strengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '.12em', color: '#B8892A', marginBottom: 6 }}>
                POINTS DE VIGILANCE
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#8A6A2A', lineHeight: 1.6 }}>
                {target.analystNote.watchouts.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <NavFooter
        onBack={onBack}
        right={
          <button className="btn-primary" onClick={onNext}>
            Passer à la Due Diligence →
          </button>
        }
      />
    </div>
  );
}

function cellStyle(last?: boolean): CSSProperties {
  return {
    textAlign: 'right',
    padding: '7px 4px',
    borderBottom: last ? 'none' : '1px solid #F0E7D6',
  };
}

function BridgeRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 13.5 }}>
      <span style={{ color: '#6B5A4B' }}>{label}</span>
      <span style={{ fontFamily: "'Space Mono'", fontWeight: 700, color: color ?? '#241812' }}>{value}</span>
    </div>
  );
}

function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
  noMargin,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  noMargin?: boolean;
}) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>{label}</span>
        <span style={{ fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 18, color: '#C1502E' }}>{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', margin: noMargin ? '10px 0 6px' : '10px 0 22px' }}
      />
    </>
  );
}

function MethodCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div style={{ background: '#FFFDF7', border: '1px solid #E8DBC6', borderRadius: 16, padding: 18 }}>
      <div style={{ fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '.14em', color: '#A0907A' }}>{label}</div>
      <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 26, marginTop: 6 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#6B5A4B', marginTop: 2 }}>{note}</div>
    </div>
  );
}
