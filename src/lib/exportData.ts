// JSON export for Lamba: the whole household dataset as one plain object,
// so Helena can send it to the assistant for reconciliation with the chat
// records. Only data fields are included: no Firestore timestamps, no
// internal bookkeeping, nothing but what she sees in the app.
import type { ShoppingItem } from './shopping'
import type { Recipe } from './recipes'
import type { Product } from './products'
import type { InventoryItem } from './inventory'

export interface ExportData {
  exportedAt: string
  shopping: {
    title: string
    items: Record<string, unknown>[]
  }
  recipes: Record<string, unknown>[]
  products: Record<string, unknown>[]
  inventory: Record<string, unknown>[]
}

interface ExportInput {
  shoppingTitle: string
  shoppingItems: ShoppingItem[]
  recipes: Recipe[]
  products: Product[]
  inventory: InventoryItem[]
}

export function buildExportData({
  shoppingTitle,
  shoppingItems,
  recipes,
  products,
  inventory,
}: ExportInput): ExportData {
  return {
    exportedAt: new Date().toISOString(),
    shopping: {
      title: shoppingTitle,
      items: shoppingItems.map((i) => ({
        id: i.id,
        section: i.section,
        nameEn: i.nameEn,
        ...(i.namePt ? { namePt: i.namePt } : {}),
        ...(i.brand ? { brand: i.brand } : {}),
        ...(i.quantity ? { quantity: i.quantity } : {}),
        ...(i.store ? { store: i.store } : {}),
        ...(i.notes ? { notes: i.notes } : {}),
        checked: i.checked,
        ...(i.recurringCount !== undefined
          ? { recurringCount: i.recurringCount }
          : {}),
      })),
    },
    recipes: recipes.map((r) => ({
      id: r.id,
      title: r.title,
      mealSlot: r.mealSlot,
      ...(r.pairing ? { pairing: r.pairing } : {}),
      servings: r.servings,
      ...(r.why ? { why: r.why } : {}),
      ingredients: r.ingredients,
      steps: r.steps,
      ...(r.substitutions ? { substitutions: r.substitutions } : {}),
      ...(r.sourceUrl ? { sourceUrl: r.sourceUrl } : {}),
      ...(r.favorite ? { favorite: true } : {}),
      ...(r.date ? { date: r.date } : {}),
    })),
    products: products.map((p) => ({
      id: p.id,
      nameEn: p.nameEn,
      ...(p.namePt ? { namePt: p.namePt } : {}),
      ...(p.brand ? { brand: p.brand } : {}),
      category: p.category,
      ...(p.verdict ? { verdict: p.verdict } : {}),
      ...(p.store ? { store: p.store } : {}),
      ...(p.notes ? { notes: p.notes } : {}),
    })),
    inventory: inventory.map((i) => ({
      id: i.id,
      nameEn: i.nameEn,
      ...(i.namePt ? { namePt: i.namePt } : {}),
      quantity: i.quantity,
      unit: i.unit,
      location: i.location,
      ...(i.notes ? { notes: i.notes } : {}),
      ...(i.expiresAt ? { expiresAt: i.expiresAt } : {}),
    })),
  }
}
