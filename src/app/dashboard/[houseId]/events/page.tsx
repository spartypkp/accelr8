'use client';

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	CalendarDays,
	Filter,
	Map,
	MessageSquare,
	Plus,
	Search,
	ThumbsUp,
	Users
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

// Mock data for events
const mockEvents = [
	{
		id: 1,
		title: "Founder Pitch Practice",
		description: "Weekly session for founders to practice their pitches and get feedback from peers. Open to all house residents.",
		date: "2023-07-15T18:00:00",
		endDate: "2023-07-15T20:00:00",
		location: "Conference Room",
		type: "Workshop",
		organizer: "Maya Johnson",
		attendees: [
			{ id: 1, name: "Alex Chen", avatar: "/placeholder-user.jpg" },
			{ id: 2, name: "Jamie Smith", avatar: "/placeholder-user.jpg" },
			{ id: 3, name: "Taylor Wong", avatar: "/placeholder-user.jpg" },
			{ id: 4, name: "Jordan Lee", avatar: "/placeholder-user.jpg" },
			{ id: 5, name: "Sam Rodriguez", avatar: "/placeholder-user.jpg" },
			{ id: 6, name: "Maya Johnson", avatar: "/placeholder-user.jpg" },
			{ id: 7, name: "Casey Kim", avatar: "/placeholder-user.jpg" },
			{ id: 8, name: "Robin Patel", avatar: "/placeholder-user.jpg" },
		],
		capacity: 12,
		tags: ["Pitch Practice", "Feedback", "Networking"]
	},
	{
		id: 2,
		title: "Weekly House Meeting",
		description: "All-hands house meeting to discuss community updates, upcoming events, and address any issues or concerns.",
		date: "2023-07-16T19:30:00",
		endDate: "2023-07-16T20:30:00",
		location: "Common Area",
		type: "Meeting",
		organizer: "House Manager",
		attendees: [
			{ id: 1, name: "Alex Chen", avatar: "/placeholder-user.jpg" },
			{ id: 2, name: "Jamie Smith", avatar: "/placeholder-user.jpg" },
			{ id: 3, name: "Taylor Wong", avatar: "/placeholder-user.jpg" },
			// ... more attendees would be listed here
		],
		capacity: 30,
		tags: ["House Meeting", "Community", "Announcements"],
		required: true
	},
	{
		id: 3,
		title: "AI Hackathon Kickoff",
		description: "Weekend hackathon focused on building AI-powered applications. Prizes for the top projects!",
		date: "2023-07-22T10:00:00",
		endDate: "2023-07-23T18:00:00",
		location: "Coworking Space",
		type: "Hackathon",
		organizer: "Taylor Wong",
		attendees: [
			{ id: 1, name: "Alex Chen", avatar: "/placeholder-user.jpg" },
			{ id: 3, name: "Taylor Wong", avatar: "/placeholder-user.jpg" },
			{ id: 5, name: "Sam Rodriguez", avatar: "/placeholder-user.jpg" },
			{ id: 7, name: "Casey Kim", avatar: "/placeholder-user.jpg" },
			{ id: 8, name: "Robin Patel", avatar: "/placeholder-user.jpg" },
			// ... more attendees would be listed here
		],
		capacity: 25,
		tags: ["Hackathon", "AI", "Coding", "Projects"]
	},
	{
		id: 4,
		title: "Networking Mixer with VC Firm",
		description: "Special networking event with partners from Sequoia Capital. Great opportunity to pitch your startup and meet investors.",
		date: "2023-07-25T18:30:00",
		endDate: "2023-07-25T21:00:00",
		location: "Rooftop Deck",
		type: "Networking",
		organizer: "House Manager",
		attendees: [
			{ id: 2, name: "Jamie Smith", avatar: "/placeholder-user.jpg" },
			{ id: 4, name: "Jordan Lee", avatar: "/placeholder-user.jpg" },
			{ id: 6, name: "Maya Johnson", avatar: "/placeholder-user.jpg" },
			// ... more attendees would be listed here
		],
		capacity: 30,
		tags: ["Networking", "Investors", "VC", "Pitching"]
	},
	{
		id: 5,
		title: "Product Design Workshop",
		description: "Learn key principles of product design from industry experts. Hands-on workshop with practical exercises.",
		date: "2023-07-28T14:00:00",
		endDate: "2023-07-28T17:00:00",
		location: "Conference Room",
		type: "Workshop",
		organizer: "Maya Johnson",
		attendees: [
			{ id: 2, name: "Jamie Smith", avatar: "/placeholder-user.jpg" },
			{ id: 6, name: "Maya Johnson", avatar: "/placeholder-user.jpg" },
			{ id: 7, name: "Casey Kim", avatar: "/placeholder-user.jpg" },
			// ... more attendees would be listed here
		],
		capacity: 15,
		tags: ["Design", "Product", "Workshop", "Learning"]
	},
	{
		id: 6,
		title: "Game Night",
		description: "Casual game night to unwind and connect with fellow residents. Board games and snacks provided!",
		date: "2023-07-29T20:00:00",
		endDate: "2023-07-29T23:00:00",
		location: "Common Area",
		type: "Social",
		organizer: "Alex Chen",
		attendees: [
			{ id: 1, name: "Alex Chen", avatar: "/placeholder-user.jpg" },
			{ id: 3, name: "Taylor Wong", avatar: "/placeholder-user.jpg" },
			{ id: 5, name: "Sam Rodriguez", avatar: "/placeholder-user.jpg" },
			{ id: 8, name: "Robin Patel", avatar: "/placeholder-user.jpg" },
			// ... more attendees would be listed here
		],
		capacity: 20,
		tags: ["Social", "Games", "Fun", "Community"]
	}
];

// Event type options for filtering
const eventTypes = [
	"All Types",
	"Workshop",
	"Meeting",
	"Hackathon",
	"Networking",
	"Social",
	"Learning"
];

export default function EventsPage() {
	const params = useParams();
	const houseId = params?.houseId as string;
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [selectedType, setSelectedType] = useState("All Types");

	// In a real app, we'd fetch house data based on the houseId
	const houseName =
		houseId === "sf" ? "San Francisco House" :
			houseId === "nyc" ? "New York House" :
				houseId === "seattle" ? "Seattle House" :
					"Accelr8 House";

	// Filter events based on selected type
	const filteredEvents = selectedType === "All Types"
		? mockEvents
		: mockEvents.filter(event => event.type === selectedType);

	// Separate upcoming and past events
	const now = new Date();
	const upcomingEvents = filteredEvents.filter(event => new Date(event.date) > now);
	const pastEvents = filteredEvents.filter(event => new Date(event.date) <= now);

	return (
		<DashboardLayout>
			<div className="p-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
					<div>
						<h1 className="text-2xl font-bold">Events</h1>
						<p className="text-gray-500 dark:text-gray-400">{houseName}</p>
					</div>

					<div className="flex items-center space-x-2 mt-4 md:mt-0">
						<Button variant="outline" size="sm">
							<Filter className="h-4 w-4 mr-2" />
							Filter
						</Button>
						<Button size="sm">
							<Plus className="h-4 w-4 mr-2" />
							Propose Event
						</Button>
					</div>
				</div>

				<Tabs defaultValue="upcoming" className="space-y-6">
					<TabsList className="bg-gray-100 dark:bg-gray-800">
						<TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
						<TabsTrigger value="past">Past Events</TabsTrigger>
						<TabsTrigger value="calendar">Calendar View</TabsTrigger>
					</TabsList>

					{/* Filter Bar */}
					<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
						<div className="relative w-full max-w-xs">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
							<Input
								placeholder="Search events..."
								className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
							/>
						</div>

						<div className="flex flex-wrap gap-2">
							{eventTypes.map(type => (
								<Button
									key={type}
									variant={selectedType === type ? "default" : "outline"}
									size="sm"
									onClick={() => setSelectedType(type)}
								>
									{type}
								</Button>
							))}
						</div>
					</div>

					{/* Upcoming Events Tab */}
					<TabsContent value="upcoming">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{upcomingEvents.map((event) => (
								<Card key={event.id} className="overflow-hidden bg-white dark:bg-gray-900">
									<CardHeader className={`${event.required ? 'border-l-4 border-blue-500' : ''}`}>
										<div className="flex justify-between items-start">
											<CardTitle className="text-lg">{event.title}</CardTitle>
											<Badge>{event.type}</Badge>
										</div>
										<CardDescription>
											{new Date(event.date).toLocaleDateString('en-US', {
												weekday: 'long',
												month: 'short',
												day: 'numeric'
											})} • {new Date(event.date).toLocaleTimeString('en-US', {
												hour: 'numeric',
												minute: '2-digit',
												hour12: true
											})}
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<p className="text-sm text-gray-600 dark:text-gray-300">{event.description}</p>

										<div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
											<Map className="h-4 w-4 mr-2" />
											<span>{event.location}</span>
										</div>

										<div>
											<div className="flex items-center justify-between mb-2">
												<span className="text-xs font-medium text-gray-500 dark:text-gray-400">
													Attendees ({event.attendees.length}/{event.capacity})
												</span>
												<Button variant="ghost" size="sm" className="h-6 text-xs">View All</Button>
											</div>
											<div className="flex -space-x-2">
												{event.attendees.slice(0, 5).map((attendee) => (
													<Avatar key={attendee.id} className="h-6 w-6 border-2 border-white dark:border-gray-900">
														<AvatarImage src={attendee.avatar} alt={attendee.name} />
														<AvatarFallback>{attendee.name[0]}</AvatarFallback>
													</Avatar>
												))}
												{event.attendees.length > 5 && (
													<div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 text-xs border-2 border-white dark:border-gray-900">
														+{event.attendees.length - 5}
													</div>
												)}
											</div>
										</div>

										<div className="flex flex-wrap gap-2">
											{event.tags.map((tag, idx) => (
												<Badge key={idx} variant="outline">
													{tag}
												</Badge>
											))}
										</div>
									</CardContent>
									<CardFooter className="flex justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
										<Button variant="ghost" size="sm">
											<MessageSquare className="h-4 w-4 mr-2" />
											Comments
										</Button>
										<div className="flex gap-2">
											<Button variant="outline" size="sm">
												<ThumbsUp className="h-4 w-4 mr-2" />
												Interested
											</Button>
											<Button size="sm">RSVP</Button>
										</div>
									</CardFooter>
								</Card>
							))}
						</div>
					</TabsContent>

					{/* Past Events Tab */}
					<TabsContent value="past">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{pastEvents.map((event) => (
								<Card key={event.id} className="overflow-hidden bg-gray-50 dark:bg-gray-900/50">
									<CardHeader>
										<div className="flex justify-between items-start">
											<CardTitle className="text-lg">{event.title}</CardTitle>
											<Badge variant="outline">{event.type}</Badge>
										</div>
										<CardDescription>
											{new Date(event.date).toLocaleDateString('en-US', {
												weekday: 'long',
												month: 'short',
												day: 'numeric'
											})} • {new Date(event.date).toLocaleTimeString('en-US', {
												hour: 'numeric',
												minute: '2-digit',
												hour12: true
											})}
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<p className="text-sm text-gray-600 dark:text-gray-300">{event.description}</p>

										<div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
											<Map className="h-4 w-4 mr-2" />
											<span>{event.location}</span>
										</div>

										<div>
											<div className="flex items-center justify-between mb-2">
												<span className="text-xs font-medium text-gray-500 dark:text-gray-400">
													Attended ({event.attendees.length} residents)
												</span>
											</div>
											<div className="flex -space-x-2">
												{event.attendees.slice(0, 5).map((attendee) => (
													<Avatar key={attendee.id} className="h-6 w-6 border-2 border-white dark:border-gray-900">
														<AvatarImage src={attendee.avatar} alt={attendee.name} />
														<AvatarFallback>{attendee.name[0]}</AvatarFallback>
													</Avatar>
												))}
												{event.attendees.length > 5 && (
													<div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 text-xs border-2 border-white dark:border-gray-900">
														+{event.attendees.length - 5}
													</div>
												)}
											</div>
										</div>
									</CardContent>
									<CardFooter className="flex justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
										<Button variant="ghost" size="sm">
											<MessageSquare className="h-4 w-4 mr-2" />
											Discussion
										</Button>
										<Button variant="outline" size="sm">
											Photos & Recap
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					</TabsContent>

					{/* Calendar View Tab */}
					<TabsContent value="calendar">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<Card className="md:col-span-1">
								<CardHeader>
									<CardTitle>Calendar</CardTitle>
									<CardDescription>Select a date to view events</CardDescription>
								</CardHeader>
								<CardContent>
									<CalendarComponent
										mode="single"
										selected={date}
										onSelect={setDate}
										className="rounded-md border"
									/>

									<div className="mt-6 space-y-2">
										<h3 className="font-medium text-sm">Event Legend</h3>
										<div className="space-y-1">
											{['Workshop', 'Meeting', 'Hackathon', 'Networking', 'Social'].map((type) => (
												<div key={type} className="flex items-center">
													<div className={`h-3 w-3 rounded-full mr-2 bg-${type === 'Workshop' ? 'blue' : type === 'Meeting' ? 'green' : type === 'Hackathon' ? 'purple' : type === 'Networking' ? 'amber' : 'pink'}-500`}></div>
													<span className="text-sm text-gray-600 dark:text-gray-300">{type}</span>
												</div>
											))}
										</div>
									</div>
								</CardContent>
								<CardFooter>
									<Button className="w-full" asChild>
										<Link href={`/dashboard/${houseId}/events/create`}>
											<CalendarDays className="h-4 w-4 mr-2" />
											Create New Event
										</Link>
									</Button>
								</CardFooter>
							</Card>

							<Card className="md:col-span-2">
								<CardHeader>
									<CardTitle>
										{date ? (
											date.toLocaleDateString('en-US', {
												weekday: 'long',
												year: 'numeric',
												month: 'long',
												day: 'numeric'
											})
										) : 'Events'}
									</CardTitle>
									<CardDescription>
										{filteredEvents.length} events scheduled
									</CardDescription>
								</CardHeader>
								<CardContent className="max-h-[500px] overflow-y-auto">
									{filteredEvents.length > 0 ? (
										<div className="space-y-4">
											{filteredEvents.map((event) => (
												<div key={event.id} className="flex border-l-4 border-blue-500 pl-4 py-2">
													<div className="w-16 text-right mr-4">
														<span className="text-sm font-medium">
															{new Date(event.date).toLocaleTimeString('en-US', {
																hour: 'numeric',
																minute: '2-digit',
																hour12: true
															})}
														</span>
													</div>
													<div className="flex-1">
														<h3 className="font-medium">{event.title}</h3>
														<div className="flex items-center mt-1">
															<Map className="h-3 w-3 mr-1 text-gray-500" />
															<span className="text-xs text-gray-500">{event.location}</span>
															<Users className="h-3 w-3 ml-3 mr-1 text-gray-500" />
															<span className="text-xs text-gray-500">{event.attendees.length}/{event.capacity}</span>
														</div>
													</div>
													<Button size="sm" variant="ghost">Details</Button>
												</div>
											))}
										</div>
									) : (
										<div className="text-center py-8">
											<p className="text-gray-500 dark:text-gray-400">No events scheduled for this day</p>
											<Button variant="outline" className="mt-2">
												<Plus className="h-4 w-4 mr-2" />
												Create Event
											</Button>
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</DashboardLayout>
	);
} 