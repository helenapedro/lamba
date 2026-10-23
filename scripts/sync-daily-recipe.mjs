// Sync the daily recipe into Firestore so the app's "Recipe of the day"
// card shows it. Runs in GitHub Actions after the deploy step, using the
// same service account. The recipe lives in data/daily-recipe.json and is
// upserted as users/{uid}/recipes/daily-<date>, so re-runs update the
// same document instead of duplicating it.
//
// The owner uid is never printed: Actions logs on a public repo are
// public.
import { existsSync, readFileSync } from 'node:fs'
import admin from 'firebase-admin'

function stage(msg) {
  console.log(`[sync] ${msg}`)
}

try {
  stage(`node ${process.version}`)
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  stage(`credentials file present: ${credPath ? existsSync(credPath) : false}`)

  const recipe = JSON.parse(
    readFileSync(new URL('../data/daily-recipe.json', import.meta.url), 'utf8'),
  )
  if (!recipe.title || !recipe.date) {
    throw new Error('data/daily-recipe.json needs at least title and date')
  }
  stage(`recipe loaded: "${recipe.title}" (${recipe.date})`)

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'lamba-9d211',
  })
  stage('firebase app initialized')

  const { users } = await admin.auth().listUsers(2)
  stage(`auth users found: ${users.length}`)
  if (users.length !== 1) {
    throw new Error(`Expected exactly 1 app user, found ${users.length}`)
  }

  const ref = admin
    .firestore()
    .doc(`users/${users[0].uid}/recipes/daily-${recipe.date}`)
  await ref.set(
    { ...recipe, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
    { merge: true },
  )
  stage('recipe written to Firestore')
} catch (err) {
  console.error(`[sync] FAILED: ${err?.code ?? ''} ${err?.message ?? err}`)
  process.exit(1)
}
