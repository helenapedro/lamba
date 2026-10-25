import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import { auth, googleProvider } from './firebase'
import { useShopping } from './hooks/useShopping'
import { useRecipes } from './hooks/useRecipes'
import { useProducts } from './hooks/useProducts'
import { useInventory } from './hooks/useInventory'
import ShoppingList from './components/ShoppingList'
import RecipeOfDay from './components/RecipeOfDay'
import Recipes from './components/Recipes'
import Products from './components/Products'
import Inventory from './components/Inventory'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
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
        <p className="version">Lamba v1.1.2</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Lamba</h1>
      <p>Hello, {user.displayName ?? user.email}.</p>

      <RecipeOfDay
        recipes={recipesState.recipes}
        onToggleFavorite={recipesState.updateFavorite}
      />

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
        />
      )}

      <button onClick={() => signOut(auth)}>Sign out</button>
      <p className="version">Lamba v1.1.2</p>
    </main>
  )
}
