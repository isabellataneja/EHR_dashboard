'use client'

import ChartCard from '@/components/ChartCard'
import DataTable from '@/components/DataTable'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

// Mock data - replace with actual API calls
const credentialStatusData = [
  { name: 'Active', value: 850, color: '#10b981' },
  { name: 'Pending', value: 120, color: '#f59e0b' },
  { name: 'Expiring Soon', value: 45, color: '#ef4444' },
  { name: 'Inactive', value: 89, color: '#6b7280' },
]

const credentialsData = [
  {
    mdsName: 'John Smith',
    email: 'john.smith@augmedix.com',
    healthSystem: 'Epic - Memorial Health',
    customer: 'Memorial Health',
    expirationDate: '2026-06-15',
    manager: 'Jane Doe',
    status: 'Active',
  },
  {
    mdsName: 'Sarah Johnson',
    email: 'sarah.j@augmedix.com',
    healthSystem: 'Cerner - City Hospital',
    customer: 'City Hospital',
    expirationDate: '2026-05-20',
    manager: 'Mike Wilson',
    status: 'Active',
  },
  {
    mdsName: 'David Lee',
    email: 'david.lee@augmedix.com',
    healthSystem: 'Epic - Regional Medical',
    customer: 'Regional Medical',
    expirationDate: '2026-04-10',
    manager: 'Jane Doe',
    status: 'Expiring Soon',
  },
  {
    mdsName: 'Emily Chen',
    email: 'emily.chen@augmedix.com',
    healthSystem: 'Allscripts - Community Health',
    customer: 'Community Health',
    expirationDate: '2025-12-31',
    manager: 'Mike Wilson',
    status: 'Inactive',
  },
]

export default function CredentialsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-medical-primary">EHR Credential Dashboard</h1>
        <p className="text-gray-600 mt-2">Track active, expiring, and inactive/historical credentials</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Credential Status Overview">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={credentialStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {credentialStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Quick Actions">
          <div className="space-y-4">
            <button className="w-full btn-primary text-left px-4 py-3">
              View Active Credentials
            </button>
            <button className="w-full btn-primary text-left px-4 py-3">
              View Expiring Credentials
            </button>
            <button className="w-full btn-primary text-left px-4 py-3">
              View Inactive Credentials
            </button>
            <button className="w-full btn-secondary text-left px-4 py-3">
              Link EHR Run Books/Library
            </button>
            <button className="w-full btn-secondary text-left px-4 py-3">
              Link EHR Cred Dash (Retool)
            </button>
          </div>
        </ChartCard>
      </div>

      <ChartCard 
        title="EHR Credentials List"
        subtitle="MDS Name, email, health system EHR serves, customer serves, expected expiration date, manager"
      >
        <DataTable
          columns={[
            { key: 'mdsName', label: 'MDS Name', sortable: true },
            { key: 'email', label: 'Email', sortable: true },
            { key: 'healthSystem', label: 'Health System EHR', sortable: true },
            { key: 'customer', label: 'Customer', sortable: true },
            { key: 'expirationDate', label: 'Expiration Date', sortable: true },
            { key: 'manager', label: 'Manager', sortable: true },
            { key: 'status', label: 'Status', sortable: true },
          ]}
          data={credentialsData}
          searchable
          filterable
        />
      </ChartCard>
    </div>
  )
}
