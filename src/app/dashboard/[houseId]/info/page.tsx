"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Bath,
	Coffee,
	Copy,
	FileText,
	House,
	MapPin,
	Phone,
	Sofa,
	User,
	Wifi,
	Wrench
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Mock data for house information
const houseData = {
	id: "sf-mission",
	name: "Mission House",
	address: "123 Valencia St, San Francisco, CA 94103",
	description: "A vibrant coliving space in the heart of the Mission District, focused on founders and creatives.",
	capacity: 12,
	occupancy: 10,
	yearFounded: 2019,
	squareFeet: 4500,
	imageUrl: "/images/houses/mission-house.jpg",
	amenities: [
		{ name: "High-speed WiFi", icon: Wifi },
		{ name: "Fully equipped kitchen", icon: Coffee },
		{ name: "Shared workspaces", icon: Sofa },
		{ name: "Private bathrooms", icon: Bath },
		{ name: "Weekly cleaning", icon: Wrench },
	],
	houseRules: [
		{ title: "Quiet Hours", description: "Please keep noise to a minimum between 10pm and 7am." },
		{ title: "Guests", description: "Guests are welcome but must be registered in advance. Maximum 2 guests per resident at a time." },
		{ title: "Common Areas", description: "Please clean up after yourself in all common areas. Leave them better than you found them." },
		{ title: "Events", description: "House events have priority for common space usage. Check the calendar before planning your own event." },
		{ title: "Smoking", description: "No smoking anywhere in the house. There is a designated outdoor smoking area." },
	],
	faqs: [
		{
			question: "How do I reserve the meeting room?",
			answer: "You can reserve the meeting room through the Resources section of the dashboard. Bookings can be made up to 2 weeks in advance."
		},
		{
			question: "What should I do if something breaks?",
			answer: "Please submit a maintenance request through the Maintenance section of the dashboard. For emergencies, contact the house manager directly."
		},
		{
			question: "How does billing work?",
			answer: "Rent is due on the 1st of every month. You can view your billing history and make payments through the Billing section of the dashboard."
		},
		{
			question: "Can I have overnight guests?",
			answer: "Yes, overnight guests are allowed for up to 3 consecutive nights. Please register them in advance through the dashboard."
		},
		{
			question: "How do I connect to the WiFi?",
			answer: "The WiFi details are posted in the kitchen and common areas. If you have trouble connecting, please submit a maintenance request."
		},
		{
			question: "How do I organize a house event?",
			answer: "House events can be proposed through the Events section of the dashboard. Once approved by the house manager, they will be added to the calendar."
		},
	],
	houseManager: {
		name: "Alex Johnson",
		role: "House Manager",
		email: "alex@accelr8houses.com",
		phone: "+1 (415) 555-1234",
		imageUrl: "/images/team/alex.jpg",
	},
	emergencyContacts: [
		{ name: "House Manager (Alex)", phone: "+1 (415) 555-1234" },
		{ name: "Maintenance Emergency", phone: "+1 (415) 555-5678" },
		{ name: "Police/Fire/Medical", phone: "911" },
	],
	nearbyResources: [
		{ name: "Whole Foods Market", address: "2001 Market St", type: "Grocery", distance: "0.4 miles" },
		{ name: "Mission Cliffs Climbing", address: "2295 Harrison St", type: "Fitness", distance: "0.6 miles" },
		{ name: "Dolores Park", address: "Dolores St & 19th St", type: "Recreation", distance: "0.3 miles" },
		{ name: "UCSF Medical Center", address: "505 Parnassus Ave", type: "Medical", distance: "2.1 miles" },
		{ name: "El Techo", address: "2516 Mission St", type: "Restaurant", distance: "0.2 miles" },
	],
};

export default function HouseInfoPage() {
	const [activeTab, setActiveTab] = useState("overview");

	return (
		<DashboardLayout>
			<div className="container mx-auto p-6">
				<div className="flex flex-col space-y-8">
					{/* House header with image */}
					<div className="relative w-full h-64 rounded-xl overflow-hidden">
						<div className="absolute inset-0 bg-black/50 z-10 flex items-end">
							<div className="p-6 text-white">
								<h1 className="text-3xl font-bold">{houseData.name}</h1>
								<div className="flex items-center mt-2">
									<MapPin className="h-4 w-4 mr-2" />
									<p>{houseData.address}</p>
								</div>
							</div>
						</div>
						<Image
							src={houseData.imageUrl}
							alt={houseData.name}
							fill
							className="object-cover"
						/>
					</div>

					{/* Tabs for different sections */}
					<Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
						<TabsList className="grid grid-cols-5 w-full">
							<TabsTrigger value="overview">Overview</TabsTrigger>
							<TabsTrigger value="amenities">Amenities</TabsTrigger>
							<TabsTrigger value="rules">House Rules</TabsTrigger>
							<TabsTrigger value="faq">FAQ</TabsTrigger>
							<TabsTrigger value="contacts">Contacts</TabsTrigger>
						</TabsList>

						{/* Overview Tab */}
						<TabsContent value="overview" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>House Overview</CardTitle>
									<CardDescription>Everything you need to know about {houseData.name}</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* House description */}
									<div className="space-y-2">
										<h3 className="text-lg font-medium">About This House</h3>
										<p className="text-muted-foreground">{houseData.description}</p>
									</div>

									{/* House stats */}
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
										<div className="bg-muted rounded-lg p-4">
											<p className="text-sm text-muted-foreground">Capacity</p>
											<p className="text-2xl font-bold">{houseData.capacity} residents</p>
										</div>
										<div className="bg-muted rounded-lg p-4">
											<p className="text-sm text-muted-foreground">Current Occupancy</p>
											<p className="text-2xl font-bold">{houseData.occupancy}/{houseData.capacity}</p>
										</div>
										<div className="bg-muted rounded-lg p-4">
											<p className="text-sm text-muted-foreground">Established</p>
											<p className="text-2xl font-bold">{houseData.yearFounded}</p>
										</div>
										<div className="bg-muted rounded-lg p-4">
											<p className="text-sm text-muted-foreground">Size</p>
											<p className="text-2xl font-bold">{houseData.squareFeet} sq ft</p>
										</div>
									</div>

									{/* Nearby resources */}
									<div className="space-y-3">
										<h3 className="text-lg font-medium">Nearby Resources</h3>
										<div className="space-y-2">
											{houseData.nearbyResources.map((resource, index) => (
												<div key={index} className="flex justify-between items-center py-2 border-b">
													<div>
														<p className="font-medium">{resource.name}</p>
														<p className="text-sm text-muted-foreground">{resource.address}</p>
													</div>
													<div className="text-right">
														<p className="text-sm">{resource.type}</p>
														<p className="text-sm text-muted-foreground">{resource.distance}</p>
													</div>
												</div>
											))}
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Amenities Tab */}
						<TabsContent value="amenities" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>House Amenities</CardTitle>
									<CardDescription>Features and facilities available at {houseData.name}</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{houseData.amenities.map((amenity, index) => {
											const Icon = amenity.icon;
											return (
												<div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
													<div className="p-2 bg-primary/10 rounded-full">
														<Icon className="h-6 w-6 text-primary" />
													</div>
													<div>
														<h3 className="font-medium">{amenity.name}</h3>
													</div>
												</div>
											);
										})}
									</div>

									{/* Additional amenities sections */}
									<div className="space-y-3">
										<h3 className="text-lg font-medium">Common Areas</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
											<div className="p-4 bg-muted rounded-lg">
												<p className="font-medium">Living Room</p>
												<p className="text-sm text-muted-foreground">Large communal space with comfortable seating, TV, and game console</p>
											</div>
											<div className="p-4 bg-muted rounded-lg">
												<p className="font-medium">Kitchen</p>
												<p className="text-sm text-muted-foreground">Fully equipped with modern appliances, 2 refrigerators, and cooking essentials</p>
											</div>
											<div className="p-4 bg-muted rounded-lg">
												<p className="font-medium">Workspaces</p>
												<p className="text-sm text-muted-foreground">Dedicated quiet areas with desks, chairs, and monitors</p>
											</div>
											<div className="p-4 bg-muted rounded-lg">
												<p className="font-medium">Outdoor Patio</p>
												<p className="text-sm text-muted-foreground">Garden space with seating, BBQ, and relaxation area</p>
											</div>
										</div>
									</div>

									<Button variant="outline" className="w-full">
										<Link href="/dashboard/[houseId]/resources" as={`/dashboard/${houseData.id}/resources`} className="w-full">
											View Bookable Resources
										</Link>
									</Button>
								</CardContent>
							</Card>
						</TabsContent>

						{/* House Rules Tab */}
						<TabsContent value="rules" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>House Rules</CardTitle>
									<CardDescription>Guidelines for harmonious community living</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="space-y-4">
										{houseData.houseRules.map((rule, index) => (
											<div key={index} className="p-4 border rounded-lg">
												<h3 className="font-medium">{rule.title}</h3>
												<p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
											</div>
										))}
									</div>

									<div className="space-y-2">
										<h3 className="text-lg font-medium">General Guidelines</h3>
										<ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
											<li>Respect your fellow residents and their space.</li>
											<li>Clean up after yourself in common areas.</li>
											<li>Label your food in shared refrigerators.</li>
											<li>Report maintenance issues promptly.</li>
											<li>Participate in house meetings when possible.</li>
											<li>Communicate with housemates about guests in advance.</li>
											<li>Respect privacy and quiet hours.</li>
										</ul>
									</div>

									<Button variant="outline" asChild>
										<Link href="#">Download Complete House Manual (PDF)</Link>
									</Button>
								</CardContent>
							</Card>
						</TabsContent>

						{/* FAQ Tab */}
						<TabsContent value="faq" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Frequently Asked Questions</CardTitle>
									<CardDescription>Common questions and answers about living at {houseData.name}</CardDescription>
								</CardHeader>
								<CardContent>
									<Accordion type="single" collapsible className="w-full">
										{houseData.faqs.map((faq, index) => (
											<AccordionItem key={index} value={`item-${index}`}>
												<AccordionTrigger>{faq.question}</AccordionTrigger>
												<AccordionContent>{faq.answer}</AccordionContent>
											</AccordionItem>
										))}
									</Accordion>

									<div className="mt-6 p-4 bg-muted rounded-lg">
										<h3 className="font-medium">Have another question?</h3>
										<p className="text-sm text-muted-foreground mt-1">
											If you can't find the answer to your question, feel free to reach out to the house manager or post in the community section.
										</p>
										<div className="flex space-x-2 mt-4">
											<Button variant="outline" asChild size="sm">
												<Link href={`/dashboard/${houseData.id}/community`}>Go to Community</Link>
											</Button>
											<Button variant="default" size="sm">
												<Link href="#contacts" onClick={() => setActiveTab("contacts")}>Contact House Manager</Link>
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Contacts Tab */}
						<TabsContent value="contacts" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Important Contacts</CardTitle>
									<CardDescription>Who to reach out to for different needs</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* House Manager */}
									<div className="p-4 border rounded-lg">
										<div className="flex items-center space-x-4">
											<Avatar className="h-12 w-12">
												<AvatarImage src={houseData.houseManager.imageUrl} />
												<AvatarFallback>{houseData.houseManager.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
											</Avatar>
											<div>
												<h3 className="font-medium">{houseData.houseManager.name}</h3>
												<p className="text-sm text-muted-foreground">{houseData.houseManager.role}</p>
											</div>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
											<div className="flex items-center">
												<Phone className="h-4 w-4 mr-2 text-muted-foreground" />
												<p className="text-sm">{houseData.houseManager.phone}</p>
											</div>
											<div className="flex items-center">
												<Copy
													className="h-4 w-4 mr-2 text-muted-foreground cursor-pointer"
													onClick={() => {
														navigator.clipboard.writeText(houseData.houseManager.email);
													}}
												/>
												<p className="text-sm">{houseData.houseManager.email}</p>
											</div>
										</div>
									</div>

									{/* Emergency Contacts */}
									<div className="space-y-3">
										<h3 className="text-lg font-medium">Emergency Contacts</h3>
										<div className="space-y-2">
											{houseData.emergencyContacts.map((contact, index) => (
												<div key={index} className="flex justify-between items-center p-3 border rounded-lg">
													<p className="font-medium">{contact.name}</p>
													<p className="text-sm font-mono">{contact.phone}</p>
												</div>
											))}
										</div>
									</div>

									{/* Quick Links */}
									<div className="space-y-3">
										<h3 className="text-lg font-medium">Quick Links</h3>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
											<Link
												href={`/dashboard/${houseData.id}/maintenance`}
												className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted"
											>
												<Wrench className="h-5 w-5" />
												<span>Submit Maintenance Request</span>
											</Link>
											<Link
												href={`/dashboard/${houseData.id}/community`}
												className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted"
											>
												<User className="h-5 w-5" />
												<span>Community Discussion</span>
											</Link>
											<Link
												href={`/dashboard/${houseData.id}/events`}
												className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted"
											>
												<FileText className="h-5 w-5" />
												<span>House Calendar</span>
											</Link>
											<Link
												href="#"
												className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted"
											>
												<House className="h-5 w-5" />
												<span>House Manual (PDF)</span>
											</Link>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</DashboardLayout>
	);
} 