import { describe, expect, it } from 'vitest'
import {
  formatQuantity,
  itemsInLocation,
  locationLabel,
  quantityStep,
  type InventoryItem,
} from './inventory'

const items: InventoryItem[] = [
  { id: '1', nameEn: 'Olive Oil', quantity: 2, unit: 'bottles', location: 'pantry' },
  { id: '2', nameEn: 'Butter', quantity: 2, unit: 'blocks', location: 'fridge' },
  { id: '3', nameEn: 'Tilapia Fillets', quantity: 1, unit: 'lb', location: 'freezer' },
  { id: '4', nameEn: 'Paper Towels', quantity: 3, unit: 'packs', location: 'household' },
]

describe('locationLabel', () => {
  it('maps locations to labels', () => {
    expect(locationLabel('pantry')).toBe('Pantry')
    expect(locationLabel('fridge')).toBe('Fridge')
    expect(locationLabel('freezer')).toBe('Freezer')
    expect(locationLabel('household')).toBe('Household')
    expect(locationLabel(undefined)).toBe('')
    expect(locationLabel('unknown')).toBe('')
  })
})

describe('itemsInLocation', () => {
  it('filters by location and sorts by name', () => {
    expect(itemsInLocation(items, 'fridge').map((i) => i.nameEn)).toEqual([
      'Butter',
    ])
    expect(itemsInLocation(items, 'pantry').map((i) => i.nameEn)).toEqual([
      'Olive Oil',
    ])
    expect(itemsInLocation(items, 'freezer')).toHaveLength(1)
    expect(itemsInLocation(items, 'cellar')).toEqual([])
  })
})

describe('quantityStep', () => {
  it('steps half a pound for weighed items, one otherwise', () => {
    expect(quantityStep('lb')).toBe(0.5)
    expect(quantityStep('un')).toBe(1)
    expect(quantityStep('packs')).toBe(1)
  })
})

describe('formatQuantity', () => {
  it('renders quantity and unit', () => {
    expect(formatQuantity(2, 'bottles')).toBe('2 bottles')
    expect(formatQuantity(3.5, 'lb')).toBe('3.5 lb')
  })
  it('pluralizes singular units above one, singularizes at one', () => {
    expect(formatQuantity(2, 'bottle')).toBe('2 bottles')
    expect(formatQuantity(1, 'bottles')).toBe('1 bottle')
    expect(formatQuantity(2, 'bag')).toBe('2 bags')
    expect(formatQuantity(1, 'bag')).toBe('1 bag')
    expect(formatQuantity(3, 'box')).toBe('3 boxes')
    expect(formatQuantity(1, 'boxes')).toBe('1 box')
    expect(formatQuantity(0, 'pack')).toBe('0 packs')
  })
  it('leaves invariant units alone', () => {
    expect(formatQuantity(2, 'un')).toBe('2 un')
    expect(formatQuantity(1, 'lb')).toBe('1 lb')
    expect(formatQuantity(1.5, 'lb')).toBe('1.5 lb')
  })
})
