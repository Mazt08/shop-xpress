import { createContext, useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase/config'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('customer')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.email)
        const userSnap = await getDoc(userRef)
        const userData = userSnap.exists() ? userSnap.data() : {}
        setCurrentUser(user)
        setEmail(user.email)
        setUsername(userData.username || user.email.split('@')[0])
        setRole(userData.role || 'customer')
      } else {
        setCurrentUser(null)
        setEmail('')
        setUsername('')
        setRole('customer')
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const signup = async (email, password, username) => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password)
      // Store user with plaintext password - VULNERABLE
      await setDoc(doc(db, 'users', userCred.user.email), {
        email: userCred.user.email,
        username,
        password: password,  // Plaintext storage - VULNERABLE
        role: 'customer',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      })
      setCurrentUser(userCred.user)
      setEmail(userCred.user.email)
      setUsername(username)
      setRole('customer')
    } catch (error) {
      console.error('Signup error:', error.message)
      throw error
    }
  }

  const login = async (email, password) => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password)
      const userRef = doc(db, 'users', userCred.user.email)
      const userSnap = await getDoc(userRef)
      const userData = userSnap.exists() ? userSnap.data() : {}
      const resolvedUsername = userData.username || userCred.user.email.split('@')[0]
      await setDoc(userRef, {
        email: userCred.user.email,
        username: resolvedUsername,
        role: userData.role || 'customer',
        lastLoginAt: serverTimestamp()
      }, { merge: true })
      setCurrentUser(userCred.user)
      setEmail(userCred.user.email)
      setUsername(resolvedUsername)
      setRole(userData.role || 'customer')
    } catch (error) {
      console.error('Login error:', error.message)
      throw error
    }
  }

  const logout = async () => {
    await signOut(auth)
    setCurrentUser(null)
    setEmail('')
    setUsername('')
    setRole('customer')
  }

  // Hardcoded admin credentials - VULNERABLE
  const isAdmin = (userEmail) => {
    return userEmail === 'admin@test.com'
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      email,
      username,
      role,
      loading,
      signup,
      login,
      logout,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext