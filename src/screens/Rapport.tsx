import { GRAVITY_LEVELS, RECO_OPTIONS } from '../engine';
import { NavFooter } from '../components/NavFooter';
import type { ReportEntry, Target } from '../types';

interface RapportProps {
  target: Target;
  revealed: string[];
  reports: Record<string, ReportEntry>;
  teamLabel: string;
  reco: string;
  recoNote: string;
  onUpdateReport: (riskId: string, patch: Partial<ReportEntry>) => void;
  onPickReco: (label: string) => void;
  onRecoNote: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Rapport({
  target,
  revealed,
  reports,
  teamLabel,
  reco,
  recoNote,
  onUpdateReport,
  onPickReco,
  onRecoNote,
  onBack,
  onNext,
}: RapportProps) {
  const openedRisks = target.risks.filter((r) => revealed.includes(r.id));
  const reportEmpty = openedRisks.length === 0;
  const hasReport = openedRisks.length > 0;
  const reportCountStr = `${openedRisks.length} ${openedRisks.length > 1 ? 'fiches' : 'fiche'}`;
  const reportDateStr = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div style={{ animation: 'floatIn .45s ease both' }}>
      <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '.2em', color: '#93341A' }}>
          PHASE 03 · RAPPORT DE DUE DILIGENCE
        </div>
        <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 34, letterSpacing: '-.02em', margin: '8px 0 6px' }}>
          Rédigez votre rapport
        </h2>
        <p style={{ fontSize: 15, color: '#5B4B3E', margin: 0 }}>
          Une fiche par dossier ouvert, pré-remplie avec vos constats. Qualifiez la gravité, chiffrez l'impact,
          proposez une mesure — puis tranchez&nbsp;: poursuit-on le deal&nbsp;?
        </p>
      </div>

      {reportEmpty && (
        <div
          style={{
            maxWidth: 520,
            margin: '26px auto 0',
            textAlign: 'center',
            background: '#F7E0DB',
            border: '1px solid #E0A99F',
            borderRadius: 16,
            padding: 24,
            color: '#93341A',
          }}
        >
          <div style={{ fontSize: 34 }}>📂</div>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 18, marginTop: 8 }}>
            Aucun dossier ouvert
          </div>
          <p style={{ fontSize: 14, margin: '8px 0 0', color: '#7A4A3E' }}>
            Revenez à la data room et ouvrez les dossiers pour alimenter automatiquement votre rapport.
          </p>
        </div>
      )}

      <div id="dd-report" style={{ marginTop: 24 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 4px 14px',
            borderBottom: '2px solid #241812',
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 22 }}>
              Rapport de due diligence
            </div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 12, color: '#6B5A4B', marginTop: 2 }}>
              Cible&nbsp;: {target.name} · {reportCountStr}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 11, color: '#A0907A' }}>ÉMIS PAR</div>
            <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 15 }}>{teamLabel}</div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 11, color: '#A0907A' }}>{reportDateStr}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {openedRisks.map((r) => {
            const c = reports[r.id];
            const constat = c?.constat !== undefined ? c.constat : r.note;
            const mesure = c?.mesure !== undefined ? c.mesure : '';
            const impactVal = c?.impact !== undefined ? c.impact : r.impact;
            const gravite = c?.gravite || '';

            return (
              <div key={r.id} style={{ background: '#FFFDF7', border: '1px solid #E8DBC6', borderRadius: 16, padding: 20, breakInside: 'avoid' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        background: '#F4EAD8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 17,
                      }}
                    >
                      {r.icon}
                    </div>
                    <span style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 17 }}>{r.title}</span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'Space Mono'",
                      fontWeight: 700,
                      fontSize: 14,
                      color: r.impact > 0 ? '#4E7A4E' : r.impact < 0 ? '#B23A2E' : '#A0907A',
                    }}
                  >
                    {r.impact > 0 ? '+' : ''}
                    {r.impact} M€
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '.12em', color: '#A0907A', display: 'block', marginBottom: 5 }}>
                      CONSTAT
                    </label>
                    <textarea
                      className="field-textarea"
                      value={constat}
                      onChange={(e) => onUpdateReport(r.id, { constat: e.target.value })}
                      rows={3}
                      style={{ width: '100%', resize: 'vertical', fontSize: 13.5, lineHeight: 1.45 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '.12em', color: '#A0907A', display: 'block', marginBottom: 5 }}>
                      MESURE / RECOMMANDATION
                    </label>
                    <textarea
                      className="field-textarea"
                      value={mesure}
                      onChange={(e) => onUpdateReport(r.id, { mesure: e.target.value })}
                      rows={3}
                      placeholder="ex. garantie de passif, clause d'earn-out, audit complémentaire…"
                      style={{ width: '100%', resize: 'vertical', fontSize: 13.5, lineHeight: 1.45 }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 14, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span style={{ fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '.12em', color: '#A0907A' }}>
                      GRAVITÉ
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {GRAVITY_LEVELS.map(([label, color]) => {
                        const selected = gravite === label;
                        return (
                          <button
                            key={label}
                            onClick={() => onUpdateReport(r.id, { gravite: label })}
                            style={{
                              appearance: 'none',
                              cursor: 'pointer',
                              fontFamily: "'Bricolage Grotesque'",
                              fontWeight: 700,
                              fontSize: 12.5,
                              padding: '7px 12px',
                              borderRadius: 999,
                              background: selected ? color : '#FBF4E8',
                              color: selected ? '#FFFDF7' : '#6B5A4B',
                              border: `1.5px solid ${selected ? color : '#E8DBC6'}`,
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span style={{ fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '.12em', color: '#A0907A' }}>
                      IMPACT ESTIMÉ
                    </span>
                    <input
                      className="field-input"
                      type="number"
                      value={impactVal}
                      onChange={(e) => onUpdateReport(r.id, { impact: e.target.value })}
                      style={{ width: 78, fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 14 }}
                    />
                    <span style={{ fontFamily: "'Space Mono'", fontSize: 13, color: '#6B5A4B' }}>M€</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {hasReport && (
          <div style={{ background: '#241812', borderRadius: 16, padding: 24, marginTop: 16, color: '#F4E9D8', breakInside: 'avoid' }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '.18em', color: '#E0973A' }}>
              SYNTHÈSE &amp; RECOMMANDATION AU COMITÉ
            </div>
            <div style={{ display: 'flex', gap: 10, margin: '14px 0 16px', flexWrap: 'wrap' }}>
              {RECO_OPTIONS.map(([label, color, icon]) => {
                const selected = reco === label;
                return (
                  <button
                    key={label}
                    onClick={() => onPickReco(label)}
                    style={{
                      appearance: 'none',
                      cursor: 'pointer',
                      fontFamily: "'Bricolage Grotesque'",
                      fontWeight: 700,
                      fontSize: 14,
                      padding: '11px 18px',
                      borderRadius: 12,
                      background: selected ? color : '#FBF4E8',
                      color: selected ? '#FFFDF7' : '#241812',
                      border: `1.5px solid ${selected ? color : '#E8DBC6'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    {icon} {label}
                  </button>
                );
              })}
            </div>
            <textarea
              value={recoNote}
              onChange={(e) => onRecoNote(e.target.value)}
              rows={3}
              placeholder="Justifiez votre recommandation au comité d'investissement…"
              style={{
                width: '100%',
                resize: 'vertical',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 14,
                lineHeight: 1.5,
                color: '#241812',
                background: '#F4E9D8',
                border: 'none',
                borderRadius: 11,
                padding: '13px 15px',
                outline: 'none',
              }}
            />
          </div>
        )}
      </div>

      <NavFooter
        onBack={onBack}
        hideOnPrint
        right={
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-amber-outline" onClick={() => window.print()}>
              ⭳ Imprimer / PDF
            </button>
            <button className="btn-primary" onClick={onNext}>
              Structurer le financement →
            </button>
          </div>
        }
      />
    </div>
  );
}
