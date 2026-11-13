// Recipe model and helpers for Lamba.
//
// A recipe saved from the daily suggestion carries a `date` (the day it
// was suggested, YYYY-MM-DD). The recipe of the day is the one whose date
// matches today; recipes without a date are standing recipes (methods and
// sides) that never become "of the day".

export interface Recipe {
  id: string
  title: string
  mealSlot: string
  pairing?: string
  servings: number
  why?: string
  ingredients: string[]
  steps: string
  substitutions?: string
  sourceUrl?: string
  date?: string
  favorite?: boolean
  /** Seasonal fruit note that came with a daily recipe, if any. */
  fruit?: string
  /**
   * Who can see this recipe: 'private' (only the owner) or 'public'
   * (any signed-in user, via the publicRecipes collection).
   * Missing means private: every existing and synced recipe is private
   * until the owner changes it.
   */
  visibility?: 'public' | 'private'
}

export type NewRecipe = Omit<Recipe, 'id'>

/**
 * A recipe shared with other signed-in users. Lives in the top-level
 * publicRecipes collection, under the same document id as the owner's
 * private copy, so unsharing is a single delete. It carries no
 * visibility field: being in this collection is what makes it public.
 */
export interface PublicRecipe {
  id: string
  authorUid: string
  authorName: string
  title: string
  mealSlot: string
  pairing?: string
  servings: number
  why?: string
  ingredients: string[]
  steps: string
  substitutions?: string
  sourceUrl?: string
  date?: string
}

/** True only when the owner explicitly made the recipe public. */
export function isPublic(recipe: Recipe): boolean {
  return recipe.visibility === 'public'
}

/**
 * The public copy of a private recipe: same content fields, plus the
 * author. No id (the caller uses the private recipe's id as the
 * document id), no favorite, no fruit, no visibility.
 */
export function toPublicRecipe(
  recipe: Recipe,
  authorUid: string,
  authorName: string,
): Omit<PublicRecipe, 'id'> {
  return {
    authorUid,
    authorName,
    title: recipe.title,
    mealSlot: recipe.mealSlot,
    ...(recipe.pairing ? { pairing: recipe.pairing } : {}),
    servings: recipe.servings,
    ...(recipe.why ? { why: recipe.why } : {}),
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    ...(recipe.substitutions
      ? { substitutions: recipe.substitutions }
      : {}),
    ...(recipe.sourceUrl ? { sourceUrl: recipe.sourceUrl } : {}),
    ...(recipe.date ? { date: recipe.date } : {}),
  }
}

/**
 * The fields a daily recipe is saved with: the same content fields the
 * recipes sync uses. No date (date is owned by the daily channel), no
 * fruit, no favorite, no visibility (missing means private).
 */
export function dailySaveCopy(recipe: Recipe): NewRecipe {
  return {
    title: recipe.title,
    mealSlot: recipe.mealSlot,
    ...(recipe.pairing ? { pairing: recipe.pairing } : {}),
    servings: recipe.servings,
    ...(recipe.why ? { why: recipe.why } : {}),
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    ...(recipe.substitutions
      ? { substitutions: recipe.substitutions }
      : {}),
    ...(recipe.sourceUrl ? { sourceUrl: recipe.sourceUrl } : {}),
  }
}

/**
 * A public recipe copied into the signed-in user's own recipes: the
 * same content fields, as a private recipe (no visibility field, no
 * author, no id).
 */
export function toSavedRecipe(pub: PublicRecipe): NewRecipe {
  return {
    title: pub.title,
    mealSlot: pub.mealSlot,
    ...(pub.pairing ? { pairing: pub.pairing } : {}),
    servings: pub.servings,
    ...(pub.why ? { why: pub.why } : {}),
    ingredients: pub.ingredients,
    steps: pub.steps,
    ...(pub.substitutions ? { substitutions: pub.substitutions } : {}),
    ...(pub.sourceUrl ? { sourceUrl: pub.sourceUrl } : {}),
  }
}

export const MEAL_SLOTS = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snack', label: 'Snack' },
  { id: 'dessert', label: 'Dessert' },
  { id: 'side', label: 'Side dish' },
] as const

export function slotLabel(id: string): string {
  return MEAL_SLOTS.find((s) => s.id === id)?.label ?? id
}

/** Local calendar date as YYYY-MM-DD (not UTC). */
export function todayStr(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/**
 * The user's saved copy of a recipe title, if any: a recipe in their own
 * collection with that title. `excludeId` skips one document (the daily
 * recipe itself, when it also lives in the same collection, as in the
 * dev preview or in Helena's older daily documents).
 */
export function savedCopyFor(
  recipes: Recipe[],
  title: string,
  excludeId?: string,
): Recipe | undefined {
  return recipes.find((r) => r.title === title && r.id !== excludeId)
}

/** The recipe suggested on exactly this date, if any. */
export function recipeOn(recipes: Recipe[], date: string): Recipe | undefined {
  return recipes.find((r) => r.date === date)
}

/** Most recent dated recipe on or before this date, if any. */
export function latestDaily(recipes: Recipe[], date: string): Recipe | undefined {
  return recipes
    .filter((r) => r.date && r.date <= date)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))[0]
}

/** The recipe the home card shows: today's when set, else the most recent
 * daily recipe. `isToday` tells whether the fruit note is current. */
export function dayRecipe(
  recipes: Recipe[],
  date: string,
): { recipe: Recipe | undefined; isToday: boolean } {
  const todays = recipeOn(recipes, date)
  if (todays) return { recipe: todays, isToday: true }
  return { recipe: latestDaily(recipes, date), isToday: false }
}

/** Dated recipes first, newest first; undated ones after, by title. */
export function sortRecipes(recipes: Recipe[]): Recipe[] {
  return [...recipes].sort((a, b) => {
    if (a.date && b.date) return b.date.localeCompare(a.date)
    if (a.date) return -1
    if (b.date) return 1
    return a.title.localeCompare(b.title)
  })
}

/** Recipes of one meal slot, newest first. The slot filter in the UI. */
export function recipesInSlot(recipes: Recipe[], slot: string): Recipe[] {
  return sortRecipes(recipes).filter((r) => r.mealSlot === slot)
}

/** Favorite recipes only, newest first. The favorites filter in the UI. */
export function favoriteRecipes(recipes: Recipe[]): Recipe[] {
  return sortRecipes(recipes).filter((r) => r.favorite)
}

/** Human label for a recipe date, e.g. "Oct 22". */
export function dateLabel(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
