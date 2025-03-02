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
			{ name: 'Bench Press', value: 315, target: 425, unit: 'lbs' },
			{ name: 'Sleep Score', value: 85, target: 90, unit: '%' }
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
			{ name: 'Running', value: 15, target: 20, unit: 'miles/week' },
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
		bio: 'Entrepeuneru and startup founder.',
		company: 'Fake.Company',
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
		name: 'Ege Accelr8',
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
		name: 'Ocean French',
		github: 'jpark',
		customStats: [
			{ name: 'Squats', value: 225, target: 275, unit: 'lbs' },
			{ name: 'Languages Learning', value: 2, target: 3, unit: 'active' }
		],
		bio: 'Building a startup for AI in education',
		company: 'Will doesn\'t know',
		imagePath: '/residents/ocean.jpg'
	},
	{
		id: 'r13',
		name: 'Akshay Accelr8',
		github: 'sgarcia',
		customStats: [
			{ name: 'Networking Events', value: 2, target: 3, unit: '/month' },
			{ name: 'Design Projects', value: 3, target: 4, unit: '/quarter' }
		],
		bio: 'Building a startup as part of founders inc',
		company: 'Will doesn\'t know',
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

// Mock Competitive Stats
export const competitiveStats: CompetitiveStat[] = [
	// GitHub Commits (last 7 days for each resident)
	...[...Array(7)].flatMap((_, i) => {
		// Use a fixed date instead of dynamic date
		const date = new Date('2024-03-15');
		date.setDate(date.getDate() - i);
		const dateStr = date.toISOString().split('T')[0];

		return residents.map((resident, residentIndex) => ({
			residentId: resident.id,
			category: 'github_commits',
			// Use deterministic values based on resident index and day
			value: ((residentIndex + 1) * (i + 1)) % 10,
			date: dateStr
		}));
	}),

	// Workout days (last 7 days for each resident)
	...[...Array(7)].flatMap((_, i) => {
		// Use a fixed date instead of dynamic date
		const date = new Date('2024-03-15');
		date.setDate(date.getDate() - i);
		const dateStr = date.toISOString().split('T')[0];

		return residents.map((resident, residentIndex) => ({
			residentId: resident.id,
			category: 'workouts',
			// Use deterministic values based on resident index and day
			value: ((residentIndex + i) % 2),
			date: dateStr
		}));
	})
];

// Mock House Stats
export const houseStats: HouseStat[] = [
	{
		name: 'Total Social Media Followers',
		value: 42500,
		previousValue: 40200,
		unit: 'followers'
	},
	{
		name: 'House MRR',
		value: 83500,
		previousValue: 75000,
		unit: 'USD'
	},
	{
		name: 'Beers Consumed (Month)',
		value: 87,
		previousValue: 76,
		unit: 'beers'
	},
	{
		name: 'Pizza Ordered (Month)',
		value: 12,
		previousValue: 15,
		unit: 'pizzas'
	},
	{
		name: 'Coffee Brewed (Week)',
		value: 85,
		previousValue: 78,
		unit: 'cups'
	},
	{
		name: 'Avg. Sleep Score',
		value: 78,
		previousValue: 75,
		unit: '%'
	}
]; 