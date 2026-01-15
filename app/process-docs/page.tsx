'use client'

import { useEffect, useMemo, useState } from 'react'
import ChartCard from '@/components/ChartCard'
import DataTable from '@/components/DataTable'
import { FileText, Clock, Shield, ExternalLink } from 'lucide-react'

type GuideRecord = Record<string, string>

type TaskItem = {
  task?: string
  owner?: string
  system?: string
  resources?: string[]
}

const tabs = ['Overview', 'View Guide', 'Edit Guide', 'Runbook'] as const
type TabKey = (typeof tabs)[number]

function parseCsv(text: string) {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    const next = text[i + 1]

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"'
        i += 1
      } else if (char === '"') {
        inQuotes = false
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
      continue
    }

    if (char === ',') {
      row.push(field)
      field = ''
      continue
    }

    if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
      continue
    }

    if (char !== '\r') {
      field += char
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  const header = rows[0] || []
  const dataRows = rows.slice(1)
  return dataRows
    .filter((cols) => cols.some((value) => value.trim().length > 0))
    .map((cols) => {
      const obj: GuideRecord = {}
      header.forEach((key, idx) => {
        obj[key] = cols[idx] ?? ''
      })
      return obj
    })
}

function safeJsonParse(value: string) {
  if (!value || value.trim() === '') return null
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function parseTaskList(value: string): TaskItem[] {
  const parsed = safeJsonParse(value)
  if (!parsed || !Array.isArray(parsed)) return []
  return parsed
}

export default function ProcessDocsPage() {
  const [guides, setGuides] = useState<GuideRecord[]>([])
  const [activeTab, setActiveTab] = useState<TabKey>('Overview')
  const [selectedGuide, setSelectedGuide] = useState<GuideRecord | null>(null)
  const [accountFilter, setAccountFilter] = useState('')
  const [ehrTypeFilter, setEhrTypeFilter] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch('/data/ehr_process_guides_data.csv')
      const text = await response.text()
      setGuides(parseCsv(text))
    }
    loadData()
  }, [])

  const accountOptions = useMemo(() => {
    return Array.from(new Set(guides.map((g) => g.account_name).filter(Boolean))).sort()
  }, [guides])

  const ehrTypeOptions = useMemo(() => {
    return Array.from(new Set(guides.map((g) => g.ehr_type).filter(Boolean))).sort()
  }, [guides])

  const ownerOptions = useMemo(() => {
    return Array.from(new Set(guides.map((g) => g.ehr_owner).filter(Boolean))).sort()
  }, [guides])

  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      if (accountFilter && guide.account_name !== accountFilter) return false
      if (ehrTypeFilter && guide.ehr_type !== ehrTypeFilter) return false
      if (ownerFilter && guide.ehr_owner !== ownerFilter) return false
      if (searchTerm) {
        const haystack = [
          guide.account_name,
          guide.ehr_type,
          guide.ehr_owner,
          guide.edited_by,
          guide.customer_ehr_poc,
          guide.helpdesk_number,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return haystack.includes(searchTerm.toLowerCase())
      }
      return true
    })
  }, [guides, accountFilter, ehrTypeFilter, ownerFilter, searchTerm])

  const metrics = useMemo(() => {
    const total = guides.length
    const avgTAT = Math.round(
      guides
        .map((g) => Number(g.estimated_turnaround_time))
        .filter((n) => !Number.isNaN(n))
        .reduce((sum, n, _, arr) => (arr.length ? sum + n / arr.length : 0), 0) * 10
    ) / 10
    const ehrSystems = new Set(guides.map((g) => g.ehr_type).filter(Boolean))
    return {
      total,
      avgTAT: Number.isNaN(avgTAT) ? 0 : avgTAT,
      ehrSystems: ehrSystems.size,
    }
  }, [guides])

  const handleSelectGuide = (guide: GuideRecord) => {
    setSelectedGuide(guide)
    setActiveTab('View Guide')
  }

  const renderTaskList = (value: string) => {
    const tasks = parseTaskList(value)
    if (tasks.length === 0) {
      return <p className="text-sm text-gray-500">No runbook steps provided.</p>
    }
    return (
      <div className="space-y-3">
        {tasks.map((task, idx) => (
          <div key={`${task.task ?? 'task'}-${idx}`} className="border border-gray-200 rounded-md p-3">
            <p className="font-medium text-medical-primary">{task.task || 'Task'}</p>
            <div className="text-sm text-gray-600 mt-1 space-y-1">
              {task.owner && <p>Owner: {task.owner}</p>}
              {task.system && <p>System: {task.system}</p>}
              {task.resources && task.resources.length > 0 && (
                <div>
                  Resources:
                  <ul className="list-disc list-inside">
                    {task.resources.map((resource, rIdx) => (
                      <li key={`${resource}-${rIdx}`}>{resource}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-medical-primary">EHR Process Documentation</h1>
          <p className="text-gray-600 mt-2">
            View and manage EHR process guides with searchable, connected data.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setSelectedGuide(null)
            setActiveTab('Edit Guide')
          }}
        >
          + Create Guide
        </button>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-medical-primary" />
            <div>
              <p className="text-sm text-gray-600">Total Process Guides</p>
              <p className="text-2xl font-bold text-medical-primary">{metrics.total}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-medical-primary" />
            <div>
              <p className="text-sm text-gray-600">Avg Processing Time</p>
              <p className="text-2xl font-bold text-medical-primary">
                {metrics.avgTAT ? `${metrics.avgTAT} days` : '--'}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-medical-primary" />
            <div>
              <p className="text-sm text-gray-600">Active EHR Systems</p>
              <p className="text-2xl font-bold text-medical-primary">{metrics.ehrSystems}</p>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'Overview' && (
        <ChartCard title="EHR Process Guides">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Account Name</label>
              <select
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select an option</option>
                {accountOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">EHR Type</label>
              <select
                value={ehrTypeFilter}
                onChange={(e) => setEhrTypeFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select an option</option>
                {ehrTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">EHR Team Member</label>
              <select
                value={ownerFilter}
                onChange={(e) => setOwnerFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select an option</option>
                {ownerOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Search</label>
              <input
                type="text"
                placeholder="Search account, type, or owner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end mb-4">
            <button
              className="btn-secondary"
              onClick={() => {
                setAccountFilter('')
                setEhrTypeFilter('')
                setOwnerFilter('')
                setSearchTerm('')
              }}
            >
              Clear Filters
            </button>
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
                    onClick={() => handleSelectGuide(row)}
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
              {
                key: 'wfh_allowed',
                label: 'WFH Allowed',
                sortable: true,
                render: (value) => (value === 't' ? 'Yes' : value === 'f' ? 'No' : value || '-'),
              },
            ]}
            data={filteredGuides}
          />
        </ChartCard>
      )}

      {activeTab === 'View Guide' && (
        <ChartCard
          title={selectedGuide?.account_name ? `View Guide: ${selectedGuide.account_name}` : 'View Guide'}
          subtitle="Click an account in the overview table to load guide details."
        >
          {!selectedGuide ? (
            <p className="text-sm text-gray-600">Select a guide from the overview tab to view details.</p>
          ) : (
            <div className="space-y-6">
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
                <div>
                  <p className="text-gray-500">Account Manager</p>
                  <p className="font-medium text-gray-900">{selectedGuide.current_account_manager || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Helpdesk Number</p>
                  <p className="font-medium text-gray-900">{selectedGuide.helpdesk_number || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Account Status</p>
                  <p className="font-medium text-gray-900">{selectedGuide.account_status || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card">
                  <h3 className="text-sm font-semibold text-medical-primary">Customer EHR POC</h3>
                  <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                    {selectedGuide.customer_ehr_poc || '-'}
                  </p>
                </div>
                <div className="card">
                  <h3 className="text-sm font-semibold text-medical-primary">Request / Revocation POC</h3>
                  <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                    Request: {selectedGuide.request_ehr_customer_poc || '-'}
                  </p>
                  <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                    Revocation: {selectedGuide.revocation_ehr_customer_poc || '-'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card">
                  <h3 className="text-sm font-semibold text-medical-primary">Access & Maintenance</h3>
                  <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                    EHR URL: {selectedGuide.ehr_url || '-'}
                  </p>
                  <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                    EHR Credential Maintenance: {selectedGuide.ehr_cred_maintenance || '-'}
                  </p>
                  <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                    Limitations: {selectedGuide.limitations_for_number_of_credentials || '-'}
                  </p>
                  <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                    WFH Allowed: {selectedGuide.wfh_allowed === 't' ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="card">
                  <h3 className="text-sm font-semibold text-medical-primary">Account Details</h3>
                  <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                    SFDC Account ID: {selectedGuide.account_sf_id || selectedGuide.sfdc_account_id || '-'}
                  </p>
                  <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                    Enterprise: {selectedGuide.enterprise || '-'}
                  </p>
                  <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                    Service Provider Sites Blocked: {selectedGuide.service_provider_sites_blocked || '-'}
                  </p>
                  <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                    Required EHR Forms: {selectedGuide.required_ehr_forms || '-'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </ChartCard>
      )}

      {activeTab === 'Edit Guide' && (
        <ChartCard title={selectedGuide ? `Edit Guide: ${selectedGuide.account_name}` : 'Create Guide'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-xs font-semibold text-gray-600">EHR Process Guide Title</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                defaultValue={selectedGuide?.account_name || ''}
                placeholder="Enter value"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Created By</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                defaultValue={selectedGuide?.edited_by || ''}
                placeholder="Enter value"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Created Date</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                defaultValue={selectedGuide?.edited_date || ''}
                placeholder="MM DD, YYYY"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">EHR Owner</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                defaultValue={selectedGuide?.ehr_owner || ''}
                placeholder="Enter value"
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-medical-primary mb-2">Demographics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-xs font-semibold text-gray-600">EHR Type</label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                  defaultValue={selectedGuide?.ehr_type || ''}
                  placeholder="Enter value"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">EHR URL</label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                  defaultValue={selectedGuide?.ehr_url || ''}
                  placeholder="Enter value"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Estimated TAT (Days)</label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                  defaultValue={selectedGuide?.estimated_turnaround_time || ''}
                  placeholder="Enter value"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Account Status</label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                  defaultValue={selectedGuide?.account_status || ''}
                  placeholder="Enter value"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button className="btn-secondary">Cancel</button>
            <button className="btn-primary">Save Guide</button>
          </div>
        </ChartCard>
      )}

      {activeTab === 'Runbook' && (
        <ChartCard title={selectedGuide ? `Runbook: ${selectedGuide.account_name}` : 'Runbook'}>
          {!selectedGuide ? (
            <p className="text-sm text-gray-600">Select a guide to view runbook steps.</p>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-medical-primary mb-2">How to Request EHR Credentials</h3>
                {renderTaskList(selectedGuide.how_to_request_ehr_credentials)}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-medical-primary mb-2">Network Readiness</h3>
                {renderTaskList(selectedGuide.network_readiness)}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-medical-primary mb-2">EHR Access Troubleshooting</h3>
                {renderTaskList(selectedGuide.ehr_access_troubleshooting)}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-medical-primary mb-2">EHR Revocation Process</h3>
                {renderTaskList(selectedGuide.ehr_revocation_process)}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-medical-primary mb-2">How to Log In</h3>
                {renderTaskList(selectedGuide.how_to_log_in)}
              </div>
            </div>
          )}
        </ChartCard>
      )}

      <div className="card">
        <h3 className="text-lg font-semibold text-medical-primary mb-4">Quick Links</h3>
        <div className="space-y-2">
          <a
            href="https://docs.google.com/spreadsheets/d/1b7nZ7wdNcPAOKtcydzdx7rvb77wuLTPzVU3kGXwxjuo/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-medical-primary hover:text-medical-secondary"
          >
            <ExternalLink className="w-4 h-4" />
            <span>EHR Process Document Library (Google Sheets)</span>
          </a>
        </div>
      </div>
    </div>
  )
}
