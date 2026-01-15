'use client'

import { useState } from 'react'

import { ReactNode } from 'react'

interface Column {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: Record<string, any>) => ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: Record<string, any>[]
  onRowClick?: (row: Record<string, any>) => void
  searchable?: boolean
  filterable?: boolean
}

export default function DataTable({ columns, data, onRowClick, searchable = false, filterable = false }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const filteredData = sortedData.filter((row) => {
    if (!searchTerm) return true
    return Object.values(row).some((value) => {
      if (value === null || value === undefined) return false
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return String(value).toLowerCase().includes(searchTerm.toLowerCase())
      }
      return false
    })
  })

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="flex justify-end">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary"
          />
        </div>
      )}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={column.sortable ? 'cursor-pointer hover:bg-medical-light/50' : ''}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && sortConfig?.key === column.key && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={onRowClick ? 'cursor-pointer' : ''}
                >
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render ? column.render(row[column.key], row) : (row[column.key] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {filteredData.length > 0 && (
        <div className="text-sm text-gray-600">
          Showing {filteredData.length} of {data.length} results
        </div>
      )}
    </div>
  )
}
