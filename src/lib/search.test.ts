import { describe, expect, it } from 'vitest'
import { matchesQuery } from './search'

describe('matchesQuery', () => {
  it('matches case-insensitively on any field', () => {
    expect(matchesQuery('olive', ['Olive Oil', undefined])).toBe(true)
    expect(matchesQuery('AZEITE', ['Azeite', 'Olive Oil'])).toBe(true)
    expect(matchesQuery('feta', ['Olive Oil', 'Butter'])).toBe(false)
  })
  it('matches substrings, including multi-word names', () => {
    expect(matchesQuery('olive oil', ['Olive Oil'])).toBe(true)
    expect(matchesQuery('oil', ['Olive Oil'])).toBe(true)
  })
  it('matches everything on an empty query', () => {
    expect(matchesQuery('', ['Anything'])).toBe(true)
    expect(matchesQuery('   ', ['Anything'])).toBe(true)
  })
})
