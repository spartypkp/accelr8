'use client';

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	AlertCircle,
	Calendar,
	CheckCircle2,
	ChevronDown,
	Clock,
	Filter,
	Flame,
	ImagePlus,
	Lightbulb,
	MoreHorizontal,
	PenLine,
	Plus,
	Search,
	Thermometer,
	Timer,
	Upload,
	Wrench
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

// Mock data for maintenance requests
const mockRequests = [
	{
		id: 1,
		title: "Kitchen sink leaking",
		description: "Water is slowly leaking from the pipe under the kitchen sink. There's a small puddle forming.",
		location: "Kitchen",
		room: "Common Area",
		priority: "Medium",
		status: "In Progress",
		createdAt: "2023-07-10T09:15:00",
		updatedAt: "2023-07-11T14:30:00",
		assignedTo: "Maintenance Team",
		comments: [
			{
				user: "House Manager",
				text: "Maintenance team has been notified, they'll come by tomorrow morning.",
				timestamp: "2023-07-10T10:30:00"
			},
			{
				user: "Maintenance Team",
				text: "Inspected the issue. Need to replace a gasket, will return with parts tomorrow.",
				timestamp: "2023-07-11T14:30:00"
			}
		],
		photos: ["/placeholder-leak.jpg"]
	},
	{
		id: 2,
		title: "Lightbulb replacement in room 204",
		description: "The ceiling light in my bedroom has burned out and needs replacement.",
		location: "Bedroom",
		room: "204",
		priority: "Low",
		status: "Completed",
		createdAt: "2023-07-08T16:20:00",
		updatedAt: "2023-07-08T17:45:00",
		assignedTo: "Maintenance Team",
		completedAt: "2023-07-08T17:45:00",
		comments: [
			{
				user: "Maintenance Team",
				text: "Replaced with new LED bulb. Let us know if you have any issues with the brightness.",
				timestamp: "2023-07-08T17:45:00"
			}
		],
		photos: []
	},
	{
		id: 3,
		title: "Heating not working in room 301",
		description: "The radiator in my room isn't getting warm even when turned to maximum setting.",
		location: "Bedroom",
		room: "301",
		priority: "High",
		status: "Scheduled",
		createdAt: "2023-07-12T08:10:00",
		updatedAt: "2023-07-12T09:30:00",
		assignedTo: "HVAC Specialist",
		scheduledFor: "2023-07-14T13:00:00",
		comments: [
			{
				user: "House Manager",
				text: "This requires a specialist. I've scheduled an HVAC technician to come on Friday at 1pm.",
				timestamp: "2023-07-12T09:30:00"
			}
		],
		photos: ["/placeholder-radiator.jpg"]
	},
	{
		id: 4,
		title: "Washing machine making loud noise",
		description: "The washing machine is making a loud banging noise during the spin cycle. It's also vibrating excessively.",
		location: "Laundry Room",
		room: "Basement",
		priority: "Medium",
		status: "Reported",
		createdAt: "2023-07-13T19:45:00",
		updatedAt: "2023-07-13T19:45:00",
		comments: [],
		photos: ["/placeholder-washer.jpg"]
	},
	{
		id: 5,
		title: "WiFi signal weak in room 210",
		description: "The WiFi signal in my room is very weak, making it difficult to work efficiently.",
		location: "Bedroom",
		room: "210",
		priority: "Medium",
		status: "Scheduled",
		createdAt: "2023-07-11T11:20:00",
		updatedAt: "2023-07-11T15:10:00",
		assignedTo: "IT Support",
		scheduledFor: "2023-07-15T10:00:00",
		comments: [
			{
				user: "IT Support",
				text: "We'll install a WiFi extender in the hallway near your room. Scheduled for Saturday morning.",
				timestamp: "2023-07-11T15:10:00"
			}
		],
		photos: []
	}
];

// Issue types for categorization
const issueTypes = [
	{ label: "Plumbing", icon: <Wrench className="h-4 w-4" /> },
	{ label: "Electrical", icon: <Lightbulb className="h-4 w-4" /> },
	{ label: "HVAC", icon: <Thermometer className="h-4 w-4" /> },
	{ label: "Appliance", icon: <Flame className="h-4 w-4" /> },
	{ label: "Furniture", icon: <Wrench className="h-4 w-4" /> },
	{ label: "Other", icon: <AlertCircle className="h-4 w-4" /> }
];

// Common locations in the house
const houseLocations = [
	"Bedroom", "Bathroom", "Kitchen", "Common Area", "Laundry Room",
	"Coworking Space", "Rooftop", "Basement", "Hallway", "Entrance"
];

export default function MaintenancePage() {
	const params = useParams();
	const houseId = params?.houseId as string;
	const [isSubmittingNew, setIsSubmittingNew] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState<string>("All");

	// In a real app, we'd fetch house data based on the houseId
	const houseName =
		houseId === "sf" ? "San Francisco House" :
			houseId === "nyc" ? "New York House" :
				houseId === "seattle" ? "Seattle House" :
					"Accelr8 House";

	// Filter maintenance requests based on selected status
	const filteredRequests = selectedStatus === "All"
		? mockRequests
		: mockRequests.filter(request => request.status === selectedStatus);

	// Counts for dashboard stats
	const activeCount = mockRequests.filter(r => r.status !== "Completed").length;
	const completedCount = mockRequests.filter(r => r.status === "Completed").length;
	const highPriorityCount = mockRequests.filter(r => r.priority === "High" && r.status !== "Completed").length;

	return (
		<DashboardLayout>
			<div className="p-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
					<div>
						<h1 className="text-2xl font-bold">Maintenance</h1>
						<p className="text-gray-500 dark:text-gray-400">{houseName}</p>
					</div>

					<div className="flex items-center space-x-2 mt-4 md:mt-0">
						<Button variant="outline" size="sm">
							<Filter className="h-4 w-4 mr-2" />
							Filter
						</Button>
						<Button
							size="sm"
							onClick={() => setIsSubmittingNew(true)}
						>
							<Plus className="h-4 w-4 mr-2" />
							New Request
						</Button>
					</div>
				</div>

				{/* Request Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Active Requests</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex justify-between items-center">
								<div className="flex items-center">
									<div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
										<Wrench className="h-5 w-5 text-blue-600 dark:text-blue-300" />
									</div>
									<div>
										<p className="text-2xl font-bold">{activeCount}</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">In progress</p>
									</div>
								</div>
								<Button variant="ghost" size="sm" className="text-blue-600">View All</Button>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Completed This Month</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex justify-between items-center">
								<div className="flex items-center">
									<div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
										<CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-300" />
									</div>
									<div>
										<p className="text-2xl font-bold">{completedCount}</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">Resolved issues</p>
									</div>
								</div>
								<Button variant="ghost" size="sm" className="text-green-600">View All</Button>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">High Priority</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex justify-between items-center">
								<div className="flex items-center">
									<div className="bg-red-100 dark:bg-red-900 p-2 rounded-full mr-3">
										<AlertCircle className="h-5 w-5 text-red-600 dark:text-red-300" />
									</div>
									<div>
										<p className="text-2xl font-bold">{highPriorityCount}</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">Urgent issues</p>
									</div>
								</div>
								<Button variant="ghost" size="sm" className="text-red-600">View All</Button>
							</div>
						</CardContent>
					</Card>
				</div>

				{isSubmittingNew ? (
					<Card className="mb-6">
						<CardHeader>
							<div className="flex justify-between">
								<div>
									<CardTitle>Submit New Maintenance Request</CardTitle>
									<CardDescription>Please provide details about the issue you're experiencing</CardDescription>
								</div>
								<Button variant="ghost" size="sm" onClick={() => setIsSubmittingNew(false)}>
									Cancel
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<form className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-1" htmlFor="issue-title">
										Issue Title
									</label>
									<Input
										id="issue-title"
										placeholder="Brief description of the issue (e.g., 'Broken light in bathroom')"
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-1" htmlFor="issue-type">
											Issue Type
										</label>
										<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
											{issueTypes.map((type) => (
												<Button
													key={type.label}
													variant="outline"
													className="justify-start"
													type="button"
												>
													<div className="mr-2">{type.icon}</div>
													{type.label}
												</Button>
											))}
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium mb-1" htmlFor="location">
											Location
										</label>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
											<div>
												<label className="block text-xs mb-1" htmlFor="area">Area</label>
												<select
													id="area"
													className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm"
												>
													<option value="">Select area</option>
													{houseLocations.map((location) => (
														<option key={location} value={location}>{location}</option>
													))}
												</select>
											</div>
											<div>
												<label className="block text-xs mb-1" htmlFor="room">Room/Unit</label>
												<Input id="room" placeholder="Room number or identifier" />
											</div>
										</div>

										<div className="mt-4">
											<label className="block text-sm font-medium mb-1" htmlFor="priority">
												Priority
											</label>
											<div className="flex space-x-2">
												<Button type="button" variant="outline" className="flex-1">Low</Button>
												<Button type="button" variant="outline" className="flex-1">Medium</Button>
												<Button type="button" variant="outline" className="flex-1">High</Button>
											</div>
										</div>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium mb-1" htmlFor="description">
										Detailed Description
									</label>
									<Textarea
										id="description"
										placeholder="Please provide as much detail as possible about the issue..."
										rows={4}
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-1">
										Photos (Optional)
									</label>
									<div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 text-center">
										<div className="flex flex-col items-center">
											<ImagePlus className="h-8 w-8 text-gray-400 mb-2" />
											<p className="text-sm text-gray-500 dark:text-gray-400">
												Drag and drop image files here, or click to select files
											</p>
											<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
												Up to 3 images, max 5MB each
											</p>
											<Button type="button" variant="outline" size="sm" className="mt-2">
												<Upload className="h-4 w-4 mr-2" />
												Upload Photos
											</Button>
										</div>
									</div>
								</div>
							</form>
						</CardContent>
						<CardFooter className="flex justify-end space-x-2">
							<Button variant="outline" onClick={() => setIsSubmittingNew(false)}>
								Cancel
							</Button>
							<Button>
								Submit Request
							</Button>
						</CardFooter>
					</Card>
				) : (
					<Tabs defaultValue="all" className="space-y-6">
						<TabsList className="bg-gray-100 dark:bg-gray-800">
							<TabsTrigger value="all" onClick={() => setSelectedStatus("All")}>All Requests</TabsTrigger>
							<TabsTrigger value="active" onClick={() => setSelectedStatus("In Progress")}>In Progress</TabsTrigger>
							<TabsTrigger value="scheduled" onClick={() => setSelectedStatus("Scheduled")}>Scheduled</TabsTrigger>
							<TabsTrigger value="completed" onClick={() => setSelectedStatus("Completed")}>Completed</TabsTrigger>
						</TabsList>

						{/* Filter & Search */}
						<div className="flex items-center gap-4 mb-6">
							<div className="relative w-full max-w-md">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
								<Input
									placeholder="Search requests..."
									className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
								/>
							</div>
						</div>

						{/* Maintenance Requests List */}
						<div className="space-y-4">
							{filteredRequests.map((request) => (
								<Card key={request.id} className={
									request.priority === "High" ? "border-l-4 border-red-500" :
										request.priority === "Medium" ? "border-l-4 border-yellow-500" : ""
								}>
									<CardHeader className="pb-2">
										<div className="flex justify-between items-start">
											<div>
												<CardTitle className="text-lg flex items-center">
													{request.title}
													{request.priority === "High" && (
														<Badge className="ml-2" variant="destructive">High Priority</Badge>
													)}
												</CardTitle>
												<CardDescription>
													{request.location} • {request.room} • Reported {new Date(request.createdAt).toLocaleDateString()}
												</CardDescription>
											</div>
											<Badge className={
												request.status === "Completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
													request.status === "In Progress" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" :
														request.status === "Scheduled" ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" :
															"bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
											}>
												{request.status}
											</Badge>
										</div>
									</CardHeader>
									<CardContent className="pb-4">
										<p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{request.description}</p>

										{/* Status details */}
										<div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 mb-4">
											<div className="flex items-center">
												{request.status === "In Progress" ? (
													<Wrench className="h-5 w-5 text-blue-500 mr-2" />
												) : request.status === "Scheduled" ? (
													<Calendar className="h-5 w-5 text-purple-500 mr-2" />
												) : request.status === "Completed" ? (
													<CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
												) : (
													<Clock className="h-5 w-5 text-gray-500 mr-2" />
												)}

												<div className="flex-1">
													{request.status === "In Progress" && (
														<p className="text-sm">
															<span className="font-medium">In Progress</span> •
															Assigned to {request.assignedTo}
														</p>
													)}
													{request.status === "Scheduled" && request.scheduledFor && (
														<p className="text-sm">
															<span className="font-medium">Scheduled</span> •
															{new Date(request.scheduledFor).toLocaleDateString()} at {
																new Date(request.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
															}
														</p>
													)}
													{request.status === "Completed" && request.completedAt && (
														<p className="text-sm">
															<span className="font-medium">Completed</span> •
															{new Date(request.completedAt).toLocaleDateString()}
														</p>
													)}
													{request.status === "Reported" && (
														<p className="text-sm">
															<span className="font-medium">Reported</span> •
															Awaiting assessment
														</p>
													)}
												</div>

												{request.status !== "Completed" && (
													<div className="text-xs text-gray-500">
														<Timer className="h-3 w-3 inline mr-1" />
														{request.status === "Reported" ? "Just now" : "2 days ago"}
													</div>
												)}
											</div>
										</div>

										{/* Latest comment */}
										{request.comments && request.comments.length > 0 && (
											<div className="border border-gray-100 dark:border-gray-700 rounded-md p-3">
												<div className="flex items-start">
													<Avatar className="h-8 w-8 mr-2">
														<AvatarFallback>{request.comments[request.comments.length - 1].user[0]}</AvatarFallback>
													</Avatar>
													<div className="flex-1">
														<div className="flex justify-between">
															<p className="text-sm font-medium">{request.comments[request.comments.length - 1].user}</p>
															<p className="text-xs text-gray-500">
																{new Date(request.comments[request.comments.length - 1].timestamp).toLocaleDateString()}
															</p>
														</div>
														<p className="text-sm text-gray-600 dark:text-gray-300">
															{request.comments[request.comments.length - 1].text}
														</p>
													</div>
												</div>
												{request.comments.length > 1 && (
													<Button variant="ghost" size="sm" className="mt-2 w-full justify-center">
														Show {request.comments.length - 1} more comment{request.comments.length > 2 ? 's' : ''}
														<ChevronDown className="h-4 w-4 ml-1" />
													</Button>
												)}
											</div>
										)}
									</CardContent>
									<CardFooter className="flex justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
										<Button variant="outline" size="sm" asChild>
											<Link href={`/dashboard/${houseId}/maintenance/${request.id}`}>
												View Details
											</Link>
										</Button>

										<div className="flex space-x-2">
											{request.status !== "Completed" && (
												<Button variant="outline" size="sm">
													<PenLine className="h-4 w-4 mr-2" />
													Add Comment
												</Button>
											)}
											<Button
												variant="ghost"
												size="icon"
											>
												<MoreHorizontal className="h-5 w-5" />
											</Button>
										</div>
									</CardFooter>
								</Card>
							))}
						</div>
					</Tabs>
				)}
			</div>
		</DashboardLayout>
	);
} 