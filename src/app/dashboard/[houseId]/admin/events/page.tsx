import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, MoreHorizontal, Plus, Users } from 'lucide-react';

// Mock data
const EVENTS = [
	{
		id: '1',
		title: 'Founder Dinner',
		description: 'Weekly dinner with founders to discuss progress and challenges',
		location: 'Dining Room',
		date: '2023-08-18',
		time: '19:00-21:00',
		type: 'community',
		status: 'upcoming',
		attendees: 15,
		capacity: 20,
	},
	{
		id: '2',
		title: 'AI Hackathon',
		description: 'Weekend hackathon focused on AI applications',
		location: 'Common Area',
		date: '2023-08-26',
		time: '09:00-20:00',
		type: 'special',
		status: 'upcoming',
		attendees: 25,
		capacity: 30,
	},
	{
		id: '3',
		title: 'Web3 Workshop',
		description: 'Introduction to smart contracts and DeFi',
		location: 'Meeting Room',
		date: '2023-08-22',
		time: '18:00-20:00',
		type: 'educational',
		status: 'upcoming',
		attendees: 12,
		capacity: 15,
	},
	{
		id: '4',
		title: 'Game Night',
		description: 'Casual game night for house residents',
		location: 'Common Area',
		date: '2023-08-19',
		time: '20:00-23:00',
		type: 'social',
		status: 'upcoming',
		attendees: 8,
		capacity: 15,
	},
	{
		id: '5',
		title: 'Investor Office Hours',
		description: 'One-on-one sessions with venture partners',
		location: 'Meeting Room',
		date: '2023-08-21',
		time: '14:00-17:00',
		type: 'professional',
		status: 'upcoming',
		attendees: 10,
		capacity: 10,
	},
];

const PAST_EVENTS = [
	{
		id: '6',
		title: 'Welcome Mixer',
		description: 'Welcome event for new residents',
		location: 'Common Area',
		date: '2023-08-10',
		time: '19:00-22:00',
		type: 'social',
		status: 'completed',
		attendees: 18,
		capacity: 20,
	},
	{
		id: '7',
		title: 'Pitch Practice',
		description: 'Founders practice their pitches and get feedback',
		location: 'Meeting Room',
		date: '2023-08-15',
		time: '18:00-20:00',
		type: 'professional',
		status: 'completed',
		attendees: 12,
		capacity: 15,
	},
];

export default function EventsManagement({ params }: { params: { houseId: string; }; }) {
	const { houseId } = params;
	const today = new Date();

	// Combine all events for calendar view
	const allEvents = [...EVENTS, ...PAST_EVENTS];

	// Function to check if there's an event on a date
	const getEventsForDate = (date: Date) => {
		return allEvents.filter(event => {
			const eventDate = new Date(event.date);
			return isSameDay(eventDate, date);
		});
	};

	// For calendar day rendering
	const renderCalendarDay = (day: Date) => {
		const events = getEventsForDate(day);
		return events.length > 0 ? (
			<div className="relative">
				<span>{day.getDate()}</span>
				<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-1 bg-blue-500 rounded-t-md" />
			</div>
		) : day.getDate();
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Events Management</h1>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Create Event
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Upcoming Events
						</CardTitle>
						<CalendarIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{EVENTS.length}</div>
						<p className="text-xs text-muted-foreground mt-2">
							Next: {EVENTS.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].title} ({EVENTS[0].date})
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							RSVP Rate
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">78%</div>
						<Progress value={78} className="mt-2" />
						<p className="text-xs text-muted-foreground mt-2">
							70 RSVPs out of 90 capacity
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Events This Month
						</CardTitle>
						<CalendarIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{EVENTS.length + PAST_EVENTS.length}</div>
						<p className="text-xs text-muted-foreground mt-2">
							+3 compared to last month
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Average Attendance
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">82%</div>
						<Progress value={82} className="mt-2" />
						<p className="text-xs text-muted-foreground mt-2">
							Based on past 10 events
						</p>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="upcoming" className="space-y-4">
				<TabsList>
					<TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
					<TabsTrigger value="calendar">Calendar View</TabsTrigger>
					<TabsTrigger value="past">Past Events</TabsTrigger>
					<TabsTrigger value="drafts">Draft Events</TabsTrigger>
				</TabsList>

				<TabsContent value="upcoming">
					<Card>
						<CardHeader>
							<CardTitle>Upcoming Events</CardTitle>
							<CardDescription>
								View and manage scheduled events
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Event</TableHead>
										<TableHead>Date & Time</TableHead>
										<TableHead>Location</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>RSVPs</TableHead>
										<TableHead>Status</TableHead>
										<TableHead></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{EVENTS.map((event) => (
										<TableRow key={event.id}>
											<TableCell className="font-medium">{event.title}</TableCell>
											<TableCell>
												<div className="flex flex-col">
													<span>{event.date}</span>
													<span className="text-xs text-muted-foreground">{event.time}</span>
												</div>
											</TableCell>
											<TableCell>{event.location}</TableCell>
											<TableCell>
												<Badge
													variant="secondary"
													className={
														event.type === 'community' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
															event.type === 'special' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
																event.type === 'educational' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
																	event.type === 'social' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
																		'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
													}
												>
													{event.type.charAt(0).toUpperCase() + event.type.slice(1)}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="flex flex-col">
													<span>{event.attendees}/{event.capacity}</span>
													<Progress value={(event.attendees / event.capacity) * 100} className="h-1 mt-1" />
												</div>
											</TableCell>
											<TableCell>
												<Badge variant="outline" className="border-green-500 text-green-500">
													Scheduled
												</Badge>
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" className="h-8 w-8 p-0">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuLabel>Actions</DropdownMenuLabel>
														<DropdownMenuSeparator />
														<DropdownMenuItem>View Details</DropdownMenuItem>
														<DropdownMenuItem>Edit Event</DropdownMenuItem>
														<DropdownMenuItem>Manage RSVPs</DropdownMenuItem>
														<DropdownMenuItem>Send Reminder</DropdownMenuItem>
														<DropdownMenuItem>Cancel Event</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="calendar">
					<div className="grid gap-4 md:grid-cols-2">
						<Card className="col-span-1">
							<CardHeader>
								<CardTitle>Event Calendar</CardTitle>
								<CardDescription>
									Monthly view of all scheduled events
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Calendar
									mode="single"
									className="rounded-md border"
									selected={today}
								/>
							</CardContent>
						</Card>

						<Card className="col-span-1">
							<CardHeader>
								<CardTitle>Events for August 18, 2023</CardTitle>
								<CardDescription>
									Details of events on selected date
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex gap-4 p-4 border rounded-md">
										<div className="flex flex-col items-center justify-center bg-muted rounded-md p-3 w-16">
											<span className="text-sm font-medium">AUG</span>
											<span className="text-2xl font-bold">18</span>
										</div>
										<div className="flex-1">
											<h3 className="font-medium">Founder Dinner</h3>
											<div className="flex items-center text-sm text-muted-foreground mt-1">
												<Clock className="h-3 w-3 mr-1" />
												<span>19:00-21:00</span>
											</div>
											<div className="flex items-center text-sm text-muted-foreground mt-1">
												<Users className="h-3 w-3 mr-1" />
												<span>15/20 RSVPs</span>
											</div>
											<p className="text-sm mt-2">Weekly dinner with founders to discuss progress and challenges</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="past">
					<Card>
						<CardHeader>
							<CardTitle>Past Events</CardTitle>
							<CardDescription>
								View completed events
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Event</TableHead>
										<TableHead>Date & Time</TableHead>
										<TableHead>Location</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>Attendance</TableHead>
										<TableHead>Status</TableHead>
										<TableHead></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{PAST_EVENTS.map((event) => (
										<TableRow key={event.id}>
											<TableCell className="font-medium">{event.title}</TableCell>
											<TableCell>
												<div className="flex flex-col">
													<span>{event.date}</span>
													<span className="text-xs text-muted-foreground">{event.time}</span>
												</div>
											</TableCell>
											<TableCell>{event.location}</TableCell>
											<TableCell>
												<Badge
													variant="secondary"
													className={
														event.type === 'community' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
															event.type === 'special' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
																event.type === 'educational' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
																	event.type === 'social' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
																		'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
													}
												>
													{event.type.charAt(0).toUpperCase() + event.type.slice(1)}
												</Badge>
											</TableCell>
											<TableCell>{event.attendees}/{event.capacity}</TableCell>
											<TableCell>
												<Badge variant="default" className="bg-green-500">
													Completed
												</Badge>
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" className="h-8 w-8 p-0">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuLabel>Actions</DropdownMenuLabel>
														<DropdownMenuSeparator />
														<DropdownMenuItem>View Summary</DropdownMenuItem>
														<DropdownMenuItem>Attendance Report</DropdownMenuItem>
														<DropdownMenuItem>Send Follow-up</DropdownMenuItem>
														<DropdownMenuItem>Duplicate Event</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="drafts">
					<Card>
						<CardHeader>
							<CardTitle>Draft Events</CardTitle>
							<CardDescription>
								Edit and publish event drafts
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex h-[300px] items-center justify-center border rounded-md">
								<p className="text-sm text-muted-foreground">No draft events found</p>
							</div>
						</CardContent>
						<CardFooter>
							<Button>
								<Plus className="mr-2 h-4 w-4" />
								Create New Draft
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
} 