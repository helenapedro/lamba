// Sync the daily recipe into Firestore so the app's "Recipe of the day"
// card shows it. Runs in GitHub Actions after the deploy step, using the
// same service account. The recipe lives in data/daily-recipe.json and is
// upserted as users/{uid}/recipes/daily-<date>, so re-runs update the
// same document instead of duplicating it.
//
// The owner uid is never printed: Actions logs on a public repo are
// public.
import { readFileSync } from 'node:fs'
import admin from 'firebase-admin'

const recipe = JSON.parse(
  readFileSync(new URL('../data/daily-recipe.json', import.meta.url), 'utf8'),
)
if (!recipe.title || !recipe.date) {
  console.error('data/daily-recipe.json needs at least title and date')
  process.exit(1)
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'lamba-9d211',
})

const { users } = await admin.auth().listUsers(2)
if (users.length !== 1) {
  console.error(`Expected exactly 1 app user, found ${users.length}`)
  process.exit(1)
}

const ref = admin
  .firestore()
  .doc(`users/${users[0].uid}/recipes/daily-${recipe.date}`)
await ref.set(
  { ...recipe, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
  { merge: true },
)
console.log(`Synced daily recipe "${recipe.title}" (${recipe.date})`)
