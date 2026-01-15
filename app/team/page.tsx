'use client'

import ChartCard from '@/components/ChartCard'
import DataTable from '@/components/DataTable'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Mock data
const requestsByAssignee = [
  { assignee: 'EHR Coordinator 1', open: 15, matrix: 3 },
  { assignee: 'EHR Coordinator 2', open: 12, matrix: 2 },
  { assignee: 'EHR Coordinator 3', open: 18, matrix: 5 },
  { assignee: 'EHR Coordinator 4', open: 10, matrix: 1 },
]

const closedByWeek = [
  { week: 'Week 1', coordinator1: 5, coordinator2: 4, coordinator3: 6, coordinator4: 3 },
  { week: 'Week 2', coordinator1: 7, coordinator2: 5, coordinator3: 8, coordinator4: 4 },
  { week: 'Week 3', coordinator1: 6, coordinator2: 6, coordinator3: 7, coordinator4: 5 },
]

const taskActions = [
  {
    taskId: 'EHR-001',
    assignee: 'EHR Coordinator 1',
    account: 'Memorial Health',
    firstNotification: '2026-01-15',
    credentialsReceived: '2026-01-20',
    taskClosed: '2026-01-22',
    timeToClose: 2,
  },
]

export default function TeamPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-medical-primary">EHR Team</h1>
        <p className="text-gray-600 mt-2">Track EHR coordinator workload and performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Open EHR Request Tasks by Assignee">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={requestsByAssignee}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="assignee" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="open" fill="#3182ce" name="Open Requests" />
              <Bar dataKey="matrix" fill="#ef4444" name="Matrix Requests" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="EHR Request Tasks Closed by Assignee (Weekly)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={closedByWeek}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="coordinator1" stroke="#3182ce" name="Coordinator 1" />
              <Line type="monotone" dataKey="coordinator2" stroke="#10b981" name="Coordinator 2" />
              <Line type="monotone" dataKey="coordinator3" stroke="#f59e0b" name="Coordinator 3" />
              <Line type="monotone" dataKey="coordinator4" stroke="#ef4444" name="Coordinator 4" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard 
        title="Task Actions Timeline"
        subtitle="Track actions taken on tasks by EHR coordinators"
      >
        <DataTable
          columns={[
            { key: 'taskId', label: 'Task ID', sortable: true },
            { key: 'assignee', label: 'Assignee', sortable: true },
            { key: 'account', label: 'Account', sortable: true },
            { key: 'firstNotification', label: 'First Notification', sortable: true },
            { key: 'credentialsReceived', label: 'Credentials Received', sortable: true },
            { key: 'taskClosed', label: 'Task Closed', sortable: true },
            { key: 'timeToClose', label: 'Time to Close (Days)', sortable: true },
          ]}
          data={taskActions}
          searchable
        />
      </ChartCard>
    </div>
  )
}
