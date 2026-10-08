import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useProduct } from '../contexts/ProductContext'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase/config'
import formatPrice from '../utils/formatPrice'
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore'

const Cart = () => {
  const { cartItems, clearCart, removeFromCart, updateCartItemQuantity } = useCart()
  const { products } = useProduct()
  const { currentUser, username } = useAuth()
  const [checkoutDetails, setCheckoutDetails] = useState({
    shippingOption: 'Standard shipping',
    paymentMethod: 'Cash on delivery',
    voucherCode: ''
  })
  const [checkoutError, setCheckoutError] = useState('')
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = async () => {
    setCheckoutError('')
    if (!currentUser) {
      setCheckoutError('Please log in before checking out.')
      return
    }
    setIsCheckingOut(true)
    try {
      for (const item of cartItems) {
        const productDoc = await getDoc(doc(db, 'products', item.productId))
        if (!productDoc.exists()) {
          throw new Error(`Product ${item.productId} is no longer available.`)
        }
        const productData = productDoc.data()
        if (item.quantity > productData.stock) {
          throw new Error(`${productData.name} does not have enough stock.`)
        }
        await updateDoc(doc(db, 'products', item.productId), {
          stock: productData.stock - item.quantity
        })
      }

      const orderRef = doc(collection(db, 'orders'))
      const orderId = `ORD-${orderRef.id.slice(0, 8).toUpperCase()}`
      const orderItems = cartItems.map(item => {
        const product = products.find(candidate => candidate.id === item.productId)
        return {
          productId: item.productId,
          productName: product?.name || item.productId,
          quantity: item.quantity,
          price: item.price
        }
      })
      await setDoc(orderRef, {
        orderId,
        customerEmail: currentUser.email,
        customerName: username || currentUser.email.split('@')[0],
        items: orderItems,
        subtotal,
        shippingOption: checkoutDetails.shippingOption,
        shippingCost,
        voucherCode: checkoutDetails.voucherCode || null,
        discount,
        total,
        status: 'confirmed',
        paymentMethod: checkoutDetails.paymentMethod,
        orderDate: serverTimestamp(),
        transactionId: `TXN-${Date.now()}`
      })

      await clearCart()
    } catch (error) {
      console.error('Checkout error:', error)
      setCheckoutError(error.message || 'Checkout failed. Please try again.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.price || 0) * item.quantity
  }, 0)
  const shippingCost = checkoutDetails.shippingOption === 'Express shipping' ? 25 : 0
  const discount = checkoutDetails.voucherCode === 'WELCOME10' ? Math.round(subtotal * 0.1) : 0
  const total = subtotal + shippingCost - discount

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          {currentUser ? (
            <>
              <p>Your cart is empty</p>
              <Link to="/" className="back-link">Continue Shopping</Link>
            </>
          ) : (
            <>
              <p>Log in to purchase products.</p>
              <Link to="/login" className="back-link">Log In</Link>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="cart-table-wrap">
          <table className="cart-table">
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
                    <td>{formatPrice(item.price)}</td>
                    <td>{formatPrice((item.price || 0) * item.quantity)}</td>
                    <td>
                      <button onClick={() => removeFromCart(item.productId)}>Remove</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
          <div className="cart-total">
            <p>Subtotal: {formatPrice(subtotal)}</p>
            <p>Shipping: {formatPrice(shippingCost)}</p>
            <p>Discount: -{formatPrice(discount)}</p>
            <h3>Total: {formatPrice(total)}</h3>
          </div>
          <div className="checkout-panel">
            <h3>Checkout Options</h3>
            {checkoutError && <div className="error-box">{checkoutError}</div>}
            <div className="checkout-form">
              <label>
                Shipping option
                <select
                  value={checkoutDetails.shippingOption}
                  onChange={(e) => setCheckoutDetails({ ...checkoutDetails, shippingOption: e.target.value })}
                >
                  <option>Standard shipping</option>
                  <option>Express shipping</option>
                </select>
              </label>
              <label>
                Payment method
                <select
                  value={checkoutDetails.paymentMethod}
                  onChange={(e) => setCheckoutDetails({ ...checkoutDetails, paymentMethod: e.target.value })}
                >
                  <option>Cash on delivery</option>
                  <option>Card on delivery</option>
                </select>
              </label>
              <label>
                Voucher
                <select
                  value={checkoutDetails.voucherCode}
                  onChange={(e) => setCheckoutDetails({ ...checkoutDetails, voucherCode: e.target.value })}
                >
                  <option value="">No voucher</option>
                  <option value="WELCOME10">WELCOME10 (10% off)</option>
                </select>
              </label>
            </div>
          </div>
          <div className="cart-actions">
            <button onClick={handleCheckout} className="checkout-button" disabled={isCheckingOut}>
              {isCheckingOut ? 'Processing...' : 'Place Order'}
            </button>
            <button onClick={clearCart} className="clear-cart">Clear Cart</button>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart