'use client';

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { createMaintenanceRequest, getMaintenanceRequests, type MaintenanceRequest } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";
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
import { useEffect, useState } from "react";
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
	const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedIssueType, setSelectedIssueType] = useState<string>("");
	const [newRequest, setNewRequest] = useState({
		title: "",
		description: "",
		priority: "medium" as 'low' | 'medium' | 'high' | 'emergency',
		location: "",
		room_details: "",
		issue_type: ""
	});
	const { toast } = useToast();

	// In a real app, we'd fetch house data based on the houseId
	const houseName =
		houseId === "sf" ? "San Francisco House" :
			houseId === "nyc" ? "New York House" :
				houseId === "seattle" ? "Seattle House" :
					"Accelr8 House";

	// Fetch maintenance requests
	useEffect(() => {
		const fetchRequests = async () => {
			try {
				setLoading(true);
				const data = await getMaintenanceRequests(houseId, undefined, selectedStatus);
				setRequests(data);
			} catch (error) {
				console.error('Error fetching maintenance requests:', error);
				toast({
					title: "Error fetching maintenance requests",
					description: "Please try again later",
					variant: "destructive"
				});
			} finally {
				setLoading(false);
			}
		};

		fetchRequests();
	}, [houseId, selectedStatus]);

	// Filter maintenance requests based on search query
	const filteredRequests = requests.filter(request =>
		request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
		request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
		request.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
		request.room_details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
		request.requested_by.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Handle form submission
	const handleSubmitRequest = async () => {
		try {
			// Get user ID from current session
			const supabase = createClient();
			const { data: { user } } = await supabase.auth.getUser();

			if (!user) {
				toast({
					title: "Authentication error",
					description: "You must be logged in to submit a request",
					variant: "destructive"
				});
				return;
			}

			if (!newRequest.title || !newRequest.description || !newRequest.priority) {
				toast({
					title: "Missing information",
					description: "Please fill in all required fields",
					variant: "destructive"
				});
				return;
			}

			const requestData = {
				sanity_house_id: houseId,
				requested_by: user.id,
				title: newRequest.title,
				description: newRequest.description,
				priority: newRequest.priority,
				location: newRequest.location,
				room_details: newRequest.room_details
			};

			await createMaintenanceRequest(requestData);

			// Reset form and fetch updated list
			setNewRequest({
				title: "",
				description: "",
				priority: "medium",
				location: "",
				room_details: "",
				issue_type: ""
			});
			setIsSubmittingNew(false);

			// Refresh the request list
			const updatedRequests = await getMaintenanceRequests(houseId);
			setRequests(updatedRequests);

			toast({
				title: "Request submitted",
				description: "Your maintenance request has been successfully submitted",
			});
		} catch (error) {
			console.error('Error submitting maintenance request:', error);
			toast({
				title: "Error submitting request",
				description: "Please try again later",
				variant: "destructive"
			});
		}
	};

	// Counts for dashboard stats
	const activeCount = requests.filter(r => r.status !== 'completed').length;
	const completedCount = requests.filter(r => r.status === 'completed').length;
	const highPriorityCount = requests.filter(r => r.priority === 'high' && r.status !== 'completed').length;

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
							<form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmitRequest(); }}>
								<div>
									<label className="block text-sm font-medium mb-1" htmlFor="issue-title">
										Issue Title
									</label>
									<Input
										id="issue-title"
										placeholder="Brief description of the issue (e.g., 'Broken light in bathroom')"
										value={newRequest.title}
										onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
										required
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
													variant={newRequest.issue_type === type.label ? "default" : "outline"}
													className="justify-start"
													type="button"
													onClick={() => setNewRequest({ ...newRequest, issue_type: type.label })}
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
													value={newRequest.location}
													onChange={(e) => setNewRequest({ ...newRequest, location: e.target.value })}
												>
													<option value="">Select area</option>
													{houseLocations.map((location) => (
														<option key={location} value={location}>{location}</option>
													))}
												</select>
											</div>
											<div>
												<label className="block text-xs mb-1" htmlFor="room">Room/Unit</label>
												<Input
													id="room"
													placeholder="Room number or identifier"
													value={newRequest.room_details}
													onChange={(e) => setNewRequest({ ...newRequest, room_details: e.target.value })}
												/>
											</div>
										</div>

										<div className="mt-4">
											<label className="block text-sm font-medium mb-1" htmlFor="priority">
												Priority
											</label>
											<div className="flex space-x-2">
												<Button
													type="button"
													variant={newRequest.priority === "low" ? "default" : "outline"}
													className="flex-1"
													onClick={() => setNewRequest({ ...newRequest, priority: "low" })}
												>
													Low
												</Button>
												<Button
													type="button"
													variant={newRequest.priority === "medium" ? "default" : "outline"}
													className="flex-1"
													onClick={() => setNewRequest({ ...newRequest, priority: "medium" })}
												>
													Medium
												</Button>
												<Button
													type="button"
													variant={newRequest.priority === "high" ? "default" : "outline"}
													className="flex-1"
													onClick={() => setNewRequest({ ...newRequest, priority: "high" })}
												>
													High
												</Button>
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
										value={newRequest.description}
										onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
										required
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
							<Button onClick={handleSubmitRequest} disabled={loading}>
								{loading ? "Submitting..." : "Submit Request"}
							</Button>
						</CardFooter>
					</Card>
				) : (
					<Tabs defaultValue="all" className="space-y-6">
						<TabsList className="bg-gray-100 dark:bg-gray-800">
							<TabsTrigger value="all" onClick={() => setSelectedStatus("All")}>All Requests</TabsTrigger>
							<TabsTrigger value="active" onClick={() => setSelectedStatus("in_progress")}>In Progress</TabsTrigger>
							<TabsTrigger value="scheduled" onClick={() => setSelectedStatus("assigned")}>Scheduled</TabsTrigger>
							<TabsTrigger value="completed" onClick={() => setSelectedStatus("completed")}>Completed</TabsTrigger>
						</TabsList>

						{/* Filter & Search */}
						<div className="flex items-center gap-4 mb-6">
							<div className="relative w-full max-w-md">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
								<Input
									placeholder="Search requests..."
									className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
						</div>

						{/* Loading state */}
						{loading ? (
							<div className="flex items-center justify-center py-10">
								<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 dark:border-white"></div>
							</div>
						) : filteredRequests.length === 0 ? (
							<div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-md">
								<div className="text-gray-500 dark:text-gray-400">
									<Wrench className="h-10 w-10 mx-auto mb-3" />
									<h3 className="text-lg font-medium mb-1">No maintenance requests found</h3>
									<p>
										{searchQuery
											? "Try adjusting your search term"
											: selectedStatus !== "All"
												? `There are no ${selectedStatus} requests`
												: "Submit a new request to get help with any issues"
										}
									</p>
									<Button className="mt-4" onClick={() => setIsSubmittingNew(true)}>
										<Plus className="h-4 w-4 mr-2" />
										New Request
									</Button>
								</div>
							</div>
						) : (
							/* Maintenance Requests List */
							<div className="space-y-4">
								{filteredRequests.map((request) => (
									<Card key={request.id} className={
										request.priority === "high" ? "border-l-4 border-red-500" :
											request.priority === "medium" ? "border-l-4 border-yellow-500" : ""
									}>
										<CardHeader className="pb-2">
											<div className="flex justify-between items-start">
												<div>
													<CardTitle className="text-lg flex items-center">
														{request.title}
														{request.priority === "high" && (
															<Badge className="ml-2" variant="destructive">High Priority</Badge>
														)}
													</CardTitle>
													<CardDescription>
														{request.location} • {request.room_details} • Reported {new Date(request.created_at || '').toLocaleDateString()}
													</CardDescription>
												</div>
												<Badge className={
													request.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
														request.status === "in_progress" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" :
															request.status === "assigned" ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" :
																"bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
												}>
													{request.status === "open" ? "Open" :
														request.status === "assigned" ? "Scheduled" :
															request.status === "in_progress" ? "In Progress" :
																request.status === "waiting_parts" ? "Waiting for Parts" :
																	request.status === "completed" ? "Completed" :
																		request.status === "cancelled" ? "Cancelled" :
																			request.status}
												</Badge>
											</div>
										</CardHeader>
										<CardContent className="pb-4">
											<p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{request.description}</p>

											{/* Status details */}
											<div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 mb-4">
												<div className="flex items-center">
													{request.status === "in_progress" ? (
														<Wrench className="h-5 w-5 text-blue-500 mr-2" />
													) : request.status === "assigned" ? (
														<Calendar className="h-5 w-5 text-purple-500 mr-2" />
													) : request.status === "completed" ? (
														<CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
													) : (
														<Clock className="h-5 w-5 text-gray-500 mr-2" />
													)}

													<div className="flex-1">
														{request.status === "in_progress" && (
															<p className="text-sm">
																<span className="font-medium">In Progress</span> •
																Assigned to {request.assigned_to}
															</p>
														)}
														{request.status === "assigned" && request.estimated_completion && (
															<p className="text-sm">
																<span className="font-medium">Scheduled</span> •
																{new Date(request.estimated_completion).toLocaleDateString()} at {
																	new Date(request.estimated_completion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
																}
															</p>
														)}
														{request.status === "completed" && request.actual_completion && (
															<p className="text-sm">
																<span className="font-medium">Completed</span> •
																{new Date(request.actual_completion).toLocaleDateString()}
															</p>
														)}
														{request.status === "open" && (
															<p className="text-sm">
																<span className="font-medium">Reported</span> •
																Awaiting assessment
															</p>
														)}
													</div>

													{request.status !== "completed" && (
														<div className="text-xs text-gray-500">
															<Timer className="h-3 w-3 inline mr-1" />
															{request.status === "open" ? "Just now" : "2 days ago"}
														</div>
													)}
												</div>
											</div>

											{/* Latest comment */}
											{request.resolution_notes && request.resolution_notes.length > 0 && (
												<div className="border border-gray-100 dark:border-gray-700 rounded-md p-3">
													<div className="flex items-start">
														<Avatar className="h-8 w-8 mr-2">
															<AvatarFallback>{request.requested_by[0]}</AvatarFallback>
														</Avatar>
														<div className="flex-1">
															<div className="flex justify-between">
																<p className="text-sm font-medium">{request.requested_by}</p>
																<p className="text-xs text-gray-500">
																	{new Date(request.updated_at || '').toLocaleDateString()}
																</p>
															</div>
															<p className="text-sm text-gray-600 dark:text-gray-300">
																{request.resolution_notes}
															</p>
														</div>
													</div>
													{request.resolution_notes.length > 1 && (
														<Button variant="ghost" size="sm" className="mt-2 w-full justify-center">
															Show {request.resolution_notes.length - 1} more comment{request.resolution_notes.length > 2 ? 's' : ''}
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
												{request.status !== "completed" && (
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
						)}
					</Tabs>
				)}
			</div>
		</DashboardLayout>
	);
} 