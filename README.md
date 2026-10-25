# Lamba


A personal kitchen companion app: shopping lists, a product registry with
the brand bought and keep / moderation / substitute verdicts, home
inventory, and recipes, including a daily recipe suggestion.

## Tech stack

- React + TypeScript + Vite, built as an installable PWA
- Firebase Hosting for the frontend
- Cloud Firestore for data
- Firebase Auth with Google sign-in
- Photos: none, by the owner's decision. Products record the brand she
  buys instead of a picture.

Access is restricted to the owner account through Firestore security rules.

Implemented so far: Google sign-in, a Firestore shopping list with a
category filter (now including a Household category for non-food items),
saved recipes with a recipe of the day that syncs daily, a product
registry with the brand bought for each product and a keep / moderation /
substitute verdict, a home inventory by location (pantry, fridge,
freezer, household) with adjustable quantities, seeded from recent
purchases, and recipe favorites (a star on each recipe plus a favorites
filter). Shopping and inventory are connected: a Shopping done button
moves checked items into inventory (adding to the matching item, or
creating it in the mapped location) and unchecks them, items at zero in
inventory offer to go back on the shopping list, and the shopping form
takes quantities.

## Assistant sync

The assistant writes to the app through repo files that the deploy
workflow syncs into Firestore with the deploy service account (never
printed in logs, since Actions logs on a public repo are public):

- `data/daily-recipe.json` → the recipe of the day (upsert by date).
- `data/shopping-additions.json` → items added to the shopping list,
  skipping names already present.
- `data/products-sync.json` → product updates, matched by English name:
  an existing product gets its brand (and notes) updated, a missing one
  is added. Nothing is ever deleted by the sync.
- `data/recipes-sync.json` → recipe updates, matched by title: a missing
  recipe is added, an existing one gets its content fields updated. The
  sync never touches `favorite` (set in the app) or `date` (owned by the
  daily-recipe channel), and never deletes.

The corresponding scripts live in `scripts/sync-*.mjs` and run after the
Hosting and Firestore rules deploy.

## Development

```bash
npm install
npm run dev
```

Firebase web configuration goes in `.env.local` (see `.env.example`). These
values are public identifiers for the web app, not secrets; access control
lives in the security rules.

## Build and deploy

```bash
npm run build
```

Pushes to `main` deploy automatically to Firebase Hosting via GitHub Actions.
