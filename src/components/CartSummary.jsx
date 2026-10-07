import { useCart } from '../contexts/CartContext'

const CartSummary = () => {
  const { cartItems, removeFromCart, updateCartItemQuantity, clearCart } = useCart()

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.price || 0) * item.quantity
  }, 0)

  return (
    <div className="cart-summary">
      <h2>Cart Summary</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.productId}>
                  <td>{item.name || `Product ${item.productId}`}</td>
                  <td>${item.price || '0.00'}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value) || 1
                        if (newQuantity < 1) return
                        updateCartItemQuantity(item.productId, newQuantity)
                      }}
                    />
                  </td>
                  <td>${((item.price || 0) * item.quantity).toFixed(2)}</td>
                  <td>
                    <button onClick={() => removeFromCart(item.productId)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-total">
            <h3>Total: ${total.toFixed(2)}</h3>
          </div>
          <button onClick={clearCart} className="clear-cart">
            Clear Cart
          </button>
        </>
      )}
    </div>
  )
}

export default CartSummary