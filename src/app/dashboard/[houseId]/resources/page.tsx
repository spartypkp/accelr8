'use client';

import { ResourcesCard } from "@/components/dashboard/cards/ResourcesCard";
import { DashboardPanel } from "@/components/dashboard/panels/DashboardPanel";
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
		<div className="container mx-auto py-6">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Resources</h1>
					<p className="text-muted-foreground">{houseName}</p>
				</div>

				<div className="flex items-center space-x-2 mt-4 md:mt-0">
					<div className="flex border rounded-md">
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

			{/* Card Overview Section */}
			<DashboardPanel className="mb-8">
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
					{/* Available Resources Card */}
					<ResourcesCard houseId={houseId} limit={5} />

					{/* My Upcoming Bookings Card */}
					<Card className="overflow-hidden">
						<CardHeader className="pb-2">
							<CardTitle className="text-base">My Upcoming Bookings</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							{userBookings.length > 0 ? (
								<div className="divide-y">
									{userBookings.slice(0, 3).map((booking) => {
										const resource = resources.find(r => r._id === booking.resourceId);
										return resource ? (
											<div key={booking._id} className="p-4 hover:bg-muted/50 transition-colors">
												<div className="flex justify-between mb-1">
													<div className="font-medium">{resource.name}</div>
													<Badge variant="outline">{resource.type}</Badge>
												</div>
												<div className="text-sm text-muted-foreground flex items-center gap-1">
													<Calendar className="h-3 w-3" />
													<span>{new Date(booking.startTime).toLocaleDateString()}</span>
												</div>
												<div className="text-sm text-muted-foreground flex items-center gap-1">
													<Clock className="h-3 w-3" />
													<span>
														{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
														{new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
													</span>
												</div>
											</div>
										) : null;
									})}
								</div>
							) : (
								<div className="flex flex-col items-center justify-center p-8 text-center">
									<CalendarDays className="h-8 w-8 text-muted-foreground/60 mb-3" />
									<p className="text-sm text-muted-foreground mb-3">You don't have any upcoming bookings</p>
									<Button variant="outline" size="sm">Book a Resource</Button>
								</div>
							)}
						</CardContent>
						{userBookings.length > 0 && (
							<CardFooter className="border-t p-3">
								<Button variant="outline" size="sm" className="w-full">View All Bookings</Button>
							</CardFooter>
						)}
					</Card>

					{/* Popular Resources Card */}
					<Card className="overflow-hidden">
						<CardHeader className="pb-2">
							<CardTitle className="text-base">Popular Resources</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							<div className="divide-y">
								{resources.slice(0, 3).map((resource) => (
									<div key={resource._id} className="p-4 hover:bg-muted/50 transition-colors">
										<div className="flex justify-between mb-1">
											<div className="font-medium">{resource.name}</div>
											<Badge variant="outline">{resource.type}</Badge>
										</div>
										<div className="text-sm text-muted-foreground">{resource.description}</div>
										<div className="mt-2 flex items-center gap-2">
											<Button variant="outline" size="sm" className="h-7 px-2.5 text-xs" onClick={() => handleBookResource(resource)}>
												Book Now
											</Button>
											<Badge variant={resource.availableNow ? "success" : "destructive"} className="h-5 text-[10px]">
												{resource.availableNow ? 'Available' : 'In Use'}
											</Badge>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</DashboardPanel>

			{/* Main Resources Listing */}
			<Tabs
				defaultValue="all"
				className="space-y-6"
				value={activeTab}
				onValueChange={setActiveTab}
			>
				<TabsList className="bg-muted">
					<TabsTrigger value="all">All Resources</TabsTrigger>
					<TabsTrigger value="available">Available Now</TabsTrigger>
					<TabsTrigger value="popular">Popular</TabsTrigger>
					<TabsTrigger value="mine">My Bookings</TabsTrigger>
				</TabsList>

				{/* Filter Bar */}
				<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
					<div className="relative w-full max-w-xs">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
						<Input
							placeholder="Search resources..."
							className="pl-10"
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

				{/* Resource listings */}
				<TabsContent value="all" className="m-0">
					{filteredResources.length === 0 ? (
						<Card className="flex flex-col items-center justify-center p-12 text-center">
							<Info className="h-10 w-10 text-muted-foreground mb-4" />
							<CardTitle className="text-xl mb-2">No resources found</CardTitle>
							<CardDescription>Try adjusting your filters or search criteria</CardDescription>
						</Card>
					) : (
						<div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
							{filteredResources.map((resource) => (
								<Card key={resource._id} className={viewMode === "list" ? "overflow-hidden flex" : ""}>
									{resource.image && viewMode === "grid" && (
										<div className="relative h-48 w-full overflow-hidden">
											<Image
												src={urlFor(resource.image).url()}
												alt={resource.name}
												fill
												className="object-cover"
											/>
											<Badge className={`absolute top-2 right-2 ${resource.availableNow
												? 'bg-green-500'
												: 'bg-red-500'
												}`}>
												{resource.availableNow ? 'Available' : 'In Use'}
											</Badge>
										</div>
									)}

									<div className={viewMode === "list" ? "flex-none w-24 h-24 relative" : "hidden"}>
										{resource.image ? (
											<Image
												src={urlFor(resource.image).url()}
												alt={resource.name}
												fill
												className="object-cover"
											/>
										) : (
											<div className="bg-muted h-full w-full flex items-center justify-center">
												<Sofa className="h-8 w-8 text-muted-foreground" />
											</div>
										)}
									</div>

									<div className={viewMode === "list" ? "flex-1" : ""}>
										<CardHeader className={viewMode === "list" ? "p-3" : ""}>
											<div className="flex items-center justify-between">
												<CardTitle className={viewMode === "list" ? "text-base" : ""}>
													{resource.name}
												</CardTitle>
												{viewMode === "list" && (
													<Badge className={resource.availableNow ? 'bg-green-500' : 'bg-red-500'}>
														{resource.availableNow ? 'Available' : 'In Use'}
													</Badge>
												)}
											</div>
											<CardDescription className="flex items-center gap-1">
												{resource.type === "Room" ? (
													<Video className="h-3 w-3" />
												) : resource.type === "Equipment" ? (
													<Zap className="h-3 w-3" />
												) : (
													<Sofa className="h-3 w-3" />
												)}
												<span>{resource.type}</span>
												{resource.location && (
													<>
														<span className="mx-1">•</span>
														<span>{resource.location}</span>
													</>
												)}
											</CardDescription>
										</CardHeader>

										<CardContent className={viewMode === "list" ? "p-3 pt-0" : ""}>
											{resource.description && (
												<p className="text-sm text-muted-foreground mb-3">
													{resource.description}
												</p>
											)}

											{resource.capacity && (
												<div className="flex items-center text-sm text-muted-foreground mb-1">
													<Users className="h-4 w-4 mr-2" />
													<span>Capacity: {resource.capacity}</span>
												</div>
											)}

											{bookings.length > 0 && !resource.availableNow && (
												<div className="flex items-center text-sm text-muted-foreground">
													<Clock className="h-4 w-4 mr-2" />
													<span>
														Next available: {formatNextAvailableTime(resource._id, bookings)}
													</span>
												</div>
											)}
										</CardContent>

										<CardFooter className={`${viewMode === "list" ? "p-3 pt-0" : ""} flex justify-between items-center`}>
											<Button onClick={() => handleBookResource(resource)}>
												Book Now
											</Button>
											<Button variant="ghost" size="icon">
												<MoreHorizontal className="h-5 w-5" />
											</Button>
										</CardFooter>
									</div>
								</Card>
							))}
						</div>
					)}
				</TabsContent>

				{/* Mirror structure for other tabs */}
				<TabsContent value="available" className="m-0">
					{/* Content for available resources */}
				</TabsContent>

				<TabsContent value="popular" className="m-0">
					{/* Content for popular resources */}
				</TabsContent>

				<TabsContent value="mine" className="m-0">
					{activeTab === "mine" && userBookings.length === 0 ? (
						<Card className="flex flex-col items-center justify-center p-12 text-center">
							<CalendarDays className="h-10 w-10 text-muted-foreground mb-4" />
							<CardTitle className="text-xl mb-2">No bookings found</CardTitle>
							<CardDescription className="mb-4">You haven't booked any resources yet</CardDescription>
							<Button onClick={() => setActiveTab("all")}>Browse Resources</Button>
						</Card>
					) : (
						<div className="space-y-4">
							{/* User booking list would go here */}
						</div>
					)}
				</TabsContent>
			</Tabs>

			{/* Booking Modal */}
			{selectedResource && (
				<BookingModal
					resource={selectedResource}
					isOpen={bookingModalOpen}
					onClose={() => setBookingModalOpen(false)}
					onBookingSuccess={handleBookingSuccess}
				/>
			)}
		</div>
	);
}

// Format the next available time for a resource
function formatNextAvailableTime(resourceId: string, bookings: Booking[]) {
	const nextBooking = getResourceNextBooking(resourceId, bookings);
	if (!nextBooking) return "Unknown";

	const now = new Date();
	const endTime = new Date(nextBooking.endTime);

	// If ends today, show "Today at HH:MM"
	if (endTime.toDateString() === now.toDateString()) {
		return `Today at ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
	}

	// If ends tomorrow, show "Tomorrow at HH:MM"
	const tomorrow = new Date(now);
	tomorrow.setDate(now.getDate() + 1);
	if (endTime.toDateString() === tomorrow.toDateString()) {
		return `Tomorrow at ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
	}

	// Otherwise show date and time
	return `${endTime.toLocaleDateString()} at ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

// Get the current/next booking for a resource
function getResourceNextBooking(resourceId: string, bookings: Booking[]) {
	const now = new Date();

	// Find current bookings (where now is between start and end time)
	const currentBookings = bookings.filter(b =>
		b.resourceId === resourceId &&
		new Date(b.startTime) <= now &&
		new Date(b.endTime) > now
	);

	if (currentBookings.length > 0) {
		// Sort by end time (ascending) to get the one that ends first
		return currentBookings.sort((a, b) =>
			new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
		)[0];
	}

	// If no current bookings, return null
	return null;
} 