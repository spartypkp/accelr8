import {
	getApplicationById,
	updateApplicationStatus
} from '@/lib/api/applications';
import { getCacheHeaders } from '@/lib/api/shared/cache';
import { handleApiError } from '@/lib/api/shared/error';
import { withValidation } from '@/lib/api/shared/validation';
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';

// Schema for application status update
const statusUpdateSchema = z.object({
	status: z.enum(['submitted', 'reviewing', 'approved', 'rejected'])
});

/**
 * GET /api/applications/[id] - Get an application by ID
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string; }; }
) {
	try {
		const { id } = params;

		// Fetch the application by ID
		const application = await getApplicationById(id);

		if (!application) {
			return NextResponse.json(
				{ error: 'Application not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			application,
			getCacheHeaders('APPLICATION')
		);
	} catch (error) {
		return handleApiError(error);
	}
}

/**
 * PATCH /api/applications/[id] - Update an application status
 */
export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string; }; }
) {
	try {
		const { id } = params;
		const body = await request.json();

		// Validate the request body
		const validatedData = await withValidation(statusUpdateSchema, body);

		// Update the application status
		const updatedApplication = await updateApplicationStatus(
			id,
			validatedData.status
		);

		return NextResponse.json(updatedApplication);
	} catch (error) {
		return handleApiError(error);
	}
} 