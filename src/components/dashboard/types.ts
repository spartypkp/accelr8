/**
 * Common types for dashboard components
 */

// User type for dashboard components
export interface DashboardUser {
	id: string;
	email: string;
	name?: string;
	role: 'resident' | 'admin' | 'super_admin';
	profile?: {
		image?: {
			url: string;
		};
	};
}

// Props for components that need user data
export interface WithUserProps {
	user: DashboardUser;
} 