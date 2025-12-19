'use client'

import { createContext, useContext, ReactNode } from 'react'
import { TopBar } from '@/components/dashboard/top-bar'

interface PageContextType {
  pageTitle?: string
  pageDescription?: string
  pageActions?: ReactNode
  showSearch?: boolean
}

const PageContext = createContext<PageContextType>({})

export function usePageContext() {
  return useContext(PageContext)
}

export function PageProvider({ 
  children, 
  pageTitle, 
  pageDescription, 
  pageActions,
  showSearch = true
}: { 
  children: ReactNode
  pageTitle?: string
  pageDescription?: string
  pageActions?: ReactNode
  showSearch?: boolean
}) {
  return (
    <PageContext.Provider value={{ pageTitle, pageDescription, pageActions, showSearch }}>
      <TopBar 
        pageTitle={pageTitle}
        pageDescription={pageDescription}
        pageActions={pageActions}
        showSearch={showSearch}
      />
      {children}
    </PageContext.Provider>
  )
}






