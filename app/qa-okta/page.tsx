'use client'

import ChartCard from '@/components/ChartCard'
import DataTable from '@/components/DataTable'
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data
const oktaAppValidation = [
  {
    account: 'Memorial Health',
    oktaAppName: 'Memorial Health - Epic',
    oktaAppStatus: 'Active',
    ehrProcessGuide: 'Memorial Health Process Guide',
    ehrProcessGuideStatus: 'Active',
    clinicians: 25,
    ehrCredUsers: 23,
    ratio: '92%',
    issues: 'None',
  },
  {
    account: 'City Hospital',
    oktaAppName: 'City Hospital - Cerner',
    oktaAppStatus: 'Active',
    ehrProcessGuide: 'City Hospital Process Guide',
    ehrProcessGuideStatus: 'Missing',
    clinicians: 18,
    ehrCredUsers: 18,
    ratio: '100%',
    issues: 'Missing Process Guide',
  },
  {
    account: 'Regional Medical',
    oktaAppName: 'Regional Medical - Epic',
    oktaAppStatus: 'Active',
    ehrProcessGuide: 'Regional Medical Process Guide',
    ehrProcessGuideStatus: 'Active',
    clinicians: 32,
    ehrCredUsers: 30,
    ratio: '94%',
    issues: 'None',
  },
]

const revocationMismatches = [
  {
    mdsName: 'Former Employee',
    account: 'Memorial Health',
    revocationTask: 'EHR-REV-001',
    revocationStatus: 'Complete',
    oktaAppStatus: 'Still Assigned',
    daysSinceRevocation: 15,
  },
]

const inactiveAccounts = [
  {
    account: 'Old Hospital',
    oktaAppStatus: 'Active',
    activeClinicians: 0,
    assignedUsers: 3,
    lastActivity: '2025-10-15',
  },
]

const ratioData = [
  { account: 'Memorial Health', ratio: 92 },
  { account: 'City Hospital', ratio: 100 },
  { account: 'Regional Medical', ratio: 94 },
  { account: 'Community Health', ratio: 80 },
]

export default function QAOktaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-medical-primary">QA Okta App Assignment</h1>
        <p className="text-gray-600 mt-2">Validate EHR app assignments and credential ratios</p>
      </div>

      <ChartCard 
        title="Active Accounts - Okta App & Process Guide Validation"
        subtitle="Identify missing or mismatched Okta EHR apps and process guides"
      >
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
          data={oktaAppValidation}
          searchable
        />
      </ChartCard>

      <ChartCard title="Ratio of Current Clinicians : EHR Credentialed Users">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ratioData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="account" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="ratio" fill="#3182ce" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard 
        title="Revocation Task Mismatches"
        subtitle="Revocation tasks created but EHR app still assigned in Okta"
      >
        <DataTable
          columns={[
            { key: 'mdsName', label: 'MDS Name', sortable: true },
            { key: 'account', label: 'Account', sortable: true },
            { key: 'revocationTask', label: 'Revocation Task', sortable: true },
            { key: 'revocationStatus', label: 'Revocation Status', sortable: true },
            { key: 'oktaAppStatus', label: 'Okta App Status', sortable: true },
            { key: 'daysSinceRevocation', label: 'Days Since Revocation', sortable: true },
          ]}
          data={revocationMismatches}
          searchable
        />
      </ChartCard>

      <ChartCard 
        title="Inactive Accounts with Active Okta Apps"
        subtitle="Accounts with no active clinicians but EHR app still active and assigned"
      >
        <DataTable
          columns={[
            { key: 'account', label: 'Account Name', sortable: true },
            { key: 'oktaAppStatus', label: 'Okta App Status', sortable: true },
            { key: 'activeClinicians', label: 'Active Clinicians', sortable: true },
            { key: 'assignedUsers', label: 'Assigned Users', sortable: true },
            { key: 'lastActivity', label: 'Last Activity', sortable: true },
          ]}
          data={inactiveAccounts}
          searchable
        />
      </ChartCard>
    </div>
  )
}
