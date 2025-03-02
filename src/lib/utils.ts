import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	}).format(date);
}

export function formatTime(timeString?: string): string {
	if (!timeString) return '';

	// Assuming timeString is in 24hr format like "14:30"
	const [hourStr, minuteStr] = timeString.split(':');
	const hour = parseInt(hourStr, 10);
	const minute = parseInt(minuteStr, 10);

	// Convert to 12hr format
	const period = hour >= 12 ? 'PM' : 'AM';
	const hour12 = hour % 12 || 12; // 0 should be displayed as 12

	return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
}

export function formatNumber(num: number): string {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + 'M';
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1) + 'K';
	}
	return num.toString();
}

export function calculatePercentage(value: number, target: number): number {
	if (target === 0) return 0;
	return Math.min(100, Math.round((value / target) * 100));
}

export function capitalize(str: string): string {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getPercentageChange(current: number, previous: number): {
	percentage: number;
	isPositive: boolean;
} {
	if (previous === 0) return { percentage: 0, isPositive: true };

	const change = current - previous;
	const percentage = Math.abs(Math.round((change / previous) * 100));

	return {
		percentage,
		isPositive: change >= 0
	};
}
