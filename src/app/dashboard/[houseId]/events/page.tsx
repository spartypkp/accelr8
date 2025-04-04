'use client';

import { EventDetailsCard } from "@/components/dashboard/cards/EventDetailsCard";
import { EventsCard } from "@/components/dashboard/cards/EventsCard";
import { DashboardPanel } from "@/components/dashboard/panels/DashboardPanel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
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
import { useEffect, useState } from "react";

// Mock data for events - to be replaced with real API calls in the future
const mockEvents = [
	{
		id: "1",
		title: "Founder Pitch Practice",
		description: "Weekly session for founders to practice their pitches and get feedback from peers. Open to all house residents.",
		date: "2023-07-15T18:00:00",
		endDate: "2023-07-15T20:00:00",
		location: "Conference Room",
		type: "Workshop",
		organizer: "Maya Johnson",
		attendees: [
			{ id: "1", name: "Alex Chen", avatar: "/placeholder-user.jpg" },
			{ id: "2", name: "Jamie Smith", avatar: "/placeholder-user.jpg" },
			{ id: "3", name: "Taylor Wong", avatar: "/placeholder-user.jpg" },
			{ id: "4", name: "Jordan Lee", avatar: "/placeholder-user.jpg" },
			{ id: "5", name: "Sam Rodriguez", avatar: "/placeholder-user.jpg" },
			{ id: "6", name: "Maya Johnson", avatar: "/placeholder-user.jpg" },
			{ id: "7", name: "Casey Kim", avatar: "/placeholder-user.jpg" },
			{ id: "8", name: "Robin Patel", avatar: "/placeholder-user.jpg" },
		],
		capacity: 12,
		tags: ["Pitch Practice", "Feedback", "Networking"]
	},
	{
		id: "2",
		title: "Weekly House Meeting",
		description: "All-hands house meeting to discuss community updates, upcoming events, and address any issues or concerns.",
		date: "2023-07-16T19:30:00",
		endDate: "2023-07-16T20:30:00",
		location: "Common Area",
		type: "Meeting",
		organizer: "House Manager",
		attendees: [
			{ id: "1", name: "Alex Chen", avatar: "/placeholder-user.jpg" },
			{ id: "2", name: "Jamie Smith", avatar: "/placeholder-user.jpg" },
			{ id: "3", name: "Taylor Wong", avatar: "/placeholder-user.jpg" },
		],
		capacity: 30,
		tags: ["House Meeting", "Community", "Announcements"],
		required: true
	},
	{
		id: "3",
		title: "AI Hackathon Kickoff",
		description: "Weekend hackathon focused on building AI-powered applications. Prizes for the top projects!",
		date: "2023-07-22T10:00:00",
		endDate: "2023-07-23T18:00:00",
		location: "Coworking Space",
		type: "Hackathon",
		organizer: "Taylor Wong",
		attendees: [
			{ id: "1", name: "Alex Chen", avatar: "/placeholder-user.jpg" },
			{ id: "3", name: "Taylor Wong", avatar: "/placeholder-user.jpg" },
			{ id: "5", name: "Sam Rodriguez", avatar: "/placeholder-user.jpg" },
			{ id: "7", name: "Casey Kim", avatar: "/placeholder-user.jpg" },
			{ id: "8", name: "Robin Patel", avatar: "/placeholder-user.jpg" },
		],
		capacity: 25,
		tags: ["Hackathon", "AI", "Coding", "Projects"]
	},
	{
		id: "4",
		title: "Networking Mixer with VC Firm",
		description: "Special networking event with partners from Sequoia Capital. Great opportunity to pitch your startup and meet investors.",
		date: "2023-07-25T18:30:00",
		endDate: "2023-07-25T21:00:00",
		location: "Rooftop Deck",
		type: "Networking",
		organizer: "House Manager",
		attendees: [
			{ id: "2", name: "Jamie Smith", avatar: "/placeholder-user.jpg" },
			{ id: "4", name: "Jordan Lee", avatar: "/placeholder-user.jpg" },
			{ id: "6", name: "Maya Johnson", avatar: "/placeholder-user.jpg" },
		],
		capacity: 30,
		tags: ["Networking", "Investors", "VC", "Pitching"]
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
	const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
	const [userId, setUserId] = useState<string>("");

	// Get current user ID
	useEffect(() => {
		const fetchUserId = async () => {
			const supabase = createClient();
			const { data } = await supabase.auth.getUser();
			if (data.user) {
				setUserId(data.user.id);
			}
		};
		fetchUserId();
	}, []);

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

	// Handle selecting an event
	const handleSelectEvent = (eventId: string) => {
		setSelectedEventId(eventId);
	};

	// Handle RSVP actions
	const handleRSVP = (eventId: string, attending: boolean) => {
		// In a real app, we would update the database here
		console.log(`User ${userId} ${attending ? 'is attending' : 'is interested in'} event ${eventId}`);
	};

	return (
		<div className="container mx-auto py-6">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Events</h1>
					<p className="text-muted-foreground">{houseName}</p>
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

			{/* Overview Cards */}
			<DashboardPanel className="mb-8">
				<div className="lg:col-span-2">
					<EventsCard houseId={houseId} limit={5} />
				</div>
				<Card className="overflow-hidden">
					<CardHeader>
						<CardTitle className="text-base">Your Upcoming RSVPs</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						{upcomingEvents.length > 0 ? (
							<div className="divide-y">
								{upcomingEvents.slice(0, 3).map((event) => (
									<div key={event.id} className="p-4 hover:bg-muted/50 transition-colors">
										<div className="flex justify-between mb-1">
											<div className="font-medium">{event.title}</div>
											<Badge variant="outline">{event.type}</Badge>
										</div>
										<div className="text-sm text-muted-foreground flex items-center gap-1">
											<CalendarDays className="h-3 w-3" />
											<span>{new Date(event.date).toLocaleDateString()}</span>
										</div>
										<div className="mt-2">
											<Button variant="outline" size="sm" className="w-full"
												onClick={() => handleSelectEvent(event.id)}>
												View Details
											</Button>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center p-8 text-center">
								<CalendarDays className="h-8 w-8 text-muted-foreground/60 mb-3" />
								<p className="text-sm text-muted-foreground mb-3">You haven't RSVP'd to any events yet</p>
								<Button variant="outline" size="sm">Browse Events</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</DashboardPanel>

			<Tabs defaultValue="upcoming" className="space-y-6">
				<TabsList>
					<TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
					<TabsTrigger value="past">Past Events</TabsTrigger>
					<TabsTrigger value="calendar">Calendar View</TabsTrigger>
				</TabsList>

				{/* Filter Bar */}
				<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
					<div className="relative w-full max-w-xs">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
						<Input
							placeholder="Search events..."
							className="pl-10"
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

				{/* Content for the selected tab */}
				<div>
					{/* Upcoming Events Tab */}
					<TabsContent value="upcoming" className="m-0">
						{selectedEventId ? (
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="md:col-span-2">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{upcomingEvents
											.filter(event => event.id !== selectedEventId)
											.slice(0, 4)
											.map((event) => (
												<Card key={event.id} className={`overflow-hidden ${event.id === selectedEventId ? 'ring-2 ring-primary' : ''}`}>
													<CardHeader className={`${event.required ? 'border-l-4 border-primary' : 'pb-2'}`}>
														<div className="flex justify-between items-start">
															<CardTitle className="text-base">{event.title}</CardTitle>
															<Badge>{event.type}</Badge>
														</div>
														<CardDescription>
															{new Date(event.date).toLocaleDateString('en-US', {
																weekday: 'short',
																month: 'short',
																day: 'numeric'
															})} • {new Date(event.date).toLocaleTimeString('en-US', {
																hour: 'numeric',
																minute: '2-digit',
																hour12: true
															})}
														</CardDescription>
													</CardHeader>
													<CardContent className="pb-2">
														<p className="text-sm text-muted-foreground line-clamp-2 mb-2">{event.description}</p>

														<div className="flex items-center text-sm text-muted-foreground">
															<Map className="h-3.5 w-3.5 mr-1" />
															<span>{event.location}</span>
														</div>
													</CardContent>
													<CardFooter className="pt-0">
														<Button variant="ghost" size="sm" className="w-full"
															onClick={() => handleSelectEvent(event.id)}>
															View Details
														</Button>
													</CardFooter>
												</Card>
											))}
									</div>
								</div>
								<div>
									<EventDetailsCard
										eventId={selectedEventId}
										houseId={houseId}
										onRSVP={handleRSVP}
									/>
								</div>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{upcomingEvents.map((event) => (
									<Card key={event.id} className="overflow-hidden">
										<CardHeader className={`${event.required ? 'border-l-4 border-primary' : 'pb-2'}`}>
											<div className="flex justify-between items-start">
												<CardTitle className="text-base">{event.title}</CardTitle>
												<Badge>{event.type}</Badge>
											</div>
											<CardDescription>
												{new Date(event.date).toLocaleDateString('en-US', {
													weekday: 'short',
													month: 'short',
													day: 'numeric'
												})} • {new Date(event.date).toLocaleTimeString('en-US', {
													hour: 'numeric',
													minute: '2-digit',
													hour12: true
												})}
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-2 pb-2">
											<p className="text-sm text-muted-foreground">{event.description}</p>

											<div className="flex items-center text-sm text-muted-foreground">
												<Map className="h-3.5 w-3.5 mr-1" />
												<span>{event.location}</span>
											</div>

											<div>
												<div className="flex items-center justify-between">
													<span className="text-xs text-muted-foreground">
														Attendees ({event.attendees.length}/{event.capacity})
													</span>
												</div>
												<div className="flex -space-x-2 mt-1">
													{event.attendees.slice(0, 5).map((attendee) => (
														<Avatar key={attendee.id} className="h-6 w-6 border-2 border-background">
															<AvatarImage src={attendee.avatar} alt={attendee.name} />
															<AvatarFallback>{attendee.name[0]}</AvatarFallback>
														</Avatar>
													))}
													{event.attendees.length > 5 && (
														<div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs border-2 border-background">
															+{event.attendees.length - 5}
														</div>
													)}
												</div>
											</div>
										</CardContent>
										<CardFooter className="flex justify-between border-t pt-3">
											<Button variant="ghost" size="sm" className="h-8 px-2">
												<MessageSquare className="h-3.5 w-3.5 mr-1.5" />
												<span className="text-xs">Comments</span>
											</Button>
											<div className="flex gap-2">
												<Button variant="outline" size="sm" className="h-8 px-2">
													<ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
													<span className="text-xs">Interested</span>
												</Button>
												<Button size="sm" className="h-8 px-3 text-xs"
													onClick={() => handleSelectEvent(event.id)}>
													Details
												</Button>
											</div>
										</CardFooter>
									</Card>
								))}
							</div>
						)}
					</TabsContent>

					{/* Past Events Tab */}
					<TabsContent value="past" className="m-0">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{pastEvents.map((event) => (
								<Card key={event.id} className="overflow-hidden bg-muted/30">
									<CardHeader>
										<div className="flex justify-between items-start">
											<CardTitle className="text-base">{event.title}</CardTitle>
											<Badge variant="outline">{event.type}</Badge>
										</div>
										<CardDescription>
											{new Date(event.date).toLocaleDateString('en-US', {
												weekday: 'short',
												month: 'short',
												day: 'numeric'
											})}
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-2 pb-2">
										<p className="text-sm text-muted-foreground">{event.description}</p>

										<div className="flex items-center text-sm text-muted-foreground">
											<Map className="h-3.5 w-3.5 mr-1" />
											<span>{event.location}</span>
										</div>

										<div>
											<div className="flex items-center justify-between">
												<span className="text-xs text-muted-foreground">
													Attended ({event.attendees.length} residents)
												</span>
											</div>
											<div className="flex -space-x-2 mt-1">
												{event.attendees.slice(0, 5).map((attendee) => (
													<Avatar key={attendee.id} className="h-6 w-6 border-2 border-background">
														<AvatarImage src={attendee.avatar} alt={attendee.name} />
														<AvatarFallback>{attendee.name[0]}</AvatarFallback>
													</Avatar>
												))}
												{event.attendees.length > 5 && (
													<div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs border-2 border-background">
														+{event.attendees.length - 5}
													</div>
												)}
											</div>
										</div>
									</CardContent>
									<CardFooter className="flex justify-between border-t pt-3">
										<Button variant="ghost" size="sm" className="h-8">
											<MessageSquare className="h-3.5 w-3.5 mr-1.5" />
											<span className="text-xs">Discussion</span>
										</Button>
										<Button variant="outline" size="sm" className="h-8">
											<span className="text-xs">Photos & Recap</span>
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					</TabsContent>

					{/* Calendar View Tab */}
					<TabsContent value="calendar" className="m-0">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<Card className="md:col-span-1">
								<CardHeader>
									<CardTitle className="text-base">Calendar</CardTitle>
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
													<span className="text-sm text-muted-foreground">{type}</span>
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
									<CardTitle className="text-base">
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
								<CardContent className="max-h-[500px] overflow-y-auto p-0">
									{filteredEvents.length > 0 ? (
										<div className="divide-y">
											{filteredEvents.map((event) => (
												<div key={event.id} className="flex px-4 py-3 hover:bg-muted/50">
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
														<div className="flex items-center mt-1 text-sm text-muted-foreground">
															<Map className="h-3 w-3 mr-1" />
															<span className="mr-3">{event.location}</span>
															<Users className="h-3 w-3 mr-1" />
															<span>{event.attendees.length}/{event.capacity}</span>
														</div>
													</div>
													<Button size="sm" variant="ghost" onClick={() => handleSelectEvent(event.id)}>
														Details
													</Button>
												</div>
											))}
										</div>
									) : (
										<div className="text-center py-8">
											<p className="text-muted-foreground">No events scheduled for this day</p>
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
				</div>
			</Tabs>
		</div>
	);
} 