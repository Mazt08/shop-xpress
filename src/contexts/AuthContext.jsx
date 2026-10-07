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
  collection,
  getDocs
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
  const [role, setRole] = useState('customer')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.email)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
          setCurrentUser(user)
          setEmail(user.email)
          setRole(userSnap.data().role || 'customer')
        }
      } else {
        setCurrentUser(null)
        setEmail('')
        setRole('customer')
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const signup = async (email, password) => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password)
      // Store user with plaintext password - VULNERABLE
      await setDoc(doc(db, 'users', userCred.user.email), {
        email: userCred.user.email,
        password: password,  // Plaintext storage - VULNERABLE
        role: 'customer',
        createdAt: new Date()
      })
      setCurrentUser(userCred.user)
      setEmail(userCred.user.email)
      setRole('customer')
    } catch (error) {
      console.error('Signup error:', error.message)
    }
  }

  const login = async (email, password) => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password)
      const userRef = doc(db, 'users', email)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        setCurrentUser(userCred.user)
        setEmail(email)
        setRole(userSnap.data().role || 'customer')
      }
    } catch (error) {
      console.error('Login error:', error.message)
    }
  }

  const logout = async () => {
    await signOut(auth)
    setCurrentUser(null)
    setEmail('')
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