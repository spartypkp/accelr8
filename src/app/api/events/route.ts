import { createEvent, getEvents } from '@/lib/api/events';
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
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled', 'all']).optional(),
	search: z.string().optional(),
	limit: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
	offset: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
}).passthrough();

// Input validation schema for creating an event
const eventInputSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	startDateTime: z.string().min(1, "Start date/time is required"),
	endDateTime: z.string().min(1, "End date/time is required"),
	location: z.string().optional(),
	houseId: z.string().optional(),
	operationalData: z.object({
		isMandatory: z.boolean().optional(),
		is_mandatory: z.boolean().optional(),
		max_participants: z.number().optional(),
		notes: z.string().optional(),
		status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
	}).optional(),
});

/**
 * GET /api/events
 * Get a list of events with filtering
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

		// Fetch events with filters
		const events = await getEvents({
			houseId: validatedParams.houseId,
			isGlobal: validatedParams.isGlobal,
			isPublic: validatedParams.isPublic,
			startDate: validatedParams.startDate,
			endDate: validatedParams.endDate,
			status: validatedParams.status,
			search: validatedParams.search,
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

/**
 * POST /api/events
 * Create a new event
 */
export async function POST(request: NextRequest) {
	try {
		// Parse and validate request body
		const body = await request.json();
		const validatedData = await withValidation(eventInputSchema, body);

		// Create the event
		const newEvent = await createEvent(validatedData);

		// Return the created event
		return NextResponse.json(newEvent, { status: 201 });
	} catch (error) {
		return handleApiError(error);
	}
} 