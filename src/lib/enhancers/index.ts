/**
 * Calculate days difference between a date and now
 */
export function calculateDaysDifference(dateStr: string): number {
	const date = new Date(dateStr);
	const now = new Date();
	return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

// Export everything from all enhancer modules
export * from './applications';
export * from './events';
export * from './houses';
export * from './rooms';
export * from './users';
// Add these as they are implemented
// export * from './applications'; 