import { deleteEvent, getEvent, updateEvent } from '@/lib/api/events';
import { getCacheHeaders } from '@/lib/api/shared/cache';
import { handleApiError } from '@/lib/api/shared/error';
import { withValidation } from '@/lib/api/shared/validation';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schema for updating an event
const eventUpdateSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	startDateTime: z.string().optional(),
	endDateTime: z.string().optional(),
	location: z.string().optional(),
	houseId: z.string().optional(),
	operationalData: z.object({
		isMandatory: z.boolean().optional(),
		is_mandatory: z.boolean().optional(),
		status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
		max_participants: z.number().optional(),
		current_participants: z.number().optional(),
		notes: z.string().optional(),
	}).optional(),
});

/**
 * GET /api/events/id
 * Get a single event by ID
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string; }; }
) {
	try {
		// Extract event ID from URL path segment
		const eventId = params.id;

		// Get userId from session if available
		let userId;
		// TODO: Get user ID from session if we need to include participation data

		// Fetch the event
		const event = await getEvent(eventId, userId);

		if (!event) {
			return NextResponse.json(
				{ error: 'Event not found' },
				{ status: 404 }
			);
		}

		// Return event with caching headers
		return NextResponse.json(
			event,
			getCacheHeaders('EVENT')
		);
	} catch (error) {
		return handleApiError(error);
	}
}

/**
 * PUT /api/events/id
 * Update an existing event
 */
export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string; }; }
) {
	try {
		// Extract event ID from URL path segment
		const eventId = params.id;

		// Parse and validate request body
		const body = await request.json();
		const validatedData = await withValidation(eventUpdateSchema, body);

		// Update the event
		try {
			const updatedEvent = await updateEvent(eventId, validatedData);

			// Return the updated event
			return NextResponse.json(updatedEvent);
		} catch (error: any) {
			// Handle specific error cases
			if (error.message === 'Event not found') {
				return NextResponse.json(
					{ error: 'Event not found' },
					{ status: 404 }
				);
			}

			if (error.message === 'Cannot update Sanity event through this API') {
				return NextResponse.json(
					{ error: error.message },
					{ status: 400 }
				);
			}

			throw error; // Let the generic error handler catch other errors
		}
	} catch (error) {
		return handleApiError(error);
	}
}

/**
 * DELETE /api/events/id
 * Delete an event
 */
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string; }; }
) {
	try {
		// Extract event ID from URL path segment
		const eventId = params.id;

		// Delete the event
		try {
			const success = await deleteEvent(eventId);

			// Return success response
			return NextResponse.json({ success });
		} catch (error: any) {
			// Handle specific error cases
			if (error.message === 'Event not found') {
				return NextResponse.json(
					{ error: 'Event not found' },
					{ status: 404 }
				);
			}

			if (error.message === 'Cannot delete Sanity event through this API') {
				return NextResponse.json(
					{ error: error.message },
					{ status: 400 }
				);
			}

			throw error; // Let the generic error handler catch other errors
		}
	} catch (error) {
		return handleApiError(error);
	}
} 