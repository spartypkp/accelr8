import { updateRsvp } from '@/lib/api/events';
import { handleApiError } from '@/lib/api/shared/error';
import { withValidation } from '@/lib/api/shared/validation';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schema for RSVP
const rsvpSchema = z.object({
	eventId: z.string().min(1, "Event ID is required"),
	status: z.enum(['attending', 'maybe', 'declined', 'no_response']),
});

/**
 * POST /api/events/rsvp
 * Update RSVP status for an event
 */
export async function POST(request: NextRequest) {
	try {
		// Parse and validate request body
		const body = await request.json();
		const validatedData = await withValidation(rsvpSchema, body);

		// Get the user ID from the session
		// TODO: Replace with actual auth implementation
		// This is a placeholder for now
		const userId = "current-user-id";
		if (!userId) {
			return NextResponse.json(
				{ error: 'Authentication required' },
				{ status: 401 }
			);
		}

		// Update RSVP status
		try {
			const updatedEvent = await updateRsvp({
				eventId: validatedData.eventId,
				userId,
				status: validatedData.status
			});

			// Return the updated event with participation data
			return NextResponse.json(updatedEvent);
		} catch (error: any) {
			// Handle specific error cases
			if (error.message === 'Event not found') {
				return NextResponse.json(
					{ error: 'Event not found' },
					{ status: 404 }
				);
			}

			if (error.message === 'Cannot RSVP to a Sanity-only event') {
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