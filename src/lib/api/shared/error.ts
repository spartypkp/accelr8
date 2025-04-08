import { NextResponse } from 'next/server';

/**
 * Custom API error class with status code for HTTP responses
 */
export class ApiError extends Error {
	constructor(
		public message: string,
		public statusCode: number,
		public originalError?: unknown
	) {
		super(message);
		this.name = 'ApiError';
	}
}

/**
 * Standard error handler for API responses
 * Formats errors consistently and handles different error types
 */
export function handleApiError(error: unknown): NextResponse {
	console.error('API Error:', error);

	if (error instanceof ApiError) {
		return NextResponse.json(
			{ error: error.message },
			{ status: error.statusCode }
		);
	}

	// Handle Supabase errors
	if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
		const supabaseError = error as { code: string; message: string; };

		// Map specific Supabase error codes to appropriate HTTP status codes
		if (supabaseError.code === 'PGRST116') {
			return NextResponse.json(
				{ error: 'Resource not found' },
				{ status: 404 }
			);
		}

		if (supabaseError.code === '23505') {
			return NextResponse.json(
				{ error: 'Duplicate record' },
				{ status: 409 }
			);
		}

		// Default Supabase error
		return NextResponse.json(
			{ error: supabaseError.message },
			{ status: 400 }
		);
	}

	// Handle Sanity errors
	if (typeof error === 'object' && error !== null && 'statusCode' in error) {
		const sanityError = error as { statusCode: number; message?: string; details?: unknown; };

		return NextResponse.json(
			{
				error: sanityError.message || 'Sanity API error',
				details: sanityError.details
			},
			{ status: sanityError.statusCode }
		);
	}

	// Default error handling
	return NextResponse.json(
		{ error: 'An unexpected error occurred' },
		{ status: 500 }
	);
} 