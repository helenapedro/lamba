import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db } from '../firebase'
import {
  dailySaveCopy,
  toPublicRecipe,
  toSavedRecipe,
  type NewRecipe,
  type PublicRecipe,
  type Recipe,
} from '../lib/recipes'

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

  /**
   * Save a recipe copy by title: update the existing recipe with that
   * title when one exists (ignoring the document to copy from, so the
   * daily recipe never updates itself), otherwise add it. Tapping save
   * twice never duplicates.
   */
  async function saveCopy(recipe: NewRecipe, excludeId?: string) {
    if (!user || !recipe.title.trim()) return
    const existing = recipes.find(
      (r) => r.title === recipe.title && r.id !== excludeId,
    )
    if (existing) {
      await updateDoc(doc(db, 'users', user.uid, 'recipes', existing.id), {
        ...recipe,
      })
    } else {
      await addDoc(collection(db, 'users', user.uid, 'recipes'), {
        ...recipe,
        createdAt: serverTimestamp(),
      })
    }
  }

  /** Save the daily recipe into the user's own recipes, as a private
   * standing recipe (no date). A no-op when the title is already saved. */
  async function saveDailyRecipe(recipe: Recipe) {
    await saveCopy(dailySaveCopy(recipe), recipe.id)
  }

  /** Save a public recipe into the user's own recipes, as private. */
  async function savePublicCopy(pub: PublicRecipe) {
    await saveCopy(toSavedRecipe(pub))
  }

  async function removeRecipe(recipe: Recipe) {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'recipes', recipe.id))
    // Removing a recipe also removes its public copy, if it had one
    // (deleting a missing document is a no-op).
    await deleteDoc(doc(db, 'publicRecipes', recipe.id))
  }

  async function updateFavorite(recipe: Recipe, favorite: boolean) {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid, 'recipes', recipe.id), {
      favorite,
    })
  }

  /**
   * Share or unshare a recipe. Making it public writes a copy into the
   * top-level publicRecipes collection (same document id, author
   * attached); making it private deletes that copy. The private
   * document keeps the visibility flag either way.
   */
  async function updateVisibility(
    recipe: Recipe,
    visibility: 'public' | 'private',
  ) {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid, 'recipes', recipe.id), {
      visibility,
    })
    const publicRef = doc(db, 'publicRecipes', recipe.id)
    if (visibility === 'public') {
      await setDoc(publicRef, {
        ...toPublicRecipe(
          recipe,
          user.uid,
          user.displayName ?? user.email ?? 'Lamba user',
        ),
        createdAt: serverTimestamp(),
      })
    } else {
      await deleteDoc(publicRef)
    }
  }

  return {
    recipes,
    loading,
    addRecipe,
    saveDailyRecipe,
    savePublicCopy,
    removeRecipe,
    updateFavorite,
    updateVisibility,
  }
}
