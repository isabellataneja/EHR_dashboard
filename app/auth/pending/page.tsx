'use client'

import { Mail, Clock } from 'lucide-react'

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-medical-light mx-auto">
          <Clock className="w-6 h-6 text-medical-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-medical-primary mt-4">
          Pending Approval
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Your account is under review. You will receive an email once access is granted.
        </p>
        <div className="mt-6 flex items-center justify-center text-gray-500 text-sm">
          <Mail className="w-4 h-4 mr-2" />
          Please contact the EHR admin if you need urgent access.
        </div>
      </div>
    </div>
  )
}
