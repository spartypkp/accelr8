/**
 * Type definitions for the Accelr8 auth system
 * Centralizing types here makes it easier to maintain and import them
 */

// User roles supported by the system
export type UserRole = 'resident' | 'admin' | 'super_admin';

// User profile interface
export interface UserProfile {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	profile: {
		image: {
			url: string;
		};
	};
}

// Resource types that permissions can apply to
export type ResourceType = 'house' | 'event' | 'resident' | 'application' | 'maintenance';

// Resource interface for permission checking
export interface Resource {
	id: string;
	type: ResourceType;
	[key: string]: any; // Additional properties
} 