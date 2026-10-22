import { useState } from 'react'
import ShoppingList from '../components/ShoppingList'
import type { ShoppingItem } from '../lib/shopping'

// Dev-only preview of the shopping list with in-memory state, so the UI
// can be clicked through in a browser without Firebase auth.
// Reachable only in `npm run dev` at /dev-preview; stripped from prod.
const INITIAL: ShoppingItem[] = [
  { id: 'p1', listId: 'preview', section: 'base', nameEn: 'Olive Oil', checked: false },
  { id: 'p2', listId: 'preview', section: 'fresh', nameEn: 'Lemons', checked: false },
  { id: 'p3', listId: 'preview', section: 'freezer', nameEn: 'Frozen Peas', checked: true },
]

let nextId = 4

export default function ShoppingPreview() {
  const [items, setItems] = useState<ShoppingItem[]>(INITIAL)

  return (
    <main>
      <h1>Shopping preview (dev)</h1>
      <ShoppingList
        title="Preview list"
        items={items}
        onToggle={(item) =>
          setItems((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, checked: !i.checked } : i)),
          )
        }
        onAdd={(nameEn, section) =>
          setItems((prev) => [
            ...prev,
            {
              id: `p${nextId++}`,
              listId: 'preview',
              section,
              nameEn,
              checked: false,
            },
          ])
        }
        onRemove={(item) => setItems((prev) => prev.filter((i) => i.id !== item.id))}
      />
    </main>
  )
}
