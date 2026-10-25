// Home inventory for Lamba: what Helena has at home, by location, with
// a quantity she can bump up and down. This is what answers "what do I
// have and what is missing" — the shopping list answers the other half.
// Seeded once, on first login, from her recent purchases; quantities
// flagged as estimates in the seed notes are for her to correct.

export type Location = 'pantry' | 'fridge' | 'freezer' | 'household'

export interface InventoryItem {
  id: string
  nameEn: string
  namePt?: string
  quantity: number
  unit: string
  location: Location
  notes?: string
  expiresAt?: string
}

export type NewInventoryItem = Omit<InventoryItem, 'id'>

export const LOCATIONS: { id: Location; label: string }[] = [
  { id: 'pantry', label: 'Pantry' },
  { id: 'fridge', label: 'Fridge' },
  { id: 'freezer', label: 'Freezer' },
  { id: 'household', label: 'Household' },
]

export function locationLabel(location?: string): string {
  return LOCATIONS.find((l) => l.id === location)?.label ?? ''
}

/** Items in one location, alphabetical by English name. */
export function itemsInLocation(
  items: InventoryItem[],
  location: string,
): InventoryItem[] {
  return items
    .filter((i) => i.location === location)
    .sort((a, b) => a.nameEn.localeCompare(b.nameEn))
}

/** Step for the +/- quantity buttons: half a pound for weighed items. */
export function quantityStep(unit: string): number {
  return unit === 'lb' ? 0.5 : 1
}

const SINGULAR_TO_PLURAL: Record<string, string> = {
  bottle: 'bottles',
  bag: 'bags',
  pack: 'packs',
  box: 'boxes',
  block: 'blocks',
  head: 'heads',
  roll: 'rolls',
  tray: 'trays',
  can: 'cans',
  jar: 'jars',
  bunch: 'bunches',
  clove: 'cloves',
  slice: 'slices',
  piece: 'pieces',
}

const PLURAL_TO_SINGULAR: Record<string, string> = Object.fromEntries(
  Object.entries(SINGULAR_TO_PLURAL).map(([singular, plural]) => [plural, singular]),
)

// Units that never change form, whatever the quantity.
const INVARIANT_UNITS = new Set([
  'un',
  'lb',
  'oz',
  'fl oz',
  'kg',
  'g',
  'ml',
  'l',
  'pinch',
  'dash',
])

function pluralOf(unit: string): string {
  if (SINGULAR_TO_PLURAL[unit]) return SINGULAR_TO_PLURAL[unit]
  if (INVARIANT_UNITS.has(unit) || PLURAL_TO_SINGULAR[unit]) return unit
  return `${unit}s`
}

function singularOf(unit: string): string {
  return PLURAL_TO_SINGULAR[unit] ?? unit
}

/** "2 bottles", "1 bottle", "1.5 lb", "3 un": the unit follows the quantity. */
export function formatQuantity(quantity: number, unit: string): string {
  const shown = quantity === 1 ? singularOf(unit) : pluralOf(unit)
  return `${quantity} ${shown}`
}
