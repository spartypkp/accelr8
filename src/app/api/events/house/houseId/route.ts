import { getHouseEvents } from '@/lib/api/events';
import { getCacheHeaders } from '@/lib/api/shared/cache';
import { handleApiError } from '@/lib/api/shared/error';
import { withValidation } from '@/lib/api/shared/validation';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Query parameters validation schema
const querySchema = z.object({
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled', 'all']).optional(),
	limit: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
	offset: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
}).passthrough();

/**
 * GET /api/events/house/[houseId]
 * Get events for a specific house
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: { houseId: string; }; }
) {
	try {
		const { searchParams } = new URL(request.url);
		const houseId = params.houseId;

		// Validate and parse query parameters
		const validatedParams = await withValidation(
			querySchema,
			Object.fromEntries(searchParams)
		);

		// Get userId from session if available
		let userId;
		// TODO: Get user ID from session if we need to include participation data

		// Fetch house events with filters
		const events = await getHouseEvents(houseId, {
			startDate: validatedParams.startDate,
			endDate: validatedParams.endDate,
			status: validatedParams.status,
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