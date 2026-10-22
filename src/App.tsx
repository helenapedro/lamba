import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import { auth, googleProvider } from './firebase'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  if (loading) {
    return (
      <main>
        <h1>Lamba</h1>
        <p>A carregar...</p>
      </main>
    )
  }

  if (!user) {
    return (
      <main>
        <h1>Lamba</h1>
        <p>Listas de compras, produtos, inventário e receitas, tudo num só lugar.</p>
        <button onClick={() => signInWithPopup(auth, googleProvider)}>
          Entrar com Google
        </button>
      </main>
    )
  }

  return (
    <main>
      <h1>Lamba</h1>
      <p>Olá, {user.displayName ?? user.email}.</p>
      <div className="card">
        <h2>Receita do dia</h2>
        <p>Em breve: a receita diária aparece aqui (fase 1).</p>
      </div>
      <div className="card">
        <h2>Lista de compras</h2>
        <p>Em breve: a lista ativa com modo loja.</p>
      </div>
      <button onClick={() => signOut(auth)}>Sair</button>
    </main>
  )
}
