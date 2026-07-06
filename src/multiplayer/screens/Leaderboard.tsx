import { fmt, findTarget, synTotal, trueFair } from '../../engine';
import type { RoomTarget, Team } from '../types';

interface LeaderboardProps {
  teams: Team[];
  targets: RoomTarget[];
  myTeamId: string;
}

interface Row {
  team: Team;
  companiesValue: number;
  netWorth: number;
  ownedCount: number;
}

export function Leaderboard({ teams, targets, myTeamId }: LeaderboardProps) {
  const rows: Row[] = teams
    .map((team) => {
      const owned = targets.filter((t) => t.owner_team_id === team.id);
      const companiesValue = owned.reduce((a, rt) => {
        const target = findTarget(rt.target_id);
        const syn = synTotal({ cost: rt.syn_cost, rev: rt.syn_rev, tax: rt.syn_tax });
        return a + trueFair(target) + syn;
      }, 0);
      const netWorth = companiesValue + team.treasury - team.total_debt;
      return { team, companiesValue, netWorth, ownedCount: owned.length };
    })
    .sort((a, b) => b.netWorth - a.netWorth);

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '30px 34px' }}>
      <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 8px' }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '.2em', color: '#93341A' }}>
          CLASSEMENT DE LA SALLE
        </div>
        <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 34, letterSpacing: '-.02em', margin: '8px 0 6px' }}>
          Qui a fait les meilleurs deals ?
        </h2>
        <p style={{ fontSize: 15, color: '#5B4B3E', margin: 0 }}>
          Valeur nette = valeur réelle des entreprises détenues (+ synergies) + trésorerie disponible − dette du
          groupe. Classement mis à jour en direct.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 26 }}>
        {rows.map((r, i) => {
          const isMe = r.team.id === myTeamId;
          return (
            <div
              key={r.team.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '16px 20px',
                background: isMe ? '#FDF0E4' : '#FFFDF7',
                border: `1px solid ${isMe ? '#E0973A' : '#E8DBC6'}`,
                borderRadius: 14,
              }}
            >
              <span style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 20, color: i === 0 ? '#C1502E' : '#A0907A', width: 28 }}>
                {i + 1}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 16, color: isMe ? '#C1502E' : '#241812' }}>
                  {r.team.name}
                  {isMe ? ' (vous)' : ''}
                </div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 11.5, color: '#A0907A', marginTop: 2 }}>
                  {r.ownedCount} entreprise{r.ownedCount > 1 ? 's' : ''} · trésorerie {fmt(r.team.treasury)}
                  {r.team.total_debt > 0 && ` · dette ${fmt(r.team.total_debt)}`}
                </div>
              </div>
              <span style={{ fontFamily: "'Space Mono'", fontWeight: 800, fontSize: 20, color: r.netWorth >= 0 ? '#4E7A4E' : '#B23A2E' }}>
                {r.netWorth >= 0 ? '+' : ''}
                {fmt(r.netWorth)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
