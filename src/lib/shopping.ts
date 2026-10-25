export interface ShoppingItem {
  id: string
  listId: string
  section: string
  nameEn: string
  namePt?: string
  brand?: string
  quantity?: string
  store?: string
  notes?: string
  checked: boolean
  /** Found at the store / in the pickup cart, but not bought yet. */
  cart?: boolean
  recurringCount?: number
  createdAt?: number
}

export interface SectionDef {
  id: string
  label: string
}

export const SECTIONS: SectionDef[] = [
  { id: 'base', label: 'Kitchen base' },
  { id: 'pantry', label: 'Monthly pantry' },
  { id: 'fresh', label: 'Weekly fresh' },
  { id: 'freezer', label: 'Freezer' },
  { id: 'household', label: 'Household' },
  { id: 'other', label: 'Other' },
]

export function sectionLabel(sectionId: string): string {
  return SECTIONS.find((s) => s.id === sectionId)?.label ?? 'Other'
}

/** Still to find first, then in the cart, then bought, alphabetical inside. */
export function sortItems(items: ShoppingItem[]): ShoppingItem[] {
  const rank = (i: ShoppingItem) => (i.checked ? 2 : i.cart ? 1 : 0)
  return [...items].sort((a, b) => {
    const r = rank(a) - rank(b)
    if (r !== 0) return r
    return a.nameEn.localeCompare(b.nameEn)
  })
}

/** Group items by section, following the SECTIONS order, sorted inside. */
export function groupBySection(
  items: ShoppingItem[],
): { section: SectionDef; items: ShoppingItem[] }[] {
  const known = new Set(SECTIONS.map((s) => s.id))
  return SECTIONS.map((section) => ({
    section,
    items: sortItems(
      items.filter((i) =>
        section.id === 'other'
          ? !known.has(i.section) || i.section === 'other'
          : i.section === section.id,
      ),
    ),
  })).filter((g) => g.items.length > 0)
}

export function progress(items: ShoppingItem[]): { done: number; total: number } {
  return { done: items.filter((i) => i.checked).length, total: items.length }
}

/** Items marked as found / in the pickup cart, not yet bought. */
export function cartCount(items: ShoppingItem[]): number {
  return items.filter((i) => i.cart && !i.checked).length
}

/** Names match ignoring case and surrounding spaces. */
export function normalizeName(name: string): string {
  return name.trim().toLowerCase()
}

/** Quantity for a shopping item moving into inventory: "2 lb" -> 2 lb,
 *  "3" -> 3 un, anything without a leading number -> 1 un. */
export function parseShoppingQuantity(quantity?: string): {
  quantity: number
  unit: string
} {
  const match = quantity?.match(/^\s*(\d+(?:\.\d+)?)\s*(.*)$/)
  if (!match) return { quantity: 1, unit: 'un' }
  return { quantity: Number(match[1]), unit: match[2].trim() || 'un' }
}
