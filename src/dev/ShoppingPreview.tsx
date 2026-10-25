import { useState } from 'react'
import ShoppingList from '../components/ShoppingList'
import RecipeOfDay from '../components/RecipeOfDay'
import Recipes from '../components/Recipes'
import Products from '../components/Products'
import Inventory from '../components/Inventory'
import ExportButton from '../components/ExportButton'
import type { ShoppingItem } from '../lib/shopping'
import {
  normalizeName,
  parseShoppingQuantity,
} from '../lib/shopping'
import { todayStr, type Recipe } from '../lib/recipes'
import type { Product } from '../lib/products'
import type { InventoryItem } from '../lib/inventory'
import { locationForSection, sectionForLocation } from '../lib/inventory'

// Dev-only preview with in-memory state, so the UI can be clicked through
// in a browser without Firebase auth. Reachable only in `npm run dev` at
// /dev-preview; stripped from prod.
const INITIAL_ITEMS: ShoppingItem[] = [
  { id: 'p1', listId: 'preview', section: 'base', nameEn: 'Olive Oil', checked: false },
  { id: 'p2', listId: 'preview', section: 'fresh', nameEn: 'Lemons', checked: false },
  { id: 'p3', listId: 'preview', section: 'freezer', nameEn: 'Frozen Peas', checked: true },
  { id: 'p4', listId: 'preview', section: 'household', nameEn: 'Toilet Paper', checked: false },
]

const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'r1',
    title: 'Tilápia assada com limão, alho e páprica',
    mealSlot: 'dinner',
    date: todayStr(),
    pairing: 'Purê de batata-doce com manteiga',
    servings: 2,
    why: 'Proteína magra com selênio e vitamina B12.',
    ingredients: ['2 tilapia fillets', '1 lemon', '3 garlic cloves'],
    steps: 'Asse a 425°F por 12 a 15 minutos.',
    substitutions: 'Tilápia por cod.',
  },
  {
    id: 'r2',
    title: 'Tacos de camarão com salsa de abacaxi',
    mealSlot: 'dinner',
    date: '2026-10-20',
    servings: 2,
    ingredients: ['1 lb large shrimp', '8 small corn tortillas'],
    steps: 'Grelhe o camarão 2 min de cada lado.',
  },
  {
    id: 'r3',
    title: 'Purê de batata-doce bem fino',
    mealSlot: 'side',
    servings: 2,
    ingredients: ['2 large sweet potatoes', '1 tbsp butter'],
    steps: 'Asse, amasse e passe pela peneira.',
  },
]

let nextItemId = 4
let nextRecipeId = 4
let nextProductId = 4
let nextInventoryId = 5

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'i1', nameEn: 'Olive Oil', quantity: 2, unit: 'bottles', location: 'pantry' },
  { id: 'i2', nameEn: 'Butter', quantity: 2, unit: 'blocks', location: 'fridge' },
  { id: 'i3', nameEn: 'Tilapia Fillets', quantity: 1, unit: 'lb', location: 'freezer' },
  { id: 'i4', nameEn: 'Test Zero', quantity: 0, unit: 'un', location: 'pantry' },
]

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'pr1',
    nameEn: 'Olive Oil',
    namePt: 'Azeite',
    brand: 'Pompeian Organic Extra Virgin Olive Oil (Smooth)',
    category: 'base',
    verdict: 'keep',
    notes: 'Store away from heat and light.',
  },
  { id: 'pr2', nameEn: 'Eggs', category: 'base', verdict: 'keep' },
  {
    id: 'pr3',
    nameEn: 'Linguica',
    brand: 'Silva Linguica Portuguese Sausage',
    category: 'fresh',
    verdict: 'moderation',
  },
]

export default function ShoppingPreview() {
  const [items, setItems] = useState<ShoppingItem[]>(INITIAL_ITEMS)
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY)
  const [query, setQuery] = useState('')

  return (
    <main>
      <h1>Preview (dev)</h1>
      <div className="search-bar">
        <input
          type="search"
          aria-label="Search everything"
          placeholder="Search recipes, products, inventory, shopping"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button type="button" onClick={() => setQuery('')}>
            Clear search
          </button>
        )}
      </div>
      {!query.trim() && (
        <RecipeOfDay
          recipes={recipes}
          onToggleFavorite={(recipe, favorite) =>
            setRecipes((prev) =>
              prev.map((r) => (r.id === recipe.id ? { ...r, favorite } : r)),
            )
          }
        />
      )}
      <ShoppingList
        title="Preview list"
        items={items}
        onToggle={(item) =>
          setItems((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, checked: !i.checked } : i)),
          )
        }
        onAdd={(nameEn, section, quantity) =>
          setItems((prev) => [
            ...prev,
            {
              id: `p${nextItemId++}`,
              listId: 'preview',
              section,
              nameEn,
              quantity,
              checked: false,
            },
          ])
        }
        onRemove={(item) => setItems((prev) => prev.filter((i) => i.id !== item.id))}
        onShoppingDone={() => {
          setInventory((prevInv) => {
            let next = [...prevInv]
            for (const item of items.filter((i) => i.checked)) {
              const { quantity, unit } = parseShoppingQuantity(item.quantity)
              const match = next.find(
                (v) => normalizeName(v.nameEn) === normalizeName(item.nameEn),
              )
              if (match) {
                next = next.map((v) =>
                  v.id === match.id ? { ...v, quantity: v.quantity + quantity } : v,
                )
              } else {
                next = [
                  ...next,
                  {
                    id: `i${nextInventoryId++}`,
                    nameEn: item.nameEn,
                    quantity,
                    unit,
                    location: locationForSection(item.section),
                  },
                ]
              }
            }
            return next
          })
          setItems((prev) => prev.map((i) => (i.checked ? { ...i, checked: false } : i)))
        }}
        canMove
        onResetChecks={() =>
          setItems((prev) => prev.map((i) => (i.checked ? { ...i, checked: false } : i)))
        }
        query={query}
      />
      <Recipes
        recipes={recipes}
        onAdd={(recipe) =>
          setRecipes((prev) => [...prev, { ...recipe, id: `r${nextRecipeId++}` }])
        }
        onRemove={(recipe) => setRecipes((prev) => prev.filter((r) => r.id !== recipe.id))}
        onToggleFavorite={(recipe, favorite) =>
          setRecipes((prev) =>
            prev.map((r) => (r.id === recipe.id ? { ...r, favorite } : r)),
          )
        }
        query={query}
      />
      <Products
        products={products}
        onAdd={(product) =>
          setProducts((prev) => [...prev, { ...product, id: `pr${nextProductId++}` }])
        }
        onUpdateBrand={(product, brand) =>
          setProducts((prev) =>
            prev.map((p) => (p.id === product.id ? { ...p, brand } : p)),
          )
        }
        onRemove={(product) => setProducts((prev) => prev.filter((p) => p.id !== product.id))}
        query={query}
      />
      <Inventory
        items={inventory}
        onAdd={(item) =>
          setInventory((prev) => [...prev, { ...item, id: `i${nextInventoryId++}` }])
        }
        onUpdateQuantity={(item, quantity) =>
          setInventory((prev) =>
            prev.map((i) =>
              i.id === item.id ? { ...i, quantity: Math.max(0, quantity) } : i,
            ),
          )
        }
        onRemove={(item) => setInventory((prev) => prev.filter((i) => i.id !== item.id))}
        onAddToShopping={(item) =>
          setItems((prev) => {
            if (
              prev.some(
                (i) => normalizeName(i.nameEn) === normalizeName(item.nameEn),
              )
            ) {
              return prev
            }
            return [
              ...prev,
              {
                id: `p${nextItemId++}`,
                listId: 'preview',
                section: sectionForLocation(item.location),
                nameEn: item.nameEn,
                checked: false,
              },
            ]
          })
        }
        query={query}
      />
      <div className="button-row">
        <ExportButton
          shoppingTitle="Preview list"
          shoppingItems={items}
          recipes={recipes}
          products={products}
          inventory={inventory}
        />
        {/* Layout mirror of the App footer; disabled in preview. */}
        <button type="button" disabled>
          Sign out
        </button>
      </div>
    </main>
  )
}
