import { describe, expect, it } from 'vitest'
import {
  groupBySection,
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
