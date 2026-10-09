import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useWallet } from '../contexts/WalletContext'
import formatPrice from '../utils/formatPrice'

const Wallet = () => {
  const { currentUser } = useAuth()
  const { balance, deposit, withdraw } = useWallet()
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleBalanceChange = async (action) => {
    setError('')
    setMessage('')
    const parsedAmount = Number(amount)
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Enter an amount greater than zero.')
      return
    }

    setIsProcessing(true)
    try {
      if (action === 'deposit') {
        await deposit(parsedAmount)
        setMessage(`Deposited ${formatPrice(parsedAmount)} into your wallet.`)
      } else {
        await withdraw(parsedAmount)
        setMessage(`Withdrew ${formatPrice(parsedAmount)} from your wallet.`)
      }
      setAmount('')
    } catch (actionError) {
      setError(actionError.message || 'Wallet transaction failed.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="wallet-page">
        <h2>ShopXpress Wallet</h2>
        <div className="wallet-card wallet-login">
          <p>Log in to manage your wallet balance.</p>
          <Link to="/login" className="back-link">Log In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="wallet-page">
      <h2>ShopXpress Wallet</h2>
      <div className="wallet-card">
        <p className="wallet-label">Available balance</p>
        <p className="wallet-balance">{formatPrice(balance)}</p>
        <p className="wallet-note">Use your balance to pay for purchases at checkout.</p>
        {error && <div className="error-box">{error}</div>}
        {message && <div className="success-box">{message}</div>}
        <label className="wallet-amount">
          Amount
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
          />
        </label>
        <div className="wallet-actions">
          <button onClick={() => handleBalanceChange('deposit')} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Deposit'}
          </button>
          <button onClick={() => handleBalanceChange('withdraw')} disabled={isProcessing}>
            Withdraw
          </button>
        </div>
      </div>
    </div>
  )
}

export default Wallet
