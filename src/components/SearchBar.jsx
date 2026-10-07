import { useState } from 'react'
import { useProduct } from '../contexts/ProductContext'

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const { searchProducts, filters, setFilters } = useProduct()
  const [products, setProducts] = useState([])
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = async () => {
    // VULNERABLE: Raw user input passed directly to Firestore query
    await searchProducts(searchTerm, selectedCategory)
    setProducts(searchResults)
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
        <option value="Books">Books</option>
        <option value="Home & Garden">Home & Garden</option>
      </select>
      <button onClick={handleSearch}>Search</button>
    </div>
  )
}

export default SearchBar