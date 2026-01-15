'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Shield, 
  AlertCircle, 
  CheckCircle2,
  Settings,
  ClipboardList
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'EHR Credentials', href: '/credentials', icon: Shield },
  { name: 'EHR Requests', href: '/requests', icon: ClipboardList },
  { name: 'EHR Revocations', href: '/revocations', icon: AlertCircle },
  { name: 'EHR Issues', href: '/issues', icon: AlertCircle },
  { name: 'EHR Team', href: '/team', icon: Users },
  { name: 'Coordinator Portal', href: '/portal', icon: Settings },
  { name: 'QA Okta Assignment', href: '/qa-okta', icon: CheckCircle2 },
  { name: 'Process Documentation', href: '/process-docs', icon: FileText },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-medical-primary text-white flex flex-col">
      <div className="p-6 border-b border-medical-secondary">
        <h1 className="text-xl font-bold">EHR Dashboard</h1>
        <p className="text-sm text-gray-300 mt-1">Commure</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-medical-secondary text-white'
                  : 'text-gray-300 hover:bg-medical-secondary/50 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-medical-secondary">
        <div className="text-xs text-gray-400">
          © 2026 Commure
        </div>
      </div>
    </div>
  )
}
