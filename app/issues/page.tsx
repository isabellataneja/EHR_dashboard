'use client'

import MetricCard from '@/components/MetricCard'
import ChartCard from '@/components/ChartCard'
import DataTable from '@/components/DataTable'
import { AlertCircle, Wrench } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Mock data
const weeklyIssues = [
  { week: 'Week 1', open: 8 },
  { week: 'Week 2', open: 12 },
  { week: 'Week 3', open: 10 },
  { week: 'Week 4', open: 15 },
  { week: 'Week 5', open: 11 },
]

const issuesData = [
  {
    issueId: 'EHR-001',
    account: 'Memorial Health',
    mdsName: 'John Smith',
    issueType: 'Troubleshooting',
    status: 'Open',
    daysOpen: 5,
    priority: 'High',
  },
  {
    issueId: 'EHR-002',
    account: 'City Hospital',
    mdsName: 'Sarah Johnson',
    issueType: 'Reactivation',
    status: 'In Progress',
    daysOpen: 3,
    priority: 'Medium',
  },
]

export default function IssuesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-medical-primary">EHR Issues</h1>
        <p className="text-gray-600 mt-2">Track EHR troubleshooting and reactivation issues</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          title="Open EHR Issues"
          value="18"
          icon={AlertCircle}
        />
        <MetricCard
          title="Troubleshooting Tasks"
          value="12"
          icon={Wrench}
        />
      </div>

      {/* Chart */}
      <ChartCard title="Open EHR Issue Tasks by Week">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyIssues}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="open" stroke="#ef4444" name="Open Issues" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Issues Table */}
      <ChartCard title="EHR Issues List">
        <DataTable
          columns={[
            { key: 'issueId', label: 'Issue ID', sortable: true },
            { key: 'account', label: 'Account', sortable: true },
            { key: 'mdsName', label: 'MDS Name', sortable: true },
            { key: 'issueType', label: 'Issue Type', sortable: true },
            { key: 'status', label: 'Status', sortable: true },
            { key: 'daysOpen', label: 'Days Open', sortable: true },
            { key: 'priority', label: 'Priority', sortable: true },
          ]}
          data={issuesData}
          searchable
        />
      </ChartCard>
    </div>
  )
}
