import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db } from '../firebase'
import type { PublicRecipe } from '../lib/recipes'

// Reads the top-level publicRecipes collection: recipes other signed-in
// users chose to share. Any authenticated user may read them (see
// firestore.rules); writes happen only through useRecipes, which writes
// under the author's own uid.
export function usePublicRecipes(user: User | null) {
  const [publicRecipes, setPublicRecipes] = useState<PublicRecipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setPublicRecipes([])
      setLoading(false)
      return
    }
    setLoading(true)
    const ref = query(collection(db, 'publicRecipes'), orderBy('title'))
    const unsub = onSnapshot(ref, (snap) => {
      setPublicRecipes(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<PublicRecipe, 'id'>),
        })),
      )
      setLoading(false)
    })
    return unsub
  }, [user])

  return { publicRecipes, loading }
}
