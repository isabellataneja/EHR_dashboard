'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'

export default function PasswordGatePage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    const response = await fetch('/api/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (response.ok) {
      window.location.href = '/'
      return
    }

    const data = await response.json().catch(() => ({}))
    setError(data.message || 'Incorrect password.')
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-medical-light mx-auto">
          <Lock className="w-6 h-6 text-medical-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-medical-primary text-center mt-4">
          Enter Access Password
        </h1>
        <p className="text-sm text-gray-600 text-center mt-2">
          This dashboard is currently password protected.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-medical-primary"
            placeholder="Password"
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
