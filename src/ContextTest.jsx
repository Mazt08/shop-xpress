// Test file to verify authentication is required for protected components
import { useAuth } from './contexts/AuthContext'
import { useCart } from './contexts/CartContext'

const ContextTest = () => {
  const { email, role, currentUser } = useAuth()
  const { cartItems, accessAnyCart } = useCart()

  return (
    <div className="context-test">
      <h2>Context Access Test</h2>
      <p>Auth Context: {email || 'Not logged in'}</p>
      <p>Role: {role}</p>
      <p>Current User: {currentUser ? 'Logged in' : 'Not logged in'}</p>
      <p>Cart Items: {cartItems.length}</p>
      {email && role === 'admin' && (
        <div>
          <p>Admin actions available</p>
          <button onClick={async () => {
            const otherUserCart = await accessAnyCart('other@test.com')
            alert(`Access to other user's cart: ${otherUserCart.length} items`)
          }}>
            Test cart access vulnerability
          </button>
        </div>
      )}
    </div>
  )
}

export default ContextTest