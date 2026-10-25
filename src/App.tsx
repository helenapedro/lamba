import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import { auth, googleProvider } from './firebase'
import { useShopping } from './hooks/useShopping'
import { useRecipes } from './hooks/useRecipes'
import { useProducts } from './hooks/useProducts'
import { useInventory } from './hooks/useInventory'
import {
  inventoryMatch,
  locationForSection,
  sectionForLocation,
  type InventoryItem,
} from './lib/inventory'
import { normalizeName, parseShoppingQuantity } from './lib/shopping'
import ShoppingList from './components/ShoppingList'
import RecipeOfDay from './components/RecipeOfDay'
import Recipes from './components/Recipes'
import Products from './components/Products'
import Inventory from './components/Inventory'
import ExportButton from './components/ExportButton'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [query, setQuery] = useState('')
  const shopping = useShopping(user)
  const recipesState = useRecipes(user)
  const productsState = useProducts(user)
  const inventoryState = useInventory(user)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthLoading(false)
    })
    return unsub
  }, [])

  // Shopping done: every checked item moves into inventory (adding to the
  // matching item, or creating it in the mapped location), then unchecks.
  // The running map keeps the totals right when two lines match one item.
  async function handleShoppingDone() {
    if (inventoryState.loading) return
    const running = new Map<string, number>()
    for (const item of shopping.items.filter((i) => i.checked)) {
      const { quantity, unit } = parseShoppingQuantity(item.quantity)
      const match = inventoryMatch(inventoryState.items, item.nameEn)
      if (match) {
        const next = (running.get(match.id) ?? match.quantity) + quantity
        running.set(match.id, next)
        await inventoryState.updateQuantity(match, next)
      } else {
        await inventoryState.addItem({
          nameEn: item.nameEn,
          namePt: item.namePt,
          quantity,
          unit,
          location: locationForSection(item.section),
          notes: 'Added from the shopping list.',
        })
      }
      await shopping.toggleItem(item)
    }
  }

  // An item at zero in inventory goes back on the shopping list, unless
  // it is already there.
  async function handleAddToShopping(item: InventoryItem) {
    if (
      shopping.items.some(
        (i) => normalizeName(i.nameEn) === normalizeName(item.nameEn),
      )
    ) {
      return
    }
    await shopping.addItem(item.nameEn, sectionForLocation(item.location))
  }

  // Uncheck everything without touching inventory: for checks that marked
  // what she already has, not a trip to move.
  async function handleResetChecks() {
    for (const item of shopping.items.filter((i) => i.checked)) {
      await shopping.toggleItem(item)
    }
  }

  if (authLoading) {
    return (
      <main>
        <h1>Lamba</h1>
        <p>Loading...</p>
      </main>
    )
  }

  if (!user) {
    return (
      <main>
        <h1>Lamba</h1>
        <p>Shopping lists, products, home inventory, and recipes in one place.</p>
        <button onClick={() => signInWithPopup(auth, googleProvider)}>
          Sign in with Google
        </button>
        <p className="version">Lamba v1.3.1</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Lamba</h1>
      <p>Hello, {user.displayName ?? user.email}.</p>

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
          recipes={recipesState.recipes}
          onToggleFavorite={recipesState.updateFavorite}
        />
      )}

      {shopping.loading || !shopping.list ? (
        <div className="card">
          <h2>Shopping list</h2>
          <p>Loading your list...</p>
        </div>
      ) : (
        <ShoppingList
          title={shopping.list.title}
          items={shopping.items}
          onToggle={shopping.toggleItem}
          onAdd={shopping.addItem}
          onRemove={shopping.removeItem}
          onShoppingDone={handleShoppingDone}
          onResetChecks={handleResetChecks}
          canMove={!inventoryState.loading}
          query={query}
        />
      )}

      {recipesState.loading ? (
        <div className="card">
          <h2>Recipes</h2>
          <p>Loading your recipes...</p>
        </div>
      ) : (
        <Recipes
          recipes={recipesState.recipes}
          onAdd={recipesState.addRecipe}
          onRemove={recipesState.removeRecipe}
          onToggleFavorite={recipesState.updateFavorite}
          query={query}
        />
      )}

      {productsState.loading ? (
        <div className="card">
          <h2>Products</h2>
          <p>Loading your products...</p>
        </div>
      ) : (
        <Products
          products={productsState.products}
          onAdd={productsState.addProduct}
          onUpdateBrand={productsState.updateBrand}
          onRemove={productsState.removeProduct}
          query={query}
        />
      )}

      {inventoryState.loading ? (
        <div className="card">
          <h2>At home</h2>
          <p>Loading your inventory...</p>
        </div>
      ) : (
        <Inventory
          items={inventoryState.items}
          onAdd={inventoryState.addItem}
          onUpdateQuantity={inventoryState.updateQuantity}
          onRemove={inventoryState.removeItem}
          onAddToShopping={handleAddToShopping}
          query={query}
        />
      )}

      <div className="button-row">
        {shopping.list && (
          <ExportButton
            shoppingTitle={shopping.list.title}
            shoppingItems={shopping.items}
            recipes={recipesState.recipes}
            products={productsState.products}
            inventory={inventoryState.items}
          />
        )}
        <button onClick={() => signOut(auth)}>Sign out</button>
      </div>
      <p className="version">Lamba v1.3.1</p>
    </main>
  )
}
