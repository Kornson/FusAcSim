# Le Grand Deal — Business Game Fusions-Acquisitions

Simulation pédagogique de fusions-acquisitions. Les joueurs dirigent un fonds d'investissement, choisissent une
cible, la valorisent (DCF + comparables), mènent une due diligence, structurent le financement (dette/capitaux
propres), remportent une enchère, puis créent de la valeur post-acquisition (synergies).

Deux modes de jeu :

- **Solo** — contre des fonds rivaux simulés, 100% local, aucune connexion requise.
- **Multijoueur** — une salle partagée où de vraies équipes s'affrontent en direct : marché commun, enchères en
  temps réel (avec anti-sniping), revente d'entreprises entre équipes, classement live basé sur la valeur nette du
  portefeuille.

## Stack

React + TypeScript + Vite, sans autre dépendance runtime que `@supabase/supabase-js` pour le mode multijoueur
(Postgres + Realtime + Auth anonyme).

## Développement

```bash
npm install
npm run dev
```

Le mode solo fonctionne immédiatement, sans configuration. Le mode multijoueur nécessite un projet Supabase (voir
ci-dessous).

## Configuration du mode multijoueur

1. Créer un projet sur [supabase.com](https://supabase.com).
2. Copier `.env.example` vers `.env` et renseigner l'URL du projet et la clé publique (`anon` / `publishable`) :
   ```
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre-cle-publique
   ```
3. Activer les connexions anonymes (Authentication → Sign In / Providers → Anonymous Sign-Ins) dans le dashboard
   Supabase.
4. Lier le projet et pousser le schéma (tables, RLS, fonctions RPC) :
   ```bash
   npx supabase login
   npx supabase link --project-ref votre-ref-de-projet
   npx supabase db push
   ```

Le schéma complet (tables `rooms`/`teams`/`room_targets`/`auctions`/`bids`, policies RLS, fonctions
`create_room`/`join_room`/`start_auction`/`place_bid`/`close_auction`/`update_synergies`) est dans
`supabase/migrations/`.

## Build

```bash
npm run build
```
