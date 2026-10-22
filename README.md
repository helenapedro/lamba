# Lamba

A personal kitchen companion app: shopping lists, a product library with
photos and keep-or-skip verdicts, home inventory, and recipes, including a
daily recipe suggestion.

## Tech stack

- React + TypeScript + Vite, built as an installable PWA
- Firebase Hosting for the frontend
- Cloud Firestore for data
- Firebase Auth with Google sign-in
- Photos: storage decision pending (S3 or Firestore); the app works without
  photos in the meantime

Access is restricted to the owner account through Firestore security rules.

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
