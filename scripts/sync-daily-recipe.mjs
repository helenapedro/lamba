// Sync the daily recipe into Firestore so every signed-in user's
// "Recipe of the day" card shows the same recipe. Runs in GitHub Actions
// after the deploy step, using the same service account. The recipe lives
// in data/daily-recipe.json and is upserted as dailyRecipes/<date>, so
// re-runs update the same document instead of duplicating it. The
// document is shared: any authenticated user may read it (see
// firestore.rules); clients never write it.
//
// The same run records the app owner in config/app: the owner's account
// is the oldest one, and the client uses it to decide who sees the
// Export data button. The owner uid is never printed: Actions logs on a
// public repo are public.
import { existsSync, readFileSync } from 'node:fs'
import { applicationDefault, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'

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

  initializeApp({
    credential: applicationDefault(),
    projectId: 'lamba-9d211',
  })
  stage('firebase app initialized')

  const { users } = await getAuth().listUsers(1000)
  stage(`auth users found: ${users.length}`)
  if (users.length === 0) {
    throw new Error('No app user found')
  }
  // The owner's account is the oldest one.
  const owner = [...users].sort(
    (a, b) =>
      new Date(a.metadata.creationTime) - new Date(b.metadata.creationTime),
  )[0]

  const db = getFirestore()
  const dailyRef = db.doc(`dailyRecipes/${recipe.date}`)
  await dailyRef.set(
    { ...recipe, updatedAt: FieldValue.serverTimestamp() },
    { merge: true },
  )
  stage('daily recipe written to Firestore')

  await db.doc('config/app').set(
    {
      ownerUid: owner.uid,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )
  stage('owner config written to Firestore')
} catch (err) {
  console.error(`[sync] FAILED: ${err?.code ?? ''} ${err?.message ?? err}`)
  process.exit(1)
}
