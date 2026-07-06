import { TARGETS, fmt } from '../../engine';
import type { Auction, RoomTarget, Team } from '../types';

interface MarketScreenProps {
  targets: RoomTarget[];
  teams: Team[];
  auctions: Auction[];
  myTeamId: string;
  onResearch: (targetId: string) => void;
  onJoinAuction: (targetId: string) => void;
  onResell: (targetId: string) => void;
}

export function MarketScreen({ targets, teams, auctions, myTeamId, onResearch, onJoinAuction, onResell }: MarketScreenProps) {
  const byId = new Map(targets.map((t) => [t.target_id, t]));
  const teamName = (id: string | null) => (id ? teams.find((t) => t.id === id)?.name ?? '—' : null);
  const hasOpenAuction = (targetId: string) => auctions.some((a) => a.target_id === targetId && a.status === 'open');

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '30px 34px' }}>
      <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 8px' }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '.2em', color: '#93341A' }}>
          MARCHÉ DE LA SALLE
        </div>
        <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 34, letterSpacing: '-.02em', margin: '8px 0 6px' }}>
          Choisissez votre cible
        </h2>
        <p style={{ fontSize: 15, color: '#5B4B3E', margin: 0 }}>
          {TARGETS.length} entreprises sur le marché. Étudiez un dossier disponible pour lancer votre propre
          enchère, ou rejoignez une enchère déjà en cours.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginTop: 26 }}>
        {TARGETS.map((t) => {
          const rt = byId.get(t.id);
          const status = rt?.status ?? 'available';
          const isMine = rt?.owner_team_id === myTeamId;
          const ownerName = teamName(rt?.owner_team_id ?? null);

          let badge: { label: string; bg: string; color: string; border: string } | null = null;
          if (status === 'owned') {
            badge = isMine
              ? { label: '✅ Votre entreprise', bg: '#F0F4EC', color: '#4E7A4E', border: '#CFE0C2' }
              : { label: `🏳️ Détenue par ${ownerName}`, bg: '#F4EAD8', color: '#93341A', border: '#EADCC4' };
          } else if (status === 'in_auction') {
            badge = { label: '🔨 Enchère en cours', bg: '#F4E3C4', color: '#93341A', border: '#E0973A' };
          }

          const clickable = status === 'available' || (status === 'in_auction' && hasOpenAuction(t.id));

          function handleClick() {
            if (status === 'available') onResearch(t.id);
            else if (status === 'in_auction') onJoinAuction(t.id);
          }

          return (
            <div
              key={t.id}
              className={clickable ? 'card-hover' : undefined}
              onClick={clickable ? handleClick : undefined}
              style={{
                cursor: clickable ? 'pointer' : 'default',
                background: status === 'owned' && !isMine ? '#F4EFE4' : '#FFFDF7',
                border: `2px solid ${badge ? badge.border : '#EADCC4'}`,
                borderRadius: 20,
                padding: 22,
                boxShadow: clickable ? '0 14px 34px -22px rgba(60,30,10,.5)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                opacity: status === 'owned' && !isMine ? 0.7 : 1,
                position: 'relative',
              }}
            >
              {badge && (
                <div
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    fontFamily: "'Space Mono'",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '5px 9px',
                    borderRadius: 999,
                    background: badge.bg,
                    color: badge.color,
                    border: `1px solid ${badge.border}`,
                    maxWidth: 150,
                    textAlign: 'right',
                  }}
                >
                  {badge.label}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 13,
                    background: t.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                  }}
                >
                  {t.icon}
                </div>
              </div>
              <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 22, margin: '16px 0 3px' }}>
                {t.name}
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.5, color: '#6B5A4B', margin: '0 0 16px', minHeight: 60 }}>
                {t.blurb}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 10px', marginTop: 'auto' }}>
                <Stat label="CA" value={fmt(t.rev)} />
                <Stat label="EBITDA" value={fmt(t.ebitda)} />
                <Stat label="CROISSANCE" value={`+${t.growth} %`} color="#4E7A4E" />
                <Stat label="MULT. SECT." value={`${t.mult}×`} />
              </div>
              {rt?.last_sale_price != null && (
                <div style={{ marginTop: 10, fontFamily: "'Space Mono'", fontSize: 11, color: '#A0907A', textAlign: 'center' }}>
                  Dernière vente&nbsp;: {fmt(rt.last_sale_price)}
                </div>
              )}
              {status === 'available' && (
                <div style={{ marginTop: 16, textAlign: 'center', fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 14, color: '#C1502E' }}>
                  Étudier ce dossier →
                </div>
              )}
              {status === 'in_auction' && (
                <div style={{ marginTop: 16, textAlign: 'center', fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 14, color: '#93341A' }}>
                  Rejoindre l'enchère →
                </div>
              )}
              {status === 'owned' && isMine && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onResell(t.id);
                  }}
                  className="btn-amber-outline"
                  style={{ marginTop: 16 }}
                >
                  Mettre aux enchères
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ background: '#FBF4E8', borderRadius: 10, padding: '9px 11px' }}>
      <div style={{ fontFamily: "'Space Mono'", fontSize: 9.5, letterSpacing: '.1em', color: '#A0907A' }}>{label}</div>
      <div style={{ fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 15, color: color ?? '#241812' }}>{value}</div>
    </div>
  );
}
