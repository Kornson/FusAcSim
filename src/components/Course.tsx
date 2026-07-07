import { Section } from './Section';

interface CourseProps {
  onBack: () => void;
}

export function Course({ onBack }: CourseProps) {
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
          LE COURS
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
          Notions clés &amp; but du <span style={{ color: '#C1502E' }}>serious game</span>
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.55, color: '#5B4B3E', maxWidth: 620, margin: '16px auto 0' }}>
          Avant de jouer, quelques minutes pour comprendre pourquoi ce jeu existe, ce qu'il cherche à vous faire
          pratiquer, et surtout&nbsp;: qu'est-ce qui fait gagner une équipe à la fin.
        </p>
      </div>

      <Section eyebrow="SERIOUS GAME" title="Pourquoi apprendre en jouant ?">
        <p>
          Un <b>serious game</b> est un jeu conçu d'abord pour faire apprendre, pas pour divertir&nbsp;: il utilise
          les ressorts du jeu (règles, objectif, compétition, retour immédiat) au service d'un objectif
          pédagogique précis. Ici, l'objectif est de vous faire <b>pratiquer</b> le raisonnement d'un
          investisseur en fusions-acquisitions, pas seulement de vous l'expliquer.
        </p>
        <p>
          Ce que la théorie ne donne pas facilement, le jeu le donne&nbsp;: vous prenez de vraies décisions sous
          incertitude et sous contrainte de temps, vous en subissez les conséquences immédiatement (bonne ou
          mauvaise pioche en due diligence, dette qui pèse sur votre trésorerie, enchère perdue par excès de
          prudence), et vous pouvez recommencer sans risque réel. C'est un <b>terrain d'essai sans conséquence</b>{' '}
          pour des réflexes qui, dans la vraie vie, coûtent cher à mal exécuter.
        </p>
        <p>
          Trois compétences sont particulièrement mobilisées&nbsp;: <b>lire des données financières</b> pour en
          tirer un jugement de valeur, <b>arbitrer risque et rendement</b> quand chaque option a un coût, et{' '}
          <b>décider vite avec une information incomplète</b>&nbsp;— surtout en enchère live, où le compte à
          rebours ne vous laisse pas le temps de tout recalculer.
        </p>
      </Section>

      <Section eyebrow="OBJECTIF" title='Le but : construire de la valeur, pas juste "acheter"'>
        <p>
          Erreur la plus fréquente en début de partie&nbsp;: penser que l'équipe qui possède le plus d'entreprises
          a gagné. C'est faux. Le jeu — comme la vraie vie d'un fonds d'investissement — vous juge sur votre{' '}
          <b>valeur nette finale</b>, qui combine trois éléments en tension les uns avec les autres&nbsp;:
        </p>
        <div
          style={{
            fontFamily: "'Space Mono'",
            fontSize: 13,
            color: '#93341A',
            background: '#F4E3C4',
            borderRadius: 12,
            padding: '14px 16px',
            margin: '4px 0 14px',
            lineHeight: 1.7,
          }}
        >
          valeur nette = trésorerie disponible + valeur réelle du portefeuille (dont synergies) − dette du groupe
        </div>
        <ul>
          <li>
            <b>La trésorerie disponible</b>&nbsp;: c'est votre liquidité, votre marge de manœuvre. Une équipe sans
            trésorerie ne peut plus saisir une bonne occasion, ni encaisser un imprévu&nbsp;— en solo, elle ne
            peut même plus continuer à jouer sous 30&nbsp;M€.
          </li>
          <li>
            <b>La valeur réelle du portefeuille</b>&nbsp;: pas le prix payé, la <i>vraie</i> valeur de ce que vous
            détenez une fois les risques de due diligence révélés et les synergies créées. Bien acheter (au bon
            prix, après une bonne due diligence) vaut plus que beaucoup acheter.
          </li>
          <li>
            <b>La dette du groupe</b>&nbsp;: elle finance vos acquisitions mais elle se <b>déduit</b> de votre
            valeur nette et coûte des intérêts chaque tour. Un portefeuille impressionnant financé à l'excès peut
            valoir moins, une fois la dette retranchée, qu'un portefeuille plus modeste mais sain.
          </li>
        </ul>
        <p>
          Le jeu récompense donc un <b>équilibre</b>&nbsp;: être assez offensif pour construire un vrai
          portefeuille, assez discipliné pour ne pas surpayer, et assez prudent pour garder de la liquidité et ne
          pas s'endetter au point de s'asphyxier. C'est exactement l'arbitrage que fait un vrai gérant de fonds.
        </p>
      </Section>

      <Section eyebrow="NOTIONS CLÉS" title="Valoriser une entreprise (DCF & comparables)">
        <p>
          Avant d'enchérir, il faut savoir combien une entreprise <i>vaut vraiment</i>&nbsp;— indépendamment de ce
          que quelqu'un est prêt à payer pour elle. On distingue d'abord deux notions&nbsp;: la{' '}
          <b>valeur d'entreprise</b> (EV, ce que vaut l'activité elle-même) et la <b>valeur des capitaux propres</b>{' '}
          (ce qui revient aux actionnaires, une fois la dette nette déjà au bilan de la cible retranchée de l'EV).
          C'est ce pont — EV moins dette nette — que vous retrouvez dans le panneau de valorisation du jeu.
        </p>
        <p>Pour estimer l'EV, deux méthodes classiques et complémentaires&nbsp;:</p>
        <ul>
          <li>
            <b>Le DCF (discounted cash flows)</b>&nbsp;: on projette les flux de trésorerie futurs de l'entreprise
            sur quelques années, on estime une <b>valeur terminale</b> (la valeur de tout ce qui vient après
            l'horizon explicite&nbsp;— souvent la majorité du total), puis on actualise l'ensemble à aujourd'hui
            avec un taux, le <b>coût du capital (WACC)</b>&nbsp;: un mélange du coût des capitaux propres et du
            coût de la dette, pondéré par leur poids respectif dans le financement. Ce taux traduit le risque
            perçu&nbsp;: plus il est élevé, moins l'avenir pèse dans le prix d'aujourd'hui.
            <br />
            <span style={{ color: '#8A7B68', fontSize: 13.5 }}>
              Point de vigilance&nbsp;: le DCF est un instrument de précision braqué sur un avenir incertain. Un
              écart d'à peine 1 à 2 points sur le WACC ou sur l'hypothèse de croissance terminale peut faire
              varier la valorisation de 15 à 30&nbsp;%&nbsp;— d'où l'intérêt de raisonner en fourchette plutôt
              qu'en chiffre unique.
            </span>
          </li>
          <li>
            <b>Les comparables</b>&nbsp;: on regarde à quel multiple (souvent EV / EBITDA) se négocient des
            entreprises similaires&nbsp;— même secteur, taille et profil de croissance comparables&nbsp;— puis on
            applique ce multiple à l'EBITDA de la cible. Méthode rapide, ancrée dans les prix réels du marché.
            <br />
            <span style={{ color: '#8A7B68', fontSize: 13.5 }}>
              Point de vigilance&nbsp;: le résultat dépend entièrement du choix des comparables. Un panel trop
              restreint, ou des sociétés pas vraiment comparables (taille, croissance, marge différentes), et la
              méthode donne une fausse impression de précision "de marché".
            </span>
          </li>
        </ul>
        <p>
          Aucune des deux n'est "la bonne réponse"&nbsp;: en pratique, on <b>croise systématiquement les deux</b>{' '}
          pour se donner une fourchette de valeur raisonnable plutôt qu'un chiffre unique et faussement précis.
          C'est exactement ce que fait l'écran de valorisation du jeu en retenant la <b>moyenne des deux
          méthodes</b>&nbsp;— et c'est aussi pour ça qu'il affiche l'historique sur 3&nbsp;ans, les comparables
          sectoriels et une note d'analyste&nbsp;: plus vous multipliez les angles de lecture, moins vous risquez
          de vous ancrer sur un chiffre fragile.
        </p>
      </Section>

      <Section eyebrow="NOTIONS CLÉS" title="La due diligence : repérer le risque avant de signer">
        <p>
          Dans une vraie acquisition, le prix affiché n'est qu'un point de départ&nbsp;: la due diligence sert à
          vérifier ce qui se cache derrière les chiffres avant de s'engager. On l'organise en général par
          volets&nbsp;: <b>financier</b> (qualité des résultats, dette non déclarée, actifs surévalués),{' '}
          <b>juridique</b> (litiges en cours, contrats à risque), <b>commercial/opérationnel</b> (dépendance à un
          client ou un fournisseur clé) et <b>fiscal &amp; social</b> (redressements potentiels, engagements
          sociaux cachés). Le jeu compresse ces volets en 5 dossiers scellés à ouvrir un à un.
        </p>
        <p>
          Deux réflexes à travailler&nbsp;: distinguer un risque <b>matériel</b> (qui change vraiment la valeur ou
          la décision&nbsp;— dans le jeu, un impact ≥&nbsp;15&nbsp;M€) d'un simple bruit sans conséquence, et
          savoir quoi <b>faire</b> d'un risque détecté&nbsp;— renégocier le prix, exiger une garantie contractuelle
          (l'équivalent d'une garantie de passif&nbsp;: le vendeur s'engage à indemniser si le risque se
          matérialise), ou tout simplement se retirer si le risque est rédhibitoire. Une due diligence qui ne
          débouche sur aucune décision ne sert à rien&nbsp;— c'est pour ça que le rapport du jeu vous oblige à
          qualifier chaque risque, le chiffrer, et conclure par une recommandation claire.
        </p>
        <p style={{ color: '#8A7B68', fontSize: 13.5 }}>
          Point de vigilance&nbsp;: le plus grand risque n'est pas de rater un dossier, c'est le{' '}
          <b>biais de confirmation</b>&nbsp;— une fois qu'une équipe s'est mentalement engagée sur un deal, elle a
          tendance à minimiser les signaux négatifs pour ne pas remettre en cause une décision déjà prise
          émotionnellement. C'est un biais documenté chez de vrais comités d'investissement, pas qu'un piège de
          jeu vidéo.
        </p>
      </Section>

      <Section eyebrow="NOTIONS CLÉS" title="Dette, capitaux propres et effet de levier">
        <p>
          Financer un rachat, c'est choisir un mélange entre <b>capitaux propres</b> (votre trésorerie, qui ne
          coûte pas d'intérêt mais s'épuise définitivement) et <b>dette</b> (moins chère à la marge&nbsp;— les
          intérêts sont même souvent déductibles fiscalement, un mécanisme appelé <b>bouclier fiscal</b>&nbsp;—
          mais qui doit être remboursée avec intérêt, qu'importe si le deal se passe bien ou mal). C'est l'
          <b>effet de levier</b>&nbsp;: bien dosé, il démultiplie votre capacité d'investissement sans épuiser
          votre trésorerie&nbsp;; mal dosé, il vous rend fragile au moindre imprévu. C'est exactement la logique
          d'un <b>LBO</b> (leveraged buy-out) réel&nbsp;— utiliser la dette pour amplifier le rendement d'une
          acquisition, au prix d'un risque amplifié aussi.
        </p>
        <p>
          C'est pour ça qu'on surveille un ratio simple&nbsp;: la <b>dette rapportée à l'EBITDA</b>. En dessous
          d'une certaine zone, le levier est prudent mais sous-exploité&nbsp;; au-dessus (dans le jeu, au-delà de
          4,5×), le risque de défaut devient trop élevé aux yeux d'un investisseur sérieux, qui pénalise alors le
          dossier.
        </p>
        <p>
          Le jeu simule aussi un mécanisme bien réel des grosses opérations sous tension&nbsp;: la{' '}
          <b>dette de dernière minute</b> (l'équivalent d'un financement relais ou mezzanine), mobilisable en
          urgence pour ne pas perdre une enchère, mais à un taux nettement plus élevé&nbsp;— le prix de la
          précipitation.
        </p>
        <p style={{ color: '#8A7B68', fontSize: 13.5 }}>
          Point de vigilance&nbsp;: une dette ne négocie pas. Contrairement aux capitaux propres, elle exige son
          remboursement et ses intérêts à échéance fixe, que votre portefeuille ait pris de la valeur ou non&nbsp;—
          c'est exactement ce que modélise le prélèvement automatique d'intérêts sur votre trésorerie à chaque
          tour, indépendamment de vos résultats.
        </p>
      </Section>

      <Section eyebrow="NOTIONS CLÉS" title="Synergies : où la vraie valeur se crée après le deal">
        <p>
          Signer l'acquisition n'est que la moitié du travail&nbsp;: la valeur se crée (ou se détruit) surtout{' '}
          <i>après</i>, pendant l'intégration. On distingue classiquement trois leviers&nbsp;:
        </p>
        <ul>
          <li>
            <b>Synergies de coûts</b>&nbsp;: mutualiser les achats, éliminer les doublons de fonctions support,
            profiter d'économies d'échelle&nbsp;— les plus faciles à chiffrer, et donc les plus souvent visées en
            premier.
          </li>
          <li>
            <b>Synergies de revenus</b>&nbsp;: vente croisée du catalogue combiné, accès à de nouveaux canaux ou
            marchés géographiques&nbsp;— plus séduisantes sur le papier, mais aussi les plus incertaines&nbsp;:
            elles dépendent de clients et de marchés qu'on ne contrôle pas.
          </li>
          <li>
            <b>Synergies fiscales &amp; financières</b>&nbsp;: mutualisation de la trésorerie de groupe,
            optimisation de la structure de capital et de la fiscalité consolidée.
          </li>
        </ul>
        <p>
          Le jeu modélise volontairement des <b>rendements décroissants</b>&nbsp;: concentrer tous ses efforts sur
          un seul levier coûte de plus en plus cher pour de moins en moins de gain&nbsp;— une entreprise ne peut
          pas réduire ses coûts indéfiniment sans finir par abîmer son activité réelle. C'est un rappel réaliste
          d'une des causes n°1 d'échec en M&amp;A&nbsp;: surestimer, au moment de l'annonce, des synergies qui ne
          seront jamais réellement livrées.
        </p>
        <p style={{ color: '#8A7B68', fontSize: 13.5 }}>
          Point de vigilance&nbsp;: dans la vraie vie, l'essentiel de l'échec des synergies n'est pas financier
          mais humain&nbsp;— chocs de culture d'entreprise, résistance au changement, départs de talents clés
          pendant l'intégration. Le jeu simplifie ça en un curseur, mais gardez en tête que "créer de la valeur"
          après un rachat est un travail d'exécution, pas une formalité comptable.
        </p>
      </Section>

      <Section eyebrow="PORTEFEUILLE" title="Penser comme un vrai investisseur">
        <p>
          Un gérant de fonds n'est jamais jugé sur le nombre de lignes de son portefeuille, mais sur sa{' '}
          <b>valeur nette ajustée du risque</b>&nbsp;: ce qu'il possède vraiment, moins ce qu'il doit, en gardant
          assez de liquidité pour durer et saisir les prochaines occasions. C'est exactement ce que mesure le
          score final du jeu&nbsp;— une manière de vous faire intérioriser, en une session, une logique qui prend
          normalement des années de pratique à assimiler.
        </p>
      </Section>

      <Section eyebrow="DÉBRIEF" title="Après la partie, les questions à se poser">
        <ul>
          <li>L'équipe qui termine première a-t-elle le plus d'entreprises, ou les mieux choisies ?</li>
          <li>Qui a le mieux résisté à la pression de l'enchère live sans surpayer ?</li>
          <li>La dette a-t-elle servi à saisir de vraies opportunités, ou a-t-elle fragilisé l'équipe ?</li>
          <li>Une due diligence plus rigoureuse aurait-elle changé une décision d'achat ?</li>
          <li>Les synergies choisies étaient-elles cohérentes avec le profil de l'entreprise acquise ?</li>
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
