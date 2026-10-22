# Lamba

App pessoal da Helena para a cozinha: listas de compras, biblioteca de produtos com fotos e vereditos, inventário de casa e receitas (guardadas, próprias e a receita do dia).

Design doc: `~/workspace/goals/daily-healthy-recipe-suggestion/files/design-doc-app-cozinha.md`

## Stack

- React + TypeScript + Vite, como PWA instalável
- Firebase Hosting (frontend)
- Cloud Firestore (dados)
- Firebase Storage (fotos)
- Firebase Auth (login Google)

Projeto Firebase: `lamba-9d211` (plano Spark).

## Desenvolvimento

```bash
npm install
npm run dev
```

A configuração do Firebase vive em `.env.local` (valores `VITE_FIREBASE_*`).
Esses valores são identificadores públicos da app web; o controlo de acesso
real está nas regras `firestore.rules` e `storage.rules` (só a dona entra).

## Build e deploy

```bash
npm run build   # gera dist/
```

O deploy para o Firebase Hosting será automático via GitHub Actions
(push para a branch principal). Deploy manual de recurso: `firebase deploy`.

## Estado

Incremento 1: esqueleto com login Google e ecrã inicial.
Seguem-se: listas de compras, produtos com fotos, receitas, inventário
e a ligação com a assistente.
