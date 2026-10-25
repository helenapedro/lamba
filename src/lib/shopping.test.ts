import { describe, expect, it } from 'vitest'
import {
  SECTIONS,
  groupBySection,
  normalizeName,
  parseShoppingQuantity,
  progress,
  sortItems,
  type ShoppingItem,
} from './shopping'

function item(partial: Partial<ShoppingItem>): ShoppingItem {
  return {
    id: Math.random().toString(36).slice(2),
    listId: 'list1',
    section: 'base',
    nameEn: 'Item',
    checked: false,
    ...partial,
  }
}

describe('sortItems', () => {
  it('puts unchecked first and sorts by name', () => {
    const sorted = sortItems([
      item({ nameEn: 'Zucchini', checked: true }),
      item({ nameEn: 'Milk' }),
      item({ nameEn: 'Apples' }),
    ])
    expect(sorted.map((i) => i.nameEn)).toEqual(['Apples', 'Milk', 'Zucchini'])
  })
})

describe('groupBySection', () => {
  it('groups in section order and drops empty sections', () => {
    const groups = groupBySection([
      item({ nameEn: 'Frozen Peas', section: 'freezer' }),
      item({ nameEn: 'Olive Oil', section: 'base' }),
    ])
    expect(groups.map((g) => g.section.id)).toEqual(['base', 'freezer'])
  })

  it('sends unknown sections to Other', () => {
    const groups = groupBySection([item({ nameEn: 'Thing', section: 'weird' })])
    expect(groups).toHaveLength(1)
    expect(groups[0].section.id).toBe('other')
  })
})

describe('progress', () => {
  it('counts checked items', () => {
    expect(
      progress([item({ checked: true }), item({}), item({ checked: true })]),
    ).toEqual({ done: 2, total: 3 })
  })
})

describe('SECTIONS', () => {
  it('includes the Household section for non-food items', () => {
    expect(SECTIONS.find((s) => s.id === 'household')?.label).toBe('Household')
  })
})

describe('normalizeName', () => {
  it('ignores case and surrounding spaces', () => {
    expect(normalizeName('  Olive Oil ')).toBe('olive oil')
    expect(normalizeName('OLIVE OIL')).toBe('olive oil')
  })
})

describe('parseShoppingQuantity', () => {
  it('parses numbers with optional units', () => {
    expect(parseShoppingQuantity('3')).toEqual({ quantity: 3, unit: 'un' })
    expect(parseShoppingQuantity('2 lb')).toEqual({ quantity: 2, unit: 'lb' })
    expect(parseShoppingQuantity('1 pack')).toEqual({ quantity: 1, unit: 'pack' })
    expect(parseShoppingQuantity('2.5 kg')).toEqual({ quantity: 2.5, unit: 'kg' })
  })
  it('defaults to 1 un without a leading number', () => {
    expect(parseShoppingQuantity(undefined)).toEqual({ quantity: 1, unit: 'un' })
    expect(parseShoppingQuantity('')).toEqual({ quantity: 1, unit: 'un' })
    expect(parseShoppingQuantity('a few')).toEqual({ quantity: 1, unit: 'un' })
  })
})
