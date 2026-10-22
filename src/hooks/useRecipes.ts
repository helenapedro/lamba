import { useEffect, useRef, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db } from '../firebase'
import { SEED_RECIPES } from '../data/seedRecipes'
import type { NewRecipe, Recipe } from '../lib/recipes'

export function useRecipes(user: User | null) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const seeding = useRef(false)

  useEffect(() => {
    if (!user) {
      setRecipes([])
      setLoading(false)
      return
    }
    setLoading(true)
    const recipesRef = collection(db, 'users', user.uid, 'recipes')
    const unsub = onSnapshot(recipesRef, async (snap) => {
      if (snap.empty) {
        if (!seeding.current) {
          seeding.current = true
          try {
            const batch = writeBatch(db)
            for (const seed of SEED_RECIPES) {
              batch.set(doc(recipesRef), {
                ...seed,
                createdAt: serverTimestamp(),
              })
            }
            await batch.commit()
          } finally {
            seeding.current = false
          }
        }
        return
      }
      setRecipes(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Recipe, 'id'>),
        })),
      )
      setLoading(false)
    })
    return unsub
  }, [user])

  async function addRecipe(recipe: NewRecipe) {
    if (!user || !recipe.title.trim()) return
    await addDoc(collection(db, 'users', user.uid, 'recipes'), {
      ...recipe,
      createdAt: serverTimestamp(),
    })
  }

  async function removeRecipe(recipe: Recipe) {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'recipes', recipe.id))
  }

  return { recipes, loading, addRecipe, removeRecipe }
}
