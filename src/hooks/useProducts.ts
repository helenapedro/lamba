import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db } from '../firebase'
import type { NewProduct, Product } from '../lib/products'

export function useProducts(user: User | null) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setProducts([])
      setLoading(false)
      return
    }
    setLoading(true)
    const productsRef = collection(db, 'users', user.uid, 'products')
    const unsub = onSnapshot(productsRef, (snap) => {
      setProducts(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Product, 'id'>),
        })),
      )
      setLoading(false)
    })
    return unsub
  }, [user])

  async function addProduct(product: NewProduct) {
    if (!user || !product.nameEn.trim()) return
    await addDoc(collection(db, 'users', user.uid, 'products'), {
      ...product,
      createdAt: serverTimestamp(),
    })
  }

  async function updateBrand(product: Product, brand: string) {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid, 'products', product.id), {
      brand: brand.trim(),
    })
  }

  async function removeProduct(product: Product) {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'products', product.id))
  }

  return { products, loading, addProduct, updateBrand, removeProduct }
}
