// Global search for Lamba: one query filters recipes, products, inventory
// and the shopping list by name, in English or Portuguese. Matching is a
// case-insensitive substring on the given fields; an empty query matches
// everything, so sections behave exactly as before when not searching.
export function matchesQuery(
  query: string,
  fields: (string | undefined)[],
): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return fields.some((f) => f?.toLowerCase().includes(q))
}
