interface LobbyProps {
  teamName: string;
  onTeamName: (v: string) => void;
  onStart: () => void;
}

const PHASES = [
  { title: 'Valorisation', note: 'DCF + multiples de comparables' },
  { title: 'Due Diligence', note: 'Débusquez les risques cachés' },
  { title: 'Financement', note: 'Arbitrage dette / capitaux propres' },
  { title: 'Enchère', note: 'Battez les fonds rivaux' },
  { title: 'Synergies', note: 'Créez de la valeur post-fusion' },
];

export function Lobby({ teamName, onTeamName, onStart }: LobbyProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.15fr .85fr',
        gap: 34,
        alignItems: 'stretch',
        marginTop: 14,
        animation: 'floatIn .5s ease both',
      }}
    >
      <div>
        <div
          style={{
            display: 'inline-block',
            fontFamily: "'Space Mono'",
            fontSize: 11,
            letterSpacing: '.2em',
            color: '#93341A',
            background: '#F4E3C4',
            padding: '6px 13px',
            borderRadius: 999,
          }}
        >
          SÉANCE · ÉQUIPES EN COMPÉTITION
        </div>
        <h1
          style={{
            fontFamily: "'Bricolage Grotesque'",
            fontWeight: 800,
            fontSize: 'clamp(40px,5.4vw,66px)',
            lineHeight: 0.98,
            letterSpacing: '-.02em',
            margin: '20px 0 0',
          }}
        >
          Rachetez la
          <br />
          <span style={{ color: '#C1502E' }}>bonne cible.</span>
          <br />
          Au bon prix.
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.55, color: '#5B4B3E', maxWidth: 460, margin: '22px 0 0' }}>
          Vous dirigez un fonds. Une cible est en vente, deux fonds rivaux la convoitent. Valorisez, auditez,
          financez, puis remportez l'enchère&nbsp;— sans surpayer. Le meilleur deal l'emporte.
        </p>

        <div style={{ marginTop: 30, maxWidth: 420 }}>
          <label
            style={{
              fontFamily: "'Space Mono'",
              fontSize: 11,
              letterSpacing: '.18em',
              color: '#A0907A',
              display: 'block',
              marginBottom: 8,
            }}
          >
            NOM DE VOTRE ÉQUIPE / FONDS
          </label>
          <input
            className="field-input"
            value={teamName}
            onChange={(e) => onTeamName(e.target.value)}
            placeholder="ex. Atlas Capital"
            style={{
              width: '100%',
              fontFamily: "'Bricolage Grotesque'",
              fontWeight: 700,
              fontSize: 20,
              border: '2px solid #E3D3B6',
              borderRadius: 14,
              padding: '15px 18px',
            }}
          />
          <button className="btn-primary full" style={{ marginTop: 16 }} onClick={onStart}>
            Lancer la partie →
          </button>
        </div>
      </div>

      <div
        style={{
          background: '#241812',
          borderRadius: 24,
          padding: 30,
          color: '#F4E9D8',
          boxShadow: '0 24px 50px -24px rgba(40,20,10,.7)',
          alignSelf: 'start',
        }}
      >
        <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '.2em', color: '#E0973A' }}>
          RÈGLE DU JEU · 5 PHASES
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {PHASES.map((p, i) => (
            <div
              key={p.title}
              style={{
                display: 'flex',
                gap: 14,
                padding: '13px 0',
                borderBottom: i < PHASES.length - 1 ? '1px solid rgba(244,233,216,.12)' : undefined,
              }}
            >
              <span style={{ fontFamily: "'Space Mono'", color: '#E0973A', fontWeight: 700 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 15 }}>{p.title}</div>
                <div style={{ fontSize: 13, color: '#BCA997' }}>{p.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
