import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { parties } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { requireAuth, requireBranch } from '@/lib/api-helpers'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'
import { createPartySchema } from '@/types/party'

/**
 * GET /api/parties
 * Get all parties (optionally filtered by branch context)
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
    const partyType = searchParams.get('partyType')
    const isActive = searchParams.get('isActive')

    // Build query
    let query = db.select().from(parties)

    const conditions = []
    
    if (isActive !== null) {
      conditions.push(eq(parties.isActive, isActive === 'true'))
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions))
    }

    const allParties = await query.orderBy(parties.name)

    // Filter by party type if specified (client-side filter for array field)
    let filteredParties = allParties
    if (partyType) {
      filteredParties = allParties.filter((party) =>
        party.partyTypes.includes(partyType as any)
      )
    }

    return NextResponse.json(successResponse(filteredParties))
  } catch (error) {
    console.error('Error fetching parties:', error)
    return NextResponse.json(
      errorResponse('Failed to fetch parties', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}

/**
 * POST /api/parties
 * Create a new party
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { user, error: authError } = await requireAuth()
    if (authError) {
      return NextResponse.json(authError, { status: 401 })
    }

    // TODO: Check if user has permission to create parties
    // All authenticated users can create parties for now

    const body = await request.json()
    const validatedData = createPartySchema.safeParse(body)

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
      phone,
      email,
      address,
      taxNumber,
      taxType,
      partyTypes,
    } = validatedData.data

    // Create party
    const [newParty] = await db
      .insert(parties)
      .values({
        name,
        phone: phone || null,
        email: email || null,
        address: address || null,
        taxNumber: taxNumber || null,
        taxType: taxType || null,
        partyTypes: partyTypes as any,
      })
      .returning()

    return NextResponse.json(successResponse(newParty), { status: 201 })
  } catch (error) {
    console.error('Error creating party:', error)
    return NextResponse.json(
      errorResponse('Failed to create party', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}
