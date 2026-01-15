'use client'

import MetricCard from '@/components/MetricCard'
import ChartCard from '@/components/ChartCard'
import DataTable from '@/components/DataTable'
import { ClipboardList, AlertCircle, Users, Clock } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Mock data
const weeklyOpenRequests = [
  { week: 'Week 1', open: 45, matrix: 8 },
  { week: 'Week 2', open: 52, matrix: 12 },
  { week: 'Week 3', open: 48, matrix: 10 },
  { week: 'Week 4', open: 55, matrix: 15 },
  { week: 'Week 5', open: 50, matrix: 11 },
]

const weeklyClosedRequests = [
  { week: 'Week 1', closed: 12, matrixClosed: 2 },
  { week: 'Week 2', closed: 18, matrixClosed: 4 },
  { week: 'Week 3', closed: 22, matrixClosed: 3 },
  { week: 'Week 4', closed: 15, matrixClosed: 5 },
  { week: 'Week 5', closed: 20, matrixClosed: 3 },
]

const requestsByAccount = [
  { account: 'Memorial Health', open: 8, matrix: 2 },
  { account: 'City Hospital', open: 5, matrix: 1 },
  { account: 'Regional Medical', open: 12, matrix: 3 },
  { account: 'Community Health', open: 6, matrix: 0 },
]

const requestsByStatus = [
  { status: 'Implementation Requests', count: 15 },
  { status: 'Transition Requests', count: 8 },
  { status: 'Production Requests', count: 20 },
  { status: 'Production:TS/PS Requests', count: 5 },
]

const requestsByEHRStatus = [
  { status: 'EHR Requested', count: 12 },
  { status: 'EHR Received - Pending Testing', count: 18 },
  { status: 'EHR Credentials Active', count: 8 },
  { status: 'EHR Received - Issues', count: 10 },
]

const inactiveEmployeeRequests = [
  {
    name: 'Former Employee',
    account: 'Memorial Health',
    status: 'EHR Requested',
    daysOpen: 45,
    employeeStatus: 'Resigned',
  },
]

export default function RequestsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-medical-primary">EHR Requests</h1>
        <p className="text-gray-600 mt-2">Track and manage EHR credential requests</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Open EHR Requests"
          value="48"
          icon={ClipboardList}
        />
        <MetricCard
          title="Open Matrix Requests"
          value="11"
          icon={AlertCircle}
        />
        <MetricCard
          title="Closed This Week"
          value="20"
          icon={ClipboardList}
        />
        <MetricCard
          title="Inactive Employee Requests"
          value="3"
          icon={Users}
        />
      </div>

      {/* Charts */}
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
              <Line type="monotone" dataKey="matrix" stroke="#ef4444" name="Matrix Requests" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Closed EHR Requests by Week">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyClosedRequests}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="closed" stroke="#10b981" name="Closed Requests" />
              <Line type="monotone" dataKey="matrixClosed" stroke="#f59e0b" name="Matrix Closed" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Tables */}
      <ChartCard title="Open EHR Requests by Account">
        <DataTable
          columns={[
            { key: 'account', label: 'Account Name', sortable: true },
            { key: 'open', label: 'Open Requests', sortable: true },
            { key: 'matrix', label: 'Matrix Requests', sortable: true },
          ]}
          data={requestsByAccount}
          searchable
        />
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Open Requests by Task Status">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={requestsByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3182ce" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Open Requests by EHR Current Status">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={requestsByEHRStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard 
        title="EHR Requests for Inactive/Resigned Employees"
        subtitle="Requests that need attention for employees no longer active"
      >
        <DataTable
          columns={[
            { key: 'name', label: 'Employee Name', sortable: true },
            { key: 'account', label: 'Account', sortable: true },
            { key: 'status', label: 'Request Status', sortable: true },
            { key: 'daysOpen', label: 'Days Open', sortable: true },
            { key: 'employeeStatus', label: 'Employee Status', sortable: true },
          ]}
          data={inactiveEmployeeRequests}
          searchable
        />
      </ChartCard>
    </div>
  )
}
