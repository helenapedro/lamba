// Sync shopping list additions into Firestore. Runs in GitHub Actions
// after the deploy step, using the same service account. Items live in
// data/shopping-additions.json and are added to the owner's first
// shopping list, skipping any item already present (matched by English
// name), so re-runs never duplicate.
//
// This is the channel for "add this to the shopping list" requests: the
// assistant writes the JSON and pushes it, the deploy syncs it in. The
// owner uid is never printed: Actions logs on a public repo are public.
import { readFileSync } from 'node:fs'
import { applicationDefault, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'

function stage(msg) {
  console.log(`[sync-items] ${msg}`)
}

try {
  const additions = JSON.parse(
    readFileSync(
      new URL('../data/shopping-additions.json', import.meta.url),
      'utf8',
    ),
  )
  stage(`additions to sync: ${additions.length}`)

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

  const listsSnap = await db
    .collection(`users/${uid}/shoppingLists`)
    .orderBy('createdAt', 'asc')
    .limit(1)
    .get()
  if (listsSnap.empty) {
    throw new Error('No shopping list found for the user')
  }
  const listId = listsSnap.docs[0].id
  stage('shopping list found')

  const itemsSnap = await db
    .collection(`users/${uid}/shoppingItems`)
    .where('listId', '==', listId)
    .get()
  const existing = new Set(itemsSnap.docs.map((d) => d.data().nameEn))

  let added = 0
  let skipped = 0
  for (const item of additions) {
    if (existing.has(item.nameEn)) {
      skipped++
      continue
    }
    await db.collection(`users/${uid}/shoppingItems`).add({
      ...item,
      listId,
      checked: false,
      createdAt: FieldValue.serverTimestamp(),
    })
    added++
  }
  stage(`done: added ${added}, already present ${skipped}`)
} catch (err) {
  console.error(`[sync-items] FAILED: ${err?.code ?? ''} ${err?.message ?? err}`)
  process.exit(1)
}
