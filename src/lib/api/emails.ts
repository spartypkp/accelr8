'use server';

import { createClient } from '../supabase/server';

/**
 * Sends an invitation email to a new resident using Supabase's magic link
 * This approach bypasses the admin.inviteUserByEmail method which requires special permissions
 */
export async function sendResidentInvitation(
	recipientEmail: string,
	recipientName: string,
	temporaryPassword: string,
	invitedByName: string
): Promise<{ success: boolean; error?: string; }> {
	try {
		const supabase = await createClient();

		// Generate a magic link with custom metadata
		const { error } = await supabase.auth.signInWithOtp({
			email: recipientEmail,
			options: {
				emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`,
				data: {
					name: recipientName,
					invited_by: invitedByName,
					temp_password: temporaryPassword,
					role: 'resident',
					onboarding_completed: false,
					invitation: true
				}
			}
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