import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { items } from '@/db/schema'
import { eq, and, or, like } from 'drizzle-orm'
import { requireAuth } from '@/lib/api-helpers'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'
import { createItemSchema } from '@/types/item'

/**
 * GET /api/items
 * Get all items (optionally filtered)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { user, error: authError } = await requireAuth()
    if (authError) {
      return NextResponse.json(authError, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const isActive = searchParams.get('isActive')

    // Build query
    let query = db.select().from(items)

    const conditions = []
    
    if (isActive !== null) {
      conditions.push(eq(items.isActive, isActive === 'true'))
    }

    if (search) {
      conditions.push(
        or(
          like(items.name, `%${search}%`),
          like(items.displayName, `%${search}%`),
          like(items.sku, `%${search}%`)
        )!
      )
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions))
    }

    const allItems = await query.orderBy(items.name)

    return NextResponse.json(successResponse(allItems))
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      errorResponse('Failed to fetch items', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}

/**
 * POST /api/items
 * Create a new item
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { user, error: authError } = await requireAuth()
    if (authError) {
      return NextResponse.json(authError, { status: 401 })
    }

    // TODO: Check if user has permission to create items
    // All authenticated users can create items for now

    const body = await request.json()
    const validatedData = createItemSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        validationErrorResponse(
          'Invalid input data',
          validatedData.error.errors
        ),
        { status: 400 }
      )
    }

    const {
      name,
      displayName,
      sku,
      unit,
      taxPercent,
      defaultCostPrice,
      sellingPrice,
      wholesalePrice1,
      wholesalePrice2,
      warrantyMonths,
      freightIncluded,
    } = validatedData.data

    // Check if SKU is unique (if provided)
    if (sku) {
      const existing = await db
        .select()
        .from(items)
        .where(eq(items.sku, sku))
        .limit(1)

      if (existing.length > 0) {
        return NextResponse.json(
          errorResponse('SKU already exists', 'DUPLICATE_SKU'),
          { status: 400 }
        )
      }
    }

    // Create item
    const [newItem] = await db
      .insert(items)
      .values({
        name,
        displayName,
        sku: sku || null,
        unit: unit || null,
        taxPercent: taxPercent ? taxPercent.toString() : null,
        defaultCostPrice: defaultCostPrice ? defaultCostPrice.toString() : null,
        sellingPrice: sellingPrice ? sellingPrice.toString() : null,
        wholesalePrice1: wholesalePrice1 ? wholesalePrice1.toString() : null,
        wholesalePrice2: wholesalePrice2 ? wholesalePrice2.toString() : null,
        warrantyMonths: warrantyMonths || null,
        freightIncluded: freightIncluded ?? false,
      })
      .returning()

    return NextResponse.json(successResponse(newItem), { status: 201 })
  } catch (error) {
    console.error('Error creating item:', error)
    return NextResponse.json(
      errorResponse('Failed to create item', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}






