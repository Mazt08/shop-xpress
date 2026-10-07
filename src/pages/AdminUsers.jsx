import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // VULNERABLE: All users readable - enumeration enabled
        const snapshot = await getDocs(collection(db, 'users'))
        const userList = snapshot.docs.map(d => {
          const data = d.data()
          return {
            email: data.email,
            role: data.role,
            createdAt: data.createdAt,
            // VULNERABLE: Plaintext password exposed
            password: data.password || 'N/A'
          }
        })
        setUsers(userList)
      } catch (error) {
        console.error('Fetch users error:', error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  return (
    <div className="admin-users">
      <h2>All Registered Users</h2>
      <p>This page demonstrates email enumeration vulnerability</p>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Password (Plaintext - VULNERABLE)</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}</td>
                <td><span className="plaintext-password">{user.password}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default AdminUsers