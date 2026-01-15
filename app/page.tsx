'use client'

import MetricCard from '@/components/MetricCard'
import ChartCard from '@/components/ChartCard'
import DataTable from '@/components/DataTable'
import { 
  Shield, 
  ClipboardList, 
  AlertCircle, 
  Users,
  TrendingUp,
  Clock
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Mock data - replace with actual API calls
const weeklyOpenRequests = [
  { week: 'Week 1', open: 45, closed: 12 },
  { week: 'Week 2', open: 52, closed: 18 },
  { week: 'Week 3', open: 48, closed: 22 },
  { week: 'Week 4', open: 55, closed: 15 },
  { week: 'Week 5', open: 50, closed: 20 },
]

const accountsData = [
  { account: 'Memorial Health', clinicians: 25, ehrCredentials: 23, status: 'Steady State', product: 'Augmedix Live', avgTAT: 6.5 },
  { account: 'City Hospital', clinicians: 18, ehrCredentials: 18, status: 'Ramp Up', product: 'Augmedix Assist', avgTAT: 8.2 },
  { account: 'Regional Medical', clinicians: 32, ehrCredentials: 30, status: 'Steady State', product: 'Augmedix Live', avgTAT: 5.8 },
  { account: 'Community Health', clinicians: 15, ehrCredentials: 12, status: 'Implementation', product: 'Augmedix Prep', avgTAT: 10.5 },
  { account: 'Metro Health', clinicians: 22, ehrCredentials: 20, status: 'Steady State', product: 'Augmedix Live', avgTAT: 7.1 },
  { account: 'Rural Clinic', clinicians: 8, ehrCredentials: 7, status: 'On Hold: Steady State', product: 'Augmedix Assist', avgTAT: 9.3 },
]

const activeAccounts = [
  { account: 'Memorial Health', oktaAppName: 'Memorial Health - Epic', ehrProcessGuide: 'Memorial Health Process Guide', status: 'Match' },
  { account: 'City Hospital', oktaAppName: 'City Hospital - Cerner', ehrProcessGuide: 'City Hospital Process Guide', status: 'Match' },
  { account: 'Regional Medical', oktaAppName: 'Regional Medical - Epic', ehrProcessGuide: 'Regional Medical Process Guide', status: 'Match' },
  { account: 'Community Health', oktaAppName: 'Community Health - Allscripts', ehrProcessGuide: 'Missing', status: 'Missing Process Guide' },
]

const inactiveAccounts = [
  { account: 'Old Hospital', oktaAppName: 'Old Hospital - Epic', ehrProcessGuide: 'Old Hospital Process Guide', oktaAppActive: 'Yes', processGuideActive: 'Yes' },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-medical-primary">EHR Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of Electronic Health Record credentials and requests</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active EHR Credentials"
          value="1,234"
          icon={Shield}
          trend={{ value: 5.2, isPositive: true }}
        />
        <MetricCard
          title="Open EHR Requests"
          value="48"
          icon={ClipboardList}
          trend={{ value: -2.1, isPositive: true }}
        />
        <MetricCard
          title="Open Revocations"
          value="12"
          icon={AlertCircle}
        />
        <MetricCard
          title="Avg TAT (Days)"
          value="7.5"
          icon={Clock}
          subtitle="Last 30 days"
        />
      </div>

      {/* EHR Credentials Maintenance */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-medical-primary">EHR Credentials Maintenance</h2>
        
        <ChartCard title="Active Clinicians by Account" subtitle="Number of active clinicians with EHR credentials - Click to drill down">
          <DataTable
            columns={[
              { key: 'account', label: 'Account Name', sortable: true },
              { key: 'clinicians', label: '# Active Clinicians', sortable: true },
              { key: 'ehrCredentials', label: '# EHR Credentials', sortable: true },
              { key: 'status', label: 'Customer Status', sortable: true },
              { key: 'product', label: 'Product', sortable: true },
              { key: 'avgTAT', label: 'Avg TAT (Days)', sortable: true },
            ]}
            data={accountsData}
            searchable
            onRowClick={(row) => {
              // Handle drilldown to see users with EHR credentials or active clinicians
              console.log('Drilldown:', row)
            }}
          />
        </ChartCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Active Accounts - Okta App & Process Guide" subtitle="Identify missing or mismatched names">
            <DataTable
              columns={[
                { key: 'account', label: 'Account Name', sortable: true },
                { key: 'oktaAppName', label: 'Okta EHR App Name', sortable: true },
                { key: 'ehrProcessGuide', label: 'EHR Process Guide', sortable: true },
                { key: 'status', label: 'Status', sortable: true },
              ]}
              data={activeAccounts}
              searchable
            />
          </ChartCard>

          <ChartCard title="Inactive Accounts - Okta App & Process Guide" subtitle="Check if apps/guides are still active">
            <DataTable
              columns={[
                { key: 'account', label: 'Account Name', sortable: true },
                { key: 'oktaAppName', label: 'Okta EHR App Name', sortable: true },
                { key: 'ehrProcessGuide', label: 'EHR Process Guide', sortable: true },
                { key: 'oktaAppActive', label: 'Okta App Active', sortable: true },
                { key: 'processGuideActive', label: 'Process Guide Active', sortable: true },
              ]}
              data={inactiveAccounts}
              searchable
            />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Open EHR Requests by Week">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyOpenRequests}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="open" stroke="#3182ce" name="Open Requests" />
                <Line type="monotone" dataKey="closed" stroke="#10b981" name="Closed Requests" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Open Requests by Service Provider">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { provider: 'Provider A', requests: 15 },
                { provider: 'Provider B', requests: 12 },
                { provider: 'Provider C', requests: 8 },
                { provider: 'Provider D', requests: 13 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="provider" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="#3182ce" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
