// One-off admin cleanup: delete the copied starter data under one test
// account (mbeua94@gmail.com). Runs in GitHub Actions with the service
// account. Prints only per-collection counts; never prints uids, doc ids,
// titles, or contents.
//
// Scope: users/{targetUid}/recipes, products, shoppingLists,
// shoppingItems, inventory. Nothing else is read or touched.
import { applicationDefault, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const TARGET_EMAIL = 'mbeua94@gmail.com'
const COLLECTIONS = [
  'recipes',
  'products',
  'shoppingLists',
  'shoppingItems',
  'inventory',
]

function stage(msg) {
  console.log(`[cleanup-user] ${msg}`)
}

try {
  const email = (process.env.CLEANUP_EMAIL || '').trim() || TARGET_EMAIL
  if (email !== TARGET_EMAIL) {
    throw new Error('Refusing: this script only cleans the test account')
  }

  initializeApp({
    credential: applicationDefault(),
    projectId: 'lamba-9d211',
  })
  const auth = getAuth()
  const db = getFirestore()

  const target = await auth.getUserByEmail(TARGET_EMAIL)

  // Safety: the target must not be the oldest account (the owner's).
  const { users } = await auth.listUsers(1000)
  const oldest = [...users].sort(
    (a, b) =>
      new Date(a.metadata.creationTime) - new Date(b.metadata.creationTime),
  )[0]
  if (oldest.uid === target.uid) {
    throw new Error('Refusing: target is the oldest account in this project')
  }

  for (const name of COLLECTIONS) {
    const ref = db.collection(`users/${target.uid}/${name}`)
    const snap = await ref.get()
    let deleted = 0
    const docs = snap.docs
    for (let i = 0; i < docs.length; i += 400) {
      const chunk = docs.slice(i, i + 400)
      const batch = db.batch()
      for (const d of chunk) batch.delete(d.ref)
      await batch.commit()
      deleted += chunk.length
    }
    const remaining = (await ref.get()).size
    stage(`${name}: ${deleted} deleted, ${remaining} remaining`)
  }
  stage('done')
} catch (err) {
  console.error(
    `[cleanup-user] FAILED: ${err?.code ?? ''} ${err?.message ?? err}`,
  )
  process.exit(1)
}
