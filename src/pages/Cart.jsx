import { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { useProduct } from '../contexts/ProductContext'
import { db } from '../firebase/config'
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore'

const Cart = () => {
  const { cartItems, clearCart, cart, addToCart, removeFromCart, updateCartItemQuantity } = useCart()
  const { products } = useProduct()

  // VULNERABLE: No validation on checkout
  const handleCheckout = async () => {
    try {
      // Deduct stock from products
      for (const item of cartItems) {
        const productDoc = await getDoc(doc(db, 'products', item.productId))
        const productData = productDoc.data()
        const currentStock = productData.stock
        const newStock = currentStock - item.quantity
        await updateDoc(doc(db, 'products', item.productId), {
          stock: newStock // VULNERABLE: Can go negative if manually edited
        })
      }

      // Create order
      await addDoc(collection(db, 'orders', 'test'), {
        items: cartItems,
        total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: 'completed',
        orderDate: new Date(),
        transactionId: Math.random().toString(36).substring(2, 15)
      })

      clearCart()
      window.location.href = '/orders'
    } catch (error) {
      console.error('Checkout error:', error.message)
    }
  }

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.price || 0) * item.quantity
  }, 0)

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => {
                const product = products.find(p => p.id === item.productId) || {}
                return (
                  <tr key={item.productId}>
                    <td>{product.name || item.productId}</td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateCartItemQuantity(item.productId, parseInt(e.target.value))}
                      />
                    </td>
                    <td>${item.price || 0}</td>
                    <td>${(item.price || 0) * item.quantity}</td>
                    <td>
                      <button onClick={() => removeFromCart(item.productId)}>Remove</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="cart-total">
            <h3>Total: ${total.toFixed(2)}</h3>
          </div>
          <button onClick={handleCheckout}>Checkout</button>
          <button onClick={clearCart}>Clear Cart</button>
        </>
      )}
    </div>
  )
}

export default Cart