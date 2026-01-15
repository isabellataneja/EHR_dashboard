'use client'

import { signIn } from 'next-auth/react'
import { Shield } from 'lucide-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-medical-light mx-auto">
          <Shield className="w-6 h-6 text-medical-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-medical-primary text-center mt-4">
          Sign in to Commure EHR
        </h1>
        <p className="text-sm text-gray-600 text-center mt-2">
          Use your Google account to access the EHR dashboard.
        </p>
        <button
          onClick={() => signIn('google')}
          className="w-full mt-6 btn-primary"
        >
          Continue with Google
        </button>
        <p className="text-xs text-gray-500 text-center mt-4">
          New users will be placed in a pending approval state.
        </p>
      </div>
    </div>
  )
}
