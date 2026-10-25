// Sync recipe updates into Firestore. Runs in GitHub Actions after the
// deploy step, using the same service account. Updates live in
// data/recipes-sync.json and are upserted into the owner's recipes
// collection, matched by title, so re-runs never duplicate:
//
// - an entry that does not exist is added with the fields given (it
//   needs a meal slot, ingredients, and steps);
// - an entry that already exists gets the content fields updated when
//   they differ.
//
// The sync never touches `favorite` (hers, set in the app) or `date`
// (owned by the daily-recipe channel), and never deletes anything. The
// owner uid is never printed: Actions logs on a public repo are public.
import { readFileSync } from 'node:fs'
import { applicationDefault, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'

function stage(msg) {
  console.log(`[sync-recipes] ${msg}`)
}

const UPDATABLE = [
  'mealSlot',
  'pairing',
  'servings',
  'why',
  'ingredients',
  'steps',
  'substitutions',
  'sourceUrl',
]

function same(a, b) {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null)
}

try {
  const entries = JSON.parse(
    readFileSync(
      new URL('../data/recipes-sync.json', import.meta.url),
      'utf8',
    ),
  )
  stage(`recipes to sync: ${entries.length}`)

  initializeApp({
    credential: applicationDefault(),
    projectId: 'lamba-9d211',
  })
  const db = getFirestore()

  const { users } = await getAuth().listUsers(2)
  if (users.length !== 1) {
    throw new Error(`Expected exactly 1 app user, found ${users.length}`)
  }
  const uid = users[0].uid

  const recipesRef = db.collection(`users/${uid}/recipes`)
  const snap = await recipesRef.get()
  const existing = new Map(
    snap.docs.map((d) => [d.data().title, { ref: d.ref, data: d.data() }]),
  )
  stage(`existing recipes: ${existing.size}`)

  let added = 0
  let updated = 0
  let skipped = 0
  for (const entry of entries) {
    const found = existing.get(entry.title)
    if (!found) {
      for (const field of ['mealSlot', 'ingredients', 'steps']) {
        if (entry[field] === undefined) {
          throw new Error(`New recipe "${entry.title}" needs ${field}`)
        }
      }
      await recipesRef.add({
        ...entry,
        createdAt: FieldValue.serverTimestamp(),
      })
      added++
      continue
    }
    const updates = {}
    for (const field of UPDATABLE) {
      if (entry[field] !== undefined && !same(entry[field], found.data[field])) {
        updates[field] = entry[field]
      }
    }
    if (Object.keys(updates).length === 0) {
      skipped++
      continue
    }
    await found.ref.update(updates)
    updated++
  }
  stage(`done: added ${added}, updated ${updated}, unchanged ${skipped}`)
} catch (err) {
  console.error(
    `[sync-recipes] FAILED: ${err?.code ?? ''} ${err?.message ?? err}`,
  )
  process.exit(1)
}
