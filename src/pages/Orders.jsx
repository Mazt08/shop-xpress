import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase/config'
import {
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)
  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentUser) {
      setOrders([])
      return undefined
    }

    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, 'orders')
        const ordersQuery = query(ordersRef, where('customerEmail', '==', currentUser.email))
        const snapshot = await getDocs(ordersQuery)
        const ordersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setOrders(ordersList)
      } catch (err) {
        setError(err.message)
      }
    }

    fetchOrders()
  }, [currentUser])

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="orders-page">
      <h2>Order History</h2>
      {!currentUser ? (
        <div className="orders-login-prompt">
          <p>Log in to view your orders.</p>
          <a href="/login" className="back-link">Log In</a>
        </div>
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="orders-table-wrap">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Shipping</th>
              <th>Payment</th>
              <th>Voucher</th>
              <th>Transaction ID</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.orderId || order.id}</td>
                <td>{order.customerName || order.customerEmail || 'N/A'}</td>
                <td>{order.items?.length || 0} items</td>
                <td>${Math.round(order.total || 0).toLocaleString('en-US')}</td>
                <td>
                  <span className={`order-status status-${(order.status || 'pending').toLowerCase()}`}>
                    {order.status || 'pending'}
                  </span>
                </td>
                <td>{order.shippingOption || 'N/A'}</td>
                <td>{order.paymentMethod || 'N/A'}</td>
                <td>{order.voucherCode || 'No voucher'}</td>
                <td>{order.transactionId}</td>
                <td>
                  {order.orderDate?.toDate?.().toLocaleDateString() || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  )
}

export default Orders