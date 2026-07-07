interface LandingProps {
  onPickSolo: () => void;
  onPickMultiplayer: () => void;
  onHowToPlay: () => void;
  onCourse: () => void;
}

export function Landing({ onPickSolo, onPickMultiplayer, onHowToPlay, onCourse }: LandingProps) {
  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '60px 34px' }}>
      <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 40px' }}>
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
          LE GRAND DEAL
        </div>
        <h1
          style={{
            fontFamily: "'Bricolage Grotesque'",
            fontWeight: 800,
            fontSize: 'clamp(34px,4.6vw,52px)',
            lineHeight: 1.05,
            letterSpacing: '-.02em',
            margin: '20px 0 0',
          }}
        >
          Comment voulez-vous <span style={{ color: '#C1502E' }}>jouer</span>&nbsp;?
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.55, color: '#5B4B3E', margin: '18px auto 0', maxWidth: 480 }}>
          En solo contre des fonds rivaux simulés, ou en salle multijoueur où votre équipe affronte de vraies équipes
          en direct.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, flexWrap: 'wrap', marginTop: 14 }}>
          <button
            onClick={onHowToPlay}
            style={{
              appearance: 'none',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              fontFamily: "'Bricolage Grotesque'",
              fontWeight: 700,
              fontSize: 14,
              color: '#93341A',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            📖 Comment jouer&nbsp;? Voir les règles complètes
          </button>
          <button
            onClick={onCourse}
            style={{
              appearance: 'none',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              fontFamily: "'Bricolage Grotesque'",
              fontWeight: 700,
              fontSize: 14,
              color: '#93341A',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            🎓 Le cours&nbsp;: notions clés &amp; but du jeu
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <button
          onClick={onPickSolo}
          className="card-hover"
          style={{
            textAlign: 'left',
            cursor: 'pointer',
            appearance: 'none',
            background: '#FFFDF7',
            border: '2px solid #EADCC4',
            borderRadius: 20,
            padding: 28,
            boxShadow: '0 14px 34px -22px rgba(60,30,10,.5)',
          }}
        >
          <div style={{ fontSize: 30 }}>🧑‍💼</div>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 22, margin: '14px 0 6px' }}>
            Jouer en solo
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.5, color: '#6B5A4B', margin: 0 }}>
            Une équipe, des rivaux simulés, aucune connexion requise. Fonctionne toujours, même sans réseau.
          </p>
          <div style={{ marginTop: 16, fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 14, color: '#C1502E' }}>
            Lancer une partie solo →
          </div>
        </button>

        <button
          onClick={onPickMultiplayer}
          className="card-hover"
          style={{
            textAlign: 'left',
            cursor: 'pointer',
            appearance: 'none',
            background: '#241812',
            border: '2px solid #241812',
            borderRadius: 20,
            padding: 28,
            boxShadow: '0 14px 34px -22px rgba(60,30,10,.5)',
            color: '#F4E9D8',
          }}
        >
          <div style={{ fontSize: 30 }}>🏛️</div>
          <div style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 800, fontSize: 22, margin: '14px 0 6px' }}>
            Rejoindre une salle multijoueur
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.5, color: '#BCA997', margin: 0 }}>
            Créez ou rejoignez une salle avec un code. Enchérissez en direct contre les autres équipes de la
            session, revendez vos entreprises.
          </p>
          <div style={{ marginTop: 16, fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 14, color: '#E0973A' }}>
            Créer / rejoindre une salle →
          </div>
        </button>
      </div>
    </div>
  );
}
