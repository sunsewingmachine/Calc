import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { warehouses } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { requireAuth, requireBranch } from '@/lib/api-helpers'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'
import { createWarehouseSchema } from '@/types/warehouse'

/**
 * GET /api/warehouses
 * Get all warehouses for current branch
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { user, error: authError } = await requireAuth()
    if (authError) {
      return NextResponse.json(authError, { status: 401 })
    }

    // Get branch context
    const { branchId, error: branchError } = await requireBranch()
    if (branchError) {
      return NextResponse.json(branchError, { status: 400 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')

    // Build query
    const conditions = [eq(warehouses.branchId, branchId)]
    
    if (isActive !== null) {
      conditions.push(eq(warehouses.isActive, isActive === 'true'))
    }

    const allWarehouses = await db
      .select()
      .from(warehouses)
      .where(and(...conditions))
      .orderBy(warehouses.name)

    return NextResponse.json(successResponse(allWarehouses))
  } catch (error) {
    console.error('Error fetching warehouses:', error)
    return NextResponse.json(
      errorResponse('Failed to fetch warehouses', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}

/**
 * POST /api/warehouses
 * Create a new warehouse for current branch
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { user, error: authError } = await requireAuth()
    if (authError) {
      return NextResponse.json(authError, { status: 401 })
    }

    // Get branch context
    const { branchId, error: branchError } = await requireBranch()
    if (branchError) {
      return NextResponse.json(branchError, { status: 400 })
    }

    // TODO: Check if user has permission to create warehouses
    // All authenticated users can create warehouses for now

    const body = await request.json()
    const validatedData = createWarehouseSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        validationErrorResponse(
          'Invalid input data',
          validatedData.error.errors
        ),
        { status: 400 }
      )
    }

    const { name } = validatedData.data

    // Create warehouse
    const [newWarehouse] = await db
      .insert(warehouses)
      .values({
        branchId,
        name,
      })
      .returning()

    return NextResponse.json(successResponse(newWarehouse), { status: 201 })
  } catch (error) {
    console.error('Error creating warehouse:', error)
    return NextResponse.json(
      errorResponse('Failed to create warehouse', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}






