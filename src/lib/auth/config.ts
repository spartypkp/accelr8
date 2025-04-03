import { Permission } from './permissions';

/**
 * Configuration interface for routes
 */
export interface RouteConfig {
	// Path pattern (can include wildcards)
	path: string;

	// Is this route public (no auth required)
	public?: boolean;

	// Required permission for this route
	permission?: Permission;

	// Where to redirect if permission check fails
	fallbackUrl?: string;

	// Should the resource check be performed?
	// For routes like /dashboard/:houseId, we need to 
	// check if the user has access to the specific house
	requiresResourceCheck?: boolean;

	// Resource type for specific routes (house, event, etc.)
	resourceType?: 'house' | 'event' | 'resident' | 'maintenance';
}

/**
 * Route configuration for the application
 * Used by middleware for primary protection
 * Components can still use guards for more specific access checks
 */
export const routes: RouteConfig[] = [
	// Public routes
	{ path: '/', public: true },
	{ path: '/login', public: true },
	{ path: '/register', public: true },
	{ path: '/forgot-password', public: true },
	{ path: '/reset-password', public: true },
	{ path: '/houses', public: true },
	{ path: '/houses/*', public: true },
	{ path: '/story', public: true },
	{ path: '/apply', public: true },
	{ path: '/services', public: true },
	{ path: '/media', public: true },

	// Dashboard routes
	{
		path: '/dashboard',
		permission: 'view_house'
	},

	// House-specific dashboard routes
	{
		path: '/dashboard/:houseId',
		permission: 'view_house',
		requiresResourceCheck: true,
		resourceType: 'house'
	},
	{
		path: '/dashboard/:houseId/community',
		permission: 'view_residents',
		requiresResourceCheck: true,
		resourceType: 'house'
	},
	{
		path: '/dashboard/:houseId/events',
		permission: 'view_events',
		requiresResourceCheck: true,
		resourceType: 'house'
	},
	{
		path: '/dashboard/:houseId/resources',
		permission: 'view_resources',
		requiresResourceCheck: true,
		resourceType: 'house'
	},
	{
		path: '/dashboard/:houseId/maintenance',
		permission: 'view_maintenance_requests',
		requiresResourceCheck: true,
		resourceType: 'house'
	},
	{
		path: '/dashboard/:houseId/info',
		permission: 'view_house',
		requiresResourceCheck: true,
		resourceType: 'house'
	},
	{
		path: '/dashboard/:houseId/billing',
		permission: 'view_house',
		requiresResourceCheck: true,
		resourceType: 'house'
	},

	// Admin routes
	{
		path: '/admin',
		permission: 'access_admin'
	},

	// House-specific admin routes
	{
		path: '/admin/:houseId',
		permission: 'manage_house',
		requiresResourceCheck: true,
		resourceType: 'house'
	},
	{
		path: '/admin/:houseId/residents',
		permission: 'manage_residents',
		requiresResourceCheck: true,
		resourceType: 'house'
	},
	{
		path: '/admin/:houseId/operations',
		permission: 'manage_house',
		requiresResourceCheck: true,
		resourceType: 'house'
	},
	{
		path: '/admin/:houseId/events',
		permission: 'manage_events',
		requiresResourceCheck: true,
		resourceType: 'house'
	},
	{
		path: '/admin/:houseId/analytics',
		permission: 'view_analytics',
		requiresResourceCheck: true,
		resourceType: 'house'
	},
	{
		path: '/admin/:houseId/finances',
		permission: 'manage_finance',
		requiresResourceCheck: true,
		resourceType: 'house'
	},
	{
		path: '/admin/:houseId/communication',
		permission: 'manage_house',
		requiresResourceCheck: true,
		resourceType: 'house'
	},

	// Global admin routes for super admins
	{
		path: '/admin/expansion',
		permission: 'manage_all_houses'
	},
	{
		path: '/admin/analytics',
		permission: 'view_analytics'
	},
	{
		path: '/admin/settings',
		permission: 'manage_global_settings'
	},
];

/**
 * Get route configuration for a specific path
 */
export function getRouteConfig(path: string): RouteConfig | undefined {
	// Check for exact matches first
	const exactMatch = routes.find(route => route.path === path);
	if (exactMatch) return exactMatch;

	// Check for dynamic routes
	for (const route of routes) {
		// Convert route path pattern to regex
		const dynamicSegments = route.path
			.split('/')
			.map(segment => {
				if (segment.startsWith(':')) {
					return '([^/]+)'; // Match any character except /
				} else if (segment === '*') {
					return '.*'; // Match anything
				}
				return segment;
			})
			.join('/');

		const pattern = new RegExp(`^${dynamicSegments}$`);

		if (pattern.test(path)) {
			return route;
		}
	}

	return undefined;
}

/**
 * Extract parameters from a path based on a route pattern
 * e.g. for pattern "/dashboard/:houseId" and path "/dashboard/123",
 * returns { houseId: "123" }
 */
export function extractParams(pattern: string, path: string): Record<string, string> {
	const params: Record<string, string> = {};

	const patternParts = pattern.split('/');
	const pathParts = path.split('/');

	for (let i = 0; i < patternParts.length; i++) {
		if (patternParts[i].startsWith(':')) {
			const paramName = patternParts[i].substring(1);
			params[paramName] = pathParts[i];
		}
	}

	return params;
} 