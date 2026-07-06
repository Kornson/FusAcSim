import { STRETCH_DEBT_RATE, fmt, trueFair } from '../engine';
import { NavFooter } from '../components/NavFooter';
import type { Rival, Target } from '../types';

interface EnchereProps {
  target: Target;
  bid: number;
  capacity: number;
  maxStretchDebt: number;
  stretchDebtUsed: number;
  auctionDone: boolean;
  rivals: Rival[] | null;
  won: boolean | null;
  teamLabel: string;
  onBid: (v: number) => void;
  onRunAuction: () => void;
  onBack: () => void;
  onNext: () => void;
}

export function Enchere({
  target,
  bid,
  capacity,
  maxStretchDebt,
  stretchDebtUsed,
  auctionDone,
  rivals,
  won,
  teamLabel,
  onBid,
  onRunAuction,
  onBack,
  onNext,
}: EnchereProps) {
  const maxCapacity = capacity + maxStretchDebt;
  const overCap = bid > maxCapacity;
  const usesStretch = !overCap && bid > capacity;
  const stretchNeeded = usesStretch ? bid - capacity : 0;
  const showBidButton = !auctionDone && !overCap;
  const fair = trueFair(target);

  let resultBg = '', resultTextColor = '', resultNoteColor = '', resultHeadline = '', resultNote = '';
  let bidderViews: { name: string; bidStr: string; rowBg: string; rowBorder: string; nameColor: string }[] = [];

  if (auctionDone) {
    resultBg = won ? '#F0F4EC' : '#F9EDEA';
    resultTextColor = won ? '#3E6B3E' : '#93341A';
    resultNoteColor = won ? '#4C6B47' : '#7A4A3E';
    if (won) {
      const over = bid - fair;
      resultHeadline = '🎉 Deal remporté !';
      resultNote =
        over > 25
          ? `Vous emportez la cible, mais vous avez surpayé de ${fmt(over)}. Le rendement en pâtira.`
          : over > 0
            ? `Cible acquise à un prix raisonnable (léger premium de ${fmt(over)}).`
            : `Excellente affaire : vous payez sous la valeur réelle de ${fmt(-over)} !`;
    } else {
      resultHeadline = '🥀 Enchère perdue';
      resultNote =
        bid <= fair
          ? 'Un rival a surenchéri. Votre offre restait disciplinée — le jury valorise la rigueur.'
          : 'Vous avez été battu malgré une offre déjà généreuse.';
    }
    const rows = [
      { name: teamLabel, bid, you: true },
      ...(rivals || []).map((r) => ({ name: r.name, bid: r.bid, you: false })),
    ].sort((a, b) => b.bid - a.bid);
    bidderViews = rows.map((r) => ({
      name: r.you ? `${r.name} (vous)` : r.name,
      bidStr: fmt(r.bid),
      rowBg: r.you ? '#FFFDF7' : 'transparent',
      rowBorder: r.you ? '#E0973A' : '#E8DBC6',
      nameColor: r.you ? '#C1502E' : '#6B5A4B',
    }));
  }

  return (
    <div style={{ animation: 'floatIn .45s ease both' }}>
      <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '.2em', color: '#93341A' }}>
          PHASE 05 · ENCHÈRE — {target.name}
        </div>
        <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 34, letterSpacing: '-.02em', margin: '8px 0 6px' }}>
          Placez votre offre
        </h2>
        <p style={{ fontSize: 15, color: '#5B4B3E', margin: 0 }}>
          Deux fonds rivaux enchérissent aussi. La meilleure offre remporte la cible. Mais gare&nbsp;: surpayer
          détruit votre rendement.
        </p>
      </div>

      <div style={{ background: '#FFFDF7', border: '1px solid #E8DBC6', borderRadius: 20, padding: 30, marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>Votre offre ferme</span>
          <span style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 32, color: '#C1502E' }}>{fmt(bid)}</span>
        </div>
        <input
          type="range"
          min={80}
          max={450}
          step={5}
          value={bid}
          onChange={(e) => onBid(parseFloat(e.target.value))}
          style={{ width: '100%', margin: '10px 0 6px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Space Mono'", fontSize: 11, color: '#A0907A' }}>
          <span>80 M€</span>
          <span>
            capacité normale {fmt(capacity)} · max avec dette de dernière minute {fmt(maxCapacity)}
          </span>
          <span>450 M€</span>
        </div>

        {usesStretch && !auctionDone && (
          <div style={{ marginTop: 14, padding: '12px 16px', background: '#F4E3C4', border: '1px solid #E0973A', borderRadius: 11, color: '#93341A', fontSize: 13.5, fontWeight: 600 }}>
            🏦 Financement tendu&nbsp;: {fmt(stretchNeeded)} de cette offre seraient couverts par une dette de
            dernière minute, au taux majoré de {Math.round(STRETCH_DEBT_RATE * 100)}&nbsp;%.
          </div>
        )}

        {overCap && (
          <div style={{ marginTop: 14, padding: '12px 16px', background: '#F7E0DB', border: '1px solid #E0A99F', borderRadius: 11, color: '#93341A', fontSize: 13.5, fontWeight: 600 }}>
            ⚠ Offre hors de portée, même avec une dette de dernière minute. Renforcez le financement ou baissez
            l'offre.
          </div>
        )}

        {auctionDone && (
          <div style={{ marginTop: 22, padding: 22, background: resultBg, borderRadius: 16, animation: 'pop .4s ease both' }}>
            <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 24, color: resultTextColor }}>
              {resultHeadline}
            </div>
            <p style={{ fontSize: 14, color: resultNoteColor, margin: '8px 0 16px' }}>{resultNote}</p>
            {won && stretchDebtUsed > 0 && (
              <div style={{ marginBottom: 16, padding: '10px 14px', background: '#F4E3C4', border: '1px solid #E0973A', borderRadius: 10, color: '#93341A', fontSize: 13, fontWeight: 600 }}>
                🏦 Dont {fmt(stretchDebtUsed)} financés en dette de dernière minute (taux{' '}
                {Math.round(STRETCH_DEBT_RATE * 100)}&nbsp;%).
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {bidderViews.map((b) => (
                <div
                  key={b.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 15px',
                    background: b.rowBg,
                    borderRadius: 10,
                    border: `1px solid ${b.rowBorder}`,
                  }}
                >
                  <span style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 14.5, color: b.nameColor }}>{b.name}</span>
                  <span style={{ fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 15, color: b.nameColor }}>{b.bidStr}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <NavFooter
        onBack={onBack}
        right={
          <div style={{ display: 'flex', gap: 12 }}>
            {showBidButton && (
              <button className="btn-amber" onClick={onRunAuction}>
                🔨 Adjuger l'enchère
              </button>
            )}
            {auctionDone && (
              <button className="btn-primary" onClick={onNext}>
                Plan de synergies →
              </button>
            )}
          </div>
        }
      />
    </div>
  );
}
