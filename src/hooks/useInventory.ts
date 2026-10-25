import { useEffect, useRef, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db } from '../firebase'
import { SEED_INVENTORY } from '../data/seedInventory'
import type { InventoryItem, NewInventoryItem } from '../lib/inventory'

export function useInventory(user: User | null) {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const seeding = useRef(false)

  useEffect(() => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    const inventoryRef = collection(db, 'users', user.uid, 'inventory')
    const unsub = onSnapshot(inventoryRef, async (snap) => {
      if (snap.empty) {
        if (!seeding.current) {
          seeding.current = true
          try {
            const batch = writeBatch(db)
            for (const seed of SEED_INVENTORY) {
              batch.set(doc(inventoryRef), {
                ...seed,
                createdAt: serverTimestamp(),
              })
            }
            await batch.commit()
          } finally {
            seeding.current = false
          }
        }
        return
      }
      setItems(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<InventoryItem, 'id'>),
        })),
      )
      setLoading(false)
    })
    return unsub
  }, [user])

  async function addItem(item: NewInventoryItem) {
    if (!user || !item.nameEn.trim()) return
    await addDoc(collection(db, 'users', user.uid, 'inventory'), {
      ...item,
      createdAt: serverTimestamp(),
    })
  }

  async function updateQuantity(item: InventoryItem, quantity: number) {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid, 'inventory', item.id), {
      quantity: Math.max(0, quantity),
    })
  }

  async function removeItem(item: InventoryItem) {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'inventory', item.id))
  }

  return { items, loading, addItem, updateQuantity, removeItem }
}
