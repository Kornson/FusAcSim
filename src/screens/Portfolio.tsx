import { dealAlpha, fmt, rivalPortfolios } from '../engine';
import type { DealRecord, Difficulty } from '../types';

interface PortfolioProps {
  deals: DealRecord[];
  treasury: number;
  totalDebt: number;
  teamLabel: string;
  difficulty: Difficulty;
  onRestart: () => void;
}

export function Portfolio({ deals, treasury, totalDebt, teamLabel, difficulty, onRestart }: PortfolioProps) {
  const wonDeals = deals.filter((d) => d.won);
  const totalValueCreated = wonDeals.reduce((a, d) => a + dealAlpha(d), 0);
  const totalStretchDebt = deals.reduce((a, d) => a + d.stretchDebt, 0);
  const avgScore = deals.length ? Math.round(deals.reduce((a, d) => a + d.totalScore, 0) / deals.length) : 0;

  const avgSub = (key: 'ddScore' | 'dealScore' | 'finScore' | 'synScore') =>
    deals.length ? Math.round(deals.reduce((a, d) => a + d[key], 0) / deals.length) : 0;

  const scoreRows = [
    { label: 'Due diligence & rapport (moy.)', val: avgSub('ddScore'), max: 250 },
    { label: 'Discipline de prix (moy.)', val: avgSub('dealScore'), max: 350 },
    { label: 'Structure financière (moy.)', val: avgSub('finScore'), max: 200 },
    { label: 'Synergies créées (moy.)', val: avgSub('synScore'), max: 200 },
  ].map((r) => ({ label: r.label, valStr: `${r.val}/${r.max}`, width: `${Math.round((r.val / r.max) * 100)}%` }));

  let gradeHeadline: string, gradeNote: string;
  if (wonDeals.length === 0) {
    gradeHeadline = '💸 Portefeuille vide';
    gradeNote = "Aucune acquisition bouclée cette session. Revoyez votre discipline de prix et votre structure de financement.";
  } else if (avgScore >= 820) {
    gradeHeadline = '🏆 Fonds de référence';
    gradeNote = 'Des deals disciplinés, des risques anticipés, une vraie création de valeur sur la durée.';
  } else if (avgScore >= 620) {
    gradeHeadline = '👏 Portefeuille solide';
    gradeNote = 'De bons deals dans l’ensemble, avec des marges de progression sur le prix ou les synergies.';
  } else if (avgScore >= 400) {
    gradeHeadline = '🤔 Portefeuille perfectible';
    gradeNote = 'Les acquisitions passent, mais le jury note des approximations coûteuses.';
  } else {
    gradeHeadline = '⚠️ Portefeuille risqué';
    gradeNote = 'Trop de valeur laissée sur la table ou de risques ignorés sur cette session.';
  }

  const rivals = rivalPortfolios(difficulty);
  const board = [
    { name: teamLabel, totalValue: totalValueCreated, avgScore, you: true },
    ...rivals.map((r) => ({ name: r.name, totalValue: r.totalValue, avgScore: r.avgScore, you: false })),
  ].sort((a, b) => b.totalValue - a.totalValue);

  return (
    <div style={{ animation: 'floatIn .5s ease both' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '.2em', color: '#93341A' }}>
          BILAN FINAL DU PORTEFEUILLE
        </div>
        <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 40, letterSpacing: '-.02em', margin: '8px 0 2px' }}>
          {gradeHeadline}
        </h2>
        <p style={{ fontSize: 15, color: '#5B4B3E', margin: '0 auto', maxWidth: 560 }}>{gradeNote}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '.9fr 1.1fr', gap: 22, marginTop: 26 }}>
        <div style={{ background: '#241812', borderRadius: 22, padding: 30, color: '#F4E9D8', boxShadow: '0 24px 50px -26px rgba(40,20,10,.7)' }}>
          <div style={{ textAlign: 'center', paddingBottom: 18, borderBottom: '1px solid rgba(244,233,216,.14)' }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '.18em', color: '#E0973A' }}>
              VALEUR TOTALE CRÉÉE
            </div>
            <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 54, lineHeight: 1, marginTop: 6 }}>
              {totalValueCreated >= 0 ? '+' : ''}
              {fmt(totalValueCreated)}
            </div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 12, color: '#BCA997', marginTop: 6 }}>
              Score moyen par deal&nbsp;: {avgScore}/1000
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 16 }}>
                Entreprises acquises
              </div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 12, color: '#A0907A' }}>
                Trésorerie&nbsp;: <b style={{ color: '#4E7A4E' }}>{fmt(treasury)}</b>
                {totalDebt > 0 && (
                  <>
                    {' '}
                    · Dette&nbsp;: <b style={{ color: '#B23A2E' }}>{fmt(totalDebt)}</b>
                    {totalStretchDebt > 0 && ` (dont ${fmt(totalStretchDebt)} à taux majoré)`}
                  </>
                )}
              </div>
            </div>
            {wonDeals.length === 0 ? (
              <p style={{ fontSize: 13.5, color: '#6B5A4B', margin: 0 }}>Aucune acquisition remportée cette session.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {wonDeals.map((d) => {
                  const alpha = dealAlpha(d);
                  return (
                    <div key={d.targetId} style={{ padding: '12px 14px', background: '#FBF4E8', borderRadius: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 14.5 }}>{d.targetName}</span>
                        <span
                          style={{
                            fontFamily: "'Space Mono'",
                            fontWeight: 700,
                            fontSize: 13.5,
                            color: alpha >= 0 ? '#4E7A4E' : '#B23A2E',
                          }}
                        >
                          {alpha >= 0 ? '+' : ''}
                          {fmt(alpha)} créés
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 16, marginTop: 4, fontSize: 12, color: '#6B5A4B', fontFamily: "'Space Mono'" }}>
                        <span>Prix payé {fmt(d.bid)}</span>
                        <span>Valeur réelle {fmt(d.fairValue)}</span>
                        <span>Synergies {fmt(d.synergies)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ background: '#FFFDF7', border: '1px solid #E8DBC6', borderRadius: 18, padding: 22 }}>
            <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 16, marginBottom: 12 }}>
              Classement des fonds
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {board.map((r, i) => (
                <div
                  key={r.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px 15px',
                    background: r.you ? '#FDF0E4' : '#FBF4E8',
                    border: `1px solid ${r.you ? '#E0973A' : '#EADCC4'}`,
                    borderRadius: 12,
                  }}
                >
                  <span style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 17, color: i === 0 ? '#C1502E' : '#A0907A', width: 26 }}>
                    {i + 1}
                  </span>
                  <span style={{ flex: 1, fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 15, color: r.you ? '#C1502E' : '#241812' }}>
                    {r.name}
                  </span>
                  <span style={{ fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 13, color: '#A0907A' }}>{r.avgScore}/1000</span>
                  <span
                    style={{
                      fontFamily: "'Space Mono'",
                      fontWeight: 700,
                      fontSize: 15,
                      color: r.you ? '#C1502E' : '#241812',
                      minWidth: 70,
                      textAlign: 'right',
                    }}
                  >
                    {r.totalValue >= 0 ? '+' : ''}
                    {fmt(r.totalValue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 26 }}>
        <button className="btn-primary lg" onClick={onRestart}>
          ↺ Rejouer une nouvelle session
        </button>
      </div>
    </div>
  );
}
