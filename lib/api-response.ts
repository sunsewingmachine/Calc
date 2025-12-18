/**
 * Standard API Response Utilities
 * 
 * Provides consistent response format for all API routes
 * Compatible with both web and mobile clients
 */

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: unknown
  }
}

export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  }
}

export function errorResponse(
  message: string,
  code?: string,
  details?: unknown
): ApiResponse {
  return {
    success: false,
    error: {
      message,
      code,
      details,
    },
  }
}

export function unauthorizedResponse(): ApiResponse {
  return errorResponse('Unauthorized', 'UNAUTHORIZED')
}

export function forbiddenResponse(): ApiResponse {
  return errorResponse('Forbidden', 'FORBIDDEN')
}

export function notFoundResponse(resource: string): ApiResponse {
  return errorResponse(`${resource} not found`, 'NOT_FOUND')
}

export function validationErrorResponse(
  message: string,
  details?: unknown
): ApiResponse {
  return errorResponse(message, 'VALIDATION_ERROR', details)
}


