import { useState } from 'react'
import { Link } from 'react-router-dom'

// VULNERABLE: Hardcoded admin password in client-side code
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // VULNERABLE: Password comparison without session timeout
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
    } else {
      alert('Invalid password')
    }
  }

  if (!authenticated) {
    return (
      <div className="admin-login">
        <h2>Admin Panel Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p>Hint: Check environment variables</p>
        <p>Hardcoded password: {ADMIN_PASSWORD}</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <p>Welcome to the Admin Panel</p>
      <div className="admin-links">
        <Link to="/admin/products">Manage Products</Link>
        <Link to="/admin/users">View Users</Link>
        <Link to="/admin/orders">View Orders</Link>
        <a href="/">Logout</a>
      </div>
      <p>No session timeout - vulnerable to session hijacking</p>
    </div>
  )
}

export default Admin