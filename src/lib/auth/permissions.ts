import { Resource, UserProfile, UserRole } from './types';

// Define all possible permissions in the system
export type Permission =
	// House access permissions
	| 'view_house'
	| 'manage_house'

	// Resident permissions
	| 'view_residents'
	| 'manage_residents'

	// Event permissions
	| 'view_events'
	| 'create_events'
	| 'edit_events'
	| 'delete_events'
	| 'manage_events'

	// Resource permissions
	| 'view_resources'
	| 'book_resources'
	| 'manage_resources'

	// Maintenance permissions
	| 'create_maintenance_request'
	| 'view_maintenance_requests'
	| 'manage_maintenance_requests'

	// Admin permissions
	| 'access_admin'
	| 'manage_applications'
	| 'view_analytics'
	| 'manage_finance'
	| 'manage_house_settings'

	// Super admin permissions
	| 'manage_all_houses'
	| 'manage_admins'
	| 'manage_global_settings';

/**
 * Get permissions based on user role
 */
export function getPermissions(role: UserRole): Permission[] {
	switch (role) {
		case 'super_admin':
			return [
				// House permissions
				'view_house',
				'manage_house',

				// Resident permissions
				'view_residents',
				'manage_residents',

				// Event permissions
				'view_events',
				'create_events',
				'edit_events',
				'delete_events',
				'manage_events',

				// Resource permissions
				'view_resources',
				'book_resources',
				'manage_resources',

				// Maintenance permissions
				'create_maintenance_request',
				'view_maintenance_requests',
				'manage_maintenance_requests',

				// Admin permissions
				'access_admin',
				'manage_applications',
				'view_analytics',
				'manage_finance',
				'manage_house_settings',

				// Super admin permissions
				'manage_all_houses',
				'manage_admins',
				'manage_global_settings'
			];

		case 'admin':
			return [
				// House permissions
				'view_house',
				'manage_house',

				// Resident permissions
				'view_residents',
				'manage_residents',

				// Event permissions
				'view_events',
				'create_events',
				'edit_events',
				'delete_events',
				'manage_events',

				// Resource permissions
				'view_resources',
				'book_resources',
				'manage_resources',

				// Maintenance permissions
				'create_maintenance_request',
				'view_maintenance_requests',
				'manage_maintenance_requests',

				// Admin permissions
				'access_admin',
				'manage_applications',
				'view_analytics',
				'manage_finance',
				'manage_house_settings'
			];

		case 'resident':
			return [
				// House permissions
				'view_house',

				// Resident permissions
				'view_residents',

				// Event permissions
				'view_events',

				// Resource permissions
				'view_resources',
				'book_resources',

				// Maintenance permissions
				'create_maintenance_request',
				'view_maintenance_requests'
			];

		default:
			return [];
	}
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: UserProfile | null, permission: Permission): boolean {
	if (!user) return false;

	const permissions = getPermissions(user.role);
	return permissions.includes(permission);
}

/**
 * Check if user can perform an action on a resource
 */
export function can(
	user: UserProfile | null,
	permission: Permission,
	resource?: Resource
): boolean {
	// First check basic permission
	if (!hasPermission(user, permission)) {
		return false;
	}

	// If no resource provided, just check the permission
	if (!resource) {
		return true;
	}

	// Handle resource-specific permission checks
	switch (resource.type) {
		case 'house':
			// Only check house-specific permissions if needed
			if (permission === 'manage_house' && user?.role !== 'super_admin') {
				// For non-super admins, check if they have access to this house
				// This would typically involve a database check, but we'll keep it simple
				return true; // The actual check is done in middleware
			}
			break;

		case 'maintenance':
			// For maintenance requests, residents can only manage their own
			if (permission === 'manage_maintenance_requests' && user?.role === 'resident') {
				return resource.userId === user.id;
			}
			break;

		// Add cases for other resource types as needed
	}

	// Default to allowing if we have the permission
	return true;
}

/**
 * Get a list of all available permissions for documentation
 */
export function getAllPermissions(): Permission[] {
	return [
		'view_house',
		'manage_house',
		'view_residents',
		'manage_residents',
		'view_events',
		'create_events',
		'edit_events',
		'delete_events',
		'manage_events',
		'view_resources',
		'book_resources',
		'manage_resources',
		'create_maintenance_request',
		'view_maintenance_requests',
		'manage_maintenance_requests',
		'access_admin',
		'manage_applications',
		'view_analytics',
		'manage_finance',
		'manage_house_settings',
		'manage_all_houses',
		'manage_admins',
		'manage_global_settings'
	];
}

/**
 * Get permissions grouped by category for UI display
 */
export function getPermissionsByCategory(): Record<string, Permission[]> {
	return {
		House: [
			'view_house',
			'manage_house',
			'manage_all_houses'
		],
		Residents: [
			'view_residents',
			'manage_residents'
		],
		Events: [
			'view_events',
			'create_events',
			'edit_events',
			'delete_events',
			'manage_events'
		],
		Resources: [
			'view_resources',
			'book_resources',
			'manage_resources'
		],
		Maintenance: [
			'create_maintenance_request',
			'view_maintenance_requests',
			'manage_maintenance_requests'
		],
		Administration: [
			'access_admin',
			'manage_applications',
			'view_analytics',
			'manage_finance',
			'manage_house_settings',
			'manage_admins',
			'manage_global_settings'
		]
	};
} 