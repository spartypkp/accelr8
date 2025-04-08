import { getUpcomingEvents } from '@/lib/api/events';
import { getCacheHeaders } from '@/lib/api/shared/cache';
import { handleApiError } from '@/lib/api/shared/error';
import { withValidation } from '@/lib/api/shared/validation';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Query parameters validation schema
const querySchema = z.object({
	houseId: z.string().optional(),
	isGlobal: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
	isPublic: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
	limit: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
	offset: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
}).passthrough();

/**
 * GET /api/events/upcoming
 * Get upcoming events
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		// Validate and parse query parameters
		const validatedParams = await withValidation(
			querySchema,
			Object.fromEntries(searchParams)
		);

		// Get userId from session if available
		let userId;
		// TODO: Get user ID from session if we need to include participation data

		// Fetch upcoming events with filters
		const events = await getUpcomingEvents({
			houseId: validatedParams.houseId,
			isGlobal: validatedParams.isGlobal,
			isPublic: validatedParams.isPublic,
			limit: validatedParams.limit,
			offset: validatedParams.offset,
			userId
		});

		// Return events with caching headers
		return NextResponse.json(
			events,
			getCacheHeaders('EVENT')
		);
	} catch (error) {
		return handleApiError(error);
	}
} 