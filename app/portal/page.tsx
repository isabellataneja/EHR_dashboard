'use client'

import ChartCard from '@/components/ChartCard'
import DataTable from '@/components/DataTable'
import MetricCard from '@/components/MetricCard'
import { Mail, ClipboardList, Shield, Bell, UserCheck } from 'lucide-react'

const inboxData = [
  {
    receivedAt: '2026-01-14',
    subject: 'New EHR Request - Memorial Health',
    requester: 'memorial-ops@health.org',
    type: 'Request',
    status: 'New',
    daysOpen: 0,
  },
  {
    receivedAt: '2026-01-08',
    subject: 'EHR Revocation - City Hospital',
    requester: 'ehr-admin@city.org',
    type: 'Revocation',
    status: 'Pending Follow-up',
    daysOpen: 6,
  },
  {
    receivedAt: '2026-01-05',
    subject: 'EHR Access Issue - Regional Medical',
    requester: 'helpdesk@regional.org',
    type: 'Issue',
    status: 'In Progress',
    daysOpen: 9,
  },
]

const requestsQueue = [
  {
    taskId: 'EHR-REQ-1243',
    account: 'Memorial Health',
    mdsName: 'John Smith',
    ehrSystem: 'Epic',
    status: 'EHR Requested',
    assignee: 'Coordinator 1',
    daysInStatus: 2,
  },
  {
    taskId: 'EHR-REQ-1244',
    account: 'City Hospital',
    mdsName: 'Sarah Johnson',
    ehrSystem: 'Cerner',
    status: 'EHR Received - Pending Testing',
    assignee: 'Coordinator 2',
    daysInStatus: 4,
  },
]

const revocationQueue = [
  {
    taskId: 'EHR-REV-220',
    account: 'Regional Medical',
    mdsName: 'David Lee',
    ehrSystem: 'Epic',
    status: 'To Do',
    assignee: 'Coordinator 3',
    daysInStatus: 3,
  },
]

const reminders = [
  {
    reminderId: 'REM-001',
    type: 'Email Follow-up',
    subject: 'EHR Revocation - City Hospital',
    owner: 'Coordinator 2',
    lastAction: '2026-01-07',
    status: 'Overdue',
    daysSinceLastAction: 7,
  },
  {
    reminderId: 'REM-002',
    type: 'Credential Status Update',
    subject: 'EHR Request - Memorial Health',
    owner: 'Coordinator 1',
    lastAction: '2026-01-12',
    status: 'Due Soon',
    daysSinceLastAction: 2,
  },
]

export default function CoordinatorPortalPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-medical-primary">EHR Coordinator Portal</h1>
        <p className="text-gray-600 mt-2">
          Start new EHR requests or revocations, track inbox intake, and manage follow-ups.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="New Inbox Items" value="3" icon={Mail} />
        <MetricCard title="Open Requests" value="48" icon={ClipboardList} />
        <MetricCard title="Open Revocations" value="12" icon={Shield} />
        <MetricCard title="Overdue Follow-ups" value="5" icon={Bell} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Start a New Request">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Kick off a new EHR request and sync to Okta assignments.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="btn-primary text-left px-4 py-3">
                New EHR Request
              </button>
              <button className="btn-primary text-left px-4 py-3">
                New EHR Revocation
              </button>
              <button className="btn-secondary text-left px-4 py-3">
                Link to Okta App Assignments
              </button>
              <button className="btn-secondary text-left px-4 py-3">
                Link to CU EHR Request Form
              </button>
            </div>
            <div className="text-xs text-gray-500">
              Integration placeholder: connect to Okta and ClickUp to create tasks automatically.
            </div>
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
            data={inboxData}
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
              { key: 'mdsName', label: 'MDS Name', sortable: true },
              { key: 'ehrSystem', label: 'EHR System', sortable: true },
              { key: 'status', label: 'Status', sortable: true },
              { key: 'assignee', label: 'Assignee', sortable: true },
              { key: 'daysInStatus', label: 'Days in Status', sortable: true },
            ]}
            data={requestsQueue}
            searchable
          />
        </ChartCard>

        <ChartCard title="Active Revocation Queue">
          <DataTable
            columns={[
              { key: 'taskId', label: 'Task ID', sortable: true },
              { key: 'account', label: 'Account', sortable: true },
              { key: 'mdsName', label: 'MDS Name', sortable: true },
              { key: 'ehrSystem', label: 'EHR System', sortable: true },
              { key: 'status', label: 'Status', sortable: true },
              { key: 'assignee', label: 'Assignee', sortable: true },
              { key: 'daysInStatus', label: 'Days in Status', sortable: true },
            ]}
            data={revocationQueue}
            searchable
          />
        </ChartCard>
      </div>

      <ChartCard title="Follow-up Reminders & Internal Coordinator Messages">
        <div className="mb-4 text-sm text-gray-600">
          Auto-reminders trigger when no action is taken on an inbox item within 7 days.
          Coordinators can message each other and track follow-ups here.
        </div>
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
          data={reminders}
          searchable
        />
      </ChartCard>
    </div>
  )
}
