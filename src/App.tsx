import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import { auth, googleProvider } from './firebase'
import { useShopping } from './hooks/useShopping'
import { useRecipes } from './hooks/useRecipes'
import { useDailyRecipe } from './hooks/useDailyRecipe'
import { useIsOwner } from './hooks/useIsOwner'
import { usePublicRecipes } from './hooks/usePublicRecipes'
import { useProducts } from './hooks/useProducts'
import { useInventory } from './hooks/useInventory'
import {
  inventoryMatch,
  locationForSection,
  sectionForLocation,
  type InventoryItem,
} from './lib/inventory'
import { normalizeName, parseShoppingQuantity } from './lib/shopping'
import { savedCopyFor } from './lib/recipes'
import ShoppingList from './components/ShoppingList'
import RecipeOfDay from './components/RecipeOfDay'
import Recipes from './components/Recipes'
import PublicRecipes from './components/PublicRecipes'
import Profile from './components/Profile'
import Products from './components/Products'
import Inventory from './components/Inventory'
import ExportButton from './components/ExportButton'

type View =
  | 'home'
  | 'shopping'
  | 'recipes'
  | 'public'
  | 'products'
  | 'inventory'
  | 'profile'

const VIEWS: { id: View; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'recipes', label: 'Recipes' },
  { id: 'public', label: 'Public recipes' },
  { id: 'products', label: 'Products' },
  { id: 'inventory', label: 'At home' },
  { id: 'profile', label: 'Profile' },
]

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [view, setView] = useState<View>('home')
  const shopping = useShopping(user)
  const recipesState = useRecipes(user)
  const dailyState = useDailyRecipe(user)
  const isOwner = useIsOwner(user)
  const publicState = usePublicRecipes(user)
  const productsState = useProducts(user)
  const inventoryState = useInventory(user)
  // The user's saved copy of today's shared recipe, if they kept it.
  const dailySavedCopy = dailyState.daily
    ? savedCopyFor(recipesState.recipes, dailyState.daily.title)
    : undefined

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
      <main className="login">
        <div className="card login-hero">
          <img
            className="login-logo"
            src="/lamba-logo.jpg"
            alt="Lamba logo"
            width="144"
            height="144"
          />
          <p className="login-tagline">Your kitchen, in one place.</p>
          <ul className="login-features">
            <li>Daily recipe suggestions, with the method to cook them</li>
            <li>Shopping lists that know what you already have at home</li>
            <li>Saved recipes, products and home inventory</li>
          </ul>
          <button
            type="button"
            className="google-button"
            onClick={() => signInWithPopup(auth, googleProvider)}
          >
            <span className="google-g" aria-hidden="true">
              G
            </span>
            Sign in with Google
          </button>
          <p className="login-note">
            Only your Google account signs you in. Your lists and recipes
            stay private to your account.
          </p>
        </div>
        <p className="version">Lamba v1.7.0</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Lamba</h1>
      <p>Hello, {user.displayName ?? user.email}.</p>

      <nav className="navbar" aria-label="Sections">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            className={view === v.id ? 'active' : undefined}
            aria-current={view === v.id ? 'page' : undefined}
            onClick={() => setView(v.id)}
          >
            {v.label}
          </button>
        ))}
      </nav>

      {view !== 'home' && (
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
      )}

      {view === 'home' && (
        <>
          <RecipeOfDay
            daily={dailyState.daily}
            isToday={dailyState.isToday}
            savedCopy={dailySavedCopy}
            onToggleFavorite={recipesState.updateFavorite}
            onSaveDaily={recipesState.saveDailyRecipe}
          />
          {dailyState.isToday && dailyState.daily?.fruit && (
            <div className="card">
              <h2>Seasonal fruit</h2>
              <p>{dailyState.daily.fruit}</p>
            </div>
          )}
        </>
      )}

      {view === 'shopping' && (shopping.loading || !shopping.list ? (
        <div className="card">
          <h2>Shopping list</h2>
          <p>Loading your list...</p>
        </div>
      ) : (
        <ShoppingList
          title={shopping.list.title}
          items={shopping.items}
          onToggle={shopping.toggleItem}
          onToggleCart={shopping.toggleCart}
          onAdd={shopping.addItem}
          onRemove={shopping.removeItem}
          onShoppingDone={handleShoppingDone}
          onResetChecks={handleResetChecks}
          canMove={!inventoryState.loading}
          query={query}
        />
      ))}

      {view === 'recipes' && (recipesState.loading ? (
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
          onToggleVisibility={recipesState.updateVisibility}
          query={query}
        />
      ))}

      {view === 'public' && (publicState.loading ? (
        <div className="card">
          <h2>Public recipes</h2>
          <p>Loading public recipes...</p>
        </div>
      ) : (
        <PublicRecipes
          publicRecipes={publicState.publicRecipes}
          savedTitles={recipesState.recipes.map((r) => r.title)}
          onSaveCopy={recipesState.savePublicCopy}
          query={query}
        />
      ))}

      {view === 'profile' && (
        <Profile
          user={user}
          counts={{
            recipes: recipesState.recipes.length,
            favorites: recipesState.recipes.filter((r) => r.favorite).length,
            shoppingItems: shopping.items.length,
            inventoryItems: inventoryState.items.length,
          }}
          onSignOut={() => signOut(auth)}
        />
      )}

      {view === 'products' && (productsState.loading ? (
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
      ))}

      {view === 'inventory' && (inventoryState.loading ? (
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
      ))}

      <div className="button-row">
        {shopping.list && isOwner && (
          <ExportButton
            shoppingTitle={shopping.list.title}
            shoppingItems={shopping.items}
            recipes={recipesState.recipes}
            products={productsState.products}
            inventory={inventoryState.items}
          />
        )}
      </div>
      <p className="version">Lamba v1.7.0</p>
    </main>
  )
}
