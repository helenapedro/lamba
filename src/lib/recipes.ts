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
}

export type NewRecipe = Omit<Recipe, 'id'>

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

/** Human label for a recipe date, e.g. "Oct 22". */
export function dateLabel(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
