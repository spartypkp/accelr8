import { getCacheHeaders } from '@/lib/api/shared/cache';
import { handleApiError } from '@/lib/api/shared/error';
import { deleteUser, getUser, updateUser } from '@/lib/api/users';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/users/[id] - Get a specific user
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string; }; }
) {
	try {
		// TODO: Add authorization check - only admins or the user themselves should have access

		const user = await getUser(params.id);

		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			user,
			getCacheHeaders('USER')
		);
	} catch (error) {
		return handleApiError(error);
	}
}

/**
 * PUT /api/users/[id] - Update a user
 */
export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string; }; }
) {
	try {
		// TODO: Add authorization check - only admins or the user themselves should have access

		const data = await request.json();

		const updatedUser = await updateUser(params.id, data);

		return NextResponse.json(updatedUser);
	} catch (error) {
		return handleApiError(error);
	}
}

/**
 * DELETE /api/users/[id] - Delete a user
 */
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string; }; }
) {
	try {
		// TODO: Add authorization check - only admins should have access

		const success = await deleteUser(params.id);

		return NextResponse.json({ success });
	} catch (error) {
		return handleApiError(error);
	}
} 