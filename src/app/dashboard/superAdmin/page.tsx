"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Building, CalendarDays, DollarSign, Users } from "lucide-react";

export default function SuperAdminPage() {
	return (
		<div className="space-y-8">
			<div>
				<h2 className="text-3xl font-bold tracking-tight">Platform Dashboard</h2>
				<p className="text-muted-foreground mt-2">
					Welcome to the Accelr8 Super Admin Dashboard - Global platform management
				</p>
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
						<div className="text-2xl font-bold">4</div>
						<p className="text-xs text-muted-foreground">
							+1 from last month
						</p>
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
						<div className="text-2xl font-bold">42</div>
						<p className="text-xs text-muted-foreground">
							93% occupancy rate
						</p>
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
						<div className="text-2xl font-bold">+12</div>
						<p className="text-xs text-muted-foreground">
							5 awaiting review
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Revenue
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">$45,231</div>
						<p className="text-xs text-muted-foreground">
							+2.5% from last month
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>Platform Health</CardTitle>
						<CardDescription>
							Overview of system performance and issues
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="h-[200px] flex items-center justify-center border rounded">
							<p className="text-muted-foreground">Performance chart will appear here</p>
						</div>
					</CardContent>
					<CardFooter>
						<Button variant="outline">View detailed reports</Button>
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
						<div className="space-y-4">
							<div className="flex items-start gap-4">
								<Bell className="h-5 w-5 mt-0.5 text-amber-500" />
								<div>
									<p className="text-sm font-medium">Database backup warning</p>
									<p className="text-xs text-muted-foreground">2 hours ago</p>
								</div>
							</div>
							<div className="flex items-start gap-4">
								<Bell className="h-5 w-5 mt-0.5 text-red-500" />
								<div>
									<p className="text-sm font-medium">Payment processing error</p>
									<p className="text-xs text-muted-foreground">5 hours ago</p>
								</div>
							</div>
							<div className="flex items-start gap-4">
								<Bell className="h-5 w-5 mt-0.5 text-green-500" />
								<div>
									<p className="text-sm font-medium">System update completed</p>
									<p className="text-xs text-muted-foreground">1 day ago</p>
								</div>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button variant="outline">View all alerts</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
} 