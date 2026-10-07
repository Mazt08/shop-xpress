import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={product.imageUrl} alt={product.name} className="product-image" />
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p className="price">${product.price}</p>
        <p className="stock">Stock: {product.stock}</p>
        <p className="sku">SKU: {product.sku}</p>
      </Link>
      <button
        onClick={() => addToCart(product, 1)}
        className="add-to-cart"
        disabled={product.stock <= 0}
      >
        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  )
}

export default ProductCard