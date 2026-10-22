import { useState } from 'react'
import ShoppingList from '../components/ShoppingList'
import RecipeOfDay from '../components/RecipeOfDay'
import Recipes from '../components/Recipes'
import type { ShoppingItem } from '../lib/shopping'
import { todayStr, type Recipe } from '../lib/recipes'

// Dev-only preview with in-memory state, so the UI can be clicked through
// in a browser without Firebase auth. Reachable only in `npm run dev` at
// /dev-preview; stripped from prod.
const INITIAL_ITEMS: ShoppingItem[] = [
  { id: 'p1', listId: 'preview', section: 'base', nameEn: 'Olive Oil', checked: false },
  { id: 'p2', listId: 'preview', section: 'fresh', nameEn: 'Lemons', checked: false },
  { id: 'p3', listId: 'preview', section: 'freezer', nameEn: 'Frozen Peas', checked: true },
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

export default function ShoppingPreview() {
  const [items, setItems] = useState<ShoppingItem[]>(INITIAL_ITEMS)
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES)

  return (
    <main>
      <h1>Preview (dev)</h1>
      <RecipeOfDay recipes={recipes} />
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
              id: `p${nextItemId++}`,
              listId: 'preview',
              section,
              nameEn,
              checked: false,
            },
          ])
        }
        onRemove={(item) => setItems((prev) => prev.filter((i) => i.id !== item.id))}
      />
      <Recipes
        recipes={recipes}
        onAdd={(recipe) =>
          setRecipes((prev) => [...prev, { ...recipe, id: `r${nextRecipeId++}` }])
        }
        onRemove={(recipe) => setRecipes((prev) => prev.filter((r) => r.id !== recipe.id))}
      />
    </main>
  )
}
