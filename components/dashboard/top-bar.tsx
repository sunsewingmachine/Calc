'use client'

import { ReactNode } from 'react'
import { Bell, User, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TopBarProps {
  pageTitle?: string
  pageDescription?: string
  pageActions?: ReactNode
  showSearch?: boolean
}

export function TopBar({ pageTitle, pageDescription, pageActions, showSearch = true }: TopBarProps) {
  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-blue-600 border-b border-blue-700 z-40 flex items-center justify-between px-6 text-white">
      {/* Left side - Page info */}
      <div className="flex-1 min-w-0">
        {pageTitle && (
          <div>
            <h1 className="text-xl font-semibold truncate text-white">{pageTitle}</h1>
            {pageDescription && (
              <p className="text-sm text-blue-100 truncate">{pageDescription}</p>
            )}
          </div>
        )}
      </div>

      {/* Center - Search (optional, can be hidden on some pages) */}
      {showSearch && (
        <div className="flex-1 flex justify-center px-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 w-full bg-blue-500 border-blue-400 text-white placeholder:text-blue-200 focus:bg-blue-500"
            />
          </div>
        </div>
      )}

      {/* Right side - Common actions + Page-specific actions */}
      <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
        {/* Page-specific actions */}
        {pageActions}
        
        {/* Common actions */}
        <Button variant="ghost" size="icon" className="relative text-white hover:bg-blue-700">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
        <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
