import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const { signup, currentUser, email: userEmail } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    try {
      await signup(email, password)
      window.location.href = '/'
    } catch (err) {
      setError(err.message || 'Signup failed')
    }
  }

  if (currentUser) {
    return <div>Already signed up as {userEmail}</div>
  }

  return (
    <div className="signup-page">
      <h2>Sign Up</h2>
      {error && <div className="error-box">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>Note: Passwords stored in plaintext in Firestore - VULNERABLE</p>
      <p>No email validation, no password complexity requirements</p>
    </div>
  )
}

export default Signup