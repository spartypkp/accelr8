import { ApplicationData, getHouseIdFromSlug, submitApplication } from "@/lib/applications";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();

		// Extract personal info
		const firstName = formData.get('personalInfo.firstName') as string;
		const lastName = formData.get('personalInfo.lastName') as string;
		const email = formData.get('personalInfo.email') as string;
		const phone = formData.get('personalInfo.phone') as string;
		const dob = formData.get('personalInfo.dob') as string;

		// Extract preferences
		const location = formData.get('preferences.location') as string;
		const roomType = formData.get('preferences.roomType') as string;
		const moveInDate = formData.get('preferences.moveInDate') as string;
		const duration = formData.get('preferences.duration') as string;

		// Extract background
		const role = formData.get('background.role') as string;
		const company = formData.get('background.company') as string;
		const linkedin = formData.get('background.linkedin') as string || undefined;
		const github = formData.get('background.github') as string || undefined;
		const website = formData.get('background.website') as string || undefined;
		const workDescription = formData.get('background.workDescription') as string;
		const goals = formData.get('background.goals') as string;

		// Extract additional info
		const howHeard = formData.get('additional.howHeard') as string;
		const referredBy = formData.get('additional.referredBy') as string || undefined;
		const knownResidents = formData.get('additional.knownResidents') as string || undefined;
		const dietaryRestrictions = formData.get('additional.dietaryRestrictions') as string || undefined;
		const additionalInfo = formData.get('additional.additionalInfo') as string || undefined;

		// Get house ID from location slug
		const sanity_house_id = await getHouseIdFromSlug(location);

		// Create application data object
		const applicationData: ApplicationData = {
			sanity_house_id,
			preferred_move_in: moveInDate,
			preferred_duration: duration,
			status: 'submitted',
			responses: {
				personalInfo: {
					firstName,
					lastName,
					email,
					phone,
					dob,
				},
				preferences: {
					roomType,
				},
				background: {
					role,
					company,
					linkedin,
					github,
					website,
					workDescription,
					goals,
				},
				additional: {
					howHeard,
					referredBy,
					knownResidents,
					dietaryRestrictions,
					additionalInfo,
				},
			},
		};

		// Submit application to Supabase
		const application = await submitApplication(applicationData);

		// Redirect to thank you page
		return NextResponse.redirect(new URL('/apply/thank-you', request.url));
	} catch (error) {
		console.error('Application submission error:', error);
		return NextResponse.json(
			{ error: 'Failed to submit application' },
			{ status: 500 }
		);
	}
} 