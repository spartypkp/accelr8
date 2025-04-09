'use client';

import { EventDetailsCard } from "@/components/dashboard/cards/EventDetailsCard";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
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
import useSWR from "swr";

// Define interfaces for our data
interface Event {
	id: string;
	title: string;
	description: string;
	start_time: string;
	end_time: string;
	location: string;
	event_type: string;
	created_by: string;
	max_participants: number;
	is_mandatory: boolean;
	sanity_house_id: string;
}

interface Attendee {
	id: string;
	name: string;
	avatar?: string;
}

interface EventWithAttendees extends Event {
	attendees: Attendee[];
}

// Event type options for filtering
const eventTypes = [
	"All Types",
	"workshop",
	"house_meeting",
	"social",
	"maintenance",
	"other"
];

// Map database event_type to display names for UI
const eventTypeDisplayNames: Record<string, string> = {
	"workshop": "Workshop",
	"house_meeting": "Meeting",
	"social": "Social",
	"maintenance": "Maintenance",
	"other": "Other"
};

// Data fetcher function for SWR
const fetcher = async (url: string) => {
	const supabase = createClient();
	const [_, action, houseId] = url.split('/').slice(-3);

	// Fetch events from the database
	const { data, error } = await supabase
		.from("internal_events")
		.select("*")
		.eq("sanity_house_id", houseId);

	if (error) throw error;

	// For each event, get the participants
	const eventsWithAttendees: EventWithAttendees[] = await Promise.all(
		(data || []).map(async (event) => {
			const { data: participants } = await supabase
				.from("event_participants")
				.select(`
					user_id,
					accelr8_users:user_id (
						id,
						email,
						display_name
					)
				`)
				.eq("event_id", event.id)
				.eq("status", "attending");

			const attendees: Attendee[] = (participants || []).map(participant => {
				// Access the first item if accelr8_users is an array, otherwise treat as is
				let userData = Array.isArray(participant.accelr8_users)
					? participant.accelr8_users[0]
					: participant.accelr8_users;

				// Fallback values if data is missing
				const displayName = userData?.display_name;
				const email = userData?.email;

				return {
					id: participant.user_id,
					name: displayName || email || 'Unknown User',
					avatar: '/placeholder-user.jpg'
				};
			});

			return {
				...event,
				attendees
			};
		})
	);

	return eventsWithAttendees;
};

export default function EventsPage() {
	const params = useParams();
	const houseId = params?.houseId as string;
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [selectedType, setSelectedType] = useState("All Types");
	const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
	const [userId, setUserId] = useState<string>("");

	// Fetch events for this house
	const { data: events, error, isLoading } = useSWR<EventWithAttendees[]>(
		`/api/events/list/${houseId}`,
		fetcher
	);

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
					houseId === "larkin" ? "Larkin House" :
						"Accelr8 House";

	// Filter events based on selected type
	const filteredEvents = selectedType === "All Types"
		? events || []
		: (events || []).filter(event => event.event_type === selectedType);

	// Separate upcoming and past events
	const now = new Date();
	const upcomingEvents = filteredEvents.filter(event => new Date(event.start_time) > now);
	const pastEvents = filteredEvents.filter(event => new Date(event.start_time) <= now);

	// Handle selecting an event
	const handleSelectEvent = (eventId: string) => {
		setSelectedEventId(eventId);
	};

	// Handle RSVP actions
	const handleRSVP = async (eventId: string, attending: boolean) => {
		if (!userId) return;

		try {
			const supabase = createClient();

			// Check if user already has an RSVP
			const { data: existingRSVP } = await supabase
				.from("event_participants")
				.select("id, status")
				.eq("event_id", eventId)
				.eq("user_id", userId)
				.maybeSingle();

			if (existingRSVP) {
				// Update existing RSVP
				await supabase
					.from("event_participants")
					.update({
						status: attending ? "attending" : "maybe",
						response_date: new Date().toISOString()
					})
					.eq("id", existingRSVP.id);
			} else {
				// Create new RSVP
				await supabase
					.from("event_participants")
					.insert({
						event_id: eventId,
						user_id: userId,
						status: attending ? "attending" : "maybe",
						response_date: new Date().toISOString()
					});
			}

			// Refresh the data
			// This will trigger a re-fetch once implemented
			console.log(`User ${userId} ${attending ? 'is attending' : 'is interested in'} event ${eventId}`);
		} catch (error) {
			console.error("Error updating RSVP:", error);
		}
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
				<Card className="overflow-hidden lg:col-span-3">
					<CardHeader>
						<CardTitle className="text-base">Your Upcoming RSVPs</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						{isLoading ? (
							<div className="p-8 text-center">
								<p className="text-sm text-muted-foreground">Loading events...</p>
							</div>
						) : upcomingEvents.length > 0 ? (
							<div className="divide-y">
								{upcomingEvents.slice(0, 3).map((event) => (
									<div key={event.id} className="p-4 hover:bg-muted/50 transition-colors">
										<div className="flex justify-between mb-1">
											<div className="font-medium">{event.title}</div>
											<Badge variant="outline">{eventTypeDisplayNames[event.event_type] || event.event_type}</Badge>
										</div>
										<div className="text-sm text-muted-foreground flex items-center gap-1">
											<CalendarDays className="h-3 w-3" />
											<span>{new Date(event.start_time).toLocaleDateString()}</span>
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
								{type === "All Types" ? type : eventTypeDisplayNames[type] || type}
							</Button>
						))}
					</div>
				</div>

				{/* Content for the selected tab */}
				<div>
					{/* Upcoming Events Tab */}
					<TabsContent value="upcoming" className="m-0">
						{isLoading ? (
							<div className="text-center py-12">
								<p className="text-muted-foreground">Loading events...</p>
							</div>
						) : selectedEventId ? (
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="md:col-span-2">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{upcomingEvents
											.filter(event => event.id !== selectedEventId)
											.slice(0, 4)
											.map((event) => (
												<Card key={event.id} className={`overflow-hidden ${event.id === selectedEventId ? 'ring-2 ring-primary' : ''}`}>
													<CardHeader className={`${event.is_mandatory ? 'border-l-4 border-primary' : 'pb-2'}`}>
														<div className="flex justify-between items-start">
															<CardTitle className="text-base">{event.title}</CardTitle>
															<Badge>{eventTypeDisplayNames[event.event_type] || event.event_type}</Badge>
														</div>
														<CardDescription>
															{new Date(event.start_time).toLocaleDateString('en-US', {
																weekday: 'short',
																month: 'short',
																day: 'numeric'
															})} • {new Date(event.start_time).toLocaleTimeString('en-US', {
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
						) : upcomingEvents.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{upcomingEvents.map((event) => (
									<Card key={event.id} className="overflow-hidden">
										<CardHeader className={`${event.is_mandatory ? 'border-l-4 border-primary' : 'pb-2'}`}>
											<div className="flex justify-between items-start">
												<CardTitle className="text-base">{event.title}</CardTitle>
												<Badge>{eventTypeDisplayNames[event.event_type] || event.event_type}</Badge>
											</div>
											<CardDescription>
												{new Date(event.start_time).toLocaleDateString('en-US', {
													weekday: 'short',
													month: 'short',
													day: 'numeric'
												})} • {new Date(event.start_time).toLocaleTimeString('en-US', {
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
														Attendees ({event.attendees?.length || 0}/{event.max_participants || 'Unlimited'})
													</span>
												</div>
												<div className="flex -space-x-2 mt-1">
													{(event.attendees || []).slice(0, 5).map((attendee) => (
														<Avatar key={attendee.id} className="h-6 w-6 border-2 border-background">
															<AvatarImage src={attendee.avatar} alt={attendee.name} />
															<AvatarFallback>{attendee.name[0]}</AvatarFallback>
														</Avatar>
													))}
													{(event.attendees?.length || 0) > 5 && (
														<div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs border-2 border-background">
															+{(event.attendees?.length || 0) - 5}
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
												<Button variant="outline" size="sm" className="h-8 px-2"
													onClick={() => handleRSVP(event.id, false)}>
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
						) : (
							<div className="text-center py-12">
								<p className="text-muted-foreground">No upcoming events found</p>
								<Button variant="outline" className="mt-4">
									<Plus className="h-4 w-4 mr-2" />
									Create Event
								</Button>
							</div>
						)}
					</TabsContent>

					{/* Past Events Tab */}
					<TabsContent value="past" className="m-0">
						{isLoading ? (
							<div className="text-center py-12">
								<p className="text-muted-foreground">Loading events...</p>
							</div>
						) : pastEvents.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{pastEvents.map((event) => (
									<Card key={event.id} className="overflow-hidden bg-muted/30">
										<CardHeader>
											<div className="flex justify-between items-start">
												<CardTitle className="text-base">{event.title}</CardTitle>
												<Badge variant="outline">{eventTypeDisplayNames[event.event_type] || event.event_type}</Badge>
											</div>
											<CardDescription>
												{new Date(event.start_time).toLocaleDateString('en-US', {
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
														Attended ({event.attendees?.length || 0} residents)
													</span>
												</div>
												<div className="flex -space-x-2 mt-1">
													{(event.attendees || []).slice(0, 5).map((attendee) => (
														<Avatar key={attendee.id} className="h-6 w-6 border-2 border-background">
															<AvatarImage src={attendee.avatar} alt={attendee.name} />
															<AvatarFallback>{attendee.name[0]}</AvatarFallback>
														</Avatar>
													))}
													{(event.attendees?.length || 0) > 5 && (
														<div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs border-2 border-background">
															+{(event.attendees?.length || 0) - 5}
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
						) : (
							<div className="text-center py-12">
								<p className="text-muted-foreground">No past events found</p>
							</div>
						)}
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
											{Object.entries(eventTypeDisplayNames).map(([type, displayName]) => (
												<div key={type} className="flex items-center">
													<div className={`h-3 w-3 rounded-full mr-2 bg-${type === 'workshop' ? 'blue' : type === 'house_meeting' ? 'green' : type === 'social' ? 'purple' : type === 'maintenance' ? 'amber' : 'pink'}-500`}></div>
													<span className="text-sm text-muted-foreground">{displayName}</span>
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
									{isLoading ? (
										<div className="text-center py-8">
											<p className="text-muted-foreground">Loading events...</p>
										</div>
									) : filteredEvents.length > 0 ? (
										<div className="divide-y">
											{filteredEvents.map((event) => (
												<div key={event.id} className="flex px-4 py-3 hover:bg-muted/50">
													<div className="w-16 text-right mr-4">
														<span className="text-sm font-medium">
															{new Date(event.start_time).toLocaleTimeString('en-US', {
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
															<span>{event.attendees?.length || 0}/{event.max_participants || 'Unlimited'}</span>
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