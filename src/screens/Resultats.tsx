import { dealAlpha, fmt } from '../engine';
import type { DealRecord } from '../types';

interface ResultatsProps {
  deal: DealRecord;
  treasury: number;
  totalDebt: number;
  dealsCount: number;
  canContinue: boolean;
  interestPreview: number;
  onContinue: () => void;
}

export function Resultats({ deal, treasury, totalDebt, dealsCount, canContinue, interestPreview, onContinue }: ResultatsProps) {
  const scoreRows = [
    { label: 'Due diligence & rapport', val: deal.ddScore, max: 250 },
    { label: 'Discipline de prix', val: deal.dealScore, max: 350 },
    { label: 'Structure financière', val: deal.finScore, max: 200 },
    { label: 'Synergies créées', val: deal.synScore, max: 200 },
  ].map((r) => ({ label: r.label, valStr: `${r.val}/${r.max}`, width: `${Math.round((r.val / r.max) * 100)}%` }));

  let gradeHeadline: string, gradeNote: string;
  if (!deal.won) {
    gradeHeadline = '🥀 Deal perdu';
    gradeNote = 'Un rival a remporté cette cible. Analysez votre discipline de prix avant la prochaine enchère.';
  } else if (deal.totalScore >= 820) {
    gradeHeadline = '🏆 Deal maître';
    gradeNote = "Valorisation juste, risques anticipés, prix discipliné : un dossier digne d'un associé-gérant.";
  } else if (deal.totalScore >= 620) {
    gradeHeadline = '👏 Solide opération';
    gradeNote = 'Un bon deal, avec quelques marges de progression sur le prix ou les synergies.';
  } else if (deal.totalScore >= 400) {
    gradeHeadline = '🤔 Deal perfectible';
    gradeNote = "L'opération passe, mais le jury note des approximations coûteuses.";
  } else {
    gradeHeadline = '💸 Deal risqué';
    gradeNote = 'Trop de valeur laissée sur la table ou de risques ignorés.';
  }

  const alpha = dealAlpha(deal);

  return (
    <div style={{ animation: 'floatIn .5s ease both' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '.2em', color: '#93341A' }}>
          BILAN DU DEAL · {deal.targetName}
        </div>
        <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 40, letterSpacing: '-.02em', margin: '8px 0 2px' }}>
          {gradeHeadline}
        </h2>
        <p style={{ fontSize: 15, color: '#5B4B3E', margin: '0 auto', maxWidth: 520 }}>{gradeNote}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '.9fr 1.1fr', gap: 22, marginTop: 26 }}>
        <div style={{ background: '#241812', borderRadius: 22, padding: 30, color: '#F4E9D8', boxShadow: '0 24px 50px -26px rgba(40,20,10,.7)' }}>
          <div style={{ textAlign: 'center', paddingBottom: 18, borderBottom: '1px solid rgba(244,233,216,.14)' }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '.18em', color: '#E0973A' }}>SCORE DU DEAL</div>
            <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 68, lineHeight: 1, marginTop: 6 }}>
              {deal.totalScore}
              <span style={{ fontSize: 26, color: '#BCA997' }}>/1000</span>
            </div>
          </div>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {scoreRows.map((r) => (
              <div key={r.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 5 }}>
                  <span style={{ color: '#DCCDBA' }}>{r.label}</span>
                  <span style={{ fontFamily: "'Space Mono'", fontWeight: 700, color: '#F4E9D8' }}>{r.valStr}</span>
                </div>
                <div style={{ height: 7, borderRadius: 999, background: 'rgba(244,233,216,.12)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: r.width, background: '#E0973A', borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#FFFDF7', border: '1px solid #E8DBC6', borderRadius: 18, padding: 22 }}>
            <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 16, marginBottom: 12 }}>
              Récapitulatif du deal
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <RecapTile label="CIBLE" value={deal.targetName} />
              <RecapTile label="ISSUE" value={deal.won ? 'Acquise' : 'Perdue'} color={deal.won ? '#4E7A4E' : '#B23A2E'} />
              <RecapTile label="PRIX PAYÉ" value={deal.won ? fmt(deal.bid) : '—'} mono />
              <RecapTile label="VALEUR RÉELLE" value={fmt(deal.fairValue)} mono />
              {deal.won && <RecapTile label="SYNERGIES CRÉÉES" value={fmt(deal.synergies)} mono color="#4E7A4E" />}
              {deal.won && deal.stretchDebt > 0 && (
                <RecapTile label="DONT DETTE DE DERNIÈRE MINUTE" value={fmt(deal.stretchDebt)} mono color="#B23A2E" />
              )}
              {deal.won && (
                <RecapTile
                  label="VALEUR NETTE CRÉÉE"
                  value={`${alpha >= 0 ? '+' : ''}${fmt(alpha)}`}
                  mono
                  color={alpha >= 0 ? '#4E7A4E' : '#B23A2E'}
                />
              )}
              <RecapTile label="RECOMMANDATION DU RAPPORT DD" value={deal.reco || 'Non conclue'} span2 />
            </div>
          </div>
          <div style={{ background: '#FFFDF7', border: '1px solid #E8DBC6', borderRadius: 18, padding: 22 }}>
            <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 16, marginBottom: 12 }}>
              Portefeuille après ce deal
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <RecapTile label="TRÉSORERIE RESTANTE" value={fmt(treasury)} mono color="#4E7A4E" />
              <RecapTile label="ACQUISITIONS TENTÉES" value={String(dealsCount)} mono />
              <RecapTile label="DETTE TOTALE DU GROUPE" value={fmt(totalDebt)} mono color={totalDebt > 0 ? '#B23A2E' : undefined} />
              {totalDebt > 0 && canContinue && (
                <RecapTile label="INTÉRÊTS AU PROCHAIN TOUR" value={`−${fmt(interestPreview)}`} mono color="#B23A2E" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 26 }}>
        <button className="btn-primary lg" onClick={onContinue}>
          {canContinue ? 'Choisir une nouvelle cible →' : 'Voir le bilan final du portefeuille →'}
        </button>
      </div>
    </div>
  );
}

function RecapTile({ label, value, color, mono, span2 }: { label: string; value: string; color?: string; mono?: boolean; span2?: boolean }) {
  return (
    <div style={{ background: '#FBF4E8', borderRadius: 11, padding: '12px 14px', gridColumn: span2 ? '1/-1' : undefined }}>
      <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: '#A0907A' }}>{label}</div>
      <div
        style={{
          fontFamily: mono ? "'Space Mono'" : "'Bricolage Grotesque'",
          fontWeight: 700,
          fontSize: 15,
          color: color ?? '#241812',
        }}
      >
        {value}
      </div>
    </div>
  );
}
