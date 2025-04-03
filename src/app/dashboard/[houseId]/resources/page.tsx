'use client';

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { getResourceBookings, getUserResourceBookings, type ResourceBooking, type SanityResource } from "@/lib/api";
import { urlFor } from "@/lib/sanity";
import { createClient } from "@/lib/supabase/client";
import {
	Calendar,
	CalendarDays,
	Clock,
	Filter,
	Info,
	LayoutGrid,
	ListFilter,
	MoreHorizontal,
	Search,
	Sofa,
	Users,
	Video,
	Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookingModal } from "./BookingModal";

// Resource type options for filtering
const resourceTypes = ["All Types", "Room", "Equipment", "Area"];

// Use the types from the API instead of redefining them
type Resource = SanityResource & { availableNow: boolean; };
type Booking = ResourceBooking;

export default function ResourcesPage() {
	const params = useParams();
	const houseId = params?.houseId as string;
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [selectedType, setSelectedType] = useState("All Types");
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState("all");
	const [resources, setResources] = useState<Resource[]>([]);
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [userBookings, setUserBookings] = useState<Booking[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
	const [bookingModalOpen, setBookingModalOpen] = useState(false);
	const { toast } = useToast();

	// In a real app, we'd fetch house data based on the houseId
	const houseName =
		houseId === "sf" ? "San Francisco House" :
			houseId === "nyc" ? "New York House" :
				houseId === "seattle" ? "Seattle House" :
					"Accelr8 House";

	// Fetch resources and bookings from the API
	useEffect(() => {
		const fetchResources = async () => {
			try {
				setLoading(true);
				const { resources, bookings } = await getResourceBookings(houseId);
				setResources(resources);
				setBookings(bookings);
			} catch (error) {
				console.error('Error fetching resources:', error);
				toast({
					title: "Error fetching resources",
					description: "Please try again later",
					variant: "destructive"
				});
			} finally {
				setLoading(false);
			}
		};

		fetchResources();
	}, [houseId, toast]);

	// Fetch user bookings when the "mine" tab is selected
	useEffect(() => {
		if (activeTab === "mine") {
			const fetchUserBookings = async () => {
				try {
					setLoading(true);

					// Get current user
					const supabase = createClient();
					const { data: { user } } = await supabase.auth.getUser();

					if (!user) {
						console.error('No user found');
						return;
					}

					const userBookings = await getUserResourceBookings(user.id);
					setUserBookings(userBookings);
				} catch (error) {
					console.error('Error fetching user bookings:', error);
					toast({
						title: "Error fetching your bookings",
						description: "Please try again later",
						variant: "destructive"
					});
				} finally {
					setLoading(false);
				}
			};

			fetchUserBookings();
		}
	}, [activeTab, toast]);

	// Apply filters
	const filteredResources = resources
		.filter(resource => {
			// Filter by selected type
			const typeMatch = selectedType === "All Types" || resource.type === selectedType;

			// Filter by search query (check name, description, and location)
			const searchMatch = !searchQuery ||
				resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				resource.location?.toLowerCase().includes(searchQuery.toLowerCase());

			// Filter by availability (if "available" tab is selected)
			const availabilityMatch = activeTab !== "available" || resource.availableNow;

			return typeMatch && searchMatch && availabilityMatch;
		});

	// Function to handle booking a resource
	const handleBookResource = (resource: Resource) => {
		setSelectedResource(resource);
		setBookingModalOpen(true);
	};

	// Function to refresh the data after a successful booking
	const handleBookingSuccess = async () => {
		try {
			setLoading(true);
			// Refresh the resources and bookings data
			const { resources: updatedResources, bookings: updatedBookings } =
				await getResourceBookings(houseId);
			setResources(updatedResources);
			setBookings(updatedBookings);

			// If we're in the "mine" tab, also refresh the user bookings
			if (activeTab === "mine") {
				const supabase = createClient();
				const { data: { user } } = await supabase.auth.getUser();
				if (user) {
					const userBookings = await getUserResourceBookings(user.id);
					setUserBookings(userBookings);
				}
			}
		} catch (error) {
			console.error('Error refreshing data:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<DashboardLayout>
			{loading ? (
				<div className="flex items-center justify-center h-96">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-white"></div>
				</div>
			) : (
				<div className="p-6">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
						<div>
							<h1 className="text-2xl font-bold">Resources</h1>
							<p className="text-gray-500 dark:text-gray-400">{houseName}</p>
						</div>

						<div className="flex items-center space-x-2 mt-4 md:mt-0">
							<div className="flex border border-gray-200 dark:border-gray-700 rounded-md">
								<Button
									variant={viewMode === "grid" ? "default" : "ghost"}
									size="sm"
									className="rounded-r-none"
									onClick={() => setViewMode("grid")}
								>
									<LayoutGrid className="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === "list" ? "default" : "ghost"}
									size="sm"
									className="rounded-l-none"
									onClick={() => setViewMode("list")}
								>
									<ListFilter className="h-4 w-4" />
								</Button>
							</div>
							<Button variant="outline" size="sm">
								<Filter className="h-4 w-4 mr-2" />
								Filter
							</Button>
							<Button size="sm">
								<CalendarDays className="h-4 w-4 mr-2" />
								My Bookings
							</Button>
						</div>
					</div>

					<Tabs
						defaultValue="all"
						className="space-y-6"
						value={activeTab}
						onValueChange={setActiveTab}
					>
						<TabsList className="bg-gray-100 dark:bg-gray-800">
							<TabsTrigger value="all">All Resources</TabsTrigger>
							<TabsTrigger value="available">Available Now</TabsTrigger>
							<TabsTrigger value="popular">Popular</TabsTrigger>
							<TabsTrigger value="mine">My Bookings</TabsTrigger>
						</TabsList>

						{/* Filter Bar */}
						<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
							<div className="relative w-full max-w-xs">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
								<Input
									placeholder="Search resources..."
									className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>

							<div className="flex flex-wrap gap-2">
								{resourceTypes.map(type => (
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

						{/* All Resources, Available, and Popular Tabs */}
						<TabsContent value="all" className="space-y-6">
							{filteredResources.length === 0 ? (
								<div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-md">
									<div className="text-gray-500 dark:text-gray-400">
										<Sofa className="h-10 w-10 mx-auto mb-3" />
										<h3 className="text-lg font-medium mb-1">No resources found</h3>
										<p>
											{searchQuery
												? "Try adjusting your search term"
												: selectedType !== "All Types"
													? `No ${selectedType.toLowerCase()} resources found`
													: "No resources have been added yet"}
										</p>
									</div>
								</div>
							) : (
								viewMode === "grid" ? (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										{filteredResources.map((resource) => (
											<Card key={resource._id} className="overflow-hidden h-full flex flex-col bg-white dark:bg-gray-900">
												<div className="relative h-48 bg-gray-200 dark:bg-gray-800">
													{resource.image ? (
														<Image
															src={urlFor(resource.image).width(400).height(192).url()}
															alt={resource.name}
															className="object-cover w-full h-full"
															width={400}
															height={192}
														/>
													) : (
														<div className="absolute inset-0 flex items-center justify-center">
															{resource.type === "Room" ? (
																<Video className="h-12 w-12 text-gray-400" />
															) : resource.type === "Equipment" ? (
																<Zap className="h-12 w-12 text-gray-400" />
															) : (
																<Sofa className="h-12 w-12 text-gray-400" />
															)}
														</div>
													)}
													<Badge
														className="absolute top-2 right-2"
														variant={resource.availableNow ? "success" : "outline"}
													>
														{resource.availableNow ? "Available Now" : "Unavailable"}
													</Badge>
												</div>

												<CardHeader className="pb-2">
													<div className="flex justify-between items-start">
														<div>
															<CardTitle className="text-lg">{resource.name}</CardTitle>
															<CardDescription>{resource.location}</CardDescription>
														</div>
														<Badge>{resource.type}</Badge>
													</div>
												</CardHeader>

												<CardContent className="flex-1">
													<p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{resource.description}</p>

													<div className="space-y-2">
														{resource.capacity && (
															<div className="flex items-center text-sm">
																<Users className="h-4 w-4 mr-2 text-gray-500" />
																<span>Capacity: {resource.capacity}</span>
															</div>
														)}
														<div className="flex items-center text-sm">
															<Clock className="h-4 w-4 mr-2 text-gray-500" />
															<span>Cost: {resource.bookingCost || 'Free'}</span>
														</div>
													</div>

													<div className="mt-4">
														<div className="flex flex-wrap gap-2">
															{resource.amenities && resource.amenities.slice(0, 3).map((amenity, idx) => (
																<Badge key={idx} variant="outline">
																	{amenity}
																</Badge>
															))}
															{resource.amenities && resource.amenities.length > 3 && (
																<Badge variant="outline">+{resource.amenities.length - 3} more</Badge>
															)}
														</div>
													</div>
												</CardContent>

												<CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-4">
													<Button variant="outline" className="w-full" asChild>
														<Link href={`/dashboard/${houseId}/resources/${resource._id}`}>
															<Info className="h-4 w-4 mr-2" />
															Details
														</Link>
													</Button>
													<Button
														className="w-full ml-2"
														disabled={!resource.availableNow}
														onClick={() => handleBookResource(resource)}
													>
														<Calendar className="h-4 w-4 mr-2" />
														Book
													</Button>
												</CardFooter>
											</Card>
										))}
									</div>
								) : (
									// Continue with list view
									<div className="space-y-4">
										{filteredResources.map((resource) => (
											<Card key={resource._id} className="overflow-hidden bg-white dark:bg-gray-900">
												<div className="flex flex-col md:flex-row">
													<div className="relative md:w-48 h-32 md:h-auto bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
														{resource.image ? (
															<Image
																src={urlFor(resource.image).width(192).height(128).url()}
																alt={resource.name}
																className="object-cover w-full h-full"
																width={192}
																height={128}
															/>
														) : (
															<>
																{resource.type === "Room" ? (
																	<Video className="h-12 w-12 text-gray-400" />
																) : resource.type === "Equipment" ? (
																	<Zap className="h-12 w-12 text-gray-400" />
																) : (
																	<Sofa className="h-12 w-12 text-gray-400" />
																)}
															</>
														)}
														<Badge
															className="absolute top-2 right-2"
															variant={resource.availableNow ? "success" : "outline"}
														>
															{resource.availableNow ? "Available Now" : "Unavailable"}
														</Badge>
													</div>

													<div className="flex-1 p-4">
														<div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
															<div>
																<h3 className="text-lg font-medium">{resource.name}</h3>
																<p className="text-sm text-gray-500 dark:text-gray-400">{resource.location} • {resource.type}</p>
															</div>

															<div className="flex items-center mt-2 md:mt-0">
																{resource.capacity && (
																	<div className="flex items-center text-sm mr-4">
																		<Users className="h-4 w-4 mr-1 text-gray-500" />
																		<span>{resource.capacity}</span>
																	</div>
																)}
																<div className="flex items-center text-sm">
																	<Clock className="h-4 w-4 mr-1 text-gray-500" />
																	<span>{resource.bookingCost || 'Free'}</span>
																</div>
															</div>
														</div>

														<p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{resource.description}</p>

														<div className="flex flex-wrap gap-2 mb-4">
															{resource.amenities && resource.amenities.map((amenity, idx) => (
																<Badge key={idx} variant="outline">
																	{amenity}
																</Badge>
															))}
														</div>

														<div className="flex flex-col sm:flex-row sm:items-center justify-between">
															<div className="text-sm text-gray-500 dark:text-gray-400">
																{getResourceNextBooking(resource._id, bookings)}
															</div>

															<div className="flex gap-2 mt-3 sm:mt-0">
																<Button variant="outline" size="sm" asChild>
																	<Link href={`/dashboard/${houseId}/resources/${resource._id}`}>
																		Details
																	</Link>
																</Button>
																<Button
																	size="sm"
																	disabled={!resource.availableNow}
																	onClick={() => handleBookResource(resource)}
																>
																	Book Now
																</Button>
															</div>
														</div>
													</div>
												</div>
											</Card>
										))}
									</div>
								)
							)}
						</TabsContent>

						{/* My Bookings Tab */}
						<TabsContent value="mine">
							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Upcoming Bookings</CardTitle>
										<CardDescription>Your reserved resources</CardDescription>
									</CardHeader>
									<CardContent>
										{userBookings.length === 0 ? (
											<div className="text-center py-6 text-gray-500">
												<Calendar className="h-8 w-8 mx-auto mb-2" />
												<p>You don't have any upcoming bookings</p>
												<Button
													variant="outline"
													size="sm"
													className="mt-2"
													onClick={() => setActiveTab('all')}
												>
													Browse Resources
												</Button>
											</div>
										) : (
											<div>
												{userBookings.map((booking) => {
													const resource = resources.find(r => r._id === booking.sanity_resource_id);
													const startDate = new Date(booking.start_time);
													const endDate = new Date(booking.end_time);

													return (
														<div key={booking.id} className="flex py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
															<div className="w-12 text-center">
																<div className="text-lg font-bold">
																	{startDate.getDate()}
																</div>
																<div className="text-xs text-gray-500">
																	{startDate.toLocaleString('default', { month: 'short' })}
																</div>
															</div>
															<div className="ml-4 flex-1">
																<div className="flex justify-between">
																	<h4 className="font-medium">
																		{resource?.name || booking.title}
																	</h4>
																	<Button variant="ghost" size="icon">
																		<MoreHorizontal className="h-4 w-4" />
																	</Button>
																</div>
																<div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
																	<Clock className="h-3 w-3 mr-1" />
																	<span>
																		{formatTime(startDate)} - {formatTime(endDate)}
																	</span>
																</div>
																<div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
																	<Info className="h-3 w-3 mr-1" />
																	<span>
																		{booking.description || 'No description provided'}
																	</span>
																</div>
															</div>
														</div>
													);
												})}
											</div>
										)}
									</CardContent>
									{userBookings.length > 0 && (
										<CardFooter>
											<Button variant="outline" className="w-full">
												View All Bookings
											</Button>
										</CardFooter>
									)}
								</Card>
							</div>
						</TabsContent>
					</Tabs>

					{/* Resource Booking Modal */}
					<BookingModal
						resource={selectedResource}
						houseId={houseId}
						isOpen={bookingModalOpen}
						onClose={() => setBookingModalOpen(false)}
						onSuccess={handleBookingSuccess}
					/>
				</div>
			)}
		</DashboardLayout>
	);
}

// Helper function to format time
function formatTime(date: Date) {
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Helper function to get the next booking for a resource
function getResourceNextBooking(resourceId: string, bookings: Booking[]) {
	const resourceBookings = bookings.filter(b =>
		b.sanity_resource_id === resourceId &&
		b.status === 'confirmed'
	);

	if (resourceBookings.length === 0) {
		return <span>No upcoming bookings</span>;
	}

	// Sort by start time
	resourceBookings.sort((a, b) =>
		new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
	);

	const nextBooking = resourceBookings[0];
	const startDate = new Date(nextBooking.start_time);

	return (
		<span>
			Next booking: {startDate.toLocaleDateString()} at {formatTime(startDate)}
		</span>
	);
} 