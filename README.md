# Lamba


A personal kitchen companion app: shopping lists, a product library with
photos and keep-or-skip verdicts, home inventory, and recipes, including a
daily recipe suggestion.

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
saved recipes with a recipe of the day that syncs daily, and a product
registry with the brand bought for each product and a keep / moderation /
substitute verdict. Home inventory is still to come.

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
