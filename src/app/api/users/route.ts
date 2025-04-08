import { getCacheHeaders } from '@/lib/api/shared/cache';
import { handleApiError } from '@/lib/api/shared/error';
import { createUser, getUsers, UserQueryOptions } from '@/lib/api/users';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/users - List all users with optional filtering
 */
export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;

		// Parse query parameters
		const options: UserQueryOptions = {};

		// Role filter
		const role = searchParams.get('role');
		if (role && ['resident', 'admin', 'super_admin', 'all'].includes(role as string)) {
			options.role = role as 'resident' | 'admin' | 'super_admin' | 'all';
		}

		// House filter
		const houseId = searchParams.get('houseId');
		if (houseId) options.houseId = houseId;

		// Search term
		const search = searchParams.get('search');
		if (search) options.search = search;

		// Pagination
		const limit = searchParams.get('limit');
		const offset = searchParams.get('offset');
		if (limit) options.limit = parseInt(limit, 10);
		if (offset) options.offset = parseInt(offset, 10);

		// Active flag
		const active = searchParams.get('active');
		if (active) options.active = active === 'true';

		// Fetch users with the parsed options
		const users = await getUsers(options);

		return NextResponse.json(
			users,
			getCacheHeaders('USER')
		);
	} catch (error) {
		return handleApiError(error);
	}
}

/**
 * POST /api/users - Create a new user
 */
export async function POST(request: NextRequest) {
	try {
		// TODO: Implement admin authorization check

		const data = await request.json();

		const newUser = await createUser(data);

		return NextResponse.json(
			newUser,
			{ status: 201 }
		);
	} catch (error) {
		return handleApiError(error);
	}
} 