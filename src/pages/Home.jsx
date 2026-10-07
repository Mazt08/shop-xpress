import SearchBar from '../components/SearchBar'
import ProductCard from '../components/ProductCard'
import { useProduct } from '../contexts/ProductContext'

const Home = () => {
  const { products, loading, error } = useProduct()

  if (loading) {
    return <div>Loading products...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="home">
      <h1>ShopXpress - Vulnerable E-commerce Site</h1>
      <SearchBar />
      {products.length === 0 ? (
        <div>No products found</div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home