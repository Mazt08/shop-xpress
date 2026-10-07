import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, currentUser, email: userEmail } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      window.location.href = '/'
    } catch (err) {
      setError(err.message || 'Login failed')
    }
  }

  if (currentUser) {
    return <div>Already logged in as {userEmail}</div>
  }

  return (
    <div className="login-page">
      <h2>Login</h2>
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
        <button type="submit">Login</button>
      </form>
      <p>Hardcoded admin: admin@test.com / admin123</p>
      <p>Note: No rate limiting, brute-force enabled</p>
    </div>
  )
}

export default Login