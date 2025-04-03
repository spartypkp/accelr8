"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, PieChart, Settings } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
	// Mock data for houses - would come from database in production
	const houses = [
		{ id: "sf-nob-hill", name: "San Francisco - Nob Hill", residents: 18, occupancy: 90, alert: false },
		{ id: "nyc-brooklyn", name: "New York - Brooklyn", residents: 15, occupancy: 75, alert: true },
		{ id: "austin-downtown", name: "Austin - Downtown", residents: 12, occupancy: 60, alert: false },
	];

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
								Across {houses.length} cities
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Total Residents</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{houses.reduce((sum, house) => sum + house.residents, 0)}
							</div>
							<p className="text-xs text-muted-foreground">
								+5 from last month
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Average Occupancy</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{Math.round(
									houses.reduce((sum, house) => sum + house.occupancy, 0) / houses.length
								)}%
							</div>
							<p className="text-xs text-muted-foreground">
								+2% from last month
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">
								Houses with Alerts
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{houses.filter(house => house.alert).length}
							</div>
							<p className="text-xs text-muted-foreground">
								Requires attention
							</p>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>All Houses</CardTitle>
						<CardDescription>
							Manage individual houses or add a new location
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{houses.map((house) => (
								<div
									key={house.id}
									className="flex items-center justify-between rounded-lg border p-4"
								>
									<div className="space-y-1">
										<h3 className="font-medium">{house.name}</h3>
										<p className="text-sm text-muted-foreground">
											{house.residents} residents ({house.occupancy}% occupied)
										</p>
									</div>
									<div className="flex items-center gap-2">
										{house.alert && (
											<span className="flex h-2 w-2 rounded-full bg-red-500"></span>
										)}
										<Button asChild variant="outline" size="sm">
											<Link href={`/admin/${house.id}`}>
												Manage <ArrowRight className="ml-2 h-4 w-4" />
											</Link>
										</Button>
									</div>
								</div>
							))}
						</div>
						<div className="mt-6">
							<Button asChild>
								<Link href="/admin/expansion">
									Add New House
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>

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