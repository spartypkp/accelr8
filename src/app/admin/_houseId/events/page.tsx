"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Calendar as CalendarIcon,
	Clock,
	MoreHorizontal,
	Plus,
	Users
} from "lucide-react";
import { useParams } from "next/navigation";

// Mock event data
const EVENTS = [
	{
		id: "1",
		title: "Weekly Founder Dinner",
		description: "A casual dinner for all house residents to connect and share updates on their projects.",
		date: "2023-09-15",
		time: "19:00",
		duration: 120,
		location: "Kitchen",
		capacity: 20,
		registrations: 15,
		status: "upcoming",
		type: "community"
	},
	{
		id: "2",
		title: "Investor Pitch Night",
		description: "An opportunity for residents to pitch their startups to a panel of investors.",
		date: "2023-09-20",
		time: "18:00",
		duration: 180,
		location: "Common Area",
		capacity: 30,
		registrations: 25,
		status: "upcoming",
		type: "professional"
	},
	{
		id: "3",
		title: "Game Night",
		description: "A fun evening of board games and video games to unwind and bond with housemates.",
		date: "2023-08-28",
		time: "20:00",
		duration: 180,
		location: "Living Room",
		capacity: 20,
		registrations: 12,
		status: "past",
		type: "social"
	}
];

export default function EventsManagementPage() {
	const params = useParams();
	const houseId = params.houseId as string;

	// Separate upcoming and past events
	const upcomingEvents = EVENTS.filter(event => event.status === "upcoming");
	const pastEvents = EVENTS.filter(event => event.status === "past");

	const formatDate = (dateStr) => {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
	};

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Events Management</h1>
						<p className="text-muted-foreground">
							Manage events for {houseId.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}
						</p>
					</div>

					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Create Event
					</Button>
				</div>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle>Upcoming Events</CardTitle>
						<CardDescription>
							Manage scheduled events for the house.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Event Details</TableHead>
										<TableHead>Date & Time</TableHead>
										<TableHead>Location</TableHead>
										<TableHead>Registrations</TableHead>
										<TableHead className="w-[50px]"></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{upcomingEvents.length > 0 ? (
										upcomingEvents.map((event) => (
											<TableRow key={event.id}>
												<TableCell>
													<div className="font-medium">{event.title}</div>
													<div className="text-sm text-muted-foreground truncate max-w-[300px]">
														{event.description}
													</div>
													<div className="mt-1">
														<Badge
															variant="default"
															className="capitalize"
														>
															{event.type}
														</Badge>
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center">
														<CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
														<span>{formatDate(event.date)}</span>
													</div>
													<div className="flex items-center mt-1">
														<Clock className="mr-2 h-4 w-4 text-muted-foreground" />
														<span>{event.time} ({event.duration} min)</span>
													</div>
												</TableCell>
												<TableCell>{event.location}</TableCell>
												<TableCell>
													<div className="flex items-center">
														<Users className="mr-2 h-4 w-4 text-muted-foreground" />
														<span>
															{event.registrations}/{event.capacity}
														</span>
													</div>
													<div className="w-full h-2 bg-secondary mt-2 rounded-full overflow-hidden">
														<div
															className="h-full bg-primary"
															style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
														></div>
													</div>
												</TableCell>
												<TableCell>
													<Button variant="ghost" size="icon">
														<MoreHorizontal className="h-4 w-4" />
														<span className="sr-only">Open menu</span>
													</Button>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={5} className="text-center py-6">
												No upcoming events found.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Past Events</CardTitle>
						<CardDescription>
							Review previous events at the house.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Event Details</TableHead>
										<TableHead>Date & Time</TableHead>
										<TableHead>Location</TableHead>
										<TableHead>Attendance</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{pastEvents.length > 0 ? (
										pastEvents.map((event) => (
											<TableRow key={event.id}>
												<TableCell>
													<div className="font-medium">{event.title}</div>
													<div className="text-sm text-muted-foreground truncate max-w-[300px]">
														{event.description}
													</div>
													<div className="mt-1">
														<Badge
															variant="outline"
															className="capitalize"
														>
															{event.type}
														</Badge>
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center">
														<CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
														<span>{formatDate(event.date)}</span>
													</div>
													<div className="flex items-center mt-1">
														<Clock className="mr-2 h-4 w-4 text-muted-foreground" />
														<span>{event.time} ({event.duration} min)</span>
													</div>
												</TableCell>
												<TableCell>{event.location}</TableCell>
												<TableCell>
													<div className="flex items-center">
														<Users className="mr-2 h-4 w-4 text-muted-foreground" />
														<span>
															{event.registrations}/{event.capacity}
														</span>
													</div>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={4} className="text-center py-6">
												No past events found.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>

				<div className="grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>Event Stats</CardTitle>
							<CardDescription>
								Key metrics about events at the house
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1">
									<p className="text-sm font-medium text-muted-foreground">Upcoming Events</p>
									<p className="text-2xl font-bold">{upcomingEvents.length}</p>
								</div>
								<div className="space-y-1">
									<p className="text-sm font-medium text-muted-foreground">Past Events (30 days)</p>
									<p className="text-2xl font-bold">{pastEvents.length}</p>
								</div>
								<div className="space-y-1">
									<p className="text-sm font-medium text-muted-foreground">Average Attendance</p>
									<p className="text-2xl font-bold">
										{Math.round(
											EVENTS.reduce((acc, event) => acc + (event.registrations / event.capacity) * 100, 0) /
											EVENTS.length
										)}%
									</p>
								</div>
								<div className="space-y-1">
									<p className="text-sm font-medium text-muted-foreground">Most Popular Type</p>
									<p className="text-2xl font-bold capitalize">Professional</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Upcoming Calendar</CardTitle>
							<CardDescription>
								Next 7 days of events
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{upcomingEvents.slice(0, 3).map((event) => (
									<div key={event.id} className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0">
										<div className="min-w-[60px] rounded-md border p-2 text-center">
											<div className="text-xs font-medium">
												{formatDate(event.date).split(' ')[0]}
											</div>
											<div className="text-lg font-bold">
												{formatDate(event.date).split(' ')[2]}
											</div>
										</div>
										<div>
											<p className="font-medium">{event.title}</p>
											<p className="text-sm text-muted-foreground">
												{event.time} • {event.location}
											</p>
											<p className="text-sm mt-1">
												{event.registrations} attendees
											</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</AdminLayout>
	);
} 