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
  const { currentUser, email } = useAuth()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // VULNERABLE: No ownership check - any user can view any order
        const ordersRef = collection(db, 'orders')
        const snapshot = await getDocs(ordersRef)
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
  }, [])

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="orders-page">
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Transaction ID</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.items?.length || 0} items</td>
                <td>${order.total || 0}</td>
                <td>{order.status}</td>
                <td>{order.transactionId}</td>
                <td>
                  {order.orderDate?.toDate?.().toLocaleDateString() || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Orders