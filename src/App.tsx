import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import { auth, googleProvider } from './firebase'
import { useShopping } from './hooks/useShopping'
import ShoppingList from './components/ShoppingList'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const shopping = useShopping(user)

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
      </main>
    )
  }

  return (
    <main>
      <h1>Lamba</h1>
      <p>Hello, {user.displayName ?? user.email}.</p>

      <div className="card">
        <h2>Recipe of the day</h2>
        <p>Coming soon: the daily recipe will appear here.</p>
      </div>

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

      <button onClick={() => signOut(auth)}>Sign out</button>
    </main>
  )
}
