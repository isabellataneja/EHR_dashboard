# Retool Custom Component - EHR Dashboard

This file provides the Retool-specific entry point for the EHR Dashboard.

## Entry Component

- `retool/EhrDashboard.tsx`

## Props Contract

The component expects Retool to pass:

- `model`: all data + UI state
- `setModel(nextModel)`: to update UI state
- `triggerQuery(name, args)`: for write-back actions

## Suggested Queries (Retool)

- `createEhrRequest`
- `createEhrRevocation`
- `openOktaAssignments`
- `createGuide`

## Required Model Shape (example)

```json
{
  "activeTab": "Dashboard",
  "dashboard": {
    "metrics": {
      "activeCredentials": 1234,
      "openRequests": 48,
      "openRevocations": 12,
      "avgTatDays": 7.5
    },
    "weeklyOpenRequests": [],
    "openByProvider": [],
    "accounts": [],
    "activeAccounts": [],
    "inactiveAccounts": []
  },
  "processDocs": {
    "guides": [],
    "filters": {
      "account": "",
      "ehrType": "",
      "owner": ""
    },
    "search": "",
    "selectedGuideId": ""
  }
}
```
