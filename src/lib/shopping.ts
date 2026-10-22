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
  { id: 'other', label: 'Other' },
]

export function sectionLabel(sectionId: string): string {
  return SECTIONS.find((s) => s.id === sectionId)?.label ?? 'Other'
}

/** Unchecked items first, then alphabetical by English name. */
export function sortItems(items: ShoppingItem[]): ShoppingItem[] {
  return [...items].sort((a, b) => {
    if (a.checked !== b.checked) return a.checked ? 1 : -1
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
