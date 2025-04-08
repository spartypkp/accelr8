"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getApplications } from "@/lib/api/applications";
import { getHouses } from "@/lib/api/houses";
import { EnhancedApplication } from "@/lib/enhancers/applications";
import { ApplicationStatus, House } from "@/lib/types";
import { ArrowRight, ClipboardList, PieChart, Settings, UserCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPage() {
	const [houses, setHouses] = useState<House[]>([]);
	const [applications, setApplications] = useState<EnhancedApplication[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch houses and applications from API
	useEffect(() => {
		async function fetchData() {
			try {
				const [housesData, applicationsData] = await Promise.all([
					getHouses(),
					getApplications({ status: ApplicationStatus.Submitted })
				]);
				setHouses(housesData);
				setApplications(applicationsData);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchData();
	}, []);

	// Calculate house metrics
	const totalResidents = houses.reduce((sum, house) => sum + (house.current_occupancy || 0), 0);
	const averageOccupancy = houses.length > 0
		? Math.round(houses.reduce((sum, house) => {
			const capacity = house.sanityHouse?.capacity || 0;
			const occupancyRate = capacity > 0
				? (house.current_occupancy / capacity) * 100
				: 0;
			return sum + occupancyRate;
		}, 0) / houses.length)
		: 0;

	// Houses with alerts (could be based on various criteria)
	const housesWithAlerts = houses.filter(house =>
		house.status === 'closed' ||
		(house.sanityHouse?.capacity && house.current_occupancy >= house.sanityHouse.capacity)
	);

	// Count pending applications by status
	const pendingApplications = applications.length;

	return (
		<AdminLayout>
			<div className="space-y-8">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tight">Organization Dashboard</h1>
					<p className="text-muted-foreground">Manage all Accelr8 houses from one central location</p>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Total Houses</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{houses.length}</div>
							<p className="text-xs text-muted-foreground">
								{isLoading ? "Loading..." : `Across ${houses.length} locations`}
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Total Residents</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{isLoading ? "..." : totalResidents}
							</div>
							<p className="text-xs text-muted-foreground">
								Active community members
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Average Occupancy</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{isLoading ? "..." : `${averageOccupancy}%`}
							</div>
							<p className="text-xs text-muted-foreground">
								Across all properties
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">
								Pending Applications
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{isLoading ? "..." : pendingApplications}
							</div>
							<p className="text-xs text-muted-foreground">
								Awaiting review
							</p>
						</CardContent>
					</Card>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>All Houses</CardTitle>
							<CardDescription>
								Manage individual houses or add a new location
							</CardDescription>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<div className="py-6 text-center text-muted-foreground">Loading houses...</div>
							) : houses.length === 0 ? (
								<div className="py-6 text-center text-muted-foreground">
									No houses found. Add your first house to get started.
								</div>
							) : (
								<div className="space-y-4">
									{houses.map((house) => (
										<div
											key={house.id}
											className="flex items-center justify-between rounded-lg border p-4"
										>
											<div className="space-y-1">
												<h3 className="font-medium">{house.sanityHouse?.name || "Unnamed House"}</h3>
												<p className="text-sm text-muted-foreground">
													{house.current_occupancy} residents
													{house.sanityHouse?.capacity ?
														` (${Math.round((house.current_occupancy / house.sanityHouse.capacity) * 100)}% occupied)` :
														''}
												</p>
											</div>
											<div className="flex items-center gap-2">
												{house.status === 'closed' && (
													<span className="flex h-2 w-2 rounded-full bg-red-500" title="House is closed"></span>
												)}
												<Button asChild variant="outline" size="sm">
													<Link href={`/dashboard/${house.sanityHouse?.slug?.current}/admin`}>
														Manage <ArrowRight className="ml-2 h-4 w-4" />
													</Link>
												</Button>
											</div>
										</div>
									))}
								</div>
							)}
							<div className="mt-6">
								<Button asChild>
									<Link href="/superAdmin/expansion">
										Add New House
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Applications Management</CardTitle>
							<CardDescription>
								Review and process applicants for Accelr8 houses
							</CardDescription>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<div className="py-6 text-center text-muted-foreground">Loading applications...</div>
							) : applications.length === 0 ? (
								<div className="py-6 text-center text-muted-foreground">
									No pending applications at this time.
								</div>
							) : (
								<div className="space-y-4">
									{applications.slice(0, 3).map((application) => (
										<div
											key={application.id}
											className="flex items-center justify-between rounded-lg border p-4"
										>
											<div className="space-y-1">
												<h3 className="font-medium">{application.name}</h3>
												<p className="text-sm text-muted-foreground">
													Applied: {new Date(application.submitted_at || application.created_at).toLocaleDateString()}
													{application.preferred_move_in && ` • Preferred move-in: ${new Date(application.preferred_move_in).toLocaleDateString()}`}
												</p>
											</div>
											<Button asChild variant="outline" size="sm">
												<Link href={`/superAdmin/applications/${application.id}`}>
													Review <ArrowRight className="ml-2 h-4 w-4" />
												</Link>
											</Button>
										</div>
									))}
									{applications.length > 3 && (
										<div className="text-center text-sm text-muted-foreground">
											+{applications.length - 3} more applications
										</div>
									)}
								</div>
							)}
							<div className="mt-6">
								<Button asChild>
									<Link href="/superAdmin/applications">
										View All Applications
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					<Card>
						<CardHeader>
							<CardTitle>Organization Management</CardTitle>
							<CardDescription>
								Manage global settings and analytics
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<Button asChild variant="outline" className="w-full justify-start">
									<Link href="/admin/analytics">
										<PieChart className="mr-2 h-4 w-4" />
										Global Analytics
									</Link>
								</Button>
								<Button asChild variant="outline" className="w-full justify-start">
									<Link href="/superAdmin/applications">
										<ClipboardList className="mr-2 h-4 w-4" />
										Application Management
									</Link>
								</Button>
								<Button asChild variant="outline" className="w-full justify-start">
									<Link href="/superAdmin/residents">
										<UserCheck className="mr-2 h-4 w-4" />
										Resident Management
									</Link>
								</Button>
								<Button asChild variant="outline" className="w-full justify-start">
									<Link href="/admin/settings">
										<Settings className="mr-2 h-4 w-4" />
										Organization Settings
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</AdminLayout>
	);
} 