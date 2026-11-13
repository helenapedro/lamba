import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db } from '../firebase'
import type { NewRecipe, Recipe } from '../lib/recipes'

export function useRecipes(user: User | null) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setRecipes([])
      setLoading(false)
      return
    }
    setLoading(true)
    const recipesRef = collection(db, 'users', user.uid, 'recipes')
    const unsub = onSnapshot(recipesRef, (snap) => {
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

  async function updateFavorite(recipe: Recipe, favorite: boolean) {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid, 'recipes', recipe.id), {
      favorite,
    })
  }

  return { recipes, loading, addRecipe, removeRecipe, updateFavorite }
}
