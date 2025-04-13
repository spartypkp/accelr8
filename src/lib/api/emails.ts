'use server';

import { createClient } from '../supabase/server';

/**
 * Sends an invitation email to a new resident through Supabase's email service
 */
export async function sendResidentInvitation(
	recipientEmail: string,
	recipientName: string,
	temporaryPassword: string,
	invitedByName: string
): Promise<{ success: boolean; error?: string; }> {
	try {
		const supabase = await createClient();

		// Using Supabase's email service
		// Note: This requires setting up email templates in Supabase
		const { error } = await supabase.auth.admin.inviteUserByEmail(recipientEmail, {
			data: {
				name: recipientName,
				invited_by: invitedByName,
				temp_password: temporaryPassword
			},
			redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`
		});

		if (error) {
			console.error('Error sending invitation email:', error);
			return {
				success: false,
				error: error.message
			};
		}

		return { success: true };
	} catch (error) {
		console.error('Failed to send invitation email:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
} 