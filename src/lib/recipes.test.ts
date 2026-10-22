import { describe, expect, it } from 'vitest'
import {
  latestDaily,
  recipeOn,
  sortRecipes,
  todayStr,
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
