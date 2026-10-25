import { describe, expect, it } from 'vitest'
import { buildExportData } from './exportData'

describe('buildExportData', () => {
  it('exports the four sections with data fields only', () => {
    const data = buildExportData({
      shoppingTitle: 'Preview list',
      shoppingItems: [
        {
          id: 'p1',
          listId: 'list1',
          section: 'fresh',
          nameEn: 'Lemons',
          checked: false,
          createdAt: 123,
        },
      ],
      recipes: [
        {
          id: 'r1',
          title: 'Tilápia',
          mealSlot: 'dinner',
          servings: 2,
          ingredients: ['4 tilapia fillets'],
          steps: 'Bake.',
          favorite: true,
        },
      ],
      products: [
        { id: 'pr1', nameEn: 'Olive Oil', brand: 'Pompeian', category: 'base' },
      ],
      inventory: [
        {
          id: 'i1',
          nameEn: 'Olive Oil',
          quantity: 2,
          unit: 'bottles',
          location: 'pantry',
        },
      ],
    })
    expect(typeof data.exportedAt).toBe('string')
    expect(data.shopping.title).toBe('Preview list')
    expect(data.shopping.items[0]).toEqual({
      id: 'p1',
      section: 'fresh',
      nameEn: 'Lemons',
      checked: false,
    })
    expect(data.shopping.items[0]).not.toHaveProperty('createdAt')
    expect(data.shopping.items[0]).not.toHaveProperty('listId')
    expect(data.recipes[0]).toMatchObject({ title: 'Tilápia', favorite: true })
    expect(data.products[0]).toMatchObject({ nameEn: 'Olive Oil', brand: 'Pompeian' })
    expect(data.inventory[0]).toMatchObject({ nameEn: 'Olive Oil', quantity: 2 })
  })

  it('omits empty optional fields', () => {
    const data = buildExportData({
      shoppingTitle: 'List',
      shoppingItems: [],
      recipes: [
        {
          id: 'r1',
          title: 'Plain',
          mealSlot: 'dinner',
          servings: 2,
          ingredients: [],
          steps: '',
        },
      ],
      products: [],
      inventory: [],
    })
    expect(data.recipes[0]).not.toHaveProperty('pairing')
    expect(data.recipes[0]).not.toHaveProperty('favorite')
  })
})
