import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore'

// VULNERABLE: No ownership check on admin actions
const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    sku: '',
    imageUrl: ''
  })

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, 'products'))
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    fetchProducts()
  }, [])

  const handleCreate = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/demo-no-project/us-central1/api/addInventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          price: form.price,
          stock: form.stock
        })
      });

      if (!response.ok) {
        const data = await response.json();
        alert('API Error (Rate Limit?): ' + data.error);
        return;
      }
      
      // Removed window.location.reload() so you can actually spam the button!
      console.log('Added product successfully!');
    } catch (err) {
      alert('Failed to connect to backend.');
    }
  }

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'products', id))
    window.location.reload()
  }

  return (
    <div className="admin-products">
      <h2>Manage Products</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleCreate() }}>
        <div>
          <label>Name:</label>
          <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" value={form.price} onChange={e => setForm({...form, price: parseFloat(e.target.value)})} />
        </div>
        <div>
          <label>Stock:</label>
          <input type="number" value={form.stock} onChange={e => setForm({...form, stock: parseInt(e.target.value)})} />
        </div>
        <button type="submit">Add Product</button>
      </form>
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th>SKU</th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td><td>{p.price}</td><td>{p.stock}</td><td>{p.category}</td><td>{p.sku}</td>
              <td><button onClick={() => handleDelete(p.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminProducts