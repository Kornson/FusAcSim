import { Section } from './Section';

interface HowToPlayProps {
  onBack: () => void;
}

export function HowToPlay({ onBack }: HowToPlayProps) {
  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '40px 34px 80px' }}>
      <style>{`
        .howto-body ul { margin: 10px 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px; }
        .howto-body li::marker { color: #C1502E; }
        .howto-body p { margin: 0 0 10px; }
        .howto-body p:last-child { margin-bottom: 0; }
      `}</style>
      <button className="btn-outline" onClick={onBack}>
        ← Retour
      </button>

      <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 40 }}>
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
          RÈGLES DU JEU
        </div>
        <h1
          style={{
            fontFamily: "'Bricolage Grotesque'",
            fontWeight: 800,
            fontSize: 'clamp(32px,4vw,44px)',
            letterSpacing: '-.02em',
            margin: '18px 0 0',
          }}
        >
          Comment jouer à <span style={{ color: '#C1502E' }}>Le Grand Deal</span>
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.55, color: '#5B4B3E', maxWidth: 620, margin: '16px auto 0' }}>
          Vous dirigez un fonds d'investissement. Votre mission&nbsp;: repérer les bonnes cibles, les valoriser
          correctement, structurer leur rachat, remporter l'enchère sans surpayer, puis créer de la valeur après
          l'acquisition. Le meilleur fonds n'est pas celui qui achète le plus — c'est celui qui achète le mieux.
        </p>
      </div>

      <Section eyebrow="ÉTAPE 1" title="Choisissez votre cible">
        <p>
          8 entreprises sont sur le marché, chacune avec son secteur, son profil financier (chiffre d'affaires,
          EBITDA, croissance) et ses propres secrets. Étudiez le dossier d'une cible pour lancer son processus
          d'acquisition.
        </p>
      </Section>

      <Section eyebrow="ÉTAPE 2" title="Valorisez l'entreprise">
        <p>
          Estimez la valeur d'entreprise (EV) avec deux méthodes qui se recalculent en direct pendant que vous
          ajustez les curseurs&nbsp;:
        </p>
        <ul>
          <li>
            <b>DCF</b>&nbsp;: actualisez les flux de trésorerie futurs sur 5 ans selon le coût du capital (WACC) et
            l'hypothèse de croissance que vous choisissez.
          </li>
          <li>
            <b>Comparables</b>&nbsp;: EBITDA × multiple de sortie, à ancrer sur les multiples d'entreprises
            comparables du même secteur affichés à côté du curseur.
          </li>
        </ul>
        <p>
          La valeur retenue est la moyenne des deux méthodes. Vous disposez aussi de l'historique financier sur 3
          ans, d'une note d'analyste (forces/points de vigilance) et du pont vers la valeur des capitaux propres
          (EV moins la dette nette déjà au bilan de la cible).
        </p>
      </Section>

      <Section eyebrow="ÉTAPE 3" title="Menez la due diligence">
        <p>
          5 dossiers scellés cachent chacun un risque — positif ou négatif — sur la vraie valeur de l'entreprise.
          Cliquez pour les ouvrir un à un. Certains sont des leurres sans impact réel&nbsp; : à vous de faire le tri.
          Plus vous détectez de risques matériels (impact ≥ 15 M€), meilleure sera votre note.
        </p>
      </Section>

      <Section eyebrow="ÉTAPE 4" title="Rédigez le rapport de due diligence">
        <p>
          Pour chaque dossier ouvert, qualifiez la gravité (faible à rédhibitoire), chiffrez l'impact et proposez
          une mesure correctrice. Terminez par une recommandation au comité d'investissement&nbsp;: poursuivre
          l'acquisition, renégocier le prix, ou se retirer du deal. Le rapport est imprimable en PDF.
        </p>
      </Section>

      <Section eyebrow="ÉTAPE 5" title="Structurez le financement">
        <p>
          Choisissez la part de dette (0 à 70&nbsp;%) qui financera l'acquisition, le reste venant de votre
          trésorerie. Plus de dette abaisse le coût du capital mais augmente le levier (dette / EBITDA)&nbsp;: la
          zone saine se situe entre 2,5× et 4,5×. Au-delà, le jury pénalise le risque excessif&nbsp;; en-deçà, vous
          sous-exploitez votre capacité d'enchère.
        </p>
      </Section>

      <Section eyebrow="ÉTAPE 6" title="Remportez l'enchère">
        <p>
          Placez votre offre. Si elle dépasse votre capacité de financement normale (trésorerie + dette
          planifiée), vous pouvez encore couvrir l'écart avec une <b>dette de dernière minute</b> (jusqu'à 150 M€
          supplémentaires, à un taux majoré de 11&nbsp;%&nbsp;⁠— contre 5&nbsp;% pour la dette classique). Au-delà,
          l'offre est hors de portée.
        </p>
        <p style={{ marginTop: 10 }}>Le déroulé diffère selon le mode&nbsp;:</p>
        <ul>
          <li>
            <b>Solo</b>&nbsp;: deux fonds rivaux simulés enchérissent en une seule fois, avec une agressivité qui
            dépend de la difficulté choisie. Le résultat tombe immédiatement.
          </li>
          <li>
            <b>Multijoueur</b>&nbsp;: l'enchère est en direct, à la montée, avec un compte à rebours de 90 secondes.
            Toute offre placée dans les 15 dernières secondes prolonge le chrono de 15 secondes (anti-sniping)
            — l'enchère ne se termine que quand plus personne ne surenchérit.
          </li>
        </ul>
      </Section>

      <Section eyebrow="ÉTAPE 7" title="Créez des synergies">
        <p>
          Une fois l'entreprise acquise, répartissez 12 jetons d'intégration entre trois leviers&nbsp;: Coûts,
          Revenus, Fiscal &amp; financier. Chaque jeton coûte 5 M€ de trésorerie et augmente la valeur réelle de
          l'entreprise — mais avec des rendements décroissants&nbsp;: concentrer tous vos jetons sur un seul levier
          finit par coûter plus cher que ce qu'il ne rapporte.
        </p>
      </Section>

      <Section eyebrow="LE PORTEFEUILLE" title="Trésorerie, dette et jugement final">
        <p>
          Vous ne faites pas qu'un seul deal&nbsp;: chaque acquisition consomme votre trésorerie (pour la part en
          capitaux propres) et augmente la dette de votre groupe (pour la part en dette + toute dette de dernière
          minute utilisée). Cette dette a un vrai coût.
        </p>
        <ul>
          <li>
            <b>En solo</b>&nbsp;: à chaque nouvelle acquisition, des intérêts (5&nbsp;%/an sur la dette classique,
            11&nbsp;%/an sur la dette de dernière minute) sont automatiquement prélevés sur votre trésorerie. Si
            elle tombe sous 30 M€, vous ne pouvez plus enchaîner de deal&nbsp;: la partie se termine et votre
            portefeuille est jugé sur la valeur totale créée (somme des deals) et le score moyen sur 1000
            (due diligence, discipline de prix, structure financière, synergies).
          </li>
          <li>
            <b>En multijoueur</b>&nbsp;: la dette du groupe est visible dans le classement en temps réel, où elle
            vient directement en déduction de votre valeur nette. Les équipes sont jugées sur&nbsp;:
            <br />
            <span style={{ fontFamily: "'Space Mono'", fontSize: 13, color: '#93341A' }}>
              valeur nette = valeur réelle des entreprises détenues (+ synergies) + trésorerie disponible − dette du
              groupe
            </span>
          </li>
        </ul>
      </Section>

      <Section eyebrow="MULTIJOUEUR" title="Créer ou rejoindre une salle">
        <p>
          Depuis l'écran d'accueil, cliquez sur <b>« Rejoindre une salle multijoueur »</b>. L'écran qui s'ouvre
          propose deux onglets&nbsp;: « Rejoindre une salle » et « Créer une salle ».
        </p>
        <p style={{ marginTop: 14 }}>
          <b>Créer une salle</b> — la première équipe (ou le formateur) à se connecter&nbsp;:
        </p>
        <ul>
          <li>Choisissez le nom de votre équipe / fonds (ex. «&nbsp;Atlas Capital&nbsp;»).</li>
          <li>
            Réglez la <b>difficulté des rivaux simulés restants</b> (Facile / Normal / Difficile)&nbsp;: ils
            comblent les cibles si la salle compte moins d'équipes réelles que d'entreprises au catalogue.
          </li>
          <li>
            Définissez la <b>trésorerie de départ</b> (250&nbsp;M€ par défaut)&nbsp;— elle s'appliquera à toutes
            les équipes qui rejoindront la salle.
          </li>
          <li>
            Cliquez sur «&nbsp;Créer la salle →&nbsp;». Un <b>code à 6 caractères</b> est généré automatiquement
            (ex. «&nbsp;DEAL42&nbsp;»)&nbsp;: communiquez-le aux autres équipes (au tableau, à l'oral…) pour
            qu'elles vous rejoignent.
          </li>
        </ul>
        <p style={{ marginTop: 14 }}>
          <b>Rejoindre une salle</b> — chaque équipe suivante (c'est l'onglet ouvert par défaut)&nbsp;:
        </p>
        <ul>
          <li>Saisissez le code de la salle communiqué par le formateur ou la première équipe.</li>
          <li>Choisissez le nom de votre équipe / fonds.</li>
          <li>Cliquez sur «&nbsp;Rejoindre la salle →&nbsp;».</li>
        </ul>
        <p style={{ marginTop: 14 }}>
          Un onglet de navigateur = une équipe. Si vous rafraîchissez la page ou fermez l'onglet par erreur, vous
          êtes automatiquement reconnecté à votre salle et à votre équipe&nbsp;— aucune donnée n'est perdue.
        </p>
      </Section>

      <Section eyebrow="MODE MULTIJOUEUR" title="La salle en direct">
        <p>Le mode multijoueur transforme l'enchère et le portefeuille en vraie compétition entre équipes&nbsp;:</p>
        <ul>
          <li>
            Une fois dans la salle, son code reste affiché en permanence en haut de l'écran&nbsp;— pratique pour
            le repartager ou vérifier que vous êtes au bon endroit.
          </li>
          <li>
            Le marché est partagé&nbsp;: dès qu'une entreprise est achetée, elle disparaît du marché jusqu'à ce que
            son propriétaire la remette aux enchères.
          </li>
          <li>
            La recherche (valorisation, due diligence, rapport, financement) reste privée à votre équipe&nbsp;;
            seule l'enchère est publique et en direct&nbsp;— toutes les équipes voient les offres et peuvent
            surenchérir jusqu'à la fin du chrono.
          </li>
          <li>
            <b>Revente</b>&nbsp;: depuis "Mon portefeuille", vous pouvez remettre une de vos entreprises aux
            enchères. Contrairement à un premier achat, le prix de vente est directement crédité au vendeur, pas
            prélevé dans le vide.
          </li>
          <li>Le classement est consultable à tout moment, pas seulement à la fin de la session.</li>
        </ul>
      </Section>

      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <button className="btn-primary lg" onClick={onBack}>
          C'est compris, retour →
        </button>
      </div>
    </div>
  );
}
