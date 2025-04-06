'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import {
	Bath, Building, Calendar, Coffee,
	CreditCard,
	MapPin, Phone, Sofa,
	Users, Wifi, Wrench
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// export async function generateMetadata(
// 	{ params }: { params: { houseId: string; }; }
// ): Promise<Metadata> {
// 	const house = await getHouse(params.houseId);
// 	if (!house) {
// 		return {
// 			title: "House Not Found | Accelr8",
// 		};
// 	}

// 	return {
// 		title: `${house.name} Dashboard | Accelr8`,
// 		description: `Manage your stay at ${house.name}`,
// 	};
// }

// Mock data for house information - in a real app, this would come from the API
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
	],
};

// Navigation items for main dashboard functions
const navigationItems = [
	{
		title: "Community",
		description: "Connect with residents, view profiles and projects",
		icon: <Users className="h-8 w-8 text-primary/80" />,
		href: "/community"
	},
	{
		title: "Events",
		description: "View upcoming events and house activities",
		icon: <Calendar className="h-8 w-8 text-primary/80" />,
		href: "/events"
	},
	{
		title: "Resources",
		description: "Book meeting rooms and house amenities",
		icon: <Building className="h-8 w-8 text-primary/80" />,
		href: "/resources"
	},
	{
		title: "Maintenance",
		description: "Submit and track maintenance requests",
		icon: <Wrench className="h-8 w-8 text-primary/80" />,
		href: "/maintenance"
	},
	{
		title: "Billing",
		description: "Manage payments, invoices, and payment methods",
		icon: <CreditCard className="h-8 w-8 text-primary/80" />,
		href: "/billing"
	},
];

export default function HouseDashboardPage() {
	const params = useParams();
	const houseId = params?.houseId as string;
	const [house, setHouse] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<any>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				// In a real app, fetch real house data
				const houseDataRaw = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/houses/${houseId}`);
				const houseData = await houseDataRaw.json();
				setHouse(houseData);

				// Get current user
				const supabase = createClient();
				const { data } = await supabase.auth.getUser();
				if (data.user) {
					setUser(data.user);
				}
			} catch (error) {
				console.error('Error loading dashboard data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [houseId]);

	if (loading) {
		return <div className="flex items-center justify-center h-96">Loading...</div>;
	}

	if (!house) {
		return <div className="text-center py-12">House not found</div>;
	}

	return (
		<div className="space-y-8">
			{/* House header with image */}
			<div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden">
				<div className="absolute inset-0 bg-black/50 z-10 flex items-end">
					<div className="p-6 text-white">
						<h1 className="text-3xl font-bold">{house.name}</h1>
						<div className="flex items-center mt-2">
							<MapPin className="h-4 w-4 mr-2" />
							<p>{house.address}</p>
						</div>
					</div>
				</div>
				<Image
					src={house.imageUrl}
					alt={house.name}
					fill
					className="object-cover"
				/>
			</div>

			{/* Dashboard navigation */}
			<div>
				<h2 className="text-xl font-semibold mb-4">Quick Access</h2>
				<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
					{navigationItems.map((item) => (
						<Card key={item.title} className="overflow-hidden hover:shadow-md transition-shadow">
							<Link href={`/dashboard/${houseId}${item.href}`} className="block h-full">
								<CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
									<div className="p-2 mb-2">{item.icon}</div>
									<CardTitle className="text-base">{item.title}</CardTitle>
								</CardContent>
							</Link>
						</Card>
					))}
				</div>
			</div>

			{/* House info section */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* House overview */}
				<Card>
					<CardHeader>
						<CardTitle>House Overview</CardTitle>
						<CardDescription>Basic information about your house</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">{house.description}</p>

						<div className="grid grid-cols-2 gap-3">
							<div className="bg-muted rounded-lg p-3">
								<p className="text-sm text-muted-foreground">Capacity</p>
								<p className="text-xl font-bold">{house.capacity} residents</p>
							</div>
							<div className="bg-muted rounded-lg p-3">
								<p className="text-sm text-muted-foreground">Occupancy</p>
								<p className="text-xl font-bold">{house.occupancy}/{house.capacity}</p>
							</div>
							<div className="bg-muted rounded-lg p-3">
								<p className="text-sm text-muted-foreground">Established</p>
								<p className="text-xl font-bold">{house.yearFounded}</p>
							</div>
							<div className="bg-muted rounded-lg p-3">
								<p className="text-sm text-muted-foreground">Size</p>
								<p className="text-xl font-bold">{house.squareFeet} sq ft</p>
							</div>
						</div>

						<h3 className="text-md font-medium mt-2">Amenities</h3>
						<div className="grid grid-cols-2 gap-2">
							{house.amenities.map((amenity, index) => {
								const Icon = amenity.icon;
								return (
									<div key={index} className="flex items-center space-x-2 p-2 border rounded-lg">
										<Icon className="h-4 w-4 text-primary" />
										<span className="text-sm">{amenity.name}</span>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>

				{/* House rules and contacts */}
				<div className="space-y-6">
					{/* House rules accordion */}
					<Card>
						<CardHeader>
							<CardTitle>House Rules</CardTitle>
							<CardDescription>Important guidelines for all residents</CardDescription>
						</CardHeader>
						<CardContent>
							<Accordion type="single" collapsible className="w-full">
								{house.houseRules.map((rule, index) => (
									<AccordionItem key={index} value={`rule-${index}`}>
										<AccordionTrigger className="text-sm font-medium">{rule.title}</AccordionTrigger>
										<AccordionContent className="text-sm text-muted-foreground">
											{rule.description}
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</CardContent>
					</Card>

					{/* Contact info */}
					<Card>
						<CardHeader>
							<CardTitle>Important Contacts</CardTitle>
							<CardDescription>Who to reach out to for assistance</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* House Manager */}
							<div className="flex items-center space-x-4 p-3 border rounded-lg">
								<Avatar className="h-12 w-12">
									<AvatarImage src={house.houseManager.imageUrl} />
									<AvatarFallback>{house.houseManager.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
								</Avatar>
								<div>
									<h3 className="font-medium">{house.houseManager.name}</h3>
									<p className="text-sm text-muted-foreground">{house.houseManager.role}</p>
									<div className="flex items-center mt-1 text-sm">
										<Phone className="h-3 w-3 mr-1 text-muted-foreground" />
										<span>{house.houseManager.phone}</span>
									</div>
								</div>
							</div>

							{/* Emergency contacts */}
							<h3 className="text-sm font-medium">Emergency Contacts</h3>
							<div className="space-y-2">
								{house.emergencyContacts.map((contact, index) => (
									<div key={index} className="flex justify-between items-center p-2 border rounded-lg">
										<p className="text-sm">{contact.name}</p>
										<p className="text-sm font-mono">{contact.phone}</p>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* FAQ Section */}
			<Card>
				<CardHeader>
					<CardTitle>Frequently Asked Questions</CardTitle>
					<CardDescription>Common questions about living at {house.name}</CardDescription>
				</CardHeader>
				<CardContent>
					<Accordion type="single" collapsible className="w-full">
						{house.faqs.map((faq, index) => (
							<AccordionItem key={index} value={`faq-${index}`}>
								<AccordionTrigger>{faq.question}</AccordionTrigger>
								<AccordionContent>{faq.answer}</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</CardContent>
			</Card>
		</div>
	);
} 