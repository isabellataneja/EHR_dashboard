# EHR Dashboard - Augmedix

A comprehensive Electronic Health Record (EHR) management dashboard for tracking credentials, requests, revocations, and team performance.

## Features

### Main Dashboard
- Overview of key metrics (Active EHR Credentials, Open Requests, Revocations, Average TAT)
- EHR Credentials Maintenance table with drilldown capabilities
- Weekly trends for open and closed requests

### EHR Credentials Page
- Track active, expiring, and inactive credentials
- Credential status overview with pie chart
- Detailed credential listing with MDS information

### EHR Requests Page
- Open and closed request tracking
- Matrix request monitoring
- Requests by account, service provider, and status
- Inactive employee request alerts

### EHR Revocations Page
- Track open and closed revocations
- Weekly revocation trends

### EHR Issues Page
- Troubleshooting and reactivation issue tracking
- Issue status monitoring

### EHR Team Page
- Coordinator workload distribution
- Task closure tracking by assignee
- Task action timeline

### QA Okta Assignment Page
- Okta app and process guide validation
- Clinician to EHR credential ratio tracking
- Revocation task mismatches
- Inactive account monitoring

### Process Documentation Page
- EHR process guide library
- Account-specific documentation
- Processing times and escalation contacts

## Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Chart library for data visualization
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Data Integration

The dashboard currently uses mock data. To integrate with your data sources:

1. **Okta Data** (`okta_user_apps` table):
   - `apps_assigned` field filtered where `apps_assigned = EHR`
   - `last_login_date` - last time user accessed EHR through Okta
   - `app_assigned_date` - when EHR app was added
   - `app_unassigned_date` - when app was removed

2. **ClickUp Data** (`report_task_data` table):
   - EHR Request tasks from "All Site EHR Request" list
   - EHR Revocation tasks from "All Site EHR Revocation Master Tracker"
   - EHR Issue tasks from "EHR Issue Tracking" list

3. **Salesforce Data**:
   - Account information
   - Clinician data
   - Customer status and product information

## Design Theme

The dashboard uses a medical chic, professional design with:
- Primary color: Deep blue (#1e3a5f)
- Secondary color: Medium blue (#2c5282)
- Accent color: Bright blue (#3182ce)
- Success: Green (#10b981)
- Warning: Orange (#f59e0b)
- Danger: Red (#ef4444)

## Project Structure

```
EHR_dashboard/
├── app/
│   ├── page.tsx              # Main dashboard
│   ├── credentials/          # EHR Credentials page
│   ├── requests/             # EHR Requests page
│   ├── revocations/          # EHR Revocations page
│   ├── issues/               # EHR Issues page
│   ├── team/                 # EHR Team page
│   ├── qa-okta/              # QA Okta Assignment page
│   ├── process-docs/         # Process Documentation page
│   ├── layout.tsx            # Root layout
│   └── globals.css            # Global styles
├── components/
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── MetricCard.tsx        # Metric display card
│   ├── DataTable.tsx         # Reusable data table
│   └── ChartCard.tsx         # Chart container card
└── package.json
```

## Next Steps

1. Connect to actual data sources (Okta, ClickUp, Salesforce)
2. Implement authentication if needed
3. Add filtering and export functionality
4. Set up API routes for data fetching
5. Add real-time updates if required

## License

© 2026 Augmedix
