import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import getProductImage from '../utils/productImages'
import formatPrice from '../utils/formatPrice'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!added) return undefined
    const timeoutId = setTimeout(() => setAdded(false), 1800)
    return () => clearTimeout(timeoutId)
  }, [added])

  const handleAddToCart = async () => {
    const wasAdded = await addToCart(product, 1)
    if (wasAdded) setAdded(true)
  }

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={getProductImage(product)} alt={product.name} className="product-image" />
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p className="price">{formatPrice(product.price)}</p>
        <p className="stock">Stock: {product.stock}</p>
        <p className="sku">SKU: {product.sku}</p>
      </Link>
      <button
        onClick={handleAddToCart}
        className={`add-to-cart${added ? ' added' : ''}`}
        disabled={product.stock <= 0}
      >
        {product.stock > 0 ? (added ? 'Added to Cart' : 'Add to Cart') : 'Out of Stock'}
      </button>
      {added && <div className="cart-toast" role="status">Added {product.name} to your cart</div>}
    </div>
  )
}

export default ProductCard