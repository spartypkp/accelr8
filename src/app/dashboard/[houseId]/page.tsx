'use client';

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	BarChart3,
	Calendar,
	CalendarClock,
	CheckCircle2,
	Clock,
	DollarSign,
	FileText,
	HelpCircle,
	MessagesSquare,
	MoreHorizontal,
	Plus,
	RefreshCcw,
	Users,
	Wrench
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock data for dashboard
const mockAnnouncements = [
	{
		id: 1,
		title: "Community Dinner Tonight",
		content: "Join us for a community dinner at 7 PM in the common area. We'll be having pizza and discussing upcoming house events.",
		date: "Today at 10:00 AM",
		author: "Maya Johnson",
		authorRole: "House Manager",
		authorAvatar: "/placeholder-user.jpg",
	},
	{
		id: 2,
		title: "Internet Maintenance Tomorrow",
		content: "Our ISP will be performing maintenance from 2-4 AM. Expect brief connectivity issues during this time.",
		date: "Yesterday at 5:30 PM",
		author: "Tech Team",
		authorRole: "Accelr8 Support",
		authorAvatar: "/placeholder-user.jpg",
	},
	{
		id: 3,
		title: "New Residents Welcome!",
		content: "Please welcome our new residents: Alex, Jamie, and Taylor who joined us this week.",
		date: "Jun 12, 2023",
		author: "Community Team",
		authorRole: "Accelr8 Support",
		authorAvatar: "/placeholder-user.jpg",
	},
];

const mockUpcomingEvents = [
	{
		id: 1,
		title: "Founder Pitch Practice",
		date: "Today, 6:00 PM",
		location: "Conference Room",
		attendees: 8,
	},
	{
		id: 2,
		title: "Weekly House Meeting",
		date: "Tomorrow, 7:30 PM",
		location: "Common Area",
		attendees: 24,
	},
	{
		id: 3,
		title: "AI Hackathon Kickoff",
		date: "Saturday, 10:00 AM",
		location: "Coworking Space",
		attendees: 15,
	},
];

const mockMaintenanceRequests = [
	{
		id: 1,
		title: "Kitchen sink leaking",
		status: "In Progress",
		date: "Submitted Jun 10",
		priority: "Medium",
	},
	{
		id: 2,
		title: "Lightbulb replacement in room 204",
		status: "Completed",
		date: "Resolved Jun 8",
		priority: "Low",
	},
];

const mockCommunityStats = {
	totalResidents: 28,
	totalRooms: 32,
	occupancyRate: 87.5,
	averageStay: "4.2 months",
	activeMaintenance: 3,
	upcomingEvents: 5,
};

const mockRentStatus = {
	status: "Paid",
	nextPayment: "July 1, 2023",
	amount: "$1,450.00",
	lastPayment: "June 1, 2023",
};

export default function HouseDashboardPage() {
	const params = useParams();
	const houseId = params?.houseId as string;

	// In a real app, we'd fetch house data based on the houseId
	const houseName =
		houseId === "sf" ? "San Francisco House" :
			houseId === "nyc" ? "New York House" :
				houseId === "seattle" ? "Seattle House" :
					"Accelr8 House";

	const houseLocation =
		houseId === "sf" ? "San Francisco, CA" :
			houseId === "nyc" ? "New York, NY" :
				houseId === "seattle" ? "Seattle, WA" :
					"Location";

	return (
		<DashboardLayout>
			<div className="p-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
					<div>
						<h1 className="text-2xl font-bold">{houseName}</h1>
						<p className="text-gray-500 dark:text-gray-400">{houseLocation}</p>
					</div>

					<div className="flex items-center space-x-2 mt-4 md:mt-0">
						<Button variant="outline" size="sm">
							<RefreshCcw className="h-4 w-4 mr-2" />
							Refresh
						</Button>
						<Button size="sm">
							<HelpCircle className="h-4 w-4 mr-2" />
							Help
						</Button>
					</div>
				</div>

				{/* Resident Status Summary */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Your Rent Status</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex justify-between items-center">
								<div>
									<p className="text-2xl font-bold">{mockRentStatus.amount}</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">Next payment: {mockRentStatus.nextPayment}</p>
								</div>
								<Badge variant={mockRentStatus.status === "Paid" ? "secondary" : "destructive"} className="px-3 py-1 font-medium">
									{mockRentStatus.status}
								</Badge>
							</div>
							<Button asChild variant="ghost" className="w-full mt-4 justify-start p-0">
								<Link href={`/dashboard/${houseId}/billing`}>
									<DollarSign className="h-4 w-4 mr-2" />
									View Billing Details
								</Link>
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Your Maintenance Requests</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{mockMaintenanceRequests.length > 0 ? (
									mockMaintenanceRequests.map((request) => (
										<div key={request.id} className="flex justify-between items-center">
											<div>
												<p className="font-medium">{request.title}</p>
												<p className="text-xs text-gray-500 dark:text-gray-400">{request.date}</p>
											</div>
											<Badge variant={
												request.status === "Completed" ? "outline" :
													request.status === "In Progress" ? "secondary" : "default"
											}>
												{request.status}
											</Badge>
										</div>
									))
								) : (
									<p className="text-gray-500 dark:text-gray-400">No active requests</p>
								)}
							</div>
							<Button asChild variant="ghost" className="w-full mt-4 justify-start p-0">
								<Link href={`/dashboard/${houseId}/maintenance`}>
									<Wrench className="h-4 w-4 mr-2" />
									Create New Request
								</Link>
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{mockUpcomingEvents.slice(0, 2).map((event) => (
									<div key={event.id} className="flex justify-between items-center">
										<div>
											<p className="font-medium">{event.title}</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">{event.date}</p>
										</div>
										<Badge variant="outline">{event.attendees} attendees</Badge>
									</div>
								))}
							</div>
							<Button asChild variant="ghost" className="w-full mt-4 justify-start p-0">
								<Link href={`/dashboard/${houseId}/events`}>
									<Calendar className="h-4 w-4 mr-2" />
									View All Events
								</Link>
							</Button>
						</CardContent>
					</Card>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="md:col-span-2 space-y-6">
						{/* Announcements */}
						<Card>
							<CardHeader>
								<div className="flex justify-between items-center">
									<CardTitle>House Announcements</CardTitle>
									<Button variant="outline" size="sm">
										<Clock className="h-4 w-4 mr-2" />
										View All
									</Button>
								</div>
								<CardDescription>Important updates for residents</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{mockAnnouncements.map((announcement) => (
										<div key={announcement.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
											<div className="flex justify-between mb-2">
												<h3 className="font-bold">{announcement.title}</h3>
												<span className="text-xs text-gray-500 dark:text-gray-400">{announcement.date}</span>
											</div>
											<p className="text-gray-600 dark:text-gray-300 mb-4">{announcement.content}</p>
											<div className="flex items-center">
												<Avatar className="h-8 w-8 mr-2">
													<AvatarImage src={announcement.authorAvatar} />
													<AvatarFallback>{announcement.author[0]}</AvatarFallback>
												</Avatar>
												<div>
													<p className="text-sm font-medium">{announcement.author}</p>
													<p className="text-xs text-gray-500 dark:text-gray-400">{announcement.authorRole}</p>
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Community Activity */}
						<Card>
							<CardHeader>
								<div className="flex justify-between items-center">
									<CardTitle>Community Activity</CardTitle>
									<Button variant="outline" size="sm">
										<Users className="h-4 w-4 mr-2" />
										View All
									</Button>
								</div>
								<CardDescription>Recent activity in your house</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-start">
										<div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-4">
											<Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
										</div>
										<div>
											<p><span className="font-medium">Alex Chen</span> joined the house</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
										</div>
									</div>

									<div className="flex items-start">
										<div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mr-4">
											<Calendar className="h-5 w-5 text-purple-600 dark:text-purple-300" />
										</div>
										<div>
											<p><span className="font-medium">Maya Johnson</span> created a new event: "AI Hackathon Weekend"</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">Yesterday</p>
										</div>
									</div>

									<div className="flex items-start">
										<div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-4">
											<MessagesSquare className="h-5 w-5 text-green-600 dark:text-green-300" />
										</div>
										<div>
											<p><span className="font-medium">Jamie Smith</span> posted in #general: "Looking for a frontend developer for my project..."</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
										</div>
									</div>

									<div className="flex items-start">
										<div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full mr-4">
											<CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-300" />
										</div>
										<div>
											<p><span className="font-medium">Taylor Wong</span> completed their founder profile</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">3 days ago</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="space-y-6">
						{/* Community Stats */}
						<Card>
							<CardHeader>
								<CardTitle>House Statistics</CardTitle>
								<CardDescription>Current house metrics</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-1">
										<p className="text-xs text-gray-500 dark:text-gray-400">Residents</p>
										<p className="text-xl font-bold">{mockCommunityStats.totalResidents}</p>
									</div>
									<div className="space-y-1">
										<p className="text-xs text-gray-500 dark:text-gray-400">Occupancy</p>
										<p className="text-xl font-bold">{mockCommunityStats.occupancyRate}%</p>
									</div>
									<div className="space-y-1">
										<p className="text-xs text-gray-500 dark:text-gray-400">Avg. Stay</p>
										<p className="text-xl font-bold">{mockCommunityStats.averageStay}</p>
									</div>
									<div className="space-y-1">
										<p className="text-xs text-gray-500 dark:text-gray-400">Events</p>
										<p className="text-xl font-bold">{mockCommunityStats.upcomingEvents}</p>
									</div>
								</div>

								<div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
									<Button asChild variant="ghost" className="w-full justify-start p-0">
										<Link href={`/dashboard/${houseId}/community`}>
											<BarChart3 className="h-4 w-4 mr-2" />
											View Community
										</Link>
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Quick Actions */}
						<Card>
							<CardHeader>
								<CardTitle>Quick Actions</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								<Button asChild variant="outline" className="w-full justify-start">
									<Link href={`/dashboard/${houseId}/resources`}>
										<Plus className="h-4 w-4 mr-2" />
										Book a Resource
									</Link>
								</Button>
								<Button asChild variant="outline" className="w-full justify-start">
									<Link href={`/dashboard/${houseId}/maintenance`}>
										<Wrench className="h-4 w-4 mr-2" />
										Submit Maintenance
									</Link>
								</Button>
								<Button asChild variant="outline" className="w-full justify-start">
									<Link href={`/dashboard/${houseId}/events/create`}>
										<CalendarClock className="h-4 w-4 mr-2" />
										Propose an Event
									</Link>
								</Button>
								<Button asChild variant="outline" className="w-full justify-start">
									<Link href={`/dashboard/${houseId}/info`}>
										<FileText className="h-4 w-4 mr-2" />
										View House Guide
									</Link>
								</Button>
							</CardContent>
						</Card>

						{/* House Calendar */}
						<Card>
							<CardHeader>
								<CardTitle>Calendar</CardTitle>
								<CardDescription>Upcoming events</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{mockUpcomingEvents.map((event) => (
										<div key={event.id} className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
											<div className="bg-gray-200 dark:bg-gray-700 h-10 w-10 rounded-md flex items-center justify-center mr-3">
												<Calendar className="h-5 w-5 text-gray-700 dark:text-gray-300" />
											</div>
											<div>
												<p className="font-medium">{event.title}</p>
												<p className="text-xs text-gray-500 dark:text-gray-400">{event.date} · {event.location}</p>
											</div>
											<Button variant="ghost" size="icon" className="ml-auto">
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</div>
									))}
								</div>
								<Button asChild variant="ghost" className="w-full mt-4 justify-start p-0">
									<Link href={`/dashboard/${houseId}/events`}>
										<Calendar className="h-4 w-4 mr-2" />
										View Full Calendar
									</Link>
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
} 