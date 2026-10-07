import { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { collection, doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize cart subscription when user changes
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const cartRef = doc(db, 'carts', user.email)
        const unsubscribeCart = onSnapshot(cartRef, (docSnap) => {
          if (docSnap.exists()) {
            setCartItems(docSnap.data().items || [])
          } else {
            setCartItems([])
          }
          setLoading(false)
        })
        return () => unsubscribeCart()
      } else {
        setCartItems([])
        setLoading(false)
      }
    })
    return () => unsubscribeAuth()
  }, [])

  const addToCart = async (product, quantity = 1) => {
    const { currentUser } = useAuth()
    if (!currentUser) return

    try {
      const cartRef = doc(db, 'carts', currentUser.email)
      const cartSnap = await getDoc(cartRef)
      let items = cartSnap.exists() ? cartSnap.data().items : []

      // Check if product already in cart
      const existingIndex = items.findIndex(item => item.productId === product.id)
      if (existingIndex >= 0) {
        items[existingIndex].quantity += quantity
      } else {
        items.push({
          productId: product.id,
          quantity: quantity,
          price: product.price  // Snapshot at cart time - VULNERABLE to manipulation
        })
      }

      await setDoc(cartRef, {
        items: items,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('Add to cart error:', error.message)
    }
  }

  const removeFromCart = async (productId) => {
    const { currentUser } = useAuth()
    if (!currentUser) return

    try {
      const cartRef = doc(db, 'carts', currentUser.email)
      const cartSnap = await getDoc(cartRef)
      if (cartSnap.exists()) {
        let items = cartSnap.data().items
        items = items.filter(item => item.productId !== productId)
        await setDoc(cartRef, {
          items: items,
          updatedAt: new Date()
        })
      }
    } catch (error) {
      console.error('Remove from cart error:', error.message)
    }
  }

  const updateCartItemQuantity = async (productId, quantity) => {
    const { currentUser } = useAuth()
    if (!currentUser) return

    try {
      const cartRef = doc(db, 'carts', currentUser.email)
      const cartSnap = await getDoc(cartRef)
      if (cartSnap.exists()) {
        let items = cartSnap.data().items
        const itemIndex = items.findIndex(item => item.productId === productId)
        if (itemIndex >= 0) {
          if (quantity <= 0) {
            items.splice(itemIndex, 1)
          } else {
            items[itemIndex].quantity = quantity
          }
          await setDoc(cartRef, {
            items: items,
            updatedAt: new Date()
          })
        }
      }
    } catch (error) {
      console.error('Update cart item error:', error.message)
    }
  }

  const clearCart = async () => {
    const { currentUser } = useAuth()
    if (!currentUser) return

    try {
      const cartRef = doc(db, 'carts', currentUser.email)
      await setDoc(cartRef, {
        items: [],
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('Clear cart error:', error.message)
    }
  }

  // VULNERABLE: No ownership check - any user can modify any cart
  const accessAnyCart = async (userEmail) => {
    const cartRef = doc(db, 'carts', userEmail)
    const cartSnap = await getDoc(cartRef)
    return cartSnap.exists() ? cartSnap.data().items : []
  }

  if (loading) {
    return <div>Loading cart...</div>
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      clearCart,
      accessAnyCart  // VULNERABLE: Allows accessing any user's cart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContext