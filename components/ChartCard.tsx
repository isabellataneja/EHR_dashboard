'use client'

import { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  children: ReactNode
  subtitle?: string
  actions?: ReactNode
}

export default function ChartCard({ title, children, subtitle, actions }: ChartCardProps) {
  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-medical-primary">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div className="mt-4">
        {children}
      </div>
    </div>
  )
}
