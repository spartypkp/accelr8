import { createClient } from './client';

/**
 * Generic error handling for Supabase queries
 */
const handleQueryError = (error: any, context: string) => {
	console.error(`Error in ${context}:`, error);
	return null;
};

/**
 * Get the active residency for a user
 */
export async function getUserActiveResidency(userId: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from('residencies')
		.select('*')
		.eq('user_id', userId)
		.eq('status', 'active')
		.maybeSingle();

	if (error) {
		console.error('Error in getUserActiveResidency:', error);
		return null;
	}

	return data;
}

/**
 * Get houses that an admin manages
 */
export async function getAdminManagedHouses(userId: string) {
	try {
		const supabase = createClient();
		const { data, error } = await supabase
			.from("house_admins")
			.select("sanity_house_id")
			.eq("user_id", userId);

		if (error) {
			return handleQueryError(error, 'getAdminManagedHouses');
		}

		return data;
	} catch (error) {
		return handleQueryError(error, 'getAdminManagedHouses');
	}
}

/**
 * Check if a user has access to a specific house
 */
export async function checkHouseAccess(userId: string, houseId: string, role: string) {
	try {
		const supabase = createClient();

		// Check based on role
		if (role === 'admin') {
			const { data, error } = await supabase
				.from('house_admins')
				.select('*')
				.eq('user_id', userId)
				.eq('sanity_house_id', houseId)
				.single();

			if (error) {
				return handleQueryError(error, 'checkHouseAccess.admin');
			}

			return !!data;
		}

		if (role === 'resident') {
			const { data, error } = await supabase
				.from('residencies')
				.select('*')
				.eq('user_id', userId)
				.eq('sanity_house_id', houseId)
				.eq('status', 'active')
				.single();

			if (error) {
				return handleQueryError(error, 'checkHouseAccess.resident');
			}

			return !!data;
		}

		return false;
	} catch (error) {
		return handleQueryError(error, 'checkHouseAccess');
		return false;
	}
}

/**
 * Get all maintenance requests for a house
 */
export async function getHouseMaintenanceRequests(houseId: string) {
	try {
		const supabase = createClient();
		const { data, error } = await supabase
			.from("maintenance_requests")
			.select(`
        *,
        accelr8_users (
          id,
          name,
          avatar_url
        )
      `)
			.eq("sanity_house_id", houseId)
			.order("created_at", { ascending: false });

		if (error) {
			return handleQueryError(error, 'getHouseMaintenanceRequests');
		}

		return data;
	} catch (error) {
		return handleQueryError(error, 'getHouseMaintenanceRequests');
	}
}

/**
 * Create a new maintenance request
 */
export async function createMaintenanceRequest(requestData: any) {
	try {
		const supabase = createClient();
		const { data, error } = await supabase
			.from("maintenance_requests")
			.insert(requestData)
			.select()
			.single();

		if (error) {
			return { error: error.message };
		}

		return { data };
	} catch (error: any) {
		return { error: error.message };
	}
}

/**
 * Get house residents
 */
export async function getHouseResidents(houseId: string) {
	try {
		const supabase = createClient();
		const { data, error } = await supabase
			.from("residencies")
			.select(`
        *,
        accelr8_users (
          id,
          name,
          email,
          avatar_url,
          role
        )
      `)
			.eq("sanity_house_id", houseId)
			.eq("status", "active");

		if (error) {
			return handleQueryError(error, 'getHouseResidents');
		}

		return data;
	} catch (error) {
		return handleQueryError(error, 'getHouseResidents');
	}
} 