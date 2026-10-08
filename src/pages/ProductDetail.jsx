import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProduct } from '../contexts/ProductContext'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import getProductImage from '../utils/productImages'
import formatPrice from '../utils/formatPrice'

const ProductDetail = () => {
  const { id } = useParams()
  const { getProductById, products, loading, error, searchProducts } = useProduct()
  const { addToCart } = useCart()
  const { currentUser } = useAuth()
  const [loginPrompt, setLoginPrompt] = useState(false)
  const navigate = useNavigate()

  if (loading) {
    return <div>Loading product...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const product = products.find(p => p.id === id)

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="product-detail">
      <h1>{product.name}</h1>
      <img src={getProductImage(product)} alt={product.name} className="product-image" />
      <p>{product.description}</p>
      <p className="price">{formatPrice(product.price)}</p>
      <p className="stock">Stock: {product.stock}</p>
      <p className="sku">SKU: {product.sku}</p>
      <div className="actions">
        {product.stock > 0 && (
          <button
            onClick={async () => {
              if (!currentUser) {
                setLoginPrompt(true)
                return
              }
              await addToCart(product, 1)
            }}
            className="add-to-cart"
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        )}
        {loginPrompt && (
          <div className="cart-toast login-toast" role="alert">
            <span>Log in to purchase products.</span>
            <Link to="/login">Log In</Link>
            <button onClick={() => setLoginPrompt(false)} aria-label="Dismiss login prompt">×</button>
          </div>
        )}
        <Link to="/" className="back-link">← Back to Catalog</Link>
      </div>
    </div>
  )
}

export default ProductDetail