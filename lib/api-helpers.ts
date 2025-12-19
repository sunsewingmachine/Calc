/**
 * API Helper Functions
 * 
 * Common utilities for API route handlers
 */

import { NextRequest } from 'next/server'
import { getCurrentUser, getCurrentBranchId, canAccessBranch } from './auth'
import { unauthorizedResponse, forbiddenResponse, errorResponse } from './api-response'

/**
 * Get authenticated user or return error response
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    return { user: null, error: unauthorizedResponse() }
  }
  return { user, error: null }
}

/**
 * Get current branch ID or return error response
 */
export async function requireBranch() {
  const branchId = await getCurrentBranchId()
  if (!branchId) {
    return { branchId: null, error: errorResponse('Branch not selected', 'BRANCH_REQUIRED') }
  }
  return { branchId, error: null }
}

/**
 * Check if user can access a specific branch
 */
export async function requireBranchAccess(branchId: string) {
  const { user, error: authError } = await requireAuth()
  if (authError) return { allowed: false, error: authError }

  if (!user) {
    return { allowed: false, error: unauthorizedResponse() }
  }

  const canAccess = await canAccessBranch(user, branchId)
  if (!canAccess) {
    return { allowed: false, error: forbiddenResponse() }
  }

  return { allowed: true, error: null }
}

/**
 * Parse JSON body from request
 */
export async function parseJsonBody<T>(request: NextRequest): Promise<T | null> {
  try {
    const body = await request.json()
    return body as T
  } catch (error) {
    return null
  }
}






