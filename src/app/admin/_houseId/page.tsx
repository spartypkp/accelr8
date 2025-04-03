"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, MessageSquare, PieChart, Users, Wrench } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function HouseAdminPage() {
	const params = useParams();
	const houseId = params.houseId as string;

	// Mock data for the house - would come from database in production
	const house = {
		id: houseId,
		name: houseId === "sf-nob-hill"
			? "San Francisco - Nob Hill"
			: houseId === "nyc-brooklyn"
				? "New York - Brooklyn"
				: "Austin - Downtown",
		residents: {
			total: 18,
			capacity: 20,
			moveIns: 2,
			moveOuts: 1
		},
		maintenance: {
			open: 3,
			inProgress: 2,
			completed: 15
		},
		events: {
			upcoming: 4,
			thisMonth: 8
		},
		finances: {
			occupancyRate: 90,
			outstandingPayments: 2,
			revenueThisMonth: 24000
		}
	};

	return (
		<AdminLayout>
			<div className="space-y-8">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tight">{house.name} Admin</h1>
					<p className="text-muted-foreground">
						Manage all aspects of the {house.name} house
					</p>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Occupancy</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{house.residents.total}/{house.residents.capacity}
							</div>
							<p className="text-xs text-muted-foreground">
								{Math.round((house.residents.total / house.residents.capacity) * 100)}% occupied
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Open Maintenance</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{house.maintenance.open}</div>
							<p className="text-xs text-muted-foreground">
								{house.maintenance.inProgress} in progress
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{house.events.upcoming}</div>
							<p className="text-xs text-muted-foreground">
								{house.events.thisMonth} this month
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">
								Outstanding Payments
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{house.finances.outstandingPayments}
							</div>
							<p className="text-xs text-muted-foreground">
								${house.finances.outstandingPayments * 1200} total
							</p>
						</CardContent>
					</Card>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					<Card>
						<CardHeader>
							<CardTitle>House Management</CardTitle>
							<CardDescription>
								Manage residents, operations, and events
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<Button asChild variant="outline" className="w-full justify-start">
									<Link href={`/admin/${houseId}/residents`}>
										<Users className="mr-2 h-4 w-4" />
										Resident Management
									</Link>
								</Button>
								<Button asChild variant="outline" className="w-full justify-start">
									<Link href={`/admin/${houseId}/operations`}>
										<Wrench className="mr-2 h-4 w-4" />
										Operations Management
									</Link>
								</Button>
								<Button asChild variant="outline" className="w-full justify-start">
									<Link href={`/admin/${houseId}/events`}>
										<Calendar className="mr-2 h-4 w-4" />
										Events Management
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Reporting</CardTitle>
							<CardDescription>
								Access analytics and financial information
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<Button asChild variant="outline" className="w-full justify-start">
									<Link href={`/admin/${houseId}/analytics`}>
										<PieChart className="mr-2 h-4 w-4" />
										House Analytics
									</Link>
								</Button>
								<Button asChild variant="outline" className="w-full justify-start">
									<Link href={`/admin/${houseId}/finances`}>
										<DollarSign className="mr-2 h-4 w-4" />
										Financial Management
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Communication</CardTitle>
							<CardDescription>
								Manage announcements and resident communication
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<Button asChild variant="outline" className="w-full justify-start">
									<Link href={`/admin/${houseId}/communication`}>
										<MessageSquare className="mr-2 h-4 w-4" />
										Communication Tools
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
						<CardDescription>
							Recent events and actions at {house.name}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{[
								{ action: "New resident moved in", date: "Today", user: "Admin" },
								{ action: "Maintenance request resolved", date: "Yesterday", user: "Facilities" },
								{ action: "New event scheduled", date: "2 days ago", user: "Community Manager" },
								{ action: "Payment received", date: "3 days ago", user: "Billing" },
							].map((activity, index) => (
								<div key={index} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
									<div>
										<p className="font-medium">{activity.action}</p>
										<p className="text-sm text-muted-foreground">By: {activity.user}</p>
									</div>
									<div className="text-sm text-muted-foreground">{activity.date}</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</AdminLayout>
	);
} 