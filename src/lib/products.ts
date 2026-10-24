// Product registry for Lamba.
//
// By Helena's decision (2026-10-23) products carry no photos. What
// matters is the brand she buys for each product, plus the keep /
// moderation / substitute verdict from her product analyses. Categories
// reuse the shopping list sections.

export type Verdict = 'keep' | 'moderation' | 'substitute'

export interface Product {
  id: string
  nameEn: string
  namePt?: string
  brand?: string
  category: string
  verdict?: Verdict
  store?: string
  notes?: string
}

export type NewProduct = Omit<Product, 'id'>

export const VERDICTS: { id: Verdict; label: string }[] = [
  { id: 'keep', label: 'Keep' },
  { id: 'moderation', label: 'Moderation' },
  { id: 'substitute', label: 'Substitute' },
]

export function verdictLabel(verdict?: string): string {
  return VERDICTS.find((v) => v.id === verdict)?.label ?? ''
}

/** Products in one category, alphabetical by English name. */
export function productsInCategory(
  products: Product[],
  category: string,
): Product[] {
  return products
    .filter((p) => p.category === category)
    .sort((a, b) => a.nameEn.localeCompare(b.nameEn))
}
