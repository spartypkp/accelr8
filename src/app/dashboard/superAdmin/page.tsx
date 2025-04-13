"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getApplications } from "@/lib/api/applications";
import { getHouses } from "@/lib/api/houses";
import { getUsers } from "@/lib/api/users";
import { House } from "@/lib/types";
import { Bell, Building, CalendarDays, DollarSign, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PlatformStats {
	totalHouses: number;
	activeResidents: number;
	newApplications: number;
	pendingApplications: number;
}

export default function SuperAdminPage() {
	const [stats, setStats] = useState<PlatformStats>({
		totalHouses: 0,
		activeResidents: 0,
		newApplications: 0,
		pendingApplications: 0,
	});
	const [houses, setHouses] = useState<House[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadData() {
			setIsLoading(true);
			setError(null);

			try {
				// Load houses, users and applications in parallel
				const [houses, users, applications] = await Promise.all([
					getHouses(),
					getUsers({ role: 'resident' }),
					getApplications({
						fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // last 30 days
					})
				]);

				// Calculate stats
				const activeHouses = houses.filter(house => house.status === 'open');
				const pendingApps = applications.filter(app =>
					app.status === 'submitted' ||
					app.status === 'reviewing' ||
					app.status === 'interview_scheduled'
				);

				setHouses(houses);
				setStats({
					totalHouses: houses.length,
					activeResidents: users.length,
					newApplications: applications.length,
					pendingApplications: pendingApps.length
				});
			} catch (err) {
				console.error("Error loading dashboard data:", err);
				setError("Failed to load dashboard data. Please try again.");
			} finally {
				setIsLoading(false);
			}
		}

		loadData();
	}, []);

	// Get occupancy rate across all houses
	const calculateOccupancyRate = () => {
		if (houses.length === 0) return 0;

		const totalCapacity = houses.reduce((sum, house) => sum + (house.sanityHouse?.capacity || 0), 0);
		const totalOccupancy = houses.reduce((sum, house) => sum + (house.current_occupancy || 0), 0);

		if (totalCapacity === 0) return 0;
		return Math.round((totalOccupancy / totalCapacity) * 100);
	};

	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Platform Dashboard</h2>
					<p className="text-muted-foreground mt-2">
						Welcome to the Accelr8 Super Admin Dashboard - Global platform management
					</p>
				</div>
				<div>
					<Button asChild>
						<Link href="/dashboard/superAdmin/expansion">
							Create New House
						</Link>
					</Button>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Houses
						</CardTitle>
						<Building className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-20" />
						) : (
							<>
								<div className="text-2xl font-bold">{stats.totalHouses}</div>
								<p className="text-xs text-muted-foreground">
									{houses.filter(h => h.status === 'open').length} currently active
								</p>
							</>
						)}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Residents
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-20" />
						) : (
							<>
								<div className="text-2xl font-bold">{stats.activeResidents}</div>
								<p className="text-xs text-muted-foreground">
									{calculateOccupancyRate()}% occupancy rate
								</p>
							</>
						)}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							New Applications
						</CardTitle>
						<CalendarDays className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-20" />
						) : (
							<>
								<div className="text-2xl font-bold">+{stats.newApplications}</div>
								<p className="text-xs text-muted-foreground">
									{stats.pendingApplications} awaiting review
								</p>
							</>
						)}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							House Overview
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-20" />
						) : (
							<>
								<div className="text-2xl font-bold">{houses.length}</div>
								<p className="text-xs text-muted-foreground">
									View all properties
								</p>
							</>
						)}
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>House Status</CardTitle>
						<CardDescription>
							Overview of all properties and their current status
						</CardDescription>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="space-y-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
							</div>
						) : error ? (
							<div className="py-8 text-center text-muted-foreground">
								{error}
							</div>
						) : houses.length === 0 ? (
							<div className="py-8 text-center text-muted-foreground">
								No houses found. Create your first house to get started.
							</div>
						) : (
							<div className="space-y-4">
								{houses.map((house) => (
									<div key={house.id} className="flex items-center justify-between border-b pb-2">
										<div>
											<div className="font-medium">{house.sanityHouse?.name || 'Unnamed House'}</div>
											<div className="text-sm text-muted-foreground">
												{house.sanityHouse?.location?.city}, {house.sanityHouse?.location?.state}
											</div>
										</div>
										<div className="flex items-center gap-4">
											<div className="text-sm">
												<span className="font-medium">{house.current_occupancy}</span>
												<span className="text-muted-foreground">/{house.sanityHouse?.capacity || 0}</span>
											</div>
											<Button variant="outline" size="sm" asChild>
												<Link href={`/dashboard/${house.id}/admin`}>
													Manage
												</Link>
											</Button>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
					<CardFooter>
						<Button variant="outline" asChild>
							<Link href="/dashboard/superAdmin/houses">View all houses</Link>
						</Button>
					</CardFooter>
				</Card>
				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Recent Alerts</CardTitle>
						<CardDescription>
							System notifications requiring attention
						</CardDescription>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="space-y-4">
								<Skeleton className="h-12 w-full" />
								<Skeleton className="h-12 w-full" />
								<Skeleton className="h-12 w-full" />
							</div>
						) : (
							<div className="space-y-4">
								{stats.pendingApplications > 0 && (
									<div className="flex items-start gap-4">
										<Bell className="h-5 w-5 mt-0.5 text-amber-500" />
										<div>
											<p className="text-sm font-medium">{stats.pendingApplications} applications need review</p>
											<p className="text-xs text-muted-foreground">Review pending applications</p>
										</div>
									</div>
								)}

								{houses.filter(h => h.status === 'open' && h.current_occupancy === 0).length > 0 && (
									<div className="flex items-start gap-4">
										<Bell className="h-5 w-5 mt-0.5 text-red-500" />
										<div>
											<p className="text-sm font-medium">Empty houses detected</p>
											<p className="text-xs text-muted-foreground">
												{houses.filter(h => h.status === 'open' && h.current_occupancy === 0).length} houses have no residents
											</p>
										</div>
									</div>
								)}

								{houses.length === 0 && (
									<div className="flex items-start gap-4">
										<Bell className="h-5 w-5 mt-0.5 text-green-500" />
										<div>
											<p className="text-sm font-medium">Create your first house</p>
											<p className="text-xs text-muted-foreground">Get started with Accelr8</p>
										</div>
									</div>
								)}

								{houses.length > 0 && stats.pendingApplications === 0 && !houses.some(h => h.status === 'open' && h.current_occupancy === 0) && (
									<div className="flex items-start gap-4">
										<Bell className="h-5 w-5 mt-0.5 text-green-500" />
										<div>
											<p className="text-sm font-medium">All systems operational</p>
											<p className="text-xs text-muted-foreground">No urgent issues detected</p>
										</div>
									</div>
								)}
							</div>
						)}
					</CardContent>
					<CardFooter>
						<Button variant="outline" asChild>
							<Link href="/dashboard/superAdmin/applications">View applications</Link>
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
} 