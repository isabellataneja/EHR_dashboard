'use client'

import MetricCard from '@/components/MetricCard'
import ChartCard from '@/components/ChartCard'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Mock data
const weeklyRevocations = [
  { week: 'Week 1', open: 5, closed: 8 },
  { week: 'Week 2', open: 7, closed: 12 },
  { week: 'Week 3', open: 4, closed: 10 },
  { week: 'Week 4', open: 6, closed: 9 },
  { week: 'Week 5', open: 8, closed: 11 },
]

export default function RevocationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-medical-primary">EHR Revocations</h1>
        <p className="text-gray-600 mt-2">Track EHR credential revocations</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          title="Open Revocations"
          value="12"
          icon={AlertCircle}
        />
        <MetricCard
          title="Closed This Week"
          value="11"
          icon={CheckCircle2}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Open EHR Revocations by Week">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyRevocations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="open" stroke="#ef4444" name="Open Revocations" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Closed EHR Revocations by Week">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyRevocations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="closed" stroke="#10b981" name="Closed Revocations" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
