"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import {
	Activity,
	Calendar,
	DollarSign,
	Download,
	LineChart,
	TrendingDown,
	TrendingUp,
	Users
} from "lucide-react";
import { useParams } from "next/navigation";

export default function HouseAnalyticsPage() {
	const params = useParams();
	const houseId = params.houseId as string;

	// Mock analytics data
	const monthlyOccupancy = [
		{ month: "Jan", value: 85 },
		{ month: "Feb", value: 90 },
		{ month: "Mar", value: 92 },
		{ month: "Apr", value: 95 },
		{ month: "May", value: 90 },
		{ month: "Jun", value: 88 },
		{ month: "Jul", value: 89 },
		{ month: "Aug", value: 91 },
	];

	const communityMetrics = {
		events: {
			total: 28,
			avgAttendance: 76,
			trend: "+12%"
		},
		residentStay: {
			avgLength: 8.5,
			renewalRate: 65,
			trend: "+5%"
		},
		satisfaction: {
			overall: 88,
			facilities: 85,
			community: 92,
			trend: "+3%"
		}
	};

	const financialMetrics = {
		revenue: {
			monthly: 48000,
			trend: "+8%",
			perBed: 2400
		},
		expenses: {
			monthly: 28000,
			trend: "+2%",
			largestCategory: "Maintenance"
		},
		profitability: {
			margin: 41.7,
			trend: "+6%"
		}
	};

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">House Analytics</h1>
						<p className="text-muted-foreground">
							Performance metrics for {houseId.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}
						</p>
					</div>

					<div className="flex gap-2">
						<Button variant="outline">
							<Calendar className="mr-2 h-4 w-4" />
							Last 30 Days
						</Button>
						<Button variant="outline">
							<Download className="mr-2 h-4 w-4" />
							Export
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Current Occupancy</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">91%</div>
							<div className="flex items-center text-xs text-muted-foreground">
								<TrendingUp className="mr-1 h-3 w-3 text-green-500" />
								<span className="text-green-500 font-medium">+2.5%</span>
								<span className="ml-1">from last month</span>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Avg. Stay Length</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{communityMetrics.residentStay.avgLength} months</div>
							<div className="flex items-center text-xs text-muted-foreground">
								<TrendingUp className="mr-1 h-3 w-3 text-green-500" />
								<span className="text-green-500 font-medium">{communityMetrics.residentStay.trend}</span>
								<span className="ml-1">from last quarter</span>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">${financialMetrics.revenue.monthly.toLocaleString()}</div>
							<div className="flex items-center text-xs text-muted-foreground">
								<TrendingUp className="mr-1 h-3 w-3 text-green-500" />
								<span className="text-green-500 font-medium">{financialMetrics.revenue.trend}</span>
								<span className="ml-1">from last month</span>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">Resident Satisfaction</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{communityMetrics.satisfaction.overall}%</div>
							<div className="flex items-center text-xs text-muted-foreground">
								<TrendingUp className="mr-1 h-3 w-3 text-green-500" />
								<span className="text-green-500 font-medium">{communityMetrics.satisfaction.trend}</span>
								<span className="ml-1">from last survey</span>
							</div>
						</CardContent>
					</Card>
				</div>

				<Tabs defaultValue="occupancy" className="w-full">
					<TabsList className="grid w-full grid-cols-3 mb-4">
						<TabsTrigger value="occupancy">Occupancy</TabsTrigger>
						<TabsTrigger value="community">Community</TabsTrigger>
						<TabsTrigger value="financial">Financial</TabsTrigger>
					</TabsList>

					<TabsContent value="occupancy">
						<div className="grid gap-6 md:grid-cols-2">
							<Card className="col-span-2">
								<CardHeader>
									<CardTitle>Occupancy Trends</CardTitle>
									<CardDescription>
										Monthly occupancy rate over time
									</CardDescription>
								</CardHeader>
								<CardContent className="h-[300px] flex items-center justify-center">
									<div className="w-full h-full flex flex-col justify-center items-center text-muted-foreground">
										<LineChart className="h-16 w-16 mb-2" />
										<p>Occupancy Rate Chart Visualization</p>
										<p className="text-sm">(Would be a real chart in production)</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Room Type Breakdown</CardTitle>
									<CardDescription>
										Occupancy by room type
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div>
											<div className="flex justify-between mb-1">
												<span className="text-sm font-medium">Private Rooms</span>
												<span className="text-sm font-medium">95%</span>
											</div>
											<div className="w-full bg-muted rounded-full h-2.5">
												<div className="bg-primary h-2.5 rounded-full" style={{ width: "95%" }}></div>
											</div>
										</div>
										<div>
											<div className="flex justify-between mb-1">
												<span className="text-sm font-medium">Shared Rooms</span>
												<span className="text-sm font-medium">87%</span>
											</div>
											<div className="w-full bg-muted rounded-full h-2.5">
												<div className="bg-primary h-2.5 rounded-full" style={{ width: "87%" }}></div>
											</div>
										</div>
										<div>
											<div className="flex justify-between mb-1">
												<span className="text-sm font-medium">Premium Suites</span>
												<span className="text-sm font-medium">100%</span>
											</div>
											<div className="w-full bg-muted rounded-full h-2.5">
												<div className="bg-primary h-2.5 rounded-full" style={{ width: "100%" }}></div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Resident Movement</CardTitle>
									<CardDescription>
										Move-ins and move-outs
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex justify-between items-center">
											<div>
												<p className="text-sm font-medium text-muted-foreground">Move-ins (30 Days)</p>
												<p className="text-2xl font-bold">4</p>
											</div>
											<div className="rounded-full bg-green-100 p-2">
												<Users className="h-5 w-5 text-green-600" />
											</div>
										</div>

										<div className="flex justify-between items-center">
											<div>
												<p className="text-sm font-medium text-muted-foreground">Move-outs (30 Days)</p>
												<p className="text-2xl font-bold">2</p>
											</div>
											<div className="rounded-full bg-red-100 p-2">
												<Users className="h-5 w-5 text-red-600" />
											</div>
										</div>

										<div className="flex justify-between items-center">
											<div>
												<p className="text-sm font-medium text-muted-foreground">Net Change</p>
												<p className="text-2xl font-bold">+2</p>
											</div>
											<div className="rounded-full bg-blue-100 p-2">
												<Activity className="h-5 w-5 text-blue-600" />
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="community">
						<div className="grid gap-6 md:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle>Event Engagement</CardTitle>
									<CardDescription>
										Resident participation in house events
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex justify-between items-center">
											<div>
												<p className="text-sm font-medium text-muted-foreground">Total Events (30 Days)</p>
												<p className="text-2xl font-bold">{communityMetrics.events.total}</p>
											</div>
											<div className="rounded-full bg-purple-100 p-2">
												<Calendar className="h-5 w-5 text-purple-600" />
											</div>
										</div>

										<div className="flex justify-between items-center">
											<div>
												<p className="text-sm font-medium text-muted-foreground">Avg. Attendance Rate</p>
												<p className="text-2xl font-bold">{communityMetrics.events.avgAttendance}%</p>
											</div>
											<div className="flex items-center text-xs">
												<TrendingUp className="mr-1 h-3 w-3 text-green-500" />
												<span className="text-green-500 font-medium">{communityMetrics.events.trend}</span>
											</div>
										</div>

										<div>
											<div className="flex justify-between mb-1">
												<span className="text-sm font-medium">Social Events</span>
												<span className="text-sm font-medium">85%</span>
											</div>
											<div className="w-full bg-muted rounded-full h-2.5">
												<div className="bg-purple-500 h-2.5 rounded-full" style={{ width: "85%" }}></div>
											</div>
										</div>

										<div>
											<div className="flex justify-between mb-1">
												<span className="text-sm font-medium">Professional Events</span>
												<span className="text-sm font-medium">92%</span>
											</div>
											<div className="w-full bg-muted rounded-full h-2.5">
												<div className="bg-purple-500 h-2.5 rounded-full" style={{ width: "92%" }}></div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Resident Satisfaction</CardTitle>
									<CardDescription>
										Survey results across key areas
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div>
											<div className="flex justify-between mb-1">
												<span className="text-sm font-medium">Overall Experience</span>
												<span className="text-sm font-medium">{communityMetrics.satisfaction.overall}%</span>
											</div>
											<div className="w-full bg-muted rounded-full h-2.5">
												<div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${communityMetrics.satisfaction.overall}%` }}></div>
											</div>
										</div>

										<div>
											<div className="flex justify-between mb-1">
												<span className="text-sm font-medium">Facilities & Amenities</span>
												<span className="text-sm font-medium">{communityMetrics.satisfaction.facilities}%</span>
											</div>
											<div className="w-full bg-muted rounded-full h-2.5">
												<div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${communityMetrics.satisfaction.facilities}%` }}></div>
											</div>
										</div>

										<div>
											<div className="flex justify-between mb-1">
												<span className="text-sm font-medium">Community Atmosphere</span>
												<span className="text-sm font-medium">{communityMetrics.satisfaction.community}%</span>
											</div>
											<div className="w-full bg-muted rounded-full h-2.5">
												<div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${communityMetrics.satisfaction.community}%` }}></div>
											</div>
										</div>

										<div className="flex justify-between items-center pt-2">
											<div>
												<p className="text-sm font-medium text-muted-foreground">Renewal Rate</p>
												<p className="text-2xl font-bold">{communityMetrics.residentStay.renewalRate}%</p>
											</div>
											<div className="flex items-center text-xs">
												<TrendingUp className="mr-1 h-3 w-3 text-green-500" />
												<span className="text-green-500 font-medium">{communityMetrics.residentStay.trend}</span>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className="col-span-2">
								<CardHeader>
									<CardTitle>Resident Demographics</CardTitle>
									<CardDescription>
										Breakdown of current resident population
									</CardDescription>
								</CardHeader>
								<CardContent className="h-[250px] flex items-center justify-center">
									<div className="w-full h-full flex flex-col justify-center items-center text-muted-foreground">
										<Users className="h-16 w-16 mb-2" />
										<p>Resident Demographics Visualization</p>
										<p className="text-sm">(Would be a real chart in production)</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="financial">
						<div className="grid gap-6 md:grid-cols-2">
							<Card className="col-span-2">
								<CardHeader>
									<CardTitle>Revenue & Expenses</CardTitle>
									<CardDescription>
										Monthly financial performance
									</CardDescription>
								</CardHeader>
								<CardContent className="h-[300px] flex items-center justify-center">
									<div className="w-full h-full flex flex-col justify-center items-center text-muted-foreground">
										<LineChart className="h-16 w-16 mb-2" />
										<p>Revenue & Expenses Chart Visualization</p>
										<p className="text-sm">(Would be a real chart in production)</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Revenue Metrics</CardTitle>
									<CardDescription>
										Key financial indicators
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex justify-between items-center">
											<div>
												<p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
												<p className="text-2xl font-bold">${financialMetrics.revenue.monthly.toLocaleString()}</p>
											</div>
											<div className="flex items-center text-xs">
												<TrendingUp className="mr-1 h-3 w-3 text-green-500" />
												<span className="text-green-500 font-medium">{financialMetrics.revenue.trend}</span>
											</div>
										</div>

										<div className="flex justify-between items-center">
											<div>
												<p className="text-sm font-medium text-muted-foreground">Revenue per Bed</p>
												<p className="text-2xl font-bold">${financialMetrics.revenue.perBed.toLocaleString()}</p>
											</div>
											<div className="rounded-full bg-green-100 p-2">
												<DollarSign className="h-5 w-5 text-green-600" />
											</div>
										</div>

										<div className="flex justify-between items-center">
											<div>
												<p className="text-sm font-medium text-muted-foreground">Profit Margin</p>
												<p className="text-2xl font-bold">{financialMetrics.profitability.margin}%</p>
											</div>
											<div className="flex items-center text-xs">
												<TrendingUp className="mr-1 h-3 w-3 text-green-500" />
												<span className="text-green-500 font-medium">{financialMetrics.profitability.trend}</span>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Expense Breakdown</CardTitle>
									<CardDescription>
										Monthly operating costs
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex justify-between items-center">
											<div>
												<p className="text-sm font-medium text-muted-foreground">Monthly Expenses</p>
												<p className="text-2xl font-bold">${financialMetrics.expenses.monthly.toLocaleString()}</p>
											</div>
											<div className="flex items-center text-xs">
												<TrendingDown className="mr-1 h-3 w-3 text-red-500" />
												<span className="text-red-500 font-medium">{financialMetrics.expenses.trend}</span>
											</div>
										</div>

										<div>
											<div className="flex justify-between mb-1">
												<span className="text-sm font-medium">Maintenance</span>
												<span className="text-sm font-medium">40%</span>
											</div>
											<div className="w-full bg-muted rounded-full h-2.5">
												<div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "40%" }}></div>
											</div>
										</div>

										<div>
											<div className="flex justify-between mb-1">
												<span className="text-sm font-medium">Utilities</span>
												<span className="text-sm font-medium">25%</span>
											</div>
											<div className="w-full bg-muted rounded-full h-2.5">
												<div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "25%" }}></div>
											</div>
										</div>

										<div>
											<div className="flex justify-between mb-1">
												<span className="text-sm font-medium">Staff</span>
												<span className="text-sm font-medium">20%</span>
											</div>
											<div className="w-full bg-muted rounded-full h-2.5">
												<div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "20%" }}></div>
											</div>
										</div>

										<div>
											<div className="flex justify-between mb-1">
												<span className="text-sm font-medium">Other</span>
												<span className="text-sm font-medium">15%</span>
											</div>
											<div className="w-full bg-muted rounded-full h-2.5">
												<div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "15%" }}></div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</AdminLayout>
	);
} 