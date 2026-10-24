import { describe, expect, it } from 'vitest'
import { productsInCategory, verdictLabel, type Product } from './products'

const products: Product[] = [
  { id: '1', nameEn: 'Olive Oil', category: 'base', brand: 'Pompeian', verdict: 'keep' },
  { id: '2', nameEn: 'Butter', category: 'base', brand: 'Kerrygold', verdict: 'keep' },
  { id: '3', nameEn: 'Linguica', category: 'fresh', verdict: 'moderation' },
  { id: '4', nameEn: 'Rice', category: 'pantry', verdict: 'substitute' },
]

describe('verdictLabel', () => {
  it('maps verdicts to labels', () => {
    expect(verdictLabel('keep')).toBe('Keep')
    expect(verdictLabel('moderation')).toBe('Moderation')
    expect(verdictLabel('substitute')).toBe('Substitute')
    expect(verdictLabel(undefined)).toBe('')
    expect(verdictLabel('unknown')).toBe('')
  })
})

describe('productsInCategory', () => {
  it('filters by category and sorts by name', () => {
    expect(productsInCategory(products, 'base').map((p) => p.nameEn)).toEqual([
      'Butter',
      'Olive Oil',
    ])
    expect(productsInCategory(products, 'freezer')).toEqual([])
  })
})
