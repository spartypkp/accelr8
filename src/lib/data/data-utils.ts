import type { Announcement, Chore, CompetitiveStat, Event, HouseStat, Resident } from './mock-data';
import { announcements, chores, competitiveStats, events, houseStats, residents } from './mock-data';

// Use a fixed date for consistent rendering
const TODAY = '2024-03-15';

// Resident utilities
export function getResidentById(id: string): Resident | undefined {
	return residents.find(resident => resident.id === id);
}

export function getAllResidents(): Resident[] {
	return residents;
}

// Chore utilities
export function getChoresByResidentId(residentId: string): Chore[] {
	return chores.filter(chore => chore.assignedTo === residentId);
}

export function getTodaysChores(): Chore[] {
	// Use fixed date instead of dynamic date
	return chores.filter(chore => chore.dueDate.startsWith(TODAY));
}

// Event utilities
export function getUpcomingEvents(limit: number = 5): Event[] {
	// Use fixed date instead of dynamic date
	return events
		.filter(event => event.date >= TODAY)
		.sort((a, b) => a.date.localeCompare(b.date))
		.slice(0, limit);
}

// Announcement utilities
export function getLatestAnnouncements(limit: number = 3): Announcement[] {
	return [...announcements]
		.sort((a, b) => b.date.localeCompare(a.date))
		.slice(0, limit);
}

// Competitive stats utilities
export function getResidentStatsForCategory(residentId: string, category: string): CompetitiveStat[] {
	return competitiveStats
		.filter(stat => stat.residentId === residentId && stat.category === category)
		.sort((a, b) => a.date.localeCompare(b.date));
}

export function getLeaderboardForCategory(category: string, limit: number = 5): {
	residentId: string,
	residentName: string,
	totalValue: number;
}[] {
	// Group by resident and sum values
	const residentTotals = competitiveStats
		.filter(stat => stat.category === category)
		.reduce((acc, stat) => {
			if (!acc[stat.residentId]) {
				acc[stat.residentId] = 0;
			}
			acc[stat.residentId] += stat.value;
			return acc;
		}, {} as Record<string, number>);

	// Convert to array and sort
	return Object.entries(residentTotals)
		.map(([residentId, totalValue]) => {
			const resident = getResidentById(residentId);
			return {
				residentId,
				residentName: resident?.name || 'Unknown Resident',
				totalValue
			};
		})
		.sort((a, b) => b.totalValue - a.totalValue)
		.slice(0, limit);
}

// House stats utilities
export function getAllHouseStats(): HouseStat[] {
	return houseStats;
}

export function getHouseStatByName(name: string): HouseStat | undefined {
	return houseStats.find(stat => stat.name === name);
}

// Stats for 7-day workout tracking
export function getWorkoutStats(days: number = 7): {
	residentId: string,
	residentName: string,
	workoutDays: number[];
}[] {
	// Generate a fixed set of dates instead of using Date()
	const dates: string[] = [];
	for (let i = 0; i < days; i++) {
		// Construct dates based on the fixed TODAY value
		const date = new Date(TODAY);
		date.setDate(date.getDate() - i);
		dates.unshift(date.toISOString().split('T')[0]);
	}

	// Get workout stats for each resident
	return residents.map(resident => {
		// Get the workout value for each day
		const workoutDays = dates.map(date => {
			const stat = competitiveStats.find(
				s => s.residentId === resident.id &&
					s.category === 'workouts' &&
					s.date === date
			);
			return stat ? stat.value : 0;
		});

		return {
			residentId: resident.id,
			residentName: resident.name,
			workoutDays
		};
	});
}

// Stats for GitHub commits
export function getCommitStats(days: number = 7): {
	residentId: string,
	residentName: string,
	commitDays: { date: string, count: number; }[];
}[] {
	// Generate a fixed set of dates instead of using Date()
	const dates: string[] = [];
	for (let i = 0; i < days; i++) {
		// Construct dates based on the fixed TODAY value
		const date = new Date(TODAY);
		date.setDate(date.getDate() - i);
		dates.unshift(date.toISOString().split('T')[0]);
	}

	// Get commit stats for each resident
	return residents.map(resident => {
		// Get the commit value for each day
		const commitDays = dates.map(date => {
			const stat = competitiveStats.find(
				s => s.residentId === resident.id &&
					s.category === 'github_commits' &&
					s.date === date
			);
			return {
				date,
				count: stat ? stat.value : 0
			};
		});

		return {
			residentId: resident.id,
			residentName: resident.name,
			commitDays
		};
	});
} 