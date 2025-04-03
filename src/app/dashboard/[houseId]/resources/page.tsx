'use client';

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Calendar,
	CalendarDays,
	Clock,
	Filter,
	Info,
	LayoutGrid,
	ListFilter,
	Monitor,
	MoreHorizontal,
	PenTool,
	Plus,
	Printer,
	Search,
	Sofa,
	Users,
	Video,
	Zap
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

// Mock data for house resources
const mockResources = [
	{
		id: 1,
		name: "Conference Room",
		description: "Large meeting room with seating for 12 people, video conferencing equipment, and whiteboard.",
		type: "Room",
		location: "1st Floor",
		capacity: 12,
		availableNow: true,
		image: "/placeholder-conference.jpg",
		bookingCost: "Free",
		amenities: ["Video conferencing", "Whiteboard", "Display", "WiFi"],
		bookings: [
			{ date: "2023-07-15", start: "14:00", end: "16:00", bookedBy: "Alex Chen", purpose: "Team Meeting" },
			{ date: "2023-07-16", start: "10:00", end: "12:00", bookedBy: "Maya Johnson", purpose: "Client Call" }
		]
	},
	{
		id: 2,
		name: "Phone Booth 1",
		description: "Private phone booth for calls and small video meetings. Soundproof with good lighting.",
		type: "Room",
		location: "2nd Floor",
		capacity: 1,
		availableNow: false,
		image: "/placeholder-phonebooth.jpg",
		bookingCost: "Free",
		amenities: ["Soundproof", "Video call setup", "WiFi"],
		bookings: [
			{ date: "2023-07-15", start: "09:00", end: "17:00", bookedBy: "Jamie Smith", purpose: "Interviews" }
		]
	},
	{
		id: 3,
		name: "3D Printer",
		description: "Prusa i3 MK3S+ 3D printer available for prototyping and small projects.",
		type: "Equipment",
		location: "Maker Space",
		availableNow: true,
		image: "/placeholder-3dprinter.jpg",
		bookingCost: "$5/hour (materials extra)",
		amenities: ["PLA/PETG/ABS support", "0.4mm nozzle", "Training available"],
		bookings: []
	},
	{
		id: 4,
		name: "Podcast Studio",
		description: "Professional recording setup for podcasts and audio content creation.",
		type: "Room",
		location: "Basement",
		capacity: 4,
		availableNow: true,
		image: "/placeholder-podcast.jpg",
		bookingCost: "$10/hour",
		amenities: ["Microphones", "Audio interface", "Acoustic treatment", "Editing software"],
		bookings: [
			{ date: "2023-07-18", start: "13:00", end: "15:00", bookedBy: "Taylor Wong", purpose: "Podcast Recording" }
		]
	},
	{
		id: 5,
		name: "Coworking Area",
		description: "Open workspace with large tables, ergonomic chairs, and plenty of outlets.",
		type: "Area",
		location: "1st Floor",
		capacity: 20,
		availableNow: true,
		image: "/placeholder-coworking.jpg",
		bookingCost: "Free",
		amenities: ["High-speed WiFi", "Standing desks available", "Natural lighting", "Coffee bar"],
		bookings: [] // No bookings required, first come first served
	},
	{
		id: 6,
		name: "Design Workstation",
		description: "High-end computer setup for graphic design, 3D modeling, and video editing.",
		type: "Equipment",
		location: "Creative Space",
		availableNow: false,
		image: "/placeholder-design.jpg",
		bookingCost: "$5/hour",
		amenities: ["32\" 4K monitor", "Graphics tablet", "Adobe Creative Suite", "Blender", "Final Cut Pro"],
		bookings: [
			{ date: "2023-07-15", start: "10:00", end: "18:00", bookedBy: "Maya Johnson", purpose: "Client Project" }
		]
	},
	{
		id: 7,
		name: "Rooftop Deck",
		description: "Beautiful outdoor space for events, meetings, or relaxation with views of the city.",
		type: "Area",
		location: "Rooftop",
		capacity: 30,
		availableNow: true,
		image: "/placeholder-rooftop.jpg",
		bookingCost: "$20/hour for private events",
		amenities: ["Lounge seating", "BBQ grill", "Shade sails", "Speaker system"],
		bookings: [
			{ date: "2023-07-22", start: "18:00", end: "22:00", bookedBy: "House Manager", purpose: "Community BBQ" }
		]
	},
	{
		id: 8,
		name: "VR Equipment",
		description: "Meta Quest 2 VR headset with controllers and access to a library of apps and games.",
		type: "Equipment",
		location: "Game Room",
		availableNow: true,
		image: "/placeholder-vr.jpg",
		bookingCost: "Free",
		amenities: ["128GB storage", "Multiple games", "Dedicated play area"],
		bookings: []
	},
];

// Resource type options for filtering
const resourceTypes = ["All Types", "Room", "Equipment", "Area"];

export default function ResourcesPage() {
	const params = useParams();
	const houseId = params?.houseId as string;
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [selectedType, setSelectedType] = useState("All Types");

	// In a real app, we'd fetch house data based on the houseId
	const houseName =
		houseId === "sf" ? "San Francisco House" :
			houseId === "nyc" ? "New York House" :
				houseId === "seattle" ? "Seattle House" :
					"Accelr8 House";

	// Filter resources based on selected type
	const filteredResources = selectedType === "All Types"
		? mockResources
		: mockResources.filter(resource => resource.type === selectedType);

	return (
		<DashboardLayout>
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

				<Tabs defaultValue="all" className="space-y-6">
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

					{/* Grid View */}
					{viewMode === "grid" && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredResources.map((resource) => (
								<Card key={resource.id} className="overflow-hidden h-full flex flex-col bg-white dark:bg-gray-900">
									<div className="relative h-48 bg-gray-200 dark:bg-gray-800">
										<div className="absolute inset-0 flex items-center justify-center">
											{resource.type === "Room" ? (
												<Video className="h-12 w-12 text-gray-400" />
											) : resource.type === "Equipment" ? (
												<Zap className="h-12 w-12 text-gray-400" />
											) : (
												<Sofa className="h-12 w-12 text-gray-400" />
											)}
										</div>
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
												<span>Cost: {resource.bookingCost}</span>
											</div>
										</div>

										<div className="mt-4">
											<div className="flex flex-wrap gap-2">
												{resource.amenities.slice(0, 3).map((amenity, idx) => (
													<Badge key={idx} variant="outline">
														{amenity}
													</Badge>
												))}
												{resource.amenities.length > 3 && (
													<Badge variant="outline">+{resource.amenities.length - 3} more</Badge>
												)}
											</div>
										</div>
									</CardContent>

									<CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-4">
										<Button variant="outline" className="w-full" asChild>
											<Link href={`/dashboard/${houseId}/resources/${resource.id}`}>
												<Info className="h-4 w-4 mr-2" />
												Details
											</Link>
										</Button>
										<Button className="w-full ml-2" disabled={!resource.availableNow}>
											<Calendar className="h-4 w-4 mr-2" />
											Book
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					)}

					{/* List View */}
					{viewMode === "list" && (
						<div className="space-y-4">
							{filteredResources.map((resource) => (
								<Card key={resource.id} className="overflow-hidden bg-white dark:bg-gray-900">
									<div className="flex flex-col md:flex-row">
										<div className="relative md:w-48 h-32 md:h-auto bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
											{resource.type === "Room" ? (
												<Video className="h-12 w-12 text-gray-400" />
											) : resource.type === "Equipment" ? (
												<Zap className="h-12 w-12 text-gray-400" />
											) : (
												<Sofa className="h-12 w-12 text-gray-400" />
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
														<span>{resource.bookingCost}</span>
													</div>
												</div>
											</div>

											<p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{resource.description}</p>

											<div className="flex flex-wrap gap-2 mb-4">
												{resource.amenities.map((amenity, idx) => (
													<Badge key={idx} variant="outline">
														{amenity}
													</Badge>
												))}
											</div>

											<div className="flex flex-col sm:flex-row sm:items-center justify-between">
												<div className="text-sm text-gray-500 dark:text-gray-400">
													{resource.bookings.length > 0 ? (
														<span>Next booking: {resource.bookings[0].date} at {resource.bookings[0].start}</span>
													) : (
														<span>No upcoming bookings</span>
													)}
												</div>

												<div className="flex gap-2 mt-3 sm:mt-0">
													<Button variant="outline" size="sm" asChild>
														<Link href={`/dashboard/${houseId}/resources/${resource.id}`}>
															Details
														</Link>
													</Button>
													<Button size="sm" disabled={!resource.availableNow}>
														Book Now
													</Button>
												</div>
											</div>
										</div>
									</div>
								</Card>
							))}
						</div>
					)}

					{/* My Bookings Tab */}
					<TabsContent value="mine">
						<div className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Upcoming Bookings</CardTitle>
									<CardDescription>Your reserved resources</CardDescription>
								</CardHeader>
								<CardContent>
									{[1, 2].map((i) => (
										<div key={i} className="flex py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
											<div className="w-12 text-center">
												<div className="text-lg font-bold">
													{i === 1 ? '16' : '18'}
												</div>
												<div className="text-xs text-gray-500">
													{i === 1 ? 'Jul' : 'Jul'}
												</div>
											</div>
											<div className="ml-4 flex-1">
												<div className="flex justify-between">
													<h4 className="font-medium">
														{i === 1 ? 'Conference Room' : 'Podcast Studio'}
													</h4>
													<Button variant="ghost" size="icon">
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</div>
												<div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
													<Clock className="h-3 w-3 mr-1" />
													<span>
														{i === 1 ? '10:00 AM - 12:00 PM' : '1:00 PM - 3:00 PM'}
													</span>
												</div>
												<div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
													<Info className="h-3 w-3 mr-1" />
													<span>
														{i === 1 ? 'Client Meeting' : 'Podcast Recording'}
													</span>
												</div>
											</div>
										</div>
									))}
								</CardContent>
								<CardFooter>
									<Button variant="outline" className="w-full">
										View All Bookings
									</Button>
								</CardFooter>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Quick Book</CardTitle>
									<CardDescription>Reserve frequently used resources</CardDescription>
								</CardHeader>
								<CardContent className="space-y-2">
									<Button className="w-full justify-between" variant="outline">
										<div className="flex items-center">
											<Video className="h-4 w-4 mr-2" />
											<span>Phone Booth 1</span>
										</div>
										<Badge variant="outline">Available</Badge>
									</Button>
									<Button className="w-full justify-between" variant="outline">
										<div className="flex items-center">
											<Printer className="h-4 w-4 mr-2" />
											<span>3D Printer</span>
										</div>
										<Badge variant="outline">Available</Badge>
									</Button>
									<Button className="w-full justify-between" variant="outline">
										<div className="flex items-center">
											<PenTool className="h-4 w-4 mr-2" />
											<span>Design Workstation</span>
										</div>
										<Badge variant="outline">Unavailable</Badge>
									</Button>
									<Button className="w-full justify-between" variant="outline">
										<div className="flex items-center">
											<Monitor className="h-4 w-4 mr-2" />
											<span>Conference Room</span>
										</div>
										<Badge variant="outline">Available</Badge>
									</Button>
								</CardContent>
								<CardFooter>
									<Button className="w-full">
										<Plus className="h-4 w-4 mr-2" />
										New Booking
									</Button>
								</CardFooter>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</DashboardLayout>
	);
} 