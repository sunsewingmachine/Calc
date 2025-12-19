import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { paymentMethods } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { requireAuth, requireBranch } from '@/lib/api-helpers'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'
import { createPaymentMethodSchema } from '@/types/payment_method'

/**
 * GET /api/payment-methods
 * Get all payment methods for current branch
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
    const type = searchParams.get('type')
    const isActive = searchParams.get('isActive')

    // Build query
    const conditions = [eq(paymentMethods.branchId, branchId)]
    
    if (isActive !== null) {
      conditions.push(eq(paymentMethods.isActive, isActive === 'true'))
    }

    if (type) {
      conditions.push(eq(paymentMethods.type, type as any))
    }

    const allPaymentMethods = await db
      .select()
      .from(paymentMethods)
      .where(and(...conditions))
      .orderBy(paymentMethods.name)

    return NextResponse.json(successResponse(allPaymentMethods))
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    return NextResponse.json(
      errorResponse('Failed to fetch payment methods', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}

/**
 * POST /api/payment-methods
 * Create a new payment method for current branch
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

    // TODO: Check if user has permission to create payment methods
    // All authenticated users can create payment methods for now

    const body = await request.json()
    const validatedData = createPaymentMethodSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        validationErrorResponse(
          'Invalid input data',
          validatedData.error.errors
        ),
        { status: 400 }
      )
    }

    const { name, type, accountNumber, bankName, ifscCode } = validatedData.data

    // Validate bank account fields if type is bank_account
    if (type === 'bank_account') {
      if (!accountNumber || !bankName) {
        return NextResponse.json(
          errorResponse('Account number and bank name are required for bank accounts', 'VALIDATION_ERROR'),
          { status: 400 }
        )
      }
    }

    // Create payment method
    const [newPaymentMethod] = await db
      .insert(paymentMethods)
      .values({
        branchId,
        name,
        type: type as any,
        accountNumber: accountNumber || null,
        bankName: bankName || null,
        ifscCode: ifscCode || null,
      })
      .returning()

    return NextResponse.json(successResponse(newPaymentMethod), { status: 201 })
  } catch (error) {
    console.error('Error creating payment method:', error)
    return NextResponse.json(
      errorResponse('Failed to create payment method', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}






