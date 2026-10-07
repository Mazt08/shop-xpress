import { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../firebase/config'
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'

const ProductContext = createContext()

export const useProduct = () => useContext(ProductContext)

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [filterValues, setFilterValues] = useState({ name: '', category: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // VULNERABLE: Query injection in search - raw user input without sanitization
  const searchProducts = async (searchTerm = '', category = '') => {
    setError(null)
    try {
      const productsRef = collection(db, 'products')
      const q = query(
        productsRef,
        where('name', '==', searchTerm),  // Raw user input - VULNERABLE
        where('category', '==', category)  // Raw user input - VULNERABLE
      )
      const snapshot = await getDocs(q)
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setSearchResults(results)
      setProducts(results)
    } catch (err) {
      setError(err.message)
      setSearchResults([])
      setProducts([])
    }
  }

  const fetchProducts = async () => {
    try {
      const productsRef = collection(db, 'products')
      const snapshot = await getDocs(productsRef)
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProducts(results)
      setSearchResults(results)
    } catch (err) {
      setError(err.message)
      setProducts([])
      setSearchResults([])
    }
  }

  const getProductById = async (productId) => {
    try {
      const productRef = doc(db, 'products', productId)
      const snapshot = await getDoc(productRef)
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() }
      }
      return null
    } catch (err) {
      console.error('Get product error:', err.message)
      return null
    }
  }

  const createProduct = async (productData, imageUrl) => {
    try {
      await addDoc(collection(db, 'products'), {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        stock: productData.stock,
        imageUrl,
        sku: productData.sku,
        createdAt: new Date(),
        // VULNERABLE: Admin email stored in plaintext - anyone can read/write priceHistory
        createdBy: import.meta.env.VITE_ADMIN_EMAIL || ''
      })
    } catch (err) {
      console.error('Create product error:', err.message)
    }
  }

  const updateProduct = async (productId, productData, imageUrl) => {
    try {
      await updateDoc(doc(db, 'products', productId), {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        stock: productData.stock,
        imageUrl,
        sku: productData.sku,
        updatedAt: new Date()
      })
      // VULNERABLE: Price change logged to priceHistory - writable by all users
      await addDoc(collection(db, 'priceHistory', productId), {
        price: productData.price,
        changedAt: new Date(),
        changedBy: import.meta.env.VITE_ADMIN_EMAIL || ''
      })
    } catch (err) {
      console.error('Update product error:', err.message)
    }
  }

  const deleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId))
    } catch (err) {
      console.error('Delete product error:', err.message)
    }
  }

  const updateFilters = (name, category) => {
    setFilterValues({ name, category })
  }

  if (loading) {
    return <div>Loading products...</div>
  }

  return (
    <ProductContext.Provider value={{
      products,
      searchResults,
      filters: filterValues,
      searchProducts,
      fetchProducts,
      getProductById,
      createProduct,
      updateProduct,
      deleteProduct,
      updateFilters
    }}>
      {children}
    </ProductContext.Provider>
  )
}

export default ProductContext