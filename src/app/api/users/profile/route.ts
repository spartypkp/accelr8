import { NO_CACHE_HEADERS } from '@/lib/api/shared/cache';
import { handleApiError } from '@/lib/api/shared/error';
import { getCurrentUser } from '@/lib/api/users';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/users/profile - Get current user's profile
 */
export async function GET(request: NextRequest) {
	try {
		// Create Supabase client with cookies from request
		const supabase = await createClient();

		// Get the current user profile
		const profile = await getCurrentUser(supabase);

		if (!profile) {
			return NextResponse.json(
				{ error: 'Not authenticated' },
				{ status: 401 }
			);
		}

		// Don't cache this response as it's user-specific
		return NextResponse.json(
			profile,
			NO_CACHE_HEADERS
		);
	} catch (error) {
		return handleApiError(error);
	}
} 