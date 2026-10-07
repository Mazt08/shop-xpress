import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProduct } from '../contexts/ProductContext'
import { useCart } from '../contexts/CartContext'

const ProductDetail = () => {
  const { id } = useParams()
  const { getProductById, products, loading, error, searchProducts } = useProduct()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  if (loading) {
    return <div>Loading product...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const product = products.find(p => p.id === id) || searchResults.find(p => p.id === id)

  if (!product) {
    return <div>Product not found</div>
  }

  const searchResults = [] // Will be populated by search context

  return (
    <div className="product-detail">
      <h1>{product.name}</h1>
      <img src={product.imageUrl} alt={product.name} className="product-image" />
      <p>{product.description}</p>
      <p className="price">${product.price}</p>
      <p className="stock">Stock: {product.stock}</p>
      <p className="sku">SKU: {product.sku}</p>
      <div className="actions">
        {product.stock > 0 && (
          <button
            onClick={() => addToCart(product, 1)}
            className="add-to-cart"
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        )}
        <Link to="/" className="back-link">← Back to Catalog</Link>
      </div>
    </div>
  )
}

export default ProductDetail