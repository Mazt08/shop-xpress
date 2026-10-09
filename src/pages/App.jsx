import { Routes, Route, Navigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Home from './Home'
import Login from './Login'
import Signup from './Signup'
import ProductDetail from './ProductDetail'
import Cart from './Cart'
import Orders from './Orders'
import Admin from './Admin'
import AdminProducts from './AdminProducts'
import AdminUsers from './AdminUsers'
import AdminOrders from './AdminOrders'
import Wallet from './Wallet'

const App = () => {
  return (
    <div className="app">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
      </Routes>
    </div>
  )
}

export default App