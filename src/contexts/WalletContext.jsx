import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { db } from '../firebase/config'
import {
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp
} from 'firebase/firestore'

const WalletContext = createContext()

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) throw new Error('useWallet must be used within a WalletProvider')
  return context
}

export const WalletProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) {
      setBalance(0)
      setLoading(false)
      return undefined
    }

    setLoading(true)
    const walletRef = doc(db, 'wallets', currentUser.email)
    const unsubscribe = onSnapshot(walletRef, (walletSnap) => {
      setBalance(Number(walletSnap.data()?.balance || 0))
      setLoading(false)
    }, (error) => {
      console.error('Wallet subscription error:', error.message)
      setBalance(0)
      setLoading(false)
    })

    return unsubscribe
  }, [currentUser])

  const updateBalance = async (amount, type) => {
    if (!currentUser || !Number.isFinite(amount) || amount <= 0) {
      throw new Error('Enter a valid amount.')
    }

    const walletRef = doc(db, 'wallets', currentUser.email)
    await runTransaction(db, async (transaction) => {
      const walletSnap = await transaction.get(walletRef)
      const currentBalance = Number(walletSnap.data()?.balance || 0)
      const nextBalance = type === 'deposit'
        ? currentBalance + amount
        : currentBalance - amount

      if (nextBalance < 0) {
        throw new Error('Insufficient wallet balance.')
      }

      transaction.set(walletRef, {
        balance: nextBalance,
        updatedAt: serverTimestamp()
      }, { merge: true })
    })
  }

  const deposit = (amount) => updateBalance(amount, 'deposit')
  const withdraw = (amount) => updateBalance(amount, 'withdraw')

  const spendBalance = async (amount) => {
    if (!currentUser || !Number.isFinite(amount) || amount <= 0) {
      throw new Error('Invalid purchase total.')
    }

    const walletRef = doc(db, 'wallets', currentUser.email)
    await runTransaction(db, async (transaction) => {
      const walletSnap = await transaction.get(walletRef)
      const currentBalance = Number(walletSnap.data()?.balance || 0)
      if (currentBalance < amount) {
        throw new Error('Insufficient wallet balance. Please deposit more funds.')
      }

      transaction.update(walletRef, {
        balance: currentBalance - amount,
        updatedAt: serverTimestamp()
      })
    })
  }

  return (
    <WalletContext.Provider value={{
      balance,
      loading,
      deposit,
      withdraw,
      spendBalance
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export default WalletContext
