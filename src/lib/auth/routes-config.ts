/**
 * Minimal route configuration for authorization
 */

export type UserRole = 'resident' | 'admin' | 'super_admin';

export interface RouteConfig {
	path: string;
	public?: boolean;
	role?: UserRole;
	checkHouseAccess?: boolean;
	fallbackUrl?: string;
}

// Route configuration map
export const ROUTES: Record<string, RouteConfig> = {
	// Public routes
	HOME: { path: '/', public: true },
	ABOUT: { path: '/story', public: true },
	HOUSES: { path: '/houses', public: true },
	SERVICES: { path: '/services', public: true },
	EVENTS: { path: '/events', public: true },
	APPLY: { path: '/apply', public: true },
	MEDIA: { path: '/media', public: true },
	LOGIN: { path: '/login', public: true },
	REGISTER: { path: '/register', public: true },
	FORGOT_PASSWORD: { path: '/forgot-password', public: true },

	// Resident routes
	DASHBOARD: { path: '/dashboard', role: 'resident' },
	HOUSE_DASHBOARD: { path: '/dashboard/[houseId]', role: 'resident', checkHouseAccess: true },
	HOUSE_COMMUNITY: { path: '/dashboard/[houseId]/community', role: 'resident', checkHouseAccess: true },
	HOUSE_EVENTS: { path: '/dashboard/[houseId]/events', role: 'resident', checkHouseAccess: true },
	HOUSE_RESOURCES: { path: '/dashboard/[houseId]/resources', role: 'resident', checkHouseAccess: true },
	HOUSE_MAINTENANCE: { path: '/dashboard/[houseId]/maintenance', role: 'resident', checkHouseAccess: true },
	HOUSE_INFO: { path: '/dashboard/[houseId]/info', role: 'resident', checkHouseAccess: true },
	HOUSE_BILLING: { path: '/dashboard/[houseId]/billing', role: 'resident', checkHouseAccess: true },

	// Admin routes
	HOUSE_ADMIN: { path: '/admin/[houseId]', role: 'admin', checkHouseAccess: true },
	HOUSE_RESIDENTS: { path: '/admin/[houseId]/residents', role: 'admin', checkHouseAccess: true },
	HOUSE_OPERATIONS: { path: '/admin/[houseId]/operations', role: 'admin', checkHouseAccess: true },
	HOUSE_ADMIN_EVENTS: { path: '/admin/[houseId]/events', role: 'admin', checkHouseAccess: true },
	HOUSE_ANALYTICS: { path: '/admin/[houseId]/analytics', role: 'admin', checkHouseAccess: true },
	HOUSE_FINANCES: { path: '/admin/[houseId]/finances', role: 'admin', checkHouseAccess: true },
	HOUSE_COMMUNICATION: { path: '/admin/[houseId]/communication', role: 'admin', checkHouseAccess: true },

	// Super admin routes
	ADMIN_DASHBOARD: { path: '/admin', role: 'super_admin' },
	ADMIN_EXPANSION: { path: '/admin/expansion', role: 'super_admin' },
	ADMIN_ANALYTICS: { path: '/admin/analytics', role: 'super_admin' },
	ADMIN_SETTINGS: { path: '/admin/settings', role: 'super_admin' }
};

/**
 * Extract parameters from a path pattern and actual path
 * e.g., extractParams('/houses/[houseId]', '/houses/123') returns { houseId: '123' }
 */
export function extractParams(pattern: string, path: string): Record<string, string> {
	const patternParts = pattern.split('/');
	const pathParts = path.split('/');
	const params: Record<string, string> = {};

	for (let i = 0; i < patternParts.length; i++) {
		const patternPart = patternParts[i];

		if (patternPart.startsWith('[') && patternPart.endsWith(']')) {
			const paramName = patternPart.slice(1, -1);
			params[paramName] = pathParts[i];
		}
	}

	return params;
}

/**
 * Check if a path matches a pattern
 */
function matchPathPattern(pattern: string, path: string): boolean {
	const patternParts = pattern.split('/');
	const pathParts = path.split('/');

	if (patternParts.length !== pathParts.length) return false;

	for (let i = 0; i < patternParts.length; i++) {
		const patternPart = patternParts[i];

		// Skip parameter parts (they always match)
		if (patternPart.startsWith('[') && patternPart.endsWith(']')) continue;

		// Static parts must match exactly
		if (patternPart !== pathParts[i]) return false;
	}

	return true;
}

/**
 * Get route configuration for a specific path
 */
export function getRouteConfig(path: string): RouteConfig | undefined {
	// First try exact match
	const exactRoute = Object.values(ROUTES).find(route => route.path === path);
	if (exactRoute) return exactRoute;

	// Then try patterns with parameters
	return Object.values(ROUTES).find(route =>
		route.path.includes('[') && matchPathPattern(route.path, path)
	);
} 