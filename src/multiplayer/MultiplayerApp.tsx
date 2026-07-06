import { useEffect, useState } from 'react';
import { PageShell } from '../components/PageShell';
import { AUCTION_MIN, fmt, findTarget } from '../engine';
import { RoomJoin } from './screens/RoomJoin';
import { MarketScreen } from './screens/MarketScreen';
import { Research } from './screens/Research';
import { LiveAuctionRoom } from './screens/LiveAuctionRoom';
import { MyPortfolio } from './screens/MyPortfolio';
import { Leaderboard } from './screens/Leaderboard';
import { useRoomState } from './useRoomState';
import { clearSession, loadSession, saveSession } from './session';
import { startAuction } from './lib/api';
import type { RoomSession } from './session';

interface MultiplayerAppProps {
  onExit: () => void;
}

type View =
  | { screen: 'market' }
  | { screen: 'research'; targetId: string }
  | { screen: 'auction'; auctionId: string }
  | { screen: 'portfolio' }
  | { screen: 'leaderboard' };

const NAV_TABS: { screen: 'market' | 'portfolio' | 'leaderboard'; label: string }[] = [
  { screen: 'market', label: 'Marché' },
  { screen: 'portfolio', label: 'Mon portefeuille' },
  { screen: 'leaderboard', label: 'Classement' },
];

export function MultiplayerApp({ onExit }: MultiplayerAppProps) {
  const [session, setSession] = useState<RoomSession | null>(() => loadSession());
  const [view, setView] = useState<View>({ screen: 'market' });
  const [launchError, setLaunchError] = useState<string | null>(null);
  const roomState = useRoomState(session?.roomId ?? null);

  // If another team opens an auction on the target I'm currently researching, jump
  // me into that auction too — I can no longer "start" it, but I can still bid.
  useEffect(() => {
    if (view.screen !== 'research') return;
    const openAuction = roomState.auctions.find((a) => a.target_id === view.targetId && a.status === 'open');
    if (openAuction) setView({ screen: 'auction', auctionId: openAuction.id });
  }, [view, roomState.auctions]);

  if (!session) {
    return (
      <PageShell>
        <RoomJoin
          onJoined={(s) => {
            saveSession(s);
            setSession(s);
          }}
          onBack={onExit}
        />
      </PageShell>
    );
  }

  const myTeam = roomState.teams.find((t) => t.id === session.teamId);
  const groupDebt = myTeam ? myTeam.total_debt : 0;

  async function handleLaunchAuction(targetId: string, debtPct: number) {
    if (!session) return;
    setLaunchError(null);
    try {
      const auction = await startAuction({
        roomId: session.roomId,
        targetId,
        kind: 'primary',
        teamId: session.teamId,
        openingBid: AUCTION_MIN,
        debtPct,
      });
      setView({ screen: 'auction', auctionId: auction.id });
    } catch (err) {
      setLaunchError((err as Error).message);
    }
  }

  async function handleResell(targetId: string) {
    if (!session) return;
    setLaunchError(null);
    try {
      const auction = await startAuction({
        roomId: session.roomId,
        targetId,
        kind: 'resale',
        teamId: session.teamId,
        openingBid: AUCTION_MIN,
        debtPct: 0,
      });
      setView({ screen: 'auction', auctionId: auction.id });
    } catch (err) {
      setLaunchError((err as Error).message);
    }
  }

  function handleJoinAuction(targetId: string) {
    const openAuction = roomState.auctions.find((a) => a.target_id === targetId && a.status === 'open');
    if (openAuction) setView({ screen: 'auction', auctionId: openAuction.id });
  }

  return (
    <PageShell>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 34px',
          background: 'rgba(251,244,232,.82)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid #E3D3B6',
        }}
      >
        <div>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 20 }}>LE GRAND DEAL</div>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 10.5, letterSpacing: '.22em', color: '#A0907A' }}>
            SALLE&nbsp;{session.code}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '.18em', color: '#A0907A' }}>ÉQUIPE</div>
            <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 16 }}>{session.teamName}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '.18em', color: '#A0907A' }}>TRÉSORERIE</div>
            <div style={{ fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 16, color: '#4E7A4E' }}>
              {myTeam ? fmt(myTeam.treasury) : '—'}
            </div>
          </div>
          {groupDebt > 0 && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '.18em', color: '#A0907A' }}>DETTE</div>
              <div style={{ fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 16, color: '#B23A2E' }}>{fmt(groupDebt)}</div>
            </div>
          )}
          <button
            className="btn-outline"
            onClick={() => {
              clearSession();
              setSession(null);
            }}
          >
            Quitter la salle
          </button>
        </div>
      </header>

      {myTeam && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '18px 34px 0' }}>
          {NAV_TABS.map((tab) => {
            const active =
              view.screen === tab.screen || (tab.screen === 'market' && (view.screen === 'research' || view.screen === 'auction'));
            return (
              <button
                key={tab.screen}
                onClick={() => setView({ screen: tab.screen })}
                style={{
                  appearance: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Bricolage Grotesque'",
                  fontWeight: 700,
                  fontSize: 13.5,
                  padding: '9px 18px',
                  borderRadius: 999,
                  border: `1.5px solid ${active ? '#C1502E' : '#E8DBC6'}`,
                  background: active ? '#F4E3C4' : '#FFFDF7',
                  color: active ? '#93341A' : '#6B5A4B',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {roomState.loading && <p style={{ textAlign: 'center', color: '#A0907A', marginTop: 40 }}>Connexion à la salle…</p>}
      {roomState.error && (
        <div style={{ maxWidth: 600, margin: '40px auto 0', padding: '12px 16px', background: '#F9EDEA', border: '1px solid #E7C3BB', borderRadius: 11, color: '#93341A', fontSize: 13.5 }}>
          {roomState.error}
        </div>
      )}
      {launchError && (
        <div style={{ maxWidth: 600, margin: '20px auto 0', padding: '12px 16px', background: '#F9EDEA', border: '1px solid #E7C3BB', borderRadius: 11, color: '#93341A', fontSize: 13.5 }}>
          {launchError}
        </div>
      )}

      {!roomState.loading && myTeam && (
        <>
          {view.screen === 'market' && (
            <MarketScreen
              targets={roomState.targets}
              teams={roomState.teams}
              auctions={roomState.auctions}
              myTeamId={myTeam.id}
              onResearch={(targetId) => setView({ screen: 'research', targetId })}
              onJoinAuction={handleJoinAuction}
              onResell={handleResell}
            />
          )}

          {view.screen === 'research' && (
            <Research
              target={findTarget(view.targetId)}
              teamLabel={session.teamName}
              treasury={myTeam.treasury}
              totalDebt={myTeam.total_debt}
              onLaunchAuction={(debtPct) => handleLaunchAuction(view.targetId, debtPct)}
              onCancel={() => setView({ screen: 'market' })}
            />
          )}

          {view.screen === 'auction' &&
            (() => {
              const auction = roomState.auctions.find((a) => a.id === view.auctionId);
              if (!auction) return <p style={{ textAlign: 'center', marginTop: 40, color: '#A0907A' }}>Enchère introuvable.</p>;
              return (
                <LiveAuctionRoom
                  target={findTarget(auction.target_id)}
                  auction={auction}
                  bids={roomState.bids}
                  teams={roomState.teams}
                  myTeam={myTeam}
                  onBack={() => setView({ screen: 'market' })}
                />
              );
            })()}

          {view.screen === 'portfolio' && (
            <MyPortfolio targets={roomState.targets} roomId={session.roomId} myTeam={myTeam} onResell={handleResell} />
          )}

          {view.screen === 'leaderboard' && (
            <Leaderboard teams={roomState.teams} targets={roomState.targets} myTeamId={myTeam.id} />
          )}
        </>
      )}
    </PageShell>
  );
}
