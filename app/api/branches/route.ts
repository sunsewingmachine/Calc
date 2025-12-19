import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { branches } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { requireAuth } from '@/lib/api-helpers'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'
import { createBranchSchema } from '@/types/branch'

/**
 * GET /api/branches
 * Get all branches (with optional filtering)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { user, error: authError } = await requireAuth()
    if (authError) {
      return NextResponse.json(authError, { status: 401 })
    }

    // For now, allow all authenticated users to see all branches
    // TODO: Implement proper branch access control based on role
    const allBranches = await db
      .select()
      .from(branches)
      .where(eq(branches.isActive, true))
      .orderBy(branches.name)

    return NextResponse.json(successResponse(allBranches))
  } catch (error) {
    console.error('Error fetching branches:', error)
    return NextResponse.json(
      errorResponse('Failed to fetch branches', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}

/**
 * POST /api/branches
 * Create a new branch
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { user, error: authError } = await requireAuth()
    if (authError) {
      return NextResponse.json(authError, { status: 401 })
    }

    // TODO: Check if user has permission to create branches (Owner only)
    // For now, allow all authenticated users

    const body = await request.json()
    const validatedData = createBranchSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        validationErrorResponse(
          'Invalid input data',
          validatedData.error.errors
        ),
        { status: 400 }
      )
    }

    const { name, code, address, phone, taxNumber } = validatedData.data

    // Check if code is unique (if provided)
    if (code) {
      const existing = await db
        .select()
        .from(branches)
        .where(eq(branches.code, code))
        .limit(1)

      if (existing.length > 0) {
        return NextResponse.json(
          errorResponse('Branch code already exists', 'DUPLICATE_CODE'),
          { status: 400 }
        )
      }
    }

    // Create branch
    const [newBranch] = await db
      .insert(branches)
      .values({
        name,
        code: code || null,
        address: address || null,
        phone: phone || null,
        taxNumber: taxNumber || null,
      })
      .returning()

    return NextResponse.json(successResponse(newBranch), { status: 201 })
  } catch (error) {
    console.error('Error creating branch:', error)
    return NextResponse.json(
      errorResponse('Failed to create branch', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}






