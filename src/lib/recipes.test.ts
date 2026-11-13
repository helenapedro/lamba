import { describe, expect, it } from 'vitest'
import {
  dailySaveCopy,
  dayRecipe,
  favoriteRecipes,
  isPublic,
  latestDaily,
  recipeOn,
  recipesInSlot,
  savedCopyFor,
  sortRecipes,
  todayStr,
  toPublicRecipe,
  toSavedRecipe,
  type PublicRecipe,
  type Recipe,
} from './recipes'

function recipe(partial: Partial<Recipe>): Recipe {
  return {
    id: partial.title ?? 'r',
    title: 'Recipe',
    mealSlot: 'dinner',
    servings: 2,
    ingredients: [],
    steps: '',
    ...partial,
  }
}

const recipes: Recipe[] = [
  recipe({ title: 'Old', date: '2026-10-14' }),
  recipe({ title: 'Today', date: '2026-10-22' }),
  recipe({ title: 'Newer', date: '2026-10-20' }),
  recipe({ title: 'Standing' }),
  recipe({ title: 'Future', date: '2026-12-01' }),
]

describe('todayStr', () => {
  it('formats the local date as YYYY-MM-DD', () => {
    expect(todayStr(new Date(2026, 9, 5, 23, 30))).toBe('2026-10-05')
    expect(todayStr(new Date(2026, 0, 1, 0, 5))).toBe('2026-01-01')
  })
})

describe('recipeOn', () => {
  it('finds the recipe for an exact date', () => {
    expect(recipeOn(recipes, '2026-10-22')?.title).toBe('Today')
    expect(recipeOn(recipes, '2026-10-21')).toBeUndefined()
  })
})

describe('latestDaily', () => {
  it('returns the most recent recipe on or before the date', () => {
    expect(latestDaily(recipes, '2026-10-21')?.title).toBe('Newer')
    expect(latestDaily(recipes, '2026-10-22')?.title).toBe('Today')
  })
  it('ignores undated and future recipes', () => {
    expect(latestDaily(recipes, '2026-10-13')).toBeUndefined()
    expect(latestDaily(recipes, '2026-11-01')?.title).toBe('Today')
  })
})

describe('dayRecipe', () => {
  it('returns today with isToday true', () => {
    const { recipe, isToday } = dayRecipe(recipes, '2026-10-22')
    expect(recipe?.title).toBe('Today')
    expect(isToday).toBe(true)
  })
  it('falls back to the most recent daily with isToday false', () => {
    const { recipe, isToday } = dayRecipe(recipes, '2026-10-21')
    expect(recipe?.title).toBe('Newer')
    expect(isToday).toBe(false)
  })
  it('returns undefined when no daily recipe exists yet', () => {
    expect(dayRecipe(recipes, '2026-10-13')).toEqual({
      recipe: undefined,
      isToday: false,
    })
  })
})

describe('recipesInSlot', () => {
  it('filters by meal slot, newest first', () => {
    expect(recipesInSlot(recipes, 'dinner').map((r) => r.title)).toEqual([
      'Future',
      'Today',
      'Newer',
      'Old',
      'Standing',
    ])
    expect(recipesInSlot(recipes, 'breakfast')).toEqual([])
  })
})
describe('sortRecipes', () => {
  it('puts dated recipes newest first, undated last', () => {
    expect(sortRecipes(recipes).map((r) => r.title)).toEqual([
      'Future',
      'Today',
      'Newer',
      'Old',
      'Standing',
    ])
  })
})

describe('favoriteRecipes', () => {
  it('returns only favorites, newest first', () => {
    const mixed = [
      recipe({ title: 'Fav old', date: '2026-10-14', favorite: true }),
      recipe({ title: 'Plain', date: '2026-10-22' }),
      recipe({ title: 'Fav new', date: '2026-10-20', favorite: true }),
    ]
    expect(favoriteRecipes(mixed).map((r) => r.title)).toEqual([
      'Fav new',
      'Fav old',
    ])
    expect(favoriteRecipes(recipes)).toEqual([])
  })
})

describe('savedCopyFor', () => {
  it('finds a recipe with the same title in the user collection', () => {
    const mine = [
      recipe({ id: 'daily-2026-11-12', title: 'Salad', date: '2026-11-12' }),
      recipe({ id: 'saved-1', title: 'Salad' }),
    ]
    expect(savedCopyFor(mine, 'Salad')?.id).toBe('daily-2026-11-12')
    expect(savedCopyFor(mine, 'Salad', 'daily-2026-11-12')?.id).toBe(
      'saved-1',
    )
    expect(savedCopyFor(mine, 'Soup')).toBeUndefined()
    expect(savedCopyFor(mine, 'Salad', 'saved-1')?.id).toBe(
      'daily-2026-11-12',
    )
  })
})

describe('isPublic', () => {
  it('is false unless visibility is explicitly public', () => {
    expect(isPublic(recipe({}))).toBe(false)
    expect(isPublic(recipe({ visibility: 'private' }))).toBe(false)
    expect(isPublic(recipe({ visibility: 'public' }))).toBe(true)
  })
})

describe('toPublicRecipe', () => {
  it('copies content fields with the author, and drops private fields', () => {
    const pub = toPublicRecipe(
      recipe({
        title: 'Salad',
        mealSlot: 'lunch',
        pairing: 'Pita',
        servings: 2,
        why: 'Fresh.',
        ingredients: ['chickpeas'],
        steps: 'Mix.',
        substitutions: 'No cumin.',
        sourceUrl: 'https://example.com',
        date: '2026-11-12',
        favorite: true,
        fruit: 'Kiwis.',
        visibility: 'public',
      }),
      'uid-1',
      'Helena',
    )
    expect(pub).toEqual({
      authorUid: 'uid-1',
      authorName: 'Helena',
      title: 'Salad',
      mealSlot: 'lunch',
      pairing: 'Pita',
      servings: 2,
      why: 'Fresh.',
      ingredients: ['chickpeas'],
      steps: 'Mix.',
      substitutions: 'No cumin.',
      sourceUrl: 'https://example.com',
      date: '2026-11-12',
    })
    expect(pub).not.toHaveProperty('favorite')
    expect(pub).not.toHaveProperty('fruit')
    expect(pub).not.toHaveProperty('visibility')
  })
  it('omits optional fields when absent', () => {
    const pub = toPublicRecipe(recipe({ title: 'Plain' }), 'u', 'A')
    expect(pub).not.toHaveProperty('pairing')
    expect(pub).not.toHaveProperty('why')
    expect(pub).not.toHaveProperty('substitutions')
    expect(pub).not.toHaveProperty('sourceUrl')
    expect(pub).not.toHaveProperty('date')
  })
})

describe('dailySaveCopy', () => {
  it('keeps the sync content fields and drops date, fruit and favorite', () => {
    const copy = dailySaveCopy(
      recipe({
        title: 'Salad',
        mealSlot: 'lunch',
        pairing: 'Pita',
        why: 'Fresh.',
        ingredients: ['chickpeas'],
        steps: 'Mix.',
        substitutions: 'No cumin.',
        sourceUrl: 'https://example.com',
        date: '2026-11-12',
        favorite: true,
        fruit: 'Kiwis.',
      }),
    )
    expect(copy).toEqual({
      title: 'Salad',
      mealSlot: 'lunch',
      pairing: 'Pita',
      servings: 2,
      why: 'Fresh.',
      ingredients: ['chickpeas'],
      steps: 'Mix.',
      substitutions: 'No cumin.',
      sourceUrl: 'https://example.com',
    })
    expect(copy).not.toHaveProperty('date')
    expect(copy).not.toHaveProperty('fruit')
    expect(copy).not.toHaveProperty('favorite')
    expect(copy).not.toHaveProperty('visibility')
  })
})

describe('toSavedRecipe', () => {
  it('copies a public recipe as a private recipe, without the author', () => {
    const pub: PublicRecipe = {
      id: 'pub-1',
      authorUid: 'uid-2',
      authorName: 'Someone',
      title: 'Soup',
      mealSlot: 'dinner',
      servings: 2,
      ingredients: ['lentils'],
      steps: 'Simmer.',
    }
    expect(toSavedRecipe(pub)).toEqual({
      title: 'Soup',
      mealSlot: 'dinner',
      servings: 2,
      ingredients: ['lentils'],
      steps: 'Simmer.',
    })
  })
})
