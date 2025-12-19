'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Building2, Users, Package, CreditCard, Warehouse, Receipt, DollarSign, BarChart3, Settings, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Branches', href: '/dashboard/branches', icon: Building2 },
  { name: 'Parties', href: '/dashboard/parties', icon: Users },
  { name: 'Items', href: '/dashboard/items', icon: Package },
  { name: 'Payment Methods', href: '/dashboard/payment-methods', icon: CreditCard },
  { name: 'Warehouses', href: '/dashboard/warehouses', icon: Warehouse },
  { name: 'Transactions', href: '/dashboard/transactions', icon: Receipt },
  { name: 'Expenses', href: '/dashboard/expenses', icon: DollarSign },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
]

const bottomNavigation = [
  { name: 'Help', href: '/dashboard/help', icon: HelpCircle },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-blue-600 text-white flex flex-col h-screen fixed left-0 top-0 z-50">
          <div className="flex h-16 items-center px-6 border-b border-blue-700">
            <h1 className="text-xl font-bold">Accounts & Inventory</h1>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-white hover:bg-blue-700",
                      isActive && "bg-blue-500 text-white font-medium"
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-blue-700 space-y-1">
            {bottomNavigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-white hover:bg-blue-700",
                      isActive && "bg-blue-500 text-white font-medium"
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </div>
        </aside>

        {/* Main content with top bar */}
        <main className="flex-1 ml-64">
          {/* Top bar will be rendered by PageProvider in each page */}
          {/* Page content */}
          <div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}






