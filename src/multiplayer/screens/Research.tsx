import { useState } from 'react';
import { Valorisation } from '../../screens/Valorisation';
import { DueDiligence } from '../../screens/DueDiligence';
import { Rapport } from '../../screens/Rapport';
import { Financement } from '../../screens/Financement';
import type { ReportEntry, Target } from '../../types';

type Step = 'valo' | 'dd' | 'rapport' | 'financement';
const STEPS: Step[] = ['valo', 'dd', 'rapport', 'financement'];

interface ResearchProps {
  target: Target;
  teamLabel: string;
  treasury: number;
  totalDebt: number;
  onLaunchAuction: (debtPct: number) => void;
  onCancel: () => void;
}

export function Research({ target, teamLabel, treasury, totalDebt, onLaunchAuction, onCancel }: ResearchProps) {
  const [step, setStep] = useState<Step>('valo');
  const [wacc, setWacc] = useState(10);
  const [growth, setGrowth] = useState(target.growth);
  const [exit, setExit] = useState(target.mult);
  const [revealed, setRevealed] = useState<string[]>([]);
  const [reports, setReports] = useState<Record<string, ReportEntry>>({});
  const [reco, setReco] = useState('');
  const [recoNote, setRecoNote] = useState('');
  const [debt, setDebt] = useState(40);

  function goNext() {
    const i = STEPS.indexOf(step);
    if (i < STEPS.length - 1) setStep(STEPS[i + 1]);
  }
  function goBack() {
    const i = STEPS.indexOf(step);
    if (i > 0) setStep(STEPS[i - 1]);
    else onCancel();
  }

  function updateReport(riskId: string, patch: Partial<ReportEntry>) {
    const risk = target.risks.find((r) => r.id === riskId)!;
    setReports((r) => {
      const existing = r[riskId];
      const base: ReportEntry = existing ?? { constat: risk.note, mesure: '', impact: risk.impact, gravite: '' };
      return { ...r, [riskId]: { ...base, ...patch } };
    });
  }

  if (step === 'valo') {
    return (
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '26px 34px 0' }}>
        <Valorisation
          target={target}
          wacc={wacc}
          growth={growth}
          exit={exit}
          onWacc={setWacc}
          onGrowth={setGrowth}
          onExit={setExit}
          onBack={goBack}
          onNext={goNext}
        />
      </div>
    );
  }

  if (step === 'dd') {
    return (
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '26px 34px 0' }}>
        <DueDiligence
          target={target}
          revealed={revealed}
          onReveal={(id) => {
            if (!revealed.includes(id)) setRevealed([...revealed, id]);
          }}
          onBack={goBack}
          onNext={goNext}
        />
      </div>
    );
  }

  if (step === 'rapport') {
    return (
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '26px 34px 0' }}>
        <Rapport
          target={target}
          revealed={revealed}
          reports={reports}
          teamLabel={teamLabel}
          reco={reco}
          recoNote={recoNote}
          onUpdateReport={updateReport}
          onPickReco={setReco}
          onRecoNote={setRecoNote}
          onBack={goBack}
          onNext={goNext}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '26px 34px 0' }}>
      <Financement
        target={target}
        debt={debt}
        treasury={treasury}
        totalDebt={totalDebt}
        onDebt={setDebt}
        onBack={goBack}
        onNext={() => onLaunchAuction(debt)}
      />
    </div>
  );
}
