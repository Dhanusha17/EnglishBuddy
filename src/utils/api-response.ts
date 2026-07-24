import { NextResponse } from 'next/server'

interface ApiResponseOptions {
  success: boolean
  message: string
  data?: any
  status?: number
  error?: any
  meta?: any // For pagination, etc.
}

export function apiResponse({
  success,
  message,
  data = null,
  status = 200,
  error = null,
  meta = null,
}: ApiResponseOptions) {
  return NextResponse.json(
    {
      success,
      message,
      data,
      meta,
      error,
    },
    { status }
  )
}

export function apiSuccess(data: any, message = 'Success', status = 200, meta = null) {
  return apiResponse({ success: true, message, data, status, meta })
}

export function apiError(message = 'An error occurred', status = 400, error = null) {
  return apiResponse({ success: false, message, status, error })
}
