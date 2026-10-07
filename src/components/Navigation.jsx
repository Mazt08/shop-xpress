import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navigation = () => {
  const { email, role, logout, isAdmin } = useAuth()

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">ShopXpress</Link>
      </div>
      <div className="nav-links">
        <NavLink to="/">Catalog</NavLink>
        <NavLink to="/cart">Cart</NavLink>
        <NavLink to="/orders">Orders</NavLink>
        {email && (
          <span className="user-info">Welcome, {email}</span>
        )}
        {isAdmin(email) && (
          <NavLink to="/admin">Admin</NavLink>
        )}
        {email ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navigation