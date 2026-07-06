import { useEffect, useRef, useState } from 'react';
import './components/buttons.css';
import { Hud } from './components/Hud';
import { Stepper } from './components/Stepper';
import { Lobby } from './screens/Lobby';
import { Cible } from './screens/Cible';
import { Valorisation } from './screens/Valorisation';
import { DueDiligence } from './screens/DueDiligence';
import { Rapport } from './screens/Rapport';
import { Financement } from './screens/Financement';
import { Enchere } from './screens/Enchere';
import { Synergies } from './screens/Synergies';
import { Resultats } from './screens/Resultats';
import { Portfolio } from './screens/Portfolio';
import { PortfolioPanel } from './components/PortfolioPanel';
import {
  DEAL_DEFAULTS,
  MAX_STRETCH_DEBT,
  SCREEN_ORDER,
  SYN_POINT_COST,
  buildDealRecord,
  canContinue,
  computeFinancingBreakdown,
  createInitialState,
  findTarget,
  financing,
  groupInterest,
  runAuction,
  totalGroupDebt,
} from './engine';
import type { GameProps, GameState, ReportEntry, SynState } from './types';

const GAME_PROPS: GameProps = {
  difficulty: 'normal',
  showTimer: true,
  startingBudget: 250,
};

function SoloApp() {
  const [state, setStateRaw] = useState<GameState>(() => createInitialState(GAME_PROPS.startingBudget));
  const [showPortfolio, setShowPortfolio] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const id = setInterval(() => {
      const s = stateRef.current;
      if (s.started && s.screen !== 'resultats' && s.screen !== 'portfolio') {
        setStateRaw((prev) => ({ ...prev, seconds: prev.seconds + 1 }));
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const patch = (p: Partial<GameState>) => setStateRaw((s) => ({ ...s, ...p }));

  const target = findTarget(state.target);
  const teamLabel = state.teamName ? state.teamName : 'Votre fonds';
  const fin = financing(target, state.debt, state.treasury);
  const groupDebt = totalGroupDebt(state.deals);

  function goNext() {
    if (state.screen === 'enchere' && state.auctionDone && !state.won) {
      finalizeDeal();
      return;
    }
    if (state.screen === 'synergies') {
      finalizeDeal();
      return;
    }
    const i = SCREEN_ORDER.indexOf(state.screen);
    if (i >= 0 && i < SCREEN_ORDER.length - 1) patch({ screen: SCREEN_ORDER[i + 1] });
  }
  function goBack() {
    if (state.screen === 'cible') {
      patch({ screen: 'lobby' });
      return;
    }
    const i = SCREEN_ORDER.indexOf(state.screen);
    if (i > 0) patch({ screen: SCREEN_ORDER[i - 1] });
  }
  function restart() {
    setStateRaw(createInitialState(GAME_PROPS.startingBudget));
  }

  function finalizeDeal() {
    setStateRaw((s) => {
      const t = findTarget(s.target);
      const record = buildDealRecord(s, t, s.treasury);
      return {
        ...s,
        deals: [...s.deals, record],
        screen: 'resultats',
      };
    });
  }

  function continueOrFinish() {
    setStateRaw((s) => {
      if (canContinue(s.deals, s.treasury)) {
        const interest = groupInterest(s.deals);
        return { ...s, ...DEAL_DEFAULTS, treasury: Math.max(0, s.treasury - interest), lastInterest: interest, screen: 'cible' };
      }
      return { ...s, screen: 'portfolio' };
    });
  }

  function updateReport(riskId: string, riskPatch: Partial<ReportEntry>) {
    const risk = target.risks.find((r) => r.id === riskId)!;
    setStateRaw((s) => {
      const existing = s.reports[riskId];
      const base: ReportEntry = existing ?? {
        constat: risk.note,
        mesure: '',
        impact: risk.impact,
        gravite: '',
      };
      return { ...s, reports: { ...s.reports, [riskId]: { ...base, ...riskPatch } } };
    });
  }

  function incSyn(key: keyof SynState) {
    setStateRaw((s) => {
      const used = s.syn.cost + s.syn.rev + s.syn.tax;
      if (12 - used <= 0) return s;
      if (s.treasury < SYN_POINT_COST) return s;
      return { ...s, treasury: s.treasury - SYN_POINT_COST, syn: { ...s.syn, [key]: s.syn[key] + 1 } };
    });
  }
  function decSyn(key: keyof SynState) {
    setStateRaw((s) => {
      if (s.syn[key] <= 0) return s;
      return { ...s, treasury: s.treasury + SYN_POINT_COST, syn: { ...s.syn, [key]: s.syn[key] - 1 } };
    });
  }

  function runAuctionNow() {
    if (state.bid > fin.capacity + MAX_STRETCH_DEBT) return;
    const rivals = runAuction(target, GAME_PROPS.difficulty);
    const topRival = Math.max(...rivals.map((r) => r.bid));
    const won = state.bid >= topRival;
    const breakdown = won ? computeFinancingBreakdown(state.bid, fin.debtRaised, state.treasury) : { equitySpent: 0, stretchDebt: 0 };
    patch({ rivals, won, auctionDone: true, treasury: state.treasury - breakdown.equitySpent, stretchDebt: breakdown.stretchDebt });
  }

  const showStepper = state.started && state.screen !== 'lobby' && state.screen !== 'portfolio';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(140% 120% at 15% -10%, #FBF4E8 0%, #F2E6D0 55%, #EAD9BC 100%)',
        fontFamily: "'Space Grotesk',sans-serif",
        color: '#241812',
        paddingBottom: 60,
      }}
    >
      <Hud
        started={state.started}
        teamLabel={teamLabel}
        equity={state.treasury}
        totalDebt={groupDebt}
        showTimer={GAME_PROPS.showTimer}
        seconds={state.seconds}
        dealsCount={state.deals.length}
        showPortfolioButton={state.screen !== 'portfolio'}
        onTogglePortfolio={() => setShowPortfolio(true)}
      />

      {showPortfolio && (
        <PortfolioPanel
          deals={state.deals}
          treasury={state.treasury}
          totalDebt={groupDebt}
          teamLabel={teamLabel}
          onClose={() => setShowPortfolio(false)}
        />
      )}

      {showStepper && <Stepper screen={state.screen} />}

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '26px 34px 0' }}>
        {state.screen === 'lobby' && (
          <Lobby
            teamName={state.teamName}
            onTeamName={(v) => patch({ teamName: v })}
            onStart={() => patch({ started: true, screen: 'cible', seconds: 0 })}
          />
        )}

        {state.screen === 'cible' && (
          <Cible
            selectedId={state.target}
            deals={state.deals}
            treasury={state.treasury}
            totalDebt={groupDebt}
            lastInterest={state.lastInterest}
            onSelect={(id, growth, mult) => patch({ target: id, growth, exit: mult, screen: 'valo' })}
          />
        )}

        {state.screen === 'valo' && (
          <Valorisation
            target={target}
            wacc={state.wacc}
            growth={state.growth}
            exit={state.exit}
            onWacc={(v) => patch({ wacc: v })}
            onGrowth={(v) => patch({ growth: v })}
            onExit={(v) => patch({ exit: v })}
            onBack={goBack}
            onNext={goNext}
          />
        )}

        {state.screen === 'dd' && (
          <DueDiligence
            target={target}
            revealed={state.revealed}
            onReveal={(id) => {
              if (!state.revealed.includes(id)) patch({ revealed: [...state.revealed, id] });
            }}
            onBack={goBack}
            onNext={goNext}
          />
        )}

        {state.screen === 'rapport' && (
          <Rapport
            target={target}
            revealed={state.revealed}
            reports={state.reports}
            teamLabel={teamLabel}
            reco={state.reco}
            recoNote={state.recoNote}
            onUpdateReport={updateReport}
            onPickReco={(label) => patch({ reco: label })}
            onRecoNote={(v) => patch({ recoNote: v })}
            onBack={goBack}
            onNext={goNext}
          />
        )}

        {state.screen === 'financement' && (
          <Financement
            target={target}
            debt={state.debt}
            treasury={state.treasury}
            totalDebt={groupDebt}
            onDebt={(v) => patch({ debt: v })}
            onBack={goBack}
            onNext={goNext}
          />
        )}

        {state.screen === 'enchere' && (
          <Enchere
            target={target}
            bid={state.bid}
            capacity={fin.capacity}
            maxStretchDebt={MAX_STRETCH_DEBT}
            stretchDebtUsed={state.stretchDebt}
            auctionDone={state.auctionDone}
            rivals={state.rivals}
            won={state.won}
            teamLabel={teamLabel}
            onBid={(v) => patch({ bid: v })}
            onRunAuction={runAuctionNow}
            onBack={goBack}
            onNext={goNext}
          />
        )}

        {state.screen === 'synergies' && (
          <Synergies syn={state.syn} treasury={state.treasury} onInc={incSyn} onDec={decSyn} onBack={goBack} onNext={goNext} />
        )}

        {state.screen === 'resultats' && (
          <Resultats
            deal={state.deals[state.deals.length - 1]}
            treasury={state.treasury}
            totalDebt={groupDebt}
            dealsCount={state.deals.length}
            canContinue={canContinue(state.deals, state.treasury)}
            interestPreview={groupInterest(state.deals)}
            onContinue={continueOrFinish}
          />
        )}

        {state.screen === 'portfolio' && (
          <Portfolio
            deals={state.deals}
            treasury={state.treasury}
            totalDebt={groupDebt}
            teamLabel={teamLabel}
            difficulty={GAME_PROPS.difficulty}
            onRestart={restart}
          />
        )}
      </div>
    </div>
  );
}

export default SoloApp;
