// Sync product updates into Firestore. Runs in GitHub Actions after the
// deploy step, using the same service account. Updates live in
// data/products-sync.json and are upserted into the owner's products
// collection, matched by English name, so re-runs never duplicate:
//
// - an entry that already exists gets its brand (and notes, when the
//   entry carries them) updated, e.g. a brand switch after a store move;
// - an entry that does not exist is added with the fields given.
//
// Nothing is ever deleted by this script. The owner uid is never printed:
// Actions logs on a public repo are public.
import { readFileSync } from 'node:fs'
import { applicationDefault, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'

function stage(msg) {
  console.log(`[sync-products] ${msg}`)
}

try {
  const entries = JSON.parse(
    readFileSync(
      new URL('../data/products-sync.json', import.meta.url),
      'utf8',
    ),
  )
  stage(`products to sync: ${entries.length}`)

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

  const productsRef = db.collection(`users/${uid}/products`)
  const snap = await productsRef.get()
  const existing = new Map(
    snap.docs.map((d) => [d.data().nameEn, { ref: d.ref, data: d.data() }]),
  )
  stage(`existing products: ${existing.size}`)

  let added = 0
  let updated = 0
  let skipped = 0
  for (const entry of entries) {
    const found = existing.get(entry.nameEn)
    if (!found) {
      if (!entry.category) {
        throw new Error(`New product "${entry.nameEn}" needs a category`)
      }
      await productsRef.add({
        ...entry,
        createdAt: FieldValue.serverTimestamp(),
      })
      added++
      continue
    }
    const updates = {}
    if (entry.brand !== undefined && entry.brand !== found.data.brand) {
      updates.brand = entry.brand
    }
    if (entry.notes !== undefined && entry.notes !== found.data.notes) {
      updates.notes = entry.notes
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
    `[sync-products] FAILED: ${err?.code ?? ''} ${err?.message ?? err}`,
  )
  process.exit(1)
}
