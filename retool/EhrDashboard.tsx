import React from 'react'
import ChartCard from '../components/ChartCard'
import DataTable from '../components/DataTable'
import MetricCard from '../components/MetricCard'
import {
  Shield,
  ClipboardList,
  AlertCircle,
  Users,
  Clock,
  Mail,
  Bell,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

type GuideRecord = Record<string, string>

export type RetoolModel = {
  activeTab?: string
  dashboard?: {
    metrics?: {
      activeCredentials?: number | string
      openRequests?: number | string
      openRevocations?: number | string
      avgTatDays?: number | string
    }
    weeklyOpenRequests?: Array<Record<string, any>>
    openByProvider?: Array<Record<string, any>>
    accounts?: Array<Record<string, any>>
    activeAccounts?: Array<Record<string, any>>
    inactiveAccounts?: Array<Record<string, any>>
  }
  credentials?: {
    statusBreakdown?: Array<Record<string, any>>
    credentialsList?: Array<Record<string, any>>
  }
  requests?: {
    metrics?: {
      openRequests?: number | string
      openMatrixRequests?: number | string
      closedThisWeek?: number | string
      inactiveEmployeeRequests?: number | string
    }
    weeklyOpenRequests?: Array<Record<string, any>>
    weeklyClosedRequests?: Array<Record<string, any>>
    requestsByAccount?: Array<Record<string, any>>
    requestsByStatus?: Array<Record<string, any>>
    requestsByEhrStatus?: Array<Record<string, any>>
    inactiveEmployeeRequests?: Array<Record<string, any>>
  }
  revocations?: {
    metrics?: {
      openRevocations?: number | string
      closedThisWeek?: number | string
    }
    weeklyRevocations?: Array<Record<string, any>>
  }
  issues?: {
    metrics?: {
      openIssues?: number | string
      troubleshootingTasks?: number | string
    }
    weeklyIssues?: Array<Record<string, any>>
    issuesList?: Array<Record<string, any>>
  }
  team?: {
    requestsByAssignee?: Array<Record<string, any>>
    closedByWeek?: Array<Record<string, any>>
    taskActions?: Array<Record<string, any>>
  }
  qaOkta?: {
    oktaAppValidation?: Array<Record<string, any>>
    ratioData?: Array<Record<string, any>>
    revocationMismatches?: Array<Record<string, any>>
    inactiveAccounts?: Array<Record<string, any>>
  }
  portal?: {
    inbox?: Array<Record<string, any>>
    requestsQueue?: Array<Record<string, any>>
    revocationQueue?: Array<Record<string, any>>
    reminders?: Array<Record<string, any>>
  }
  processDocs?: {
    guides?: GuideRecord[]
    filters?: {
      account?: string
      ehrType?: string
      owner?: string
    }
    search?: string
    selectedGuideId?: string
  }
}

export type RetoolProps = {
  model: RetoolModel
  setModel: (next: RetoolModel) => void
  triggerQuery: (name: string, args?: Record<string, any>) => Promise<any>
}

const tabs = [
  'Dashboard',
  'Credentials',
  'Requests',
  'Revocations',
  'Issues',
  'Team',
  'QA Okta',
  'Process Docs',
  'Coordinator Portal',
]

const STATUS_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280']

function getGuideByAccount(guides: GuideRecord[], account?: string) {
  if (!account) return null
  return guides.find((guide) => guide.account_name === account) || null
}

function getSelectedGuide(guides: GuideRecord[], selectedGuideId?: string) {
  if (!selectedGuideId) return null
  return (
    guides.find((guide) => guide.account_sf_id === selectedGuideId) ||
    guides.find((guide) => guide.sfdc_account_id === selectedGuideId) ||
    guides.find((guide) => guide.account_name === selectedGuideId) ||
    null
  )
}

export default function EhrDashboardRetool({
  model,
  setModel,
  triggerQuery,
}: RetoolProps) {
  const activeTab = model.activeTab || 'Dashboard'
  const guides = model.processDocs?.guides || []
  const selectedGuide = getSelectedGuide(guides, model.processDocs?.selectedGuideId)

  const setActiveTab = (tab: string) => {
    setModel({ ...model, activeTab: tab })
  }

  const setProcessDocFilters = (next: Partial<RetoolModel['processDocs']['filters']>) => {
    setModel({
      ...model,
      processDocs: {
        ...model.processDocs,
        filters: { ...model.processDocs?.filters, ...next },
      },
    })
  }

  const filteredGuides = guides.filter((guide) => {
    const filters = model.processDocs?.filters || {}
    if (filters.account && guide.account_name !== filters.account) return false
    if (filters.ehrType && guide.ehr_type !== filters.ehrType) return false
    if (filters.owner && guide.ehr_owner !== filters.owner) return false
    if (model.processDocs?.search) {
      const search = model.processDocs.search.toLowerCase()
      const haystack = [
        guide.account_name,
        guide.ehr_type,
        guide.ehr_owner,
        guide.edited_by,
        guide.customer_ehr_poc,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(search)
    }
    return true
  })

  const accounts = model.dashboard?.accounts || []
  const activeAccounts = model.dashboard?.activeAccounts || []
  const inactiveAccounts = model.dashboard?.inactiveAccounts || []

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              activeTab === tab
                ? 'bg-medical-primary text-white border-medical-primary'
                : 'bg-white text-gray-600 border-gray-200 hover:border-medical-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Active EHR Credentials"
              value={model.dashboard?.metrics?.activeCredentials ?? '--'}
              icon={Shield}
            />
            <MetricCard
              title="Open EHR Requests"
              value={model.dashboard?.metrics?.openRequests ?? '--'}
              icon={ClipboardList}
            />
            <MetricCard
              title="Open Revocations"
              value={model.dashboard?.metrics?.openRevocations ?? '--'}
              icon={AlertCircle}
            />
            <MetricCard
              title="Avg TAT (Days)"
              value={model.dashboard?.metrics?.avgTatDays ?? '--'}
              icon={Clock}
            />
          </div>

          <ChartCard title="Active Clinicians by Account">
            <DataTable
              columns={[
                { key: 'account', label: 'Account Name', sortable: true },
                { key: 'clinicians', label: '# Active Clinicians', sortable: true },
                { key: 'ehrCredentials', label: '# EHR Credentials', sortable: true },
                { key: 'status', label: 'Customer Status', sortable: true },
                { key: 'product', label: 'Product', sortable: true },
                {
                  key: 'ehrOwner',
                  label: 'EHR Owner',
                  sortable: true,
                  render: (_, row) => {
                    const guide = getGuideByAccount(guides, row.account)
                    return guide?.ehr_owner || '-'
                  },
                },
              ]}
              data={accounts}
              searchable
            />
          </ChartCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Open EHR Requests by Week">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={model.dashboard?.weeklyOpenRequests || []}>
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
                <BarChart data={model.dashboard?.openByProvider || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="provider" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="requests" fill="#3182ce" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Active Accounts - Okta App & Process Guide">
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

            <ChartCard title="Inactive Accounts - Okta App & Process Guide">
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
        </div>
      )}

      {activeTab === 'Credentials' && (
        <div className="space-y-8">
          <ChartCard title="Credential Status Overview">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={model.credentials?.statusBreakdown || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {(model.credentials?.statusBreakdown || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="EHR Credentials List">
            <DataTable
              columns={[
                { key: 'mdsName', label: 'MDS Name', sortable: true },
                { key: 'email', label: 'Email', sortable: true },
                { key: 'healthSystem', label: 'Health System EHR', sortable: true },
                { key: 'customer', label: 'Customer', sortable: true },
                { key: 'expirationDate', label: 'Expiration Date', sortable: true },
                {
                  key: 'ehrOwner',
                  label: 'EHR Owner',
                  sortable: true,
                  render: (_, row) => {
                    const guide = getGuideByAccount(guides, row.customer)
                    return guide?.ehr_owner || '-'
                  },
                },
                { key: 'status', label: 'Status', sortable: true },
              ]}
              data={model.credentials?.credentialsList || []}
              searchable
            />
          </ChartCard>
        </div>
      )}

      {activeTab === 'Requests' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Open EHR Requests"
              value={model.requests?.metrics?.openRequests ?? '--'}
              icon={ClipboardList}
            />
            <MetricCard
              title="Open Matrix Requests"
              value={model.requests?.metrics?.openMatrixRequests ?? '--'}
              icon={AlertCircle}
            />
            <MetricCard
              title="Closed This Week"
              value={model.requests?.metrics?.closedThisWeek ?? '--'}
              icon={ClipboardList}
            />
            <MetricCard
              title="Inactive Employee Requests"
              value={model.requests?.metrics?.inactiveEmployeeRequests ?? '--'}
              icon={Users}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Open EHR Requests by Week">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={model.requests?.weeklyOpenRequests || []}>
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
                <LineChart data={model.requests?.weeklyClosedRequests || []}>
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

          <ChartCard title="Open EHR Requests by Account">
            <DataTable
              columns={[
                { key: 'account', label: 'Account Name', sortable: true },
                { key: 'open', label: 'Open Requests', sortable: true },
                { key: 'matrix', label: 'Matrix Requests', sortable: true },
                {
                  key: 'ehrOwner',
                  label: 'EHR Owner',
                  sortable: true,
                  render: (_, row) => {
                    const guide = getGuideByAccount(guides, row.account)
                    return guide?.ehr_owner || '-'
                  },
                },
              ]}
              data={model.requests?.requestsByAccount || []}
              searchable
            />
          </ChartCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Open Requests by Task Status">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={model.requests?.requestsByStatus || []}>
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
                <BarChart data={model.requests?.requestsByEhrStatus || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <ChartCard title="EHR Requests for Inactive/Resigned Employees">
            <DataTable
              columns={[
                { key: 'name', label: 'Employee Name', sortable: true },
                { key: 'account', label: 'Account', sortable: true },
                { key: 'status', label: 'Request Status', sortable: true },
                { key: 'daysOpen', label: 'Days Open', sortable: true },
                { key: 'employeeStatus', label: 'Employee Status', sortable: true },
              ]}
              data={model.requests?.inactiveEmployeeRequests || []}
              searchable
            />
          </ChartCard>
        </div>
      )}

      {activeTab === 'Revocations' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard
              title="Open Revocations"
              value={model.revocations?.metrics?.openRevocations ?? '--'}
              icon={AlertCircle}
            />
            <MetricCard
              title="Closed This Week"
              value={model.revocations?.metrics?.closedThisWeek ?? '--'}
              icon={Shield}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Open EHR Revocations by Week">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={model.revocations?.weeklyRevocations || []}>
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
                <LineChart data={model.revocations?.weeklyRevocations || []}>
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
      )}

      {activeTab === 'Issues' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard
              title="Open EHR Issues"
              value={model.issues?.metrics?.openIssues ?? '--'}
              icon={AlertCircle}
            />
            <MetricCard
              title="Troubleshooting Tasks"
              value={model.issues?.metrics?.troubleshootingTasks ?? '--'}
              icon={ClipboardList}
            />
          </div>
          <ChartCard title="Open EHR Issue Tasks by Week">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={model.issues?.weeklyIssues || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="open" stroke="#ef4444" name="Open Issues" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
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
              data={model.issues?.issuesList || []}
              searchable
            />
          </ChartCard>
        </div>
      )}

      {activeTab === 'Team' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Open EHR Request Tasks by Assignee">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={model.team?.requestsByAssignee || []}>
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
                <LineChart data={model.team?.closedByWeek || []}>
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
          <ChartCard title="Task Actions Timeline">
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
              data={model.team?.taskActions || []}
              searchable
            />
          </ChartCard>
        </div>
      )}

      {activeTab === 'QA Okta' && (
        <div className="space-y-8">
          <ChartCard title="Active Accounts - Okta App & Process Guide Validation">
            <DataTable
              columns={[
                { key: 'account', label: 'Account Name', sortable: true },
                { key: 'oktaAppName', label: 'Okta App Name', sortable: true },
                { key: 'oktaAppStatus', label: 'Okta App Status', sortable: true },
                { key: 'ehrProcessGuide', label: 'EHR Process Guide', sortable: true },
                { key: 'ehrProcessGuideStatus', label: 'Process Guide Status', sortable: true },
                { key: 'clinicians', label: '# Clinicians', sortable: true },
                { key: 'ehrCredUsers', label: '# EHR Cred Users', sortable: true },
                { key: 'ratio', label: 'Ratio', sortable: true },
                { key: 'issues', label: 'Issues', sortable: true },
              ]}
              data={model.qaOkta?.oktaAppValidation || []}
              searchable
            />
          </ChartCard>

          <ChartCard title="Ratio of Current Clinicians : EHR Credentialed Users">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={model.qaOkta?.ratioData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="account" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ratio" fill="#3182ce" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Revocation Task Mismatches">
            <DataTable
              columns={[
                { key: 'mdsName', label: 'MDS Name', sortable: true },
                { key: 'account', label: 'Account', sortable: true },
                { key: 'revocationTask', label: 'Revocation Task', sortable: true },
                { key: 'revocationStatus', label: 'Revocation Status', sortable: true },
                { key: 'oktaAppStatus', label: 'Okta App Status', sortable: true },
                { key: 'daysSinceRevocation', label: 'Days Since Revocation', sortable: true },
              ]}
              data={model.qaOkta?.revocationMismatches || []}
              searchable
            />
          </ChartCard>

          <ChartCard title="Inactive Accounts with Active Okta Apps">
            <DataTable
              columns={[
                { key: 'account', label: 'Account Name', sortable: true },
                { key: 'oktaAppStatus', label: 'Okta App Status', sortable: true },
                { key: 'activeClinicians', label: 'Active Clinicians', sortable: true },
                { key: 'assignedUsers', label: 'Assigned Users', sortable: true },
                { key: 'lastActivity', label: 'Last Activity', sortable: true },
              ]}
              data={model.qaOkta?.inactiveAccounts || []}
              searchable
            />
          </ChartCard>
        </div>
      )}

      {activeTab === 'Process Docs' && (
        <div className="space-y-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-medical-primary">EHR Process Documentation</h1>
              <p className="text-gray-600 mt-2">Search and view process guides</p>
            </div>
            <button
              className="btn-primary"
              onClick={() => triggerQuery('createGuide')}
            >
              + Create Guide
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Account Name</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={model.processDocs?.filters?.account || ''}
                onChange={(e) => setProcessDocFilters({ account: e.target.value || undefined })}
                placeholder="Select an option"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">EHR Type</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={model.processDocs?.filters?.ehrType || ''}
                onChange={(e) => setProcessDocFilters({ ehrType: e.target.value || undefined })}
                placeholder="Select an option"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">EHR Team Member</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={model.processDocs?.filters?.owner || ''}
                onChange={(e) => setProcessDocFilters({ owner: e.target.value || undefined })}
                placeholder="Select an option"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Search</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={model.processDocs?.search || ''}
                onChange={(e) =>
                  setModel({
                    ...model,
                    processDocs: { ...model.processDocs, search: e.target.value },
                  })
                }
                placeholder="Search account, type, owner"
              />
            </div>
          </div>

          <DataTable
            columns={[
              {
                key: 'account_name',
                label: 'Account Name',
                sortable: true,
                render: (_, row) => (
                  <button
                    className="text-medical-primary hover:underline"
                    onClick={() =>
                      setModel({
                        ...model,
                        processDocs: {
                          ...model.processDocs,
                          selectedGuideId: row.account_sf_id || row.sfdc_account_id || row.account_name,
                        },
                      })
                    }
                  >
                    {row.account_name || 'Unknown'}
                  </button>
                ),
              },
              { key: 'ehr_type', label: 'EHR Type', sortable: true },
              { key: 'ehr_owner', label: 'EHR Team Member', sortable: true },
              { key: 'edited_by', label: 'Edited By', sortable: true },
              { key: 'edited_date', label: 'Edited Date', sortable: true },
              { key: 'estimated_turnaround_time', label: 'Est. TAT (Days)', sortable: true },
              { key: 'account_status', label: 'Account Status', sortable: true },
              { key: 'enterprise', label: 'Enterprise', sortable: true },
            ]}
            data={filteredGuides}
            searchable
          />

          {selectedGuide && (
            <ChartCard title={`Guide Details: ${selectedGuide.account_name}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">EHR Type</p>
                  <p className="font-medium text-gray-900">{selectedGuide.ehr_type || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">EHR Owner</p>
                  <p className="font-medium text-gray-900">{selectedGuide.ehr_owner || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Edited Date</p>
                  <p className="font-medium text-gray-900">{selectedGuide.edited_date || '-'}</p>
                </div>
              </div>
            </ChartCard>
          )}
        </div>
      )}

      {activeTab === 'Coordinator Portal' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="New Inbox Items" value={model.portal?.inbox?.length ?? 0} icon={Mail} />
            <MetricCard title="Open Requests" value={model.requests?.metrics?.openRequests ?? '--'} icon={ClipboardList} />
            <MetricCard title="Open Revocations" value={model.revocations?.metrics?.openRevocations ?? '--'} icon={Shield} />
            <MetricCard title="Overdue Follow-ups" value={model.portal?.reminders?.length ?? 0} icon={Bell} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Start a New Request">
              <div className="space-y-4">
                <button className="btn-primary" onClick={() => triggerQuery('createEhrRequest')}>
                  New EHR Request
                </button>
                <button className="btn-primary" onClick={() => triggerQuery('createEhrRevocation')}>
                  New EHR Revocation
                </button>
                <button className="btn-secondary" onClick={() => triggerQuery('openOktaAssignments')}>
                  Link to Okta App Assignments
                </button>
              </div>
            </ChartCard>

            <ChartCard title="Coordinator Inbox (EHR Admin Email)">
              <DataTable
                columns={[
                  { key: 'receivedAt', label: 'Received', sortable: true },
                  { key: 'subject', label: 'Subject', sortable: true },
                  { key: 'requester', label: 'Requester', sortable: true },
                  { key: 'type', label: 'Type', sortable: true },
                  { key: 'status', label: 'Status', sortable: true },
                  { key: 'daysOpen', label: 'Days Open', sortable: true },
                ]}
                data={model.portal?.inbox || []}
                searchable
              />
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Active EHR Request Queue">
              <DataTable
                columns={[
                  { key: 'taskId', label: 'Task ID', sortable: true },
                  { key: 'account', label: 'Account', sortable: true },
                  {
                    key: 'ehrOwner',
                    label: 'EHR Owner',
                    sortable: true,
                    render: (_, row) => {
                      const guide = getGuideByAccount(guides, row.account)
                      return guide?.ehr_owner || '-'
                    },
                  },
                  { key: 'mdsName', label: 'MDS Name', sortable: true },
                  { key: 'ehrSystem', label: 'EHR System', sortable: true },
                  { key: 'status', label: 'Status', sortable: true },
                  { key: 'assignee', label: 'Assignee', sortable: true },
                  { key: 'daysInStatus', label: 'Days in Status', sortable: true },
                ]}
                data={model.portal?.requestsQueue || []}
                searchable
              />
            </ChartCard>

            <ChartCard title="Active Revocation Queue">
              <DataTable
                columns={[
                  { key: 'taskId', label: 'Task ID', sortable: true },
                  { key: 'account', label: 'Account', sortable: true },
                  {
                    key: 'ehrOwner',
                    label: 'EHR Owner',
                    sortable: true,
                    render: (_, row) => {
                      const guide = getGuideByAccount(guides, row.account)
                      return guide?.ehr_owner || '-'
                    },
                  },
                  { key: 'mdsName', label: 'MDS Name', sortable: true },
                  { key: 'ehrSystem', label: 'EHR System', sortable: true },
                  { key: 'status', label: 'Status', sortable: true },
                  { key: 'assignee', label: 'Assignee', sortable: true },
                  { key: 'daysInStatus', label: 'Days in Status', sortable: true },
                ]}
                data={model.portal?.revocationQueue || []}
                searchable
              />
            </ChartCard>
          </div>

          <ChartCard title="Follow-up Reminders & Internal Coordinator Messages">
            <DataTable
              columns={[
                { key: 'reminderId', label: 'Reminder ID', sortable: true },
                { key: 'type', label: 'Type', sortable: true },
                { key: 'subject', label: 'Subject', sortable: true },
                { key: 'owner', label: 'Owner', sortable: true },
                { key: 'lastAction', label: 'Last Action', sortable: true },
                { key: 'status', label: 'Status', sortable: true },
                { key: 'daysSinceLastAction', label: 'Days Since Action', sortable: true },
              ]}
              data={model.portal?.reminders || []}
              searchable
            />
          </ChartCard>
        </div>
      )}
    </div>
  )
}
