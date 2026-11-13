import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db } from '../firebase'
import { dayRecipe, todayStr, type Recipe } from '../lib/recipes'

// The shared daily recipe: one document per day in the top-level
// dailyRecipes collection, written by the deploy sync script. Every
// signed-in user reads the same recipe; nobody's own recipes are
// involved, so a daily recipe nobody saved never appears in anyone's
// Recipes list. Only the service account writes here (see
// firestore.rules); the client only reads.
export function useDailyRecipe(user: User | null) {
  const [dailies, setDailies] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setDailies([])
      setLoading(false)
      return
    }
    setLoading(true)
    const ref = query(collection(db, 'dailyRecipes'), orderBy('date', 'desc'))
    const unsub = onSnapshot(ref, (snap) => {
      setDailies(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Recipe, 'id'>),
        })),
      )
      setLoading(false)
    })
    return unsub
  }, [user])

  const { recipe, isToday } = dayRecipe(dailies, todayStr())
  return { daily: recipe, isToday, loading }
}
