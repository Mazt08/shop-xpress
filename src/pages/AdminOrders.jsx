import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { collection, getDocs, query, where, getDoc } from 'firebase/firestore'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // VULNERABLE: Full access to all orders - no authorization check
        const snapshot = await getDocs(collection(db, 'orders'))
        const ordersList = snapshot.docs.map(d => {
          const data = d.data()
          return {
            id: d.id,
            items: data.items,
            total: data.total,
            status: data.status,
            orderDate: data.orderDate,
            transactionId: data.transactionId
          }
        })
        setOrders(ordersList)
      } catch (error) {
        console.error('Fetch orders error:', error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  return (
    <div className="admin-orders">
      <h2>All Orders</h2>
      <p>Admin view of all customer orders</p>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="admin-table">
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

export default AdminOrders