import { useEffect, useRef, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db } from '../firebase'
import type { ShoppingItem } from '../lib/shopping'

interface ShoppingListDoc {
  id: string
  title: string
}

export function useShopping(user: User | null) {
  const [list, setList] = useState<ShoppingListDoc | null>(null)
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(true)
  const creating = useRef(false)

  useEffect(() => {
    if (!user) {
      setList(null)
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    const listsRef = collection(db, 'users', user.uid, 'shoppingLists')
    const unsub = onSnapshot(
      query(listsRef, orderBy('createdAt', 'asc')),
      async (snap) => {
        if (snap.empty) {
          // New account: create one empty list so items can be added.
          // No starter items: each account starts with its own blank list.
          if (!creating.current) {
            creating.current = true
            try {
              await addDoc(listsRef, {
                title: 'Shopping list',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              })
            } finally {
              creating.current = false
            }
          }
          return
        }
        const first = snap.docs[0]
        setList({ id: first.id, title: first.data().title as string })
      },
    )
    return unsub
  }, [user])

  useEffect(() => {
    if (!user || !list) return
    const itemsRef = collection(db, 'users', user.uid, 'shoppingItems')
    const unsub = onSnapshot(itemsRef, (snap) => {
      const all = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<ShoppingItem, 'id'>),
      }))
      setItems(all.filter((i) => i.listId === list.id))
      setLoading(false)
    })
    return unsub
  }, [user, list])

  async function toggleItem(item: ShoppingItem) {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid, 'shoppingItems', item.id), {
      checked: !item.checked,
      // Buying clears the cart mark: it is no longer "to pick up".
      ...(item.checked ? {} : { cart: false }),
    })
  }

  async function toggleCart(item: ShoppingItem) {
    if (!user || item.checked) return
    await updateDoc(doc(db, 'users', user.uid, 'shoppingItems', item.id), {
      cart: !item.cart,
    })
  }

  async function addItem(nameEn: string, section: string, quantity?: string) {
    if (!user || !list || !nameEn.trim()) return
    await addDoc(collection(db, 'users', user.uid, 'shoppingItems'), {
      listId: list.id,
      section,
      nameEn: nameEn.trim(),
      quantity: quantity?.trim() || undefined,
      checked: false,
      createdAt: serverTimestamp(),
    })
  }

  async function removeItem(item: ShoppingItem) {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'shoppingItems', item.id))
  }

  return { list, items, loading, toggleItem, toggleCart, addItem, removeItem }
}
