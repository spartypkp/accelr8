import {
	ApplicationQueryOptions,
	createApplication,
	getApplications,
	getHouseIdFromSlug
} from '@/lib/api/applications';
import { getCacheHeaders } from '@/lib/api/shared/cache';
import { handleApiError } from '@/lib/api/shared/error';
import { withValidation } from '@/lib/api/shared/validation';
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';

// Schema for applications query parameters
const applicationsQuerySchema = z.object({
	houseId: z.string().optional(),
	status: z.enum(['submitted', 'reviewing', 'approved', 'rejected', 'all']).optional(),
	search: z.string().optional(),
	limit: z.coerce.number().optional(),
	offset: z.coerce.number().optional(),
	fromDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
		message: "Invalid date format for fromDate"
	}),
	toDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
		message: "Invalid date format for toDate"
	})
});

// Schema for application validation
const applicationSchema = z.object({
	personalInfo: z.object({
		firstName: z.string().min(1, "First name is required"),
		lastName: z.string().min(1, "Last name is required"),
		email: z.string().email("Invalid email address"),
		phone: z.string().min(10, "Phone number is required"),
		dob: z.string().refine(val => !isNaN(Date.parse(val)), {
			message: "Invalid date format for date of birth"
		})
	}),
	preferences: z.object({
		location: z.string().min(1, "Location is required"),
		roomType: z.string().min(1, "Room type is required"),
		moveInDate: z.string().refine(val => !isNaN(Date.parse(val)), {
			message: "Invalid date format for move-in date"
		}),
		duration: z.string().min(1, "Duration is required")
	}),
	background: z.object({
		role: z.string().min(1, "Role is required"),
		company: z.string().min(1, "Company is required"),
		linkedin: z.string().optional(),
		github: z.string().optional(),
		website: z.string().optional(),
		workDescription: z.string().min(1, "Work description is required"),
		goals: z.string().min(1, "Goals are required")
	}),
	additional: z.object({
		howHeard: z.string().min(1, "How you heard about us is required"),
		referredBy: z.string().optional(),
		knownResidents: z.string().optional(),
		dietaryRestrictions: z.string().optional(),
		additionalInfo: z.string().optional()
	})
});

/**
 * GET /api/applications - Get applications with optional filtering
 */
export async function GET(request: NextRequest) {
	try {
		// Parse and validate query parameters
		const { searchParams } = new URL(request.url);
		const validatedParams = await withValidation(
			applicationsQuerySchema,
			Object.fromEntries(searchParams)
		);

		// Fetch applications with provided filters
		const applications = await getApplications(validatedParams as ApplicationQueryOptions);

		return NextResponse.json(
			applications,
			getCacheHeaders('APPLICATION')
		);
	} catch (error) {
		return handleApiError(error);
	}
}

/**
 * POST /api/applications - Submit a new application
 */
export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();

		// Convert formData to structured object
		const applicationData = {
			personalInfo: {
				firstName: formData.get('personalInfo.firstName') as string,
				lastName: formData.get('personalInfo.lastName') as string,
				email: formData.get('personalInfo.email') as string,
				phone: formData.get('personalInfo.phone') as string,
				dob: formData.get('personalInfo.dob') as string
			},
			preferences: {
				location: formData.get('preferences.location') as string,
				roomType: formData.get('preferences.roomType') as string,
				moveInDate: formData.get('preferences.moveInDate') as string,
				duration: formData.get('preferences.duration') as string
			},
			background: {
				role: formData.get('background.role') as string,
				company: formData.get('background.company') as string,
				linkedin: formData.get('background.linkedin') as string || undefined,
				github: formData.get('background.github') as string || undefined,
				website: formData.get('background.website') as string || undefined,
				workDescription: formData.get('background.workDescription') as string,
				goals: formData.get('background.goals') as string
			},
			additional: {
				howHeard: formData.get('additional.howHeard') as string,
				referredBy: formData.get('additional.referredBy') as string || undefined,
				knownResidents: formData.get('additional.knownResidents') as string || undefined,
				dietaryRestrictions: formData.get('additional.dietaryRestrictions') as string || undefined,
				additionalInfo: formData.get('additional.additionalInfo') as string || undefined
			}
		};

		// Validate application data
		const validatedData = await withValidation(applicationSchema, applicationData);

		// Get house ID from location slug
		const houseId = await getHouseIdFromSlug(validatedData.preferences.location);

		// Create database application object
		const dbApplicationData = {
			house_id: houseId,
			preferred_move_in: validatedData.preferences.moveInDate,
			preferred_duration: validatedData.preferences.duration as "1-3 months" | "3-6 months" | "6-12 months" | "12+ months",
			status: 'submitted' as 'submitted',
			responses: validatedData
		};

		// Submit application to database
		const application = await createApplication(dbApplicationData);

		// Redirect to dashboard instead of thank-you page
		return NextResponse.redirect(new URL('/dashboard', request.url));
	} catch (error) {
		return handleApiError(error);
	}
} 