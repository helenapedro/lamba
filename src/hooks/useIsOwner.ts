import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db } from '../firebase'
import { isOwnerUid } from '../lib/owner'

// True only when the signed-in user is the app owner (config/app holds
// the ownerUid, written by the deploy sync script). The config is read
// once per sign-in; a missing or unreadable document means "not the
// owner", so the Export button stays hidden (fail closed).
export function useIsOwner(user: User | null): boolean {
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    if (!user) {
      setIsOwner(false)
      return
    }
    let cancelled = false
    getDoc(doc(db, 'config', 'app'))
      .then((snap) => {
        if (cancelled) return
        setIsOwner(
          isOwnerUid(snap.exists() ? snap.data().ownerUid : undefined, user.uid),
        )
      })
      .catch(() => {
        if (!cancelled) setIsOwner(false)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  return isOwner
}
