export interface Resident {
	id: string;
	name: string;
	avatar?: string;
	github?: string;
	bio?: string;
	company?: string;
	imagePath?: string;
	customStats: {
		name: string;
		value: number;
		target?: number;
		unit?: string;
	}[];
}

export interface Chore {
	id: string;
	name: string;
	assignedTo: string;
	completed: boolean;
	dueDate: string;
}

export interface Event {
	id: string;
	title: string;
	description?: string;
	date: string;
	time?: string;
}

export interface Announcement {
	id: string;
	title: string;
	content: string;
	priority: 'low' | 'medium' | 'high';
	date: string;
}

export interface CompetitiveStat {
	residentId: string;
	category: string;
	value: number;
	date: string;
}

export interface HouseStat {
	name: string;
	value: number;
	previousValue?: number;
	unit?: string;
	icon?: string;
}

// Mock Residents
export const residents: Resident[] = [
	{
		id: 'r1',
		name: 'Will Diamond',
		github: 'alexchendev',
		customStats: [
			{ name: 'Bench Press', value: 385, target: 425, unit: 'lbs' },
			{ name: 'Sleep Score', value: 92, target: 95, unit: '%' }
		],
		bio: 'Will is an AI engineer with a passion for building products that help people live better lives.',
		company: 'Latent Space',
		imagePath: '/residents/will.jpg'
	},
	{
		id: 'r2',
		name: 'Daniel Accelr8',
		github: 'jtaylor42',
		customStats: [
			{ name: 'Running', value: 18, target: 25, unit: 'miles/week' },
			{ name: 'Meditation', value: 5, target: 7, unit: 'days/week' }
		],
		bio: 'Creator and manager of Accelr8.',
		company: 'Accelr8',
		imagePath: '/residents/dan.jpg'
	},
	{
		id: 'r3',
		name: 'Pat Accelr8',
		github: 'samrod',
		customStats: [
			{ name: 'Calories', value: 2100, target: 2500, unit: 'kcal/day' },
			{ name: 'Books Read', value: 3, target: 12, unit: '/year' }
		],
		bio: 'Co-Creator and house manager of Accelr8.',
		company: 'Accelr8',
		imagePath: '/residents/pat.jpg'
	},
	{
		id: 'r4',
		name: 'Kuba Rogut',
		github: 'jwilson',
		customStats: [
			{ name: 'Code Reviews', value: 12, target: 15, unit: '/week' },
			{ name: 'Water', value: 65, target: 80, unit: 'oz/day' }
		],
		bio: 'Entrepeuneru and startup founder.',
		company: 'Karen.AI',
		imagePath: '/residents/kuba.jpg'
	},
	{
		id: 'r5',
		name: 'Conor Eagan',
		github: 'morganlee',
		customStats: [
			{ name: 'Commits', value: 28, target: 35, unit: '/week' },
			{ name: 'Pull-ups', value: 12, target: 20, unit: '/session' }
		],
		bio: 'Entrepreneur and startup founder.',
		company: 'Self Employed',
		imagePath: '/residents/conor.jpg'
	},
	// Adding more residents to reach a total of 15
	{
		id: 'r6',
		name: 'Brenda Godinez',
		github: 'caseyk',
		customStats: [
			{ name: 'Cold Showers', value: 3, target: 7, unit: '/week' },
			{ name: 'Bugs Fixed', value: 8, target: 10, unit: '/week' }
		],
		bio: 'Passionate about human health and longevity.',
		company: 'End Chronic Disease',
		imagePath: '/residents/brenda.jpg'
	},
	{
		id: 'r7',
		name: 'Aaron Bisla',
		github: 'rjohnson',
		customStats: [
			{ name: 'Podcast Episodes', value: 2, target: 4, unit: '/month' },
			{ name: 'Side Project Hours', value: 6, target: 10, unit: '/week' }
		],
		bio: 'Videographer and part of the Accelr8 management team.',
		company: 'Accelr8',
		imagePath: '/residents/aaron.jpg'
	},
	{
		id: 'r8',
		name: 'Ege Gunduz',
		github: 'asmith',
		customStats: [
			{ name: 'New Technologies', value: 2, target: 4, unit: '/quarter' },
			{ name: 'Blog Posts', value: 1, target: 2, unit: '/month' }
		],
		bio: 'Turkish guy - non technical founder of LiftOS.',
		company: 'LiftOS',

	},
	{
		id: 'r9',
		name: 'Jordan Rivera',
		github: 'trivera',
		customStats: [
			{ name: 'Deadlift', value: 275, target: 315, unit: 'lbs' },
			{ name: 'Pages Read', value: 35, target: 50, unit: '/day' }
		],
		bio: 'Sales guy chill af.',
		company: 'Will doesn\'t know',
		imagePath: '/residents/jordan.jpg'
	},
	{
		id: 'r10',
		name: 'Sourya Accelr8',
		github: 'rpatel',
		customStats: [
			{ name: 'Client Meetings', value: 5, target: 8, unit: '/week' },
			{ name: 'Revenue', value: 3200, target: 5000, unit: '$/month' }
		],
		bio: 'Doing some accelerator program - technical guy.',
		company: 'Will doesn\'t know'
	},
	{
		id: 'r11',
		name: 'Ba Khai Tran',
		github: 'qnguyen',
		customStats: [
			{ name: 'YouTube Videos', value: 3, target: 4, unit: '/month' },
			{ name: 'Subscribers', value: 2300, target: 5000, unit: 'total' }
		],
		bio: 'AI Entrepeuneur and founder',
		company: 'Will doesn\'t know',
		imagePath: '/residents/ba.jpg'
	},
	{
		id: 'r12',
		name: 'Ocean Droz',
		github: 'jpark',
		customStats: [
			{ name: 'Squats', value: 225, target: 275, unit: 'lbs' },
			{ name: 'Languages Learning', value: 2, target: 3, unit: 'active' }
		],
		bio: 'Building an AI assistant to revolutionize education.',
		company: 'Diane',
		imagePath: '/residents/ocean.jpg'
	},
	{
		id: 'r13',
		name: 'Akshay Iyer',
		github: 'sgarcia',
		customStats: [
			{ name: 'Networking Events', value: 2, target: 3, unit: '/month' },
			{ name: 'Design Projects', value: 3, target: 4, unit: '/quarter' }
		],
		bio: '\'Don\'t ask me hard hitting questions!\'',
		company: 'He Wish He Knew',
		imagePath: '/residents/akshay.jpg'
	},
	{
		id: 'r14',
		name: 'Unnamed Resident 2',
		github: 'dthompson',
		customStats: [
			{ name: 'Algorithm Problems', value: 12, target: 20, unit: '/week' },
			{ name: 'Steps', value: 7500, target: 10000, unit: '/day' }
		],
		bio: 'Fake bio!',
		company: 'Will doesn\'t know'
	},
	{
		id: 'r15',
		name: 'Unnamed Resident 3',
		github: 'cwhite',
		customStats: [
			{ name: 'Open Source PRs', value: 4, target: 8, unit: '/month' },
			{ name: 'New Connections', value: 15, target: 20, unit: '/month' }
		],
		bio: 'Fake bio!',
		company: 'Will doesn\'t know'
	}
];

// Mock Chores
export const chores: Chore[] = [
	{
		id: 'c1',
		name: 'Morning Dishes',
		assignedTo: 'r1',
		completed: false,
		dueDate: '2024-03-15'
	},
	{
		id: 'c2',
		name: 'Trash & Recycling',
		assignedTo: 'r2',
		completed: true,
		dueDate: '2024-03-15'
	},
	{
		id: 'c3',
		name: 'Cooking (Squad Member 1)',
		assignedTo: 'r3',
		completed: false,
		dueDate: '2024-03-15'
	},
	{
		id: 'c4',
		name: 'Cooking (Squad Member 2)',
		assignedTo: 'r4',
		completed: false,
		dueDate: '2024-03-15'
	},
	{
		id: 'c5',
		name: 'Cooking (Squad Member 3)',
		assignedTo: 'r5',
		completed: false,
		dueDate: '2024-03-15'
	}
];

// Mock Events
export const events: Event[] = [
	{
		id: 'e1',
		title: 'House Meeting',
		description: 'Weekly sync-up for all residents',
		date: '2024-03-15',
		time: '19:00'
	},
	{
		id: 'e2',
		title: 'VC Pitch Workshop',
		description: 'Learn how to pitch to investors',
		date: '2024-03-18',
		time: '14:00'
	},
	{
		id: 'e3',
		title: 'Group Workout',
		description: 'CrossFit session with Coach Mike',
		date: '2024-03-16',
		time: '07:00'
	},
	{
		id: 'e4',
		title: 'Tech Talk: AI & ML',
		description: 'Guest speaker from Google AI',
		date: '2024-03-20',
		time: '18:30'
	},
	{
		id: 'e5',
		title: 'Networking Dinner',
		description: 'With local startup founders',
		date: '2024-03-22',
		time: '19:00'
	}
];

// Mock Announcements
export const announcements: Announcement[] = [
	{
		id: 'a1',
		title: 'Internet Upgrade Tomorrow',
		content: 'We\'re upgrading to fiber! Expect brief outages between 2-4pm.',
		priority: 'medium',
		date: '2024-03-14'
	},
	{
		id: 'a2',
		title: 'New Resident Next Week',
		content: 'Please welcome Jessie, who\'ll be joining us from Toronto next Monday!',
		priority: 'low',
		date: '2024-03-13'
	},
	{
		id: 'a3',
		title: 'Water Outage Alert',
		content: 'Emergency maintenance on the building water system from 10pm-2am tonight.',
		priority: 'high',
		date: '2024-03-14'
	}
];

// Mock Competitive Stats - Update to make Will (r1) always win and cover longer time periods (30 days)
export const competitiveStats: CompetitiveStat[] = [
	// GitHub Commits (last 30 days for each resident)
	...[...Array(30)].flatMap((_, i) => {
		// Use a fixed date instead of dynamic date
		const date = new Date('2024-03-15');
		date.setDate(date.getDate() - i);
		const dateStr = date.toISOString().split('T')[0];

		return residents.map((resident) => {
			// Make Will always have the highest commit count
			let value;
			if (resident.id === 'r1') {
				// Will: higher commits with a pattern showing growth
				value = Math.floor(10 + (30 - i) / 3 + Math.sin(i / 3) * 3);
			} else {
				// Other residents: varied but always less than Will
				const baseValue = Math.floor(7 + Math.sin(i / 2 + parseInt(resident.id.substring(1))) * 4);
				value = Math.max(0, baseValue);
			}

			return {
				residentId: resident.id,
				category: 'github_commits',
				value,
				date: dateStr
			};
		});
	}),

	// Workout days (last 30 days for each resident)
	...[...Array(30)].flatMap((_, i) => {
		// Use a fixed date instead of dynamic date
		const date = new Date('2024-03-15');
		date.setDate(date.getDate() - i);
		const dateStr = date.toISOString().split('T')[0];

		return residents.map((resident) => {
			// Make Will always have the most consistent workout pattern
			let value;
			if (resident.id === 'r1') {
				// Will: works out almost every day (6-7 days per week)
				value = (i % 7 === 6) ? 0 : 1; // One rest day per week
			} else {
				// Other residents: less consistent patterns
				// Use resident ID in calculation to create different patterns for each resident
				const pattern = parseInt(resident.id.substring(1)) % 4;

				if (pattern === 0) {
					// 3 days on, 1 day off pattern
					value = (i % 4 < 3) ? 1 : 0;
				} else if (pattern === 1) {
					// Weekend warrior
					value = (i % 7 === 0 || i % 7 === 6) ? 1 : 0;
				} else if (pattern === 2) {
					// Every other day
					value = (i % 2 === 0) ? 1 : 0;
				} else {
					// Random but sparse pattern
					value = (Math.sin(i + parseInt(resident.id.substring(1))) > 0.7) ? 1 : 0;
				}
			}

			return {
				residentId: resident.id,
				category: 'workouts',
				value,
				date: dateStr
			};
		});
	})
];

// Mock House Stats - More interesting with higher contrasts
export const houseStats: HouseStat[] = [
	{
		name: 'Total Social Media Followers',
		value: 75800,
		previousValue: 52400,
		unit: 'followers'
	},
	{
		name: 'House MRR',
		value: 127500,
		previousValue: 83500,
		unit: 'USD'
	},
	{
		name: 'Beers Consumed (Month)',
		value: 187,
		previousValue: 120,
		unit: 'beers'
	},
	{
		name: 'Pizza Ordered (Month)',
		value: 28,
		previousValue: 12,
		unit: 'pizzas'
	},
	{
		name: 'Coffee Brewed (Week)',
		value: 185,
		previousValue: 125,
		unit: 'cups'
	},
	{
		name: 'Avg. Sleep Score',
		value: 83,
		previousValue: 72,
		unit: '%'
	},
	{
		name: 'Lines of Code Written',
		value: 189300,
		previousValue: 134500,
		unit: 'lines'
	},
	{
		name: 'Networking Hours',
		value: 215,
		previousValue: 176,
		unit: 'hours'
	},
	{
		name: 'Group Exercise Sessions',
		value: 47,
		previousValue: 32,
		unit: 'sessions'
	},
	{
		name: 'Collaborative Projects',
		value: 24,
		previousValue: 15,
		unit: 'projects'
	}
]; 